/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - email
 */
module.exports = (definitions = ['autokinjs.com']) => {
    const domain = definitions.shift();
    const any = require('./autokin-generator-any');
    return any([6, 'lowercase', 'numbers'])
        .concat('.')
        .concat(any([6, 'lowercase', 'numbers']))
        .concat('@')
        .concat(domain);
};
