var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    labels:String,
    title:String,
    commentNumber:Number,
    cardId:String,
    content:String,
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