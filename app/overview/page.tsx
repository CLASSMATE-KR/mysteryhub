"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Case } from "@/lib/caseLoader";

export default function OverviewPage() {
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
  const overviewLines = caseData.overview.split('\n');

  if (caseData.caseState === 'intro') {
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
              {caseData.title}
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          </div>

          <div className="glass p-12 rounded-2xl border border-white/10 space-y-6">
            <div className="space-y-4">
              {overviewLines.map((line, index) => (
                <p key={index} className="text-lg text-gray-300 leading-relaxed font-light">
                  {line}
                </p>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2 text-sm text-gray-400">
              <p>{caseData.metadata.time_window}</p>
              <p>{caseData.metadata.location}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href={caseData.caseState === 'evidence' ? '/evidence' : caseData.caseState === 'suspects' ? '/suspects' : caseData.caseState === 'voting' ? '/vote' : '/'}
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

