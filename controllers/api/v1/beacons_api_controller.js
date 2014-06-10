//===============================//
//==== Beacon API Controller ====//
//===============================//

var express  = require('express');
var router   = express.Router();
var Beacon   = require('../../../models/beacon');

router.get('/', function(req, res, next) {
    Beacon.find(function(err, beacons) {
			if (err)
				res.send(err);

			res.json(beacons);
		});
});

router.post('/',function(req, res) {

    var beacon = new Beacon(); 		// create a new instance of the Beacon model
    beacon.uuid = req.body.uuid;
    beacon.mayor_id = req.body.mayor_id;
    beacon.minor_id = req.body.minor_id;
    beacon.content = req.body.content;

    // save the Beacon and check for errors
    beacon.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Beacon created!' });
    });

});

router.get('/:beacon_id',function(req, res) {
		Beacon.findById(req.params.beacon_id, function(err, beacon) {
			if (err)
				res.send(err);
			res.json(beacon);
		});
});

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

				res.json({ message: 'Beacon updated!' });
			});

		});
});

router.delete('/:beacon_id',function(req, res) {
		Beacon.remove({
			_id: req.params.beacon_id
		}, function(err, beacon_id) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
});

module.exports = router;
