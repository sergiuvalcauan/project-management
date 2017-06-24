var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');
var passport = require('passport');

var User = require('../models/user');
var secret = require('../secret/secret');



router.get('/:token', (req, res) => {

    User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
        if(!user){
            req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
            return res.redirect('/forgot');
        }
        var errors = req.flash('error');
        var success = req.flash('success');

        res.render('reset', {title: 'Reset Your Password', messages: errors, hasErrors: errors.length > 0, success:success, noErrors:success.length > 0});
    });
});

router.post('/:token', (req, res) => {
    async.waterfall([
        function(callback){
            User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
                if(!user){
                    req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
                    return res.redirect('/forgot');
                }

                req.checkBody('password', 'Password is Required').notEmpty();
                req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min:5});
                req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

                var errors = req.validationErrors();

                if(req.body.password == req.body.cpassword){
                    if(errors){
                        var messages = [];
                        errors.forEach((error) => {
                            messages.push(error.msg)
                        })

                        var errors = req.flash('error');
                        res.redirect('/reset/'+req.params.token);
                    }else{
                        user.password = req.body.password;
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;

                        user.save((err) => {
                            req.flash('success', 'Your password has been successfully updated.');
                            callback(err, user);
                        })
                    }
                }else{
                    req.flash('error', 'Password and confirm password are not equal.');
                    res.redirect('/reset/'+req.params.token);
                }

            });
        },

        function(user, callback){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: secret.auth.user,
                    pass: secret.auth.pass
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'ProjectM '+'<'+secret.auth.user+'>',
                subject: 'Your password Has Been Updated.',
                text: 'This is a confirmation that you updated the password for '+user.email
            };

            smtpTransport.sendMail(mailOptions, (err, response) => {
                callback(err, user);

                var error = req.flash('error');
                var success = req.flash('success');

                res.render('reset', {title: 'Reset Your Password', messages: error, hasErrors: error.length > 0, success:success, noErrors:success.length > 0});
            });
        }
    ]);
});


module.exports = router;
