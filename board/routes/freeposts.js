var express = require('express');
var router = express.Router();
var Post = require("../models/FreePost");
var util  = require("../util");

// 인덱스
router.get("/", function(req, res)
{
  Post.find({}, function(err, posts)
  {
    if(err) return res.json(err);
    console.log("자유게시판 접근 " + Date());
    res.render("posts/frindex",{posts:posts});
  });
});

// New
router.get("/frnew", function(req, res)
{
   var post = req.flash("post")[0] || {};
   var errors = req.flash("errors")[0] || {};
   console.log("자유게시판 글작성 " + Date());
   res.render("posts/frnew", { post:post, errors:errors });
});

// create
router.post("/", function(req, res)
{
   req.body.author = req.user._id;
   Post.create(req.body, function(err, post)
   {
    if(err){
     req.flash("post", req.body);
     req.flash("errors", util.parseError(err));
     console.log("자유게시판 글작성 에러 "  + Date());
     return res.redirect("/frposts/frnew");
    }
    console.log("자유게시판 글작성 성공 "  + Date());
    res.redirect("/frposts");
   });
});

// show
router.get("/:id", function(req, res)
{
  Post.findOne({_id:req.params.id}) // 2
  .populate("author")               // 2
  .exec(function(err, post)
  {
    if(err) return res.json(err);
    console.log("자유게시글 접근 "  + Date());
    res.render("posts/frshow", {post:post});
  });
});

// 수정
router.get("/:id/fredit", function(req, res)
{
 var post = req.flash("post")[0];
 var errors = req.flash("errors")[0] || {};
 if(!post){
  Post.findOne({_id:req.params.id}, function(err, post)
  {
   if(err) return res.json(err);
   console.log("자유게시판 글수정 화면 접근 "  + Date());
   res.render("posts/fredit", { post:post, errors:errors });
  });
 } else
 {
  post._id = req.params.id;
  console.log("자유게시판 글수정 화면 "+Date());
  res.render("posts/fredit", { post:post, errors:errors });
 }
});

// 수정
router.put("/:id", function(req, res){
 req.body.updatedAt = Date.now();
 Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
  if(err){
   req.flash("post", req.body);
   req.flash("errors", util.parseError(err));
   console.log("자유게시판 글수정 에러 "  + Date());
   return res.redirect("/frposts/"+req.params.id+"/fredit");
  }
  console.log("자유게시판 글수정 성공 "  + Date());
  res.redirect("/frposts/"+req.params.id);
 });
});

// 삭제
router.delete("/:id", function(req, res)
{
  var id = req.params.id
  Post.remove({_id:id}, function(err)
  {
    console.log(id);
    if(err)
    {
      console.log("에러발생 "  + Date())
      return res.json(err);
    }
    console.log("정상처리 "  + Date());
    res.redirect("/frposts");
  });
});


// 모듈 연결
module.exports = router;
