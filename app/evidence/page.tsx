"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Case, Hint } from "@/lib/caseLoader";

export default function EvidencePage() {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case")
      .then(res => res.json())
      .then(data => {
        setCaseData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const revealedHints = caseData.hints.filter(hint => hint.revealed);

  if (caseData.caseState !== 'evidence' && caseData.caseState !== 'suspects' && caseData.caseState !== 'voting' && caseData.caseState !== 'closed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-400 font-light">This section is not available yet.</p>
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm">
            Return
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-light tracking-wider text-gray-200 text-glow">
              Evidence
            </h1>
            <p className="text-gray-500 font-extralight text-lg">
              {revealedHints.length} of {caseData.hints.length} pieces of evidence revealed
            </p>
          </div>

          <div className="space-y-4">
            {revealedHints.length === 0 ? (
              <div className="glass p-12 rounded-2xl border border-white/10 text-center">
                <p className="text-gray-400 font-light">No evidence has been revealed yet.</p>
              </div>
            ) : (
              revealedHints
                .sort((a, b) => a.index - b.index)
                .map((hint) => (
                  <div key={hint.id} className="glass p-6 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-4">
                      <span className="text-xs text-gray-500 font-light">#{hint.index + 1}</span>
                      <p className="text-gray-300 font-light leading-relaxed flex-1">{hint.content}</p>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="flex justify-center">
            <Link
              href={caseData.caseState === 'suspects' || caseData.caseState === 'voting' || caseData.caseState === 'closed' ? '/suspects' : '/'}
              className="glass hover-glow px-8 py-3 rounded-full border border-white/10"
            >
              <span className="text-gray-300 text-sm font-light tracking-widest uppercase">
                Continue
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

