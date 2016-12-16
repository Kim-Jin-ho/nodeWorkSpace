/**
 * Created by ProgrammingPearls on 15. 4. 17..
 */

var mongoose = require('mongoose');
// MYSQL의 DATE_FORMAT (similar DATE_FORMAT of MYSQL)
//var FormatDate = mongoose.Schema.Types.FormatDate = require('mongoose-schema-formatdate');
var db = require('./db');
// 자동 증가 모듈 (autoincreament module)
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);


//console.log(FormatDate.toString());
// DB Modeling
var BoardSchema = new mongoose.Schema({
  "title" : String,
  "content" : String,
  "passwd" : String,
  "regdate" : {
    "type" : Date,
    "default" : Date.now
  },
  "hit" : {
    "type" : Number,
    "default" : 0
  },
  "id" : String
});

// Mongoose의 Virtual사용
BoardSchema.virtual('myregdate')
  .get(function () {
    return formatDate(this.regdate);
  });

BoardSchema.set('toJSON' , { virtuals : true});

//// https://github.com/mariodu/mongoose-id-autoinc 참조
BoardSchema.plugin(autoIncrement.plugin,
  { "model" : 'Board' , "field" : 'num', "startAt" : 1, "incrementBy" : 1});
//BoardSchema.plugin(autoinc.plugin, {
//BoardSchema.plugin(autoinc.plugin, {
//  "model" : "Board",
//  "field" : "num",
//  "start" : 1,
//  "step" : 0
//});

var Board = mongoose.model('Board', BoardSchema);

function formatDate (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;  // 0부터 시작
  var d = date.getDay();

  var h = date.getHours();
  var i = date.getMinutes();
  var s = date.getSeconds();

  // YYYY-MM-DD hh:mm:ss
  var today = y + '-' + (m > 9 ? m : "0" + m) + '-' + (d > 9 ? d : "0" + d) + ' ' +
              (h > 9 ? h : "0" + h) + ":" + (i > 9 ? i : "0" + i) + ":" + (s > 9 ? s : "0" + s);

  return today;
}