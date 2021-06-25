/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Gherkin Mobile Steps
 */
'use strict';

const { Given, When, Then } = require(`${process.cwd()}/node_modules/cucumber`);
const { expect } = require('chai');
const { MobileBuilder } = require('./autokin-mobile');
const { Store } = require('../autokin');


Given('that I set {string} as platform with version of {string}', async (platform, version) => {
    await MobileBuilder.platform(platform, version);
});

Given('that I set {string} as device', async (deviceName) => {
    await MobileBuilder.deviceName(deviceName);
});

Given('that app is located at {string}', async (appPathOrURL) => {
    await MobileBuilder.appLocation(appPathOrURL);
});

When('I create new session on {string}', async (appiumServer) => {
    if(MobileBuilder.hasApp()) {
        await MobileBuilder.initialize(appiumServer);
    } else {
        return Promise.reject('Application location must be supplied before creating new session.');
    }
});

Then(/^I wait (.*) seconds$/, async (waitTime) => {
    await MobileBuilder.waitFor(waitTime);
});

Then('I capture mobile screen as {string}', async path => {
    await MobileBuilder.capture(path);
});

Then(/^I swipe to the (.*)$/, async direction => {
    await MobileBuilder.swipe(direction);
});

Then('I tap on element with accessibility id of {string}', async id => {
    let target = await MobileBuilder.accessibilityId(id);
    await MobileBuilder.tap(target);
});

Then('I tap on element with xpath of {string}', async id => {
    let target = await MobileBuilder.xpath(id);
    await MobileBuilder.tap(target);
});

Then(/^I tap on (.*), (.*)$/, async (x, y) => {
    await MobileBuilder.tapWithCoordinates(x, y);
});

Then('I set {string} value to element with accessibility id of {string}', async (value, id) => {
    let target = await MobileBuilder.accessibilityId(id);
    await MobileBuilder.text(target, value);
});

Then('I set {string} value to element with xpath of {string}', async (value, id) => {
    let target = await MobileBuilder.xpath(id);
    await MobileBuilder.text(target, value);
});

Then('I expect element with accessibility id of {string} has value {string}', async (id, valueExpect) => {
    let target = await MobileBuilder.accessibilityId(id);
    let value = await MobileBuilder.text(target);
    expect(value).to.eql(Store.sanitize(valueExpect));
});

Then('I expect element with xpath of {string} has value {string}', async (id, valueExpect) => {
    let target = await MobileBuilder.xpath(id);
    let value = await MobileBuilder.text(target);
    expect(value).to.eql(Store.sanitize(valueExpect));
});

Then('I expect device keyboard is visible', async () => {
    let deviceDriver = await MobileBuilder.getDriver();
    let isShown = await deviceDriver.isKeyboardShown();
    expect(isShown).to.eql(true);
});

Then('I hide device keyboard', async () => {
    let deviceDriver = await MobileBuilder.getDriver();
    await deviceDriver.hideDeviceKeyboard();
});

Then('I shake the device', async () => {
    let deviceDriver = await MobileBuilder.getDriver();
    await deviceDriver.shake();
});

Then(/^I make the app run in the background and make active after (.*) seconds$/, async (timeout) => {
    let deviceDriver = await MobileBuilder.getDriver();
    await deviceDriver.backgroundApp(MobileBuilder.resolveInt(timeout));
});

Then('I close the session', async () => {
    await MobileBuilder.closeSession();
});