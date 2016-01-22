var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  snapshot: {
    createdDT: Date,
    tracks: [{
      title: String,
      vkId: String
    }]
  },
  vkId: String,
  vkToken: String
});

module.exports = mongoose.model('User', userSchema);

