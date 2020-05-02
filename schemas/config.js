var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    key:String,
    userId:String,
    title: String,
    configs: String,
    routeName: String,
    jurisdiction: String,
    desc: String,
    fileList:Array
})