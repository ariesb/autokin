/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Gherkin REST Steps
 */
'use strict';

const { Before, Given, When, Then } = require('cucumber');
const { expect } = require('chai');
const { RestBuilder, Utils } = require('./autokin');

const Builder = new RestBuilder();

Before(function () {
    Builder.reset();
});

Before({ tags: '@todo' }, function() {
    return 'pending';
});

Before({ tags: '@skip' }, function() {
    return 'skipped';
});

Given(/^that a secure endpoint is up at (.*)$/, function (domain) {
    Builder.host(domain);
});

Given(/^that an endpoint is up at (.*)$/, function (domain) {
    Builder.host(domain, false);
});

Given(/^I set (.*) header to (.*)$/, function (name, value, callback) {
    Builder.header(name, value);
    callback();
});

Given('I set {word} header from {string}', function (name, keepVariable, callback) {
    Builder.header(name, Builder.resolve(keepVariable));
    callback();
});

Given('I set headers to', function(headers, callback) {
    headers.hashes().forEach(header => {
        Builder.header(header.name, header.value);
    });
    callback();
});

Given('I set the JSON body to', function (body, callback) {
    Builder.body(body);
    callback();
});

Given(/^I set query parameter (.*) to (.*)$/, function (name, value, callback) {
    Builder.query(name, value);
    callback();
});

Given('I set query parameter {word} from {string}', function (name, keepVariable, callback) {
    Builder.query(name, Builder.resolve(keepVariable));
    callback();
});

Given('I set query parameters to', function(parameters, callback) {
    parameters.hashes().forEach(parameter => {
        Builder.query(parameter.name, parameter.value);
    });
    callback();
});

Given(/^I set cookie to (.*)$/, function (cookie, callback) {
    Builder.cookie(cookie);
    callback();
});

Given('I set cookie {string} to {string}', function (name, value, callback) {
    Builder.cookie(name.concat('=').concat(value));
    callback();
});

Given('I set cookie {string} from {string}', function (name, keepVariable, callback) {
    Builder.cookie(name.concat('=').concat(Builder.resolve(keepVariable)));
    callback();
});

Given(/^I have basic authentication credentials (.*) and (.*)$/, function (username, password, callback) {
    Builder.basicAuthentication(username, password);
    callback();
});

Given(/^I set the bearer token to (.*)$/, function (token, callback) {
    Builder.header('Authorizationb', 'Bearer '.concat(token));
    callback();
});

Given('I set the bearer token with {string}', function (keepVariable, callback) {
    Builder.header('Authorization', 'Bearer '.concat(Builder.resolve(keepVariable)));
    callback();
});

When(/^I GET (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    });
});

When(/^I POST to (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    }, 'POST');
});

When(/^I PUT to (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    }, 'PUT');
});

When(/^I perform DELETE to (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    }, 'DELETE');
});

When(/^I PATCH to (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    }, 'PATCH');
});

Then('response status code should be {int}', function (httpStatusCode) {
    expect(Builder.Response().statusCode()).to.eql(httpStatusCode);
});

Then('response status code should not be {int}', function (httpStatusCode) {
    expect(Builder.Response().statusCode()).to.not.eq(httpStatusCode);
});

Then('response header {string} should exist', function (name, callback) {
    if(Builder.Response().hasHeader(name)) {
        callback();
    } else {
        callback('Expected header (' + name + ') is missing.');
    }
});

Then('response header {string} should not exist', function (name, callback) {
    if(!Builder.Response().hasHeader(name)) {
        callback();
    } else {
        callback('Expected header (' + name + ') exists.');
    }
});

Then('response header {string} should be {string}', function (name, value) {
    expect(Builder.Response().headerValue(name)).to.eq(value);
});

Then('response header {string} should not be {string}', function (name, value) {
    expect(Builder.Response().headerValue(name)).to.not.eq(value);
});

Then('response body should be valid json', function () {
    expect(Builder.Response().Body().isJSON()).to.eql(true);
});

Then('response body should be json data of', function (docString, callback) {
    let expectedJSON = Utils.asJSON(docString);

    if (!expectedJSON) {
        callback('Expected value is not in JSON format.');
    } else if (!Builder.Response().Body().isJSON()) {
        callback('Response body value is not in JSON format.');
    } else if (!Builder.Response().Body().isSameAs(expectedJSON)) {
        callback('Response is different from expected JSON data.');
    } else {
        callback();
    }
});

Then('I expect that path {string} from body has value of {string}', function (path, value) {
    expect(value).to.eql(Builder.Response().Body().pathValue(path));
});

Then('I expect that path {string} from body has value of {int}', function (path, value) {
    expect(value).to.eql(Builder.Response().Body().pathValue(path));
});

Then('response body should have path {string}', function (path, callback) {
    if (Builder.Response().Body().hasPath(path)) {
        callback();
    } else {
        callback('Expected JSON Path (' + path + ') is missing.');
    }
});

const responseTimeCheckGt = (expectedTime, callback) => {
    if(Builder.Response().responseTime() > expectedTime) {
        callback('Response timed at ' + Builder.Response().responseTime() + 'ms which is greater than expected.');
    } else {
        callback();
    }
};

const responseTimeCheckLt = (expectedTime, callback) => {
    if(Builder.Response().responseTime() < expectedTime) {
        callback('Response timed at ' + Builder.Response().responseTime() + 'ms which is less than expected.');
    } else {
        callback();
    }
};

Then('response time is not greater than {float}ms', responseTimeCheckGt);
Then('response time is not greater than {int}ms', responseTimeCheckGt);
Then('response time is not greater than {float} ms', responseTimeCheckGt);
Then('response time is not greater than {int} ms', responseTimeCheckGt);

Then('response time is greater than {float}ms', responseTimeCheckLt);
Then('response time is greater than {int}ms', responseTimeCheckLt);
Then('response time is greater than {float} ms', responseTimeCheckLt);
Then('response time is greater than {int} ms', responseTimeCheckLt);

Then('I keep the value of body path {string} as {string}', function (path, key, callback) {
    Builder.keep(key, Builder.Response().Body().pathValue(path));
    callback();
});

Then('I keep the value of header {string} as {string}', function (name, key, callback) {
    Builder.keep(key, Builder.Response().headerValue(name));
    callback();
});

Then('I expect that the stored value in {string} is {string}', function (key, value) {
    expect(value).to.eql(Builder.resolve(key));
});