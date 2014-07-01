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

function redirectToHomeWithErrors(req,res,rN,m,vE,newB,showB) {
  Beacon.find(function(err, b) {
    if (err) {
      res.render('error',{message: err.message,
                          error: err});
    }
    console.log(vE);
    if (vE['code'] == 11000) {
      m = "Already exist";
    }
    res.render('beacons/index',{beacons: b, routeNew: rN, message: m, valErr: vE, newBeacon: newB, showBeacon: showB});
  });
}

// GET /beacons
router.get('/', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /beacons/new
router.get('/new', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,true,'',false);
});

// POST /beacons
router.post('/', isLoggedIn, function(req, res) {

    var beacon = new Beacon({
      uuid: req.body.uuid,
      major_id: req.body.major_id,
      minor_id: req.body.minor_id
    });
/*
    var unique = Beacon.findOne({
      uuid: req.body.uuid,
      major_id: req.body.major_id,
      minor_id: req.body.minor_id
    },function(err, beacon2) {
      if (err)
        res.send(err);

      if (beacon2) {
        console.log('Alredy exist');
        redirectToHomeWithErrors(req,res,true,'This beacon already exists',false);
      } else {
      */
        beacon.content = req.body.content;
        beacon.save(function(err) {
          if (err)
            redirectToHomeWithErrors(req,res,true,'',err);
          else
            res.redirect('/beacons');
        });
      //}
    //});
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

      // save the beacon
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
