"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password");
      }
    } catch (error) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
      <div className="w-full max-w-md px-8">
        <div className="border border-white/20 p-8 space-y-6">
          <h1 className="text-2xl font-light text-white">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#111] border border-white/20 text-white focus:outline-none focus:border-white/40"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 border border-white/20 text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

