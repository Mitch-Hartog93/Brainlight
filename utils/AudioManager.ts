import { Platform } from 'react-native';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  async initialize() {
    if (Platform.OS !== 'web') return;

    try {
      // Only create new context if one doesn't exist
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Ensure context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async start(leftFreq: number, rightFreq: number, gain: number = 0.1) {
    if (Platform.OS !== 'web') return;
    
    try {
      // Initialize if not already done
      await this.initialize();
      
      // Stop any existing audio before starting new
      await this.stop();
      
      if (!this.audioContext) return;

      // Create gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);

      // Create oscillators
      const frequencies = [leftFreq, rightFreq];
      const panValues = [-1, 1]; // Left and right

      this.oscillators = frequencies.map((freq, index) => {
        const osc = this.audioContext!.createOscillator();
        const panner = this.audioContext!.createStereoPanner();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        panner.pan.setValueAtTime(panValues[index], this.audioContext!.currentTime);
        
        osc.connect(panner);
        panner.connect(this.gainNode!);
        
        return osc;
      });

      // Start oscillators
      this.oscillators.forEach(osc => osc.start());

      // Fade in
      this.gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.5);
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to start audio:', error);
      await this.stop();
    }
  }

  async stop() {
    if (!this.audioContext || !this.isPlaying) return;

    try {
      // Fade out
      if (this.gainNode) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.2);
      }

      // Stop and cleanup after fade out
      setTimeout(() => {
        if (this.oscillators.length > 0) {
          this.oscillators.forEach(osc => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (e) {
              // Ignore errors if oscillator is already stopped
            }
          });
          this.oscillators = [];
        }

        if (this.gainNode) {
          this.gainNode.disconnect();
          this.gainNode = null;
        }

        this.isPlaying = false;
      }, 250); // Reduced timeout to ensure quicker cleanup
    } catch (error) {
      console.error('Failed to stop audio:', error);
      // Force cleanup in case of error
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
}

export const audioManager = new AudioManager();