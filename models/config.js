var mongoose = require('mongoose');
var config = require('../schemas/config');
module.exports = mongoose.model('Config', config)