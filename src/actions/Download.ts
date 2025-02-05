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

    const mimeType = download.headers["content-type"];

    const base64File = await FileSystem.readAsStringAsync(download.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const directoryUri = FileSystem.cacheDirectory + title;

    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        title,
        mimeType
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64File, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch(async (e) => {
          console.log(e);
          await FileSystem.writeAsStringAsync(directoryUri, base64File, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Sharing.shareAsync(directoryUri);
        });
    } else {
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
      throw new Error(result?.headers["X-Error-Message"] || "API error");
    }

    await fileSave(result);

    setProgress(0);

    return { success: true, message: `Arquivo salvo com sucesso!` };
  } catch (error: any) {
    return { success: false, message: error.message || "Erro desconhecido" };
  }
}

// `https://youtube-api-ebon.vercel.app/download?url=${encodedURL}&itag=${quality}`,

// `http://192.168.3.209:3001/download?url=${encodedURL}&itag=${quality}`,
