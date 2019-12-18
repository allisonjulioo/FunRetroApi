var express = require('express');
var router = express.Router();
var users = require('../controllers/users.controller.js');

router.route('/api/users/')
.get(users.GetUsers);
router.route('/api/user/:id')
.get(users.GetUserById);
router.route('/api/user/')
.post(users.CreateUser);



module.exports = router;
