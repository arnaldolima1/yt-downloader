import * as React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import Download from "@/actions/Download";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@/lib/icons/RefreshCw";
import { Container } from "@/components/Container";
import { Progress } from "@/components/ui/progress";
import { Rotate } from "@/components/animated/Rotate";
import { useColorScheme } from "@/lib/useColorScheme";
import { CustomSelect } from "@/components/CustomSelect";
import { Youtube } from "@/lib/icons/YouTube";
import { ArrowDownToLine } from "@/lib/icons/ArrowDownToLine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "react-native";

export default function Screen() {
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [quality, setQuality] = React.useState<string | undefined>(undefined);
  const [progress, setProgress] = React.useState(0);
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
    <Container>
      <Card
        style={{ borderWidth: 0 }}
        className="w-full max-w-lg rounded-3xl bg-transparent border-none shadow-transparent"
      >
        <CardHeader className="items-center space-y-4 pt-8">
          <View className="bg-red-600 rounded-2xl">
            <Image
              source={
                isDarkColorScheme
                  ? require("../../assets/images/splash-icon.png")
                  : require("../../assets/images/splash-icon-dark.png")
              }
              style={{ width: 80, height: 50 }}
            />
          </View>
          <CardTitle className="text-foreground text-3xl font-bold mt-2">
            YouTube Downloader
          </CardTitle>
          <Text className="text-muted-foreground text-center">
            Download your favorite YouTube videos in various qualities
          </Text>
        </CardHeader>

        <CardContent className="px-6 space-y-6">
          <View className="flex flex-col gap-2">
            <Input
              value={url}
              onChangeText={setUrl}
              className="w-full h-12 text-lg"
              placeholder="Paste YouTube URL"
            />

            <CustomSelect
              onValueChange={setQuality}
              options={options}
              className="w-full h-12 text-md"
              contentClassName="w-full"
              placeholder="Select Quality"
            />
          </View>

          <Button
            variant={isDarkColorScheme ? "default" : "secondary"}
            onPress={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 mt-3"
          >
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <Rotate duration={500}>
                  <RefreshCw className="text-black" size={20} />
                </Rotate>
                <Text className="text-current font-bold">Processing...</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <ArrowDownToLine className="text-black" size={20} />
                <Text className="text-current font-bold">Download Now</Text>
              </View>
            )}
          </Button>

          {progress > 0 && (
            <View className="flex flex-col gap-1 mt-2">
              <Progress value={progress} className="h-2" />
              <Text className="text-muted-foreground text-center">
                Downloading: {progress.toFixed(1)}%
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

const options = [
  {
    label: "Video Quality",
    items: [
      { label: "HD (1080p)", value: "137" },
      { label: "HD (720p)", value: "136" },
      { label: "SD (360p)", value: "18" },
      { label: "Audio Only (MP3)", value: "140" },
    ],
  },
];
