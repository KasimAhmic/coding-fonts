const argv = require('minimist')(process.argv.slice(2));
const puppeteer = require('puppeteer');
const fs = require('fs');
const samples = require('./src/_data/samples.json');

// Get a list of .md files from the fonts folder
const allFonts = fs
  .readdirSync('./src/fonts')
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace('.md', ''));

// Check that the font directory exists
// and create it, if not.
let dir = `src/screenshots/${argv.font}`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

async function takeScreenshot(lang, font, theme) {
  await timeout(5000);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Make High Res
  await page.setViewport({
    width: 800,
    height: 600,
    deviceScaleFactor: 2
  });

  await page.goto(
    `http://localhost:8080/code_samples/${lang}?font=${font}&theme=${theme}`,
    {
      waitUntil: 'networkidle0',
      timeout: 100000
    }
  );

  await page.screenshot({
    path: `src/screenshots/${font}/${lang}-${theme}.png`
  });

  await browser.close();

  Promise.resolve(1);
}

if (argv.all) {
  allFonts.forEach((font) => {
    async function takeScreenshotsSlowly() {
      samples.languages.forEach(async (language) => {
        samples.themes.forEach(async (theme) => {
          console.log('TAKING SCREENSHOT OF: ', language.value, font, theme);
          await takeScreenshot(language.value, font, theme);
          await timeout(5000);
        });
        await timeout(5000);
      });
    }
    takeScreenshotsSlowly();
  });
} else if (argv['all-for-lang']) {
  allFonts.forEach(async (font) => {
    async function takeScreenshotsSlowly() {
      samples.themes.forEach(async (theme) => {
        console.log('TAKING SCREENSHOT OF: ', language.value, font, theme);
        await takeScreenshot(argv['all-for-lang'], font, theme);
      });
    }
    await takeScreenshotsSlowly();
  });
} else {
  console.log('TAKING SCREENSHOT OF: ', argv.lang, argv.font, argv.theme);
  takeScreenshot(argv.lang, argv.font, argv.theme);
}
