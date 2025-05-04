// Importa os módulos necessários
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const Tesseract = require('tesseract.js');
const stringSimilarity = require('string-similarity');

const app = express();
const PORT = 3000;

// Configura middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Criação do diretório de uploads se ele não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Diretório de uploads criado em', uploadDir);
}

// Configuração do multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Verifica se a URL informada é do X/Twitter
function isTwitterUrl(url) {
  return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/.test(url);
}

// Função que usa Puppeteer para buscar a bio do usuário no Twitter e verificar se está relacionada a e-sports
async function fetchTwitterInfo(twitterUrl, nomeUsuario) {
  if (!isTwitterUrl(twitterUrl)) {
    throw new Error('URL informada não é do Twitter.');
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/chromium'
  });
  const page = await browser.newPage();
  await page.goto(twitterUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  await page.waitForSelector('div[data-testid="UserDescription"]', { timeout: 10000 });

  const bio = await page.$eval('div[data-testid="UserDescription"]', el => el.innerText);

  await browser.close();

// Lista de palavras-chave relacionadas a e-sports
  const keywords = [
    'furia', 'e-sport', 'esports', 'cs:', 'valorant', 'league of legends', 'cbLOL',
    'fortnite', 'dota', 'overwatch', 'apex', 'cod', 'pubg', 'rocket league',
    'mibr', 'intz', 'loud', 'keyd', 'red canids', 'gaules', 'casimiro', 'fallen', 'yoda', 'brtt',
    'wild rift', 'heroes of the storm', 'rainbow six', 'brawl stars', 'paladins', 'starcraft', 
    'smite', 'hearthstone', 'call of duty', 'valorant', 'r6', 'league', 't1', 'cloud9', 'g2', 'fnatic', 
    'team liquid', 'optic gaming', 'navi', 'astralis', 'mouz', 'heretics', 'envy', 'gen.g', 'splyce', 
    'karmine corp', 'thorin', 'shroud', 'ninja', 'pokimane', 'xqc', 'summit1g', 's1mple', 'zeus', 
    'device', 'zews', 'coldzera', 'olofmeister', 's1mple', 'mouz', 'stephen curry', 'fury', 'gordox',
    'brazilian gamer', 'csgodaily', 'valorantbr', 'gameplay', 'gamerlife', 'gamerfam', 'streamer', 
    'twitch', 'youtube gaming', 'gaminglife', 'gamer', 'gamers', 'gameplay', 'game', 'gamerfam',
    'twitchtv', 'esportsgaming', 'esportsteam', 'gamingcommunity', 'esportsteam', 'gaminghouse', 'gamingmeme',
    'gamersofinstagram', 'esportsnews', 'esportslife', 'esportsfans', 'progaming', 'proplayer', 'gamingnews', 
    'esportscommunity', 'teamdignitas', 'royal never give up', 'lgd', 'ig', 'newbee', 'fnx', 'fellipe', 
    'beastcoast', 'midnight esports', 'brazilianpro', 'fragged', 'clutchgaming', 'csgodaily', 'worldesports', 
    'dreamhack', 'blizzard', 'esportsarena', 'esportsbetting', 'twitchstream', 'mousesports', 'castrol gaming', 
    'blitzcrank', 'frostmagus', 'garena', 'mlg', 'sledgehammer', 'esportsmanship', 'riotsgames', 'battle royale',
    'gamerzgaming', 'cutiepie', 'clash royale', 'supercell', 'esportsaddicts', 'counterstrike', 'respawn', 
    'grandmasters', 'leagueoflegends', 'rts', 'arcade', 'dungeonanddragons', 'callofdutywarzone', 'epicgames',
    'crossfire', 'heroesofthestorm', 'smashbrothers', 'tekken', 'fightinggames', 'worldofwarcraft', 'duelyst', 
    'spacelords', 'fifa', 'rainbowsixsiege', 'aion', 'garena', 'mobilelegends', 'clashofclans', 'genshinimpact', 
    'pubgmobile', 'superpeople', 'huntshowdown', 'streetfighter', 'fallguys', 'fifaonline', 'cardgames', 
    'brawlhalla', 'escapefromtarkov', 'magic the gathering', 'newworld', 'runescape', 'dauntless', 'deadbydaylight',
    'outlawgaming', 'redbullgaming', 'shadowverse', 'titanfall', 'wargaming', 'modernwarfare', 'blackdesertonline', 
    'apexlegends', 'oceanicgaming', 'midgaming', 'gamerdad', 'outlast', 'destiny2', 'halo', 'pubgconsole', 'wowclassic',
    'minecraft', 'clashroyalepro', 'geforce', 'gamersteam', 'xboxesports', 'ps5gaming', 'gaminggear', 'gamingchairs'
  ];
  // Verifica se a bio contém qualquer uma das palavras-chave
  const relacionadoEsports = keywords.some(palavra => bio.toLowerCase().includes(palavra));

  // Caminho para o arquivo de banco de dados local
  const dbPath = path.join(__dirname, 'dados.json');
  const registros = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const index = registros.findIndex(reg => reg.nome.toLowerCase() === nomeUsuario.toLowerCase());

  // Cria novo registro se não existir
  if (index === -1) {
    registros.push({
      nome: nomeUsuario,
      twitter: {
        url: twitterUrl,
        bio,
        relacionadoEsports
      },
      enviadoEm: new Date().toISOString()
    });
  } else {
    // Atualiza o registro existente
    registros[index].twitter = {
      url: twitterUrl,
      bio,
      relacionadoEsports
    };
  }
  // Salva os dados atualizados no arquivo
  fs.writeFileSync(dbPath, JSON.stringify(registros, null, 2));
  return relacionadoEsports;
}

