import { Platform } from 'react-native';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  async initialize() {
    if (Platform.OS !== 'web') return;

    try {
      if (!this.audioContext) {
        // Create new context with explicit options
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'interactive',
          sampleRate: 44100
        });
      }
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async start(leftFreq: number, rightFreq: number, gain: number = 0.1) {
    if (Platform.OS !== 'web' || !this.audioContext) return;
    
    try {
      // Stop any existing audio
      await this.stop();

      // Create and configure gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);

      // Create oscillators with stereo panning
      const frequencies = [leftFreq, rightFreq];
      const panValues = [-1, 1]; // Left and right channels

      this.oscillators = frequencies.map((freq, index) => {
        const osc = this.audioContext!.createOscillator();
        const panner = this.audioContext!.createStereoPanner();
        
        // Configure oscillator
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        
        // Configure panner
        panner.pan.setValueAtTime(panValues[index], this.audioContext!.currentTime);
        
        // Connect nodes
        osc.connect(panner);
        panner.connect(this.gainNode!);
        
        return osc;
      });

      // Start oscillators
      this.oscillators.forEach(osc => osc.start(0));

      // Fade in gain
      this.gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.1);
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to start audio:', error);
      await this.stop();
    }
  }

  async stop() {
    if (!this.audioContext || !this.isPlaying) return;

    try {
      // Quick fade out
      if (this.gainNode) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.1);
      }

      // Stop and cleanup after fade
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            // Ignore errors if oscillator is already stopped
          }
        });
        this.oscillators = [];

        if (this.gainNode) {
          this.gainNode.disconnect();
          this.gainNode = null;
        }

        this.isPlaying = false;
      }, 150);
    } catch (error) {
      console.error('Failed to stop audio:', error);
      this.cleanup();
    }
  }

  cleanup() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  isInitialized() {
    return this.audioContext !== null;
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();