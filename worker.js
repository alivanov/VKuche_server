/**
 * Created by alivanov on 27/01/16.
 */

var fs = require('fs');
var Agenda = require('agenda');
var config = require('./config/secrets');

module.exports = function(app) {
  var agenda = new Agenda({db: {address: config.db[app.get('env')]}});

  fs.readdir(__dirname + '/jobs', function(err, files) {
    if (err) {
      return console.log(err);
    }

    files.forEach(function(file) {
      require('./jobs/' + file)(agenda);
    });

    agenda.on('ready', function() {
      agenda.every('5 seconds', 'VK SYNC');
      agenda.start();
    });
  });
};
