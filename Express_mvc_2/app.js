var path = require('path');
var express = require('express');
var envConfig=require('./config/EnvConfig');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

/* for parsing application/json */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* for ussing the session middle ware in our application */ 
app.use(session({secret: "Your secret key"}));

/* Setting up the route */
var homeRoute = require('./app/routes/home');
var authRoute = require('./app/routes/Auth');
app.use('/home', homeRoute);
app.use('/auth', authRoute);


/* for setting the template engine */
app.set('view engine', 'pug');

/* for setting the path for the template */
app.set('views', './app/views');

/* setting the path for the static folder like images,css */
app.use('/static',express.static(path.join(__dirname, 'public')));

/* setting route of errror routes 404 and 500 this should be the last route */
require("./app/routes/ErrorRoutes")(app);

/* listening to port */
app.listen(envConfig.app.port,function(){
	console.log("Express server listening on port : ",envConfig.app.port);
});
