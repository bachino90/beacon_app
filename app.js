// Express 4.0

var express        = require('express');
var path           = require('path');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var helpers        = require('express-helpers');
var mongoose       = require('mongoose');
var passport       = require('passport');
var flash 	       = require('connect-flash');
var app            = express();

//===============================//
//====== App CONFIGURATION ======//
//===============================//
app.use(express.static(path.join(__dirname, 'public'))); 	// set the static files location /public/img will be /img for users
//app.use(morgan('dev')); 				                	// log every request to the console
app.use(bodyParser()); 						               // pull information from html in POST
app.use(methodOverride()); 					             // simulate DELETE and PUT
app.use(cookieParser());

app.use(session({secret: 'este_es_mi_secreto,sh!!!!'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport); // pass passport for configuration

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
helpers(app);   // set view helpers for EJS

//===============================//
//====== DB CONFIGURATION =======//
//===============================//

var env = process.env.NODE_ENV || 'development';
console.log(process.env.MONGOHQ_URL);
//var mongoUri = 'mongodb://heroku:-IY7qZns1g-mcGfYpV29JVjwjMmmYu_v5ITVPCW1gPQjCYakIOrrmq7z0lE3PelCJJj3GgCLkohxAB28LzWF5Q@kahana.mongohq.com:10092/app26226186';
//process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
mongoose.connect(mongoUri); // connect to our database

//===============================//
//====== Env CONFIGURATION ======//
//===============================//

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//===============================//
//===== Routes CONFIGURATION ====//
//===============================//

var index_controller = require('./controllers/index_controller');
var beacons_controller = require('./controllers/beacons_controller');
var beacons_api_controller = require('./controllers/api/v1/beacons_api_controller');

app.use('', index_controller);
app.use('/beacons', beacons_controller);
app.use('/api/v1/beacons', beacons_api_controller);

//===============================//
//===== Server CONFIGURATION ====//
//===============================//

app.listen(8080);
console.log('Magic happens on port 8080'); 			// shoutout to the user
