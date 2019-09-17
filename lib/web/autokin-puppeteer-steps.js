/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Gherkin Web Puppeteer Given
 */
'use strict';

const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');
const { WebBuilder } = require('./autokin-web');

Given('that an application is hosted at {string}', async domain => {
    await WebBuilder.host(domain);
});

Given('that I set the browser window size to {string} and {string}', async (width, height) => {
    let w = parseInt(width) || 1400;
    let h = parseInt(height) || 800;
    await WebBuilder.windowSize(w, h);
});

Given('that I emulate as {string} device', async (device) => {
    await WebBuilder.emulate(device);
});

Given('that I set mode to {string} with {string}', async (mode, options) => {
    if(mode == 'mobile') {
        await WebBuilder.emulate(options);
    } else {
        let [width, height] = options.split(',');
        let w = parseInt(width) || 1400;
        let h = parseInt(height) || 800;
        await WebBuilder.windowSize(w, h);
    }
});

Given('that I set the browser window size to {int} and {int}', async (width, height) => {
    await WebBuilder.windowSize(width, height);
});

Given('that I mock API with', async (mockData) => {
    await WebBuilder.mock(mockData);
});

Given('that I mock URL with', async (mockData) => {
    await WebBuilder.mock(mockData);
});

Given('that I reload the page', async () => {
    await WebBuilder.reload();
});

When('I navigate to {string}', async url => {
    await WebBuilder.navigate(url);
});

When('I set {string} to input element with {string} selector', async (value, selector) => {
    await WebBuilder.type(selector, value);
});

When('I click on {string}', async selector => {
    await WebBuilder.click(selector);
});

When('I hover on {string}', async selector => {
    await WebBuilder.hover(selector);
});

Then('I take a screenshot as {string}', async path => {
    await WebBuilder.screenshot(path);
});

Then('I expect that selector {string} has the text of {string}', async (selector, expectedValue) => {
    const value = await WebBuilder.text(selector);
    expect(expectedValue).to.eql(value);
});

Then('I expect that selector {string} has the value of {string}', async (selector, expectedValue) => {
    const value = await WebBuilder.value(selector);
    expect(expectedValue).to.eql(value);
});

Then('I wait until network is idle', async () => {
    await WebBuilder.waitUntil();
});

Then('I wait for {int} seconds', async (ms) => {
    await WebBuilder.waitFor(ms * 1000);
});
