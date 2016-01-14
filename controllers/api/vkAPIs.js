/**
 * Created by alivanov on 13/01/16.
 */

var ensureAuthenticated = require('../utils/tokenUtils').ensureAuthenticated;

exports.configure = function(app) {

  app.get('/api/vk/test', ensureAuthenticated, function(req, res, next) {
    res.status(200).send({token: req.authToken});
  });

};
