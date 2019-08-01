/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Utilities - expectAsSchema
 */
const jsm = require('json-source-map');

exports.expectAsSchema = function expectAsSchema(jsonBody, schemaPath) {
    const path = require('path');
    const schemaResolvedPath = path.resolve(process.cwd(), schemaPath);
    let requiredSchema = {};

    try {
        requiredSchema = require(schemaResolvedPath);
    } catch (e) {
        throw new Error(`Cannot find schema '${schemaResolvedPath}'`);
    }

    const validator = require('tv4').validateMultiple;
    const result = validator(jsonBody, requiredSchema, true, true);

    return result.errors;
};

exports.detailedSchemaErrors = function detailedSchemaErrors(jsonBody, schemaErrors, source) {
    let detailedMessages = [];
    schemaErrors.forEach(ee => {
        const jsonMap = jsm.parse(JSON.stringify(jsonBody, null, 4));
        const result = jsonMap.pointers[ee.dataPath];
        detailedMessages.push({
            source,
            lineNumber: (result && result.key) ? result.key.line + 1 : undefined,
            column: (result && result.key) ? result.key.column : undefined,
            message: ee.message,
            dataPath: ee.dataPath,
            schemaPath: ee.schemaPath
        });
    });

    return JSON.stringify(detailedMessages);
};