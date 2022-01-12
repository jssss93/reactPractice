var mongoose = require('mongoose');

var APISchema = new mongoose.Schema({

    거래금액: {type:Number, trim: true},
    건축년도: String,
    년: Number,
    월: Number,
    일: Number,
    법정동: {type:String,trim:true},
    아파트: String,
    전용면적: Number,
    지번: String,
    지역코드: String,
    층: Number,
    해제여부: String,
    해제사유발생일: String

    //상세 API 로 바꾼후 추가되는 컬럼.
    ,도로명 : String
    ,도로명건물본번호코드 : String
    ,도로명건물부번호코드 : String
    ,도로명시군구코드 : String
    ,도로명일련번호코드 : String
    ,도로명지상지하코드 : String
    ,도로명코드 : String
    ,법정동본번코드 : String
    ,법정동부번코드 : String
    ,법정동시군구코드 : String
    ,법정동읍면동코드 : String
    ,법정동지번코드 : String
    ,일련번호 : String
    ,거래일:String
    
    ,최소거래금액:Number
    ,최대거래금액:Number
    ,거래건수:Number
    
});
var Apis= mongoose.model('api', APISchema);
module.exports =Apis

//db.apis.getIndexes()
// db.apis.createIndex( { 년: 1, 월: 1} );
// db.apis.createIndex( { 거래일: -1} );