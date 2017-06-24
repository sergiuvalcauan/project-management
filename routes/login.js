var express = require('express');
var router = express.Router();
var passport = require('passport');



router.get('/', (req, res) => {
    var errors = req.flash('error');
    res.render('login', {title: 'Login || RateMe', messages: errors, hasErrors: errors.length > 0});
});

router.post('/', loginValidation, passport.authenticate('local', {
    // successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash : true
}), (req, res) => {
    if(req.body.remeberme){
        req.session.cookie.originalMaxAge = 30*24*60*60*1000; // 30 days
    }else{
        req.session.cookie.expires = null;
    }
    res.redirect('/projects');//home
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.redirect('/');
    });
})


function loginValidation(req, res, next){
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is Invalid').isEmail();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});
    // req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

    var loginErrors = req.validationErrors();

    if(loginErrors){
        var messages = [];
        loginErrors.forEach((error) => {
            messages.push(error.msg);
        });

        req.flash('error', messages);
        res.redirect('/login');
    }else{
        return next();
    }
}

module.exports = router;
