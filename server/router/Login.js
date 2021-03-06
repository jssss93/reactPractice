var express = require('express');
var router  = express.Router();
const crypto = require('crypto');
const passport          = require('passport');
var UserModel = require('../model/UserModel');
var FavoriteSpotModel = require('../model/FavoriteSpotModel');
var FavoriteApartModel = require('../model/FavoriteApartModel');

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
        //1. localStrategy.js
        //2. passport-index.js =>
        return req.login(user, (loginError) => {
            if (loginError) {
                return res.send("97");
            }
            user.pw='';
            // delete user.pw;
            console.log('---user')
            console.log(user)
            return res.send(user);
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
router.post('/myPage', async function(req, res) {
    console.log(req.body)
    const exUser = await UserModel.findOne({"user_id":req.body.user_id},{_id:0,user_id:1,email:1,social_div:1});
    console.log(exUser)
    res.send(exUser)

});


//changeInfo
router.post('/changeInfo', async function(req, res) {
    var result={};
    console.log(req.body)
    let hashPassword = crypto.createHash("sha512").update(req.body.pw0).digest("hex");
    var changePw = '';
    if(req.body.pw==''){
        changePw=hashPassword
    }else{
        changePw=crypto.createHash("sha512").update(req.body.pw).digest("hex");
    }
    var cnt = await UserModel.count({"user_id":req.body.id,"pw":hashPassword});

    if(cnt==0){
        //비밀번호 올바르지 않음 처리.
        result.state="99";
    }else{
        var rslt = await UserModel.updateOne(
            {user_id:req.body.id},
            {$set: {email: req.body.email,pw: changePw}}
        ).clone();

        if(rslt!=null){
            result.state="0"
        }
    }
    
    res.send(result)

});



//addFavorite
router.post('/addFavoriteApart', async function(req, res) {
    console.log(req.body)
    var result="0";
    
    var favoriteApartModel = new FavoriteApartModel();
    FavoriteApartModel.find({},{},function(err,datas){
        
        console.log('---------')
        console.log('---------')
        console.log('---------')
        console.log(datas)

        
        if(datas.length>0){
            favoriteApartModel.ordr=datas[0].ordr+1;
        }else{
            favoriteApartModel.ordr=1;
        }

        console.log("favoriteApartModel.ordr==>")
        console.log(favoriteApartModel.ordr)

        favoriteApartModel.reg_date = new Date();
        favoriteApartModel.user_id = req.body.user_id;
        favoriteApartModel.addr_sub_code = req.body.addr_sub_code;
        favoriteApartModel.apart_name = req.body.apart_name;
        favoriteApartModel.save(function(data){
            console.log(data);
            result = "1";
            res.send(result)
        });
    
    }).sort({ordr:-1}).limit(1)
    

});


router.post('/getFavoriteApart', async function(req, res) {
    console.log(req.body)

    FavoriteApartModel.find({"user_id":req.body.user_id},{_id:0},   function(err, datas){    
        if(err) return res.status(500).json({error: err});
        if(datas.length>0){
            console.log(datas)
            res.send(datas);
        }else{
            console.log('datas not found1')
        }
    }).sort({ordr:1});

});



//addFavorite
router.post('/addFavoriteSpot', async function(req, res) {
    console.log(req.body)
    var result="0";
    
    var favoriteSpotModel = new FavoriteSpotModel();
    FavoriteSpotModel.find({},{},function(err,datas){
        
        console.log('---------')
        console.log('---------')
        console.log('---------')
        console.log(datas)

        
        if(datas.length>0){
            favoriteSpotModel.ordr=datas[0].ordr+1;
        }else{
            favoriteSpotModel.ordr=1;
        }

        console.log("favoriteSpotModel.ordr==>")
        console.log(favoriteSpotModel.ordr)

        favoriteSpotModel.reg_date = new Date();
        favoriteSpotModel.user_id = req.body.user_id;
        favoriteSpotModel.addr_name = req.body.MidAddrCode+"_"+req.body.SubAddrCode
        favoriteSpotModel.save(function(data){
            console.log(data)
            result = "1";
            res.send(result)
        });
    
    }).sort({ordr:-1}).limit(1)
});

router.post('/getFavoriteSpot', async function(req, res) {
    console.log(req.body)

    FavoriteSpotModel.find({"user_id":req.body.user_id},{_id:0},   function(err, datas){    
        if(err) return res.status(500).json({error: err});
        if(datas.length>0){
            console.log(datas)
            res.send(datas);
        }else{
            console.log('datas not found1')
        }
    }).sort({ordr:1});

});



router.post('/deleteFavoriteSpot', async function(req, res) {
    console.log(req.body)
    var result="0";
    FavoriteSpotModel.deleteOne({"user_id":req.body.user_id,seq:req.body.seq}, {},  function(err, datas){    
        if(err==null){
            result="1";
        }else{
            result="2";
        }
        res.send(result)
    })
});

router.post('/deleteFavoriteApart', async function(req, res) {
    console.log(req.body)
    var result="0";
    FavoriteApartModel.deleteOne({"user_id":req.body.user_id,seq:req.body.seq}, {},  function(err, datas){    
        if(err==null){
            result="1";
        }else{
            result="2";
        }
        res.send(result)
    })
});



module.exports = router; //이 라인으로 인해 다른소스에서도 router 를 가져다 쓸 수 있다.