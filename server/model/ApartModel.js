var mongoose = require('mongoose');

var ApartSchema = new mongoose.Schema({

    아파트: {type:String, trim: true},
    법정동: {type:String,trim:true}
});
var Aparts= mongoose.model('apart', ApartSchema);
module.exports =Aparts

/**
 * 아파트 collections 생성 쿼리 -> ApartModel.js
db.aparts.insertMany(
	db.apis.aggregate(
		[
			{$group:{_id:{'아파트':'$아파트','법정동':'$법정동'}}},
			{$project:{_id:false,'아파트':'$_id.아파트','법정동':'$_id.법정동'}}
		]
	).toArray()
)
 * 
 */