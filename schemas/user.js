var mongoose = require('mongoose');

// 用户的表结构
module.exports = new mongoose.Schema({
    // 用户名
    userName:String,
    // 密码
    passWord:String,
    account:String,
    headPortrait:String,
    createTime:{
        type:Date,
        default: new Date().toLocaleString()
    },
    updateTime: {
        type: Date,
        default: new Date().toLocaleString()
    }
},{
    versionKey:false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime'}
})