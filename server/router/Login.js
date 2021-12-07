var express = require('express');
var router  = express.Router();
const crypto = require('crypto');
const passport          = require('passport');
var UserModel = require('../model/UserModel');
const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');


router.post("/doJoin", async function(req,res,next){
    var message = "99";
    let body = req.body;

    let inputPassword = body.pw;
    // let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword).digest("hex");
    
    var userModel = new UserModel();
    userModel.reg_date = new Date();
    userModel.user_id = body.id;
    userModel.pw = hashPassword;
    userModel.email = body.email;
    userModel.save();

    message="1";
    res.send(message);
})

router.post('/doLogin',  (req, res, next) => {
    var user={};
    user.id=req.body.id;
    user.pw=req.body.pw;

    passport.authenticate('local', (authError, user, info) => {

        if (authError) {
            return next(authError);
        }

        if(!user){
            //99 = 계정 미존재
            //98 = 비밀번호 불일치
            return res.send(info.message)
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                return res.send("97");
            }
        
            return res.send("1");
        });
        
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});


// router.route('/doLogout').get(                      
//     function (req, res) {
//         req.logout();
//         req.session.save(function(){
//             res.redirect('/');
//         });
//     }
// )

//ID 중복 확인
router.post("/idDupleCnt", async function(req,res,next){
    
    var query = { user_id : req.body.id+'' };
    var count = await UserModel.count(query);
    console.log(new Date() +':: '+req.body.id+",,"+count);
    res.send(''+count);
})

//EMAIL 중복 확인
router.post("/emailDupleCnt", async function(req,res,next){
    // console.log(req.body.email)
    var query = { email : req.body.email };
    var count = await UserModel.count(query);
    res.send(''+count);
})

// 메인 페이지
// router.get('/', function(req, res, next) {
//     res.send('환영합니다~');
// });

// 로그인 GET
router.post('/kakaoLogin', async function(req, res, next) {
    try {
        console.log(req.body.user_id)
        console.log("카카오스트렛지2")
        const exUser = await UserModel.findOne({"user_id":req.body.user_id,"social_div":"kakao"});
        if (exUser) {
            //회원이면
            console.log("회원")
            res.send('0')
        } else {
            console.log("비회원")
          res.send('1')
        }
      } catch (error) {
        console.error(error);
      }
    
});

router.post('/kakaoJoin', function(req, res, next) {
    try {
        console.log("카카오회원가입")
        var userModel = new UserModel();
        userModel.reg_date = new Date();
        userModel.user_id = req.body.user_id;
        userModel.social_div = 'kakao';
        userModel.email = req.body.email;
        userModel.save();
        res.send('0')
      } catch (error) {
        console.error(error);
      }
    
});

//KAKAO LOGIN
router.get('/doKakaoLogin', passport.authenticate('kakao'));

router.get('/doKakaoLogin_callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    console.log("pass")
    res.redirect('/');
});

//Mypage
router.get('/mypage', function(req, res, next) {
    console.log(req.user)
    res.render("login/mypage",{"ss_user":req.user});
});


module.exports = router; //이 라인으로 인해 다른소스에서도 router 를 가져다 쓸 수 있다.