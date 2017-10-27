var Kashflow = require('kashflow-soap-api');
var async = require('async');
var _ = require('underscore');

module.exports.get = function(options, callback) {
    Kashflow.client(function(err, client){
        if (err) return callback(err);

        function getCustomers(callback) {
            if (options.input && options.input()) {
                return callback(false, options.input());
            } else {
                client.GetCustomers({}, callback);
            }
        }

        var progress = 0;
        getCustomers(function(err, customers) {
            if (err) return callback(err);
            async.mapLimit(customers, 3, function(customer, cb) {
                if (options.onProgress) options.onProgress(++progress, customers.length);
                client.GetInvoicesForCustomer({
                    CustID: customer.CustomerID
                }, cb);
            }, function(err, results) {
                if (err) return callback(err);
                return callback(false, _.flatten(results));
            });
        });
    });
}
