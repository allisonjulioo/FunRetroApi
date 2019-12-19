var express = require('express');
var app = express();
var router = express.Router();
var users = require('../controllers/users.controller.js');
var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})

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
