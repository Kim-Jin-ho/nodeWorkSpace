var express = require('express');
var router = express.Router();

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

module.exports = router;