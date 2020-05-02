var mongoose = require('mongoose');
var card = require('../schemas/card');
module.exports = mongoose.model('Card', card)