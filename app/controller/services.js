var services= angular.module('app.services',[]);
services
	.factory('Question',function($resource,$stateParams){
	// body...
	return $resource('/questions/:id',{id:$stateParams.id});
	})
	.factory('UserSignUp',function($resource){
	// body...
	return $resource('/signup');
	})
	.factory('Login',function($resource){
	// body...
	return $resource('/login');
	})
	.factory('User',function($resource,$stateParams){
		return $resource('/user/:id',{id:$stateParams.id});
	})
	.factory('Questions',function($resource,$stateParams){
		return $resource('/questions/:id',{id:$stateParams.id});
	})


