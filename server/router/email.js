var express = require('express');
var router  = express.Router();
var path    = require('path');
var app     = express();

router.post('/email_post',function(req,res){//콜백함수를만든다 이것도역시 비동기
    console.log(req.body.email)
    //res.send("welcome !"+req.body.email)
    res.render('email.ejs',{'email':req.body})
})

router.post('/ajax_send_email',function(req,res){
    console.log(req.body.email)
    var responseData ={'result':'ok','email':req.body.email}
    res.json(responseData)
})


module.exports = router; //이 라인으로 인해 다른소스에서도 router 를 가져다 쓸 수 있다.