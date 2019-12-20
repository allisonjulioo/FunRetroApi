const express = require('express');
const app = express();
const router = express.Router();
const users = require('../controllers/users.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Get list users
router.route('/api/users/')
.get(users.GetUsers);

// Get user by id
router.route('/api/users/:id')
.get(users.GetUserById);

// Create user
router.route('/api/users/')
.post(urlencodedParser, users.CreateUser);

// Update user
router.route('/api/users/:id')
.patch(urlencodedParser, users.UpdateUser);

// Delete user
router.route('/api/users/:id')
.delete(urlencodedParser, users.DeleteUser);

module.exports = router;
