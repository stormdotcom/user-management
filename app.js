const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars')
const session = require('express-session')
const userRouter = require('./routes/users');
const adminRouter = require("./routes/admin")
const db = require("./config/connection");
const app = express();
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
db.connect((err)=>{
  if(err) console.log("DB Connection Error :\n" +err)
  else console.log("DB Connected")
})
app.use(session({
  secret: "ajmal",
  // store: store,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 3600000 
  }
      }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs({
  extname: 'hbs', defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts/',
  ), handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
