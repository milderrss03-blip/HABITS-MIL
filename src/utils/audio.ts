// 432 Hz Binaural Beat Sound Engine (Theta wave 6Hz difference for Deep Focus)
class BinauralSoundEngine {
  private audioCtx: AudioContext | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private listeners: ((playing: boolean) => void)[] = [];

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.push(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      // Smooth fade in to a gentle, comfortable volume
      this.masterGain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
      this.masterGain.connect(this.audioCtx.destination);

      // Stereo panner for left ear: 432 Hz
      const pannerLeft = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
      if (pannerLeft) pannerLeft.pan.value = -0.8;

      this.oscLeft = this.audioCtx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(432, now); // Base frequency 432 Hz

      if (pannerLeft) {
        this.oscLeft.connect(pannerLeft);
        pannerLeft.connect(this.masterGain);
      } else {
        this.oscLeft.connect(this.masterGain);
      }

      // Stereo panner for right ear: 438 Hz (producing 6 Hz Theta binaural beat)
      const pannerRight = this.audioCtx.createStereoPanner ? this.audioCtx.createStereoPanner() : null;
      if (pannerRight) pannerRight.pan.value = 0.8;

      this.oscRight = this.audioCtx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(438, now);

      if (pannerRight) {
        this.oscRight.connect(pannerRight);
        pannerRight.connect(this.masterGain);
      } else {
        this.oscRight.connect(this.masterGain);
      }

      this.oscLeft.start(now);
      this.oscRight.start(now);
      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('AudioContext not allowed or supported:', e);
    }
  }

  public playChime() {
    this.playLoginChime();
  }

  public playLoginChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = this.audioCtx || new AudioContextClass();
      if (!this.audioCtx) this.audioCtx = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic ascension chime: C5 -> E5 -> G5 -> C6
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.26);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {
      // AudioContext fallback
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    try {
      if (this.audioCtx && this.masterGain) {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          this.oscLeft?.stop();
          this.oscRight?.stop();
          this.oscLeft?.disconnect();
          this.oscRight?.disconnect();
          this.masterGain?.disconnect();
          this.isPlaying = false;
          this.notify();
        }, 650);
      } else {
        this.isPlaying = false;
        this.notify();
      }
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }
}

export const binauralSound = new BinauralSoundEngine();
