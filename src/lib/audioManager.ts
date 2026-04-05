export class AudioManager {
  private static instance: AudioManager;
  public synth: SpeechSynthesis;
  private queue: string[] = [];
  public speaking: boolean = false;
  private voicesAllowed: SpeechSynthesisVoice[] = [];

  private constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  public static getInstance(): AudioManager {
    if (!globalThis.window) return {} as AudioManager; // Server side proxy
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadVoices() {
    const voices = this.synth.getVoices();
    // Try to find distinguished english voices, or fallback to default
    this.voicesAllowed = voices.filter((v) => v.lang.startsWith("en"));
  }

  public speak(text: string) {
    if (!text.trim()) return;
    
    // Split long text into natural chunks to avoid clipping and allow faster TTS start
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    this.queue.push(...chunks.map((c) => c.trim()));
    this.processQueue();
  }

  private processQueue() {
    if (this.synth.speaking || this.queue.length === 0) {
      return;
    }

    const textToSpeak = this.queue.shift();
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Find a good voice (e.g. Google UK English Male, or default)
    const preferredVoice = this.voicesAllowed.find(
      (v) => v.name.includes("UK English Male") || v.name.includes("Google")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.05; // Slightly faster for efficiency
    utterance.pitch = 0.9; // Slightly deeper

    utterance.onstart = () => {
      this.speaking = true;
    };

    utterance.onend = () => {
      this.speaking = false;
      this.processQueue();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error("Speech synthesis error", e.error);
      }
      this.speaking = false;
      this.processQueue();
    };

    this.synth.speak(utterance);
  }

  public cancel() {
    this.synth.cancel();
    this.queue = [];
    this.speaking = false;
  }

  public isSpeaking(): boolean {
    return this.synth.speaking || this.synth.pending;
  }
}

export const audioManager = (typeof window !== "undefined") ? AudioManager.getInstance() : null;
