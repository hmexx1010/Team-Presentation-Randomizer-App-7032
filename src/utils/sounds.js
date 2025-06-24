// Simple sound effects using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) return null;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  async playDrumRoll() {
    const context = await this.ensureAudioContext();
    if (!context) return;

    try {
      // Create a drum roll effect with multiple quick beats
      const duration = 3; // 3 seconds
      const beatInterval = 0.1; // Beat every 100ms
      const beats = Math.floor(duration / beatInterval);

      for (let i = 0; i < beats; i++) {
        setTimeout(() => {
          this.playBeat(context, 0.3 + (i * 0.02)); // Gradually increase frequency
        }, i * beatInterval * 1000);
      }
    } catch (error) {
      console.warn('Failed to play drum roll:', error);
    }
  }

  async playSuccess() {
    const context = await this.ensureAudioContext();
    if (!context) return;

    try {
      // Play a success sound (ascending notes)
      const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
      
      notes.forEach((frequency, index) => {
        setTimeout(() => {
          this.playTone(context, frequency, 0.3, 'sine');
        }, index * 150);
      });
    } catch (error) {
      console.warn('Failed to play success sound:', error);
    }
  }

  playBeat(context, frequency = 0.3) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(60 + frequency * 40, context.currentTime);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  }

  playTone(context, frequency, duration, type = 'sine') {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }
}

const soundEffects = new SoundEffects();

export const playDrumRoll = () => soundEffects.playDrumRoll();
export const playSuccess = () => soundEffects.playSuccess();