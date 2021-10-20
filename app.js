const createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin');
var db = require("./config/connection")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
db.connect((err)=>{
  if(err) console.log("DB Connection Error :\n" +err)
  else console.log("DB Connected")
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs({
  extname: 'hbs', defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts/')
}));

app.use('/', indexRouter);
app.use('/admin', usersRouter);

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
