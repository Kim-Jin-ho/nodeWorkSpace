var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
//var filePaths = 'E:/WebstormProjects/node/blognode/public/uploads/'; //com1
var filePaths = process.env.NODE_FILE_PATH || 'C:/nodeWorkSpace/NodeTest/blognode/file/image/upload';
var crypto = require('crypto');


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



module.exports = router;
