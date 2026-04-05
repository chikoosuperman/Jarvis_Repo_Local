"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { audioManager } from "../lib/audioManager";
import { handleAction } from "../lib/actionHandler";

const SYSTEM_PROMPT = `You are J.A.R.V.I.S., a highly capable personal AI assistant. 
CRITICAL RULE: You are interacting via VOICE. You MUST keep your answers extremely brief and short. 
- Maximum 1 to 2 sentences per response. 
- NEVER use the word "Jarvis" in your own responses (this messes up the voice sensors).
- Do NOT use lists, bullet points, or markdown.
- Speak naturally, directly, and concisely. DO NOT babble.

Modes:
- Study Mode: reduce distractions, assist focus
- Morning Brief: summarize day
- Lockdown Mode: require password for sensitive actions`;

export function useJarvis() {
  const { isListening, toggleListening, interimTranscript, setOnFinalResult } = useSpeechRecognition();
  const [logs, setLogs] = useState<{ role: "user" | "jarvis" | "system", content: string }[]>([]);
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const awakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAwakeRef = useRef(false);

  useEffect(() => {
    // Check speech state periodically
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        setIsJarvisSpeaking(audioManager?.isSpeaking() || false);
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const handleUserInput = useCallback(async (text: string) => {
    const normalized = text.toLowerCase();
    
    // WAKE WORD LOGIC
    const containsWakeWord = normalized.includes("jarvis");
    
    if (containsWakeWord) {
      isAwakeRef.current = true;
    }

    // 2. INTERRUPT SYSTEM: Only allow interrupts if the wake word is spoken! This prevents the microphone from echoing J.A.R.V.I.S's own voice and interrupting him continuously.
    if ((audioManager?.isSpeaking() || isProcessing) && !containsWakeWord) {
        console.log("Ignored echo while speaking:", text);
        return; // Let him finish!
    }

    if (audioManager?.isSpeaking() || isProcessing) {
      audioManager?.cancel();
      setIsJarvisSpeaking(false);
      // Abort previous LLM fetch call
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setLogs((prev) => [...prev, { role: "system", content: "[System INTERRUPTED]" }]);
    }

    if (!isAwakeRef.current) {
       console.log("Ignored background conversation:", text);
       return; 
    }
    
    setLogs((prev) => [...prev, { role: "user", content: text }]);

    // Native Action checking (e.g. open netflix)
    const actionMatched = handleAction(text);
    if (actionMatched) {
      setLogs((prev) => [...prev, { role: "system", content: `Action triggered: ${text}` }]);
      return; // Skip LLM if it was a direct system command mapped natively.
    }

    // Prepare to hit Ollama proxy
    setIsProcessing(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama2:latest", // Updated to llama2:latest based on local instance availability
          prompt: `${SYSTEM_PROMPT}\n\nUser: ${text}\nJ.A.R.V.I.S.:`,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("API Route returned error " + response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let currentResponse = "";
      setLogs((prev) => [...prev, { role: "jarvis", content: "" }]); // create empty slot

      if (reader) {
        let sentenceBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          
          // Stream chunks might be JSON lines if using raw ollama output format
          const lines = chunkText.split("\n").filter(l => l.trim() !== "");
          
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                const token = parsed.response;
                currentResponse += token;
                sentenceBuffer += token;

                // Update UI log
                setLogs((prev) => {
                  const newLogs = [...prev];
                  newLogs[newLogs.length - 1].content = currentResponse;
                  return newLogs;
                });

                // Progressive TTS: when a punctuation is hit, Speak it early!
                if (/[.!?]\s*$/.test(sentenceBuffer)) {
                   audioManager?.speak(sentenceBuffer.trim());
                   sentenceBuffer = ""; // reset buffer
                }
              }
            } catch (e) {
               // We might receive partial json lines if the stream splits mid-object. 
               // In production, we should buffer incomplete strings.
               console.warn("Failed to parse chunk", line);
            }
          }
        }
        
        // flush remaining buffer 
        if (sentenceBuffer.trim().length > 0) {
          audioManager?.speak(sentenceBuffer.trim());
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log("Fetch aborted for interrupt");
      } else {
        console.error(e);
        setLogs((prev) => [...prev, { role: "system", content: "Error: " + e.message }]);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    setOnFinalResult(handleUserInput);
  }, [handleUserInput, setOnFinalResult]);

  return {
    isListening,
    toggleListening,
    interimTranscript,
    isJarvisSpeaking,
    isProcessing,
    logs
  };
}
