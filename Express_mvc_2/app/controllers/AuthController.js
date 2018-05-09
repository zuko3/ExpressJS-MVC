/*Auth controllers*/

var Users = [];
var _this = this;

/* This is used for handling redirection to the login page*/
exports.Login = function(request, response){
	var contextData={
		'titleforpage' : 'Login Page'
	}
    response.render('login',contextData);
};


/* This is used for handling redirection to the registration page*/
exports.Register = function(request, response){
	var contextData={
		'titleforpage' : 'Register Page'
	}
    response.render('register',contextData);
};


/* This is used for handling registration */
exports.RegisterUser = function(request, response){
	var contextData={
		'titleforpage' : 'Register Page'
	}
	if(!request.body.username || !request.body.password){
		response.status("400");
		contextData['error']='Feilds are required';
		response.render('register',contextData);
	}else{
		var isValid=true;
		Users.filter(function(user){
			 if(user.username === request.body.username){
				 isValid=false;
				 response.status("400");
				 contextData['error']='username alraedy exists';
				 response.render('register',contextData);
			 }
		});
		if(isValid){
			var newUser = {username: request.body.username, password: request.body.password};
			Users.push(newUser);
			request.session.user = newUser;//to store the ses if reg is success
			response.redirect('/home');
			
		}
	}
	
    
};

/* This is used for handling Login */
exports.LoginUser = function(request, response){
	var contextData={
		'titleforpage' : 'Login Page'
	}
	if(!request.body.username || !request.body.password){
		response.status("400");
		contextData['error']='Feilds are required';
		response.render('login',contextData);
	}else{
			var isValid=false;
			Users.filter(function(user){
				 if(user.username === request.body.username && user.password === request.body.password){
					 isValid=true;
					 request.session.user = user;//to store the ses if the login success
					 response.redirect('/home');
				 }
			});
			if(!isValid){
				response.status("400");
				contextData['error']='Invalid credentials';
				response.render('login',contextData);
			}
				
	}
    
};


/* This is used for handling Logout */
exports.Logout=function(request, response){
	 request.session.destroy(function(){
		_this.Login(request, response); 
	 });
};


/* This is used for checking if the user is authenticated */
exports.isAuthenticated=function(request, response,next){
	if(request.session.user){
		response.locals.user = request.session.user;
		next(); //If session exists, proceed to page
	}else{
		var err = new Error("Not logged in!");
		response.status(401);
		next(err);  //Error, trying to access unauthorized page!
	}
};
 


