/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utilities - asJSON
 */
module.exports = function asJSON(content) {
    try {
        let data = JSON.parse(content);
        return data;
    } catch (e) {
        return undefined;
    }
};