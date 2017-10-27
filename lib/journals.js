var Kashflow = require('kashflow-soap-api')
var async = require('async');

var getJournal = function(id, callback) {
    Kashflow.client(function(err, client) {
        if (err) return callback(err);
        async.retry({ interval: 500 }, function(cb) {
            client.GetJournal({ JournalNumber: id }, cb);
        }, callback);
    });
}

function getJournals(maxJournal, onProgress, options, callback) {
    maxJournal = parseInt(maxJournal);
    var start = parseInt(options.start) || 0;
    start = Math.min(start, maxJournal)
    var journals = Array.from(new Array(maxJournal - start),(val,index)=>(index+start));
    async.mapLimit(journals, 3, function(journal, cb) {
        onProgress((journal+1)-start, maxJournal-start);
        getJournal(journal, cb);
    }, callback);
}


module.exports.get = function(onProgress, callback) {
    return function(maxJournal, command) {
        getJournals(maxJournal, onProgress, command.opts(), callback);
    };
}
