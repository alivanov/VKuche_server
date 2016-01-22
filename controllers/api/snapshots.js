/**
 * Created by alivanov on 13/01/16.
 */

var User = require('../../models/user');
var _ = require('lodash');

var ensureAuthenticated = require('../utils/tokenUtils').ensureAuthenticated;

exports.configure = function(app) {

  app.get('/api/vk/test', ensureAuthenticated, function(req, res, next) {
    res.status(200).send({token: req.authToken});
  });

  app.put('/api/users/:vkId/snapshot', ensureAuthenticated, function(req, res, next) {

    User.findOne({vkId: req.params.vkId})
      .populate('snapshot')
      .exec(function(err, user) {
        if (err) {
          return next(new Error('Can not get user info'));
        }
        if (!user) {
          return res.status(200).send({user: {}, message: 'User not found, please create one!'});
        }

        var newSnapshot = req.body.snapshot;
        var oldSnapshot = user.snapshot;

        //TODO: get difference, send notifications [AI]

        res.status(200).send({user: user});

      });
  });

};
