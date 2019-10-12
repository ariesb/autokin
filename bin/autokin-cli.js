/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Wraps CucumbeJS CLI
 */
const path = require('path');
const fs = require('fs');

module.exports.default = function ({ specs, tags, formatter, junit, variables, time, html, ci }) {
    let autokinPath = path.resolve(__dirname, '../lib/');

    if (!fs.existsSync('reports/snapshots')) {
        fs.mkdirSync('reports/snapshots', { recursive: true });
    }

    let cliOptions = ['', ''];
    if (specs) cliOptions = cliOptions.concat([specs]);

    cliOptions = cliOptions.concat([
        '--format=json:reports/autokin-report.json',
        `--format=${autokinPath}/formatter/autokin-formatter`,
        `--require=${autokinPath}/autokin-options.js`,
        `--require=${autokinPath}/autokin-rest-steps.js`,
        `--require=${autokinPath}/web/autokin-web.js`,
        `--require=${autokinPath}/mobile/autokin-mobile.js`
    ]);
        
    if (html)  { 
        const targetHtmlPath = typeof (html) == 'boolean' ? 'reports/autokin-result.html' : html;
        cliOptions = cliOptions.concat([`--format=node_modules/autokin-html-formatter:${targetHtmlPath}`]);
    }
    if (junit) cliOptions = cliOptions.concat([`--format=node_modules/cucumber-junit-formatter:reports/junit.xml`]);
    if (formatter) cliOptions = cliOptions.concat([`--format=${formatter}`]);
    if (tags) cliOptions = cliOptions.concat(['--tags', `${tags}`]);
    if (variables) process.env.AUTOKIN_VARS = variables;
    if (time) process.env.AUTOKIN_TIME = 'true';
    if (ci) process.env.AUTOKIN_CI = 'true';

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
