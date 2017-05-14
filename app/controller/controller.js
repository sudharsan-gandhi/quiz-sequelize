var controller=angular.module('app.controller',[])
	controller
		.controller('viewController',function($scope,$state,$location,Login) {
			// body...
			$scope.title='Login';
			$scope.user=new Login();
			$scope.submitForm = function(){
				$scope.user.$save(function(success){
					$location.path(success.path).replace;
				},function(err){
					// console.log(JSON.stringify(err.data.error));
					$scope.error=err.data.error;
					// console.log(session);
				})
			};
		})
		.controller('authorController',function($scope,$stateParams,$location,User){
			$scope.title="Author Dashboard";
			User.get({id:$stateParams.id},function(success){
				// console.log("console"+JSON.stringify(success));
				$scope.user=success;
				// console.log("success"+success);
			},function(err){
				window.alert(JSON.stringify(err));
				$location.path(err.path).replace;
			});
			$scope.addQuestions=function(){
				$location.path('/add/'+$scope.user.id);
			};
		})
		.controller('addQuestionController',function($scope,Question,$stateParams,$location){
			$scope.form=new Question();
			$scope.title="Add Question";
			$scope.options=[1,2,3,4,5,6,7,8,9,10];
			$scope.addquestion=function(){
				// console.log("form"+JSON.stringify($scope.form));
				$scope.form.$save(function(success){
					$scope.message=null;
					$scope.error=null;
					// console.log(success);
					$scope.message=success;
				},function(err){
					$scope.message=null;
					$scope.error=null;
					// console.log(err);
					$scope.error=err;
				});
			}
			$scope.goBack=function(){
				$location.path('/author/'+$stateParams.id);
			}
		})
		.controller('signUpController',function($scope,UserSignUp,$state,$location){
			$scope.title="Registeration";
			$scope.user=new UserSignUp();
			$scope.signup=function(){
				// console.log(JSON.stringify($scope.user));
				$scope.user.$save(function(success){
					 $location.path(success.path).replace;
				},function(err){
					// console.log(err);
					$scope.error=err.data.error;
				});
			}
		})
		.controller('viewHistoryController',function($scope,Question,$state){
			$scope.title="History";
			$scope.form=[
								{
									question:'question1',
									id:'1',
									difficulty:'3'
								},
								{
									question:'question2',
									id:'2',
									difficulty:'3'
								}
							]
		})
		.controller('showQuestionController',function($scope,Question,$state,$stateParams){
			$scope.form={};
			Question.query({id:$stateParams.id},function(success){
				$scope.form=success;
			},function(err){
				console.log(err);
			});
			$scope.title="title";
		})
		.controller('studentController',function($scope,User,$stateParams,$location){
			$scope.title="Welcome";
			$scope.user="";
			User.get({id:$stateParams.id},function(success){
				// console.log("console"+JSON.stringify(success));
				$scope.user=success;
				// console.log("success"+success);
			},function(err){
				window.alert(JSON.stringify(err));
				$location.path(err.path).replace;
			});
			$scope.takeTest=function(){
				$location.path('/test/'+$scope.user.id);
			}
		})
		.controller('testController',function($scope,Questions,Level,Score,$location,$stateParams,$timeout,Reset,$location){
			$scope.title="Level";
			$scope.answer=new Level();
			var getScore=function(){
							$scope.loader = true;
							$scope.buttonDisabler=true;
							$scope.loadText = 'getting questions...';
							Score.get({id:$stateParams.id},function(success){
								// console.log("score fetched:"+success);
								$scope.score=success;
							},function(err){
								// console.log("err"+err);
							});
						};
			var getQuestions=function(){
										$scope.loader = true;
										$scope.buttonDisabler=true;
										$scope.loadText = 'getting questions...';
										Questions.query({id:$stateParams.id},function(success){
												$scope.questions=success;												
										},function(err){
											$scope.error=err;
										});
			};
			getQuestions();
			getScore();
			$scope.loader = false;
			$scope.buttonDisabler=false;
			$scope.cancel=function(){
				var check=window.confirm("are your sure?");
				if(check){
					resetGame();
					$location.path('/student/'+$stateParams.id);
				}
			};
			$scope.level=function(){
				// console.log($scope.questions);
				$scope.answer=$scope.questions;
				$scope.loader = true;
				$scope.buttonDisabler=true;
				$scope.loadText = 'checking answers...';
				Level.create($scope.answer,function(success){
					if(success.message=="success"){
						getQuestions();
						getScore();
						$scope.loader = false;
						$scope.buttonDisabler=false;
					}else if(success.message=="reset"){
						window.alert("game over!!!");
						resetGame();
						$location.path('/student/'+$stateParams.id);
					}else if(success.message=="maxUp"){
						var check=window.alert("reached maximum level. Are you sure want to continue on same level again?");
						if(check){
							getQuestions();
							getScore();
							$scope.loader = false;
							$scope.buttonDisabler=false;
						}else{
							$location.path('/student/'+$stateParams.id);
						}
					};
				},function(err){
					console.log(err);
				})					

				
				
			};
			var resetGame=function(){
				$scope.loader = true;
				$scope.buttonDisabler=true;
				$scope.loadText = 'reseting game...';
				Reset.get({id:$stateParams.id},function(success){
					// console.log(success);
				},function(err){
					console.log(err);
				});
				$scope.loader = false;
				$scope.buttonDisabler=false;
			}
		})
