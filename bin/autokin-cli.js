/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Wraps CucumbeJS CLI
 */
module.exports.default = function () {
    let cli = new (require('cucumber').Cli)({ argv: ['--format=lib/formatter/autokin-formatter', '--format=json:autokin-report.json'], cwd: process.cwd(), stdout: process.stdout });
    new Promise(function (resolve, reject) {
        try {
            return cli.run()
                .then(success => resolve((success === true) ? 0 : 1));
        } catch (e) {
            return reject(e);
        }
    });
};
