/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utlities - Generators
 */

exports.any = require('./autokin-generator-any');
exports.email = require('./autokin-generator-email');

const { names, lastName, firstName } = require('./autokin-generator-names');

exports.names = names;
exports.lastName = lastName; 
exports.firstName = firstName; 