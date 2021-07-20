/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - Timestamp
 */
module.exports = (definitions) => {
    let offset = 0;
    try{
        offset = parseInt(definitions.shift());    
    } catch(error) {
        offset = 0;
    }
    
    const now = new Date(Date.now() + offset * 1000);
    return now.getTime();
};