//===============================//
//====== Beacon Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Beacon         = require('../models/beacon').Beacon;
var BeaconClient   = require('../models/beacon').BeaconClient;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('../');
}

function insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c) {
  console.log(vE);
  if (vE['code'] == 11000) {
    m = "Already exist";
  }
  var title = "Beacons";
  if (req.params.client_id) {
  }
  res.render('beacons/index',{title: title, clients_side: c, clients_main: b, routeNew: rN, message: m, valErr: vE, newBeacon: newB, showBeacon: showB});
}

function redirectToHomeWithErrors(req,res,rN,m,vE,newB,showB) {
  BeaconClient.find(function(err1, c) {
    if (err1) {
      console.log('aca')
      res.render('error',{message: err1.message,
                          error: err1});
    } else if (req.params.client_id) {
      BeaconClient.findById(req.params.client_id, function(err,client) {
        console.log(err);
        if (err) {
          res.render('error',{message: err.message,
                              error: err});
        } else {
          b = [client];
          insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c);
        }
      });
    } else {
      b = c;
      insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c);
    }
  });
}

// GET /beacons
router.get('/', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /beacons/client_id
router.get('/:client_id',isLoggedIn, function(req, res){
  console.log(req.params.client_id);
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /beacons/new
router.get('/new', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,true,'',false);
});

// POST /clients
router.post('/clients', isLoggedIn, function(req,res) {
  var new_client = new BeaconClient({
    name: req.body.name,
    primary_uuid: req.body.primary_uuid,
    secondary_uuid: req.body.secondary_uuid
  });
  new_client.save(function(err) {
    if(err)
      res.render(err);

    res.redirect('/beacons');
  });
});

// POST /beacons
router.post('/', isLoggedIn, function(req, res) {

  var beacon = new Beacon({
    uuid: req.body.uuid,
    major_id: req.body.major_id,
    minor_id: req.body.minor_id
  });
  beacon.content = req.body.content;
  beacon.save(function(err) {
    if (err)
      redirectToHomeWithErrors(req,res,true,'',err);
    else
      res.redirect('/beacons');
  });
});

// POST /beacons/:client_id/stores
router.post('/:client_id/stores',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.stores.push({ store_name: req.params.store_name, major_id: req.params.major_id });
    client.save(function (err) {
      console.log('1'+client);
      if (!err) console.log('Success!');
      else {
        console.log('2'+client);
        res.redirect('/beacons/'+req.params.client_id);
      }
    });
  });
});

// GET /beacons/:beacon_id
/*
router.get('/:beacon_id', isLoggedIn, function(req, res) {
    Beacon.findOne({ 'uuid':req.params.beacon_id }, function(err, beacon) {
      if (err) {
        res.render('error',{message: err.message,
                            error: err});
      }

      res.render('beacons/show',{beacon: beacon});
    });
});
*/

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
