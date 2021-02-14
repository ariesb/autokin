// const { PuppeteerWebBuilder } = require('./autokin-puppeteer-builder');
// module.exports.WebBuilder = new PlaywrightWebBuilder();
// module.exports = require('./autokin-puppeteer-steps');

// Uncomment only if you would to try web autokin with the new library
const { PlaywrightWebBuilder } = require('./autokin-playwright-builder');
module.exports.WebBuilder = new PlaywrightWebBuilder();
module.exports = require('./autokin-playwright-steps');
