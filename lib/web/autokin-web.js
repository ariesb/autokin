// const { PuppeteerWebBuilder } = require('./autokin-puppeteer-builder');
const { PlaywrightWebBuilder } = require('./autokin-playwright-builder');
module.exports.WebBuilder = new PlaywrightWebBuilder();
module.exports = require('./autokin-puppeteer-steps');
