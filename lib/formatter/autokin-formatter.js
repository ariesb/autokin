/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Formatter for CucumberJS
 */
'use strict';

const { JsonFormatter } = require('cucumber');
const Table = require('cli-table3');
const colors = require('colors');
const readline = require('readline');

class AutokinFormatter extends JsonFormatter {
    constructor(options) {
        super(options);

        // get the JSON data from JsonFormatter
        this.logFn = this.log;
        this.log = (data) => {
            const featuresSummaryTable = new Table({
                head: ['Features', 'Result', 'Scenarios', 'Steps'],
                colAligns: [null, 'right', 'right', 'right'],
                style: {
                    head: [], border: []
                }
            });

            const detailsSummaryTable = new Table({
                head: ['Features / Scenarios', 'Result', 'Steps', 'Passed', 'Failed', 'Skipped', 'Pending', 'Ambiguous', 'Unknown'],
                colAligns: [null, null, 'right', 'right', 'right', 'right', 'right', 'right', 'right'],
                style: {
                    head: [], border: []
                }
            });

            // eslint-disable-next-line no-unused-vars
            JSON.parse(data).forEach(feature => {
                let totals = { steps: 0, passed: 0 };
                detailsSummaryTable.push([{ colSpan: 9, content: colors.magenta(feature.name) }]);
                feature.elements.forEach(scenario => {
                    let stats = scenario.steps.reduce((st, step) => {
                        let is_ = (keyword) => (step.hidden ? 0 : (step.result.status == keyword ? 1 : 0));

                        st.passed += is_('passed');
                        st.failed += is_('failed');
                        st.skipped += is_('skipped');
                        st.pending += is_('pending');
                        st.undf += is_('undefined');
                        st.ambiguous += is_('ambiguous');
                        return st;
                    }, { passed: 0, failed: 0, skipped: 0, pending: 0, undf: 0, ambiguous: 0 });

                    let _steps = Object.entries(stats).reduce((sum, stat) => sum + stat[1], 0);
                    detailsSummaryTable.push([
                        '     ' + scenario.name,
                        _steps > 0 ? (stats.passed > 0 && stats.failed == 0) ? colors.green('✔ Passed') : colors.red('✖ Failed') : colors.yellow('---'),
                        _steps,
                        stats.passed,
                        this.condColor((value) => value > 0, stats.failed, { true: colors.red, false: colors.white }),
                        this.condColor((value) => value > 0, stats.skipped, { true: colors.cyan, false: colors.white }),
                        this.condColor((value) => value > 0, stats.pending, { true: colors.yellow, false: colors.white }),
                        this.condColor((value) => value > 0, stats.ambiguous, { true: colors.gray, false: colors.white }),
                        this.condColor((value) => value > 0, stats.undf, { true: colors.gray, false: colors.white })
                    ]);

                    totals.steps += _steps;
                    totals.passed += stats.passed;
                });

                featuresSummaryTable.push([
                    feature.name,
                    (totals.steps > 0 ?
                        this.condColor((value) => value >= 100 ? 0 : (value < 50 ? 1 : 2),
                            (totals.passed / totals.steps) * 100, { 0: colors.green, 1: colors.red, 2: colors.yellow }) :
                        colors.yellow('---')),
                    feature.elements.length,
                    totals.steps]);
            });

            this.logFn(`\n${colors.green('Test Result Summary')}\n${featuresSummaryTable.toString()} \n\n${detailsSummaryTable.toString()} \n`);
        };

        options.eventBroadcaster.on('test-case-started', ({ sourceLocation }) => {
            const { gherkinDocument, pickle } = options.eventDataCollector.getTestCaseData(sourceLocation);
            readline.clearLine();
            readline.cursorTo(0);

            const { feature } = gherkinDocument;
            this.logFn(`${colors.magenta.bold(feature.keyword)}: ${feature.name} > ${colors.bold(pickle.name)}`);
        });

        options.eventBroadcaster.on('test-case-finished', ({ sourceLocation, result }) => {
            const { testCase } = options.eventDataCollector.getTestCaseData(sourceLocation);
            let status = result.status == 'passed' ? colors.green('✔ Passed') : colors.red('✖ Failed');
            if (result.status != 'passed') {
                testCase.steps.forEach((step, index) => {
                    if (step.result.status == 'failed') {
                        const { gherkinKeyword, pickleStep } = options.eventDataCollector.getTestStepData(
                            {
                                testCase,
                                index
                            });
                        status += `\n\t\t${colors.yellow(gherkinKeyword)}${pickleStep.text} - ${colors.red(result.exception.message)}`;
                    }
                });
            }
            this.logFn(` - ${status} \n`);
        });

        // eslint-disable-next-line no-unused-vars
        options.eventBroadcaster.on('test-run-finished', (event) => {
            readline.clearLine();
            readline.cursorTo(0);
        });

        // eslint-disable-next-line no-unused-vars
        options.eventBroadcaster.on('test-run-started', (event) => {
            this.logFn(`${colors.green('Autokin')} Test Run \n`);
        });

    }

    condColor(check, value, lookups) {
        return lookups[check(value)](value);
    }

}

module.exports = AutokinFormatter;
