const assert = require('assert');
const AutokinFormatter = require('../lib/formatter/autokin-formatter');
const colors = require('colors');
const Table = require('cli-table3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _events = _interopRequireDefault(require('events'));

const clrs = {
    red: (v) => 'red: ' + v,
    blue: (v) => 'blue: ' + v,
};

const eventBroadcaster = new _events.default();
const logHook = () => {
};

let eventCollectorData = require('./event-collector-default-data.json');
const formatter = new AutokinFormatter({
    eventBroadcaster: eventBroadcaster,
    eventDataCollector: {
        getTestCaseData: () => {
            return eventCollectorData;
        },
        getTestStepData: () => {
            return {
                gherkinKeyword: 'Then',
                pickleStep: {
                    text: 'expect step'
                }
            };
        }
    },
    log: logHook
});

describe('Autokin Formatter', function () {

    describe('Conditional Colors', function () {
        it('should be able to create colors based on certain condition: true', function () {
            let data = formatter.condColor((value) => value > 0, 0, { true: clrs.red, false: clrs.blue });
            assert.strictEqual(data, 'blue: 0');
        });

        it('should be able to create colors based on certain condition: false', function () {
            let data = formatter.condColor((value) => value > 0, 1, { true: clrs.red, false: clrs.blue });
            assert.strictEqual(data, 'red: 1');
        });
    });

    describe('Collector Events', function () {
        before(function () {
        });

        afterEach(function () {
            formatter.logFn = () => {
            };
        });

        it('should be able to process : test-case-started', function () {
            formatter.logFn = (data) => {
                assert.strictEqual(colors.stripColors(data), 'Feature: feature > scenario');
            };
            eventBroadcaster.emit('test-case-started', { sourceLocation: {} });
        });

        it('should be able to process : test-run-started', function () {
            formatter.logFn = (data) => {
                assert.strictEqual(colors.stripColors(data), 'Autokin Test Run \n');
            };
            eventBroadcaster.emit('test-run-started');
        });

        it('should be able to process : test-run-finished', function () {
            formatter.logFn = (data) => {
                let table1 = new Table({
                    head: ['Features', 'Result', 'Scenarios', 'Steps'],
                    colAligns: [null, 'right', 'right', 'right'],
                    style: {
                        head: [], border: []
                    }
                });
                let table2 = new Table({
                    head: ['Features / Scenarios', 'Result', 'Steps', 'Passed', 'Failed', 'Skipped', 'Pending', 'Ambiguous', 'Unknown'],
                    colAligns: [null, null, 'right', 'right', 'right', 'right', 'right', 'right', 'right'],
                    style: {
                        head: [], border: []
                    }
                });
                assert.strictEqual(colors.stripColors(data), `\nTest Result Summary\n${table1.toString()} \n\n${table2.toString()} \n`);
            };
            eventBroadcaster.emit('test-run-finished');
        });

        it('should be able to process : test-case-finished - passed', function () {
            formatter.logFn = (data) => {
                assert.strictEqual(colors.stripColors(data), ' - ✔ Passed \n');
            };
            eventBroadcaster.emit('test-case-finished', { result: { status: 'passed' } });
        });

        it('should be able to process : test-case-finished - failed', function () {
            formatter.logFn = (data) => {
                assert.strictEqual(colors.stripColors(data), ' - ✖ Failed\n\t\tThenexpect step - expect 0 but 1 \n');
            };
            eventBroadcaster.emit('test-case-finished', {
                result: {
                    status: 'failed', 'exception': {
                        'message': 'expect 0 but 1'
                    }
                }
            });
        });

        it('should be able to process : test-case-finished - undefined', function () {
            formatter.logFn = (data) => {
                assert.strictEqual(colors.stripColors(data), ' - ✖ Failed\n\t\tThenexpect step - Please correct invalid Gherkin Step. \n');
            };

            eventCollectorData = require('./event-collector-undefined-status.json');
            eventBroadcaster.emit('test-case-finished', {
                result: {
                    status: 'undefined'
                }
            });
        });


    });

    describe('Summary Reporter', function () {
        let featuresSummaryTable = null, detailsSummaryTable = null;
        beforeEach(function () {
            featuresSummaryTable = new Table({
                head: ['Features', 'Result', 'Scenarios', 'Steps'],
                colAligns: [null, 'right', 'right', 'right'],
                style: {
                    head: [], border: []
                }
            });
            detailsSummaryTable = new Table({
                head: ['Features / Scenarios', 'Result', 'Steps', 'Passed', 'Failed', 'Skipped', 'Pending', 'Ambiguous', 'Unknown'],
                colAligns: [null, null, 'right', 'right', 'right', 'right', 'right', 'right', 'right'],
                style: {
                    head: [], border: []
                }
            });
        });

        afterEach(function () {
            formatter.logFn = () => {
            };
        });

        it('should be able to process summary', function () {
            let data = require('./test-summary-1.json');
            formatter.logFn = (data) => {
                featuresSummaryTable.push(['My Feature', 100, 1, 1]);
                detailsSummaryTable.push([{ colSpan: 9, content: 'My Feature' }]);
                detailsSummaryTable.push(['     My First Scenario', '✔ Passed', 1, 1, 0, 0, 0, 0, 0]);
                let expectedResult = '\nTest Result Summary\n' + featuresSummaryTable.toString() + ' \n\n' + detailsSummaryTable.toString() + ' \n';
                assert.strictEqual(colors.stripColors(data), expectedResult);
            };
            formatter.log(JSON.stringify(data));
        });

        it('should be able to process summary - with empty steps', function () {
            let data = require('./test-summary-2.json');
            formatter.logFn = (data) => {
                featuresSummaryTable.push(['My Feature', '---', 1, 0]);
                detailsSummaryTable.push([{ colSpan: 9, content: 'My Feature' }]);
                detailsSummaryTable.push(['     My First Scenario', '---', 0, 0, 0, 0, 0, 0, 0]);
                let expectedResult = '\nTest Result Summary\n' + featuresSummaryTable.toString() + ' \n\n' + detailsSummaryTable.toString() + ' \n';
                assert.strictEqual(colors.stripColors(data), expectedResult);
            };
            formatter.log(JSON.stringify(data));
        });

        it('should be able to process summary - with failed step', function () {
            let data = require('./test-summary-3.json');
            formatter.logFn = (data) => {
                featuresSummaryTable.push(['My Feature', 0, 1, 1]);
                detailsSummaryTable.push([{ colSpan: 9, content: 'My Feature' }]);
                detailsSummaryTable.push(['     My First Scenario', '✖ Failed', 1, 0, 1, 0, 0, 0, 0]);
                let expectedResult = '\nTest Result Summary\n' + featuresSummaryTable.toString() + ' \n\n' + detailsSummaryTable.toString() + ' \n';
                assert.strictEqual(colors.stripColors(data), expectedResult);
            };
            formatter.log(JSON.stringify(data));
        });

        it('should be able to process summary - with failed but less than 50%', function () {
            let data = require('./test-summary-4.json');
            formatter.logFn = (data) => {
                featuresSummaryTable.push(['My Feature', 75, 4, 4]);
                detailsSummaryTable.push([{ colSpan: 9, content: 'My Feature' }]);
                detailsSummaryTable.push(['     Scenario 1', '✖ Failed', 1, 0, 1, 0, 0, 0, 0]);
                detailsSummaryTable.push(['     Scenario 2', '✔ Passed', 1, 1, 0, 0, 0, 0, 0]);
                detailsSummaryTable.push(['     Scenario 3', '✔ Passed', 1, 1, 0, 0, 0, 0, 0]);
                detailsSummaryTable.push(['     Scenario 4', '✔ Passed', 1, 1, 0, 0, 0, 0, 0]);
                let expectedResult = '\nTest Result Summary\n' + featuresSummaryTable.toString() + ' \n\n' + detailsSummaryTable.toString() + ' \n';
                assert.strictEqual(colors.stripColors(data), expectedResult);
            };
            formatter.log(JSON.stringify(data));
        });

        it('should be able to process summary - with invalid step', function () {
            let data = require('./test-summary-5.json');
            formatter.logFn = (data) => {
                featuresSummaryTable.push(['HTTP Bin REST Service', 33.33333333333333, 1, 3]);
                detailsSummaryTable.push([{ colSpan: 9, content: 'HTTP Bin REST Service' }]);
                detailsSummaryTable.push(['     My 3rd Scenario', '✖ Failed', 3, 1, 0, 1, 0, 0, 1]);
                let expectedResult = '\nTest Result Summary\n' + featuresSummaryTable.toString() + ' \n\n' + detailsSummaryTable.toString() + ' \n';
                assert.strictEqual(colors.stripColors(data), expectedResult);
            };
            formatter.log(JSON.stringify(data));
        });
    });
});

