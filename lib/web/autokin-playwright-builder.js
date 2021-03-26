const fs = require('fs');
const path = require('path');
const Store = require('../autokin-store');
const { chromium, devices, firefox } = require('playwright');

class PlaywrightWebBuilder {
    constructor() {
        this.browserType = {
            chromium,
            firefox
        };
        this.currentBrowser = 'chromium';
        this.hostUrl = '';
        this.browser = null;
        this.page = null;
        this.httpMocks = {};
    }

    async host(hostUrl) {
        this.hostUrl = Store.sanitize(hostUrl);
        this.browser = await this.browserType[this.currentBrowser].launch();
        this.page = await this.browser.newPage({
            recordVideo: {
                dir: 'videos/',
                size: { width: 800, height: 600 }
            }
        });

        const self = this;

        await this.page.route('**/*', (route, request) => {
            const requestKey = `${request.method()}_${request.url()}`;

            if (!self.httpMocks[requestKey]) {
                return route.continue();
            }

            const mockData = self.httpMocks[requestKey];

            if (mockData.body) {
                return request.fulfill({
                    status: mockData.status,
                    contentType: 'application/json',
                    body: JSON.stringify(mockData.body)
                });
            }
        });
    }

    rgb(color) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        color = color.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result
            ? {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16)
            }
            : null;
    }

    generateImage(image) {
        const jpeg = require('jpeg-js');
        let frameData = Buffer.alloc(image.width * image.height * 4);
        let i = 0;
        while (i < frameData.length) {
            frameData[i++] = this.rgb(image.background).red;
            frameData[i++] = this.rgb(image.background).green;
            frameData[i++] = this.rgb(image.background).blue;
            frameData[i++] = 0xff;
        }
        const rawImageData = {
            data: frameData,
            width: image.width,
            height: image.height
        };
        return jpeg.encode(rawImageData, 50).data;
    }

    async windowSize(width, height) {
        await this.page.setViewportSize({
            width,
            height
        });
    }

    async sanitizeWindowSize(options) {
        let [w, h] = Store.sanitize(options).split(',');
        let width = parseInt(w) || 1400;
        let height = parseInt(h) || 800;
        await this.page.setViewportSize({
            width,
            height
        });
    }

    async emulate(device) {
        const mobileDevice = devices[Store.sanitize(device)] || devices['iPhone X'];
        const context = await this.browser.newContext({
            ...mobileDevice
        });
        this.page = await context.newPage();
    }

    async mock(data) {
        const mockData = Store.sanitizeJson(JSON.parse(data));
        this.httpMocks[`${mockData.method}_${mockData.url}`] = mockData;
    }

    async navigate(urlPath) {
        await this.page.goto(`${this.hostUrl}${Store.sanitize(urlPath)}`, {
            waitUntil: 'networkidle'
        });
    }

    async close() {
        await this.page.close();
        await this.browser.close();
    }

    async screenshot(path) {
        await this.page.screenshot({
            path: `${Store.sanitize(path)}.png`,
            fullPage: true
        });
    }

    async type(selector, value) {
        await this.page.click(Store.sanitize(selector));
        await this.page.type(Store.sanitize(selector), Store.sanitize(value));
    }

    async click(selector) {
        await this.page.click(Store.sanitize(selector));
    }

    async waitUntil() {
        await this.page.waitForNavigation({
            waitUntil: 'networkidle'
        });
    }

    async waitFor(microseconds) {
        await this.page.waitForTimeout(microseconds);
    }

    async text(selector) {
        const text = await this.page.$eval(Store.sanitize(selector), elm => elm.textContent);
        return text;
    }

    async hover(selector) {
        await this.page.hover(Store.sanitize(selector));
    }

    async value(selector) {
        const value = await this.page.$eval(Store.sanitize(selector), elm => elm.value);
        return value;
    }

    async clearValue(selector) {
        await this.page.$eval(Store.sanitize(selector), el => (el.value = ''));
    }

    async reload() {
        await this.page.reload({
            waitUntil: ['networkidle', 'domcontentloaded']
        });
    }

    async mockWith(filePath) {
        const target = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(target)) {
            return;
        }

        let mockConfig = fs.readFileSync(target);
        await this.mock(mockConfig);
    }

    async setBrowserType(browser) {
        this.currentBrowser = browser;
    }
}

module.exports.PlaywrightWebBuilder = PlaywrightWebBuilder;
