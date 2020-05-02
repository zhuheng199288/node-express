var tokenFactory = require('./../utils/index')
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var User = require('../models/user');
let path = require('path');
var svgCaptcha=require('svg-captcha');
// 统一返回格式
var responseData;

router.use(function (res, req, next) {
    responseData = {
        code: 0,
        message:''
    }
    next();
})

// 用户注册
router.post('/register',function (req, res, next) {
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    var account = req.body.account;
    console.log(new Date().toLocaleString())
    User.findOne({
        userName: userName
    }).then(function( userInfo ) {
        if ( userInfo ) {
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            userName: userName,
            passWord: passWord,
            account:account,
            headPortrait:''
        });
        return user.save();
    }).then(function(newUserInfo) {
        console.log(newUserInfo)
        responseData.message = '注册成功';
        res.json(responseData);
    });
})

// 用户登录
router.post('/login', function(req, res, next) {
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    User.findOne({userName: userName}).then(function(userinfo){
        if (userinfo && userinfo.passWord === passWord ) {
            let data = {
                userId:userinfo._id
            }
            let token = tokenFactory.createToken(data,60*60*12)
            responseData.code = 4;
            responseData.message = '登陆成功';
            responseData.token = token
            responseData.userName = userinfo.account
            responseData.headPortrait = userinfo.headPortrait
        } else {
            responseData.code = 0;
            responseData.message = '账号密码错误';
        }
        res.json(responseData)
    })
})

// 图片上传
router.post('/upload',function(req, res, next){
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '../public/images/');
    form.parse(req, (err, fields ,files) => {
        if(err) return next(err)
        let imgPath = 'http://localhost:3000/public/images/upload_' + files.file.path.split('upload_')[1];
        let imgName = files.file.name;
        res.json({code: 1, data: { name: imgName, path: imgPath }});
    })
})

// 生成验证码
router.get('/captcha', function(req, res){
    var captcha = svgCaptcha.create({width:172,height:40});
    res.status(200).send(captcha.data);
})

// 获取所有用户
router.get('/getAllUsers', function(req, res, next){
    var pageData = {
        totalNum: 0,
        data: [],
        pageNum: 0
    }
    let pageSize = parseInt(req.query.pageSize)
    let pageNum = parseInt(req.query.pageNum)
    let startTime = req.query.startTime;
    let endTime = req.query.endTime
    let filter = startTime && endTime ? {
        $or: [
            { account: { $regex: req.query.key, $options: '$i' } },
            { userName: { $regex: req.query.key, $options: '$i' } }
        ],
        $and: [{
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
            { account: { $regex: req.query.key, $options: '$i' } },
            { userName: { $regex: req.query.key, $options: '$i' } }
        ]
    }
    User.countDocuments(filter, function(err, countInfo){
        pageData.pageNum = Math.floor(countInfo / 10)
        pageData.totalNum = countInfo
        User.find(filter).sort({ "createTime": -1 }).limit(pageSize).skip((pageNum - 1) * pageSize).exec(function(err, doc){
            pageData.data = doc;
            res.json(pageData)
        })
    })
})

// 删除账户
router.delete('/deleteUser', function(req, res, next){
    User.remove({ _id: req.query._id}, function(userinfo){
        console.log(userinfo)
        res.json({
            message:'删除成功'
        })
    })
})

// 新增账号
router.post('/add', function(req, res, next) {
    User.findOne({userName:req.body.userName}).then(userInfo => {
        if (userInfo) {
            res.json({code:0,message:'账号已存在'})
            return;
        } else {
            let user = new User({
                userName: req.body.userName,
                // 密码
                passWord: req.body.passWord,
                account: req.body.account,
                headPortrait: req.body.headPortrait,  
            })
            return user.save()
        }
    }).then(saveUserInfo => {
        console.log(saveUserInfo)
        res.json()
    })
})

// 编辑账号
router.post('/userEdit', function(req, res, next){
    User.updateOne({ userName: req.body.userName }, { $set:{
        userName: req.body.userName,
        passWord: req.body.passWord,
        account: req.body.account,
        headPortrait: req.body.headPortrait,  
    }}, function(err, updateInfo){
        res.json()
    })
})
module.exports = router;
