"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onFinalResultRef = useRef<((text: string) => void) | null>(null);

  const setOnFinalResult = useCallback((cb: ((text: string) => void) | null) => {
    onFinalResultRef.current = cb;
  }, []);
  
  const toggleListening = useCallback(() => {
    const newState = !isListeningRef.current;
    isListeningRef.current = newState;
    setIsListening(newState);

    if (newState) {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    } else {
      recognitionRef.current?.stop();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let currentInterim = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
            
            // Reset silence timer on speech
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            
            // Wait ~800ms of silence to finalize the interim chunk if it hasn't fired isFinal
            silenceTimerRef.current = setTimeout(() => {
              if (currentInterim.trim().length > 0 && typeof onFinalResultRef.current === "function") {
                onFinalResultRef.current(currentInterim);
                setInterimTranscript("");
              }
            }, 800);
          }

          if (finalTranscript && typeof onFinalResultRef.current === "function") {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            onFinalResultRef.current(finalTranscript);
            setInterimTranscript("");
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === 'aborted') return; // Ignore intentional aborts or stop calls
          
          console.error("Speech recognition error:", event.error);
          if (event.error === 'not-allowed') {
            isListeningRef.current = false;
            setIsListening(false);
          }
        };

        recognitionRef.current.onend = () => {
          // Auto-restart if we are supposed to be listening (Continuous mode)
          if (isListeningRef.current) {
            try {
              recognitionRef.current?.start();
            } catch(e) {
               // Ignore if already started
            }
          } else {
            setInterimTranscript("");
          }
        };
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }
    }
    
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        isListeningRef.current = false;
        recognitionRef.current.stop();
      }
    };
  }, []); // Run only once on mount

  return {
    isListening,
    toggleListening,
    interimTranscript,
    setOnFinalResult
  };
}
