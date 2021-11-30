var express     = require('express');//import 시킨다 는의미
var app         = express();
var router      = express.Router();
var path        = require('path');

// router.get('/',function(req,res){
//     res.sendFile(path.join(__dirname,'../public/main.html'))
    
// });

module.exports = router; //이 라인으로 인해 다른소스에서도 router 를 가져다 쓸 수 있다.