var express = require("express");
var router = express.Router();
var passport= require("../config/passport"); // 1

// home
router.get("/", function(req, res)
{
  console.log("홈페이지 접근");
  res.render("home/welcome");
});

router.get("/about", function(req, res)
{
  console.log("about 페이지 접근");
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
      errors.username = "Id를 입력하세요.";
    }
    if(!req.body.password)
    {
      isValid = false;
      errors.password = "비밀번호를 입력하세요.";
    }

    if(isValid){
      next();
    } else {
      req.flash("errors",errors);
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
  res.redirect("/");
});

module.exports = router;
