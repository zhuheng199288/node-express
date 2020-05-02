var mongoose = require('mongoose');
var articleList = require('../schemas/articleList');
module.exports = mongoose.model('ArticleList', articleList)