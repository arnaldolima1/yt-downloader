import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

interface DownloadProps {
  URL: string;
  quality: string;
}

const requestPermissions = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
};

const createAlbumAndAddAsset = async (
  asset: MediaLibrary.Asset,
  albumName: string
) => {
  try {
    const albums = await MediaLibrary.getAlbumsAsync();
    const existingAlbum = albums.find((album) => album.title === albumName);

    if (existingAlbum) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], existingAlbum, false);
    } else {
      await MediaLibrary.createAlbumAsync(albumName, asset, false);
    }
  } catch (error) {
    console.error(`Erro ao criar/adicionar ao álbum:`, error);
  }
};

export default async function Download({ URL, quality }: DownloadProps) {
  try {
    console.log("Iniciando download...");

    if (!URL) throw new Error("URL não pode estar vazia");

    const encodedURL = encodeURIComponent(URL);
    console.log(`URL codificada: ${encodedURL}`);

    const response = await fetch(
      `https://youtube-api-ebon.vercel.app/download?url=${encodedURL}&itag=${quality}`
    );

    if (!response.ok) {
      throw new Error(`Erro da API: ${response.status} ${response.statusText}`);
    }

    console.log("Requisição bem-sucedida.");

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "arquivo_desconhecido";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match && match[1]) fileName = match[1];
    }

    const mimeType = response.headers.get("content-type") || "";
    const isAudio = mimeType.includes("audio");
    const fileExtension = isAudio ? ".mp3" : ".mp4";

    fileName = fileName.replace(/\.[^/.]+$/, "") + fileExtension;

    console.log(`Nome do arquivo: ${fileName}`);
    console.log(`Tipo de mídia: ${mimeType}`);

    const hasPermission = await requestPermissions();
    if (!hasPermission) throw new Error("Permissão negada.");

    // Caminho para salvar o arquivo
    const tempFileUri = FileSystem.cacheDirectory + fileName;
    console.log(`Caminho do arquivo temporário: ${tempFileUri}`);

    console.log("Baixando arquivo...");
    const fileDownload = await FileSystem.downloadAsync(
      response.url,
      tempFileUri
    );

    if (!fileDownload || !fileDownload.uri) {
      throw new Error("Falha ao baixar o arquivo.");
    }

    console.log(`Arquivo baixado em: ${fileDownload.uri}`);

    const fileInfo = await FileSystem.getInfoAsync(tempFileUri);
    if (!fileInfo.exists) {
      throw new Error("Arquivo não encontrado após download.");
    }

    console.log("Salvando na biblioteca de mídia...");
    const asset = await MediaLibrary.createAssetAsync(tempFileUri);
    console.log(`Asset criado: ${asset.id}`);

    const albumName = isAudio ? "Music" : "Videos";
    await createAlbumAndAddAsset(asset, albumName);

    console.log("Download e salvamento concluídos!");
    return { success: true, message: `Arquivo salvo em ${albumName}.` };
  } catch (error: any) {
    console.error("Erro no download:", error.message || error);
    return { success: false, message: error.message || "Erro desconhecido" };
  }
}
