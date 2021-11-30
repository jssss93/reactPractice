var mongoose = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./properties');

var autoIncrement = require('mongoose-auto-increment');

const uri = properties.get("mongoURI");
var connection = mongoose.createConnection(uri);
autoIncrement.initialize(connection);




var UserSchema = new mongoose.Schema({

    // seq: {type:Number, trim: true},
    seq: {type:Number},
    user_id: String,
    pw: String,
    email: String,
    // tel: String,
    PeriodicWave: String,
    reg_date: String,
    upt_date: String,
    social_div:{type:String,default:'local'}
    
});

UserSchema.plugin(autoIncrement.plugin,{
    model : 'user',
    field : 'seq',
    startAt : 1, //시작 
    increment : 1 // 증가
});

var User= mongoose.model('user', UserSchema);
module.exports =User