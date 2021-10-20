var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-index', {title: "Admin Authentication"})
});

module.exports = router;
