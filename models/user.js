var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  vkId: String,
  vkToken: String
});

module.exports = mongoose.model('User', userSchema);

