var express = require('express');
var router = express.Router();
var Card = require('../models/card');
var tokenFactory = require('./../utils/index');
// 解析token
var userId;
var pageData = {
    totalNum:0,
    data:[],
    pageNum:0
}
router.use(function (req, res, next) {
    if (req.headers['token']) {
        userId = tokenFactory.decodeToken(req.headers['token']).payload.data.userId
    }
    next();
})
router.post('/add', function (req, res, next) {
    var card = new Card({
        userId:userId,
        name:req.body.name,
        desc:req.body.desc,
        commentNum:req.body.commentNum,
        watchNum:req.body.watchNum,
        progress:req.body.progress,
        status:req.body.status,
        bgImg:req.body.bgImg
    })
    card.save()
    res.json({code:4})
})
router.get('/getCards', function(req, res, next){
    let pageSize = parseInt(req.query.pageSize)
    let pageNum = parseInt(req.query.pageNum)
    Card.countDocuments({userId:userId}, function (err, countInfo) {
        pageData.pageNum = Math.floor(countInfo / 10)
        pageData.totalNum = countInfo
        return countInfo
    }).then(countInfo => {
        Card.aggregate([
            {$match:{userId:userId}},
            {$project:{
                _id:1,
                name:1,
                desc:1,
                commentNum:1,
                watchNum:1,
                progress:1,
                status:1,
                bgImg:1
            }},
            {
                $skip:(pageNum - 1) * pageSize
            },
            {
                $limit:pageSize
            }
        ]).then(query => {
            pageData.data = query
            res.json(pageData)
        })
        
    })
})
router.delete('/deleteCard', function(req, res, next){
    let id = req.query.id;
    Card.remove({_id:id}, function (err, deleteInfo){
        res.json()
    })
})
router.put('/editCard', function(req, res, next){
    console.log(req.body)
    Card.updateOne({_id:req.body._id},{$set:{'name':req.body.name,
        'desc':req.body.desc,
        'commentNum':req.body.commentNum,
        'watchNum':req.body.watchNum,
        'progress':req.body.progress,
        'status':req.body.status,
        'bgImg':req.body.bgImg}}, {upsert:true}, function(err, updateInfo){
            res.json()
        })
})
module.exports = router;