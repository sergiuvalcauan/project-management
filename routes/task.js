var express = require('express');
var router = express.Router();
var keypress = require('keypress');
var mongoose = require('mongoose');
var Project = require('../models/project');
var passport = require('passport');
var User = require('../models/user');
var Task = require('../models/task');
var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/:id', function(req, res, next) {

        idTask = req.params.id;

        Task.findById(req.params.id , function (err, task) {
            if (err) return console.log(err);

            if(task){

                res.render('task', {
                    task: task
                })

            }
        });

});






module.exports = router;
