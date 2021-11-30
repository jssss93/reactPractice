var mongoose = require('mongoose');

var HouseSchema = new mongoose.Schema({

    거래금액: {type:Number, trim: true},
    건축년도: String,
    년: Number,
    월: Number,
    일: Number,
    대지면적 : Number,
    법정동: {type:String,trim:true},
    주택유형: String,
    연면적: Number,
    지역코드: String,
    거래일:String



    
});
var Houses= mongoose.model('house', HouseSchema);
module.exports =Houses