"use client";

import { Mic, MicOff, Settings2, Activity } from "lucide-react";

interface ControlPanelProps {
  isListening: boolean;
  toggleListening: () => void;
  isProcessing: boolean;
  isJarvisSpeaking: boolean;
}

export function ControlPanel({ 
  isListening, 
  toggleListening, 
  isProcessing, 
  isJarvisSpeaking 
}: ControlPanelProps) {
  
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      {/* Device Status */}
      <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
          Mic {isListening ? 'Active' : 'Muted'}
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isProcessing ? 'text-cyan-400 animate-[spin_3s_linear_infinite]' : 'text-slate-600'}`} />
          LLM {isProcessing ? 'Processing' : 'Idle'}
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${isJarvisSpeaking ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-slate-700'}`} />
          Audio {isJarvisSpeaking ? 'Out' : 'Off'}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-6 bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-md">
        <button 
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-500/30' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
        </button>

        <button 
          title="Settings / Fast Mode"
          className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
