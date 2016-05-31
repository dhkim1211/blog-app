var LocalStrategy   = require('passport-local').Strategy;
var db = require('../server/models');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  passport.use('login', new LocalStrategy({
      passReqToCallback : true //allows us to access the request object in the callback, enabling us to use any parameter associated with the request.
    },
    function(req, username, password, done) { 
      // check in mongo if a user with username exists or not
      db.User.find({ where: {'username' :  username} })
        .then(function(user){
          // Username does not exist, log error & redirect back
          if (!user){
            console.log('User Not Found with username '+username);
            return done(null, false, 
                  req.flash('message', 'User Not found.'));                 
          }
          // User exists but wrong password, log the error 
          else if(!isValidPassword(user, password)){
            console.log('Invalid Password');
            return done(null, false, 
                req.flash('message', 'Invalid Password'));
          }
          // User and password both match, return user from 
          // done method which will be treated like success
          else {
            return done(null, user);
          }
        }) 
        .catch(function(e) { 
            done(null, false, req.flash('loginMessage',e.name + " " + e.message));
        });
    })
  );

  var isValidPassword = function(user, password){
      return bCrypt.compareSync(password, user.password);
  }
}