/*Auth routes*/
var AuthController = require('../controllers/AuthController');
var express = require('express');

var router = express.Router();
router.get('/login',AuthController.Login);
router.get('/register',AuthController.Register);
router.post('/register',AuthController.RegisterUser);
router.post('/login',AuthController.LoginUser);
router.get('/logout',AuthController.Logout);
module.exports = router;
