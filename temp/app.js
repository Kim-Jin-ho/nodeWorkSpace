var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.locals.pretty = true;


app.use(bodyParser.urlencoded({extended:false}))
// 템플릿 엔진 set
app.set('view engine', 'jade');
app.set('views', './views');

// form
app.get('/form',function(req, res)
{
  res.render('form');
})

// get 방식으로 값 받아서 보여주기
app.get('/form_receiver', function(req,res)
{
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+','+description);
})

// post 방식으로 값 받아서 보여주기
app.post('/form_receiver',function(req, res)
{
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+','+description);

})
// /template 로 접근해오는 사용자에게
// 보여줄 화면 설정
app.get('/template', function(req, res)
{
  // /template 로 접근 해오는 경우
  // 'temp' 라는 파일을 랜더링 해서 보여준다.
  res.render('temp', {time:Date(), _title:'Jade'});
})


// public 폴더안의 파일에 접근가능하다.
// 정적인 파일 추가 방법
// public
app.use(express.static('public'));

// html 에 이미지 추가방법
app.get('/route',function(req,res)
{
  res.send('Hello Router, <img src="route.png">');
})

// Query 객체
/*
  req.query.사용자로부터 넘겨받은 값
  위와 같이 작성하여 request 값을 받아
  서버에서 값을 정의 하여 그 값을 가지고
  가지고 놀 수 있다.
  req 객체에 query 라는 객체를 이용하여
  id 프로퍼티 를 받아
  res(response) 를 통하여 반환 시킨다.
  + 를 이용하여 한번에 여러개의 값을 사용자에게 반환 또는
  여러개의 값을 받아와 서버측에서 그 값에 맞는 화면으로 넘겨 줄 수 있다.
`*/
app.get('/topic:id', function(req, res)
{
  var topics =  ['Javascript is ...', 'Nodejs is...', 'Express is ...'];

  var output = `<a href="/topic?id=0">JavaScript</a><br>
                <a href="/topic?id=1">Nodejs</a><br>
                <a href="/topic?id=2">Express</a><br>
                ${topics[req.query.id]}`
  res.send(output);
})

// 아래와 같은 경우 동적인
// 구동이여서 서버(서버명.js)을
// 다시 껏다가 켜야한다.
app.get('/dynamic',function(req, res)
{
/*
  아래와 같이 send 를 활용하여
  바로 html 을 전달해 줄 수 잇으나,
  너무 번잡하여 잘 사용하지 않는다.
  res.send('<!DOCTYPE html>\
  <html>\
    <head>\
      <meta charset="utf-8">\
      <title></title>\
    </head>\
    <body>\
        hello static!\
    </body>\
  </html>\
')
*/
// html 문을 길게 전달할 경우 아래와 같이 작성하는게
// 작성하는게 바람직하다.
var lis = '';
for (var i = 0; i < 5; i++)
{
  lis = lis + '<li>coding</li>';
}

// 웹페이지에서 현재시간을 표현시켜 주려면
var time = Date();

var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        hello Dynamic!
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
  </html>
  `;
res.send(output);

})

// 사용자가 홈으로 접속 시
// '/' = 주소가 홈일 경우 또는 주소만 쳤을 경우
// app.get안의 함수안엔 request 와 reponse 인자값을 받는게
// 규칙으로 정해져있다.
app.get('/', function(req,res)
{
  res.send('<h2> Hello home page </h2>');
});

// 사용자가 어떠한 경로 또는 주소로 접근시
// 아래와 같은 처리방식으로 처리될 뷰를 정해준다.
// 아래는 localhost:3000/login 으로 접근 시
// 처리해주는 방법을 기술한 것이다.
app.get('/login', function(req, res)
{
  res.send('<h2>Login Please</h2>');
})

app.listen(3000, function()
{
  console.log('Conneted 3000 port');
});
