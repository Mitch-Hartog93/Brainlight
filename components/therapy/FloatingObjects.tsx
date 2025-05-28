import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Heart, Star } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OBJECT_SIZE = 30;
const START_X = -OBJECT_SIZE;
const END_X = SCREEN_WIDTH + OBJECT_SIZE;
const COUNTING_THRESHOLD = SCREEN_WIDTH / 2;

const OBJECTS = [
  { component: Heart, color: '#FF6B6B' },
  { component: Star, color: '#FFEEAD' },
];

interface FloatingObjectProps {
  delay: number;
  duration: number;
  startY: number;
  ObjectComponent: typeof Heart | typeof Star;
  color: string;
  onStarPass?: () => void;
  isYellowStar?: boolean;
}

const FloatingObject = ({ 
  delay, 
  duration, 
  startY, 
  ObjectComponent, 
  color,
  onStarPass,
  isYellowStar
}: FloatingObjectProps) => {
  const translateX = useSharedValue(START_X);
  const translateY = useSharedValue(startY);
  const rotation = useSharedValue(0);
  const hasCrossedThreshold = useRef(false);

  useEffect(() => {
    // Horizontal movement (left to right only)
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(END_X, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Gentle vertical floating motion
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startY - 40, {
            duration: duration / 3,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(startY + 40, {
            duration: duration / 3,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      )
    );

    // Smooth rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: duration * 2,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Check for star crossing threshold
    const checkInterval = setInterval(() => {
      const currentX = translateX.value;
      
      // Only count yellow stars crossing from left to right
      if (isYellowStar && !hasCrossedThreshold.current && currentX >= COUNTING_THRESHOLD) {
        hasCrossedThreshold.current = true;
        onStarPass?.();
      }
      
      // Reset when object goes off screen to the right
      if (currentX >= END_X) {
        hasCrossedThreshold.current = false;
        translateX.value = START_X;
      }
    }, 50);

    return () => clearInterval(checkInterval);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: withTiming(1, { duration: 1000 }),
  }));

  return (
    <Animated.View style={[styles.floatingObject, style]}>
      <ObjectComponent size={OBJECT_SIZE} color={color} />
    </Animated.View>
  );
};

interface FloatingObjectsProps {
  onStarPass?: () => void;
}

export default function FloatingObjects({ onStarPass }: FloatingObjectsProps) {
  const objects = [...Array(10)].map((_, index) => ({
    ...OBJECTS[index % OBJECTS.length],
    isYellowStar: OBJECTS[index % OBJECTS.length].component === Star
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {objects.map((object, index) => (
        <FloatingObject
          key={index}
          delay={index * 2000}
          duration={8000 + Math.random() * 4000}
          startY={100 + Math.random() * (Dimensions.get('window').height - 200)}
          ObjectComponent={object.component}
          color={object.color}
          onStarPass={object.isYellowStar ? onStarPass : undefined}
          isYellowStar={object.isYellowStar}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingObject: {
    position: 'absolute',
    width: OBJECT_SIZE,
    height: OBJECT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});