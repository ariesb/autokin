const assert = require('assert');
// const Utils = require('../lib/utilities');
const generators = require('../lib/utilities/generators');
const sinon = require('sinon');

describe('Autokin Generators', function () {

    describe('Loading Names', function () {
        it('should be able to generate male first name based on the original name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName('male'), 'Abbott');
            randomStub.restore();
        });
    });

    describe('Generate Names', function () {
        let callback = undefined;

        before(function () {
            callback = sinon.stub(generators, 'names');
            callback.returns({
                firstNames: {
                    male: ['Aaa', 'Abb', 'Acc'],
                    female: ['Bbb', 'Baa', 'Bcc']
                },
                lastNames: ['Lll', 'Laa', 'Lbb']
            });
        });

        after(function () {
            callback.restore();
        });

        it('should be able to generate male first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName('male'), 'Aaa');
            randomStub.restore();
        });

        it('should be able to generate female first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName('female'), 'Bbb');
            randomStub.restore();
        });

        it('should be able to generate all first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName(), 'Aaa');
            randomStub.restore();
        });

        it('should be able to generate last name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.lastName(), 'Lll');
            randomStub.restore();
        });

        it('should be able to generate last name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.8);
            assert.strictEqual(generators.lastName(), 'Lbb');
            randomStub.restore();
        });

    });

    describe('Generate Emails', function () {
        it('should be able to generate random email address', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.0001);
            assert.strictEqual(generators.email(), 'aaaaaa.aaaaaa@autokinjs.com');
            randomStub.restore();
        });

        it('should be able to generate random email address with custom domain', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.0001);
            assert.strictEqual(generators.email('autokin.com'), 'aaaaaa.aaaaaa@autokin.com');
            randomStub.restore();
        });
    });

    describe('Generate Any', function () {
        it('should be able to generate random string with capital letters', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.5);
            assert.strictEqual(generators.any(3, {
                letters: {
                    small: true,
                    caps: true
                }
            }), 'AAA');
            randomStub.restore();
        });

        it('should be able to generate random string with numbers', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.723);
            assert.strictEqual(generators.any(3, {
                letters: {
                    small: true,
                    caps: false
                },
                numbers: true
            }), '111');
            randomStub.restore();
        });

        it('should be able to generate random string with symbols', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.531);
            assert.strictEqual(generators.any(3, {
                letters: {
                    small: true,
                    caps: false
                },
                numbers: false,
                symbols: true
            }), '!!!');
            randomStub.restore();
        });

        it('should be able to generate random string with just numbers', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.any(3, {
                letters: {
                    small: false,
                    caps: false
                },
                numbers: true,
                symbols: false
            }), '111');
            randomStub.restore();
        });

        it('should be able to generate random string with small letters only', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.any(3), 'aaa');
            randomStub.restore();
        });
    });

});