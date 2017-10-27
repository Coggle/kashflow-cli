var Kashflow = require('kashflow-soap-api');
var async = require('async');
var _ = require('underscore');

module.exports.get = function(onProgress, callback) {
    return function() {
        Kashflow.client(function(err, client){
            if (err) return callback(err);
            var progress = 0;
            client.GetCustomers({}, function(err, customers) {
                if (err) return callback(err);
                async.mapLimit(customers, 3, function(customer, cb) {
                    onProgress(++progress, customers.length);
                    client.GetInvoicesForCustomer({
                        CustID: customer.CustomerID
                    }, cb);
                }, function(err, results) {
                    if (err) return callback(err);
                    return callback(false, _.flatten(results));
                });
            });
        });
    };
}
