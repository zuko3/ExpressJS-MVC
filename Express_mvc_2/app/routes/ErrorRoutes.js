/*Setting up the error Routes*/

module.exports = function(app){
	
     /* This is used to handle when no routes matches */
	 app.use(function(req, res) {
		if(req.session.user){
			res.locals.user = req.session.user;
		}
		res.status(404);
		res.render('error', {titleforpage: '404: File Not Found', content:'404: File Not Found ! Tap menu link to navigate.'});
	 });
 
	/* This is used to handle all the server error range 500 */
    app.use(function(error, req, res, next) {
		if(req.session.user){
			res.locals.user = req.session.user;
		}
		if(res.statusCode=401){
			var contextData={
				'titleforpage' : 'Login Page'
			}
			contextData['error']='Not logged in!';
			res.render('login',contextData);
		}else{
			res.status(500);
			res.render('error', {titleforpage:'500: Internal Server Error', content: error});
		}
		
	});
}	
 
