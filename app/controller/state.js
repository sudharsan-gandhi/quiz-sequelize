var state= angular.module('app.state',[]);
	state.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
		      .state('view',{
		            url: '/view',
		                templateUrl:'view/templates/view.html',
		                controller: 'viewController'
		      })
		      .state('author',{
		      		url:'/author/:id',
		      		templateUrl:'view/templates/author.html',
		      		controller:'authorController'
		      })
		      .state('addQuestion',{
		      		url:'/add/:id',
		      		templateUrl:'view/templates/addquestion.html',
		      		controller:'addQuestionController'
		      })
		      .state('signUp',{
		      		url:'/signup',
		      		templateUrl:'view/templates/signup.html',
		      		controller:'signUpController'
		      })
		      .state('viewHistory',{
		      		url:'/history/:id',
		      		templateUrl:'view/templates/history.html',
		      		controller:'viewHistoryController'
		      })
		      .state('showQuestion',{
		      		url:'/show/:id',
		      		templateUrl:'view/templates/show.html',
		      		controller:'showQuestionController'
		      })
		      .state('student',{
		      	url:'/student/:id',
		      	templateUrl:'view/templates/student.html',
		      	controller:'studentController'
		      })
		      .state('test',{
		      	url:'/test/:id',
		      	templateUrl:'view/templates/test.html',
		      	controller:'testController'
		      })


		$urlRouterProvider.otherwise('/view');
	});