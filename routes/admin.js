var express = require('express');
var router = express.Router();
const adminAction = require("../controllers/adminAction");

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-index', {title: "Admin Panel"})
});

router.get('/login', function(req, res, next) {
  res.render('admin/admin-login', {title: "Admin Authentication"})
});
router.post('/login', function(req, res, next) {
 
});

module.exports = router;
