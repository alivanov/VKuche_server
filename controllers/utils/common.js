/**
 * Created by alivanov on 27/01/16.
 */

exports.getUser = function(userId, cb) {
  User.findOne({vkId: userId}).exec(function(err, user) {
    return cb(err, user)
  });
};
