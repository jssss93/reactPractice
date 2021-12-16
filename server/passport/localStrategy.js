const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const User = require('../model/UserModel');
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true // 세션에 저장 여부
    // passReqToCallback: false,
  }, async (id, pw, done) => {
    try {
      const exUser = await User.findOne({"user_id":id},{_id:0,user_id:1,social_div:1,email:1,pw:1});
      if (exUser) {
        let hashPassword = crypto.createHash("sha512").update(pw).digest("hex");
        if (hashPassword == exUser.pw) {
          console.log("정상로그인")
          done(null, exUser); //정상로그인
        } else {
          console.log("비밀번호틀림")
          done(null, null, { message: '98' }); //비밀번호 불일치
        }
      } else {
        console.log("계정미존재")
        done(null, null, { message: '99' });//계정미존재
      }
    } catch (error) {
        console.log("@@@@@@@@")
      console.error(error);
      done(error);
    }
  }));
};