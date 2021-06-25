/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Gherkin Web Playwright Given
 */
'use strict';

const { Given, When, Then } = require(`${process.cwd()}/node_modules/cucumber`);
const { expect } = require('chai');
const { WebBuilder } = require('./autokin-web');
const Store = require('../autokin-store');

Given('that I have existing session', async () => {
    // filler
});

Given('that an application is hosted at {string}', async (domain) => {
    await WebBuilder.host(domain);
});

Given('that I have access to {string}', async (domain) => {
    await WebBuilder.host(domain);
});

Given(
    'that I set the browser window size to {string} and {string}',
    async (width, height) => {
        await WebBuilder.sanitizeWindowSize([width, height].join(','));
    }
);

Given('that I emulate as {string} device', async (device) => {
    await WebBuilder.emulate(device);
});

Given('that I set mode to {string} with {string}', async (mode, options) => {
    await WebBuilder.switchMode(mode, options);
});

Given(
    'that I set the browser window size to {int} and {int}',
    async (width, height) => {
        await WebBuilder.windowSize(width, height);
    }
);

Given('that I mock API with', async (mockData) => {
    await WebBuilder.mock(mockData);
});

Given('that I mock URL with', async (mockData) => {
    await WebBuilder.mock(mockData);
});

Given('that I mock API with {string}', async (filePath) => {
    await WebBuilder.mockWith(filePath);
});

Given('that I reload the page', async () => {
    await WebBuilder.reload();
});

Given('that I use {string}', async (browser) => {
    await WebBuilder.setBrowserType(browser);
});

When('I navigate to {string}', async (url) => {
    await WebBuilder.navigate(url);
});

Then('I type {string} in field {string}', async (value, selector) => {
    await WebBuilder.type(selector, value);
});

Then('I set {string} in field {string}', async (value, selector) => {
    await WebBuilder.typeThruDocument(selector, value);
});

Then('I click on {string}', async (selector) => {
    await WebBuilder.click(selector);
});

Then('I click element {string}', async (selector) => {
    await WebBuilder.clickThruDocument(selector);
});

Then('I left mouse click on {string}', async (selector) => {
    await WebBuilder.mouseClick(selector);
});

Then('I hover on {string}', async (selector) => {
    await WebBuilder.hover(selector);
});

Then('I clear the value of {string} selector', async (selector) => {
    await WebBuilder.clearValue(selector);
});

Then('I take a screenshot as {string}', async (path) => {
    await WebBuilder.screenshot(path);
});

Then(
    'I expect that selector {string} has the text of {string}',
    async (selector, expectedValue) => {
        const value = await WebBuilder.text(selector);
        expect(expectedValue).to.eql(value);
    }
);

Then(
    'I expect that selector {string} has the value of {string}',
    async (selector, expectedValue) => {
        const value = await WebBuilder.value(selector);
        expect(Store.sanitize(expectedValue)).to.eql(value);
    }
);

Then(
    'I expect that selector {string} contains {string}',
    async (selector, expectedValue) => {
        const value = await WebBuilder.text(selector);
        expect(value).contains(Store.sanitize(expectedValue));
    }
);

Then('I expect that selector {string} exists', async (selector) => {
    const exists = await WebBuilder.exists(selector);
    expect(exists).to.be.true;
});

Then('I wait until network is idle', async () => {
    await WebBuilder.waitUntil();
});

Then('I wait until {int} seconds elapsed', async (ms) => {
    await WebBuilder.waitFor(ms * 1000);
});

Then(
    'I store the value from {string} as {string}',
    function (selector, key, callback) {
        WebBuilder.keep(key, selector);
        callback();
    }
);
