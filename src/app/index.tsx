import * as React from "react";
import { toast } from "sonner-native";
import Download from "@/actions/Download";
import { Text } from "@/components/ui/text";
import { Youtube } from "@/lib/icons/YouTube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@/lib/icons/RefresCw";
import { View, SafeAreaView, Image } from "react-native";
import { Progress } from "@/components/ui/progress";
import { Rotate } from "@/components/animated/Rotate";
import { CustomSelect } from "@/components/CustomSelect";
import { ArrowDownToLine } from "@/lib/icons/ArrowDownToLine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorScheme } from "@/lib/useColorScheme";

export default function Screen() {
  const [url, setUrl] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [quality, setQuality] = React.useState<string | undefined>(undefined);
  const [progress, setProgress] = React.useState<number>(0);
  const { isDarkColorScheme } = useColorScheme();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!url) {
        toast.info("Please enter a YouTube URL");
        return;
      }
      if (!quality) {
        toast.info("Select download quality");
        return;
      }

      if (
        !url.startsWith("https://youtube.com/") &&
        !url.startsWith("https://youtu.be/")
      ) {
        toast.info("Invalid URL");
        return;
      }

      const response = await Download({ URL: url, quality, setProgress });
      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Download failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Card className="w-[90%] max-w-md rounded-3xl shadow-2xl">
        <CardHeader className="items-center pt-6 pb-2">
          <Image
            source={isDarkColorScheme ? require("../assets/images/splash-icon.png") : require("../assets/images/splash-icon-dark.png")}
            style={{ width: 100, height: 50 }}
          />
          <CardTitle className="text-foreground text-2xl font-bold pt-2">
            YouTube Downloader
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <View className="gap-4">
            <View className="flex-row gap-1">
              <CustomSelect
                onValueChange={setQuality}
                options={options}
                className="flex-1"
                contentClassName="w-full"
                placeholder="Quality"
              />
              <Input
                value={url}
                onChangeText={setUrl}
                className="flex-[3]"
                placeholder="Paste YouTube URL"
              />
            </View>

            <Button
              variant="secondary"
              onPress={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Rotate duration={500}>
                  <RefreshCw className="text-foreground" />
                </Rotate>
              ) : (
                <View className="flex-row items-center justify-center space-x-2">
                  <ArrowDownToLine className="text-foreground" size={20} />
                  <Text className="text-foreground font-bold">Download</Text>
                </View>
              )}
            </Button>

            {progress > 0 && (
              <View className="gap-2">
                <Progress value={progress} />
                <Text className="text-white text-center">
                  Downloading: {progress.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}

const options = [
  {
    label: "Quality",
    items: [
      { label: "1080p", value: "137" },
      { label: "720p", value: "136" },
      { label: "360p", value: "18" },
      { label: "MP3", value: "140" },
    ],
  },
];
