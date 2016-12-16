/**
 * Created by SH kim on 2016-08-21.
 */
//유저 데이터 모델
var mongoose = require('mongoose');
var db = require('./db');


var UserSchema = new mongoose.Schema({
    "id":String,
    "pw":String,
    "name":String,
    "email":String,
    "birthyear":0,
    "mob":String
});

var User = mongoose.model('User',UserSchema);

