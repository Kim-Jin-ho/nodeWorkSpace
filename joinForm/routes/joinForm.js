var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('정상적으로 작동하고 있습니다~');
  res.render('joinForm',{title : '회원가입폼~ '});
});

router.post('/',function(req,res,next){
	console.log('req.body : '+req.body);
	res.json(req.body);
});

module.exports = router;
