import { WEDDING_DATA } from '../data/weddingData';

/**
 * Wedding Music & Tactile Ritual Sound Engine
 * - Plays WEDDING_DATA.couple.musicUrl (or `/music.mp3` if provided).
 * - Falls back seamlessly to a built-in Romantic Bridal Ballad if offline/blocked.
 */
class WeddingSoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverbSend = null;
    this.isPlaying = false;
    this.sfxEnabled = true;
    this.loopTimer = null;
    this.audioEl = null;
    this.usingMp3 = false;
    this.beatIndex = 0;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.master.connect(this.ctx.destination);

      // Lush warm hall reverb bus
      const delayL = this.ctx.createDelay(1.0);
      delayL.delayTime.setValueAtTime(0.32, this.ctx.currentTime);
      const delayR = this.ctx.createDelay(1.0);
      delayR.delayTime.setValueAtTime(0.47, this.ctx.currentTime);

      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.34, this.ctx.currentTime);

      const wetFilter = this.ctx.createBiquadFilter();
      wetFilter.type = 'lowpass';
      wetFilter.frequency.setValueAtTime(1750, this.ctx.currentTime);

      const wetGain = this.ctx.createGain();
      wetGain.gain.setValueAtTime(0.36, this.ctx.currentTime);

      delayL.connect(wetFilter);
      delayR.connect(wetFilter);
      wetFilter.connect(feedback);
      feedback.connect(delayL);
      wetFilter.connect(wetGain);
      wetGain.connect(this.master);

      this.reverbSend = delayL;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /* Warm Felt-Piano / Acoustic Harp note for romantic bridal chords */
  playWarmPiano(freq, duration = 2.4, volume = 0.055) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, now);
    const hGain = ctx.createGain();
    hGain.gain.setValueAtTime(0.14, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    harmonic.connect(hGain);
    hGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + duration + 0.05);
    harmonic.stop(now + duration + 0.05);
  }

  /* Lyrical Singing Flute / Violin Lead */
  playLeadMelody(freq, duration = 1.9, volume = 0.048) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq, now);

    lfo.frequency.setValueAtTime(4.6, now);
    lfoGain.gain.setValueAtTime(2.2, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(overtone.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1450, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    overtone.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);

    osc.start(now);
    overtone.start(now);
    lfo.start(now);
    osc.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
    lfo.stop(now + duration + 0.05);
  }

  async startMusic() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.sfxEnabled = true;

    // 1. Play configured wedding track (e.g. Perfect MP3), falling back cleanly if blocked
    const trackUrl = WEDDING_DATA?.couple?.musicUrl || '/music.mp3';
    try {
      if (!this.audioEl || this.audioEl.src !== trackUrl) {
        this.audioEl = new Audio(trackUrl);
        this.audioEl.loop = true;
        this.audioEl.volume = 0.55;
      }
      await this.audioEl.play();
      this.usingMp3 = true;
      return;
    } catch {
      // Fallback cleanly to built-in bridal ballad if browser blocks or offline
    }

    if (!this.isPlaying) return;
    this.usingMp3 = false;
    this.ensureContext();

    // 2. Built-in Kudmayi-Inspired Romantic Bridal Ballad in F Major
    // Progression: Fmaj7 -> Dm9 -> Bbmaj7 -> C6 (8 beats each, 32-step lush loop)
    const chords = [
      [174.61, 261.63, 329.63, 440.0], // Fmaj7
      [146.83, 220.0, 261.63, 349.23], // Dm7
      [116.54, 174.61, 220.0, 293.66], // Bbmaj7
      [130.81, 196.0, 261.63, 329.63], // C6
    ];

    // Expressive bridal ballad lead melody (F4, G4, A4, Bb4, C5, D5, E5, F5)
    const lead = [
      440.0, null, 466.16, 523.25, 440.0, null, 392.0, 349.23,
      349.23, null, 440.0, 523.25, 587.33, null, 523.25, null,
      587.33, null, 523.25, 466.16, 440.0, null, 392.0, 349.23,
      392.0, null, 440.0, 392.0, 349.23, null, null, null,
    ];

    this.beatIndex = 0;
    const tick = () => {
      if (!this.isPlaying) return;
      const step = this.beatIndex % 32;
      const chordIdx = Math.floor(step / 8);
      const chord = chords[chordIdx];

      // Gentle rolling piano arpeggio across chord tones
      const arpNote = chord[step % 4];
      this.playWarmPiano(arpNote, 2.3, step % 8 === 0 ? 0.068 : 0.042);
      if (step % 8 === 0) {
        this.playWarmPiano(chord[0] / 2, 3.6, 0.048); // Warm bass root
      }

      // Lyrical lead line
      const melodyNote = lead[step];
      if (melodyNote) {
        this.playLeadMelody(melodyNote, 1.85, 0.042);
      }

      this.beatIndex += 1;
    };

    tick();
    this.loopTimer = setInterval(tick, 540);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }

  /* ---- Tactile Bengali Ritual Sound Effects ---- */

  playShubhoDrishti() {
    if (!this.sfxEnabled) return;
    this.playLeadMelody(349.23, 2.0, 0.055);
    setTimeout(() => this.playWarmPiano(523.25, 2.4, 0.075), 110);
    setTimeout(() => this.playWarmPiano(659.25, 2.4, 0.07), 240);
    setTimeout(() => this.playWarmPiano(880.0, 2.8, 0.08), 380);
  }

  playKansaThali() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 784.0, 1188.0, 1640.0].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.055 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1 - i * 0.25);
      osc.connect(gain);
      gain.connect(this.master);
      gain.connect(this.reverbSend);
      osc.start(now);
      osc.stop(now + 2.2);
    });
  }

  playHoludSplash() {
    if (!this.sfxEnabled) return;
    [523.25, 587.33, 698.46, 880.0, 1046.5].forEach((f, idx) => {
      setTimeout(() => this.playWarmPiano(f, 1.4, 0.06), idx * 75);
    });
  }

  playDhakBeat(isSecond = false) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isSecond ? 165 : 145, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.24);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc.connect(gain);
    gain.connect(this.master);
    gain.connect(this.reverbSend);
    osc.start(now);
    osc.stop(now + 0.45);

    if (isSecond) {
      setTimeout(() => this.playWarmPiano(880, 1.8, 0.075), 110);
      setTimeout(() => this.playWarmPiano(1046.5, 2.2, 0.075), 220);
    }
  }

  playSaatPaakStep(stepIndex) {
    if (!this.sfxEnabled) return;
    const scale = [349.23, 392.0, 440.0, 466.16, 523.25, 587.33, 698.46];
    const freq = scale[Math.min(stepIndex, scale.length - 1)];
    this.playWarmPiano(freq, 1.8, 0.08);
    if (stepIndex === 6) {
      setTimeout(() => this.playWarmPiano(880.0, 2.6, 0.075), 150);
    }
  }

  playPradipLit() {
    if (!this.sfxEnabled) return;
    [349.23, 440.0, 523.25, 698.46].forEach((f, idx) => {
      setTimeout(() => this.playWarmPiano(f, 2.4, 0.07), idx * 95);
    });
  }

  playSoftTick() {
    if (!this.sfxEnabled) return;
    this.playWarmPiano(698.46, 0.4, 0.022);
  }
}

export const soundEngine = new WeddingSoundEngine();
