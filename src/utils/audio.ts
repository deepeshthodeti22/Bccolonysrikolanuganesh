/**
 * Auspicious Temple Audio Synthesizer
 * Uses Web Audio API to create authentic temple bells, shankha (conch tone),
 * tanpura drone, and sacred chimes.
 */

class TempleSoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Resonating temple brass bell (Ghanta)
   */
  public playTempleBell(pitchMultiplier = 1.0): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const baseFreq = 587.33 * pitchMultiplier; // D5 note - traditional temple bell frequency
    const harmonics = [1, 1.98, 2.76, 3.44, 4.22];
    const gains = [0.6, 0.35, 0.2, 0.15, 0.08];

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, ctx.currentTime);

      gain.gain.setValueAtTime(gains[i], ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (3.0 - i * 0.4));

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 3.5);
    });
  }

  /**
   * Divine Conch Shell (Shankha) auspicious blow
   */
  public playShankha(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(440, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 1.2);
    filter.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 2.8);

    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 1.0);
    osc.frequency.exponentialRampToValueAtTime(215, ctx.currentTime + 2.8);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 3.0);
  }

  /**
   * Auspicious Aarti chime sequence
   */
  public playAartiChime(): void {
    if (this.isMuted) return;
    this.playTempleBell(1.0);
    setTimeout(() => this.playTempleBell(1.2), 350);
    setTimeout(() => this.playTempleBell(1.5), 700);
    setTimeout(() => this.playTempleBell(2.0), 1050);
  }
}

export const templeAudio = new TempleSoundSystem();
