/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - HTML Formatter
 */
'use strict';

const { Formatter } = require('cucumber');
const prettyTime = require('pretty-ms');

const htmlMain =
    `<!DOCTYPE html>
<html>
    <head>
        <title>AutokinJS | Test Automation using Gherkin</title>
        <link rel="stylesheet" href="https://autokinjs.github.io/assets/font/metropolis.css" type="text/css" charset="utf-8" />
        <style>
        html{font-family:Metropolis;font-weight:400;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}footer,header{display:block}[hidden]{display:none}a{background-color:transparent}a:active,a:hover{outline:0}h1{font-size:2em;margin:.67em 0}img{border:0}.row{margin-left:-15px;margin-right:-15px}.row:after,.row:before{content:" ";display:table}.row:after{clear:both}.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{position:relative;min-height:1px;padding-left:15px;padding-right:15px}@media (min-width:1200px){.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{float:left}.col-lg-1{width:8.33333%}.col-lg-2{width:16.66667%}.col-lg-3{width:25%}.col-lg-4{width:33.33333%}.col-lg-5{width:41.66667%}.col-lg-6{width:50%}.col-lg-7{width:58.33333%}.col-lg-8{width:66.66667%}.col-lg-9{width:75%}.col-lg-10{width:83.33333%}.col-lg-11{width:91.66667%}.col-lg-12{width:100%}.col-lg-push-0{left:auto}.col-lg-push-1{left:8.33333%}.col-lg-push-2{left:16.66667%}.col-lg-push-3{left:25%}.col-lg-push-4{left:33.33333%}.col-lg-push-5{left:41.66667%}.col-lg-push-6{left:50%}.col-lg-push-7{left:58.33333%}.col-lg-push-8{left:66.66667%}.col-lg-push-9{left:75%}.col-lg-push-10{left:83.33333%}.col-lg-push-11{left:91.66667%}.col-lg-push-12{left:100%}}.h80{height:80px}.h100{height:100px}.h200{height:200px}.h300{height:300px}.h400{height:400px}.h500{height:500px}.h600{height:600px}.h700{height:700px}.h800{height:800px}.text-lg{font-size:24px}.txtsm{font-size:12px}.rd6{border-radius:6px}.pxl{padding:30px}.nop{padding:0!important}.nopt{padding-top:0!important}.nopb{padding-bottom:0}.mauto{margin-left:auto;margin-right:auto}.mtl{margin-top:20px}.mbl{margin-bottom:20px}.txtcntr{text-align:center}.capital-case{text-transform:capitalize}.flxc{display:flex}_:-ms-input-placeholder{-ms-flex-preferred-size:25%!important}_:-ms-input-placeholder{-ms-flex-preferred-size:33.33%!important}_:-ms-input-placeholder{-ms-flex-preferred-size:50%!important}@supports not (mix-blend-mode:luminosity){:root .flex-it-2,_:-ms-input-placeholder{flex:0 1 49.95%}}@media (min-width:1200px){_:-ms-input-placeholder{-ms-flex-preferred-size:50%!important}@supports not (mix-blend-mode:luminosity){:root .flex-it-2-lg,_:-ms-input-placeholder{flex:0 1 49.95%}}_:-ms-input-placeholder{-ms-flex-preferred-size:33.33%!important}_:-ms-input-placeholder{-ms-flex-preferred-size:25%!important}}@media (max-width:768px){_:-ms-input-placeholder{-ms-flex-preferred-size:50%!important}@supports not (mix-blend-mode:luminosity){:root .flex-it-2-sm,_:-ms-input-placeholder{flex:0 1 49.95%}}_:-ms-input-placeholder{-ms-flex-preferred-size:33.33%!important}_:-ms-input-placeholder{-ms-flex-preferred-size:25%!important}}.unscroll{overflow:hidden!important}.row .shadow{box-shadow:0 10px 40px 0 rgba(62,57,107,.07),0 2px 9px 0 rgba(62,57,107,.06)}_:-ms-fullscreen{background:0 0}*,:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:transparent}body{font-family:Metropolis,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3e396b;background-color:#fff}a{color:#00aeff;text-decoration:none}a:focus,a:hover{color:#007ab3;text-decoration:underline}a:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}img{vertical-align:middle}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:Metropolis,Helvetica,Arial,sans-serif;font-weight:500;line-height:1.1;color:inherit}.h1,.h2,.h3,h1,h2,h3{margin-top:24px;margin-bottom:12px}.h4,.h5,.h6,h4,h5,h6{margin-top:12px;margin-bottom:12px}.h1,h1{font-size:36px}.h2,h2{font-size:30px}.h3,h3{font-size:18px}.h4,h4{font-size:12px}.h5,.h6,h5,h6{font-size:1em}.background-white{background-color:#fff!important}.color-white{color:#fff!important}.color-portage{color:#8994c6!important}body{background-color:#eef0f7!important;font-family:Metropolis,sans-serif}.header h3{height:24px;font-family:Metropolis;font-size:20px;font-weight:400;text-align:left;margin:0}.header .logo,.header h3{display:inline-block;vertical-align:middle}.header .logo{margin-right:24px}.header a,.header a:hover{color:#3e396b}.footer h3{height:16px;font-family:Metropolis;font-size:11px;font-weight:200;text-align:left;margin:0}.footer .logo,.footer h3{display:inline-block;vertical-align:middle}.footer .logo{width:21px;vertical-align:bottom}.footer a,.footer a:hover{color:#3e396b}@-webkit-keyframes sk-stretchdelay{0%,40%,to{-webkit-transform:scaleY(.4)}20%{-webkit-transform:scaleY(1)}}@keyframes sk-stretchdelay{0%,40%,to{transform:scaleY(.4);-webkit-transform:scaleY(.4)}20%{transform:scaleY(1);-webkit-transform:scaleY(1)}}.flxc{flex-wrap:wrap}.result-row{display:flex;align-items:center;border-top:1px solid #e9ebf5;padding:8px 0}.result-row:first-child{border-top:0}.result-row .title{font-size:15px;color:#17215a;margin-top:0;margin-bottom:0}.result-row .title{display:inline-block;vertical-align:middle}.result-row .label{flex-grow:1;min-width:250px}.markers{display:flex;flex-wrap:wrap;align-items:center}.marker-result{float:left;width:8px;height:20px;border-radius:20px;border-left:1px solid #fff;border-right:1px solid #fff;transition:transform .12s ease-out}.result-row.passed{border-left:10px #6fe49b solid}.result-row.skipped{border-left:10px #ffc168 solid}.result-row.failed{border-left:10px #ff4f81 solid}.result-row.failed:last-child,.result-row.passed:last-child,.result-row.skipped:last-child{border-bottom-left-radius:6px}.marker-result.passed{background-color:#6fe49b}.marker-result.skipped{background-color:#ffc168}.marker-result.failed{background-color:#ff4f81}.marker-result.undefined{background-color:#c4c8d8}.header-title{font-size:20px;line-height:1;text-align:left;color:#17215a;font-weight:400;margin:0}.header-wrapper{border-bottom:1px solid #e9ebf5}

        .title:hover {
            cursor: pointer;
        }

        .marker-result:hover {
            transform: scaleY(1.7);
            cursor: pointer;
        }

        .gherkin {
            color: #cf2386;
            font-weight: 500;
        }

        .scndtls {
            background-color: #000;
            color: #ddd;
            font-size: 13px;
            display: none;
        }

        .scndtls:last-child {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
        }

        .step {
            padding-left: 24px;
            margin-bottom: 1px;
        }

        .step.passed {            
            border-left: 5px solid #6fe49b;
        }

        .step.failed {            
            border-left: 5px solid #ff4f81;
        }

        .step.skipped {            
            border-left: 5px solid #ffc168;
        }

        .step.undefined {            
            border-left: 5px solid #c4c8d8;
        }

        .title {
            vertical-align: middle;
        }
        .feature-status {
            border-radius: 10px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            vertical-align: top;
            padding: 4px 12px;
            margin-right: 12px;
            color: #fff;
            line-height: 17px;
        }

        .feature-status.passed {            
            background-color: #6fe49b;
        }

        .feature-status.failed {            
            background-color: #ff4f81;
        }

        .step.hint, .withstep:hover {
            background-color: #428dce59;
            cursor: pointer;
        }

        </style>
        <script>
            const toggleDetails = (event) => {
                if(event.target.className.indexOf('scenario-name') > -1 || 
                   event.target.className.indexOf('marker-result') > -1) {
                    const key = event.target.getAttribute('key');
                    const details = document.getElementById(key);
                    details.style.display = details.style.display == '' ? 'block' : '';
                }
            };

            const hintDetails = (event) => {
                if(event.target.className.indexOf('marker-result') > -1) {
                    const stepId = event.target.getAttribute('step');
                    const step = document.getElementById(stepId);
                    if(step.classList.contains('hint')) 
                        step.classList.remove('hint');
                    else {
                        const key = event.target.getAttribute('key');
                        const details = document.getElementById(key);
                        if(details.style.display == '') details.style.display = 'block';
                        step.classList.add('hint');
                    }
                }
            };

            window.onload = () => {
                document.body.addEventListener("click", toggleDetails, false);
                document.body.addEventListener("mouseover", hintDetails, false);
                document.body.addEventListener("mouseout", hintDetails, false);
            };

        </script>
    </head>
    <body class="pxl">
`;

