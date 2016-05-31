var express = require('express');
var router = express.Router();
var models = require('../server/models/index');

// GET home page. 
router.get('/', function(req, res, next) {
  models.Post.all({}).then(function(posts) {
    res.render('allposts', {posts: posts});
  });
});
    
//create new user
router.post('/users', function(req, res) {
  models.User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }).then(function(user) {
    res.json(user);
  });
});

// get all posts
router.get('/allposts', function(req, res) {
  models.Post.findAll({}).then(function(posts) {
    res.render('allposts', {posts: posts});
  });
});

//get new post page
router.get('/index', function(req, res) {
  res.render('index');
});

// add new post
router.post('/posts', function(req, res) {
  models.Post.create({
    title: req.body.title,
    body: req.body.body,
    username: req.body.username,
    UserId: req.body.user_id
  }).then(function(post) {
    res.render('allposts', {posts: post});
  });
});


module.exports = router;
