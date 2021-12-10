var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');
var autoIncrement       = require('mongoose-auto-increment');

// var uri = 'mongodb+srv://cjs:T2PZIQDHSPBLPzIL@cluster0.jx8xx.mongodb.net/myFirstDatabase?retryWrites=true';
var uri = properties.get("mongoURI");
var connection = mongoose.createConnection(uri);
autoIncrement.initialize(connection);


var devLogSchema = new Schema({
    seq         : {type: Number},
    title       : String,
    descr       : String,
    success_check: {type : String,default:'N'},
    success_expect_date : {type: Date, default: Date.now()},
    reg_date    : {type: Date, default: Date.now()},
    success_date : Date,
    update_date : Date,
    file_list : Array
},
{ 
    collection: 'dev_log',versionKey: false 
});

devLogSchema.plugin(autoIncrement.plugin,{ 
    model : 'dev_log',
    field : 'seq',// auto-increment할 field
    startAt : 20, //시작
    increment : 1 // 증가 
});


var devLog = mongoose.model('dev_log', devLogSchema);
module.exports =devLog;