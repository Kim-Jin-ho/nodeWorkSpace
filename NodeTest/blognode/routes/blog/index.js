var express = require('express');
var router = express.Router();

var Blog = require('../../models/blog');

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

module.exports = router;