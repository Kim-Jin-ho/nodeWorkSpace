var express = require('express');
var router = express.Router();
var Post = require("../models/Post");
var util  = require("../util");
var fs = require("fs");
var multiparty = require('multiparty');

// 인덱스
router.get("/", function(req, res)
{
  Post.find({}, function(err, posts)
  {
    if(err) return res.json(err);
    console.log("게시판 접근 " + Date());
    res.render("posts/index",{posts:posts});
  });
});

// New
router.get("/new", function(req, res)
{
   var post = req.flash("post")[0] || {};
   var errors = req.flash("errors")[0] || {};
   console.log("게시판 글작성 " + Date());
   res.render("posts/new", { post:post, errors:errors });
});

// create
router.post("/", function(req, res)
{
 Post.create(req.body, function(err, post)
 {
  if(err)
  {
   req.flash("post", req.body);
   req.flash("errors", util.parseError(err));
   console.log(err);
   console.log("게시판 글작성 에러 " + Date());
   return res.redirect("/posts/new");
  }
  // var form = new multiparty.Form();
  //
  // // get field name & value
  // form.on('field',function(name,value){
  //      console.log('normal field / name = '+name+' , value = '+value);
  // });
  //
  // // file upload handling
  // form.on('part',function(part){
  //      var filename;
  //      var size;
  //      if (part.filename) {
  //            filename = part.filename;
  //            size = part.byteCount;
  //      }else{
  //            part.resume();
  //
  //      }
  //
  //      console.log("Write Streaming file :"+filename);
  //      var writeStream = fs.createWriteStream('/tmp/'+filename);
  //      writeStream.filename = filename;
  //      part.pipe(writeStream);
  //
  //      part.on('data',function(chunk){
  //            console.log(filename+' read '+chunk.length + 'bytes');
  //      });
  //
  //      part.on('end',function(){
  //            console.log(filename+' Part read complete');
  //            writeStream.end();
  //      });
  // });
  //
  // // all uploads are completed
  // form.on('close',function(){
  //      res.status(200).send('Upload complete');
  // });
  //
  // // track progress
  // form.on('progress',function(byteRead,byteExpected){
  //      console.log(' Reading total  '+byteRead+'/'+byteExpected);
  // });
  //
  // form.parse(req);
  console.log("게시판 글작성 성공 " + Date());
  res.redirect("/posts");
 });
});

// show
router.get("/:id", function(req, res)
{
  Post.findOne({_id:req.params.id}, function(err, post)
  {
    if(err) return res.json(err);
    console.log("게시글 접근 " + Date());
    res.render("posts/show", {post:post});
  });
});

// 수정
router.get("/:id/edit", function(req, res)
{
 var post = req.flash("post")[0];
 var errors = req.flash("errors")[0] || {};
 if(!post){
  Post.findOne({_id:req.params.id}, function(err, post)
  {
   if(err) return res.json(err);
   console.log("글수정 화면 접근 " + Date());
   res.render("posts/edit", { post:post, errors:errors });
  });
 } else
 {
  post._id = req.params.id;
  console.log("글수정 화면 " +Date());
  res.render("posts/edit", { post:post, errors:errors });
 }
});

// 수정
router.put("/:id", function(req, res){
 req.body.updatedAt = Date.now();
 Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
  if(err){
   req.flash("post", req.body);
   req.flash("errors", util.parseError(err));
   console.log("글수정 에러 " + Date());
   return res.redirect("/posts/"+req.params.id+"/edit");
  }
  console.log("글수정 성공 " + Date());
  res.redirect("/posts/"+req.params.id);
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
      console.log("에러발생 " + Date())
      return res.json(err);
    }
    console.log("정상처리 " + Date());
    res.redirect("/posts");
  });
});


// 모듈 연결
module.exports = router;
