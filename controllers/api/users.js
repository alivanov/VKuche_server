/**
 * Created by alivanov on 12/01/16.
 */

var ensureAuthenticated = require('../utils/tokenUtils').ensureAuthenticated;

exports.configure = function(app) {

  app.get('/api/me', ensureAuthenticated, function(req, res, next) {
    res.status(200).send({message: 'OK'});
  });

};
