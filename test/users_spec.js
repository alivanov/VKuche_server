/**
 * Created by alivanov on 22/01/16.
 */

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var app = require('../server.js');
var User = require('../models/user');

describe('Users', function() {
  var ID = '12345';
  before(function(done) {
    var user = new User({
      vkId: ID,
      vkToken: '54321',
      snapshot: {
        createdDT: new Date(),
        tracks: [{
          title: 'testTitle1',
          vkId: 'testVKID1'
        },
          {
            title: 'testTitle2',
            vkId: 'testVKID2'
          }]
      }
    });
    user.save(function(err) {
      if (err) {
        console.log('Cannot prepare user', err);
      }
      done();
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

  describe('GET /api/users/:vkId', function() {
    it('should return 401 if no auth header provided', function(done) {
      request(app)
        .get('/api/users/' + ID)
        .expect(401, done);
    });

    it('should get user by VK ID if auth header provided', function(done) {
      request(app)
        .get('/api/users/' + ID)
        .set('auth-token', 'any')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          expect(res.body.user).to.not.equal(null);
          expect(res.body.user.vkId).to.equal(ID);
          done();
        });
    });
  });

  describe('POST /api/users/:vkId', function() {

    var USER = {
      vkId: '111',
      vkToken: '222',
      snapshot: {
        createdDT: new Date(),
        tracks: [{
          title: 'testTitle1',
          vkId: 'testVKID1'
        },
          {
            title: 'testTitle2',
            vkId: 'testVKID2'
          }]
      }
    };

    it('should return 401 if no auth header provided', function(done) {
      request(app)
        .post('/api/users/' + USER.vkId)
        .expect(401, done);
    });

    it('should create new user if auth header provided', function(done) {
      request(app)
        .post('/api/users/' + USER.vkId)
        .set('auth-token', 'any')
        .send(USER)
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          should.not.exist(res.body.message);
          User.findOne({vkId: USER.vkId}).exec(function(err, user) {
            expect(err).to.equal(null);
            expect(user).to.not.equal(null);
            expect(user.vkId).to.equal(USER.vkId);
            done();
          });
        });
    });

    it('should not duplicate existing user', function(done) {
      request(app)
        .post('/api/users/' + USER.vkId)
        .set('auth-token', 'any')
        .send(USER)
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          expect(res.body.message).to.be.a('string');
          User.findOne({vkId: USER.vkId}).exec(function(err, user) {
            should.not.exist(err);
            expect(user).to.not.equal(null);
            expect(user.vkId).to.equal(USER.vkId);
            done();
          });
        });
    });
  });

  describe('PUT /api/users/:vkId/snapshot', function() {
    it('should return 401 if no auth header provided', function(done) {
      request(app)
        .put('/api/users/notExist/snapshot')
        .expect(401, done);
    });

    it('should get user by VK ID if auth header provided', function(done) {
      request(app)
        .put('/api/users/' + ID + '/snapshot')
        .set('auth-token', 'any')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          expect(res.body.user).to.not.equal(null);
          expect(res.body.user.vkId).to.equal(ID);
          done();
        });
    });

    it('should notify if user is not found', function(done) {
      request(app)
        .put('/api/users/notExist/snapshot')
        .set('auth-token', 'any')
        .expect(200)
        .end(function(err, res){
          should.not.exist(err);
          expect(res.body.user).to.equal(null);
          expect(res.body.message).to.be.a('string');
          done();
        });
    });
  });


});

