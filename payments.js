


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

pricesSchema = new Schema( {
    electricityDay: Number,
    electricityNight: Number,
    gas: Number

}),
prices = mongoose.model('prices', pricesSchema);

module.exports = prices;