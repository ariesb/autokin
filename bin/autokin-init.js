/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Wraps CucumbeJS CLI for Initilisation of Autokin Projects
 */
const fs = require('fs');

module.exports.default = function () {
    // create feature folder
    const featureLocation = './features';
    const supportLocation = './features/support';

    process.stdout.write('Creating features folder...');
    if (!fs.existsSync(featureLocation)) {
        fs.mkdirSync(featureLocation);
        process.stdout.write('done.\n');
    } else {
        process.stdout.write('already exists.\n');
    }

    // create support folder
    process.stdout.write('Creating support folder...');
    if (!fs.existsSync(supportLocation)) {
        fs.mkdirSync(supportLocation);
        process.stdout.write('done.\n');
    } else {
        process.stdout.write('already exists.\n');
    }
    //    - add steps.js in support folder

    process.stdout.write('Creating steps...');
    let steps_template = '// Autokin Generated File - Do not delete.\n\n' + 
                   'const { setDefaultTimeout } = require(\'cucumber\');\n' +
                   'setDefaultTimeout(60 * 1000);\n' + 
                   'module.exports = require(\'autokin/lib/autokin-rest-steps\');\n';
    fs.writeFileSync(supportLocation + '/steps.js', steps_template);
    process.stdout.write('done.\n');

    // create basic feature
    process.stdout.write('Creating initial feature...');
    let feature_template = 
                    '@autokin \nFeature: My Feature\n' +
                    '\tAs Autokin developer\n' +
                    '\tI want to verify that all API are working as they should\n\n' + 
                    'Scenario: My First Scenario';

    fs.writeFileSync(featureLocation + '/first.feature', feature_template);
    process.stdout.write('done.\n');
};
