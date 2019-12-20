const express = require('express');
const app = express();
const router = express.Router();

const retros = require('../controllers/retros.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Get list retros
router.route('/api/retros/')
.get(retros.GetRetros);

// Create user
router.route('/api/retros/')
.post(urlencodedParser, retros.CreateRetros);

module.exports = router;