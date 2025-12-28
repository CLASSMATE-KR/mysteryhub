"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Case } from "@/lib/caseLoader";

export default function EvidencePage() {
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
          router.push(`/case/${caseId}`);
          return;
        }
        // Check if evidence stage is accessible
        if (data.caseState !== 'evidence' && data.caseState !== 'suspects' && data.caseState !== 'voting' && data.caseState !== 'closed') {
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
        {(caseData.caseState === 'suspects' || caseData.caseState === 'voting' || caseData.caseState === 'closed') && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => router.push(`/case/${caseId}/suspects`)}
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

