/**
 * Created by ProgrammingPearls on 15. 4. 17..
 */
var express = require('express');
var router = express.Router();
var db = require('../models/db');
require('../models/boardmodel');
var BoardModel = db.model('Board');

/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('board', { title: 'PCZEN Test Board',data: "" });
});


router.get('/write', function (req, res, next) {

  if(!req.session.login)
    res.render('users/plslogin',{title:"로그인 해주세요"})
  else
    res.render('board/writeform', { "title" : "글쓰기"});
});


router.post('/write', function (req, res, next) {


  var title = req.body.title;
  var content = req.body.content;
  var board = new BoardModel({
    "title" : title,
    "content" : content,
    "passwd" : req.session.PW,
    "id" : req.session.ID
  });

  board.save(function (err, doc) {
    if (err) console.error('err', err);
    console.log("doc", doc);

    res.redirect('/board/list/1');
  });

});

router.get('/list', function (req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {
  var page = req.params.page;

  page = parseInt(page, 10);

  BoardModel.count(function (err, cnt) {
    var size = 20;  // 한 페이지에 보여줄 개수
    var begin = (page - 1) * size; // 시작 글
    var totalPage = Math.ceil(cnt / size);  // 전체 페이지의 수 (75 / 10 = 7.5(X) -> 8(O))
    var pageSize = 10; // 페이지 링크의 개수

    // 1~10페이지는 1로, 11~20페이지는 11로 시작되어야하기 때문에 숫자 첫째자리의 수를 고정시키기 위한 계산법
    var startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
    var endPage = startPage + (pageSize - 1);

    if(endPage > totalPage) {
      endPage = totalPage;
    }

    // 전체 글이 존재하는 개수
    var max = cnt - ((page-1) * size);
    BoardModel.find({}).sort("-num").skip(begin).limit(size).exec(function (err, docs) {
      if (err) console.error('err', err);
      var datas = {
        "title" : "게시판 리스트",
        "data" : docs,
        "page" : page,
        "pageSize" : pageSize,
        "startPage" : startPage,
        "endPage" : endPage,
        "totalPage" : totalPage,
        "max" : max
      };

      res.render('board/list', datas);
    });
  });
});

router.get('/write300', function (req, res, next) {
  for(var i = 1; i<300; i++) {
    var board = new BoardModel({
      "title" : '제목' + i,
      "content" : '내용' + i,
      "passwd" : '1234',
      "id" : "system"
    });

    board.save(function (err, doc) {
      if(err) console.error('err', err);
    });
  }

  res.send('<head><meta charset="utf-8"><script>alert("300개의 글 저장 성공");location.href="/board/list/1"</script></head>');
});

router.get('/read/:page/:num', function (req, res, next) {
  var page = req.params.page;
  var num = req.params.num;

  BoardModel.update( {"num" : num}, {"$inc" : {"hit" : 1}}, function (err, doc) {
    if (err) console.error('err', err);

    BoardModel.find({"num" : num} , function (err, docs) {
      if (err) console.error('err', err);
      console.log('docs', docs);
      res.render('board/read', {"title" : "글 읽기", "data" : docs[0], "page" : page});
    });

  });

});


router.get('/update/:page/:num', function (req, res, next) {
      var page = req.params.page;
      var num = req.params.num;

      BoardModel.findOne({"num" : num}, function (err, doc) {
        if (err) console.log ('err', err);

        console.log('doc', doc);

    res.render('board/updateform', {"title" : "글 수정", "data" : doc, "page" : page});
  });
});

router.post('/update', function (req, res, next) {
  console.log('req.body', req.body);

  var num = req.body.num;
  var page = req.body.page;
  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.session.PW;
  var board = {
    "title" : title,
    "content" : content,
    "passwd" : passwd
  };

  BoardModel.update({"num" : num, "passwd" : passwd}, {$set : board}, function (err, doc) {
    if (err) console.error('err', err);
    console.log("doc", doc);
    if (doc.n == 1){
      res.redirect('/board/list/' + page);
    } else {
      res.send('<head><meta charset="utf-8"><script>alert("비밀번호가 틀려서 뒤로 돌아갑니다.");history.back();</script></head>');
    }


  });
});

router.post('/delete', function (req, res, next) {
  var num = req.body.num;
  var userId = req.session.ID
  var page = req.body.page;

  BoardModel.remove({"num" : num, "id" :ID}, function (err, doc) {
    if (err) console.error('err', err);
    console.log('doc', doc);
    if (doc.result.n ==1 ){
      res.redirect('/board/list/' + page);
    } else {
      res.send('<head><meta charset="utf-8"><script>alert("오류 발생 관리자에게 중복 글이 있다 문의 하세요 num ="+num);history.back();</script></head>');
    }
  });
});
module.exports = router;
