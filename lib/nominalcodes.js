var Kashflow = require('kashflow-soap-api')

module.exports.get = function(onProgress, callback) {
    return function() {
        Kashflow.client(function(err, client){
            if (err) return callback(err);
            client.GetNominalCodesExtended({}, callback);
        });
    };
}
