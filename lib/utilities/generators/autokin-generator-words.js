/*
 * Copyright 2020 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - words
 */

module.exports = (definitions = ['en', '']) => {
    const language = definitions.shift();
    let suffix = definitions.shift();
    const allWords = require('./words.json')[language];
    const magicWord = allWords[Math.round(Math.random() * allWords.length)];
    suffix = suffix != null ? ` ${suffix}` : '';
    return `${magicWord}${suffix}`;
};