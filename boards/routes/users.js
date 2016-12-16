var express = require('express')
var router = express.Router()
var db = require("../models/db");require("../models/usermodel")
var crypto=require("crypto")

var UserModel = db.model("User")

/* GET users listing. */

router.get('/login', function(req, res, next) {

  if(!req.session.login)
    res.render('users/login',{title:"Login page"})
  else
    res.send("이미 로그인 되었습니다"+req.session.name);
});

router.post("/login",function (req,res,next)  {
  var uid = req.body.id
  var upw = req.body.pw

  var encrypted=crypto.createHash('sha512').update(upw).digest('hex');

  if(req.session.count==undefined) {
    req.session.count = 0
    console.log("Active")
  }

  UserModel.find({"id":uid,"pw":encrypted}).exec(function(err,users){

    if(users.length) {
      req.session.ID = users[0].id
      req.session.userName = users[0].name
      req.session.PW = users[0].pw
      req.session.login=true


      console.log("!!!" + users)
      res.send("<html><head><script>history.go(-2)</script></head></html>");
    }
    else{
      req.session.logincount+=1;
      console.log(req.session.logincount)
      res.send("<html><head><script>alert("+req.session.logincount+"</script>" +
          "<script>history.back()</script>" +
          "</head></html>")
    }


  })

});


router.get("/signup",function(req,res,next){
  res.render("users/signup",{title:"Sign up"})
})

router.post("/signup",function(req,res,next){
  var uid=req.body.id
  var upw=req.body.pw
  var uname=req.body.name
  var uemail=req.body.email
  var uby=req.body.birthyear
  var umob=req.body.mob

  var encrypted=crypto.createHash('sha512').update(upw).digest('hex');

  var User = UserModel({
    "id":uid,
    "pw":encrypted,
    "name":uname,
    "email":uemail,
    "birthyear":uby,
    "mob":umob
  })

  User.save(function(err,user){
    console.log(user)
  })

  res.redirect("/board/")


})

router.get("/",function(req,res){

  res.send(req.session.test.toString())

  console.log(req.session.test)

})

module.exports = router;