const htmlFooter = `        <div class="row mtl">
            <div class="col-lg-8 col-lg-push-2 txtcntr pxl footer">
                <h3>Copyright 2019 Autokin <img class="logo" src="https://autokinjs.github.io/assets/images/autokinlogo.png" /> <a href="http://www.autokinjs.com">autokinjs.com</a></h3>
            </div>
        </div>
    </body>
</html>
`;

const htmlResultOpener = `        <div class="mtl">
            <div class="row">
                <div class="mtl col-lg-8 col-lg-push-2 mauto nop background-white rd6 shadow">
                    <div>
                        <div>
                            <div>
                                <div class="pxl nopb header-wrapper">
                                    <h3 class="header-title">__FEATURE_NAME__</h3>
                                    <div class="mbl"></div>
                                </div>
                                <div>
`;

const htmlResultCloser = `                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

const htmlRow =
    `                                <div class="result-row __SCENARIO_STATUS__">
                                    <div class="pxl nopt nopb flxc" >                                    
                                        <div class="label">
                                            <h3 class="title scenario-name" key="__SCENARIO_ID__">__SCENARIO_NAME__</h3>
                                            <div class="text-muted txtsm">__STEPS__</div> 
                                        </div>
                                        <div class="markers unscroll">
                                            __MARKERS__
                                        </div>
                                    </div>
                                </div>
