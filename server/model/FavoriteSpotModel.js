var mongoose = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./properties');

var autoIncrement = require('mongoose-auto-increment');

const uri = properties.get("mongoURI");
var connection = mongoose.createConnection(uri);
autoIncrement.initialize(connection);




var FavoiteSpotSchema = new mongoose.Schema({
    seq: {type:Number},
    ordr : Number,
    user_id: String,
    addr_code : String,
    addr_name : String,
    reg_date    : {type: Date, default: Date.now()},
    upt_date: String
});

FavoiteSpotSchema.plugin(autoIncrement.plugin,{
    model : 'favorite_spot',
    field : 'seq',
    startAt : 1, //시작 
    increment : 1 // 증가
});

var FavoiteSpot= mongoose.model('favorite_spot', FavoiteSpotSchema);
module.exports = FavoiteSpot