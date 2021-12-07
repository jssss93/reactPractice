const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../model/UserModel');
const PropertiesReader  = require('properties-reader');
const properties        = PropertiesReader('./properties');

module.exports = () => {
  console.log("카카오스트렛지")
  passport.use(new KakaoStrategy({
    clientID:properties.get("kakao.ID"),
    callbackURL:'/login/doKakaoLogin_callback',
    session: true // 세션에 저장 여부
    // passReqToCallback: false,
  }, async (accessToken,refreshToken,profile,done)=>{
    try {
      console.log("카카오스트렛지2")
      const exUser = await User.findOne({"user_id":profile.id,"social_div":"kakao"});
      if (exUser) {
        done(null,exUser);
      } else {
        var userModel = new User();
        userModel.reg_date = new Date();
        userModel.user_id = profile.id;
        userModel.social_div = 'kakao';
        userModel.email = profile._json.kakao_account.email;
        userModel.save();
        done(null,userModel);
      }
    } catch (error) {
        console.log("@@@@@@@@")
      console.error(error);
      done(error);
    }
  }));
};


