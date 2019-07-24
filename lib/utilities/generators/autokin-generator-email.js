/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - email
 */
module.exports = function email(domain = 'autokinjs.com') {
    const any = require('./autokin-generator-any');
    const email1 = any(6, { letters: { small: true }, numbers: true });
    const email2 = any(6, { letters: { small: true }, numbers: true });
    return `${email1}.${email2}@${domain}`;
};
