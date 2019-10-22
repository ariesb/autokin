/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin -Appium Mobile Web Builder - MobileBuilder
 */
const fs = require('fs');
const path = require('path');
const colors = require('chalk');
const Store = require('../autokin-store');
const wd = require('wd');

const saveImage = (filename, base64data) => {
    var data = base64data.replace(/^data:image\/\w+;base64,/, '');
    var buf = Buffer.from(data, 'base64');
    fs.writeFileSync(`${filename}.png`, buf);
};

class MobileBuilder {
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

        this.driver = null;
        this.caps = {
            platformName: 'iOS',
            platformVersion: '13.0',
            deviceName: 'iPhone XR',
            app: '',
            autoAcceptAlerts: true,
            autoDismissAlerts: true
        };
    }

    hasApp() {
        return this.caps.app !== '';
    }

    async waitFor(seconds) {
        await this.driver.sleep(Store.sanitize(seconds) * 1000);
    }

    async platform(name, version) {
        this.caps.platformName = Store.sanitize(name);
        this.caps.platformVersion = Store.sanitize(version);
    }

    async deviceName(name) {
        this.caps.deviceName = Store.sanitize(name);
    }

    async appLocation(pathOrURL) {
        this.caps.app = Store.sanitize(pathOrURL);
    }
    
    async initialize(remoteServer) {
        this.driver = wd.promiseChainRemote(Store.sanitize(remoteServer));
        await this.driver.init(this.caps);
    }

    async capture(path) {
        let screenshot = await this.driver.takeScreenshot();
        saveImage(Store.sanitize(path), screenshot);
    }

    async swipe(direction) {
        await this.driver.execute('mobile: swipe', { 
            direction: Store.sanitize(direction)
        });
    }

    async tap(target) {
        await target.click();
    }
    
    async tapWithCoordinates(x, y) {
        await (new wd.TouchAction(this.driver))
            .tap({ 
                x: Store.sanitize(x), 
                y: Store.sanitize(y) })
            .perform();
    }

    async accessibilityId(target) {
        let element = await this.driver.elementByAccessibilityId(Store.sanitize(target));
        return element;
    }

    async xpath(target) {
        let element = await this.driver.elementByXPath(Store.sanitize(target));
        return element;
    }

    async text(target, value = null) {
        if(value) {
            await target.sendKeys(Store.sanitize(value));
        } else {
            return await target.text();
        }
    }

    async getDriver() {
        await this.driver;
    }

    async closeSession() {
        await this.driver.quit();
    }

    resolveInt(intResolveValue) {
        return parseInt(Store.sanitize(intResolveValue));
    }
}

module.exports.MobileBuilder = MobileBuilder;
