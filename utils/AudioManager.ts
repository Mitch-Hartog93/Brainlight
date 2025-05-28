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
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'interactive',
          sampleRate: 44100
        });
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (this.audioContext.state !== 'running') {
        const unlockAudio = async () => {
          if (this.audioContext?.state !== 'running') {
            await this.audioContext?.resume();
          }
          document.removeEventListener('click', unlockAudio);
          document.removeEventListener('touchstart', unlockAudio);
        };
        
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async start(leftFreq: number, rightFreq: number, gain: number = 0.1) {
    if (Platform.OS !== 'web') return;
    
    try {
      // Ensure we're starting fresh
      await this.stop();
      await this.cleanup();
      
      // Re-initialize the audio context after cleanup
      await this.initialize();
      
      if (!this.audioContext) {
        throw new Error('Failed to initialize audio context');
      }

      // Ensure context is running
      if (this.audioContext.state !== 'running') {
        await this.audioContext.resume();
      }

      // Create and configure gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.connect(this.audioContext.destination);

      // Create oscillators with stereo panning
      const frequencies = [leftFreq, rightFreq];
      const panValues = [-1, 1];

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
      this.oscillators.forEach(osc => osc.start(0));

      // Fade in gain
      this.gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.1);
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to start audio:', error);
      await this.cleanup();
    }
  }

  async stop() {
    if (!this.audioContext || !this.isPlaying) return;

    try {
      // Immediate fade out
      if (this.gainNode) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.cancelScheduledValues(currentTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.05);
      }

      // Stop everything after the fade
      setTimeout(() => {
        try {
          // Stop and disconnect oscillators
          this.oscillators.forEach(osc => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (e) {
              // Ignore errors if oscillator is already stopped
            }
          });
          this.oscillators = [];

          // Disconnect gain node
          if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
          }

          this.isPlaying = false;
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }, 100); // Reduced timeout to ensure quicker cleanup
    } catch (error) {
      console.error('Failed to stop audio:', error);
      // Force cleanup on error
      this.cleanup();
    }
  }

  cleanup() {
    try {
      // Ensure oscillators are stopped and disconnected
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Ignore errors if oscillator is already stopped
        }
      });
      this.oscillators = [];

      // Ensure gain node is disconnected
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }

      // Close and recreate audio context
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
        this.audioContext = null;
      }

      this.isPlaying = false;
    } catch (error) {
      console.error('Error during final cleanup:', error);
    }
  }

  isInitialized() {
    return this.audioContext !== null && this.audioContext.state === 'running';
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();