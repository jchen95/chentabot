var mongoose = require('mongoose')
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
    username: String,
    points: Number,
  });

module.exports = mongoose.model("User", userSchema)