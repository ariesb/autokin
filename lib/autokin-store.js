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
            'lastname': generators.lastName,
            'firstname': this.generateFirstName,
            'uuid': generators.uuid,
            'mobilnum' : this.generateMobileNum
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

    generateMobileNum(options) {
        return generators.mobilenum(options.shift());
    }

    generateAny(options) {
        const len = parseInt(options.shift());
        let anyOptions = {
            lowercase: true,
            uppercase: true,
            numbers: true,
            symbols: true
        };
        
        if(options.length > 1) {
            anyOptions = {};
            options.forEach(o => { if (o.length > 0) { anyOptions[o] = true; } });     
        }
        return generators.any(isNaN(len) ? 10 : len, anyOptions);
    }

    generateFirstName(options) {
        const gender = options.shift();
        return generators.firstName(gender ? gender : 'all');
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
            return `{${pickle}}`;
        }
    }

    parse(pickle, fromCache = false) {
        this.fnParseMappings = {
            'hostname': (options) => {
                const targetUrl = new URL(this.resolve(options.shift()));
                return targetUrl.hostname;
            },
            'path': (options) => {
                const targetUrl = new URL(this.resolve(options.shift()));
                return `${targetUrl.pathname}${targetUrl.search}`;
            },
            'params': (options) => {
                const paramName = options.shift();
                const targetUrl = new URL(this.resolve(options.shift()));
                return targetUrl.searchParams.get(paramName);
            }
        };

        const keywords = pickle.split(':');
        keywords.shift();
        try {
            let definition = keywords.shift().replace(new RegExp("[()]", "g"), ',').split(',');
            const fn = this.fnParseMappings[definition.shift()];
            if (fn) {
                return fromCache ? this.cache() : this.cache(fn(definition));
            } else {
                throw new Error('Unknown parser.');
            }
        } catch (error) {
            return `{${pickle}}`;
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
            } else if (varName.startsWith('parse:')) {
                return this.parse(varName, fromCache);
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