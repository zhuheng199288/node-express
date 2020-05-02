var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    // 用户名
    userId:String,
    name:String,
    // 密码
    desc:String,
    commentNum:Number,
    watchNum:Number,
    progress:Number,
    status:Boolean,
    bgImg:String
})