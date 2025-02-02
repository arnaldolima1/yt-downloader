import { useEffect, type ReactNode } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface RotateProps {
  children: ReactNode;
  duration?: number;
  direction?: "clockwise" | "counterclockwise";
}

export function Rotate({
  children,
  duration = 2000,
  direction = "clockwise",
}: RotateProps) {
  const sv = useSharedValue(0);
  const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

  // Define o ângulo com base na direção
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${sv.value * (direction === "clockwise" ? 360 : -360)}deg` },
    ],
  }));

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
  }, []);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
