/**
 * Created by alivanov on 12/01/16.
 */

var mongoose = require('mongoose');
var config = require('./config/secrets');
var async = require('async');
var _ = require('lodash');

var registerDropDbTask = function(grunt) {
  var collections = ['users', 'snapshots'];
  var existingCollections = [];

  grunt.registerTask('dropTestDB', 'drop the test database', function() {
    var done = this.async();

    var handler = function(collection, cb) {
      mongoose.connection.db.dropCollection(collection, function(err) {
        cb(err)
      });
    };
    var finalCallback = function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully dropped collections');
      }
      mongoose.connection.close(done);
    };

    mongoose.connect(config.db.test);
    mongoose.connection.on('open', function() {
      mongoose.connection.db.listCollections().toArray(function(err, names) {
        names.forEach(function(el) {
          existingCollections.push(el.name);
        });
        async.each(_.intersection(collections, existingCollections), handler, finalCallback);
      });
    });
  });
};

module.exports = function(grunt) {
  registerDropDbTask(grunt);
  var gtx = require('gruntfile-gtx').wrap(grunt);
  gtx.loadAuto();
  var gruntConfig = require('./grunt');
  gruntConfig.package = require('./package.json');
  gtx.config(gruntConfig);
  gtx.alias('run', ['nodemon']);
  gtx.alias('dropTestDb',  ['dropTestDB']);
  gtx.finalise();
};
