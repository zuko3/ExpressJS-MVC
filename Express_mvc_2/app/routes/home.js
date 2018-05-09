/* Home routes can acccess the routes only when user is authticated */
var HomeController = require('../controllers/HomeController');
var AuthController = require('../controllers/AuthController');
var express = require('express');

var router = express.Router();
router.get('/',AuthController.isAuthenticated,HomeController.Index);
router.get('/about',AuthController.isAuthenticated,HomeController.Aboutus);
router.get('/contact',AuthController.isAuthenticated,HomeController.contact);
router.post('/contact',AuthController.isAuthenticated,HomeController.saveContactData);
router.get('/service',AuthController.isAuthenticated,HomeController.service);
module.exports = router;