`;

const htmlMarker = '<div class="marker-result __MARKER_RESULT__" key="__SCENARIO_ID__" step="__STEP_ID__"></div>';
const htmlDetails = '<div id="__SCENARIO_ID__" class="scndtls mauto"><div class="step __SCENARIO_STATUS__">&nbsp;</div>__SCENARIO_STEPS__<div class="step __SCENARIO_STATUS__">&nbsp;</div></div>';
const htmlStep = '<div class="step withstep __STEP_STATUS__" id="__STEP_ID__">__STEP__</div>';

class AutokinHTMLFormatter extends Formatter {
    constructor(options) {
        super(options);
        options.eventBroadcaster.on('test-run-finished', this.buildHtml.bind(this));
    }

    buildHtml() {
        let features = {};
        Object.values(this.eventDataCollector.testCaseMap).forEach(
            (value) => {
                const { gherkinDocument } = this.eventDataCollector.getTestCaseData(value.sourceLocation);
                if (!(gherkinDocument.feature.name in features)) {
                    features[gherkinDocument.feature.name] = [];
                }
                features[gherkinDocument.feature.name].push(value);
            }
        );

        this.log(htmlMain);
        Object.entries(features).forEach(this.buildFeatureBlock.bind(this));
        this.log(htmlFooter);
    }

    buildFeatureBlock([key, value]) {
        const status = value.filter(f => f.result.status !== 'passed').length > 0 ? 'failed' : 'passed';
        const featureStatus = `<span class="feature-status ${status}">${status}</span>`;
        this.log(htmlResultOpener.replace(new RegExp(/__FEATURE_NAME__/, 'g'), `${featureStatus}${key}`));
        value.forEach(this.buildScenarios.bind(this));
        this.log(htmlResultCloser);
    }

    buildScenarios(testCase) {
        const { pickle } = this.eventDataCollector.getTestCaseData(testCase.sourceLocation);
        let markers = [], notPassed = [], steps = [];
        testCase.steps.forEach((step, index) => {
            const { gherkinKeyword, pickleStep } = this.eventDataCollector.getTestStepData({ testCase, index });
            if(pickleStep) {
                const { sourceLocation, result } = step;
                steps.push(htmlStep.replace(new RegExp(/__STEP__/, 'g'), `<span class="gherkin">${gherkinKeyword}</span>${pickleStep.text}`)
                    .replace(new RegExp(/__STEP_STATUS__/, 'g'), result.status)
                    .replace(new RegExp(/__STEP_ID__/, 'g'), `${sourceLocation.uri}-${sourceLocation.line}`));
                markers.push(htmlMarker.replace(new RegExp(/__MARKER_RESULT__/, 'g'), result.status)
                    .replace(new RegExp(/__SCENARIO_ID__/, 'g'), `${testCase.sourceLocation.uri}-${testCase.sourceLocation.line}`)
                    .replace(new RegExp(/__STEP_ID__/, 'g'), `${sourceLocation.uri}-${sourceLocation.line}`));
                if (result.status !== 'passed') notPassed.push(step);
            }                        
        });

        let newRow = htmlRow;
        newRow = newRow.replace(new RegExp(/__SCENARIO_NAME__/,'g'), pickle.name)
            .replace(new RegExp(/__SCENARIO_ID__/, 'g'), `${testCase.sourceLocation.uri}-${testCase.sourceLocation.line}`)
            .replace(new RegExp(/__SCENARIO_STATUS__/, 'g'), `${notPassed.length > 0 ? 'failed' : 'passed'}`)
            .replace(new RegExp(/__STEPS__/, 'g'), `${testCase.steps.length} Step${testCase.steps.length > 1 ? 's' : ''} - ${prettyTime(testCase.result.duration)}`)
            .replace(new RegExp(/__MARKERS__/, 'g'), markers.join(''));
        this.log(newRow);
        this.log(htmlDetails
            .replace(new RegExp(/__SCENARIO_ID__/, 'g'), `${testCase.sourceLocation.uri}-${testCase.sourceLocation.line}`)
            .replace(new RegExp(/__SCENARIO_STATUS__/, 'g'), `${notPassed.length > 0 ? 'failed' : 'passed'}`)
            .replace(new RegExp(/__SCENARIO_STEPS__/, 'g'), steps.join('')));
    }
}

module.exports = AutokinHTMLFormatter;