/**
 * Created by alivanov on 12/01/16.
 */

var User = require('../../models/user');
var ensureAuthenticated = require('../utils/tokenUtils').ensureAuthenticated;

exports.configure = function(app) {

  app.get('/api/me', ensureAuthenticated, function(req, res, next) {
    res.status(200).send({message: 'OK'});
  });

  app.get('/api/users/:vkId', ensureAuthenticated, function(req, res, next) {

    User.findOne({vkId: req.params.vkId})
      .populate('snapshot')
      .exec(function(err, user) {
        if (err) {
          return next(new Error('Can not get user data'));
        }
        res.status(200).send({user: user});
      });
  });

  app.post('/api/users/:vkId', ensureAuthenticated, function(req, res, next) {
    User.findOne({vkId: req.params.vkId}).exec(function(err, user) {
      if (err) {
        return next(new Error('Can not create user'));
      }
      if (user) {
        return res.status(200).send({user: user, message: 'User exists!'});
      }
      var user = new User({
        vkId: req.params.vkId,
        vkToken: req.body.vkToken,
        snapshot: req.body.snapshot
      });

      user.save(function(err) {
        if (err) {
          return next(new Error('Can not create user'));
        }
        res.status(200).send({user: user});
      })
    });
  });

};
