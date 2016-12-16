/**
 * Created by SH kim on 2016-09-29.
 */


// 공지사항 모델

var mongoose = require('mongoose');
// MYSQL의 DATE_FORMAT (similar DATE_FORMAT of MYSQL)
//var FormatDate = mongoose.Schema.Types.FormatDate = require('mongoose-schema-formatdate');
var db = require('./db');

var NoticeSchema = new mongoose.Schema({
    "title":String,
    "content":String,
    "regdate" : {
        "type" : Date,
        "default" : Date.now
    },
    "comments":{
        "id":String,
        "content":String
    }
})