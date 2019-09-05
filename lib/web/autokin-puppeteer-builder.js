/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Puppeteer Web Builder - PuppeteerWebBuilder
 */
const path = require('path');
const colors = require('colors');
const Store = require('../autokin-store');
const puppeteer = require('puppeteer');

class PuppeteerWebBuilder {
    constructor() {
        if (process.env.AUTOKIN_VARS) {
            try {
                const autokinVars = require(path.resolve(process.cwd(), process.env.AUTOKIN_VARS));
                Store.merge(autokinVars);
            }
            catch (error) {
                process.stdout.write(colors.red(`Autokin Variables not loaded. Please check file path provided. (${colors.white(process.env.AUTOKIN_VARS)})\n\n`));
            }
        }
        this.hostUrl = '';
        this.browser = null;
        this.page = null;
        this.httpMocks = {};
    }

    async host(hostUrl) {
        this.hostUrl = hostUrl;
        this.browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            ignoreHTTPSErrors: true
        });

        this.page = await this.browser.newPage();
        await this.page.setViewport({
            width: 1400,
            height: 600
        });

        let self = this;
        await this.page.on('request', request => {
            const requestKey = `${request.method()}_${request.url()}`;
            if (self.httpMocks.hasOwnProperty(requestKey)) {
                let mockData = self.httpMocks[requestKey];

                if(mockData.body) {
                    request.respond({
                        status: mockData.status,
                        contentType: 'application/json',
                        body: JSON.stringify(mockData.body)
                    });
                } else {
                    // image
                    let imageBuffer = self.generateImage(mockData.image);
                    request.respond({
                        status: mockData.status,
                        contentType: 'application/octet-stream',
                        body: imageBuffer
                    });
                    
                }

            }
            else {
                request.continue();
            }
        });
    }

    rgb(color) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        color = color.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? {
            red: parseInt(result[1], 16),
            green: parseInt(result[2], 16),
            blue: parseInt(result[3], 16)
        } : null;
    }

    generateImage(image) {
        const jpeg = require('jpeg-js');
        let frameData = Buffer.alloc(image.width * image.height * 4);
        let i = 0;
        while (i < frameData.length) {
            frameData[i++] = this.rgb(image.background).red;
            frameData[i++] = this.rgb(image.background).green;
            frameData[i++] = this.rgb(image.background).blue;
            frameData[i++] = 0xFF;
        }
        const rawImageData = {
            data: frameData,
            width: image.width,
            height: image.height
        };
        return jpeg.encode(rawImageData, 50).data;
    }

    async windowSize(width, height) {
        await this.page.setViewport({
            width,
            height
        });
    }

    async navigate(urlPath) {
        await this.page.goto(`${this.hostUrl}${urlPath}`, { waitUntil: 'networkidle0' });
    }

    async screenshot(path) {
        await this.page.screenshot({
            path: `${path}.png`,
            fullPage: true
        });
    }

    async type(selector, value) {
        await this.page.focus(selector);
        await this.page.keyboard.type(value);
    }

    async click(selector) {
        await this.page.click(selector);
    }

    async waitUntil() {
        await this.page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
    }

    async waitFor(microseconds) {
        await this.page.waitFor(microseconds);
    }

    async text(selector) {
        const elm = await this.page.$(selector);
        const text = await this.page.evaluate(elm => elm.textContent, elm);
        return text;
    }

    async hover(selector) {
        await this.page.hover(selector);
        await this.page.waitFor(50);
    }

    async value(selector) {
        const elm = await this.page.$(selector);
        const text = await this.page.evaluate(elm => elm.value, elm);
        return text;
    }

    async reload() {
        await this.page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    }

    async mock(data) {
        await this.page.setRequestInterception(true);
        const mockData = JSON.parse(data);
        this.httpMocks[`${mockData.method}_${mockData.url}`] = mockData;
    }

    async close() {
        await this.page.close();
        await this.browser.close();        
    }

}

module.exports.PuppeteerWebBuilder = PuppeteerWebBuilder;
