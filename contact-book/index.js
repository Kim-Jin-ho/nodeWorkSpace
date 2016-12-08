var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// DB setting
 //mongoose.connect(process.env.MONGO_DB);   // 1
 /*
    mongoose.connect(process.env.MONGO_DB);
    구문은 환경변수에 MONGO_DB 를 등록한 후 mlab 의 db주소를 환경변수 주소로 등록한다.
    mongodb://dbuser:dkssud12@ds127878.mlab.com:27878/contact_book2
              DB_ID : 패스워드
              이런 식으로 환경 변수를 등록한 후 DB에 연결할 수 있도록 한다.
 */
 mongoose.connect('mongodb://localhost/mongodb_tutorial');
 /*
    mongoose.connect('mongodb://localhost/mongodb_tutorial');
    직접 컴퓨터에 DB를 설치 한 후 접속 시 위와 같이 localhost/db명을 입력하여 접근한다.

    외부의 ip로 접근 시 localhost 부분에 외부접속 ip 를 등록 하여 접근한다.
 */
var db = mongoose.connection;   // 2
db.once("open", function()
{
  console.log("DB Connected");
});

db.on("error", function()
{
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Routes
app.use("/", require("./routes/home")); //1
app.use("/contacts", require("./routes/contacts")); //2

// Port setting
app.listen(3000, function()
{
  console.log("server on");
})
