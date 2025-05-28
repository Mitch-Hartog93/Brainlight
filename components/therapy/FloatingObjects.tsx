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
const OBJECT_SIZE = 36; // Increased size
const START_X = -OBJECT_SIZE;
const END_X = SCREEN_WIDTH + OBJECT_SIZE;

const OBJECTS = [
  { component: Heart, color: '#FF6B6B' }, // Solid colors
  { component: Star, color: '#FFD700' }, // Brighter yellow for stars
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
  const hasCounted = useRef(false);

  useEffect(() => {
    const moveHorizontal = () => {
      translateX.value = START_X;
      hasCounted.current = false;
      translateX.value = withTiming(END_X, {
        duration,
        easing: Easing.linear,
      }, (finished) => {
        if (finished) {
          moveHorizontal();
        }
      });
    };

    setTimeout(moveHorizontal, delay);

    const floatRange = 40; // Increased range
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startY - floatRange, {
            duration: duration / 4,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(startY + floatRange, {
            duration: duration / 4,
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
          duration: duration * 2,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    const checkInterval = setInterval(() => {
      if (isYellowStar && !hasCounted.current && translateX.value > SCREEN_WIDTH / 2) {
        hasCounted.current = true;
        onStarPass?.();
      }
    }, 50);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.floatingObject, style]}>
      <ObjectComponent 
        size={OBJECT_SIZE} 
        color={color}
        strokeWidth={2} // Increased stroke width for better visibility
      />
    </Animated.View>
  );
};

interface FloatingObjectsProps {
  onStarPass?: () => void;
}

export default function FloatingObjects({ onStarPass }: FloatingObjectsProps) {
  const objects = [...Array(6)].map((_, index) => ({ // Reduced number of objects for less clutter
    ...OBJECTS[index % OBJECTS.length],
    isYellowStar: OBJECTS[index % OBJECTS.length].component === Star
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {objects.map((object, index) => (
        <FloatingObject
          key={index}
          delay={index * 3000} // Increased delay between objects
          duration={12000} // Adjusted duration for smoother movement
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