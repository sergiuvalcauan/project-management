var express = require('express');
var router = express.Router();
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');

var crypto = require('crypto');
var User = require('../models/user');
var secret = require('../secret/secret');


router.get('/', (req, res) => {
    var errors = req.flash('error');

    var info = req.flash('info');

    res.render('forgot', {title: 'Request Password Reset', messages: errors, hasErrors: errors.length > 0, info: info, noErrors: info.length > 0});
});

router.post('/', (req, res, next) => {
    async.waterfall([
        function(callback){
            crypto.randomBytes(20, (err, buf) => {
                var rand = buf.toString('hex');
                callback(err, rand);
            });
        },

        function(rand, callback){
            User.findOne({'email':req.body.email}, (err, user) => {
                if(!user){
                    req.flash('error', 'No Account With That Email Exist Or Email is Invalid');
                    return res.redirect('/forgot');
                }

                user.passwordResetToken = rand;
                user.passwordResetExpires = Date.now() + 3600 * 4 * 1000;
                console.log(Date.now())
                user.save((err) => {
                    callback(err, rand, user);
                });
            })
        },

        function(rand, user, callback){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: secret.auth.user, // secret.auth.user
                    pass: secret.auth.pass
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'ProjectM '+'<'+secret.auth.user+'>',
                subject: 'ProjectM Application Password Reset Token',
                text: 'You have requested for password reset token. \n\n'+
                    'Please click on the link to complete the process: \n\n'+
                    'http://localhost:3000/reset/'+rand+'\n\n'
            };

            smtpTransport.sendMail(mailOptions, (err, response) => {
               req.flash('info', 'A password reset token has been sent to '+user.email);
                return callback(err, user);
            });
        }
    ], (err) => {
        if(err){
            return next(err);
        }

        res.redirect('/forgot');
    })
});



module.exports = router;
