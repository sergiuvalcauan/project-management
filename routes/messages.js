var express = require('express');
var router = express.Router();
var keypress = require('keypress');
// var io = require('socket.io')
var User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {


        res.io.on('connection', function(socket){
            console.log('A user has connected');

            socket.on('join', function(data) {
                console.log(data);
            });

            socket.on('chat message', function(msg) {
                console.log('message: ' + msg);
                res.io.emit('chat message', msg);
            });

            socket.on('disconnect', function(){
                console.log('A user has disconnected');

                // fixes the problem of displaying the message multiple times if is not the first user to connect
                socket.removeAllListeners('chat message');
                socket.removeAllListeners('disconnect');
                res.io.removeAllListeners('connection');
            });
        })


        res.render('messages', {
            title: 'Home'
        })

});


module.exports = router;
