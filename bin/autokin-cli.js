/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Wraps CucumbeJS CLI
 */
const path = require('path');
const fs = require('fs');

module.exports.default = function ({ tags, formatter, junit, variables, time }) {
    let formatterPath = path.resolve(__dirname, '../lib/formatter/autokin-formatter');
    let htmlFormatterPath = path.resolve(__dirname, '../lib/formatter/autokin-html-formatter');

    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }

    let cliOptions = ['', '', '--format=json:reports/autokin-report.json', '--format=' + formatterPath]
        .concat(['--format=' + htmlFormatterPath + ':reports/autokin-result.html']);
    if (junit) cliOptions = cliOptions.concat([`--format=node_modules/cucumber-junit-formatter:reports/junit.xml`]);
    if (formatter) cliOptions = cliOptions.concat([`--format=${formatter}`]);
    if (tags) cliOptions = cliOptions.concat(['--tags', `${tags}`]);
    if (variables) process.env.AUTOKIN_VARS = variables;
    if (time) process.env.AUTOKIN_TIME = 'true';

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
