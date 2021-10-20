const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/index', { title: 'Home User ' });
});
/* GET Login page. */
router.get('/login', function(req, res){
  res.render('users/login', { title: 'User Authentication'})
})
/* GET signup page. */
router.get('/signup', function(req, res){
  res.render('users/signup', { title: 'User Authentication'})
})

router.post('/login', function(req, res) {
  res.redirect("/");
  console.log(req.body.uname)
})
router.post('/post', function(req, res) {
  res.redirect("/");
  console.log(req.body.uname)
})
module.exports = router;
