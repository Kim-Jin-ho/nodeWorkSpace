var express = require('express');
var router = express.Router();
var Post = require("../models/FreePost");

// 인덱스
router.get("/", function(req, res)
{
  Post.find({}, function(err, posts)
  {
    if(err) return res.json(err);
    console.log("자유게시판 입장");
    res.render("posts/frindex",{posts:posts});
  });
});

//  new
router.get("/frnew", function(req, res)
{
  console.log("자유게시판 글작성화면");
  res.render("posts/frnew");
});

// create
router.post("/", function(req, res)
{
  Post.create(req.body, function(err, posts)
  {
    if(err) return res.json(err);
    console.log("자유게시판 글작성");
    res.redirect("/frposts");
  });
});

// show
router.get("/:id", function(req, res)
{
  Post.findOne({_id:req.params.id}, function(err, post)
  {
    if(err) return res.json(err);
    console.log("게시글 화면 입장");
    res.render("posts/frshow", {post:post});
  });
});

// edit
router.get("/:id/fredit", function(req, res)
{
 Post.findOne({_id:req.params.id}, function(err, post)
 {
  if(err) return res.json(err);
  console.log("자유 게시판 수정화면 접근");
  res.render("posts/fredit", {post:post});
 });
});

// 수정
router.put("/:id", function(req, res)
{
 req.body.updatedAt = Date.now();
 Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post)
 {
  if(err) return res.json(err);
  console.log("수정완료");
  res.redirect("/frposts/"+req.params.id);
 });
});

// 삭제
router.delete("/:id", function(req, res, next)
{
  Post.remove({_id:req.params.id}, function(err)
  {
    if(err) return res.json(err);
    res.redirect("/frposts");
  });
});


// 모듈 연결
module.exports = router;
