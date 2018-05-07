var path = require('path');
var express = require('express');
var envConfig=require('./config/EnvConfig');
var app = express();

/*Setting up the route*/
var myRoute = require('./app/routes/home');
app.use('/home', myRoute);

/*for setting the template engine*/
app.set('view engine', 'pug');

/*for setting the path for the template*/
app.set('views', './app/views');

/*setting the path for the static folder like images,css*/
app.use('/static',express.static(path.join(__dirname, 'public')));

/*setting route of errror 404 and 500*/
require("./app/routes/ErrorRoutes")(app);

/*listening to port */
app.listen(envConfig.app.port,function(){
	console.log("Express server listening on port : ",envConfig.app.port);
});
