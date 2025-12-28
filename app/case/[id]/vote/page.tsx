"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Case } from "@/lib/caseLoader";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string || "001";
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    
    fetch(`/api/case?id=${caseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error || data.caseState !== 'voting') {
          router.push(`/case/${caseId}`);
          return;
        }
        setCaseData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push(`/case/${caseId}`);
      });
  }, [caseId, router]);

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return <VotingInterface caseId={caseId} caseData={caseData} />;
}

function VotingInterface({ caseId, caseData }: { caseId: string; caseData: Case }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (option: string) => {
    if (submitting) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: `case_${caseId}`, option }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      }

      if (data.alreadyVoted) {
        setError("Your vote has already been recorded.");
        setSubmitting(false);
        return;
      }

      // Store vote in localStorage for result page
      if (typeof window !== 'undefined') {
        localStorage.setItem(`vote_${caseId}`, option);
      }

      setSelected(option);
      setTimeout(() => {
        router.push(`/case/${caseId}/result`);
      }, 2000);
    } catch (err) {
      setError("Failed to submit vote. Please try again.");
      setSubmitting(false);
    }
  };

  if (selected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <div className="text-center space-y-4">
          <p className="text-gray-300">Your vote has been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-light text-white mb-4">
            {caseData.vote_question}
          </h1>
        </div>
        {error && (
          <div className="border border-white/20 p-4 text-center">
            <p className="text-gray-300">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {caseData.options.map((option) => (
            <button
              key={option}
              onClick={() => handleVote(option)}
              disabled={submitting}
              className="w-full p-4 border border-white/20 text-left hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-light">Suspect {option}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {caseData.suspects[option]}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

