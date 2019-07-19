/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Wraps CucumbeJS CLI
 */
const path = require('path');
const fs = require('fs');

module.exports.default = function ({tags, formatter, junit, variables}) {
    let formatterPath = path.resolve(__dirname, '../lib/formatter/autokin-formatter');

    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }

    let cliOptions = ['','','--format=json:reports/autokin-report.json', '--format=' + formatterPath];
    if (junit) cliOptions = cliOptions.concat([`--format=node_modules/cucumber-junit-formatter:reports/junit.xml`]);
    if (formatter) cliOptions = cliOptions.concat([`--format=${formatter}`]);
    if (tags) cliOptions = cliOptions.concat(['--tags', `${tags}`]);
    if (variables) process.env.AUTOKIN_VARS = variables;

    let cli = new (require('cucumber').Cli)({ argv: cliOptions, cwd: process.cwd(), stdout: process.stdout });
    return new Promise(function (resolve, reject) {
        try {
            return cli.run()
                .then(result => resolve((result.success === true) ? 0 : 1));
        } catch (e) {
            return reject(e);
        }
    });
};
