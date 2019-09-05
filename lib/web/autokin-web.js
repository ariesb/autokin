const { PuppeteerWebBuilder } = require('./autokin-puppeteer-builder');
module.exports.WebBuilder = new PuppeteerWebBuilder();
module.exports = require('./autokin-puppeteer-steps');
