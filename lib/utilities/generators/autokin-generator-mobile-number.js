/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - MOBILE NUMBER
 * Added by Jonathan Magaru
 */
module.exports = (definitions = ['63']) => {
    const countryCode = definitions.shift();
    return '+'+countryCode+String(Math.random()).substring(2,10);
};