/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utlities - Generators
 */
const methods = require('./methods');
exports.run = (keywords) => {
    let definition = keywords
        .shift()
        .replace(new RegExp('[()]', 'g'), ',')
        .split(',');
    const lookupFn = methods[definition.shift()];
    return lookupFn(definition);
};