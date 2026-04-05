"use client";

import { useJarvis } from "@/hooks/useJarvis";
import { Orb } from "@/components/Orb";
import { TranscriptLog } from "@/components/TranscriptLog";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
  const {
    isListening,
    toggleListening,
    interimTranscript,
    isJarvisSpeaking,
    isProcessing,
    logs
  } = useJarvis();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 flex flex-col items-center justify-between p-8 md:p-12 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center z-10">
        <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-white/80">
          J.A.R.V.I.S.
          <span className="block text[10px] font-mono tracking-widest text-cyan-500/50 mt-1">
            LOCAL SYSTEM SECURE
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-mono text-green-400/80">ONLINE</span>
        </div>
      </header>

      {/* Core Interface */}
      <div className="flex-1 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-12 z-10 w-full mt-8">
        {/* Left: Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Orb isListening={isListening} isSpeaking={isJarvisSpeaking} />
          
          <ControlPanel 
            isListening={isListening}
            toggleListening={toggleListening}
            isProcessing={isProcessing}
            isJarvisSpeaking={isJarvisSpeaking}
          />
        </div>

        {/* Right: Data Feed */}
        <div className="flex-1 w-full mt-12 lg:mt-0">
          <h2 className="text-sm font-mono text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-cyan-400"></span>
            LIVE TRANSCRIPT
          </h2>
          <TranscriptLog logs={logs} interimTranscript={interimTranscript} />
          
          <div className="mt-6 text-xs text-slate-500 font-mono flex flex-col gap-1 border-l border-slate-800 pl-4">
             <p>SYSTEM: Awaiting voice input...</p>
             <p>AUDIO: {isListening ? 'Unmuted' : 'Muted'}</p>
             <p>LLM: Llama-2 (Local)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
