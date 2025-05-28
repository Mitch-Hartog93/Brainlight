import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface TherapyStatusProps {
  isActive: boolean;
  frequency: number;
}

export default function TherapyStatus({ isActive, frequency }: TherapyStatusProps) {
  const [animation] = React.useState(new Animated.Value(0));
  
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.setValue(0);
    }
    
    return () => {
      animation.stopAnimation();
    };
  }, [isActive]);
  
  const pulseStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.4],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Animated.View style={[styles.statusIndicator, isActive && styles.activeIndicator, pulseStyle]} />
        <Text style={styles.statusText}>
          {isActive ? 'THERAPY ACTIVE' : 'THERAPY INACTIVE'}
        </Text>
      </View>
      <Text style={styles.frequencyText}>
        {frequency} Hz Stimulation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 0,
    paddingTop: 80, // Increased from 40 to move it higher
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8E8E93',
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});