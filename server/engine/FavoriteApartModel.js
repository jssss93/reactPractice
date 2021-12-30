var mongoose = require('mongoose');
const PropertiesReader = require('properties-reader');

var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb+srv://cjs:T2PZIQDHSPBLPzIL@cluster0.jx8xx.mongodb.net/test?retryWrites=true');
autoIncrement.initialize(connection);




var FavoiteApartSchema = new mongoose.Schema({
    seq: {type:Number},
    ordr : Number,
    user_id: String,
    addr_sub_code : String,
    apart_name : String,
    reg_date    : {type: Date, default: Date.now()},
    upt_date: String
});

FavoiteApartSchema.plugin(autoIncrement.plugin,{
    model : 'favorite_apart',
    field : 'seq',
    startAt : 1, //시작 
    increment : 1 // 증가
});

var FavoiteApart= mongoose.model('favorite_apart', FavoiteApartSchema);
module.exports = FavoiteApart