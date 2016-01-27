/**
 * Created by alivanov on 27/01/16.
 */

var mongoose = require('mongoose');

var snaphotSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  count: Number,
  items: [{
    id: Number,
    title: String,
    artist: String
  }],
  date: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Snapshot', snaphotSchema);
