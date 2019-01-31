const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors')
const app = express();
const mongoConnect = require("./util/database").mongoConnect;
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
  User.findById("5c326f291c9d4400001156b3")
    .then(user => {
      req.user = new User(user.userName, user.email, user.cart, user._id);
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
mongoConnect(() => {
  console.log("DataBase connection Established ...")
  app.listen(3000);
})
