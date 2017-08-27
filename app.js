var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
// var ang = require('angular');

// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/dbTest');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dbTest1');
var db = mongoose.connection;

require('./config/passport');
require('./secret/secret');

var activity = require('./routes/activity');
var blank = require('./routes/blank');
var files = require('./routes/files');
var gallery = require('./routes/gallery');
var helpinner = require('./routes/helpinner');
var help = require('./routes/help');
var index = require('./routes/index');
var login = require('./routes/login');
var forgot = require('./routes/forgot')
var reset = require('./routes/reset')
var messages = require('./routes/messages');
var profile = require('./routes/profile');
var projects = require('./routes/projects');
var settings = require('./routes/settings');
var tasks = require('./routes/tasks');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var User = require('./models/user');

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());

//
app.use(session({
    secret: 'Thisismytestkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(function(req, res, next) {
    if (req.session) {
        var Us = req.session.passport;

        if ( Us ) {

            User.findById( req.session.passport.user, '-password' , function(err, user) {
                if (user) {
                    res.locals.user = user;
                    console.log(user);
                } else {
                    req.session.user = 'user';
                    res.locals.user = 'none';
                    console.log(user);
                }
                // finishing processing the middleware and run the route
                next();
            });
        }else {
            res.locals.user = 'no';
            next();
        }
    } else {
        next();
    }
});

app.use(function(req, res, next){
    res.io = io;
    next();
});

app.use('/activity', activity)
app.use('/blank', blank)
app.use('/files', files)
app.use('/gallery', gallery)
app.use('/helpinner', helpinner)
app.use('/help', help)
app.use('/', index);
app.use('/login', login)
app.use('/reset', reset)
app.use('/messages', messages)
app.use('/profile', profile)
app.use('/projects', projects)
app.use('/settings', settings)
app.use('/tasks', tasks)
app.use('/forgot', forgot)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = {app: app, server: server};
