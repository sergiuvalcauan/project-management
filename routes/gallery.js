var express = require('express');
var router = express.Router();
var keypress = require('keypress');



/* GET home page. */
router.get('/', function(req, res, next) {

        res.render('gallery', {
            title: 'Home'
        })
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
