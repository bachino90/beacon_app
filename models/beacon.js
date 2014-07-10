//===============================//
//======== Beacon Model =========//
//===============================//

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require('mongoose-relationship');

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var mini = [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var maxi = [65535, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MAX}).'];
var uni = [true, 'Already exist'];

var BeaconSchema = new Schema({
	uuid: { type:String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
  major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
  minor_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	full_uuid: { type: String, unique: uni, uppercase:true},
	content_url: String,
  content: String,
	client_name: { type:String },
	client: [{ type: Schema.Types.ObjectId, ref: "BeaconClient", childPath:'beacons' }]
});

BeaconSchema.pre('save', function(next) {
	this.full_uuid = this.uuid + this.major_id + this.minor_id;
	next();
});

BeaconSchema.plugin(relationship, { relationshipPathName:'client' });

module.exports.Beacon = mongoose.model('Beacon', BeaconSchema);

//===============================//
//========= Store Model =========//
//===============================//

var StoreSchema = new Schema({
	store_name: { type:String, required: 'Name is required!'},
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' }
});

module.exports.Store = mongoose.model('Store', StoreSchema);

//===============================//
//========= Area Model ==========//
//===============================//

var AreaSchema = new Schema({
	area_name: { type:String, required: 'Name is required!'},
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' }
});

module.exports.Area = mongoose.model('Area', AreaSchema);

//===============================//
//===== Beacon Client Model =====//
//===============================//

var BeaconClientSchema = new Schema({
	primary_uuid: { type:String, required: 'Primary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	secondary_uuid: { type:String, required: 'Secondary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	name: { type: String, unique: uni },
	stores: [StoreSchema],
	areas: [AreaSchema],
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }]
});

module.exports.BeaconClient = mongoose.model('BeaconClient', BeaconClientSchema);
