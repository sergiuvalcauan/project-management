var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Project = require('../models/project');
var Task = require('../models/task')
var passport = require('passport');
var User = require('../models/user');
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res, next) {

    var db = req.db;

    // var id = req.session.passport.user;

    User.findById(req.session.passport.user ,'-password' , function (err, user) {
        if (err) return console.log(err);

        if (!user) {
        } else {
            proj_id = user.projects.map(function (doc) {
                return doc.id
            }) // retreive all the project ids from the user's database

            Project.collection.find({_id: {$in: proj_id}}, function (err, result) {
                result.toArray((err, data) => {


                    var tasid = new Array();
                    for (var i =0 ; i<data.length ; i++){
                        if(typeof data[i].tasks !== 'undefined'){
                            tasid[i] = data[i].tasks.map(function (doc){
                                return doc.id
                            })
                        }else{
                            tasid[i] = 0;
                        }
                    }
                    //1console.log(tasid)   // id-ul taskurilor din colectia Projects


                    function Create2DArray(rows) {
                        var arr = [];

                        for (var i=0;i<rows;i++) {
                            arr[i] = [];
                        }

                        return arr;
                    }

                    var t = Create2DArray(tasid.length);
                    var x = 0;

                    // var t = new Array(new Array());
                    // var x = 0;

                    //2console.log(t)

                    for(var i = 0; i<data.length; i++){
                        console.log(data[i].tasks)

                        if (typeof data[i].tasks !== 'undefined') {
                            for (var j = 0; j < data[i].tasks.length; j++) {
                                //3console.log(data[i].tasks[j])
                                if (data[i].tasks[j].Status == 'Completed') {
                                    t[x][j] = 1;
                                    //4console.log(t)
                                } else {
                                    t[x][j] = 0;
                                    //5console.log(t)
                                }
                            }
                        } else {
                                //6console.log(t)
                        }
                        x++;
                    }
                    console.log(t)    // MEREEEEEEEEEEE






                    // var tasid = new Array();
                    // for (var i =0 ; i<data.length ; i++){
                    //     if(typeof data[i].tasks !== 'undefined'){
                    //         tasid[i] = data[i].tasks.map(function (doc){
                    //             return doc.id
                    //         })
                    //     }else{
                    //         tasid[i] = 0;
                    //     }
                    // }
                    // console.log(tasid)   // id-ul taskurilor din colectia Projects
                    //
                    //
                    // function Create2DArray(rows) {
                    //     var arr = [];
                    //
                    //     for (var i=0;i<rows;i++) {
                    //         arr[i] = [];
                    //     }
                    //
                    //     return arr;
                    // }
                    //
                    // var t = Create2DArray(tasid.length);
                    // var x = 0;
                    //
                    // // var usingItNow = function(callback) {
                    //
                    //     for (var ii = 0; ii < tasid.length; ii++) {
                    //
                    //         Task.collection.find({_id: {$in: tasid[ii]}}).toArray((err, dat) => {
                    //             console.log("haaaaaaa" + dat); // deci 'dat' ii takurile unui proiect deja
                    //
                    //             console.log(dat)
                    //             if (typeof dat !== 'undefined') {
                    //                 for (var j = 0; j < dat.length; j++) {
                    //                     console.log(dat[j])
                    //                     if (dat[j].Status == 'Completed') {
                    //                         t[x][j] = 1;
                    //                         console.log(t)
                    //                     } else {
                    //                         t[x][j] = 0;
                    //                         console.log(t)
                    //
                    //                     }
                    //                 }
                    //             } else {
                    //                 console.log(t)
                    //             }
                    //             x++;
                    //             // callback(t)
                    //
                    //         });
                    //     }
                    // }

                    // var myCallback = function(data){
                    //     return data;
                    // }
                    //
                    // var test = usingItNow(myCallback)
                    //
                    // console.log(test)


                    // var tt = [[0,0,1,1,1], [1,0,0,1,0], [1,0]];
                    var final = new Array();

                    function sum(input){

                        if (toString.call(input) !== "[object Array]")
                            return false;

                        var total =  0;
                        for(var i=0;i<input.length;i++)
                        {
                            if(isNaN(input[i])){
                                continue;
                            }
                            total += Number(input[i]);
                        }
                        return total;
                    }

                    t.forEach(function(elem){
                        nrTaskuri = elem.length;
                        nrComplete = sum(elem);
                        // console.log(nrTaskuri + "  " + nrComplete);

                        procent = nrComplete * 100 / nrTaskuri;
                        final.push(procent)
                    });

                    console.log(final)


                    res.render('projects', {
                        percentege: final,
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
        'Client': req.body.clientName,
        _id: new ObjectID()
    };

    var db = req.db;

    User.findById(req.session.passport.user ,'-password' , function (err, user) {
        if (err) return console.log(err);

        if (user) {

            db.collection('users').update({_id: user._id}, {$push: { projects: {"id": info._id, "name": info.Name}} } )


            // User.collection.update({_id: req.session.passport.user}, {$et: { ses: "ses"} } ,function(err, result){
            //     if(err) return console.log(err)
            //
            //     console.log('------')
            //     console.log(result)
            //
            // })
        }
    });

    Project.collection.insert(info, function(err, result) {

            if (err) return console.log(err)

            console.log('saved to database')
            // res.redirect('/projects')
    })

    res.redirect('/projects')



});



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

