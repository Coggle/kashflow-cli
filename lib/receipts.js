var Kashflow = require('kashflow-soap-api');
var async = require('async');

module.exports.get = function(onProgress, callback) {
    return function(options={}) {
        Kashflow.client(function(err, client){
            if (err) return callback(err);

            var receipts = [];
            var page = 0;
            var stop = false;

            function fetchNextBatch(callback) {
                onProgress(page * 100, Infinity);
                client.GetReceiptsWithPaging({
                    Page: page,
                    PerPage: 100,
                    FilterBy: options.filter || 'All'
                }, function(err, results){
                    if (err) return callback(err);
                    if (results.length === 0) {
                        stop = true;
                    } else {
                        page = page + 1;
                    }
                    receipts.concat(results);
                    callback(false, receipts);
                });
            }

            async.doUntil(fetchNextBatch, function() {
                return stop;
            }, function(err, results) {
                if (err) return callback(err);
                return callback(false, results);

            });
        });
    };
}
