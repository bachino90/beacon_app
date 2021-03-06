var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require('mongoose-relationship');

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var mini = [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var maxi = [65535, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MAX}).'];
var uni = [true, 'Already exist'];


//=====================================//
//============ Area Model =============//
//=====================================//

var AreaSchema = new Schema({
	area_name: { type: String, required: 'Area name is required!'},
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	description: { type: String }
});

module.exports.Area = mongoose.model('Area', AreaSchema);

//=====================================//
//============ Store Model ============//
//=====================================//

var StoreSchema = new Schema({
	client: [{ type: Schema.Types.ObjectId, ref: "BeaconClient", childPath:'stores' }],
	store_name: { type: String, required: 'Store name is required!'},
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	areas: [AreaSchema],
	location: {
		latitude: {type: Number},
		longitude: {type: Number}
	}
});

StoreSchema.plugin(relationship, { relationshipPathName:'client' });

module.exports.Store = mongoose.model('Store', StoreSchema);

//=====================================//
//=========== Beacon Model ============//
//=====================================//

var BeaconContentSchema = new Schema ({
	image_url: { type: String },
	web_url: { type: String },
	text: { type: String }
});

module.exports.BeaconContent = mongoose.model('BeaconContent',BeaconContentSchema);

//=====================================//
//=========== Beacon Model ============//
//=====================================//

var BeaconSchema = new Schema({
	client_name: { type: String },
	client: [{ type: Schema.Types.ObjectId, ref: "BeaconClient", childPath:'beacons' }],
	uuid: { type: String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	store: {
		store_name: { type: String, required: 'Store name is required!'},
		major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
		location: {
			latitude: {type: Number},
			longitude: {type: Number}
		}
	},
	area: {
		area_name: { type: String, required: 'Area name is required!'},
		minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
		description: { type: String }
	},
	full_uuid: { type: String, unique: uni, uppercase:true},
  content: String
});

BeaconSchema.pre('save', function(next) {
	this.full_uuid = this.uuid + this.store.major_id + this.area.minor_id;
	next();
});

BeaconSchema.plugin(relationship, { relationshipPathName:'client' });

module.exports.Beacon = mongoose.model('Beacon', BeaconSchema);

//=====================================//
//======== Beacon Client Model ========//
//=====================================//

var BeaconClientSchema = new Schema({
	primary_uuid: { type:String, required: 'Primary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	secondary_uuid: { type:String, required: 'Secondary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	name: { type: String, unique: uni },
	stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
	areas: [AreaSchema],
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }]
});

module.exports.BeaconClient = mongoose.model('BeaconClient', BeaconClientSchema);
