/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - any
 */
module.exports = function any(length, options) {
    const config = options ? options : {
        letters: {
            small: true,
            caps: false
        },
        numbers: false,
        symbols: false
    };

    const universe = 
        (config.letters.small ? "abcdefghijklmnopqratuvwxyz" : "")
        .concat((config.letters.caps ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : ""))
        .concat((config.numbers ? "1234567890" : ""))
        .concat((config.symbols ? "!@#$%^&*()~`-_+=.;:<>?/" : ""));
    
    let _any = "";
    while (_any.length < length) { 
        _any += universe.charAt((Math.random() * universe.length));
    }
    return _any;
};
