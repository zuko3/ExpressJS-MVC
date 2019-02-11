const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const { check, body } = require('express-validator/check');
//Checks checks of field in entire request, while body checks in only body

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);

router.post('/signup', [
    check('email').isEmail()
        .withMessage("please enter a valid email"),
    body('password').isLength({ min: 5 })
        .isAlphanumeric()
        .withMessage("please enter a passowrd of text and chacter of 5 chars"),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password have to match!')
        }
        return true
    })
        .withMessage("password have to match!")
], authController.postSignup);

router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;