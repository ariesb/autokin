/*
 * Copyright 2020 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Lookups - json
 */
const fs = require('fs');
const jp = require('jsonpath');
const asJSON = require('../../autokin-asjson');

const get = (filepath, searchkey) => {
    const data = asJSON(fs.readFileSync(filepath));
    const value = jp.value(data, searchkey);
    return value;
};

exports.json = (definitions, fromCache, cacheFn, sanitizeFn) => {
    const filepath = definitions.shift();
    const searchkey = definitions.shift();
    return get(sanitizeFn(filepath),sanitizeFn(searchkey));
};
