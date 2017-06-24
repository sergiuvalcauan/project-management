var express = require('express');
var router = express.Router();
var keypress = require('keypress');



/* GET home page. */
router.get('/', function(req, res, next) {

        res.render('messages', {
            title: 'Home'
        })
});



module.exports = router;
