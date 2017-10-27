var Kashflow = require('kashflow-soap-api');
var async = require('async');

module.exports.get = function(options, callback) {
    Kashflow.client(function(err, client){
        if (err) return callback(err);

        var receipts = [];
        var page = 0;
        var stop = false;

        function fetchNextBatch(callback) {
            if (options.onProgress) options.onProgress(page * 100, Infinity);
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

        async.doUntil(fetchNextBatch, () => stop, callback);
    };
}
