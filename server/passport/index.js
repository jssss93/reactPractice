const passport = require('passport');
// const User = require('../model/UserModel');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
//오픈 후 naver 추가 예정

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('###########')
        var saveData = {'user_id':user.user_id,'social_div':user.social_div};
        done(null, saveData);
    });

    passport.deserializeUser((saveData, done) => {
        done(null, saveData)
    });

    local();
    kakao();
};