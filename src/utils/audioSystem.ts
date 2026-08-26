/**
 * Sistema Web Audio API Nativo para El Artista
 * Genera efectos sonoros procedurales con osciladores y filtros en tiempo real
 * sin dependencias externas ni archivos pesados de audio.
 */

type SoundListener = (enabled: boolean) => void;

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private listeners: SoundListener[] = [];

  constructor() {
    // Cargar preferencia del usuario de localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('el_artista_sfx_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isSoundEnabled(): boolean {
    return !this.isMuted;
  }

  public subscribeSoundState(callback: SoundListener): () => void {
    this.listeners.push(callback);
    callback(!this.isMuted);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    const enabled = !this.isMuted;
    this.listeners.forEach(cb => cb(enabled));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('el_artista_sfx_muted', String(this.isMuted));
    }
    this.notify();
    return this.isMuted;
  }

  public toggleSound(): boolean {
    const muted = this.toggleMute();
    if (!muted) {
      this.play('click');
    }
    return !muted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('el_artista_sfx_muted', String(muted));
    }
    this.notify();
  }

  /**
   * Reproduce un efecto sonoro sintetizado
   */
  public play(type: 'click' | 'release' | 'money' | 'award' | 'tour' | 'level_up' | 'chart_no1'): void {
    if (this.isMuted) return;

    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      switch (type) {
        case 'click': {
          // Click analógico sutil de perilla o botón
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.04);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'release': {
          // Acorde synthwave cálido y brillante al publicar un single/álbum (Cmaj7: C4, E4, G4, B4)
          const notes = [261.63, 329.63, 392.00, 493.88];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4);
            filter.frequency.exponentialRampToValueAtTime(600, now + 1.2);

            gain.gain.setValueAtTime(0.001, now + idx * 0.06);
            gain.gain.linearRampToValueAtTime(0.15 / notes.length, now + idx * 0.06 + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + 1.25);
          });
          break;
        }

        case 'money': {
          // Sonido de caja registradora / campanilla de regalías y fondos
          const notes = [987.77, 1318.51]; // B5, E6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0.18, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.36);
          });
          break;
        }

        case 'award': {
          // Fanfarria triunfal de gala / premio ganado (triada mayor con vibrato)
          const chords = [
            { freqs: [392.00, 493.88, 587.33], delay: 0, dur: 0.2 },     // G
            { freqs: [440.00, 554.37, 659.25], delay: 0.22, dur: 0.2 },  // A
            { freqs: [523.25, 659.25, 783.99, 1046.50], delay: 0.44, dur: 0.9 } // C epic
          ];

          chords.forEach(({ freqs, delay, dur }) => {
            freqs.forEach(freq => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + delay);

              gain.gain.setValueAtTime(0.001, now + delay);
              gain.gain.linearRampToValueAtTime(0.12 / freqs.length, now + delay + 0.04);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(now + delay);
              osc.stop(now + delay + dur + 0.05);
            });
          });
          break;
        }

        case 'tour': {
          // Sub-bajo 808 + snare burst al iniciar fecha de gira o concierto
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.52);
          break;
        }

        case 'level_up': {
          // Arpegio ascendente de avance de era o hito
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.15, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.26);
          });
          break;
        }

        case 'chart_no1': {
          // Triunfo rotundo #1 en los Charts mundiales
          const arpeg = [523.25, 659.25, 783.99, 1046.50, 1318.51];
          arpeg.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + i * 0.09);

            gain.gain.setValueAtTime(0.001, now + i * 0.09);
            gain.gain.linearRampToValueAtTime(0.08, now + i * 0.09 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.09);
            osc.stop(now + 1.45);
          });
          break;
        }
      }
    } catch (err) {
      console.warn('WebAudio playback notice:', err);
    }
  }
}

export const audioSystem = new AudioSystem();

export const playSound = (type: 'click' | 'release' | 'money' | 'award' | 'tour' | 'level_up' | 'chart_no1') => {
  audioSystem.play(type);
};
