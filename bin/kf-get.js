#!/usr/bin/env node
var Kashflow = require('kashflow-soap-api')
var program = require('commander');
var fs = require('fs');
var _ = require('underscore');

Kashflow.login = { UserName: process.env.KASHFLOW_USERNAME, Password: process.env.KASHFLOW_PASSWORD };

function onError(err) {
    console.warn(err);
}

function onProgress(done, total) {
    if (total && total !== Infinity) {
        console.log('(', Math.round((done/total)*100)+'%' ,') fetching', done, 'of', total);
    } else {
        console.log('fetching', done, 'of an unknown number of items');
    }
}

function toJSONFile(defaultFile) {
    return function(err, results){
        if (err) return onError(err);
        var file = program.output || defaultFile;
        fs.writeFileSync(file, JSON.stringify(results, undefined, '\t'));
        console.log('wrote', file);
    };
};

program
    .version(require('../package.json').version)
    .usage('get <resource>')
    .option('-o, --output <file>', 'output to a JSON file')

program
    .command('journals <max-journal>')
    .description('export journals to JSON')
    .option('-s, --start <start>', 'journal number to start at [default 0]', 0)
    .action((maxJournal, command) => {
        require('../lib/journals').get(maxJournal, _.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./journals.json'))
    });

program
    .command('customers')
    .description('export customers to JSON')
    .action((command) => {
        require('../lib/customers').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./customers.json'))
    });

program
    .command('receipts')
    .description('export receipts to JSON')
    .option('--filter <filter>', 'filter by receipt type [default All]', 'All')
    .action((command) => {
        require('../lib/receipts').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./receipts.json'))
    });

program
    .command('invoices')
    .description('export invoices to JSON')
    .action((command) => {
        require('../lib/invoices').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./invoices.json'))
    });

program
    .command('suppliers')
    .description('export suppliers to JSON')
    .action((command) => {
        require('../lib/suppliers').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./suppliers.json'))
    });

program
    .command('transactions')
    .description('export transactions to JSON')
    .action((command) => {
        require('../lib/transactions').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./transactions.json'))
    });

program
    .command('banks')
    .description('export banks to JSON')
    .action((command) => {
        require('../lib/banks').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./banks.json'))
    });

program
    .command('nominalcodes')
    .description('export nominal codes to JSON')
    .action((command) => {
        require('../lib/nominalcodes').get(_.extend({}, command.opts(), {
            input: () => program.pipedData,
            onProgress: onProgress
        }), toJSONFile(program.opts().output||'./nominalcodes.json'))
    });


if (process.stdin.isTTY) {
    program.parse(process.argv);
} else {
    var data = '';
    process.stdin.on('data', function(chunk) {
        data += chunk;
    });
    process.stdin.on('end', function() {
       program.pipedData = JSON.parse(data);
       program.parse(process.argv);
    });
}
