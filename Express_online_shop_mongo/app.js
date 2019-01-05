const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors')
const app = express();
const mongoConnect = require("./util/database").mongoConnect;


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
  console.log("Logging the middleware functions :", req.url);
  next();
})

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
