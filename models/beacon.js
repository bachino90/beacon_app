//===============================//
//======== Beacon Model =========//
//===============================//

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

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
  content: String
});

BeaconSchema.pre('save', function(next) {
	this.full_uuid = this.uuid + this.major_id + this.minor_id;
	next();
});

/*
BeaconSchema.path('uuid').validate(function (value) {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
}, 'Invalid UUID format');

BeaconSchema.path('major_id').validate(function (value) {
	return (value<=65535 && value>=0);
}, 'The Major ID must be between 0 and 65535');

BeaconSchema.path('minor_id').validate(function (value) {
	return (value<=65535 && value>=0);
}, 'The Minor ID must be between 0 and 65535');
*/

module.exports = mongoose.model('Beacon', BeaconSchema);
