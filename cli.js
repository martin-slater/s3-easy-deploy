#!/usr/bin/env node
'use strict';

const version = require('./package.json').version;
const program = require('commander');
const s3EasyDeploy = require('./index.js');
require('colors');

program
    .version(version)
    .option('-c, --config <configFile>', 'A config file')
    .option('--region <region>', 'The S3 region. Defaults to us-east-1')
    .option('--public-root <publicRoot>', 'The path of the folder to deploy')
    .option('--bucket <bucket>', 'The S3 bucket name')
    .option(
        '--acl <acl>',
        "The Access Control List policy. 'public-read' is probably what your need if your bucket uses ACL's"
    )
    .option('--cloud-front-id <cloudFrontDistributionId>', 'The CloudFront distribution id')
    .option(
        '--concurrent-requests <concurrentRequests>',
        'The number of uploads to send at the same time. Defaults to 10'
    )
    .option('-v, --verbose", "Print progress info to console')
    .parse(process.argv);

let settings = {};

if (program.config) {
    if (program.config.indexOf('/') == -1) {
        program.config = process.cwd() + '/' + program.config;
    } else if (program.config.indexOf('./') === 0) {
        program.config = program.config.replace('./', process.cwd() + '/');
    }
    try {
        settings = require(program.config);
    } catch (e) {
        console.error(('error: Cannot find config file at ' + program.config).red);
        process.exit(0);
    }
}

var optionsToCheck = [
    'region',
    'publicRoot',
    'bucket',
    'acl',
    'cloudFrontId',
    'concurrentRequests',
];

optionsToCheck.forEach(function (option) {
    settings[option] = program[option] || settings[option];
});

s3EasyDeploy.deploy(settings).catch(() => {});
