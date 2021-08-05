/*
 * Copyright 2019 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Generators - names
 */

exports.names = function names() {
    return require('./names.json');
}; 

exports.lastName = () => {
    const { names } = require('./');
    const lastNames = names().lastNames;
    return lastNames[Math.round(Math.random() * lastNames.length)];
};

exports.firstName = (definitions = ['all']) => {
    const gender = definitions.shift();
    const { names } = require('./');
    const firstNames = names().firstNames;
    let universe = [].concat((gender == 'all' || gender == 'male') ? firstNames.male : [])
        .concat((gender == 'all' || gender == 'female') ? firstNames.female : []);
    return universe[Math.round(Math.random() * universe.length)];
};
