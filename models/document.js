var mongoose = require('mongoose');
var document = require('../schemas/document');
module.exports = mongoose.model('Document', document)