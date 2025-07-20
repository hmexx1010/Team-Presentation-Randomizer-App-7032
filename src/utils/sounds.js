// Enhanced sound effects using Web Audio API
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

  async playConfettiSound() {
    const context = await this.ensureAudioContext();
    if (!context) return;

    try {
      // Create a subtle, warm background celebration sound
      // Play a gentle major chord progression that fades in and out
      const chordProgression = [
        // First chord - C major (C, E, G)
        [261.63, 329.63, 392.00],
        // Second chord - F major (F, A, C) 
        [349.23, 440.00, 523.25],
        // Third chord - G major (G, B, D)
        [392.00, 493.88, 587.33]
      ];

      chordProgression.forEach((chord, chordIndex) => {
        setTimeout(() => {
          chord.forEach(frequency => {
            this.playBackgroundTone(context, frequency, 1.2, 'sine', 0.08);
          });
        }, chordIndex * 400); // Each chord plays 400ms apart
      });

      // Add some subtle high-frequency shimmer in the background
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const freq = 1200 + Math.random() * 600; // Gentle high frequencies
          this.playBackgroundTone(context, freq, 0.3, 'sine', 0.03);
        }, Math.random() * 1500); // Spread over 1.5 seconds
      }

    } catch (error) {
      console.warn('Failed to play confetti sound:', error);
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

  playTone(context, frequency, duration, type = 'sine', volume = 0.3) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }

  playBackgroundTone(context, frequency, duration, type = 'sine', volume = 0.05) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = type;
    
    // Gentle fade in and fade out for background ambience
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.3); // Fade in over 300ms
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, context.currentTime + duration - 0.5); // Hold
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration); // Fade out
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }
}

const soundEffects = new SoundEffects();

export const playDrumRoll = () => soundEffects.playDrumRoll();
export const playSuccess = () => soundEffects.playSuccess();
export const playConfettiSound = () => soundEffects.playConfettiSound();