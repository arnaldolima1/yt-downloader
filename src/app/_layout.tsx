import "@/styles/global.css";

import * as React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "@/lib/useColorScheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Toaster } from "sonner-native";
import { useEffect } from "react";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }

    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!isColorSchemeLoaded) {
      return;
    }
    setAndroidNavigationBar(colorScheme);
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "YTDownloader",
              headerRight: () => <ThemeToggle />,
            }}
          />
        </Stack>
        <Toaster
          duration={3000}
          richColors={true}
          visibleToasts={1}
          position="bottom-center"
          swipeToDismissDirection={"left"}
          toastOptions={{
            style: { maxWidth: "65%", maxHeight: 50 },
          }}
        />
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
