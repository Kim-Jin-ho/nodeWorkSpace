var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,"Id를 입력하세요."],
    match:[/^.{4,12}$/,"4~12자 사이로 입력하세요."],
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:[true,"비밀번호를 입력하세요."],
    select:false
  },
  name:{
    type:String,
    required:[true,"이름을 입력하세요."],
    match:[/^.{3,12}$/,"3~12자 사이로 입력하세요."],
    trim:true
  },
  email:{
    type:String,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일 형식을 맞춰서 입력하세요."],
    trim:true
  }
},{
  toObject:{virtuals:true}
});

// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "8글자[문자+숫자] 이상을 입력하세요.";
userSchema.path("password").validate(function(v)
{
  var user = this;

  // create user
  if(user.isNew){
    if(!user.passwordConfirmation)
    {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
    if(!passwordRegex.test(user.password))
    {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation)
    {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }

  // update user
  if(!user.isNew){
    if(!user.currentPassword)
    {
      user.invalidate("currentPassword", "비밀번호를 입력하세요.");
    }
    if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "비밀번호를 바르게 입력하세요.");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword))
    {
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation)
    {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }
});

// hash password
userSchema.pre("save", function (next){

  var user = this;
  if(!user.isModified("password"))
  {
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password)
{
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model("user",userSchema);
module.exports = User;
