var passport = require("passport");
var express =  require("express");
var KakaoStrategy = require("../lib/passport-kakao.js").Strategy;

var appKey = "6b2e7aed8ab4a7c76b05ad707eb55405";

// passport 에 Kakao Oauth 추가
passport.use( new KakaoStrategy({
        clientID: appKey,
        callbackURL: "http://localhost:3000/oauth"
    },
    function(accessToken, refreshToken, params, profile, done){

        var user = profile.username;
        // authorization 에 성공했을때의 액션
        console.log( "accessToken :" + accessToken );
        console.log("아이디 : "+ profile.username);
        console.log( "사용자 profile: " + JSON.stringify(profile._json) );

        save(accessToken, refreshToken, profile);
        return done(null, {user:profile});
    })
);
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// express 앱 설정
var app = express();
app.use(passport.initialize());
app.get("/login", passport.authenticate('kakao',{state: "myStateValue"}));
app.get("/oauth", passport.authenticate('kakao'), function(req, res)
{
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;

    console.log(req.user.user.username);
    console.log(req.user.user.id);
    res.redirect("/home");

});
app.listen(3000);

// 사용자 구현 부분
function save(){
    //save 로직 구현
}
