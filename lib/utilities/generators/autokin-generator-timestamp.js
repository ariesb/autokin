/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - Timestamp
 */
module.exports = (definitions) => {
    let offset = 0;
    let modifier = 1;
    try{
        offset = parseInt(definitions.shift());    
    } catch(error) {
        offset = 0;
    }

    try {
        modifier = parseInt(definitions.shift()) || 1;
    } catch (error) {
        modifier = 1;
    }

    const now = new Date(Date.now() + offset * 1000);
    return Math.trunc(now.getTime() / modifier);
};