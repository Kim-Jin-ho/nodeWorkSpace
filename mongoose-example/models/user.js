var mongoose = require("mongoose");

// Define Schemes
var userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  }
},
{
  timestamps: true
});

// Create Model & Export
module.exports = mongoose.model("User", userSchema);
