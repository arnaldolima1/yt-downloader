import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import { PermissionsAndroid } from "react-native";

interface DownloadProps {
  URL: string;
  quality: string;
}

const requestPermissions = async () => {
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted) throw new Error("Permissão negada!");
  return permissions.directoryUri;
};

const requestExternalStoragePermission = async () => {
  if (Platform.OS === "android" && Platform.Version === 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Permissão de Armazenamento",
        message:
          "O aplicativo precisa de permissão para gravar no armazenamento.",
        buttonNeutral: "Pergunte-me depois",
        buttonNegative: "Cancelar",
        buttonPositive: "OK",
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error("Permissão para acessar o armazenamento negada");
    }
  }
};

export default async function Download({ URL, quality }: DownloadProps) {
  try {
    const encodedURL = encodeURIComponent(URL);

    const result = await FileSystem.downloadAsync(
      `http://192.168.3.209:3001/download?url=${encodedURL}&itag=${quality}`,
      FileSystem.documentDirectory + "temp.mp4"
    );

    if (result.status !== 200) throw new Error("Falha no download. API error");

    const title = decodeURIComponent(
      result.headers["Content-Disposition"]?.match(
        /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i
      )?.[1] || "sem_nome"
    ).replace(/\.[^/.]+$/, "");

    const mimeType = decodeURIComponent(result.headers["Content-Type"]);

    const newPath = FileSystem.documentDirectory + title;

    await FileSystem.moveAsync({
      from: result.uri,
      to: newPath,
    });

    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      await requestPermissions(),
      title,
      mimeType
    );

    const fileData = await FileSystem.readAsStringAsync(newPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.writeAsStringAsync(fileUri, fileData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return { success: true, message: `Arquivo salvo com sucesso!` };
  } catch (error: any) {
    console.error("Erro no download:", error.message || error);
    return { success: false, message: error.message || "Erro desconhecido" };
  }
}

// console.log("Iniciando download...");

// if (!URL) throw new Error("URL não pode estar vazia");

// const encodedURL = encodeURIComponent(URL);
// console.log(`URL codificada: ${encodedURL}`);

// const response = await fetch(
//   `https://youtube-api-ebon.vercel.app/download?url=${encodedURL}&itag=${quality}`
//`http://192.168.3.209:3001/download?url=${encodedURL}&itag=${quality}`,
// );

// if (!response.ok) {
//   throw new Error(`Erro da API: ${response.status} ${response.statusText}`);
// }

// console.log("Requisição bem-sucedida.");

// const contentDisposition = response.headers.get("content-disposition");
// let fileName = "arquivo_desconhecido";

// if (contentDisposition) {
//   const match = contentDisposition.match(/filename="(.+?)"/);
//   if (match && match[1]) fileName = match[1];
// }

// const mimeType = response.headers.get("content-type") || "";
// const isAudio = mimeType.includes("audio");
// const fileExtension = isAudio ? ".mp3" : ".mp4";

// fileName = fileName.replace(/\.[^/.]+$/, "") + fileExtension;

// console.log(`Nome do arquivo: ${fileName}`);
// console.log(`Tipo de mídia: ${mimeType}`);

// const hasPermission = await requestPermissions();
// if (!hasPermission) throw new Error("Permissão negada.");

// const tempFileUri = FileSystem.documentDirectory + fileName;

// console.log(`Caminho do arquivo temporário: ${tempFileUri}`);

// const base64 = await FileSystem.readAsStringAsync(tempFileUri, {
//   encoding: FileSystem.EncodingType.Base64,
// });

// // Caminho para salvar o arquivo

// console.log("Baixando arquivo...");
// const fileDownload = await FileSystem.downloadAsync(
//   response.url,
//   tempFileUri
// );

// if (!fileDownload || !fileDownload.uri) {
//   throw new Error("Falha ao baixar o arquivo.");
// }

// console.log(`Arquivo baixado em: ${fileDownload.uri}`);

// const fileInfo = await FileSystem.getInfoAsync(tempFileUri);
// if (!fileInfo.exists) {
//   throw new Error("Arquivo não encontrado após download.");
// }

// console.log("Salvando na biblioteca de mídia...");
// const asset = await MediaLibrary.createAssetAsync(tempFileUri);
// console.log(`Asset criado: ${asset.id}`);

// const albumName = isAudio ? "Music" : "Videos";
// await createAlbumAndAddAsset(asset, albumName);

// console.log("Download e salvamento concluídos!");
