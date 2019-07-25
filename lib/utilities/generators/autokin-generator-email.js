/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - email
 */
module.exports = function email(domain = 'autokinjs.com') {
    const any = require('./autokin-generator-any');
    return any(6, { lowercase: true, numbers: true })
        .concat('.')
        .concat(any(6, { lowercase: true, numbers: true }))
        .concat('@')
        .concat(domain);
};
