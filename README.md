## WaterMark Find Rect

O **WaterMark Find Rect** é uma função em TypeScript desenvolvida para calcular as coordenadas de um retângulo de marca d'água em uma imagem, permitindo a inserção precisa da marca d'água em diferentes posições e tamanhos. A função leva em consideração opções como gravidade, margem e tamanho para determinar a localização e dimensões ideais do retângulo de marca d'água.

### Características

- **Posicionamento Flexível:** Suporte para múltiplas opções de gravidade, incluindo centro, cantos e bordas da imagem.
- **Margem Personalizável:** Define a margem em torno da marca d'água como uma porcentagem do menor lado da imagem.
- **Dimensionamento Adaptável:** Ajusta o tamanho da marca d'água como uma porcentagem do menor lado da imagem, mantendo a proporção original do logotipo.

### Tipos

- **Options:** Permite configurar a gravidade (posição) da marca d'água, a margem (distância das bordas) e o tamanho (dimensões da marca d'água) como porcentagens.
- **Logo:** Representa as dimensões do logotipo a ser usado como marca d'água.
- **Rect:** Define as coordenadas e dimensões do retângulo de marca d'água calculado.

### Implementação

A função `getRect` é responsável por calcular as coordenadas (x, y) e dimensões (largura e altura) do retângulo da marca d'água com base nas seguintes etapas:

1. **Determinação do Lado Menor da Imagem:** Calcula-se o menor lado da imagem para usar como referência no cálculo das dimensões da marca d'água.
2. **Configuração das Opções:** Define-se a gravidade (posição) padrão como "bottom-right", a margem padrão como 4% e o tamanho padrão como 20%, caso essas opções não sejam especificadas.
3. **Cálculo da Margem e Tamanho em Pixels:** Converte as porcentagens de margem e tamanho para valores em pixels com base no menor lado da imagem.
4. **Ajuste das Dimensões da Marca d'Água:** Calcula-se a largura e altura da marca d'água mantendo a proporção original do logotipo. Se a marca d'água exceder as dimensões da imagem, ajusta-se seu tamanho para caber dentro da imagem.
5. **Posicionamento do Retângulo:** Com base na gravidade especificada, calcula-se as coordenadas (x, y) do retângulo para posicionar a marca d'água na imagem.
6. **Correção de Limites:** Assegura-se que o retângulo da marca d'água não exceda os limites da imagem, ajustando as coordenadas se necessário.
7. **Retorno das Coordenadas:** A função retorna as coordenadas (x, y) e dimensões (largura e altura) finais do retângulo da marca d'água, ajustadas para garantir que estejam dentro dos limites da imagem.

Essa implementação permite uma inserção precisa e flexível de marcas d'água em imagens, adaptando-se a diferentes tamanhos e posições conforme necessário.

### Exemplo de Uso

```typescript
import AWS from 'aws-sdk';
import sharp from 'sharp';
import { getRect, Logo, Options, Rect } from './getRect';

// Configuração do AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Função para obter a imagem e a marca d'água do S3
const getImageFromS3 = async (bucket: string, key: string): Promise<Buffer> => {
  const params = { Bucket: bucket, Key: key };
  const data = await s3.getObject(params).promise();
  return data.Body as Buffer;
};

// Função principal para adicionar a marca d'água
const addWatermark = async () => {
  const bucket = 'your-s3-bucket';
  const imageKey = 'path/to/your/image.jpg';
  const watermarkKey = 'path/to/your/watermark.png';

  // Obter imagem e marca d'água do S3
  const [imageBuffer, watermarkBuffer] = await Promise.all([
    getImageFromS3(bucket, imageKey),
    getImageFromS3(bucket, watermarkKey),
  ]);

  // Obter dimensões da imagem e da marca d'água
  const imageMetadata = await sharp(imageBuffer).metadata();
  const watermarkMetadata = await sharp(watermarkBuffer).metadata();

  const image: Logo = { width: imageMetadata.width!, height: imageMetadata.height! };
  const watermark: Logo = { width: watermarkMetadata.width!, height: watermarkMetadata.height! };

  // Definir opções de posicionamento da marca d'água
  const options: Options = {
    gravity: 'bottom-right',
    margin: 2,
    size: 15,
  };

  // Calcular as coordenadas e dimensões do retângulo da marca d'água
  const [x, y, w, h]: Rect = getRect(image, watermark, options);

  // Redimensionar e posicionar a marca d'água na imagem
  const watermarkedImage = await sharp(imageBuffer)
    .composite([
      {
        input: await sharp(watermarkBuffer).resize(w, h).toBuffer(),
        top: y,
        left: x,
      },
    ])
    .toBuffer();

  // Salvar a imagem com a marca d'água de volta no S3
  const outputKey = 'path/to/your/output/image-with-watermark.jpg';
  await s3
    .putObject({
      Bucket: bucket,
      Key: outputKey,
      Body: watermarkedImage,
      ContentType: 'image/jpeg',
    })
    .promise();

  console.log('Imagem com marca d\'água salva no S3:', outputKey);
};

// Executar a função
addWatermark().catch(console.error);
```

### Explicação

1. **Configuração do AWS S3:** Configura o cliente AWS S3 para acessar os blobs.
2. **Função `getImageFromS3`:** Obtém a imagem e a marca d'água do S3.
3. **Função `addWatermark`:** A função principal que:
   - Obtém a imagem e a marca d'água do S3.
   - Obtém as dimensões da imagem e da marca d'água usando o `sharp`.
   - Calcula as coordenadas e dimensões do retângulo da marca d'água usando `getRect`.
   - Redimensiona e posiciona a marca d'água na imagem.
   - Salva a imagem com a marca d'água de volta no S3.

### Dependências

Certifique-se de instalar as dependências necessárias:

```bash
npm install aws-sdk sharp watermark-find-rect
```

Essa implementação mostra como usar a função `getRect` para adicionar uma marca d'água a uma imagem armazenada na AWS S3.
