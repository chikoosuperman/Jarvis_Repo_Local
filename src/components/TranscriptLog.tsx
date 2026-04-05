"use client";

import { useEffect, useRef } from "react";

interface LogEntry {
  role: "user" | "jarvis" | "system";
  content: string;
}

interface TranscriptLogProps {
  logs: LogEntry[];
  interimTranscript: string;
}

export function TranscriptLog({ logs, interimTranscript }: TranscriptLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, interimTranscript]);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-2xl mx-auto h-64 overflow-y-auto bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm shadow-inner backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3">
        {logs.map((log, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${
              log.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className={`text-xs mb-1 font-sans font-semibold tracking-wider opacity-50 ${
              log.role === "user" ? "text-green-400" : log.role === "system" ? "text-yellow-400" : "text-cyan-400"
            }`}>
              {log.role.toUpperCase()}
            </span>
            <div className={`px-4 py-2 rounded-lg max-w-[85%] ${
              log.role === "user" 
                ? "bg-green-500/10 text-green-100 border border-green-500/20" 
                : log.role === "system"
                  ? "bg-yellow-500/10 text-yellow-200 border border-yellow-500/20 text-xs italic"
                  : "bg-cyan-500/10 text-cyan-50 border border-cyan-500/20"
            }`}>
              {log.content}
            </div>
          </div>
        ))}
        
        {/* Live Interim Transcript */}
        {interimTranscript && (
          <div className="flex flex-col items-end">
            <span className="text-xs mb-1 font-sans font-semibold tracking-wider opacity-30 text-green-400">
              USER (LISTENING...)
            </span>
            <div className="px-4 py-2 rounded-lg max-w-[85%] bg-green-500/5 text-green-100/50 border border-green-500/10 italic animate-pulse">
              {interimTranscript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
