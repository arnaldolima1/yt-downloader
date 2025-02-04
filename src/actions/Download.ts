import { Platform } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

interface DownloadProps {
  URL: string;
  quality: string;
  setProgress: (progress: number) => void;
}

async function fileSave(download: FileSystem.FileSystemDownloadResult) {
  try {
    const title = decodeURIComponent(
      download.headers["content-disposition"]?.match(
        /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i
      )?.[1] || "sem_nome"
    );

    if (Platform.OS === "android") {
      const directoryUri = FileSystem.cacheDirectory + title;

      const base64File = await FileSystem.readAsStringAsync(download.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(directoryUri, base64File, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Sharing.shareAsync(directoryUri);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default async function Download({
  URL,
  quality,
  setProgress,
}: DownloadProps) {
  try {
    const encodedURL = encodeURIComponent(URL);

    const onDownloadProgress = ({
      totalBytesWritten,
      totalBytesExpectedToWrite,
    }: FileSystem.DownloadProgressData) => {
      if (totalBytesExpectedToWrite > 0) {
        const percentage =
          (totalBytesWritten / totalBytesExpectedToWrite) * 100;
        setProgress(Math.min(percentage, 100));

        console.log(percentage)
      }
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      `https://youtube-api-ebon.vercel.app/download?url=${encodedURL}&itag=${quality}`,
      FileSystem.documentDirectory + "temp.mp4",
      {},
      onDownloadProgress
    );

    const result = await downloadResumable.downloadAsync();

    if (result?.status !== 200) {
      setProgress(0);
      throw new Error(result?.headers["x-error-message"] || "API error");
    }

    await fileSave(result);

    return { success: true, message: `Arquivo salvo com sucesso!` };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro desconhecido" };
  }
}


// `https://youtube-api-ebon.vercel.app/download?url=${encodedURL}&itag=${quality}`,

// `http://192.168.3.209:3001/download?url=${encodedURL}&itag=${quality}`,