# yt-downloader

## Descrição
O `yt-downloader` é uma aplicação de linha de comando que permite baixar vídeos e áudios do YouTube. O usuário pode escolher a qualidade do vídeo ou áudio desejado e o arquivo será salvo localmente.

## Funcionalidades
- Baixar vídeos do YouTube em diferentes qualidades.
- Baixar apenas o áudio de vídeos do YouTube.
- Interface interativa no terminal para facilitar a escolha da qualidade do download.
- Criação automática de um diretório `videos` para armazenar os arquivos baixados.

## Tecnologias Utilizadas
- Node.js: Plataforma de desenvolvimento.
- @distube/ytdl-core: Biblioteca para obter informações e baixar vídeos do YouTube.
- readline: Módulo nativo do Node.js para interação com o usuário no terminal.
- fs: Módulo nativo do Node.js para manipulação de arquivos.
- path: Módulo nativo do Node.js para manipulação de caminhos de arquivos.

## Como Usar
1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/yt-downloader.git
   ```
2. Navegue até o diretorio padrão do projeto:
    ```sh
    cd yt-downloader
    ```
3. Instale as dependências:
    ```sh
    npm install
    ```
4. Inicie a aplicação:
    ```sh
    npm start
    ```
## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

