"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentCase } from "@/lib/caseLoader";

// Mock voting results (in real app, this would come from an API)
const generateMockResults = (options: string[], correctAnswer: string) => {
  const totalVotes = 120;
  const baseVotes = [45, 30, 25, 20];
  const correctIndex = options.indexOf(correctAnswer);
  
  // Make correct answer have slightly more votes, but not obvious
  const votes = baseVotes.map((v, i) => {
    if (i === correctIndex) return v + 15;
    return v;
  });
  
  const total = votes.reduce((sum, v) => sum + v, 0);
  return options.map((option, index) => ({
    id: option,
    name: option,
    votes: votes[index],
    percentage: Math.round((votes[index] / total) * 100),
  }));
};

export default function ResultPage() {
  const caseData = getCurrentCase();
  const results = generateMockResults(caseData.options, caseData.correct_answer);
  
  const [revealed, setRevealed] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Get user's vote
    const vote = localStorage.getItem("vote");
    if (vote) {
      setUserVote(vote);
    }

    // Reveal results after a moment
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 1000);

    // Show answer explanation after results
    const answerTimer = setTimeout(() => {
      setShowAnswer(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(answerTimer);
    };
  }, []);

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  );
  const isCorrect = userVote === caseData.correct_answer;

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
            const isCorrectAnswer = result.id === caseData.correct_answer;
            
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
                  isCorrectAnswer && showAnswer
                    ? 'border-green-500/30 glow-soft' 
                    : isWinner 
                    ? 'border-purple-500/30 glow-soft' 
                    : 'border-white/10'
                }`}>
                  {/* Suspect Name and Percentage */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-200">
                        Suspect {result.name}
                      </h2>
                      {isUserVote && (
                        <span className="text-xs text-purple-400/70 font-light tracking-widest uppercase">
                          Your Vote
                        </span>
                      )}
                      {isCorrectAnswer && showAnswer && (
                        <span className="text-xs text-green-400/70 font-light tracking-widest uppercase">
                          Correct
                        </span>
                      )}
                      {isWinner && !showAnswer && (
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
          {!showAnswer ? (
            <div className="glass p-12 rounded-2xl border border-white/10">
              <p className="text-xl text-gray-300 font-light tracking-wide mb-4">
                The majority suspects
              </p>
              <p className="text-3xl md:text-4xl text-gray-200 font-light tracking-wider text-glow mb-6">
                Suspect {winner.name}
              </p>
              <p className="text-gray-500 font-extralight italic text-lg">
                But is the truth really that simple?
              </p>
            </div>
          ) : (
            <div className="glass p-12 rounded-2xl border border-white/10 space-y-6">
              <p className="text-xl text-gray-300 font-light tracking-wide">
                The correct answer is
              </p>
              <p className="text-3xl md:text-4xl text-gray-200 font-light tracking-wider text-glow">
                Suspect {caseData.correct_answer}
              </p>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              <div className="text-gray-400 font-extralight text-base leading-relaxed space-y-2">
                {caseData.answer_explanation.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              {isCorrect && (
                <p className="text-green-400/70 font-light text-sm mt-4">
                  You were correct.
                </p>
              )}
              {!isCorrect && (
                <p className="text-gray-500 font-extralight text-sm mt-4">
                  Your vote: Suspect {userVote}
                </p>
              )}
            </div>
          )}

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

