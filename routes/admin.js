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
router.get('/signup', function(req, res, next) {
  if(req.session.adminLoggedIn) {
    res.redirect("/admin");
  }
    else {
     res.render("admin/admin-login")
    }
  
});
router.post('/login', function(req, res, next) {
  adminAction.login(req.body).then((response)=>{
    console.log(response.err.status)
    if(!response.err.status) {
      req.session.admin=response.admin
      req.session.admin   .password=null
      req.session.adminLoggedIn=true
      req.session.admin.password=null;
      res.redirect("/admin")
    }
    else {
      res.render("admin/admin-login", {err:response.err})
    }

  })
});
// Edit users
router.get("/edit-user/:id", verifyLogin, async function(req, res){
  let user = await adminAction.getUser(req.params.id);
  let admin = req.session.admin;
  res.render("admin/admin-userEdit", {user, admin})
});
router.post("/edit-user/:id", function(req, res){
  adminAction.updateUser(req.params.id, req.body).then(()=>{
    res.redirect("/admin");  
  });
 
})
// Block User
router.post("/block-user",  function(req, res){
  adminAction.blocKUser(req.body.id).then((status)=>{
    adminAction.logoutOneUser(req.body.id)
    res.json({status:true})
  })
})
// Unblock User
router.post("/unblock-user/",  function(req, res){
  adminAction.unBlocKUser(req.body.id).then((status)=>{
    res.json({status:true})
  })
})
// Add User
router.get("/add-user/",verifyLogin, function(req, res){
  res.render("admin/add-user");
})
router.post("/add-user/",async function(req, res){
  await adminAction.addNewUser(req.body).then((response)=>{
    if(response) res.redirect("/admin")
    res.render("admin/add-user", {err: "Counld not add new user"})
  });
})

// View individual user
router.get("/user-view/:id", verifyLogin,async function(req, res){
  let id = req.params.id;
  let user =await adminAction.getUser(id)
  res.render("admin/user-view", user)
})

// Update user password
router.post("/user-view/:id",verifyLogin, function(req, res){
  let id = req.params.id
  adminAction.updateUserPassword(id, req.body).then(()=>{
    res.redirect("/admin")
  })
})

// Delete User
router.post("/delete-user/",verifyLogin,  function(req, res){
  adminAction.deleteUser(req.body.id).then((status)=>{
    adminAction.logoutOneUser(req.body.id)
    res.json({status:true})
  })
})
// logout single user
router.get("/logout-current-host-user", function(req, res){
  req.session.userLoggedIn=false;
  req.session.user=null;
  res.redirect("/admin")
});
// logout All users
router.get("/logout-all", verifyLogin, function(req, res){
  let id = req.session.admin._id.toString();
 adminAction.allUserLogout(id).then((result)=>{
   if(result) res.redirect("/admin")
 })
});
// logout one particular user
router.get("/logout-one/:id", function(req, res){
  let id = req.params.id;
 adminAction.logoutOneUser(id).then((result)=>{
   if(result) res.redirect("/admin")
   res.redirect("/user-view/:"+id)
 })
});
// Logout Admin
router.get('/logout', (req, res)=> {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/login')
})
module.exports = router;
