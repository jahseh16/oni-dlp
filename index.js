const puppeteer = require('puppeteer');
const ytDlp = require('yt-dlp-exec');

/* ──────────────────────────────────────────────
 *  ONI-DLP — Capa estética (solo consola/CLI)
 *  No interfiere con la lógica de scraping.
 * ────────────────────────────────────────────── */
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  black: '\x1b[30m',
  white: '\x1b[97m',
  gray: '\x1b[90m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightYellow: '\x1b[93m',
  brightGreen: '\x1b[92m',
  bgBrightRed: '\x1b[101m'
};

const paint = (styles, text) => `${styles.join('')}${text}${ANSI.reset}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function gradientText(text, palette) {
  return text
    .split('')
    .map((ch, i) => (ch === ' ' ? ch : `${palette[i % palette.length]}${ch}${ANSI.reset}`))
    .join('');
}

function printBanner(version) {
  const art = [
    '  ██████╗ ███╗   ██╗██╗      ██████╗ ██╗     ██████╗ ',
    ' ██╔═══██╗████╗  ██║██║      ██╔══██╗██║     ██╔══██╗',
    ' ██║   ██║██╔██╗ ██║██║█████╗██║  ██║██║     ██████╔╝',
    ' ██║   ██║██║╚██╗██║██║╚════╝██║  ██║██║     ██╔═══╝ ',
    ' ╚██████╔╝██║ ╚████║██║      ██████╔╝███████╗██║     ',
    '  ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚══════╝╚═╝     '
  ];

  const border = paint([ANSI.bold, ANSI.brightRed], '═'.repeat(68));

  console.log('');
  console.log(border);
  art.forEach((row) => console.log(paint([ANSI.bold, ANSI.brightRed], row)));
  console.log(border);
  console.log(paint([ANSI.bold, ANSI.white], '              Motor estético de scraping y descargas'));
  console.log(paint([ANSI.dim, ANSI.gray], `              v${version}  //  Núcleo activo`));
  console.log(border);
  console.log('');
}

function printBootLog(version) {
  const rows = [
    { tag: 'CORE',   msg: 'Inicializando núcleo ONI...',       tone: [ANSI.brightRed] },
    { tag: 'ENGINE', msg: 'Motor de extracción sincronizado',  tone: [ANSI.brightMagenta] },
    { tag: 'ENGINE', msg: 'Módulo de renderizado listo',       tone: [ANSI.brightYellow] },
    { tag: 'INFO',   msg: `Versión activa: ${version}`,        tone: [ANSI.brightCyan] }
  ];

  rows.forEach((row) => {
    const badge = paint([ANSI.bgBrightRed, ANSI.black, ANSI.bold], ` ${row.tag} `);
    const msg = paint([ANSI.bold, ...row.tone], row.msg);
    console.log(`  ${badge} ${msg}`);
  });

  console.log('');
}

async function progressBar(label, ms, palette) {
  const width = 34;
  const steps = 24;
  const interval = ms / steps;

  for (let i = 0; i <= steps; i++) {
    const filled = Math.round((i / steps) * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const pct = Math.round((i / steps) * 100);
    const coloredBar = gradientText(bar, palette);
    process.stdout.write(
      `\r  ${paint([ANSI.bold, ANSI.white], label)} [${coloredBar}] ${paint([ANSI.bold, ANSI.brightYellow], pct + '%')}   `
    );
    await sleep(interval);
  }
  process.stdout.write('\n');
}

async function playInstallAnimation() {
  const palette = [ANSI.brightRed, ANSI.brightMagenta, ANSI.brightYellow];

  await progressBar('Compilando núcleo    ', 700, palette);
  await progressBar('Sincronizando motores', 600, palette);
  await progressBar('Optimizando caché     ', 500, palette);

  console.log('');
  const okBadge = paint([ANSI.bgBrightRed, ANSI.white, ANSI.bold], ' OK ');
  console.log(`  ${okBadge} ${paint([ANSI.bold, ANSI.brightGreen], 'ONI-DLP instalado y listo para operar')}`);
  console.log('');

  const igPalette = [ANSI.brightRed, ANSI.brightMagenta, ANSI.brightCyan, ANSI.brightYellow];
  const igLine = gradientText('Sígueme en Instagram: @jahseh_hc', igPalette);
  console.log(`  ${paint([ANSI.brightRed], '>')} ${igLine} ${paint([ANSI.brightRed], '<')}`);
  console.log(paint([ANSI.dim, ANSI.gray], '  ' + '─'.repeat(64)));
  console.log('');
}

async function runInstallShowcase(version) {
  printBanner(version);
  printBootLog(version);
  await playInstallAnimation();
}

/* ──────────────────────────────────────────────
 *  ONI-DLP Core — Motor puro de scraping/descarga
 * ────────────────────────────────────────────── */
class OniDlp {
  constructor() {
    this.version = '1.0.0';
  }

  // Motor YT-DLP puro para el servidor
  async exec(url, options = {}) {
    return await ytDlp(url, options);
  }

  // Motor Puppeteer puro para el servidor
  async scraper(options = {}) {
    return await puppeteer.launch(options);
  }

  async test() {
    return 'OniDlp listo y corriendo, hermano.';
  }
}

const instance = new OniDlp();
module.exports = instance;

/* ──────────────────────────────────────────────
 *  Ejecución única: solo cuando se corre directo
 *  (npm install postinstall / node index.js)
 *  Nunca se dispara al hacer require('oni-dlp')
 * ────────────────────────────────────────────── */
if (require.main === module) {
  runInstallShowcase(instance.version);
}