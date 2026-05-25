const { chromium } = require('playwright');

console.log('Attempting to launch playwright chromium...');
chromium.launch({ headless: true })
  .then(browser => {
    console.log('SUCCESS launched browser!');
    return browser.close();
  })
  .catch(err => {
    console.error('ERROR launching browser:', err);
  })
  .finally(() => {
    console.log('Done.');
    process.exit(0);
  });
