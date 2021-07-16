/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utlities
 */

exports.isJSON = require('./autokin-isjson');
exports.asJSON = require('./autokin-asjson');
exports.generators = require('./generators');
exports.lookups = require('./lookups');

const { expectAsSchema, detailedSchemaErrors } = require('./autokin-expectsasschema'); 
exports.expectAsSchema = expectAsSchema;
exports.detailedSchemaErrors = detailedSchemaErrors;
