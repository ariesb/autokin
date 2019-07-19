/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin
 */
module.exports = require('./lib/autokin');

let vars = {
    host: 'demo.habbitzz.com',
    default_email: 'phoenixbotengine@gmail.com'
}

function sanitizeJson(obj) {
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            console.log(p, typeof (obj[p]));
            if (typeof (obj[p]) == "object") {
                obj[p] = sanitizeJson(obj[p]);
            } else if (typeof (obj[p]) == "string") {
                obj[p] = sanitize(obj[p]);
            }
            
        }
    }

    return obj;
}

function sanitize(pickle) {
    return interpolateValues(pickle, vars);
}

function interpolateValues(pickle, variables) {
    return pickle.replace(new RegExp("\{([^\{]+)\}", "g"), (match, varName) => {
        return variables.hasOwnProperty(varName) ? variables[varName] : '{' + varName + '}';
    });
};



console.log(sanitizeJson({
    "username": "{default_email}",
    "password": "n2V45sQgur21",
    "language": "en",
    "data": {
        a: 1, b: "{host}"
    },
    "hello": [
        "Data String",
        {
            "more": "object",
            "name" : "{missing_var}/{host}"
        }
    ]
}))