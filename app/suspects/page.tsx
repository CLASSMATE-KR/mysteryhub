"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Case } from "@/lib/caseLoader";

export default function SuspectsPage() {
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

  if (caseData.caseState !== 'suspects' && caseData.caseState !== 'voting' && caseData.caseState !== 'closed') {
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

  const suspects = Object.entries(caseData.suspects);

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="fade-in space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-light tracking-wider text-gray-200 text-glow">
              Suspects
            </h1>
            <p className="text-gray-500 font-extralight text-lg">
              Review the suspects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {suspects.map(([key, description], index) => (
              <div
                key={key}
                className="fade-in glass p-8 rounded-2xl border border-white/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-200 text-glow mb-4">
                  Suspect {key}
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4"></div>
                <p className="text-gray-400 font-extralight text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {caseData.caseState === 'voting' && (
            <div className="flex justify-center">
              <Link
                href="/vote"
                className="glass hover-glow px-12 py-4 rounded-full border border-white/10"
              >
                <span className="text-gray-300 text-lg font-light tracking-widest uppercase">
                  Proceed to Vote
                </span>
              </Link>
            </div>
          )}

          {caseData.caseState !== 'voting' && (
            <div className="flex justify-center">
              <div className="glass px-8 py-3 rounded-full border border-white/10 opacity-50">
                <span className="text-gray-500 text-sm font-light tracking-widest uppercase">
                  Voting not available
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

