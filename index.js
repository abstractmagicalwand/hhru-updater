const puppeteer = require('puppeteer');
const config = require('config');
const chalk = require('chalk');
const appConsole = console;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
    slowMo: 50
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  await page.goto(config.get('url.main'), {timeout: 120000});

  await page.waitForSelector(config.get('selectors.email'));
  await page.click(config.get('selectors.email'));
  await page.type(config.get('selectors.email'), config.get('email'));

  await page.waitForSelector(config.get('selectors.password'));
  await page.click(config.get('selectors.password'));
  await page.type(config.get('selectors.password'), config.get('password'));

  await page.waitForSelector(config.get('selectors.submit'));
  await page.click(config.get('selectors.submit'));

  let isCycle = true;
  while (isCycle) {
    await page.goto(config.get('url.resume'));
    await page.waitForSelector(config.get('selectors.updateButton'));
    await page.click(config.get('selectors.updateButton'));


    const nextTouchTimeLeft = await page.evaluate(
      ({scriptSelector}) => {
        const script = document.querySelector(scriptSelector);
        const params = JSON.parse(script.dataset.params);

        return  params && +params.nextTouchTimeLeft;
      },
      {
        scriptSelector: config.get('selectors.script')
      }
    );

    if (typeof nextTouchTimeLeft === 'number' && !isNaN(nextTouchTimeLeft)) {
      if (nextTouchTimeLeft === 0) {
        appConsole.log('Updated');
      }

      await page.waitFor(nextTouchTimeLeft);
    } else {
      isCycle = false;
      appConsole.log('nextTouchTimeLeft', chalk.red(
        isNaN(nextTouchTimeLeft)
          ? ' is NaN.'
          : ` is ${typeof nextTouchTimeLeft}. Require number.`
      ));
    }
  }

  await browser.close();
})();