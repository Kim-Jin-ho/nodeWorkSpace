var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Blog = require('../../models/blog');
var fs = require('fs');
var multer = require('multer');
var filePaths = process.env.NODE_FILE_PATH || 'C:/nodeWorkSpace/NodeTest/blognode/file/image/upload';
var crypto = require('crypto');
var User = require('../../models/user');

router.get('/',function(req,res,next){
	res.render('main/index');
});

//thech
router.get('/',function(req,res,next){
	res.render('thech/index');
});

//file
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, filePaths); //설정해줘야함
	},
	filename: function (req, file, cb) {
		var ext = file.mimetype.split("/");
		console.log(ext[1]);
		cb(null, Date.now() + file.originalname + '.'+ ext[1]);
	}
});

var upload = multer({ storage: storage }).single('imageFileUpload');


router.put('/image/upload',function(req,res,next){
	console.log("들어옴");
	upload(req,res,function(err){
		if(err){
			return err;
		}else{
			res.status(201).json({link : '/uploads/'+req.file.filename});
		}
	});

});



// contact
router.get('/contact',function(req,res,next){
	console.log("gd");
	res.render('contact/about');
});

//gellery
router.get('/',function(req,res,next){
	res.render('gallery/index');
});

router.get('/video',function(req,res,next){
	res.render('gallery/video');
});

router.get('/view',function(req,res,next){
	res.render('gallery/view');
});

router.get('/write',function(req,res,next){
	res.render('gallery/write');
});

//blog
router.get('/',function(req,res,next){
	res.render('./blog/index');
});
router.get('/board',function(req,res,next){
	res.redirect('/blog/board/1');
});
router.get('/board/:page/:search?',function(req,res,next){
	var limit = 6
		, total = 0
		, totalPage = 0
		, rowPage = 1
		, curPage = req.params.page || 1
		, lastPage = 0;

	var search =req.params.search
	var param = {};
	if(search){
		param = {
			$or :[{
				blog_title : new RegExp(search,"i")
			}
			,{
				blog_text : new RegExp(search,"i")
			}]
		}
	}
	console.log(param)
	Blog.find(param).sort({content_id : -1}).skip((curPage-1)*limit).limit(limit).exec(function(err,content){
		if(err){
			return handleError(err);
		}else{
			if(content == '' || content == null){
				res.render('./blog/board',{ title : '검색결과가 없습니다.'});
			}else{
				Blog.count(param).count(function(err,data){
					//페이징
					total = data;

					if(total % limit >= 1){
						totalPage = parseInt((total/limit)+1);
					}else{
						totalPage = (total/limit);
					}

					for(var i = rowPage; i <= curPage ; i = i+5){
						rowPage = i;
					}

					lastPage=rowPage+5;
					for(var i =lastPage; i > totalPage ; i=i-1){
						lastPage = i;
					}
					res.render('./blog/board',{item : content , total:total , totalPage :totalPage , curPage : curPage , rowPage : rowPage , lastPage : lastPage ,search : search ,title : '냠냠냠' });
				})
			}
		}
	});
});

router.get('/travel/:id',function(req,res,next){
	res.render('./blog/travel');
});

router.get('/view/:id',function(req,res,next){
	var param = {
		content_id : req.params.id
	}


	Blog.findOne(param,function(err,data){
		if(data=='' || data == null){
			res.redirect('/blog/board/1');
		}else{
			res.render('./blog/view',{item : data});
		}
	});
});

router.get('/write',function(req,res,next){
	if(req.session.user == null || req.session.user == ''){
		res.redirect('/login');
	}else{
		res.render('./blog/write');
	}
});

router.post('/write',function(req,res,next){
	var blog = new Blog();

	blog.addContent({
		content_title : req.body.content_title
		, content_text : req.body.content_editor
		, content_autor : req.body.content_autor
	},function(err){
	});
	res.redirect('/blog/board');
});

// gallery



router.get('/login',function(req,res,next){
	res.render('main/login');
});

router.post('/login',function(req,res,next){
	var id = req.body.login_userID;
	var pw = req.body.login_password;
	//암호화
	var key = '★와카★';
	var cipher = crypto.createCipher('aes192',key);
	cipher.update(pw,'utf8','base64');
	var cryptoPassword = cipher.final('base64');
	console.log(cryptoPassword);
	//아이디가 있는지 비밀번호맞는지
	User.findOne({ user_id : id , user_password : cryptoPassword },function(err,doc){
		if(doc == '' || doc == null){
			res.render('main/login', { title_name :'로그인 오류    비밀번호가 맞지 않습니다.'});
		}else{
			req.session.user = doc ;
			res.redirect('/');
		}
	});

});

router.get('/loginCheck/:id',function(req,res,next){
	var id = req.params.id;
	//아이디가 존재하는지
	if(id != null && id != ''){
		User.findOne({ user_id : id },function(err,docs){
			if(err){
				console.error(err);
			}else{
				if(docs == ''|| docs == null){
					res.end('N');
				}else{
					if(docs.user_id == id){
						res.end('Y');
					}else{
						res.end('N');
					}
				}
			}
		});
	}
});

router.get('/search',function(req,res,next){
	res.render('main/search');
});

router.post('/join',function(req,res,next){
	var user = new User();
	//암호화
	var pw = req.body.join_password;
	var key = '★와카★';
	var cipher = crypto.createCipher('aes192',key);
	cipher.update(pw,'utf8','base64');
	var cryptoPassword = cipher.final('base64');
	//추가
	user.addUser({
		user_id : req.body.join_userID
		, user_name : req.body.join_name
		, user_password : cryptoPassword
	});
	res.status(201).json({id : req.body.join_userID , pw : req.body.join_password});
});

router.get('/checkID/:id',function(req,res){
	User.findOne({ user_id : req.params.id },function(err, docs){
		if(err){
			console.log(err);
		}else{
			if(docs == ''|| docs == null){
				//없을경우
				res.end('N');
            }else{
            	//있는데 아이디랑 다를경우 있나?
                if(docs.user_id == req.params.id){
                    res.end('Y');
                }else{
                    res.end('N');
                }
            }
		}
	});
});

router.get('/logout',function(req,res,next){
	//세션제거
	req.session.destroy(function(err){
		if(err){
			console.error(err);
			res.redirect('/');
		}else{
			res.redirect('/');
		}
	});
});

module.exports = router;
