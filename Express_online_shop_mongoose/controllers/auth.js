const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'key'
    }
}))

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: req.flash('error')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect("/login")
            }
            bcrypt.compare(password, user.password)
                .then(matched => {
                    if (matched) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save(err => {
                            console.log(err);
                            if (err) res.redirect("/login")
                            else res.redirect("/")
                        });
                    } else {
                        req.flash('error', 'Invalid email or password !!');
                        res.redirect("/login")
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.redirect("/login")
                })
        }).catch(err => console.log("error"))
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) return res.redirect("/signup")
            return bcrypt.hash(password, 12)

        }).then(hashedpassword => {
            const user = new User({
                name: 'Test name',
                email,
                password: hashedpassword,
                cart: {
                    items: []
                }
            });
            return user.save();
        })
        .then(result => {
            transporter.sendMail({
                to: email,
                from: 'shop@nodecomplete.com',
                subject: 'Signup sucessfull',
                html: '<h1>You sucessfully signedup</h1>'
            })
            res.redirect("/login")
        })
        .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
