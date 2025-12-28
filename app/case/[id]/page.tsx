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
  const revealedHints = caseData.hints.filter(h => h.revealed).sort((a, b) => a.index - b.index);
  const lockedHints = caseData.hints.filter(h => !h.revealed).length;

  // Show intro only if caseState is intro
  if (caseData.caseState === 'intro') {
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
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Intro Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-light text-white">
            {caseData.title}
          </h1>
        </div>

        {/* Overview Section */}
        <div className="space-y-6 border-t border-white/10 pt-8">
          <div className="space-y-4">
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
        </div>

        {/* Evidence Section */}
        {caseData.caseState === 'evidence' || caseData.caseState === 'overview' ? (
          <div className="space-y-6 border-t border-white/10 pt-8">
            <div className="space-y-2">
              <h2 className="text-xl font-light text-white">Evidence</h2>
              <p className="text-sm text-gray-500">
                {revealedHints.length} of {caseData.hints.length} pieces revealed
                {lockedHints > 0 && ` • ${lockedHints} locked`}
              </p>
            </div>
            <div className="space-y-4">
              {revealedHints.length === 0 ? (
                <p className="text-gray-500">No evidence has been revealed yet.</p>
              ) : (
                revealedHints.map((hint) => (
                  <div key={hint.id} className="border-b border-white/10 pb-4">
                    <p className="text-gray-300">{hint.content}</p>
                  </div>
                ))
              )}
              {lockedHints > 0 && (
                <div className="pt-4">
                  <p className="text-gray-600 text-sm italic">
                    {lockedHints} piece{lockedHints > 1 ? 's' : ''} of evidence remain{lockedHints > 1 ? '' : 's'} locked.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Discord Section */}
        <div className="border-t border-white/10 pt-8 space-y-4">
          <p className="text-gray-400">
            Discussion and voting take place on Discord.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/example"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
          >
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}
