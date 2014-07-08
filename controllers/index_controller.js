//===============================//
//======= Index Controller ======//
//===============================//

var express  = require('express');
var passport = require('passport');
var router   = express.Router();

// route middleware to make sure a user is NOT logged in
function isNOTLoggedIn(req, res, next) {

  // if they are redirect them to the Beacon page
  if (req.isAuthenticated())
    res.redirect('/beacons');

  // if user is NOT authenticated in the session, carry on
  return next();
}

function correctAnswer(req, res, next) {
  if (req.body.answer != 'karlo') {
    res.render('signup', { title: 'Sign up',  message: "That's a wrong code." });
  } else {
    return next();
  }
}

/* GET Login page. */
router.get('/', isNOTLoggedIn, function(req, res) {
  res.render('login', { title: 'Log in',  message: req.flash('loginMessage') });
});

/* GET Login page. */
router.get('/login', isNOTLoggedIn, function(req, res) {
  res.render('login', { title: 'Log in',  message: req.flash('loginMessage') });
});

/* GET Signup page. */
router.get('/signup', isNOTLoggedIn, function(req, res) {
  res.render('signup', { title: 'Sign up',  message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', isNOTLoggedIn, correctAnswer, passport.authenticate('local-signup', {
	successRedirect : '/beacons', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

// process the login form
router.post('/login', isNOTLoggedIn, passport.authenticate('local-login', {
	successRedirect : '/beacons', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

router.get('/extream', function(req,res) {
  res.render('beacons/extream');
});

// process the logout form
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
