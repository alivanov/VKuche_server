/**
 * Created by alivanov on 12/01/16.
 */

/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors');
var path = require('path');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var config = require('./config/secrets');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3005);

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.db[app.get('env')]);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

var whitelist = [
  //the ionic app run on real device
  'http://localhost',
  // replace with yours IP only if execute the ionic app on a real device with: ionic run android -l -s -c
  'http://192.168.1.4:8100',
  'http://192.168.1.6:8100',
  'http://localhost:8100'
];
var corsOptions = {
  origin: function(origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

require(path.join(__dirname, '/controllers/api/users')).configure(app);

// if there's no such route
app.use(function(req, res, next) {
  res.status(404);
  return res.send({
    error: {
      message: 'The requested url not found'
    }
  });
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var env = app.get('env');
  if (env !== 'production') {
    res.send({
      error: {
        message: err.message,
        trace: err.stack
      }
    });
  } else {
    res.send({
      error: {
        message: err.message
      }
    });
  }
});

require('./worker')(app);

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
