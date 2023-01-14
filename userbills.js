var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userbillsSchema = new Schema( {
      billStatus: String,
      email: String,
      submission_date: String,
      electricity_reading_Day: String,
      electricity_reading_Night: String,
      gas_reading: String

}),
userbills = mongoose.model('userbills', userbillsSchema);

module.exports = userbills;