var express = require("express");
var router = express.Router();
var passport= require("../config/passport"); // 1

// home
router.get("/", function(req, res)
{
  console.log("홈페이지 접근 " + Date());
  res.render("home/welcome");
});

router.get("/about", function(req, res)
{
  console.log("about 페이지 접근 " + Date());
  res.render("home/about");
});


// Login
router.get("/login", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username:username,
    errors:errors
  });
});

// Post Login
router.post("/login",
  function(req,res,next)
  {
    var errors = {};
    var isValid = true;

    if(!req.body.username)
    {
      isValid = false;
      console.log("Id 입력 오류 " + Date());
      errors.username = "Id를 입력하세요.";
    }
    if(!req.body.password)
    {
      isValid = false;
      console.log("비밀번호 입력 오류" + Date());
      errors.password = "비밀번호를 입력하세요.";
    }

    if(isValid){
      console.log("로그인 성공 " + Date());
      next();
    } else {
      req.flash("errors",errors);
      console.log("로그인 실패 " + Date());
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login",
  {
    successRedirect : "/posts",
    failureRedirect : "/login"
  }
));

// Logout
router.get("/logout", function(req, res)
{
  req.logout();
  console.log("로그아웃 " + Date());
  res.redirect("/");
});

module.exports = router;
