var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('정상적으로 작동하고 있습니다~');
});

module.exports = router;
