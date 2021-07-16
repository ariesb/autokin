/*
 * Copyright 2020 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Lookups - file
 */
const fs = require('fs');

const get = (filepath) => {
    const data = fs.readFileSync(filepath);
    return data;
};

exports.file = (definitions, fromCache, cacheFn, sanitizeFn) => {
    const filepath = definitions.shift();
    return get(sanitizeFn(filepath));
};
