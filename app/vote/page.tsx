"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentCase } from "@/lib/caseLoader";

export default function VotePage() {
  const caseData = getCurrentCase();
  const suspects = Object.entries(caseData.suspects).map(([key, description], index) => ({
    id: key,
    name: key,
    description: description,
    index: index,
  }));

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const router = useRouter();

  const handleVote = (id: string) => {
    setSelectedId(id);
    setHasVoted(true);
    
    // Store vote (in real app, this would be an API call)
    localStorage.setItem("vote", id);
    localStorage.setItem("caseId", caseData.id);
    
    // Show confirmation then redirect
    setTimeout(() => {
      router.push("/result");
    }, 3000);
  };

  if (hasVoted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8">
        <div className="fade-in text-center space-y-8">
          <div className="glass px-16 py-12 rounded-2xl border border-white/10 max-w-md mx-auto">
            <p className="text-2xl text-gray-300 font-light tracking-wide mb-4">
              Your vote has been recorded.
            </p>
            <p className="text-lg text-gray-500 font-extralight italic">
              The truth will be revealed soon...
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="fade-in text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-light tracking-wider text-gray-200 text-glow">
            {caseData.vote_question}
          </h1>
          <p className="text-gray-500 font-extralight text-lg">
            Review the evidence. Choose carefully.
          </p>
        </div>

        {/* Suspect Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {suspects.map((suspect, index) => (
            <div
              key={suspect.id}
              className="fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <button
                onClick={() => handleVote(suspect.id)}
                className="group w-full relative"
              >
                <div className="glass hover-glow p-12 rounded-2xl border border-white/10 h-full min-h-[300px] flex flex-col items-center justify-center space-y-6 transition-all duration-700">
                  {/* Suspect Name */}
                  <h2 className="text-3xl md:text-4xl font-light tracking-wider text-gray-200 text-glow">
                    Suspect {suspect.name}
                  </h2>
                  
                  {/* Divider */}
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                  
                  {/* Description */}
                  <p className="text-gray-400 font-extralight text-lg italic text-center">
                    {suspect.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/0 group-hover:bg-purple-500/5 blur-xl transition-all duration-1000"></div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

