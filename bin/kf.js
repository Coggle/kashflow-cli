#!/usr/bin/env node
var program = require('commander');

program
    .version(require('../package.json').version)
    .usage('[command]')

program
    .command('get <resource>', 'export resources from Kashflow as JSON')


program.parse(process.argv);
