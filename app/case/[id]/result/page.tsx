"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Case } from "@/lib/caseLoader";

export default function ResultPage() {
  const params = useParams();
  const caseId = params?.id as string || "001";
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;

    // Get user vote from localStorage
    if (typeof window !== 'undefined') {
      const vote = localStorage.getItem(`vote_${caseId}`);
      if (vote) {
        setUserVote(vote);
      }
    }

    // Fetch case data
    fetch(`/api/case?id=${caseId}`)
      .then(res => res.json())
      .then(data => {
        setCaseData(data);
      })
      .catch(() => {});

    // Fetch results
    fetch(`/api/vote/results?caseId=case_${caseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.results) {
          setResults(data.results);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [caseId]);

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-8 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-light text-white">
            Case Closed
          </h1>
        </div>
        <div className="space-y-8 border-t border-white/10 pt-8">
          <div>
            <p className="text-white font-light text-lg mb-2">The correct answer is:</p>
            <p className="text-white text-2xl">Suspect {caseData.correct_answer}</p>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {caseData.answer_explanation}
            </p>
          </div>
          {userVote && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-gray-500 text-sm">
                Your vote: Suspect {userVote}
                {userVote === caseData.correct_answer && (
                  <span className="ml-2 text-gray-400">(Correct)</span>
                )}
              </p>
            </div>
          )}
          {results.length > 0 && (
            <div className="border-t border-white/10 pt-4 space-y-2">
              <p className="text-gray-500 text-sm mb-4">Vote Results:</p>
              {results.map((result) => (
                <div key={result.option} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Suspect {result.option}</span>
                  <span className="text-gray-300">{result.votes} votes ({result.percentage}%)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

