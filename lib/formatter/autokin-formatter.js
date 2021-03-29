/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - Formatter for CucumberJS
 */
'use strict';

const { JsonFormatter } = require(`${process.cwd()}/node_modules/cucumber`);
const Table = require('cli-table3');
const colors = require('chalk');
const readline = require('readline');
const ora = require('ora');
const { Store, Measure, Utils } = require('../autokin');
const prettyTime = require('pretty-ms');

class AutokinFormatter extends JsonFormatter {
    constructor(options) {
        super(options);
        this.inCi = (process.env.AUTOKIN_CI === 'true');

        // get the JSON data from JsonFormatter
        this.spinner = new ora({
            spinner: 'dots',
            isEnabled: !this.inCi
        });
        this.spinner._passed = this.spinner.succeed;
        this.spinner._failed = this.spinner.fail;
        this.spinner._skipped = this.spinner.info;
        this.spinner._pending = this.spinner.warn;
        this.spinner._undefined = this.spinner.warn;
        this.spinner._ambiguous = this.spinner.warn;

        this.logFn = this.log;
        this.log = (data) => {
            const featuresSummaryTable = new Table({
                head: ['Features', 'Result %', 'Scenarios', 'Steps'],
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
                detailsSummaryTable.push([{ colSpan: 9, content: colors.blue(feature.name) }]);
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
                    let isPassed = (stats) => {
                        return (
                            stats.passed > 0 &&
                            Object.entries(stats).filter(stat => stat[0] != 'passed').reduce((sum, stat) => sum + stat[1], 0) == 0
                        );
                    };

                    detailsSummaryTable.push([
                        '     ' + scenario.name,
                        _steps > 0 ? isPassed(stats) ? colors.green('✔ Passed') : colors.red('✖ Failed') : colors.yellow('---'),
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
                            ((totals.passed / totals.steps) * 100).toFixed(2), { 0: colors.green, 1: colors.red, 2: colors.yellow }) :
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
            this.logFn(`\n${colors.magenta.bold(feature.keyword)}: ${colors.bgBlue(feature.name)} > ${colors.bold.underline(pickle.name)} \n`);
        });

        options.eventBroadcaster.on('test-step-started', ({ testCase, index }) => {
            if (index == 0) return;
            const {
                pickleStep,
                gherkinKeyword,
            } = this.eventDataCollector.getTestStepData({ testCase, index });
            if(pickleStep) {
                if (!this.inCi) {
                    this.spinner.text = `\t ${colors.yellow(gherkinKeyword)}${pickleStep.text}`;
                    this.spinner.start();
                }
            }
        });

        options.eventBroadcaster.on('test-step-finished', ({ testCase, index, result }) => {
            if (index == 0) return;
            const {
                pickleStep,
                gherkinKeyword,
            } = this.eventDataCollector.getTestStepData({ testCase, index });
            if (pickleStep) {
                let message = `${this.resolveStatus(result.status)} - ${colors.yellow(gherkinKeyword)}${Store.sanitize(pickleStep.text, true)}${this.displayDuration(result)}`;
                if(result.status == 'failed') {
                    try {
                        let errors = JSON.parse(result.exception.message);
                        message += this.displayJsonErrorBlock(errors);
                    } catch(e) {
                        message += `\n\t - ${colors.red(result.exception.message)}`;
                    }
                }
                this.spinner['_' + result.status](message);

                if (pickleStep.arguments.length > 0) {
                    let content = pickleStep.arguments[0].content;
                    if(Utils.isJSON(content)) {
                        content = JSON.stringify(Store.sanitizeJson(JSON.parse(content), true), null, 4);
                        content = '\t' + content.replace(new RegExp(/\n/, 'g'), '\n\t') + '\n';
                    } else {
                        const contentTable = new Table({
                            colWidths: [20, 60],
                            head: pickleStep.arguments[0].rows[0].cells.map(v => v.value),
                            xchars: {
                                'top': '═', 'top-mid': '╤', 'top-left': '\t╔', 'top-right': '╗'
                                , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '\t╚', 'bottom-right': '╝'
                                , 'left': '\t║', 'left-mid': '\t╟', 'mid': '─', 'mid-mid': '┼'
                                , 'right': '║', 'right-mid': '╢', 'middle': '│'
                            }
                        });
                        pickleStep.arguments[0].rows.forEach( (value, index) => {
                            if(index > 0) {
                                contentTable.push(value.cells.map(v => Store.sanitize(v.value, true).substring(0, 50) ));
                            }
                        });
                        content = contentTable.toString() + '\n';
                    }
                    if(!this.inCi) this.logFn(colors.gray(content));
                }
            }
        });

        options.eventBroadcaster.on('test-run-started', () => {
            this.logFn(`${colors.green('Autokin')} Test Run \n`);
        });

        options.eventBroadcaster.on('test-run-finished', () => {
            if(!this.inCi) this.displayNetworkStatistics();
        });
    }

    displayNetworkStatistics() {
        const networkSummaryTable = new Table({
            head: ['Domain / Path', 'Count', 'Average', 'Min', 'Max', 'Error Rate %'],
            colAligns: ['left', 'right', 'right', 'right', 'right', 'right'],
            style: {
                head: [], border: []
            }
        });
        Object.entries(Measure.stats()).forEach(e => {
            networkSummaryTable.push([{ colSpan: 6, content: colors.blue.bold(e[0]) }]);
            Object.entries(e[1]).forEach(p => {
                networkSummaryTable.push([
                    `    ${p[0]}`,
                    p[1].count,
                    prettyTime(p[1].avg),
                    prettyTime(p[1].min),
                    prettyTime(p[1].max),
                    this.condColor((value) => value > 0, p[1].errors.toFixed(1), { true: colors.red, false: colors.white })
                ]);
            });
        });
        this.logFn(`\n${networkSummaryTable.toString()} \n\n`);
    }

    displayJsonErrorBlock(errors) {
        let message = [];
        errors.forEach(error => {
            let jsonResponse = JSON.stringify(Store.resolve(`__response-${error.source}`), null, 4).split('\n');
            let lineColDetails = error.lineNumber ? `line:${error.lineNumber}` : '';
            message.push(colors.cyan(`\n\n\treports/snapshots/${error.source}.json ${lineColDetails}`));
            let dataPathMessage = error.dataPath ? ` at ${error.dataPath} ` : ' ';
            message.push('\n\t' + colors.red.underline(`${error.message}${dataPathMessage}based on ${error.schemaPath}`));
            if(error.lineNumber) {
                for (let j = error.lineNumber - 1; j <= error.lineNumber + 1; j++) {
                    let lineSource = jsonResponse[j - 1];
                    if (j == error.lineNumber) {
                        message.push(colors.red(`\n\t  ${j}\t${lineSource}`));
                    } else {
                        message.push(colors.gray(`\n\t  ${j}\t${lineSource}`));
                    }
                }
            }
        });

        return message.join('');
    }

    condColor(check, value, lookups) {
        return lookups[check(value)](value);
    }

    resolveStatus(status) {
        const statuses = {
            'passed': colors.green(' Passed'),
            'skipped': colors.blue(' Skipped'),
            'failed': colors.red(' Failed'),
            'pending': colors.yellow(' Pending'),
            'ambiguous': colors.red(' Ambiguous'),
            'undefined': colors.gray(' Undefined')
        };
        return statuses[status];
    }

    displayDuration(result) {
        return (process.env.AUTOKIN_TIME == 'true' && result.duration)  ? ` (${prettyTime(result.duration)})` : '';
    }

}

module.exports = AutokinFormatter;