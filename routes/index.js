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
      models.Post.all({ include: [ models.User ] }).then(function(posts) {
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
      failureRedirect: '/login',
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
      failureRedirect: '/login',
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
      models.Post.findAll({include:[models.User]}).then(function(posts) {
        console.log(posts)        
        res.render('allposts', {posts: posts});
      });
    });
  
    //get new post page
    router.get('/index', isAuthenticated, function(req, res) {
      res.render('index', {user: req.user});
    }); 
  
    // add new post
    router.post('/posts', isAuthenticated, function(req, res) {
      models.Post.create({
        title: req.param('title'),
        body: req.param('body'),
        UserId: req.user.id
      }).then(function(post) {
        res.redirect('/allposts');
      });
    });

    // get own posts
    router.get('/myposts', isAuthenticated, function(req, res) {
      models.Post.findAll({
        where: {'UserId': req.user.id}
      })
      .then(function(posts) {
        res.render('myposts', {'myposts': posts});
      });
    });

    //get single post
    router.get('/posts/:id', function(req, res) {
      models.Post.findAll({
        where: {id: req.params.id}, 
        include:[models.User, {model: models.Comment, include: [{model: models.User, attributes: ['username'] }] }]
      })
      .then(function(theposts) {
        console.log(theposts)
        //res.send(theposts)
        res.render('singlepost', {'posts': theposts});
      });
    });

    //add new comment
    router.post('/comments', isAuthenticated, function(req, res) {
      models.Post.find({
        where: {'id': req.body.postid}
      })
      .then(function(thepost) {
        thepost.createComment({
          body: req.body.body,
          UserId: req.user.id
        }).then(function() {
          res.redirect('/posts/'+thepost.id);
        });
      });
    });

    //post search bar
    router.post('/search', function(req, res) {
      var blogname = req.body.name.toUpperCase();
      var nameMatch = [];

      models.Post.findAll({}).then(function(data){
        for (var i = 0; i < data.length; i++) {
          if (data[i]['title'].toUpperCase().indexOf(blogname) > -1) {
            nameMatch.push(data[i]['title']);
          }
        }
      }).then(function(){
        res.send(nameMatch);
      });
    });

    /*
    // add new comment
    router.post('/comments', isAuthenticated, function(req, res) {
      models.Comment.create({
        body: req.param('body'),
        UserId: req.user.id,
        PostId: req.post.id
      }).then(function(comments) {
        res.render('singlepost', {'comments': comments});
      });
    });
    */
    /*
    router.post('/api', isAuthenticated, function(req, res) {

      var body = req.body;

      function read(type, filter) {
        if (type === 'post') {
          models.Post.find({
            where: filter, 
            include: [{
              model: models.User, 
              attributes: ['username']
            }, {
              model: models.Comment, 
              include: [{
                model: models.User, 
                attributes: ['username']
              }] 
            } 
            ]
          })
          .then(function(posts) {
            res.json(posts);
          });
        }
        else if (type === 'comment') {
          models.Comment.find({
            where: filter, 
            include: [{
              model: models.User, 
              attributes: ['username']
            }] 
          })
          .then(function(posts) {
            res.sendStatus(200);
          })
        }
      }

      function write(type, req) {
        if (type === 'post') {
          models.Post.create({
            title: req.param('title'),
            body: req.param('body'),
            UserId: req.user.id
          }).then(function() {
            res.sendStatus(200);
          });
        }
        if (type === 'comment') {
          models.Comment.create({
            body: req.param('body'),
            UserId: req.user.id,
            PostId: req.post.id // rq.postid
          }).then(function(){
            res.sendStatus(200);
          })
        }
      }

      if (body.action == 'read' && body.type == 'comment') {
        read('comment', body.filter)
      } else if (body.action == 'read' && body.type == 'post') {
        read('post', body.filter)
      } else if (body.action == 'write' && body.type == 'comment') {
        read('comment', body)
      } else if (body.action == 'write' && body.type == 'comment') {
        read('post', body)
      }

    });*/
    return router;
  }

