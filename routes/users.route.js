var express = require('express');
var router = express.Router();
var users = require('../controllers/users.controller.js');

router.route('/api/users/')
.get(users.GetUsers);
module.exports = router;
