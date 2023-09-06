const mongoose = require("mongoose")
const randomstring = require("randomstring");

const basicCurrencySchema = new mongoose.Schema({
    symbol: {type: String, default: ''},
    name: {type: String, default: ''},
    symbol_native: {type: String, default: ''},
    decimal_digits: {type: Number, default: 0},
    rounding: {type: Number, default: 0 },
    name_plural: {type: String, default: ''}
})

const basicCurrencyModel = mongoose.model('basicCurrencies', basicCurrencySchema);
module.exports = basicCurrencyModel