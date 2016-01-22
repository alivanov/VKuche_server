var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  snapshot: {type: mongoose.Schema.Types.ObjectId, ref: 'Snapshot'},
  vkId: String,
  vkToken: String
});

module.exports = mongoose.model('User', userSchema);

