var express = require('express');
var router = express.Router();

router.get('/contact',function(req,res,next){
	console.log("gd");
	res.render('contact/about');
});

module.exports = router;
