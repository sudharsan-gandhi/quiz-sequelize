var express	=	require('express'),
	app		=	express(),
	session	=	require('express-session'),
	parser	=	require('body-parser'),
	mysql	=	require('mysql'),
	Sequelize	= require('sequelize'),
	qnCount	=	4,
	clearCount= 2,
	Promise =require('bluebird'),
	sequelize	= new Sequelize('quiz_sails','root','123456',{
							host: '127.0.0.1',
							dialect: 'mysql',
							pool: 	{
								max: 5,
								min: 0,
								idle: 10000
							},
					});
	var User = sequelize.define('user',{
		id 		: 	{type: Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
		fullname: 	{type:Sequelize.STRING, allowNull: false},
		email	: 	{type:Sequelize.STRING, unique: true, allowNull: false},
		display_name: {type:Sequelize.STRING, allowNull: false},
		password: 	{type:Sequelize.STRING, allowNull: false},
		role	: 	{type:Sequelize.STRING, allowNull: false}
	});
	var Questions= sequelize.define('questions',{
	 	id: {type: Sequelize.INTEGER,primaryKey:true,autoIncrement:true},
	 	question: {type:Sequelize.STRING,unique:true,allowNull:false},
		answer1: {type:Sequelize.STRING,allowNull:false},
		answer2: {type:Sequelize.STRING,allowNull:false},
		answer3: {type:Sequelize.STRING,allowNull:false},
		answer4: {type:Sequelize.STRING,allowNull:false},
		answer:{type:Sequelize.STRING,allowNull:false},   
		difficulty:{type:Sequelize.INTEGER,allowNull:false}		
	});
	var Score=sequelize.define('score',{
		current_score:{type:Sequelize.INTEGER,defaultValue:0,allowNull:false},
		previous_core:{type:Sequelize.INTEGER,defaultValue:0,allowNull:false},
		high_score:{type:Sequelize.INTEGER,defaultValue:0,allowNull:false},
		current_level:{type:Sequelize.INTEGER,defaultValue:1,allowNull:false}
	})
	User.hasMany(Questions);
	User.hasOne(Score);
	// {force:true} will recreate all tables by droping them
	sequelize.sync().then(function(){
		console.log("synched with db");
	});
	Score.belongsTo(User);
	Questions.belongsTo(User);

//CORS handler
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
//session declaration
	app.use(session({
		secret:"quiz",
		resave:false,
		saveUninitialized:true,
		cookie:{
			secure:true,
			maxage:60000
			}
	}));


//Static files handler
	app.use(parser.json());
	app.use('/angular',express.static(_dirname='./node_modules/angular'));
	app.use('/router',express.static(_dirname='./node_modules/angular-ui-router/release'));
	app.use('/jquery',express.static(_dirname='./node_modules/jquery/dist'));
	app.use('/resource',express.static(_dirname='./node_modules/angular-resource'));
	app.use('/bootstrap',express.static(_dirname='./node_modules/bootstrap/dist'));
	app.use('/bootstrap-toggle',express.static(_dirname='./node_modules/bootstrap-toggle'));
	app.use('/static',express.static(_dirname='./app/controller'));
	app.use('/require',express.static(_dirname='./app/static'));
	app.use('/view',express.static(_dirname='./app/view'));


//request handler
	app.get('/',function(req,res){
		res.sendFile('./app/view/index.html',{root:__dirname});
	});
	app.post('/questions/:id',function(req,res){
		req.body.userId=req.params.id;
			console.log("req body"+JSON.stringify(req.body));
			Questions.create(req.body).then(function(questions){
				res.status(200).send({message:"successfully added"});
			}).catch(function(err){
				res.status(401).send({error:err});
			})
		});
	

//user req handler
	app.post('/signup',function(req,res,next) {
		User.create(req.body).then(function(user){
			user.save();
			Score.create({userId:user.id});
			req.session.path="/login";
			// console.log(JSON.stringify("session "+req.session));
			res.status(200).send(req.session);
			
		}).catch(function(err){
			console.log(err.message);
			res.status('401').send({error:"database "+err.message+ " email must be unique and check other fields too."});
		});
		
	});
	
	app.post('/login',function(req,res,next){
		User.findOne({
			where:{
				email:req.body.email,
				password:req.body.password
			}
		}).then(function(user){
			if(user==null)
				throw user;
			// console.log("login success"+JSON.stringify(user));
			req.session.userId=user.id;
				if(user.role==="teacher")
					req.session.path="author/"+user.id;
				else
					req.session.path="student/"+user.id;
				console.log(JSON.stringify("session "+req.session));
					res.status(200).send(req.session);
		}).catch(function(err){
			console.log("login failed"+err);
			res.status('401').send({error:"check your credentials"});
		})
	});

	app.get('/user/:id',function(req,res){
		User.findOne({
			attributes:{exclude:['password']},
			where:{
				id:req.params.id
			},
			include:[{
				model:Score,
					}]
		}).then(function(user){
			if(user==null) throw user;
			req.session.userId=user.id;
			res.json(user);
		}).catch(function(err){
			console.log("fetch failed"+err);
			res.status('401').send({error:err});
		});
	})
//algorithm to check answer and change level
	app.post('/level/:id',function(req,res){
		var answerCount=0;
		var id=req.params.id;
		// var chainer= new Sequelize.Utils.QueryChainer;
		questions=req.body;
		questions.forEach(function(question){
			Questions.findOne({where:{id:question.id,answer:question.answer}}).then(function(success){
				if(success!=null)
					answerCount++;
				console.log("for"+answerCount)
			})
		});
		console.log("answerCount=="+answerCount);
		
		setTimeout(function() {
			console.log("answerList="+answerCount);
			if(answerCount>clearCount){
				Score.findOne({
					where:{
							userId:id
						}
				}).then(function(score){
					score.current_score=score.current_score+answerCount;
					score.current_level=score.current_level+1;
					console.log("score after update="+JSON.stringify(score));
						Score.update({
							current_score:score.current_score,
							current_level:score.current_level
						},{
							where:{
								userId:id
							}
						})
						.then(function(score){
							res.json({message:'success'});
						}).catch(function(err){
							res.status(401).send({err:'error when updating score'});
						});
				}).catch(function(err){
						console.log(JSON.stringify(err));
						res.status(401).send({err:err});
				});
			}else{
				res.status(200).send({message:'reset'});
			}
		}
		,5000);
	});


//algorithm for getting questions
	app.get('/questions/:id',function(req,res,next){
		Score.findOne({
			where:{
				userId:req.params.id
			}
		}).then(function(score){
			if(score==null) throw score;
//  getting questions based on the user level
			Questions.findAll({
			attributes:{exclude:['answer','createdAt','updatedAt','userId','difficulty']},
				where:{
					difficulty:score.current_level
				}
			}).then(function(questions){
				// algorithm to get random questions starts
				// use questions.forEach for looping directly
				var pushArray=[];
				var count=questions.length;
				if(qnCount>questions.length) throw new Error("Please add more questions for this level to attend test");
				//randomly push values into pushArray
				for(var i=0;pushArray.length<qnCount;i++){
					var check=Math.floor(Math.random()*count);
					var counter=0;
					for(var j=0;j<pushArray.length;j++){
						if(pushArray[j]==check){
							counter++;
						}
					}
					if(counter==0){
						pushArray.push(check);
					}
				}
				for(var i=0;i<qnCount;i++){
					pushArray[i]=questions[pushArray[i]].dataValues;
				}
				res.json(pushArray);
			}).catch(function(err){
				res.status('401').send({error:err});
			})

		}).catch(function(err){
			res.status('401').send({error:err});
		})
	})
//reset game
	app.get('/reset/:id',function(req,res){
		Score.findOne({where:{userId:req.params.id}})
			.then(function(score){
				console.log(JSON.stringify(score));
				var check=resetScore(score.id,score.previous_core,score.current_score,score.high_score);
				console.log("check"+check);
				if(check){
					res.json({message:"success"});
				}else{
					res.json({message:"retry"});
				}
			})
			.catch(function(err){
				res.json({err:err});
			});
	});
//get score
	app.get('/score/:id',function(req,res){
		Score.findOne({where:{userId:req.params.id}})
			.then(function(score){
				res.json(score);
			})
			.catch(function(err){
				res.status(401).send({err:err});
			})
	});
	function resetScore(id,previous_core,current_score,high_score){
		console.log("resetScore="+high_score);
		if(current_score>high_score){
			high_score=current_score;
		}
		console.log("after="+high_score);
		Score.update({
			current_level:'1',
			current_score:'0',
			previous_core: current_score,
			high_score:high_score
		},{
			where:{
				userId:id
			}
		}).then(function(score){
			console.log("updated"+JSON.stringify(score));
			return true;
			}
		).catch(function(err){
			console.log(JSON.stringify(err));
			return false;
		});	
		return true;
	};

//use res.end() for sending a error manually
//server settings
	app.listen('3000',function(error){
		if(error) throw error
			console.log('server started');
	});