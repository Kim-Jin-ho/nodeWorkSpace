var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next)
{
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next)
{
  res.render('register',
  {
    'title' : 'Register'
  });
});

router.get('/login', function(req, res, next)
{
  res.render('login',
  {
    'title' : 'login'
  });
});

router.post('/register', function(req, res, next)
{
  // Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var id = req.body.id;
  var pass = req.body.password;
  var pass2 = req.body.password2;
  var profileImage = req.files.profileimage;
  // post 로 넘어온 값들을 하나씩 받아서 변수에 담기

  // Check for Image Field
  if(req.files.profileimage)
  {
    console.log('Uploading File...');

    // File Info
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName         = req.files.profileimage.name;
    var profileImageMime         = req.files.profileimage.mimetype;
    var profileImagePath         = req.files.profileimage.path;
    var profileImageExt          = req.files.profileimage.extension;
    var profileImageSize         = req.files.profileimage.size;
  } else
  {
    // Set a Default Image
    var profileImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('name', '이름을 입력하세요.').notEmpty();
  req.checkBody('email', 'Email을 입력하세요.').notEmpty();
  req.checkBody('email', 'Email 형식이 유효하지 않습니다.').isEmail();
  req.checkBody('id', 'ID를 입력하세요.').notempty();
  req.checkBody('password', '비밀번호를 입력하세요.').notEmpty();
  req.checkBody('password2', '비밀번호가 일치하지 않습니다.').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if(errors)
  {
    res.render('register',
    {
      errors: errors,
      name : name,
      email: email,
      id : id,
      password: password,
      password2: password2
    });
  }else
  {
    var newUser = new User(
                            {
                              errors: errors,
                              name : name,
                              email: email,
                              id : id,
                              password: password,
                              profileimage: profileImageName
                            }
                          );
    //Create User
    // User.createUser(newUser, function(err, user)
    // {
    //   if(err) throw err;
    //   console.log(user);
    // });

    //Success Message
    req.flash('success','You are now registered and may log in');

    res.location('/');
    res.redirect('/');
  }
});


















module.exports = router;
