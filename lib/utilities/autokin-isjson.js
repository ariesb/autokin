/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utilities - isJson
 */
module.exports = function isJSON(content) {
    try {
        JSON.parse(content);
        return true;
    } catch (e) {
        return false;
    }
};
