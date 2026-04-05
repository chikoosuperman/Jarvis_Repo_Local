"use client";

import { useEffect, useState } from "react";

interface OrbProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export function Orb({ isListening, isSpeaking }: OrbProps) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-12">
      {/* Base glow */}
      <div 
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ease-in-out ${
          isSpeaking 
            ? 'bg-blue-500/70 scale-125 animate-pulse' 
            : isListening 
              ? 'bg-cyan-500/50 scale-110 animate-pulse' 
              : 'bg-blue-900/40 scale-100'
        }`}
      />
      
      {/* Outer Ring */}
      <div 
        className={`absolute inset-4 rounded-full border border-blue-500/30 transition-all duration-700 ${
          isSpeaking ? 'animate-[spin_4s_linear_infinite] scale-110 border-blue-400' : 'animate-[spin_20s_linear_infinite] scale-100'
        }`}
        style={isSpeaking ? { borderTopColor: 'transparent', borderBottomColor: 'transparent' } : {}}
      />
      
      {/* Inner Ring */}
      <div 
        className={`absolute inset-8 rounded-full border-2 border-cyan-400/20 transition-all duration-500 ${
          isListening && !isSpeaking ? 'animate-[ping_3s_ease-in-out_infinite] scale-105' : 'animate-[spin_10s_linear_infinite_reverse]'
        }`}
      />

      {/* Core Orb */}
      <div 
        className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-500 flex items-center justify-center ${
          isSpeaking 
            ? 'bg-gradient-to-tr from-blue-600 to-cyan-300 shadow-[0_0_50px_rgba(56,189,248,0.8)]' 
            : isListening
              ? 'bg-gradient-to-tr from-cyan-600 to-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.5)]'
              : 'bg-gradient-to-tr from-blue-900 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        }`}
      >
        {/* Abstract Inner Detail for the Core */}
        <div className="absolute w-20 h-20 rounded-full bg-white blur-2xl opacity-40 mix-blend-overlay" />
        
        {/* Fake waveform display when speaking */}
        {isSpeaking && (
          <div className="flex gap-1 items-center z-10 opacity-80 h-10">
            <div className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite] h-8" />
            <div className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite_0.1s] h-10" />
            <div className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_0.2s] h-6" />
            <div className="w-1 bg-white rounded-full animate-[bounce_0.7s_infinite_0.3s] h-8" />
            <div className="w-1 bg-white rounded-full animate-[bounce_0.9s_infinite_0.4s] h-7" />
          </div>
        )}
      </div>
    </div>
  );
}
