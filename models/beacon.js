//===============================//
//======== Beacon Model =========//
//===============================//

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BeaconSchema = new Schema({
	uuid: String,
  major_id: { type: Number, min: 0, max: 65535 },
  minor_id: { type: Number, min: 0, max: 65535 },
  content: String
});

BeaconSchema.path('uuid').validate(function (value) {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
}, 'Invalid UUID format');

BeaconSchema.path('major_id').validate(function (value) {
	return (value<=65535 && value>=0);
}, 'The Major ID must be between 0 and 65535');

BeaconSchema.path('minor_id').validate(function (value) {
	return (value<=65535 && value>=0);
}, 'The Minor ID must be between 0 and 65535');

module.exports = mongoose.model('Beacon', BeaconSchema);
