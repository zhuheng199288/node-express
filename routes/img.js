var express = require('express');
var router = express.Router();
var formidable = require('formidable');
router.use(function (req, res, next) {
    console.log(req)
    next();
})
router.post('/upload',function(req, res, next){
    // console.log(req)
    var form = new formidable.IncomingForm();
    // console.log('about to parse');
    // form.parse(req, function(error, fields, files){
    //     console.log('parse done')
    //     console.log(files.upload.path);
    //     fs.writeFileSync('public/test.png', fs.readFileSync(files.upload.path));
    // })
})
module.exports = router;