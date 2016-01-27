/**
 * Created by alivanov on 12/01/16.
 */

var async = require('async');
var ensureAuthenticated = require('../utils/tokenUtils').ensureAuthenticated;
var common = require('../utils/common');
var userUtils = require('../utils/userUtils');

exports.configure = function(app) {
  app.get('/api/users/:vkId', ensureAuthenticated, function(req, res, next) {
    common.getUser(req.params.vkId, function(err, user) {
      if (err) {
        return next(new Error('Can not get user data'));
      }
      res.status(200).send({user: user});
    });
  });

  app.post('/api/users/:vkId', ensureAuthenticated, function(req, res, next) {
    var userMethods = userUtils.initUser(req.params.vkId, req.headers['auth-token']);
    async.waterfall([
      userMethods.getUser,
      userMethods.createUser,
      userMethods.getUserAudioTracks,
      userMethods.createUserSnapshot
    ], function(err, result) {
      if (err) {
        return next(new Error('Can not init user!'));
      }
      res.send({user: result});
    });
  });

  app.delete('/api/users/:vkId', ensureAuthenticated, function(req, res, next) {
    var userMethods = userUtils.deleteUser(req.params.vkId);
    async.waterfall([
      userMethods.getUser,
      userMethods.removeSnapshot,
      userMethods.removeUser
    ], function(err, result) {
      if (err) {
        return next(new Error('Can not delete user!'));
      }
      res.send({user: result});
    });
  });
};
