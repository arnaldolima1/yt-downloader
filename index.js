const fs = require("fs");
const path = require("path");
const readline = require("readline");
const ytdl = require("@distube/ytdl-core");

// Interface para interação no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para perguntar algo ao usuário
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Função para validar a escolha do usuário
function validateChoice(choice, formats) {
  const index = parseInt(choice) - 1;
  return index >= 0 && index < formats.length ? formats[index] : null;
}

// Função para baixar um vídeo do YouTube
async function downloadYouTubeVideo() {
  try {
    const url = await askQuestion("Digite a URL do vídeo do YouTube: ");

    // Validar o URL
    if (!ytdl.validateURL(url)) {
      console.log("URL inválida. Por favor, insira uma URL válida de um vídeo do YouTube.");
      return;
    }

    // Informações do vídeo
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title.replace(/[\\/:*?"<>|]/g, "_"); // Remover caracteres inválidos para o nome do arquivo

    console.log(`\nTítulo do vídeo: ${title}`);

    // Listar qualidades disponíveis
    const videoFormats = videoInfo.formats.filter(f => f.hasVideo && f.hasAudio);
    const audioFormats = videoInfo.formats.filter(f => !f.hasVideo && f.hasAudio);

    console.log("\nOpções de vídeo com áudio:");
    videoFormats.forEach((format, index) => {
      console.log(`${index + 1}: Qualidade: ${format.qualityLabel}, Tipo: ${format.container}`);
    });

    console.log("\nOpções de áudio apenas:");
    audioFormats.forEach((format, index) => {
      console.log(`${videoFormats.length + index + 1}: Bitrate: ${format.audioBitrate}kbps, Tipo: ${format.container}`);
    });

    const choice = await askQuestion("\nEscolha o número da qualidade desejada: ");
    const format = validateChoice(choice, [...videoFormats, ...audioFormats]);

    if (!format) {
      console.log("Opção inválida. Tente novamente.");
      return;
    }

    // Criar o diretório 'videos' se não existir
    const videosDir = path.join(__dirname, "videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir);
    }

    // Caminho completo para salvar o arquivo
    const extension = format.container || "mp4";
    const outputPath = path.join(videosDir, `${title}.${extension}`);

    console.log(`\nBaixando: ${title}`);

    // Baixar o vídeo/áudio e salvá-lo no diretório
    const videoStream = ytdl(url, { format });
    const writeStream = fs.createWriteStream(outputPath);

    videoStream.pipe(writeStream);

    videoStream.on("progress", (chunkLength, downloaded, total) => {
      const percent = ((downloaded / total) * 100).toFixed(2);
      process.stdout.write(`\rProgresso: ${percent}%`);
    });

    writeStream.on("finish", () => {
      process.stdout.write("\r\x1b[K"); // Limpar a linha de progresso
      console.log(`\nArquivo salvo em: ${outputPath}`);
    });

    videoStream.on("error", (err) => {
      console.error("Erro ao baixar o vídeo:", err.message);
    });

    writeStream.on("error", (err) => {
      console.error("Erro ao salvar o arquivo:", err.message);
    });

  } catch (error) {
    console.error("Erro inesperado:", error.message);
  }
}

// Função principal para executar a aplicação
async function main() {
  let continueDownloading = true;

  while (continueDownloading) {
    await downloadYouTubeVideo();

    const answer = await askQuestion("\nDeseja baixar outro vídeo? (s/n): ");
    continueDownloading = answer.toLowerCase() === "s";
  }

  console.log("Encerrando a aplicação. Até logo!");
  rl.close();
}

main();
