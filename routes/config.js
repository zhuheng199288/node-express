var express = require('express');
var router = express.Router();
var Config = require('../models/config');
var tokenFactory = require('./../utils/index');
var userId;
router.use(function (req, res, next) {
    if (req.headers['token']) {
        userId = tokenFactory.decodeToken(req.headers['token']).payload.data.userId
    }
    next();
})

router.post('/add', function (req, res, next) {
    console.log(req.body.key)
    let key = req.body.key;
    Config.findOne({ key: key }).then(function (configInfor) {
        console.log(configInfor)
        if (configInfor) {
            res.json({ code: 0, message: '配置已存在' })
            return;
        } else {
            var config = new Config({
                key: req.body.key,
                title: req.body.title,
                configs: req.body.configs,
                routeName: req.body.routeName,
                jurisdiction: req.body.jurisdiction,
                desc: req.body.desc,
                fileList: req.body.fileList
            });
            config.save();
            res.json({ code: 4, message: '创建成功！' });
        }
    })
   
})

router.get('/list',function(req, res, next) {
    Config.find({}).then(info => {
        res.json(info)
    })
})

router.get('/configParams/:anything', function (req, res, next) {
    let key = req.params.anything;
    Config.findOne({ key: key}).then(configInfo => {
        res.json(configInfo)
    })
})
module.exports = router;