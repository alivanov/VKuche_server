/**
 * Created by alivanov on 12/01/16.
 */
var request = require('supertest');
var app = require('../server.js');

describe('Core', function() {
  describe('GET /', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/')
        .expect(404, done);
    });
  });
});
