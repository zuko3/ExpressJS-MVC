const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/errors')
const app = express();
const User = require("./models/user");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
/**
 * Creating store for storing session in dataBase
 */
const store = new MongoDBStore({
  uri: "mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true",
  collection: 'sessions'
});

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
 * For storing session in the mongo database
 */
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


/**
 * CSRF protection middleware
 */
app.use(csrf());

/**
 *For using flash message 
 */
app.use(flash())


/**
 * Middleware that process every incomming request
 */
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log("[Error]:", err))
  console.log("Logging the middleware functions :", req.url);
});

/**
 * locals Allows us to set variable in response to pass local variables for currently renderd views
 */
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
})

/**
 * Routes used
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/**
 * Middleware that get excuted when nothing get processed.
 */
app.use(errorController.get404Page);

/**
 * Connecting to data base
 */
mongoose.connect("mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true")
  .then(result => {
    app.listen(3000);
    console.log("Connection established ....")
  })
  .catch(error => console.log(error))
