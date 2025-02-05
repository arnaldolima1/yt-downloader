import { Pressable } from "react-native";
import { useLinkBuilder } from "@react-navigation/native";
import { HomeIcon, ImageIcon, SettingsIcon } from "@/lib/icons/TabIcons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

interface TabBarButtonProps {
  route: { name: string; params?: Readonly<object | undefined> };
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}

export function TabBarButton({
  route,
  isFocused,
  color,
  label,
  routeName,
  onPress,
  onLongPress,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);
  const { buildHref } = useLinkBuilder();

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);
    return { transform: [{ scale: scaleValue }], top };
  });

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 justify-center items-center g-1 p-1 py-3"
    >
      <Animated.View style={animatedIconStyle}>
        {icons[routeName as keyof typeof icons]({
          color,
        }) ?? null}
      </Animated.View>

      <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const icons = {
  index: (props: any) => <HomeIcon size={20} {...props} />,
  gallery: (props: any) => <ImageIcon size={20} {...props} />,
  settings: (props: any) => <SettingsIcon size={20} {...props} />,
};
