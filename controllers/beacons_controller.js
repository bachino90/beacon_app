//===============================//
//====== Beacon Controller ======//
//===============================//

var express  = require('express');
var passport = require('passport');
var router   = express.Router();
var Beacon   = require('../models/beacon');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('../');
}

// GET /beacons
router.get('/', isLoggedIn, function(req, res) {
    Beacon.find(function(err, beacons) {
      if (err) {
        res.render('error',{message: err.message,
                              error: err});
      }

      res.render('beacons/index',{beacons: beacons, routeNew: false, message: ""});
    });
});

// GET /beacons/new
router.get('/new', isLoggedIn, function(req, res) {
    Beacon.find(function(err, beacons) {
      if (err) {
        res.render('error',{message: err.message,
                              error: err});
      }

      res.render('beacons/index',{beacons: beacons, routeNew: true, message: ""});
    });
});

// POST /beacons
router.post('/', isLoggedIn, function(req, res) {

    var beacon = new Beacon({
      uuid: req.body.uuid,
      major_id: req.body.major_id,
      minor_id: req.body.minor_id,
      content: req.body.content
    });
    // create a new instance of the Beacon model
    //beacon.uuid = req.body.uuid;
    //beacon.major_id = req.body.major_id;
    //beacon.minor_id = req.body.minor_id;
    //beacon.content = req.body.content;

    // save the Beacon and check for errors
    beacon.save(function(err) {
      if (err)
        res.send(err);//res.redirect('/beacons/index',{message: err, routeNew: true});//

      res.redirect('/beacons');
    });

});

// GET /beacons/:beacon_id
router.get('/:beacon_id', isLoggedIn, function(req, res) {
    Beacon.findOne({ 'uuid':req.params.beacon_id }, function(err, beacon) {
      if (err) {
        res.render('error',{message: err.message,
                            error: err});
      }

      res.render('beacons/show',{beacon: beacon});
    });
});


// PUT /beacons/:beacon_id
router.put('/:beacon_id',function(req, res) {

    // use our bear model to find the bear we want
    Beacon.findById(req.params.beacon_id, function(err, beacon) {

      if (err)
        res.send(err);

      beacon.uuid = req.body.uuid;
      beacon.mayor_id = req.body.mayor_id;
      beacon.minor_id = req.body.minor_id;
      beacon.content = req.body.content; 	// update the beacon info

      // save the bear
      beacon.save(function(err) {
        if (err)
          res.send(err);

        res.redirect('/beacons');
      });

    });
});


// DELETE /beacons/:beacon_id
router.delete('/:beacon_id', isLoggedIn, function(req, res) {
    Beacon.remove({ _id: req.params.beacon_id }, function(err, beacon_id) {
      if (err)
        res.send(err);

      res.redirect('/beacons');
    });
});


module.exports = router;
