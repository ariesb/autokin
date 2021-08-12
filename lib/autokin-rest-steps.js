/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Gherkin REST Steps
 */
'use strict';

const { Before, Given, When, Then, defineParameterType } = require('cucumber');
const { expect } = require('chai');
const { RestBuilder, Utils, Store } = require('./autokin');
const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

let Builder = new RestBuilder();

defineParameterType({
    regexp: /([^"]*)/,
    transformer: function (s) {
        return s == 'true';
    },
    name: 'boolean',
    useForSnippets: false,
});

Before(function (testCase) {
    Builder.reset(testCase);
});

Before({ tags: '@todo' }, function () {
    return 'pending';
});

Before({ tags: '@skip' }, function () {
    return 'skipped';
});

Before({ tags: '@wip' }, function () {
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

Given(
    'I set {word} header from {string}',
    function (name, keepVariable, callback) {
        Builder.header(name, Store.resolve(keepVariable));
        callback();
    }
);

Given('I set headers to', function (headers, callback) {
    headers.hashes().forEach((header) => {
        Builder.header(header.name, header.value);
    });
    callback();
});

Given('I set the JSON body to', function (body, callback) {
    Builder.body(body);
    callback();
});

Given(
    'I set follow redirection to {word}',
    function (followRedirect, callback) {
        Builder.followRedirection(followRedirect === 'true');
        callback();
    }
);

Given(/^I set query parameter (.*) to (.*)$/, function (name, value, callback) {
    Builder.query(name, value);
    callback();
});

Given(
    'I set query parameter {word} from {string}',
    function (name, keepVariable, callback) {
        Builder.query(name, Store.resolve(keepVariable));
        callback();
    }
);

Given('I set query parameters to', function (parameters, callback) {
    parameters.hashes().forEach((parameter) => {
        Builder.query(parameter.name, parameter.value);
    });
    callback();
});

Given('I set form data to', function (formData, callback) {
    Builder.header('Content-Type', 'multipart/form-data');
    formData.hashes().forEach((data) => {
        Builder.form(data.name, data.value, 'formData');
    });
    callback();
});

Given('I set encoded form data to', function (formData, callback) {
    Builder.header('Content-Type', 'application/x-www-form-urlencoded');
    formData.hashes().forEach((data) => {
        Builder.form(data.name, data.value, 'form');
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

Given(
    'I set cookie {string} from {string}',
    function (name, keepVariable, callback) {
        Builder.cookie(name.concat('=').concat(Store.resolve(keepVariable)));
        callback();
    }
);

Given(
    /^I have basic authentication credentials (.*) and (.*)$/,
    function (username, password, callback) {
        Builder.basicAuthentication(username, password);
        callback();
    }
);

Given(/^I set the bearer token to (.*)$/, function (token, callback) {
    Builder.header('Authorization', 'Bearer '.concat(token));
    callback();
});

Given(
    'I set the bearer token with {string}',
    function (keepVariable, callback) {
        Builder.header(
            'Authorization',
            'Bearer '.concat(Store.resolve(keepVariable))
        );
        callback();
    }
);

Given(
    /^I set the request timeout to (.*) seconds$/,
    function (timeout, callback) {
        Builder.timeout(timeout);
        callback();
    }
);

When(/^I GET (.*)$/, function (uri, callback) {
    Builder.process(uri, function (error) {
        if (error) {
            callback(new Error(error));
        }
        callback();
    });
});

When(/^I POST to (.*)$/, function (uri, callback) {
    Builder.process(
        uri,
        function (error) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        },
        'POST'
    );
});

When(/^I PUT to (.*)$/, function (uri, callback) {
    Builder.process(
        uri,
        function (error) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        },
        'PUT'
    );
});

When(/^I perform DELETE to (.*)$/, function (uri, callback) {
    Builder.process(
        uri,
        function (error) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        },
        'DELETE'
    );
});

When(/^I PATCH to (.*)$/, function (uri, callback) {
    Builder.process(
        uri,
        function (error) {
            if (error) {
                callback(new Error(error));
            }
            callback();
        },
        'PATCH'
    );
});

Then('response status code should be {int}', function (httpStatusCode) {
    expect(Builder.Response().statusCode()).to.eql(httpStatusCode);
});

Then('response status code should not be {int}', function (httpStatusCode) {
    expect(Builder.Response().statusCode()).to.not.eq(httpStatusCode);
});

Then('response header {string} should exist', function (name, callback) {
    if (Builder.Response().hasHeader(Store.sanitize(name))) {
        callback();
    } else {
        callback('Expected header (' + Store.sanitize(name) + ') is missing.');
    }
});

Then('response header {string} should not exist', function (name, callback) {
    if (!Builder.Response().hasHeader(Store.sanitize(name))) {
        callback();
    } else {
        callback('Expected header (' + Store.sanitize(name) + ') exists.');
    }
});

Then('response header {string} should be {string}', function (name, value) {
    expect(Builder.Response().headerValue(Store.sanitize(name))).to.eq(
        Store.sanitize(value)
    );
});

Then('response header {string} should not be {string}', function (name, value) {
    expect(Builder.Response().headerValue(Store.sanitize(name))).to.not.eq(
        Store.sanitize(value)
    );
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

Then('I expect that path {string} from body has null value', function (path) {
    expect(null).to.eql(
        Builder.Response().Body().pathValue(Store.sanitize(path))
    );
});

Then(
    'I expect that path {string} from body has value of {string}',
    function (path, value) {
        expect(Store.sanitize(value)).to.eql(
            Builder.Response().Body().pathValue(Store.sanitize(path))
        );
    }
);

Then(
    'I expect that path {string} from body has value of {int}',
    function (path, value) {
        expect(value).to.eql(
            Builder.Response().Body().pathValue(Store.sanitize(path))
        );
    }
);

Then(
    'I expect that path {string} from body has value of {boolean}',
    function (path, value) {
        expect(value).to.eql(
            Builder.Response().Body().pathValue(Store.sanitize(path))
        );
    }
);

Then('response body should have path {string}', function (path, callback) {
    if (Builder.Response().Body().hasPath(Store.sanitize(path))) {
        callback();
    } else {
        callback(
            'Expected JSON Path (' + Store.sanitize(path) + ') is missing.'
        );
    }
});

Then('response body should not have path {string}', function (path, callback) {
    if (!Builder.Response().Body().hasPath(Store.sanitize(path))) {
        callback();
    } else {
        callback(
            'Expected JSON Path (' + Store.sanitize(path) + ') is present.'
        );
    }
});

const responseTimeCheckGt = (expectedTime, callback) => {
    if (Builder.Response().responseTime() > expectedTime) {
        callback(
            'Response timed at ' +
                Builder.Response().responseTime() +
                'ms which is greater than expected.'
        );
    } else {
        callback();
    }
};

const responseTimeCheckLt = (expectedTime, callback) => {
    if (Builder.Response().responseTime() < expectedTime) {
        callback(
            'Response timed at ' +
                Builder.Response().responseTime() +
                'ms which is less than expected.'
        );
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

const extractHtmlPath = (htmlBody, bodyPath, attr) => {
    const root = parse(htmlBody);
    const targetNode = root.querySelector(bodyPath);
    if (targetNode) {
        return targetNode.attributes[attr];
    }
    return null;
};

Then(
    'I keep the value of body path {string} as {string}',
    function (path, key, callback) {
        if (Builder.Response().Body().isJSON()) {
            Builder.keep(
                key,
                Builder.Response().Body().pathValue(Store.sanitize(path))
            );
            callback();
        } else {
            let value = extractHtmlPath(
                Builder.Response().Body().asText(),
                path,
                'value'
            );
            if (value !== null) {
                Builder.keep(key, value);
                callback();
            } else {
                callback(`Given path is not available: ${path}`);
            }
        }
    }
);

Then(
    'extract {string} attribute of {string} from {string} as {string}',
    function (attribute, path, source, key, callback) {
        const htmlBody = Store.resolve(source);
        let value = extractHtmlPath(htmlBody, path, attribute);
        if (value) {
            Builder.keep(key, value);
            callback();
        } else {
            callback(`Given path is not available: ${path}`);
        }
    }
);

Then(
    'I keep the value of header {string} as {string}',
    function (name, key, callback) {
        Builder.keep(key, Builder.Response().headerValue(Store.sanitize(name)));
        callback();
    }
);

Then('I expect that the stored value in {string} is null', function (key) {
    expect(null).to.eql(Store.resolve(Store.sanitize(key)));
});

Then(
    'I expect that the stored value in {string} is {string}',
    function (key, value) {
        expect(value).to.eql(Store.resolve(Store.sanitize(key)));
    }
);

Then(
    'I expect response data schema complies to {string}',
    function (schemaPath, callback) {
        const schemaErrors = Utils.expectAsSchema(
            Builder.Response().Body().asJSON(),
            Store.sanitize(schemaPath)
        );
        if (schemaErrors.length > 0) {
            callback(
                Utils.detailedSchemaErrors(
                    Builder.Response().Body().asJSON(),
                    schemaErrors,
                    Builder.snapshotKey()
                )
            );
        } else {
            callback();
        }
    }
);

Then(
    'I expect that from path of {string} contains {string}',
    function (path, value, callback) {
        if (!Builder.Response().Body().isJSON()) {
            callback(`Given path is not available: ${path}`);
        }

        const matches = Builder.Response()
            .Body()
            .filter(Store.sanitize(path), Store.sanitize(value));
        if (matches.length > 0) {
            callback();
        } else {
            callback(`Expected value does not exists from ${path}`);
        }
    }
);

Then(
    'I expect that from path of {string} not contains {string}',
    function (path, value, callback) {
        if (!Builder.Response().Body().isJSON()) {
            callback(`Given path is not available: ${path}`);
        }

        const matches = Builder.Response()
            .Body()
            .filter(Store.sanitize(path), Store.sanitize(value));
        if (matches.length == 0) {
            callback();
        } else {
            callback(`Expected value exists from ${path}`);
        }
    }
);

Then(
    'I save data from path {string} that contains {string} to file {string}',
    function (jsonpath, value, filepath, callback) {
        if (!Builder.Response().Body().isJSON()) {
            callback(`Given path is not available: ${jsonpath}`);
        }

        const matches = Builder.Response()
            .Body()
            .filter(Store.sanitize(jsonpath), Store.sanitize(value));
        if (matches.length > 0) {
            const destination = Store.sanitize(filepath);
            const folder = path.dirname(destination);
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            fs.writeFileSync(
                destination,
                typeof matches == 'object' ? JSON.stringify(matches) : matches
            );
            callback();
        } else {
            callback(`Expected value does not exists from ${path}`);
        }
    }
);

Then('I save data to file {string}', function (filepath, callback) {
    if (!Builder.Response().Body().isJSON()) {
        callback('Body is not in expected JSON');
    }

    const destination = Store.sanitize(filepath);
    const folder = path.dirname(destination);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    fs.writeFileSync(
        destination,
        JSON.stringify(Builder.Response().Body().asJSON())
    );
    callback();
});

Then('I save filtered data with', (body, callback) => {
    const params = Store.sanitizeJson(JSON.parse(body));
    const matches = Builder.Response()
        .Body()
        .filterObjectKeys(Store.sanitize(params.jsonPath), params.filters);
    if (matches.length > 0) {
        const destination = Store.sanitize(params.filePath);
        const folder = path.dirname(destination);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(
            destination,
            typeof matches == 'object' ? JSON.stringify(matches) : matches
        );
        callback();
    } else {
        callback(`Expected value does not exists from ${path}`);
    }
});
