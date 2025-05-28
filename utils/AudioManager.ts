import { Platform } from 'react-native';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  async initialize() {
    if (Platform.OS !== 'web' || this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.audioContext.resume();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async start(leftFreq: number, rightFreq: number, gain: number = 0.1) {
    if (!this.audioContext || this.isPlaying) return;

    try {
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
        
        osc.start();
        return osc;
      });

      // Fade in
      this.gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 1);
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to start audio:', error);
      this.stop();
    }
  }

  async stop() {
    if (!this.audioContext || !this.isPlaying) return;

    try {
      // Fade out
      if (this.gainNode) {
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
      }

      // Stop and disconnect oscillators after fade out
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          osc.stop();
          osc.disconnect();
        });
        this.oscillators = [];

        if (this.gainNode) {
          this.gainNode.disconnect();
          this.gainNode = null;
        }

        this.isPlaying = false;
      }, 500);
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }

  cleanup() {
    this.stop();
  }
}

export const audioManager = new AudioManager();