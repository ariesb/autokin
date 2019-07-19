/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Store
 */
class Store {

    constructor() {
        this.storage = {};
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

    sanitize(pickle) {
        return this.interpolateValues(pickle, this.storage);
    }

    sanitizeJson(obj) {
        for (var p in obj) {
            if (typeof (obj[p]) == "object") {
                obj[p] = this.sanitizeJson(obj[p]);
            } else if (typeof (obj[p]) == "string") {
                obj[p] = this.sanitize(obj[p]);
            }
        }
        return obj;
    }

    interpolateValues(pickle, variables) {
        return pickle.replace(new RegExp("\{([^\{]+)\}", "g"), (match, varName) => {
            return variables.hasOwnProperty(varName) ? variables[varName] : '{' + varName + '}';
        });
    };

}

module.exports = new Store();