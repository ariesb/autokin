/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin
 */
const { RestBuilder } = require('./autokin-restbuilder');
const Store = require('./autokin-store');

module.exports.RestBuilder = RestBuilder;
module.exports.Store = Store;
module.exports.Utils = require('./utilities');