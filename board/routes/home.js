var express = require('express');
var router  = express.Router();
var passport = require("../config/passport"); // 1

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


// login //2
router.get("/login", function(req, res)
{
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0];
  console.log("get로그인 성공");
  res.render("home/login",{
    username: username,
    errors:errors
  });
});

// post login //3
router.post("/login",
function(req,res,next)
{
    var errors = {};
    var isValid = true;
    if(!req.body.username)
    {
     isValid = false;
     errors.username = "ID를 입력하세요.";
    }
    if(!req.body.password)
    {
     isValid = false;
     errors.password = "패스워드를 입력하세요.";
    }
    if(isValid)
    {
     next();
    } else
    {
     req.flash("errors",errors);
     res.redirect("/login");
    }
},
   passport.authenticate("local-login",
   {
    successRedirect : "/",
    failureRedirect : "/login"
   }
));

// logout //4
router.get("/logout",function(req, res)
{
  req.logout();
  res.redirect("/");
})
module.exports = router;
