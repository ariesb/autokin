/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Utilities - expectAsSchema
 */
module.exports = function expectAsSchema(jsonBody, schemaPath) {
    const path = require('path');
    const schemaResolvedPath = path.resolve(process.cwd(), schemaPath);
    const requiredSchema = require(schemaResolvedPath);
    const validator = require('tv4').validateMultiple;
    const result = validator(jsonBody, requiredSchema, true, true);

    return result.errors.map(e => {
        return {
            path: e.dataPath,
            message: e.message
        };
    });
};
