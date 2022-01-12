var mongoose = require('mongoose');

var showAddrSchema = new mongoose.Schema({

    
    법정동코드: String,
    시도명: String,
    시군구명: String,
    읍면동명: String,
    동리명 : String
    // 리명: String,
    // 순위: String,
    // 생성일자: String,
    // 삭제일자: String,
    // 과거법정동코드: String,



});


var ShowAddr = mongoose.model('show_addrs', showAddrSchema);
module.exports =ShowAddr;
//mongoose.model(‘{mongodb에서 Collection 명}’, {스키마객체명})


// db.show_addrs.insertMany(
// 	db.apis.aggregate(
// 		[
// 			{$group:{_id:{'법정동시군구코드':'$법정동시군구코드','법정동읍면동코드':'$법정동읍면동코드'}}}
// 			,{$project:{_id:false,'법정동시군구코드':'$_id.법정동시군구코드','법정동읍면동코드':'$_id.법정동읍면동코드'}}
// 			,{ $project: { 법정동코드: { $concat: [ "$법정동시군구코드","$법정동읍면동코드" ] } } }

// 			,{
// 				$lookup : {
// 					  from : "addrs"
// 					, localField : "법정동코드"
// 					, foreignField : "법정동코드"
// 					, as : "new_addrs"
// 				}
// 			}
// 			,{$project:{"법정동코드":0}}
// 			,{$unwind:'$new_addrs' }
// 			,{$project:{
// 				법정동코드:'$new_addrs.법정동코드'
// 				,행정동코드:'$new_addrs.행정동코드'
// 				,시도명:'$new_addrs.시도명'
// 				,시군구명:'$new_addrs.시군구명'
// 				,읍면동명:'$new_addrs.읍면동명'
// 				,동리명:'$new_addrs.동리명'
// 			}}
// 		]	
// 	).toArray()
// )



