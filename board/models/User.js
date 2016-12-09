var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// 스키마
var userSchema = mongoose.Schema(
{
  username:{type:String, required:[true, "Username is required!"], unique:true},
  password:{type:String, required:[true, "Password is required!"], select:false},
  name:{type:String, required:[true, "Name is required!"]},
  email:{type:String}
},
{
  toObject:{virtuals:true}
});

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
userSchema.path("password").validate(function(v)
{
  var user = this;
  if(user.isNew)
  {
    if(!user.passwordConfirmation)
    {
      user.invalidate("passwordConfirmation", "Password Confirmation is required!")
    }
    if(user.password !== user.passwordConfirmation)
    {
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }
  // update user // 3-4
  if(!user.isNew)
  {
    if(!user.currentPassword)
    {
     user.invalidate("currentPassword", "Current Password is required!");
    }
    if(user.currentPassword && !user.authenticate(user.currentPassword, user.originalPassword)){ // 4
     user.invalidate("currentPassword", "Current Password is invalid!");
    }
    if(user.newPassword !== user.passwordConfirmation)
    {
     user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
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
