const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors')
const app = express();
const User = require("./models/user");


/**
 * Setting the view engines
 */
app.set('view engine', 'ejs');
app.set('views', 'views');

/**
 * Declearing bodyparser and static directory for css and image in middleware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Middleware that process every incomming request
 */
app.use((req, res, next) => {
  User.findById("5c572c5797b852102cbc74fd")
    .then(user => {
      req.user =  user
      next()
    })
    .catch(err => console.log("[Error]:", err))
  console.log("Logging the middleware functions :", req.url);
});

/**
 * Routes used
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);

/**
 * Middleware that get excuted when nothing get processed.
 */
app.use(errorController.get404Page);

/**
 * Connecting to data base
 */
mongoose.connect("mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true")
  .then(result => {
    //Temprorily create a user.
    // const user = new User({
    //   name:'Rahul',
    //   email:'rahul@testmail.com',
    //   cart:{
    //     items:[]
    //   }
    // });
    // user.save()
    app.listen(3000);
    console.log("Connection established ....")
  })
  .catch(error => console.log(error))
