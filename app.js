var createError = require('http-errors');
var express = require('express');
var path = require('path');

const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')

const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//needs to be added, app LINES: 
app.use(bodyParser.urlencoded({ extended: true })), 
app.use(cookieSession({
  keys: ['fn13alksfa92sdf3s8lkn54lnlf302ur0f023hhfo']
})), 

// app.use(logger("dev"));
// app.use(express.json());
// app.use(cors())
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/',authRouter)
app.use('/',productsRouter)
app.use('/',adminProductsRouter)
app.use('/',cartsRouter)
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
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

module.exports = app;
