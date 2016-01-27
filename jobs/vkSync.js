/**
 * Created by alivanov on 27/01/16.
 */

var request = require('request');
var async = require('async');
var User = require('../models/user');

module.exports = function(agenda) {
  agenda.define('VK SYNC', function(job, done) {
    User.find().exec(function(err, users) {
        if (err) {
          console.log(err);
          return done();
        }

        async.each(users, function(user, cb) {
          request({
            url: 'https://api.vk.com/method/users.get',
            qs: {
              user_ids: user.vkId
            }
          }, function(err, res, body) {
            console.log('ERR', err);
            console.log('RES', body);
            cb();
          });

        }, function() {
          done();
        });
      });
  });
};
