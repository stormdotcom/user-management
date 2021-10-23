const express = require('express');
const router = express.Router();
const userAction = require("../controllers/userAction");

const verifyLogin = (req, res, next) => {
  if (req.session?.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};
/* GET home page. */
router.get('/', verifyLogin, function(req, res, next) {
    let user = req.session.user
    res.render('users/index', { title: 'Home  | ' +user.name , user });
});
/* GET Login page. */
router.get('/login', function(req, res){
  if(req.session.user){
    res.redirect("/")
  }
  else res.render('users/login', { title: 'User Authentication'})
  
  
})
/* GET signup page. */
router.get('/signup', function(req, res){
  if(req.session.user){
    res.redirect("/")
  }
  res.render('users/signup', { title: 'User Registration'})
})

// Handle Signup
router.post('/signup', function(req, res) {
  userAction.signup(req.body).then((response)=>{
    if(!response?.err?.status) {
      req.session.user=response;
      req.session.user.password=null;
      req.session.userLoggedIn=true
      res.redirect("/")
    }
    else {
      res.render("users/signup", {err:response.err})
    }
  })
});

// Handle login
router.post('/login', function(req, res){
    userAction.login(req.body).then((response)=>{
      console.log(response.err.status)
      if(!response.err.status) {
        req.session.user=response.user
        req.session.user.password=null
        req.session.userLoggedIn=true
        res.redirect("/")
      }
      else {
        res.render("users/login", {err:response.err})
      }

  
    })
    
  });

router.get("/logout", function(req, res){
  req.session.user.userLoggedIn=false;
  req.session.user=null;
  res.redirect("/login")
})
module.exports = router;
