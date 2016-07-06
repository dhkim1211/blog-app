var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var db = require('./server/models');
db.sequelize.sync();

//sass
var sass = require( 'node-sass' )
var fs = require( 'fs' )

sass.render( {
   file: './sass/style.scss'
}, (err, result) => { 
   fs.writeFile( './public/stylesheets/style.css', result.css.toString(), ( err ) => {
       if ( err ) throw err
           console.log( 'Sass written to css' )
   } )
} )

sass.render( {
   file: './sass/_bootstrap.scss'
}, (err, result) => { 
   fs.writeFile( './public/stylesheets/bootstrap.css', result.css.toString(), ( err ) => {
       if ( err ) throw err
           console.log( 'Sass written to css' )
   } )
} )

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'anythingiwantinhere' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var initPassport = require('./passport/init'); // pass passport for configuration
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//module.exports = app;
app.listen(3000);