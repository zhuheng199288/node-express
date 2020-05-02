var mongoose = require('mongoose');
var users = require('../schemas/user');
module.exports = mongoose.model('Users', users)