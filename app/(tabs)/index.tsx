import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, Dimensions, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSequence,
  Easing
} from 'react-native-reanimated';
import Timer from '@/components/therapy/Timer';
import SessionControls from '@/components/therapy/SessionControls';
import TherapyStatus from '@/components/therapy/TherapyStatus';
import FloatingObjects from '@/components/therapy/FloatingObjects';
import { saveSession } from '@/utils/sessionStorage';

// Constants
const FREQUENCY = 40;
const PERIOD = 1000 / FREQUENCY;
const HALF_PERIOD = PERIOD / 2;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const AUDIO_GAIN = 0.2;
const LEFT_FREQUENCY = 420;
const RIGHT_FREQUENCY = 380;

export default function TherapyScreen() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const isBlackRef = useRef<boolean>(false);
  const sessionStartTimeRef = useRef<number>(0);
  const [isBlack, setIsBlack] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(10);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [progress, setProgress] = useState(1);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Web Audio API context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscillatorRef = useRef<OscillatorNode | null>(null);
  const rightOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Load audio preference on mount and when it changes
  useEffect(() => {
    loadAudioPreference();
    
    // Listen for audio preference changes
    const checkAudioPreference = async () => {
      const savedPreference = await AsyncStorage.getItem('audio_enabled');
      const newAudioEnabled = savedPreference === 'true';
      if (isAudioEnabled !== newAudioEnabled) {
        setIsAudioEnabled(newAudioEnabled);
      }
    };

    const interval = setInterval(checkAudioPreference, 1000);
    return () => {
      clearInterval(interval);
      cleanupAudio();
    };
  }, []);

  const loadAudioPreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem('audio_enabled');
      setIsAudioEnabled(savedPreference === 'true');
    } catch (error) {
      console.error('Error loading audio preference:', error);
    }
  };

  const initializeAudioContext = async () => {
    if (Platform.OS !== 'web' || isAudioInitialized) return;

    try {
      // Create new audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume the context (needed for iOS)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setIsAudioInitialized(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  };

  const cleanupAudio = () => {
    try {
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (leftOscillatorRef.current) {
        leftOscillatorRef.current.stop();
        leftOscillatorRef.current.disconnect();
        leftOscillatorRef.current = null;
      }
      if (rightOscillatorRef.current) {
        rightOscillatorRef.current.stop();
        rightOscillatorRef.current.disconnect();
        rightOscillatorRef.current = null;
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  const startBinauralBeats = async () => {
    if (!isAudioEnabled || Platform.OS !== 'web') return;

    try {
      cleanupAudio();
      
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        await initializeAudioContext();
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Create and configure gain node
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.connect(ctx.destination);

      // Create and configure left oscillator
      leftOscillatorRef.current = ctx.createOscillator();
      leftOscillatorRef.current.type = 'sine';
      leftOscillatorRef.current.frequency.setValueAtTime(LEFT_FREQUENCY, ctx.currentTime);
      
      // Create stereo panner for left channel
      const leftPanner = ctx.createStereoPanner();
      leftPanner.pan.value = -1;
      leftOscillatorRef.current.connect(leftPanner);
      leftPanner.connect(gainNodeRef.current);

      // Create and configure right oscillator
      rightOscillatorRef.current = ctx.createOscillator();
      rightOscillatorRef.current.type = 'sine';
      rightOscillatorRef.current.frequency.setValueAtTime(RIGHT_FREQUENCY, ctx.currentTime);
      
      // Create stereo panner for right channel
      const rightPanner = ctx.createStereoPanner();
      rightPanner.pan.value = 1;
      rightOscillatorRef.current.connect(rightPanner);
      rightPanner.connect(gainNodeRef.current);

      // Start oscillators
      leftOscillatorRef.current.start();
      rightOscillatorRef.current.start();

      // Gradually increase volume
      gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(AUDIO_GAIN, ctx.currentTime + 1);

      // Ensure context is running
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch (error) {
      console.error('Error starting binaural beats:', error);
    }
  };

  const stopBinauralBeats = async () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        // Fade out audio
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.5);
        
        // Clean up after fade out
        setTimeout(cleanupAudio, 500);
      } else {
        cleanupAudio();
      }
    } catch (error) {
      console.error('Error stopping binaural beats:', error);
    }
  };

  // Monitor audio enabled state changes
  useEffect(() => {
    if (isActive) {
      if (isAudioEnabled) {
        startBinauralBeats();
      } else {
        stopBinauralBeats();
      }
    }
  }, [isAudioEnabled, isActive]);

  const timerStyle = useAnimatedStyle(() => {
    return {
      opacity: withSequence(
        withDelay(2000, withTiming(0, { duration: 1000 })),
        withDelay(
          remainingTime > 5 ? (remainingTime - 5) * 1000 : 0,
          withTiming(1, { duration: 1000 })
        )
      ),
      transform: [
        {
          scale: withTiming(0.6, {
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
          }),
        },
      ],
      top: withTiming(WINDOW_HEIGHT - 200, {
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
      }),
    };
  }, [remainingTime]);

  const flicker = (timestamp: number) => {
    if (!lastFrameTimeRef.current) {
      lastFrameTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastFrameTimeRef.current;

    if (elapsed >= HALF_PERIOD) {
      isBlackRef.current = !isBlackRef.current;
      setIsBlack(isBlackRef.current);
      lastFrameTimeRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(flicker);
  };

  useEffect(() => {
    if (isActive) {
      lastFrameTimeRef.current = 0;
      isBlackRef.current = false;
      sessionStartTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(flicker);
      if (isAudioEnabled) {
        startBinauralBeats();
      }
      setShowTimer(true);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        stopBinauralBeats();
      };
    } else {
      setShowTimer(true);
    }
  }, [isActive]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          setProgress(newTime / (duration * 60));
          if (newTime <= 0) endSession();
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isActive, remainingTime]);

  const handleStarPass = () => {
    setStarCount(prev => prev + 1);
  };

  const toggleSession = () => {
    if (!isActive) {
      setShowInstructionModal(true);
    }
  };

  const startSession = () => {
    setShowInstructionModal(false);
    setRemainingTime(duration * 60);
    setProgress(1);
    setIsActive(true);
    setStarCount(0);
    sessionStartTimeRef.current = Date.now();
  };

  const endSession = () => {
    const actualDuration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    stopBinauralBeats();
    lastFrameTimeRef.current = 0;
    isBlackRef.current = false;
    setIsBlack(false);
    setShowTimer(true);
    setShowCompletionModal(true);
    
    saveSession({
      date: new Date(),
      duration: duration * 60,
      actualDuration: actualDuration,
      completed: actualDuration >= duration * 60
    });
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setRemainingTime(newDuration * 60);
    setProgress(1);
    setShowDurationPicker(false);
  };

  if (isActive) {
    return (
      <View style={[
        styles.flickerContainer,
        { backgroundColor: isBlack ? '#000000' : '#FFFFFF' }
      ]}>
        <FloatingObjects onStarPass={handleStarPass} />
        <View style={styles.contentOverlay}>
          <View style={styles.statusContainer}>
            <TherapyStatus isActive={isActive} frequency={FREQUENCY} />
          </View>
          <Animated.View style={[styles.timerContainer, timerStyle]}>
            <Timer remainingTime={remainingTime} progress={progress} />
          </Animated.View>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={endSession}
            activeOpacity={0.7}
          >
            <Text style={styles.stopButtonText}>STOP SESSION</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Compassionate Light Therapy for Alzheimer's Care</Text>
              <Text style={styles.heroSubtitle}>
                A scientifically-designed 40Hz light therapy to support cognitive function and enhance quality of life.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={[styles.sessionCard, isDarkMode && styles.darkSessionCard]}>
            <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Begin Your Therapy Session</Text>
            <Text style={[styles.cardDescription, isDarkMode && styles.darkDescription]}>
              Select your preferred duration and start your personalized light therapy treatment.
            </Text>
            
            <SessionControls
              duration={duration}
              showPicker={showDurationPicker}
              onDurationPress={() => setShowDurationPicker(true)}
              onDurationChange={handleDurationChange}
              onDurationPickerClose={() => setShowDurationPicker(false)}
              isDarkMode={isDarkMode}
            />
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={toggleSession}
              activeOpacity={0.7}
            >
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>START SESSION</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
            <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>Important Information</Text>
            <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
              40Hz light therapy has shown promising results in supporting cognitive health and potentially reducing the progression of neurodegenerative conditions.
            </Text>
            <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
              Always consult with your healthcare provider before starting any new therapy regimen.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Instruction Modal */}
      <Modal
        visible={showInstructionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Count the Stars!</Text>
            <Text style={styles.modalMessage}>
              During your therapy session, try to count how many yellow stars float across your screen. This simple task helps maintain focus and engagement during the session.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowInstructionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={startSession}
              >
                <Text style={styles.confirmButtonText}>Start Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Complete!</Text>
            <Text style={styles.modalMessage}>
              Great job! During your session, you counted {starCount} yellow stars floating across the screen.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { width: '100%' }]}
                onPress={() => {
                  setShowCompletionModal(false);
                  setStarCount(0);
                }}
              >
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  flickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 40,
  },
  statusContainer: {
    width: '100%',
    paddingTop: 20,
  },
  timerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  heroContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(79, 70, 229, 0.85)',
    justifyContent: 'center',
    padding: 24,
  },
  heroContent: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 28,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    marginTop: -48,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 24,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 24,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  stopButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  confirmButton: {
    backgroundColor: '#6366F1',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  darkSessionCard: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkDescription: {
    color: '#E5E5EA',
  },
  darkInfoBox: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  darkInfoText: {
    color: '#E5E5EA',
  },
});