import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-8 py-16 overflow-hidden">
      {/* Subtle ambient elements */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative fade-in flex flex-col items-center justify-center space-y-16 text-center max-w-2xl z-10">
        {/* Case Title */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-light tracking-wider text-glow text-gray-200">
            CASE #0427
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </div>

        {/* Unsettling Description */}
        <div className="space-y-8">
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light tracking-wide">
            Something happened. 
            <br />
            The details are unclear.
          </p>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed font-extralight italic">
            Time seems to have stopped.
            <br />
            The truth is waiting.
          </p>
        </div>

        {/* Proceed Button */}
        <div className="pt-8">
          <Link
            href="/vote"
            className="group relative inline-block"
          >
            <div className="glass hover-glow px-12 py-4 rounded-full border border-white/10 relative">
              <span className="text-gray-300 text-lg font-light tracking-widest uppercase relative z-10">
                Proceed to Vote
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
