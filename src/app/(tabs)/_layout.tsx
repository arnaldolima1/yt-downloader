import { TabBar } from "@/components/TabBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerRight: () => <ThemeToggle /> }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "YTDownloader",
        }}
      />
      <Tabs.Screen name="gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
