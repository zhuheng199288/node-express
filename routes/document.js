var express = require('express');
var router = express.Router();
var Document = require('../models/document');

router.get('/documentList',function(req, res, next){
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
            $and: [
                {
                    'cardId': req.query.cardId
                }
            ]
        }

    Document.countDocuments({ cardId: req.query.cardId }, function (err, countInfo) {
        pageData.pageNum = Math.floor(countInfo / 10)
        pageData.totalNum = countInfo
        Document.find(filter).sort({ "toTopTime": -1 }).limit(pageSize).skip((pageNum - 1) * pageSize).exec(function (err, doc) {
            pageData.data = doc;
            res.json(pageData)
        })
    })
})
router.post('/add', function (req, res, next) { 
    let document = new Document(req.body);
    Document.findOne({ title: req.body.title}).then(info => {
        if (info) {
            res.json({
                code:4,
                message:'资源已存在'
            })
            return;
        } else {
            document.save(document, function(err, saveInfo){
                console.log(err,saveInfo)
                res.json({
                    code: 0,
                    message: '保存成功'
                })
            })
        }
    })
})
router.post('/update', function (req, res, next) {
    Document.findByIdAndUpdate(req.body.id, req.body).then(info => {
        res.json()
    })
})
router.delete('/delete', function (req, res, next) { 
    Document.findByIdAndRemove(req.body.id).then(info => {
        res.json()
    })
})
router.post('/toTop', function (req, res, next) {
    Document.findById(req.body.id).then(info => {
        let createTime = info.createTime;
        if (req.body.status === '1') { // 置顶
            Document.findByIdAndUpdate(req.body.id, {
                toTopTime: new Date().toLocaleString()
            }).then(updateInfo => {
                res.json();
                return
            })
        } else {
            Document.findByIdAndUpdate(req.body.id, {
                toTopTime: createTime
            }).then(updateInfo => {
                res.json();
                return
            })
        }
    })
})
module.exports = router;