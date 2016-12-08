var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// DB 세팅
mongoose.connect(process.env.MONGO_DB);   // 시스템 환경변수에 설정된 DB 주소를 통하여 DB 연결
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

// 라우터 연결
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
// 포트 세팅
app.listen(3000, function()
{
  console.log("서버가 켜졌습니다.");
});
