"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Case } from "@/lib/caseLoader";

export default function Home() {
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

  const getStateMessage = () => {
    switch (caseData.caseState) {
      case 'intro':
        return { text: 'The case is being prepared.', canProceed: false };
      case 'overview':
        return { text: 'Review the case overview.', canProceed: true, link: '/overview' };
      case 'evidence':
        return { text: 'Examine the evidence.', canProceed: true, link: '/evidence' };
      case 'suspects':
        return { text: 'Review the suspects.', canProceed: true, link: '/suspects' };
      case 'voting':
        return { text: 'Proceed to vote.', canProceed: true, link: '/vote' };
      case 'closed':
        return { text: 'This case is closed.', canProceed: true, link: '/result' };
      default:
        return { text: 'The case is being prepared.', canProceed: false };
    }
  };

  const stateInfo = getStateMessage();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-8 py-16 overflow-hidden">
      {/* Subtle ambient elements */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative fade-in flex flex-col items-center justify-center space-y-16 text-center max-w-2xl z-10">
        {/* Case Title */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-light tracking-wider text-glow text-gray-200">
            {caseData.title}
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        {/* State-specific content */}
        {caseData.caseState === 'intro' && (
          <div className="space-y-8">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide">
              The case is being prepared.
            </p>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-extralight italic">
              Please wait.
            </p>
          </div>
        )}

        {caseData.caseState !== 'intro' && (
          <div className="space-y-8">
            {overviewLines.map((line, index) => (
              <p key={index} className="text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide">
                {line}
              </p>
            ))}
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-extralight italic">
              {caseData.metadata.time_window}
              <br />
              {caseData.metadata.location}
            </p>
          </div>
        )}

        {/* Proceed Button */}
        {stateInfo.canProceed && stateInfo.link && (
          <div className="pt-8">
            <Link
              href={stateInfo.link}
              className="group relative inline-block"
            >
              <div className="glass hover-glow px-12 py-4 rounded-full border border-white/10 relative">
                <span className="text-gray-300 text-lg font-light tracking-widest uppercase relative z-10">
                  Proceed
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
              </div>
            </Link>
          </div>
        )}

        {!stateInfo.canProceed && (
          <div className="pt-8">
            <div className="glass px-12 py-4 rounded-full border border-white/10 opacity-50">
              <span className="text-gray-500 text-lg font-light tracking-widest uppercase">
                {stateInfo.text}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
