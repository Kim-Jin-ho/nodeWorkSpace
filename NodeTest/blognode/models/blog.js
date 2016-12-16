var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);

var BlogSchema = new mongoose.Schema({
    blog_title : {
        type : String
        , required : true
    }
    , blog_text : {
        type : String
        , required : true
    }
    , blog_author : {
      type : String
        , required : true
    }
    , blog_file : {
    	type : String
    	,required : false
    }
    /*, comments : {
        text : {
            type : String
            , required : true
        }
        , author : {
            type : String
            , required : true
        }
        , commentDate : {
        	type : Date
        	, required : true
        	, default : new Date()
        } 
        ,required : false
    }*/
    , blog_createDate : {
        type : Date
        , required : true
        , default : new Date()
    }
    , blog_hit : {
        type : Number
        , required : true
        , default : 0
    }
});

BlogSchema.plugin(autoIncrement.plugin,{
	model : 'contents'
	, field : 'content_id'
	, startAt : 1
});

BlogSchema.methods.addContent = function(contents, fucc){
	this.blog_title = contents.content_title;
	this.blog_text = contents.content_text;
	this.blog_author = contents.content_autor;
	this.blog_createDate = new Date();
	this.save(fucc);
};

var Blog = mongoose.model('contents',BlogSchema);

module.exports = Blog;