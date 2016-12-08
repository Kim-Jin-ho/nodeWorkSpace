var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.use(urlencoderParser = bodyParser.urlencoded({extended : false}));
app.locals.pretty = true;

app.set('views','./views_file');
app.set('view engine','jade');

// get 방식 처리 방법
app.get('/topic/new', function(req, res)
{
  fs.readdir('data',function(err, files)
  {
      if(err)
      {
        console.log(err);
        res.statuc(500).send('Internal Server Error')
      }
      res.render('new',{topics:files});
  });
})

app.get(['/topic','/topic/:id'], function(req, res)
{
  fs.readdir('data',function(err, files)
  {
      if(err)
      {
        console.log(err);
        res.statuc(500).send('Internal Server Error')
      }
      var id = req.params.id;
      if(id)
      {
        // id 값이 있을때
        fs.readFile('data/'+id,'utf8', function(err, data)
        {
          if(err)
          {
            // 에러가 발견 될 시 아래의 예외처리를 한 후 경고창을 띄운 후
            // 코드를 종료 시킴
            console.log(err);
            res.statuc(500).send('Internal Server Error')
          }
          res.render('view',{topics:files, title:id, description:data});
        })
      }else
      {
        // id 값이 없을 때
        res.render('view', {topics:files, title:'Welcome', description:'Hello'});
      }
  })
})

/*
app.get(['/topic','/topic/:id'], function(req, res)
{
  var id = req.params.id;
  fs.readdir('data',function(err, files)
  {
      if(err)
      {
        console.log(err);
        res.statuc(500).send('Internal Server Error')
      }
      fs.readFile('data/'+id,'utf8', function(err, data)
      {
        if(err)
        {
          // 에러가 발견 될 시 아래의 예외처리를 한 후 경고창을 띄운 후
          // 코드를 종료 시킴
          console.log(err);
          res.statuc(500).send('Internal Server Error')
        }
        res.render('view',{topics:files, title:id, description:data});
      })
  })
})
*/

// post 방식 처리 방법
// 사용자로부터 제목과 내용을 받아
// 파일을 만드는 예제
// 예외처리 방법 예제도 있음
app.post('/topic', function(req, res)
{
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title,description,function(err)
  {
      if(err)
      {
        // 에러가 발견 될 시 아래의 예외처리를 한 후 경고창을 띄운 후
        // 코드를 종료 시킴
        console.log(err);
        res.statuc(500).send('Internal Server Error')
      }
      res.redirect('/topic/'+title);
  });
})

app.listen(3000, function()
{
  console.log('Conneted, 3000 port');
})
