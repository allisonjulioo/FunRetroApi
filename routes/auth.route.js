const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../controllers/auth.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// auth
router.route('/api/auth/')
.post(urlencodedParser, auth.Authenticate);

module.exports = router;