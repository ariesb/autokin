/*
 * Copyright 2020 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Lookups - file
 */
const fs = require('fs');

module.exports = (definitions) => {
    const filepath = definitions.shift();
    const data = fs.readFileSync(filepath);
    return data;
};
