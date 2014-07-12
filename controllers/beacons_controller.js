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
  if (vE['code'] == 11000) {
    m = "Already exist";
  }
  var title = "Beacons";
  var client_id = "";
  if (req.params.client_id) {
    title = b[0].name;
    client_id = req.params.client_id;
  }
  res.render('beacons/index',{title: title, clients_side: c, clients_main: b, client_id: client_id,routeNew: rN, message: m, valErr: vE, newBeacon: newB, showBeacon: showB});
}

function redirectToHomeWithErrors(req,res,rN,m,vE,newB,showB) {
  BeaconClient.find(function(err1, c) {
    if (err1) {
      res.render('error',{message: err1.message,
                          error: err1});
    } else if (req.params.client_id) {
      //console.log(req.params.client_id)
      BeaconClient.findById(req.params.client_id).populate('beacons').exec(function(err,client) {
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

// GET /clients
router.get('/', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/:client_id
router.get('/:client_id',isLoggedIn, function(req, res){
  //console.log(req.params.client_id);
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/new
router.get('/new', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,true,'',false);
});

// POST /clients
router.post('/', isLoggedIn, function(req,res) {
  var new_client = new BeaconClient({
    name: req.body.name,
    primary_uuid: req.body.primary_uuid,
    secondary_uuid: req.body.secondary_uuid
  });
  new_client.save(function(err) {
    if(err)
      res.render(err);

    res.redirect('/clients');
  });
});

// POST /clients/:client_id/beacons
router.post('/:client_id/beacons', isLoggedIn, function(req, res) {

  var beacon = new Beacon({
    uuid: req.body.uuid,
    major_id: req.body.major_id,
    minor_id: req.body.minor_id,
    client: req.params.client_id
  });
  beacon.content = req.body.content;
  beacon.save(function(err) {
    if (err)
      redirectToHomeWithErrors(req,res,true,'',err);
    else
      res.redirect('/clients');
  });
});

// GET /clients/:client_id/storesareas
router.get('/:client_id/storesareas',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    if (err) console.log('Error: '+err);
    else {
      var response = new Object();
      response.stores = client.stores;
      response.areas = client.areas;
      res.json({ response: response });
    }
  });
});

// POST /clients/:client_id/stores
router.post('/:client_id/stores',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.stores.push({ store_name: req.body.store_name, major_id: req.body.major_id });
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id
router.delete('/:client_id/stores/:store_id',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.stores.id(req.params.store_id).remove();
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// POST /clients/:client_id/areas
router.post('/:client_id/areas',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.areas.push({ area_name: req.body.area_name, minor_id: req.body.minor_id });
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// DELETE /clients/:client_id/areas/:area_id
router.delete('/:client_id/areas/:area_id',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.areas.id(req.params.area_id).remove();
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// GET /clients/:client_id/beacons
/*
router.get('/:client_id/beacons', isLoggedIn, function(req, res) {
    BeaconClient.findOne({ 'uuid':req.params.client_id }, function(err, beacon) {
      if (err) {
        res.render('error',{message: err.message,
                            error: err});
      }

      res.render('beacons/show',{beacon: beacon});
    });
});
*/

// PUT /clients/:client_id
router.put('/:client_id',function(req, res) {

    // use our bear model to find the bear we want
    BeaconClient.findById(req.params.client_id, function(err, beacon) {

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


// DELETE /clients/:client_id
router.delete('/:client_id', isLoggedIn, function(req, res) {
    BeaconClient.remove({ _id: req.params.client_id }, function(err, beacon_id) {
      if (err)
        res.send(err);

      res.redirect('/clients');
    });
});


// DELETE /clients/:client_id/beacons/:beacon_id
router.delete('/:client_id', isLoggedIn, function(req, res) {
    BeaconClient.remove({ _id: req.params.client_id }, function(err, beacon_id) {
      if (err)
        res.send(err);

      res.redirect('/clients');
    });
});

module.exports = router;
