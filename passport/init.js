var login = require('./login');
var signup = require('./signup');
var db = require('../server/models');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.find({where:{id:id}}).then(
            function(user){done(null, user)},
            function(err){done(err, null)}
        );
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}