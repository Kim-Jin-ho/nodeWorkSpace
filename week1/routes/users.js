var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../model/models.js');
var path = require('path');

var url = 'mongodb://mongodb://localhost/blog';


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');

});

router.post('/create', function(req, res, next) {
	mongoose.connect(url, function (err) {
		if (err) {console.log(err)};

		var user = new model.user(req.body)

		user.save(function (err, data) {
			if (err) {console.log("Danger user err :"+err)};
		  	res.json(data);

		  	mongoose.disconnect();
		})
	});
});

router.get('/login', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/../public/login.html'));
})


router.post('/login', function (req, res, next) {
	mongoose.connect(url, function(err){
		if(err) {console.log(err)};

		var user = model.user.findOne({
			email: req.body.email
		}, function (err, data) {
			if (err) {console.log("Danger user err :"+err)};
			if (data.password === req.body.password){
				// res.cookie(user:data._id);
				res.cookie('user', data._id);
				res.json(data._id);
				mongoose.disconnect();
			}
		})
	});
});

module.exports = router;
