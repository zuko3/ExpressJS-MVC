/*Home routes*/
var HomeController = require('../controllers/HomeController');
var express = require('express');

var router = express.Router();
router.get('/',HomeController.Index);
router.get('/other',HomeController.Other);
module.exports = router;
