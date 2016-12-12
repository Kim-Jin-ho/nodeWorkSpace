var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// 스키마
var userSchema = mongoose.Schema(
{
  username:{
             type:String,
             required:[true,"아이디를 입력하세요."],
             match:[/^.{4,12}$/,"Should be 4-12 characters!"],
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
          match:[/^.{4,12}$/,"Should be 4-12 characters!"],
          trim:true
       },
  email:{
          type:String,
          match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일 형식을 맞추세요."],
          trim:true
        }
},
{
  toObject:{virtuals:true}
});

// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation;})
.set(function(value){ this._passwordConfirmation=value;});


userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword;})
.set(function(value){ this._originalPassword=value;})

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/; // 2-1
var passwordRegexErrorMessage = "8글자 이상을 입력하세요!";
userSchema.path("password").validate(function(v)
{
  var user = this;
  // create user
  if(user.isNew)
  {
    if(!user.passwordConfirmation)
    {
      console.log("비밀번호 에러");
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.")
    }
    if(!passwordRegex.test(user.password))
    {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation)
    {
      console.log("비밀번호 에러");
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }
  // update user
  if(!user.isNew)
  {
    if(!user.currentPassword)
    {
     user.invalidate("currentPassword", "Current Password is required!");
    }
    if(user.currentPassword && !user.authenticate(user.currentPassword, user.originalPassword)){ // 4
     user.invalidate("currentPassword", "Current Password is invalid!");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword))
    {
      console.log("비밀번호 에러");
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation)
    {
      console.log("비밀번호 에러");
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }
});

// hash password
userSchema.pre("save", function (next){
 var user = this;
 if(!user.isModified("password")){
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

// model & exprot
var User = mongoose.model("user", userSchema);
module.exports = User;
