var express = require('express');
var router = express.Router();
var Post = require("../models/Post");
var util = require("../util");
var fs = require("fs");
var multiparty = require('multiparty');

// 인덱스
router.get("/", function(req, res) {
    Post.find({}, function(err, posts) {
        if (err) return res.json(err);
        console.log("게시판 접근 " + Date());

        try
        {
          if(req.user.id !=null)
          {
            console.log(req.user.id);
            res.render("posts/index",
            {
                posts: posts
            });
          }
        } catch (e)
        {
          res.redirect("/login")
        }
    });
});

// New
router.get("/new", function(req, res) {
    var post = req.flash("post")[0] || {};
    var errors = req.flash("errors")[0] || {};
    console.log("게시판 글작성 " + Date());
    res.render("posts/new", {
        post: post,
        errors: errors
    });
});

// create
router.post("/", function(req, res) {
    req.body.author = req.user._id; // 1
    Post.create(req.body, function(err, post) {
        if (err) {
            req.flash("post", req.body);
            req.flash("errors", util.parseError(err));
            console.log(err);
            console.log("게시판 글작성 에러 " + Date());
            return res.redirect("/posts/new");
        }
        console.log("게시판 글작성 성공 " + Date());
        res.redirect("/posts");
    });
});


router.get("/:id", function(req, res) {
    Post.findOne({
            _id: req.params.id,
        }) // 2
        .populate("author") // 2
        .exec(function(err, post)
        { // 2
            if (err) return res.json(err);
            try
            {
              if(req.user.id)
              {
                var id = req.user.id;
                console.log(req.user.id);
                console.log("게시물 접근");
                console.log(post.author._id);
                res.render("posts/show",
                {
                    post: post,
                    id: id

                });
              }
            } catch (e)
            {
              console.log("비회원 게시물 접근");
              res.render("posts/show2",
              {
                post: post
              });
            }
        });
});

// 수정
router.get("/:id/edit", function(req, res) {
    var post = req.flash("post")[0];
    var errors = req.flash("errors")[0] || {};
    if (!post) {
        Post.findOne({
            _id: req.params.id
        }, function(err, post) {
            if (err) return res.json(err);
            console.log("글수정 화면 접근 " + Date());
            res.render("posts/edit", {
                post: post,
                errors: errors
            });
        });
    } else {
        post._id = req.params.id;
        console.log("글수정 화면 " + Date());
        res.render("posts/edit", {
            post: post,
            errors: errors
        });
    }
});

// 수정
router.put("/:id", function(req, res) {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate(
    {
        _id: req.params.id
    }, req.body, {
        runValidators: true
    }, function(err, post)
    {
        if (err)
        {
            req.flash("post", req.body);
            req.flash("errors", util.parseError(err));
            console.log("글수정 에러 " + Date());
            return res.redirect("/posts/" + req.params.id + "/edit");
        }
        console.log("글수정 성공 " + Date());
        res.redirect("/posts/" + req.params.id);
    });
});

// 삭제
router.delete("/:id", function(req, res) {
    var id = req.params.id
    Post.remove({
        _id: id
    }, function(err) {
        console.log(id);
        if (err) {
            console.log("에러발생 " + Date())
            return res.json(err);
        }
        console.log("정상처리 " + Date());
        res.redirect("/posts");
    });
});


// 모듈 연결
module.exports = router;
