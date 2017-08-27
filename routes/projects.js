var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Project = require('../models/project');
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

    var db = req.db;

    // var id = req.session.passport.user;

    User.findById(req.session.passport.user ,'-password' , function (err, user) {
        if (err) return console.log(err);

        if(user){
            proj_id = user.projects.map(function(doc) { return doc.id }) // retreive all the project ids from the user's database

            Project.collection.find({_id: { $in : proj_id } }, function(err, result){
                    result.toArray( (err, data) => {
                        res.render('projects', {
                            project: data,
                            title: 'Projects'
                        })
                    })
            })
        }
    });


});



router.post('/', function(req, res, next){


    var info = {
        'Name': req.body.projectName,
        'Client': req.body.clientName
    };

    var db = req.db;

    Project.collection.insert(info, function(err, result) {

        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/projects')
    })

});

// so far
// router.post('/', function(req, res, next){
//
//     var db = req.db;
//
//     var info = {
//         'Name': req.body.projectName,
//         'Client': req.body.clientName
//     };
//
//     var id_inserted;
//
//     User.findById(req.session.passport.user, '-password', function(err, user){
//
//         if(user){
//             Project.collection.insert(info, function(err, result) {
//
//                 id_inserted = result.ops[0]._id;
//
//                 if (err) return console.log(err)
//
//                 console.log('saved to database')
//                 res.redirect('/projects')
//             })
//         }
//
//     })
//
// });




router.get('/search', function(req,res, next){

    var search_text = req.query.search;

        // console.log(search_text);

        var db = req.db;

        // just remove the collection and it works
        Project.find( { Name : new RegExp("^"+search_text, "i") }  , function(err, result)  {
            // console.log(result)
            // for (var i = 0; i < result.length; i++) {
            //     res.send("<li>" + result[i].first_name + " " + result[i].last_name + "</li>" + "<br/>");
            //     console.log(result[i].first_name);
            // }

            // res.send(result)

            res.json(result);
        })
        // res.send(search_text);

});


// router.delete('/rem', function(req, res, next){
//
//     var id = req.query.Name;
//     var con = req.params.Name;
//     console.log(id)
//
//     var db = req.db;
//     // db.collection('project').remove({ "id": id });
//     db.collection('project').remove({ "Name": id}, (err,res) => {
//         if (err) return res.send(500, err)
//         res.send('A darth vadar quote got deleted')
//     });
// });

router.delete('/', function(req, res) {

    console.log(req.body.Name)

    var db = req.db;
    Project.collection.findOneAndDelete({
            'Name': req.body.Name
        },
        function(err, result) {
            if (err) return res.send(500, err)
            res.send('A project got deleted')
        })
})


module.exports = router;
