var express = require('express');
var router = express.Router();
var models = require('../server/models');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

  module.exports = function(passport) {
    // GET home page. 
    router.get('/', function(req, res, next) {
      models.Post.all({}).then(function(posts) {
        res.render('allposts', {posts: posts});
      });
    });

    // SIGNUP =======================================
    // show signup form
    router.get('/register', function(req, res){
      res.render('register');
    })
    
    //process signup form
    router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true
    }));

    // LOGIN =======================================
    // show login form
    router.get('/login', function(req, res) {
      res.render('login');
    });

    //process login
    router.post('/login', passport.authenticate('login', {
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true
    }));

    //process logout
    router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    // get profile
    router.get('/profile', isAuthenticated, function(req, res){
      res.render('profile', {'user': req.user})
    });
  
    // get all posts
    router.get('/allposts', function(req, res) {
      models.Post.findAll({}).then(function(posts) {
        res.render('allposts', {posts: posts});
      });
    });
  
    //get new post page
    router.get('/index', isAuthenticated, function(req, res) {
      res.render('index', {user: req.user});
    });
  
    // add new post
    router.post('/posts', function(req, res) {
      models.Post.create({
        title: req.param('title'),
        body: req.param('body'),
        username: req.body.username,
        UserId: req.body.user_id
      }).then(function(post) {
        res.render('allposts', {posts: post});
      });
    });
    return router;
  }

