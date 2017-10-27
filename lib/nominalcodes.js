var Kashflow = require('kashflow-soap-api')

module.exports.get = function(options, callback) {
    Kashflow.client(function(err, client){
        if (err) return callback(err);
        client.GetNominalCodesExtended({}, callback);
    });
}
