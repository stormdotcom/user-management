const express = require('express');
const router = express.Router();
const userAction = require("../controllers/userAction");
const adminAction = require("../controllers/adminAction");
const db = require("../config/connection");

const verifyLogin = async(req, res, next) => {
  if (req.session.userLoggedIn) {
    let id =req.session?.user?._id;
    let user = await adminAction.getUser(id);
    if(user){
       if(!user.isBlocked) {
        next();
       }
       else {
        req.session.userLoggedIn=false
        res.redirect("/login")
       }

    }
    else {
      req.session.userLoggedIn=false
      res.redirect("/login")
    }

  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get('/', verifyLogin, async function(req, res, next) {
    let id =req.session?.user?._id;
    let user = await adminAction.getUser(id);
      res.render('users/index', { title: 'Home  | ' +user.name , user });

});
/* GET Login page. */
router.get('/login', function(req, res){
  if(req.session.userLoggedIn){
    res.redirect("/")
  }
  else res.render('users/login', { title: 'User Authentication'})
  
  
})
/* GET signup page. */
router.get('/signup', function(req, res){
  if(req.session.userLoggedIn){
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
  req.session.userLoggedIn=false;
  req.session.user=null;
  res.redirect("/login")
})
module.exports = router;
