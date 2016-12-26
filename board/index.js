var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("./config/passport");
var app = express();
var upload = require('./routes/posts.js');
// DB 세팅
//gi

mongoose.connect(process.env.MONGO_DB);   // 시스템 환경변수에 설정된 DB 주소를 통하여 DB 연결
//mongoose.connect('mongodb://localhost/mongodb_tutorial');
/*
   mongoose.connect('mongodb://localhost/mongodb_tutorial');
   직접 컴퓨터에 DB를 설치 한 후 접속 시 위와 같이 localhost/db명을 입력하여 접근한다.

   외부의 ip로 접근 시 localhost 부분에 외부접속 ip 를 등록 하여 접근한다.
*/
var db = mongoose.connection;
db.once("open", function()
{
 console.log("★★★★★★★★★★ 짜잔 ★★★★★★★★★★");
 console.log("DB 가 연결 되었습니다. 짝짝짝짝짝짝짝짝짝짝짝 ");
});
// 연결 실패 또는 에러 발생 시 에러를 log 창에 띄움
db.on("error", function(err)
{
  console.log("DB 에러 : ", err);
});

// 그 외 setting
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:"MySecret"}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req, res, next)
{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// 라우터 연결
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/frposts", require("./routes/freeposts"));
app.use("/users", require("./routes/users"));

// 포트 세팅
app.listen(process.env.PORT || 3000, function()
{
  console.log("서버가 켜졌습니다.");
});
