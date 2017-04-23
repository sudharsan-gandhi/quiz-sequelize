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
	.factory('Score',function($resource,$stateParams){
		return $resource('/score/:id',{id:$stateParams.id});
	})
	.factory('Level',function($resource,$stateParams){
		return $resource('/level/:id',{id:$stateParams.id},{
			create:{
				method:'POST'
			}
		});
	})
	.factory('Reset',function($resource,$stateParams){
		return $resource('/reset/:id',{id:$stateParams.id});
	})