// Rota para upload de documento e validação do nome via OCR e do perfil do Twitter
app.post('/upload', upload.single('documento'), async (req, res) => {
  console.log('Dados recebidos:', req.body);
  console.log('Arquivo recebido:', req.file);

  const dados = req.body;
  const arquivo = req.file ? req.file.path : null;

  const dbPath = path.join(__dirname, 'dados.json');
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]');
  }

  if (!dados.nome?.trim() || !dados.twitterUrl?.trim()) {
    return res.status(400).json({ status: 'erro', mensagem: 'Nome e link do Twitter são obrigatórios!' });
  }

  let textoExtraido = '';
// Utiliza Tesseract para reconhecer texto no documento de imagem enviado
  if (arquivo) {
    try {
      const resultado = await Tesseract.recognize(arquivo, 'por');
      textoExtraido = resultado.data.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      console.log('Texto extraído do documento:', textoExtraido);
// Compara o nome informado com o texto extraído
      const nomeDigitado = dados.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const palavras = textoExtraido.split(/[\n\s,.:;()\[\]"]+/).filter(Boolean);
      let melhoresMatchs = [];
// Verifica similaridade entre o nome informado e trechos do texto extraído
      for (let i = 0; i < palavras.length; i++) {
        const trecho = palavras.slice(i, i + 5).join(' ');
        const score = stringSimilarity.compareTwoStrings(nomeDigitado, trecho);
        melhoresMatchs.push({ trecho, score });
      }

      melhoresMatchs.sort((a, b) => b.score - a.score);
      const melhorMatch = melhoresMatchs[0];
      const nomeValido = melhorMatch.score >= 0.6;

      console.log('Melhor similaridade de nome:', melhorMatch);

      if (!nomeValido) {
        return res.status(400).json({
          status: 'erro',
          mensagem: 'O nome informado não foi encontrado ou está diferente no documento.'
        });
      }

    } catch (erroOCR) {
      console.error('Erro ao processar OCR:', erroOCR);
      return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar o documento.' });
    }
  }

// Salva os dados no arquivo local
  const registros = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const registro = {
    ...dados,
    documento: arquivo,
    enviadoEm: new Date().toISOString()
  };
  registros.push(registro);
  fs.writeFileSync(dbPath, JSON.stringify(registros, null, 2));

// Processa X/Twitter se fornecido
  const twitterUrl = dados.twitterUrl;
  if (twitterUrl) {
    try {
      const relacionado = await fetchTwitterInfo(twitterUrl, dados.nome);
      return res.status(200).json({
        status: 'sucesso',
        relacionadoEsports: relacionado,
        mensagem: 'Verificação concluída com sucesso.'
      });
    } catch (err) {
      return res.status(400).json({ status: 'erro', mensagem: err.message });
    }
  } else {
    return res.status(200).json({
      status: 'sucesso',
      mensagem: 'Dados recebidos com sucesso!'
    });
  }
});
// Rota alternativa para vincular apenas o Twitter ao nome
app.post('/vincular-twitter', async (req, res) => {
  const { twitterUrl, nome } = req.body;

  if (!twitterUrl || !nome) {
    return res.status(400).json({ erro: 'URL do Twitter e nome são obrigatórios.' });
  }

  if (!isTwitterUrl(twitterUrl)) {
    return res.status(400).json({ erro: 'URL fornecida não é um link válido do Twitter.' });
  }

  try {
    const relacionadoEsports = await fetchTwitterInfo(twitterUrl, nome);
    res.json({ sucesso: true, relacionadoEsports });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});