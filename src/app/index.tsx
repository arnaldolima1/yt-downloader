import * as React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import Download from "@/actions/Download";
import { Youtube } from "@/lib/icons/YouTube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@/lib/icons/RefresCw";
import { Rotate } from "@/components/animated/Rotate";
import { CustomSelect } from "@/components/CustomSelect";
import { ArrowDownToLine } from "@/lib/icons/ArrowDownToLine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Screen() {
  const [url, setUrl] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [quality, setQuality] = React.useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!url) {
        toast.info("Invalid URL");
        return;
      }

      if (!quality) {
        toast.info("Select a quality option");
        return;
      }

      const response = await Download({ URL: url, quality });

      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-lg p-6 rounded-2xl">
        <CardHeader className="items-center">
          <Youtube className="text-foreground" size={36} />
          <CardTitle className="py-2 text-center">YouTube Downloader</CardTitle>
        </CardHeader>

        <CardContent>
          <View className="flex flex-row items-center justify-center w-full px-4">
            <View className="flex flex-row items-center gap-2">
              <CustomSelect
                onValueChange={setQuality}
                options={options}
                className="w-32"
                contentClassName="w-44"
                placeholder="Quality"
              />

              <Input
                value={url}
                onChangeText={setUrl}
                className="w-52"
                placeholder="https://youtbe.com"
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />

              <Button
                variant="secondary"
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Rotate duration={500}>
                    <RefreshCw className="text-foreground" />
                  </Rotate>
                ) : (
                  <ArrowDownToLine className="text-foreground" size={20} />
                )}
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
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
