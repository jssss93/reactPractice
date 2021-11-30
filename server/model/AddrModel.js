var mongoose = require('mongoose');

var addrSchema = new mongoose.Schema({

    
    법정동코드: String,
    시도명: String,
    시군구명: String,
    읍면동명: String,
    리명: String,
    순위: String,
    생성일자: String,
    삭제일자: String,
    과거법정동코드: String,
    동리명 : String


});


var Addr = mongoose.model('addr', addrSchema);
module.exports =Addr;
//mongoose.model(‘{mongodb에서 Collection 명}’, {스키마객체명})



