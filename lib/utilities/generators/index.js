/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Utlities - Generators
 */

exports.any = require('./autokin-generator-any');
exports.email = require('./autokin-generator-email');
exports.uuid = require('./autokin-generator-uuid');
exports.mobilenum = require('./autokin-generator-mobile-number');

const { names, lastName, firstName } = require('./autokin-generator-names');
exports.names = names;
exports.lastName = lastName; 
exports.firstName = firstName; 

exports.words = require('./autokin-generator-words');
exports.timestamp = require('./autokin-generator-timestamp');