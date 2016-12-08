var express = require('express');
var router = express.Router();
var Post = require("../models/Post");

// 인덱스
router.get("/", function(req, res)
{
  Post.find({}, function(err, posts)
  {
    if(err) return res.json(err);
    res.render("posts/index",{posts:posts});
  });
});

//  new
router.get("/new", function(req, res)
{
  res.render("posts/new");
});

// create
router.post("/", function(req, res)
{
  Post.create(req.body, function(err, posts)
  {
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});

// show
router.get("/:id", function(req, res)
{
  Post.findOne({_id:req.params.id}, function(err, post)
  {
    if(err) return res.json(err);
    res.render("posts/show", {post:post});
  });
});

// edit
router.get("/:id/edit", function(req, res)
{
 Post.findOne({_id:req.params.id}, function(err, post)
 {
  if(err) return res.json(err);
  res.render("posts/edit", {post:post});
 });
});

// 수정
router.put("/:id", function(req, res)
{
 req.body.updatedAt = Date.now();
 Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post)
 {
  if(err) return res.json(err);
  res.redirect("/posts/"+req.params.id);
 });
});

// 삭제
router.delete("/:id", function(req, res)
{
  Post.remove({_id:req.param.id}, function(err)
  {
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});


// 모듈 연결
module.exports = router;
