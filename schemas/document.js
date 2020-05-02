let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    lables:String,
    title:String,
    url:String,
    version: Number,
    isTop:false,
    toTopTime:{
        type: Date,
        default: new Date().toLocaleString()
    },
    createTime: {
        type: Date,
        default: new Date().toLocaleString()
    },
    updateTime: {
        type: Date,
        default: new Date().toLocaleString()
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})