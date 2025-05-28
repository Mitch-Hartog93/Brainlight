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
const CENTER_X = SCREEN_WIDTH / 2;

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
  const translateX = useSharedValue(-OBJECT_SIZE);
  const translateY = useSharedValue(startY);
  const rotation = useSharedValue(0);
  const hasPassed = useRef(false);
  const hasPassedCenter = useRef(false);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_WIDTH + OBJECT_SIZE, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

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

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: duration * 3,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Check if star passes center of screen
    const intervalId = setInterval(() => {
      const xPos = translateX.value;
      
      if (isYellowStar && !hasPassedCenter.current && xPos >= CENTER_X) {
        hasPassedCenter.current = true;
        onStarPass?.();
      }
      
      // Reset when object goes off screen
      if (xPos <= -OBJECT_SIZE) {
        hasPassedCenter.current = false;
      }
    }, 100);

    return () => clearInterval(intervalId);
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
          duration={6000 + Math.random() * 4000}
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