// Web Audio API and Speech Synthesis utility for Wallmiki E-Psychiatrist Holoprojector

class SoundEngine {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlayingFreq = false;
  private currentFreq = 432;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play peaceful ethereal bell/drone resonance when Wallmiki speaks
  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low fundamental grounding frequency (108Hz deep sacred root)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(108, now);
      osc1.frequency.exponentialRampToValueAtTime(216, now + 1.2);
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.0005, now + 1.8);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.8);

      // Ethereal overtone chime (432Hz harmonic)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(432, now);
      osc2.frequency.exponentialRampToValueAtTime(540, now + 0.4);
      gain2.gain.setValueAtTime(0.04, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 1.5);
    } catch (e) {
      console.warn("Audio chime not available:", e);
    }
  }

  // Continuous soothing frequency generator (432Hz, 528Hz, or 108Hz)
  startFrequency(freq: number = 432, volume: number = 0.05) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.isPlayingFreq) {
        this.stopFrequency();
      }

      this.currentFreq = freq;
      this.oscillator = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.oscillator.type = "sine";
      this.oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1.5);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator.start();
      this.isPlayingFreq = true;
    } catch (e) {
      console.warn("Frequency generator error:", e);
    }
  }

  setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(Math.max(0.001, volume), this.ctx.currentTime + 0.1);
    }
  }

  setFrequency(freq: number) {
    this.currentFreq = freq;
    if (this.oscillator && this.ctx) {
      this.oscillator.frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + 0.3);
    }
  }

  stopFrequency() {
    if (this.gainNode && this.ctx && this.oscillator) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
          }
          this.isPlayingFreq = false;
        }, 500);
      } catch (e) {
        this.isPlayingFreq = false;
      }
    } else {
      this.isPlayingFreq = false;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlayingFreq;
  }

  getCurrentFreq(): number {
    return this.currentFreq;
  }
}

export const soundEngine = new SoundEngine();

// Speech synthesis wrapper for Wallmiki (Ethereal Low Male Voice)
export function speakText(text: string, onStart?: () => void, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  // Strip markdown symbols and emojis for natural, dignified speech
  const cleanText = text
    .replace(/[*#_`~\[\]\(\)]/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  // Ethereal low male voice tuning: low pitch (0.72) and deliberate, meditative rate (0.84)
  utterance.pitch = 0.72;
  utterance.rate = 0.84;

  // Search for male and deep English voices available in the browser
  const voices = window.speechSynthesis.getVoices();
  const preferredMaleVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isEnglish = lang.startsWith("en");
    if (!isEnglish) return false;

    // Prioritize male and deep vocal models
    const hasMaleIndicator =
      name.includes("male") && !name.includes("female");
    const hasMaleName =
      name.includes("david") ||
      name.includes("daniel") ||
      name.includes("james") ||
      name.includes("george") ||
      name.includes("guy") ||
      name.includes("mark") ||
      name.includes("alex") ||
      name.includes("oliver") ||
      name.includes("arthur");

    return hasMaleIndicator || hasMaleName;
  }) || voices.find((v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("female"));

  if (preferredMaleVoice) {
    utterance.voice = preferredMaleVoice;
  }

  utterance.onstart = () => {
    soundEngine.playChime();
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
