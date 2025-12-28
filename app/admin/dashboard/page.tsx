"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Case, CaseState, CaseStatus } from "@/lib/caseLoader";

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    loadCase();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin/login");
        return;
      }
      setAuthenticated(true);
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const loadCase = async () => {
    try {
      const res = await fetch("/api/admin/case?id=001");
      const data = await res.json();
      setCaseData(data);
    } catch (error) {
      console.error("Failed to load case:", error);
    }
  };

  const updateCaseState = async (newState: CaseState) => {
    if (!caseData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...caseData, caseState: newState }),
      });
      const updated = await res.json();
      setCaseData(updated);
    } catch (error) {
      alert("Failed to update case state");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: CaseStatus) => {
    if (!caseData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...caseData, status: newStatus }),
      });
      const updated = await res.json();
      setCaseData(updated);
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const revealHint = async (hintId: string) => {
    if (!caseData) return;
    setLoading(true);
    try {
      await fetch("/api/admin/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: caseData.id, hintId, action: "reveal" }),
      });
      await loadCase();
    } catch (error) {
      alert("Failed to reveal hint");
    } finally {
      setLoading(false);
    }
  };

  const hideHint = async (hintId: string) => {
    if (!caseData) return;
    setLoading(true);
    try {
      await fetch("/api/admin/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: caseData.id, hintId, action: "hide" }),
      });
      await loadCase();
    } catch (error) {
      alert("Failed to hide hint");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
        <p className="text-gray-400">Loading case data...</p>
      </div>
    );
  }

  const caseStates: CaseState[] = ['intro', 'overview', 'evidence', 'suspects', 'voting', 'closed'];
  const statuses: CaseStatus[] = ['draft', 'active', 'closed'];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <h1 className="text-2xl font-light">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/20 text-sm hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="border border-white/20 p-6 space-y-4">
          <h2 className="text-lg font-light">{caseData.title}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="ml-2">{caseData.status}</span>
            </div>
            <div>
              <span className="text-gray-400">State:</span>
              <span className="ml-2">{caseData.caseState}</span>
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-6">
          <h2 className="text-lg font-light mb-4">Case Flow Control</h2>
          <div className="flex flex-wrap gap-2">
            {caseStates.map((state) => (
              <button
                key={state}
                onClick={() => updateCaseState(state)}
                disabled={loading || caseData.caseState === state}
                className={`px-4 py-2 border text-sm transition-colors ${
                  caseData.caseState === state
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/20 hover:bg-white/5'
                } disabled:opacity-50`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/20 p-6">
          <h2 className="text-lg font-light mb-4">Case Status</h2>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={loading || caseData.status === status}
                className={`px-4 py-2 border text-sm transition-colors ${
                  caseData.status === status
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/20 hover:bg-white/5'
                } disabled:opacity-50`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/20 p-6">
          <h2 className="text-lg font-light mb-4">Hint Management</h2>
          <div className="space-y-3">
            {caseData.hints.map((hint) => (
              <div
                key={hint.id}
                className="flex items-center justify-between p-3 border border-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">#{hint.index + 1}</span>
                    {hint.revealed && (
                      <span className="text-xs text-gray-400">Revealed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{hint.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {hint.revealed ? (
                    <button
                      onClick={() => hideHint(hint.id)}
                      disabled={loading}
                      className="px-3 py-1 text-xs border border-white/20 hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      onClick={() => revealHint(hint.id)}
                      disabled={loading}
                      className="px-3 py-1 text-xs border border-white/20 hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      Reveal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/20 p-6">
          <h2 className="text-lg font-light mb-4">Quick Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => updateCaseState('voting')}
              disabled={loading || caseData.caseState === 'voting'}
              className="px-4 py-2 border border-white/20 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Open Voting
            </button>
            <button
              onClick={() => updateCaseState('closed')}
              disabled={loading || caseData.caseState === 'closed'}
              className="px-4 py-2 border border-white/20 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Close Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

