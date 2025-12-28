"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Case, CaseState, CaseStatus } from "@/lib/caseLoader";

export default function AdminPanel() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
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
      setAuthenticated(data.authenticated);
    } catch (error) {
      setAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        setPassword("");
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const loadCase = async () => {
    try {
      const res = await fetch("/api/admin/case?id=case_001");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="glass p-12 rounded-2xl border border-white/10 max-w-md w-full">
          <h1 className="text-2xl font-light tracking-wide mb-8 text-gray-200">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded text-gray-200 focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <p className="text-gray-400">Loading case data...</p>
      </div>
    );
  }

  const caseStates: CaseState[] = ['intro', 'overview', 'evidence', 'suspects', 'voting', 'closed'];
  const statuses: CaseStatus[] = ['draft', 'active', 'closed'];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h1 className="text-3xl font-light tracking-wide">Case Control Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 border border-white/10 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Case Info */}
        <div className="glass p-6 rounded border border-white/10">
          <h2 className="text-xl font-light mb-4">{caseData.title}</h2>
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

        {/* Case State Control */}
        <div className="glass p-6 rounded border border-white/10">
          <h2 className="text-lg font-light mb-4">Case Flow Control</h2>
          <div className="flex flex-wrap gap-2">
            {caseStates.map((state) => (
              <button
                key={state}
                onClick={() => updateCaseState(state)}
                disabled={loading || caseData.caseState === state}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  caseData.caseState === state
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-gray-800 border-white/10 hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Status Control */}
        <div className="glass p-6 rounded border border-white/10">
          <h2 className="text-lg font-light mb-4">Case Status</h2>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={loading || caseData.status === status}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  caseData.status === status
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-gray-800 border-white/10 hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Hint Management */}
        <div className="glass p-6 rounded border border-white/10">
          <h2 className="text-lg font-light mb-4">Hint Management</h2>
          <div className="space-y-3">
            {caseData.hints.map((hint) => (
              <div
                key={hint.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-white/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">#{hint.index + 1}</span>
                    {hint.revealed && (
                      <span className="text-xs text-green-400/70">Revealed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{hint.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {hint.revealed ? (
                    <button
                      onClick={() => hideHint(hint.id)}
                      disabled={loading}
                      className="px-3 py-1 text-xs bg-gray-700 border border-white/10 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      onClick={() => revealHint(hint.id)}
                      disabled={loading}
                      className="px-3 py-1 text-xs bg-gray-700 border border-white/10 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Reveal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded border border-white/10">
          <h2 className="text-lg font-light mb-4">Quick Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => updateCaseState('voting')}
              disabled={loading || caseData.caseState === 'voting'}
              className="px-4 py-2 bg-gray-800 border border-white/10 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Open Voting
            </button>
            <button
              onClick={() => updateCaseState('closed')}
              disabled={loading || caseData.caseState === 'closed'}
              className="px-4 py-2 bg-gray-800 border border-white/10 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Close Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

