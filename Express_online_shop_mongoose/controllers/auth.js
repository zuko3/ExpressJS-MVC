const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
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
        isAuthenticated: false,
        errorMessage: req.flash('error')
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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errMessage ='';
        errors.array().forEach(error => {
            errMessage += error.msg
        })
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            errorMessage:errMessage
        });
    }
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc){
                req.flash("error", "User already exists");
                return res.redirect("/signup")
            } 
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

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset")
        }
        const token = buffer.toString("hex");

        User.findOne({ email: req.body.email }).
            then(user => {
                if (!user) {
                    req.flash("error", "No Account found with Enterd email");
                    return res.redirect("/reset")
                } else {
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600000;
                    user.save().then(result => {
                        res.redirect("/")
                        transporter.sendMail({
                            to: req.body.email,
                            from: 'shop@nodecomplete.com',
                            subject: 'password reset',
                            html: `
                                <p>You requested a new password</p>
                                <p>click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password </p>
                            `
                        });
                    }).catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const { token } = req.params;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                isAuthenticated: false,
                errorMessage: req.flash('error'),
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newpassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newpassword, 12)
        }).then(hashedpassword => {
            resetUser.password = hashedpassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save()
        })
        .then(result => res.redirect("/login"))
        .catch(err => console.log(err))
}