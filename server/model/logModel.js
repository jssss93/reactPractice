var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({

    
    user_id: String,
    reg_date: Date,
    url: String,
    prms: String,
    ip: String

});


var Log = mongoose.model('log', logSchema);
module.exports =Log;
//mongoose.model(‘{mongodb에서 Collection 명}’, {스키마객체명})



