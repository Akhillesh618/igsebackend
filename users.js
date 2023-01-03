var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
      name: String,
      email: String,
      password: String,
      address: String,
      propertyType: String,
      bedrooms: String,
      voucherCode: String

}),
user = mongoose.model('user', userSchema);

module.exports = user;