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
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/user-management",
  collection: 'Sessions'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// DB connections
db.connect((err)=>{
  if(err) console.log("DB Connection Error :\n" +err)
  else console.log("DB Connected")
})
app.use(session({
  secret: "ajmal",
  store: store,
  resave: true,
  saveUninitialized: true, 
  cookie: {
    maxAge: 3600000 
  }
      }))

if(!process.env.NODE_ENV==="production"){
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  const error = new Error("Ohoh Not found!")
  error.status=404
  next(error)
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
// TODOs
// Clean code make make code consistent
// Logout session bug fixes, while deleting user
// admin can logout one particular user
// User Side edit profiles
module.exports = app;
