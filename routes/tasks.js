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

        idProiect = req.params.id;

        Project.findById(req.params.id , function (err, project) {
            if (err) return console.log(err);

            if(project){

                User.findById(req.session.passport.user ,'-password' , function (err, user) {


                    tasksid = user.tasks.map(function (doc) {
                        return doc.id
                    }); // retreive all the tasks ids from the user's collection


                    projid = project.tasks.map(function (doc){
                        return doc.id
                    }); // retrieve all the tasks ids from the projects collection


                    Task.collection.find({ $and: [ { _id: { $in: tasksid } }, { _id: { $in: projid } } ] }).toArray((err, data) => {
                        // D=JSON.stringify(data);
                        // console.log("PFFFF: "+ D);
                            res.render('tasks', {
                                task: data,
                                title: 'Tasks'
                            })
                    });


                });

            }
        });

});



router.post('/', function(req, res, next){

    var info = {
        'Summary': req.body.taskName,
        _id: new ObjectID(),
        'Status': "NotStarted"
    };

    var db = req.db;

    User.findById(req.session.passport.user ,'-password' , function (err, user) {
        if (err) return console.log(err);

        if (user) {
            db.collection('users').update({_id: user._id}, {$push: { tasks: {"id": info._id, "name": info.Summary}} } )
        }
    });

    Task.collection.insert(info, function(err, result) {
        if (err) return console.log(err)

    });


    Project.findById( idProiect , function (err, project) {
        if (err) return console.log(err);

        if (project) {
            db.collection('project').update({_id: project._id}, {$push: { tasks: {"id": info._id, "name": info.Summary, "Status": "Notstarted"}} } )
        }
    });



    // Project.findById( idProiect , function (err, proiect) {
    //
    //     proiect.update( {$push: { tasks: {"id": info._id, "name": info.Summary, "Status": info.Status }} } , {upsert: true} , function(err, numberAffected, raw) { });
    //
    // });


    res.redirect('back');


});


// router.get('/searching', function(req,res){
//
//     var search_text = req.query.search;
//
//         console.log(search_text)
//
//
//         var db = req.db;
//         db.collection('users').find( {"first_name": new RegExp("^"+search_text, "i") }  , (err, result) => {
//             // for (var i = 0; i < result.length; i++) {
//             //     res.send("<li>" + result[i].first_name + " " + result[i].last_name + "</li>" + "<br/>");
//             //     console.log(result[i].first_name);
//             // }
//
//             // res.send(result)
//             res.type('text/plain')
//             res.json(result);
//         })
//         // res.send(search_text);
//
//
// });


module.exports = router;
