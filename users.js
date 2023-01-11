var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
      name: String,
      email: String,
      password: String,
      address: String,
      propertyType: String,
      bedrooms: String,
      voucherCode: String,
      credits: Number,
      bills: Array,

}),
user = mongoose.model('user', userSchema);

module.exports = user;