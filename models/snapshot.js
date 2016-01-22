var mongoose = require('mongoose');

var trackSchema = new mongoose.Schema({
  title: String,
  vkId: String
});

var snapshotSchema = new mongoose.Schema({
  createdDT: Date,
  tracks: [trackSchema]
});

module.exports = mongoose.model('Snapshot', snapshotSchema);
