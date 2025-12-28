"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Case } from "@/lib/caseLoader";

export default function CasePage() {
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
        if (data.error) {
          router.push("/");
          return;
        }
        setCaseData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/");
      });
  }, [caseId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Case not found.</p>
      </div>
    );
  }

  const overviewLines = caseData.overview.split('\n');

  // Render based on caseState
  switch (caseData.caseState) {
    case 'intro':
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-8">
          <div className="text-center space-y-6 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-light text-white">
              {caseData.title}
            </h1>
            <p className="text-gray-400">
              The case is being prepared.
            </p>
          </div>
        </div>
      );

    case 'overview':
      return (
        <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-5xl font-light text-white">
                {caseData.title}
              </h1>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-8">
              {overviewLines.map((line, index) => (
                <p key={index} className="text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            <div className="text-sm text-gray-500 space-y-1 border-t border-white/10 pt-4">
              <p>{caseData.metadata.time_window}</p>
              <p>{caseData.metadata.location}</p>
            </div>
            <div className="flex justify-center pt-8">
              <button
                onClick={() => {
                  if (caseData.caseState === 'evidence' || caseData.caseState === 'suspects' || caseData.caseState === 'voting' || caseData.caseState === 'closed') {
                    router.push(`/case/${caseId}/evidence`);
                  }
                }}
                className="px-6 py-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      );

    case 'evidence':
      const revealedHints = caseData.hints.filter(h => h.revealed);
      return (
        <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-5xl font-light text-white">
                Evidence
              </h1>
              <p className="text-gray-500 text-sm">
                {revealedHints.length} of {caseData.hints.length} pieces revealed
              </p>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-8">
              {revealedHints.length === 0 ? (
                <p className="text-gray-500">No evidence has been revealed yet.</p>
              ) : (
                revealedHints
                  .sort((a, b) => a.index - b.index)
                  .map((hint) => (
                    <div key={hint.id} className="border-b border-white/10 pb-4">
                      <p className="text-gray-300">{hint.content}</p>
                    </div>
                  ))
              )}
            </div>
            <div className="flex justify-center pt-8">
              <button
                onClick={() => router.push(`/case/${caseId}/suspects`)}
                className="px-6 py-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      );

    case 'suspects':
      router.push(`/case/${caseId}/suspects`);
      return null;

    case 'voting':
      return (
        <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-light text-white mb-4">
                {caseData.vote_question}
              </h1>
            </div>
            <VotingInterface caseId={caseId} caseData={caseData} />
          </div>
        </div>
      );

    case 'closed':
      return (
        <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-light text-white">
                Case Closed
              </h1>
            </div>
            <ResultDisplay caseId={caseId} caseData={caseData} />
          </div>
        </div>
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
          <p className="text-gray-400">Invalid case state.</p>
        </div>
      );
  }
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
        body: JSON.stringify({ caseId, option }),
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
      <div className="text-center space-y-4">
        <p className="text-gray-300">Your vote has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
  );
}

function ResultDisplay({ caseId, caseData }: { caseId: string; caseData: Case }) {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user vote from localStorage
    if (typeof window !== 'undefined') {
      const vote = localStorage.getItem(`vote_${caseId}`);
      if (vote) {
        setUserVote(vote);
      }
    }

    // Fetch results
    fetch(`/api/vote/results?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.results) {
          setResults(data.results);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return <p className="text-gray-400 text-center">Loading results...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="border-t border-white/10 pt-8 space-y-4">
        <p className="text-white font-light text-lg">The correct answer is:</p>
        <p className="text-white text-2xl">Suspect {caseData.correct_answer}</p>
      </div>
      <div className="border-t border-white/10 pt-8">
        <p className="text-gray-400 text-sm leading-relaxed">
          {caseData.answer_explanation}
        </p>
      </div>
      {userVote && (
        <div className="border-t border-white/10 pt-8">
          <p className="text-gray-500 text-sm">
            Your vote: Suspect {userVote}
            {userVote === caseData.correct_answer && (
              <span className="ml-2 text-gray-400">(Correct)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

