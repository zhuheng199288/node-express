var tokenFactory = require('./utils/index')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var imgRouter = require('./routes/img');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
var app = express();

app.all("*", function(req, res, next) { //允许所有跨域请求
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,token');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static('public'));
//bodyparser设置
app.use( bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next){ // 关于最定义header跨域时客户端发送的options请求处理
  if (req.method.toLowerCase() == 'options') {
      res.sendStatus(200);  // 让options尝试请求快速结束
  } else {
      next();
  }
})
app.use(function(req, res, next){
  let routerList = ['/user','/config/configParams']
  let index = routerList.findIndex(el => req.url.indexOf(el) !== -1)
  if (index !== -1) {
    next()
  } else {
    if (tokenFactory.checkToken(req.headers['token'])) { // 没有过期
      next()
    } else {
      next(createError(401))
    }
  }
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/user', require('./routes/api'));
app.use('/card', require('./routes/card'));
app.use('/config', require('./routes/config'));
app.use('/articleList', require('./routes/articleList'));
app.use('/document', require('./routes/document'));
// app.use('/img',imgRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect('mongodb://localhost/blog')     //连接本地数据库blog 
var db = mongoose.connection;


// 连接成功
db.on('open', function(){
    console.log('数据库连接成功');
});
// 连接失败
db.on('error', function(){
    console.log('数据库连接失败');
});
module.exports = app;
