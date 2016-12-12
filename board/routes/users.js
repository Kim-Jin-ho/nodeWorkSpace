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
      console.log("사용자 정보");
      res.render("users/index", {users:users});
   });
});

// 회원가입 new
router.get("/new", function(req, res)
{
  var user = req.flash("user")[0] || {};
  var errors = req.flash("errors")[0] || {};
  console.log("회원 가입");
  res.render("users/new", { user:user, errors:errors });
});

// 유저 만들기 create
router.post("/", function(req, res)
{
  User.create(req.body, function(err, user)
  {
    if(err)
    {
       req.flash("user", req.body);
       req.flash("errors", parseError(err));
       console.log("회원가입 에러발생");
       return res.redirect("/users/new");
    }
      console.log("회원가입 완료");
      res.redirect("/users");
   });
});

// 유저 목록
router.get("/:username", function(req, res)
{
 User.findOne({username:req.params.username}, function(err, user)
 {
  if(err) return res.json(err);
  console.log("유저 정보");
  res.render("users/show", {user:user});
 });
});

// edit
router.get("/:username/edit", function(req, res){
 var user = req.flash("user")[0];
 var errors = req.flash("errors")[0] || {};
 if(!user){
  User.findOne({username:req.params.username}, function(err, user)
  {
    if(err) return res.json(err);
    res.render("users/edit", { username:req.params.username, user:user, errors:errors });
  });
  } else
  {
    res.render("users/edit", { username:req.params.username, user:user, errors:errors });
  }
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
   if(err)
   {
      req.flash("user", req.body);
      req.flash("errors", parseError(err));
      return res.redirect("/users/"+req.params.username+"/edit");
   }
    console.log("유저 정보 수정 완료");
    res.redirect("/users/"+req.params.username);
  });
 });
});

module.exports = router;

// function
function parseError(errors)
{
 var parsed = {};
   if(errors.name == 'ValidationError')
   {
     console.log("errors: " , errors)
     for(var name in errors.errors)
     {
       var validationError = errors.errors[name];
       parsed[name] = { message:validationError.message };
     }
   }else if(errors.code == "11000" && errors.errmsg.indexOf("username") > 0)
   {
     console.log("errors: " , errors)
     parsed.username = { message:"유저이름이 중복됩니다." };
   }else
   {
     console.log("errors: " , errors)
     parsed.unhandled = JSON.stringify(errors);
   }
   return parsed;
}
