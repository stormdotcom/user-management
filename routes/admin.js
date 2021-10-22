const express = require('express');
const router = express.Router();
const adminAction = require("../controllers/adminAction");
const db = require("../config/connection");


// Router Middleware
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}
/* GET admin . */
router.get('/',verifyLogin,  async function(req, res, next) {
  let admin = req.session.admin
  let userArray =await db.get().collection("users").find().toArray();
  let users = userArray.filter(each => !each?.isAdmin);

  res.render('admin/admin-index', {title: "Admin Panel", users, admin})
});

router.get('/login', function(req, res, next) {
  if(req.session.adminLoggedIn) {
    res.redirect("/admin");
  }
    else {
     res.render("admin/admin-login")
    }
  
});
router.post('/login', function(req, res, next) {
  adminAction.login(req.body).then((admin)=>{
    if(admin) {
      req.session.admin=admin
      req.session.adminLoggedIn=true
      req.session.admin.password=null;
      res.redirect("/admin")
    }
    else {
      res.redirect("/admin/login")
    }

  })
});
// Edit users
router.get("/edit-user/:id", async function(req, res){
  let user = await adminAction.getUser(req.params.id)
  res.render("admin/admin-userEdit", {user})
});
router.post("/edit-user/:id", function(req, res){
  adminAction.updateUser(req.params.id, req.body).then(()=>{
    res.redirect("/admin");  
  });
 
})
// Block User
router.post("/block-user",  function(req, res){
  adminAction.blocKUser(req.body.id).then((status)=>{
    res.json({status:true})
  })
})
// Unblock User
router.post("/unblock-user/",  function(req, res){
  adminAction.unBlocKUser(req.body.id).then((status)=>{
    res.json({status:true})
  })
})

router.get("/user-view/:id",async function(req, res){
  let id = req.params.id;
  id=id.trim()
  console.log("test", id)
  let user =await adminAction.getUser(id)
  res.render("admin/user-view", user)
})



// Delete User
router.post("/delete-user/",  function(req, res){
  adminAction.deleteUser(req.body.id).then((status)=>{
    res.json({status:true})
  })
})
// logout single user
router.get("/logout-user", function(req, res){
  req.session.user.userLoggedIn=false;
  req.session.user=null;
  res.redirect("/admin")
});
router.get("/logout-all", function(req, res){
 adminAction.allUserLogout(req.session.admin)
  res.redirect("/admin")
});

router.get('/logout', (req, res)=> {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/login')
})
module.exports = router;
