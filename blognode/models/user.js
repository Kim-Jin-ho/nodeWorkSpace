var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);

var UserSchema = new mongoose.Schema({
	user_id : {
		type :String
		, required : true
	}
	, user_name : {
		type :String
		, required : true
	}
	, user_password :{
		type :String
		, required : true
	}
	, user_createDate : {
		type : Date
		, required : true
	}
});

UserSchema.plugin(autoIncrement.plugin,{
	model : 'users'
	, field : 'user_num'
	, startAt : 1
});

UserSchema.methods.addUser = function(user,fucc){
	
	this.user_id = user.user_id ;
	this.user_name = user.user_name;
	this.user_password = user.user_password;
	this.user_createDate = new Date();
	console.log(this.user_id,this.user_name,this.user_password,this.user_createDate);
	this.save(fucc);
}

var User = mongoose.model('users',UserSchema);

module.exports = User;