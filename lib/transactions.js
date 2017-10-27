var Kashflow = require('kashflow-soap-api');
var async = require('async');
var _ = require('underscore');

module.exports.get = function(options, callback) {
    Kashflow.client(function(err, client){
        if (err) return callback(err);
        var progress = 0;
        client.GetBankAccounts({}, function(err, bankAccounts) {
            if (err) return callback(err);
            async.mapLimit(bankAccounts, 3, function(bank, cb) {
                if (options.onProgress) options.onProgress(++progress, bankAccounts.length);
                client.GetBankTransactions({
                    AccountID: bank.AccountID
                }, cb);
            }, function(err, results) {
                if (err) return callback(err);
                return callback(false, _.flatten(results));
            });
        });
    };
}
