"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Mock voting results (in real app, this would come from an API)
const results = [
  { id: 1, name: "The Watcher", votes: 42, percentage: 35 },
  { id: 2, name: "The Echo", votes: 28, percentage: 23 },
  { id: 3, name: "The Shadow", votes: 35, percentage: 29 },
  { id: 4, name: "The Silence", votes: 15, percentage: 13 },
];

export default function ResultPage() {
  const [revealed, setRevealed] = useState(false);
  const [userVote, setUserVote] = useState<number | null>(null);

  useEffect(() => {
    // Get user's vote
    const vote = localStorage.getItem("vote");
    if (vote) {
      setUserVote(parseInt(vote));
    }

    // Reveal results after a moment
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="min-h-screen px-8 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="fade-in text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-6xl font-light tracking-wider text-gray-200 text-glow">
            The Truth Revealed
          </h1>
          <p className="text-gray-500 font-extralight text-lg">
            {totalVotes} votes have been cast
          </p>
        </div>

        {/* Results */}
        <div className="space-y-8 mb-16">
          {results.map((result, index) => {
            const isUserVote = userVote === result.id;
            const isWinner = result.id === winner.id;
            
            return (
              <div
                key={result.id}
                className={`fade-in ${revealed ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  transitionDelay: `${index * 0.3}s`,
                  transition: 'opacity 1.5s ease-out'
                }}
              >
                <div className={`glass p-8 rounded-2xl border ${
                  isWinner 
                    ? 'border-purple-500/30 glow-soft' 
                    : 'border-white/10'
                }`}>
                  {/* Suspect Name and Percentage */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-200">
                        {result.name}
                      </h2>
                      {isUserVote && (
                        <span className="text-xs text-purple-400/70 font-light tracking-widest uppercase">
                          Your Vote
                        </span>
                      )}
                      {isWinner && (
                        <span className="text-xs text-purple-300/70 font-light tracking-widest uppercase">
                          Most Suspected
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-light text-gray-300">
                        {revealed ? `${result.percentage}%` : '—'}
                      </p>
                      <p className="text-sm text-gray-500 font-extralight">
                        {result.votes} votes
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-full transition-all duration-2000 ${
                        revealed ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        width: revealed ? `${result.percentage}%` : '0%',
                        transitionDelay: `${index * 0.3 + 0.5}s`
                      }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-purple-500/60 to-blue-500/60 blur-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conclusion */}
        <div className={`fade-in text-center space-y-8 ${revealed ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '2s', transition: 'opacity 2s ease-out' }}>
          <div className="glass p-12 rounded-2xl border border-white/10">
            <p className="text-xl text-gray-300 font-light tracking-wide mb-4">
              The majority suspects
            </p>
            <p className="text-3xl md:text-4xl text-gray-200 font-light tracking-wider text-glow mb-6">
              {winner.name}
            </p>
            <p className="text-gray-500 font-extralight italic text-lg">
              But is the truth really that simple?
            </p>
          </div>

          {/* Return Home */}
          <div className="pt-8">
            <Link
              href="/"
              className="group relative inline-block"
            >
              <div className="glass hover-glow px-8 py-3 rounded-full border border-white/10">
                <span className="text-gray-400 text-sm font-light tracking-widest uppercase">
                  Return
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

