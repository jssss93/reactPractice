var express = require('express');
var router  = express.Router();

var email   = require('./email')
var api     = require('./API')
var login   = require('./Login')
var house   = require('./HOUSE')

router.use('/email',email);// email 으로 요청이 들어오면 email 라우터로처리해라
router.use('/api',api);
router.use('/login',login);
router.use('/house',house);

router.get('/',function(req,res){
    res.redirect('/api/main');
});

module.exports = router; 