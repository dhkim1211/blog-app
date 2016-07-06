angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  	$locationProvider.html5Mode(true);

  	$routeProvider
  	  .when('/', {
  	  	templateUrl:'tmpl/allposts.html',
  	  	controller: 'MainCtrl'
  	  })
  	  .when('/profile', {
	    templateUrl: 'tmpl/profile.html',
	    controller: 'ProfileCtrl'
	  })
	  .when('/login', {
	    templateUrl: 'tmpl/login.html',
	    controller: 'LoginCtrl'
	  })
	  .when('/signup', {
	    templateUrl: 'tmpl/signup.html',
	    controller: 'SignupCtrl'
	  })
	  .when('/allposts', {
	    templateUrl: 'tmpl/allposts.html',
	    controller: 'AddCtrl'
	  })
	  .when('/posts', {
	    templateUrl: 'tmpl/allposts.html',
	    controller: 'AddCtrl'
	  })
	  .when('/posts/:id', {
	    templateUrl: 'tmpl/singlepost.html',
	    controller: 'AddCtrl'
	  })
	  .when('/comments', {
	    templateUrl: 'tmpl/singlepost.html',
	    controller: 'AddCtrl'
	  })
	  .otherwise({
	    redirectTo: '/'
	  });
  }]);