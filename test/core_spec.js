/**
 * Created by alivanov on 12/01/16.
 */

var chai = require('chai');
var should = chai.should();
var request = require('supertest');
var app = require('../index.js');

describe('GET /', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/')
      .expect(404, done);
  });
});

describe('GET /api/me', function() {
  it('should return 401 if no auth header provided', function(done) {
    request(app)
      .get('/api/me')
      .expect(401, done);
  });

  it('should return 200 if auth header provided', function(done) {
    request(app)
      .get('/api/me')
      .set('auth-token', 'any')
      .expect(200, done);
  });
});

describe('GET /api/vk/test', function() {
  it('should return 401 if no auth header provided', function(done) {
    request(app)
      .get('/api/vk/test')
      .expect(401, done);
  });

  it('should return 200 if auth header provided', function(done) {
    request(app)
      .get('/api/vk/test')
      .set('auth-token', 'any')
      .expect(200, done);
  });
});
