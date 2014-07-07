//===============================//
//===== Beacon Client Model =====//
//===============================//

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var uni = [true, 'Already exist'];

var BeaconClientSchema = new Schema({
  primary_uuid: { type:String, required: 'Primary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
  secondary_uuid: { type:String, uppercase: true },
  name: { type: String, unique: uni, uppercase:true},
  locals: [major_id:Number, local_name:String],
  areas: [minor_id:Number, area_name:String]
});

module.exports = mongoose.model('BeaconClient', BeaconClientSchema);
