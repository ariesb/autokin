/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Generators - any
 */
const any = (length, options) => {   
    const universe = (options.lowercase ? 'abcdefghijklmnopqratuvwxyz' : '')
        .concat(options.uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '')
        .concat(options.numbers ? '1234567890' : '')
        .concat(options.symbols ? '!@#$%^&*()~`-_+=.;:<>?/' : '');

    let _any = '';
    while (_any.length < length) {
        _any += universe.charAt(Math.random() * universe.length);
    }
    return _any;
};

module.exports = (definitions) => {
    const len = parseInt(definitions.shift());
    let anyOptions = {
        lowercase: true,
        uppercase: false,
        numbers: false,
        symbols: false,
    };

    if (definitions.length >= 1) {
        anyOptions = {};
        definitions.forEach((o) => {
            if (o.length > 0) {
                anyOptions[o] = true;
            }
        });
    }
    return any(isNaN(len) ? 10 : len, anyOptions);
};
