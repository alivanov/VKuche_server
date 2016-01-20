/**
 * Created by alivanov on 12/01/16.
 */
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
var ensureAuthenticated = function(req, res, next) {
  if (!req.headers['auth-token']) {
    return res.status(401).send({error: {message: 'Please make sure your request has auth-token header'}});
  }
  req.authToken = req.headers['auth-token'];
  next();
};

exports.ensureAuthenticated = ensureAuthenticated;
