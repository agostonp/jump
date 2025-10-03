// Simple sound manager using Web Audio API for beep sounds
class SoundManager {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playBeep(frequency: number, duration: number, volume: number = 0.3) {
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  jump() {
    // Quick upward beep
    this.playBeep(600, 0.1, 0.2);
  }

  collectFood() {
    // Happy ascending beep
    const ctx = this.getAudioContext();
    this.playBeep(800, 0.05, 0.3);
    setTimeout(() => this.playBeep(1000, 0.05, 0.3), 50);
  }

  loseLife() {
    // Descending sad beep
    const ctx = this.getAudioContext();
    this.playBeep(400, 0.1, 0.4);
    setTimeout(() => this.playBeep(300, 0.15, 0.4), 100);
  }

  gameOver() {
    // Dramatic descending sequence
    const ctx = this.getAudioContext();
    this.playBeep(500, 0.15, 0.4);
    setTimeout(() => this.playBeep(400, 0.15, 0.4), 150);
    setTimeout(() => this.playBeep(300, 0.3, 0.4), 300);
  }

  leafSinking() {
    // Warning beep
    this.playBeep(350, 0.1, 0.15);
  }
}

export const soundManager = new SoundManager();
