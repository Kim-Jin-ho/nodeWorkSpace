// DB schema // 4
var mongoose = require("mongoose");

var contactSchema = mongoose.Schema(
{
 name:{type:String, required:true, unique:true},
 email:{type:String},
 phone:{type:String}
});

var Contact = mongoose.model("contact", contactSchema); //5

module.exports = Contact;
