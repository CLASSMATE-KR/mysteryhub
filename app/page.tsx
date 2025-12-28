"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleEnter = () => {
    router.push("/case/001");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-light text-white">
          MysteryHub
        </h1>
        <p className="text-gray-400 text-lg">
          A place for mysteries.
        </p>
        <button
          onClick={handleEnter}
          className="px-8 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors"
        >
          Enter Case
        </button>
      </div>
    </div>
  );
}
