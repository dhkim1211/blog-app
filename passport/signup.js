var LocalStrategy   = require('passport-local').Strategy;
var db = require('../server/models');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
			passReqToCallback: true
		},
		function(req, username, password, done) {
			findOrCreateUser = function() {
				// find a user in Mongo with provided username
				db.User.find({where: {'username': username}})
					.then(function(user){
						//user already exists
						if (user) {
							console.log('User Already Exists');
							return done(null, false, 
								req.flash('message', 'User Already Exists'));
						}
						else {
							// if there is no user with that email
		          			// create the user
		          			db.User.create({
		          				username: username,
		          				password: createHash(password),
		          				email: req.param('email'),
		          				firstname: req.param('firstname'),
		          				lastname: req.param('lastname')
		          			}).then(function(user){
		          				console.log('User Registration Successful');
		          				return done(null, user);
		          			})
						}
					})
					.catch(function(e){
						return done(null, false, req.flash('loginMessage',e.name + " " + e.message));
					})
			};

			// Delay the execution of findOrCreateUser and execute 
	    	// the method in the next tick of the event loop
	    	process.nextTick(findOrCreateUser);
		})	
	);

	// Generates hash using bCrypt
	var createHash = function(password){
	 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}
	