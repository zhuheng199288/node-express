var express = require('express');
var router = express.Router();
var Article = require('../models/articleList');

router.post('/add', function(req, res, next){
    let article = new Article({
        labels: req.body.labels,
        title: req.body.title,
        commentNumber: req.body.commentNumber,
        cardId: req.body.cardId,
    })
    article.save(article, function(err, saveInfo) {
        res.json()
    })
})

router.get('/allList', function (req, res, next) {
    var pageData = {
        totalNum: 0,
        data: [],
        pageNum: 0
    }
    let pageSize = parseInt(req.query.pageSize) || 10
    let pageNum = parseInt(req.query.pageNum) || 1
    let startTime = req.query.startTime;
    let endTime = req.query.endTime
    let key = req.query.key || ''
    let filter = startTime && endTime ? {
        $or: [
            { title: { $regex: key, $options: '$i' } },
        ],
        $and: [
        {
            'cardId': req.query.cardId
        },
        {
            "createTime": {
                "$gt": startTime
            }
        }, {
            "createTime": {
                "$lt": endTime
            }
        }]
    } : {
            $or: [
                { title: { $regex: key, $options: '$i' } }
            ],
            $and:[
                {
                    'cardId': req.query.cardId
                }
            ]
        }
    
    Article.countDocuments({ cardId: req.query.cardId}, function (err, countInfo) {
        pageData.pageNum = Math.floor(countInfo / 10)
        pageData.totalNum = countInfo
        Article.find(filter).sort({ "createTime": -1 }).limit(pageSize).skip((pageNum - 1) * pageSize).exec(function (err, doc) {
            pageData.data = doc;
            res.json(pageData)
        })
    })
})

router.post('/update', function(req, res, next){
    if (req.body.commentNumber) {
        req.body.commentNumber = parseInt(req.body.commentNumber)
    }
    let setData = Object.assign({ updateTime: new Date().toLocaleString()},req.body)
    Article.updateOne({ _id: req.body._id }, {
        $set: setData
    }, function (err, updateInfo) {
        res.json()
    })
})


router.delete('/deleteArticle', function(req, res, next){
    Article.remove({ _id: req.query._id }, function (userinfo) {
        console.log(userinfo)
        res.json({
            message: '删除成功'
        })
    })
})

router.get('/getContent', function(req, res, next){
    Article.findOne({ _id: req.query._id }).then(contentInfo => {
        res.json(contentInfo.content)
    })
})
module.exports = router;