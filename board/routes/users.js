var express = require("express");
var router = express.Router();
var User  = require("../models/User");

// 인덱스
router.route("/").get(function(req, res)
{
 User.find({})
 .sort({username:1})
 .exec(function(err, users)
 {
  if(err) return res.json(err);
  res.render("users/index", {users:users});
 });
});

// 유저 생성
router.get("/new", function(req, res)
{
 res.render("users/new", {user:{}});
});

// 유저 만들기
router.post("/", function(req, res)
{
 User.create(req.body, function(err, user)
 {
  if(err) return res.json(err);
  res.redirect("/users");
 });
});

// 유저 목록
router.get("/:username", function(req, res)
{
 User.findOne({username:req.params.username}, function(err, user)
 {
  if(err) return res.json(err);
  res.render("users/show", {user:user});
 });
});

// edit
router.get("/:username/edit", function(req, res)
{
 User.findOne({username:req.params.username}, function(err, user)
 {
  if(err) return res.json(err);
  res.render("users/edit", {user:user});
 });
});

// 수정
router.put("/:username",function(req, res, next)
{
 User.findOne({username:req.params.username})
 .select("password")
 .exec(function(err, user)
 {
  if(err) return res.json(err);

  // update user object
  user.originalPassword = user.password;
  user.password = req.body.newPassword? req.body.newPassword : user.password;
  for(var p in req.body)
  {
   user[p] = req.body[p];
  }

  // save updated user
  user.save(function(err, user)
  {
   if(err) return res.json(err);
   res.redirect("/users/"+req.params.username);
  });
 });
});

module.exports = router;
