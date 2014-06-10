//===============================//
//========= User Model ==========//
//===============================//

var mongoose     = require('mongoose');
var bcrypt       = require('bcrypt-nodejs');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
