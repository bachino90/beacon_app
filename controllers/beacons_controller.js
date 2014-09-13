//===============================//
//====== Beacon Controller ======//
//===============================//

var express        = require('express');
var passport       = require('passport');
var router         = express.Router();
var Store          = require('../models/beacon').Store;
var Area           = require('../models/beacon').Area;
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
  res.render('beacons/index',{title: title,
                       clients_side: c,
                       clients_main: b,
                          client_id: client_id,
                           routeNew: rN,
                            message: m,
                             valErr: vE,
                          newBeacon: newB,
                         showBeacon: showB});
}

function redirectToHomeWithErrors(req,res,rN,m,vE,newB,showB) {
  BeaconClient.find(function(err1, c) {
    if (err1) {
      console.log('error al encontrar clientes en redirectToHomeWithError');
      res.render('error',{message: err1.message,
                          error: err1});
    } else if (req.params.client_id) {
      //console.log(req.params.client_id)
      BeaconClient.findById(req.params.client_id).populate('beacons').populate('stores').exec(function(err,client) {
        if (err) {
          res.render('error',{message: err.message,
                              error: err});
        } else {
          b = [client];
          insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c);
        }
      });
    } else {
      console.log('Encontro estos errores:');
      console.log(c);
      b = c;
      insideRedirectToHome(req,res,rN,m,vE,newB,showB,b,c);
    }
  }).populate('stores');
}

// GET /clients
// Get all clients
router.get('/', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/:client_id
// Get client with client_id
router.get('/:client_id',isLoggedIn, function(req, res){
  //console.log(req.params.client_id);
  redirectToHomeWithErrors(req,res,false,'',false);
});

// GET /clients/new
router.get('/new', isLoggedIn, function(req, res) {
  redirectToHomeWithErrors(req,res,true,'',false);
});

// POST /clients
// Create a client
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
// Create beacon for client_id
router.post('/:client_id/beacons', isLoggedIn, function(req, res) {
  BeaconClient.findById(req.params.client_id,function(err, client) {
    var beacon = new Beacon({
      uuid: req.body.uuid,
      major_id: req.body.major_id,
      minor_id: req.body.minor_id,
      client: client._id //req.params.client_id
    });
    /*
    beacon.store.store_name = ;
    beacon.store.major_id = ;
    beacon.store.location.latitude = ;
    beacon.store.location.longitude = ;
    beacon.area.area_name = ;
    beacon.area.minor_id = ;
    beacon.area.description = ;
    */
    beacon.content = req.body.content;
    beacon.save(function(err) {
      if (err)
        redirectToHomeWithErrors(req,res,true,'',err);
      else
        res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// GET /clients/:client_id/storesareas
// Get all store and areas for client_id
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

// GET /clients/:client_id/stores
// Get all store for client_id
router.get('/:client_id/stores',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id).populate('stores').exec(function(err,client) {
    if (err) console.log('Error: '+err);
    else {
      var response = new Object();
      response.stores = client.stores;
      res.json({ response: response });
    }
  });
});

// POST /clients/:client_id/stores
// Create store for client_id
router.post('/:client_id/stores',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    var store = new Store();
    store.store_name = req.body.store_name;
    store.major_id = req.body.major_id;
    store.client = client._id;
    store.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id
// Delete store with store_id in client_id
router.delete('/:client_id/stores/:store_id',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    client.stores.id(req.params.store_id).remove();
    client.save(function (err) {
      if (err) console.log('Error: '+err);
      else res.redirect('/clients/'+req.params.client_id);
    });
  });
});

// POST /clients/:client_id/stores/:store_id/areas
// Create Area for client_id
router.post('/:client_id/stores/:store_id/areas',isLoggedIn,function(req,res) {
  BeaconClient.findById(req.params.client_id, function(err,client) {
    store = client.stores.id(req.params.store_id);
    store.areas.find({ minor_id: req.body.minor_id }, function(err, area){
      if (area) {
        console.log('ya existe un area con ese minor_id en este store :'+store.store_name);
      } else {
        store.areas.push({ area_name: req.body.area_name, minor_id: req.body.minor_id });
        store.save(function (err) {
          if (err) console.log('Error: '+err);
          else res.redirect('/clients/'+req.params.client_id);
        });
      }
    });
  });
});

// DELETE /clients/:client_id/stores/:store_id/areas/:area_id
// Delete area with area_id in client_id
router.delete('/:client_id/stores/:store_id/areas/:area_id',isLoggedIn,function(req,res) {
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
