/*Setting up the error Routes*/

module.exports = function(app){
	
     app.use(function(req, res) {
		res.status(400);
		res.render('error', {titleforpage: '404: File Not Found', content:'404: File Not Found ! Tap menu link to navigate.'});
	 });
 
    app.use(function(error, req, res, next) {
		res.status(500);
		res.render('errro', {titleforpage:'500: Internal Server Error', content: error});
	});
}	
 
