const fs = require('fs');
const path = require('path');
const Store = require('../autokin-store');
const { chromium } = require('playwright');

class PlaywrightWebBuilder {
    constructor() {
        this.hostUrl = '';
        this.browser = null;
        this.page = null;
        this.httpMocks = {};
    }

    async host(hostUrl) {
        this.hostUrl = Store.sanitize(hostUrl);
        this.browser = await chromium.launch();
        this.page = await this.browser.newPage();

        // TODO should try without self
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

    async mock(data) {
        const mockData = Store.sanitizeJson(JSON.parse(data));
        this.httpMocks[`${mockData.method}_${mockData.url}`] = mockData;
    }

    async navigate(urlPath) {
        await this.page.goto(`${this.hostUrl}${Store.sanitize(urlPath)}`, {
            waitUntil: 'networkidle0'
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

    // TODO 27th Jan: add type and click feature
}

module.exports.PlaywrightWebBuilder = PlaywrightWebBuilder;
