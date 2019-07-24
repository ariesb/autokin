/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Store
 */
const generators = require('./utilities/generators');

class Store {

    constructor() {
        this.storage = {};
        this.cacheStore = [];

        this.fnMappings = {
            'email': this.generateEmail,
            'any': this.generateAny,
            'lastname': this.generateLastName,
            'firstname': this.generateFirstName
        };
    }

    set(key, value) {
        this.storage[key] = value;
    }

    merge(newStore) {
        this.storage = { ...this.storage, ...newStore };
    }

    resolve(variable) {
        return this.storage[variable];
    }

    generateEmail(options) {
        return generators.email(options.shift());
    }

    generateAny(options) {
        const len = parseInt(options.shift());
        return generators.any(isNaN(len) ? 10 : len, {
            letters: {
                small: true,
                caps: true
            },
            numbers: true,
            symbols: true
        });
    }

    generateFirstName(options) {
        const gender = options.shift();
        return generators.firstName(gender ? gender : 'all');
    }

    generateLastName() {
        return generators.lastName();
    }

    generator(keywords, fromCache = false) {
        let definition = keywords.shift().replace(new RegExp("[()]", "g"), ',').split(',');
        const fn = this.fnMappings[definition.shift()];
        if (fn) {
            return fromCache ? this.cache() : this.cache(fn(definition));
        } else {
            throw new Error('Unknown generator.');
        }
    }

    generate(pickle, fromCache = false) {
        const keywords = pickle.split(':');
        keywords.shift();
        try {
            return this.generator(keywords, fromCache);
        } catch (error) {
            return pickle;
        }
    }

    sanitize(pickle, fromCache = false) {
        return this.interpolateValues(pickle, this.storage, fromCache);
    }

    sanitizeJson(obj, fromCache = false) {
        for (var p in obj) {
            if (typeof (obj[p]) == "object") {
                obj[p] = this.sanitizeJson(obj[p], fromCache);
            } else if (typeof (obj[p]) == "string") {
                obj[p] = this.sanitize(obj[p], fromCache);
            }
        }
        return obj;
    }

    interpolateValues(pickle, variables, fromCache = false) {
        return pickle.replace(new RegExp("\{([^\{]+)\}", "g"), (match, varName) => {
            if (varName.startsWith('generate:')) {
                return this.generate(varName, fromCache);
            }

            return variables.hasOwnProperty(varName) ? variables[varName] : '{' + varName + '}';
        });
    };

    cache(value = undefined) {
        if (value) {
            this.cacheStore.push(value);
            return value;
        }

        return this.cacheStore.shift();
    }
}

module.exports = new Store();