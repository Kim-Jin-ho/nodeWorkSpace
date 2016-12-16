//module
var express = require('express')
	, path = require('path')
	, logger = require('morgan')
	, cookieParser = require('cookie-parser')
	, bodyParser = require('body-parser')
	, favicon = require('serve-favicon')
	, mongoose = require('mongoose')
	, multer = require('multer')
	, session = require('express-session')
	, MongoStore = require('connect-mongo')(session)
	, ENV = process.env.NODE_ENV || 'development'
	, autoIncrement = require('mongoose-auto-increment');
//route
var	 main = require('./routes/main')
	, gallery = require('./routes/gallery')
	, blog = require('./routes/blog')
	, thech = require('./routes/thech')
	, contact = require('./routes/contact')
	, files = require('./routes/main/file');

mongoose.connect('mongodb://localhost:27017/blog');

// express
var app = express();
//set
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'jade');

//use
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

//session
app.use(session({
	secret : 'wild Card'
	,resave : false
	, saveUninitialized : true
	, cookie : { maxAge : new Date(Date.now() + (1000 * 60 * 30))}
	, store : new MongoStore({
		url : 'mongodb://localhost:27017/blog'
		, touchAfter : 24 * 3600
	})
}));

//로컬전역에 세션 유저정보 집어넣
app.use(function(req,res,next){
	res.locals.user = req.session.user || null;
	next();
});

//page
app.use('/', main);
app.use('/gallery',gallery);
app.use('/blog',blog);
app.use('/thechnology',thech);
app.use('/contact/about',contact);
//file
app.use('/file',files);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if ( ENV === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('404', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('404', {
		message: err.message,
		error: {}
	});
});

app.listen(3000, function()
{
  console.log("서버가 켜졌습니다.");
});
module.exports = app;
