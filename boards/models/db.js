/**
 * Created by ProgrammingPearls on 15. 4. 17..
 */
var mongoose = require('mongoose');

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

module.exports = db;
