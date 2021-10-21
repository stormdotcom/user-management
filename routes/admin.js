const express = require('express');
const router = express.Router();
const db = require("../config/connection")
const adminAction = require("../controllers/adminAction");


// Router Middleware
const verifyLogin = (req, res, next) => {
  if (req.session.admin.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
/* GET admin listing. */
router.get('/',verifyLogin,  async function(req, res, next) {
  let users =await db.get().collection("users").find()

  res.render('admin/admin-index', {title: "Admin Panel", users})
});

router.get('/login', function(req, res, next) {
  if(req.session.admin) {
    res.redirect("/");}
    else{
      res.render('admin/admin-login', {title: "Admin Authentication"}); 
    }
  
});
router.post('/login', function(req, res, next) {
  adminAction.Login(req.body).then((admin)=>{
    req.sesssion.admin=admin
    req.session.admin.loggedIn=true;
    req.session.admin.password=null;
    res.render("/")
  })
});
}
module.exports = router;
