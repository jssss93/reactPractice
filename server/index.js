const express = require('express');
const app = express();

var bodyParser          = require('body-parser');
var mongoose            = require('mongoose');
var router              = require('./router');//익스프레스에서 제공하는 라우터대신 사용자 라우터 사용.// var router      = express.Router();
var requestIp           = require('request-ip');//사용자 IP
var LogModel            = require('./model/logModel');
const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');
const session           = require('express-session');
const passport          = require('passport');
const passportConfig    = require('./passport');
passportConfig();


const cors = require('cors');
const PORT = process.env.port || 8000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	console.log("Connected to mongod server");
});

const uri = properties.get("mongoURI");
mongoose.connect(uri,{ useNewUrlParser: true });




app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});

//세션설정
app.use(session({
	key: 'sid',
	secret: 'secret',
	// resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
		secure: false, // https 프로토콜만 허락하는 지 여부
		maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
	}
}));
app.use(passport.initialize());
app.use(passport.session());  


//Interceptor 설정.
app.use(function(req, res, next) {

  if(-1==req.originalUrl.indexOf('.')){

 var url='';
 var prms = '';
 if(-1!=req.originalUrl.indexOf('?')){
   url = req.originalUrl.split('?')[0];
   prms = req.originalUrl.split('?')[1];
 }else{
   url = req.originalUrl;
 }
 
 var logModel = new LogModel();
 logModel.reg_date = new Date();
 logModel.url = url;
 logModel.prms = prms;
 logModel.ip = requestIp.getClientIp(req);
 logModel.save();


 console.log("###########   "+req.originalUrl +"   ###########")

  }
  next();
  
});

app.use(router)
