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
const multer = require('multer');

/**
 * Creating store for storing session in dataBase
 */
const store = new MongoDBStore({
  uri: "mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true",
  collection: 'sessions'
});

/**
 * Setting the file storage and filter using multer
 */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')//null specify no error proceed with opearations
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true); //null specify no error proceed with opearations true means file has accepatable format
  } else {
    cb(null, false);
  }
}

/**
 * Setting the view engines
 */
app.set('view engine', 'ejs');
app.set('views', 'views');

/**
 * Declearing bodyparser and static directory for css and image in middleware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

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
 * locals Allows us to set variable in response to pass local variables for currently renderd views
 */
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
})

/**
 * Middleware that process every incomming request
 */
app.use((req, res, next) => {
  /**
   * For syncronus function call throw new Error("some error") 
   * will be handled by express error middleware.
   * but for async call like inside then we need to use next(new Error("some error"))
   */
  console.log("Logging the middleware functions :", req.url);
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user
      next()
    })
    .catch(err => next(new Error(err)))
});

/**
 * Routes used
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/**
 * Middleware that get excuted when nothing get processed and internal server error.
 */
app.use('/500', errorController.get500Page);
app.use(errorController.get404Page);
/**
 * Special middleware that takes 4 parameter this is error middleware
 */
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).render('500', {
    pageTitle: 'Internal server error',
    path: '',
    isAuthenticated: req.session.isLoggedIn
  })
})

/**
 * Connecting to data base
 */
mongoose.connect("mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true")
  .then(result => {
    app.listen(3000);
    console.log("Connection established ....")
  })
  .catch(error => console.log(error))
