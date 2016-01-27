/**
 * Created by alivanov on 27/01/16.
 */

var request = require('request');
var User = require('../../models/user');
var Snapshot = require('../../models/snapshot');
var common = require('./common');

var initUser = function(userId, token) {

  return {
    getUser: function(asyncWaterfallCb) {
      common.getUser(userId, function(err, user) {
        asyncWaterfallCb(err, user)
      })
    },

    createUser: function(user, asyncWaterfallCb) {
      if (user) {
        return asyncWaterfallCb(null, user);
      }
      var user = new User({
        vkId: userId,
        vkToken: token
      });

      user.save(function(err) {
        asyncWaterfallCb(err, user);
      })
    },

    getUserAudioTracks: function(user, asyncWaterfallCb) {
      request({
        url: 'https://api.vk.com/method/audio.get',
        qs: {
          owner_id: user.vkId,
          access_token: token
        }
      }, function(err, res, body) {
        asyncWaterfallCb(err, user, body.response)
      });
    },

    createUserSnapshot: function(user, tracks, asyncWaterfallCb) {
      var snapshot = new Snapshot({
        owner: user.id,
        count: tracks.count,
        items: tracks.items
      });
      snapshot.save(function(err) {
        if (!err) {
          user.snapshot = snapshot;
        }
        asyncWaterfallCb(err, user);
      })
    }
  }
};

exports.initUser = initUser;

var deleteUser = function(userId) {

  return {
    getUser: function(asyncWaterfallCb) {
      common.getUser(userId, function(err, user) {
        asyncWaterfallCb(err, user)
      })
    },

    removeSnapshot: function(user, asyncWaterfallCb) {
      if (!user) {
        return asyncWaterfallCb(null);
      }

      Snapshot.findOneAndRemove({owner: user.id}).exec(function(err) {
        asyncWaterfallCb(err, user);
      })
    },

    removeUser: function(user, asyncWaterfallCb) {
      if (!user) {
        return asyncWaterfallCb(null);
      }
      User.findOneAndRemove({vkId: userId}).exec(function(err) {
        asyncWaterfallCb(err);
      })
    }
  }
};

exports.deleteUser = deleteUser;
