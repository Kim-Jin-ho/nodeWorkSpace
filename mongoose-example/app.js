var express    = require("express");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var app  = express();
var port = process.env.port || 3000;
var userSchema = new mongoose.Schema({..}, { collection: "my-collection-name" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connect successfully");
});

mongoose.connect("mongodb://localhost/mydatabase");
var User = mongoose.model("User", userSchema);

var lee = new User({
  name: "Lee",
  username: "user01",
  password: "1234",
  ...
});
module.exports = mongoose.model("User", userSchema);
