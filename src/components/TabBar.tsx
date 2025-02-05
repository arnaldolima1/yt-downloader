import { View, Platform } from "react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";

import { TabBarButton } from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  const { isDarkColorScheme } = useColorScheme();

  return (
    <View
      className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-row justify-between items-center max-w-xs  rounded-full shadow-lg android:elevation-5 ${
        isDarkColorScheme ? "bg-gray-900" : "bg-white"
      }`}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const renderLabel = () => {
          if (typeof label === "function") {
            return label({
              focused: isFocused,
              color: isFocused ? "#68b2f8" : colors.text,
              position: "below-icon", // ou outra posição esperada
              children: "", // Pode ser necessário dependendo da implementação do label
            });
          }
          return label; // Se for string, apenas retorna
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            route={route}
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#68b2f8" : isDarkColorScheme ? "#fff" : "#000"}
            label={options?.title!}
          />
        );
      })}
    </View>
  );
}
