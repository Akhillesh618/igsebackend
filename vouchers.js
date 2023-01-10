var mongoose = require('mongoose');
var Schema = mongoose.Schema;

vouchersSchema = new Schema( {
      voucherCode: String,
      detailsOfVoucher: String,

}),
vouchers = mongoose.model('vouchers', vouchersSchema);

module.exports = vouchers;