const express = require('express');
const app = express();
const router = express.Router();


const columns = require('../controllers/columns.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Get list columns
router.route('/api/columns/:user_id/:board_id')
.get(columns.GetColumns);

// Create board
router.route('/api/columns/:user_id/:board_id')
.post(urlencodedParser, columns.CreateColumn);

// Get column by id
//router.route('/api/columns/:user_id/:column_id')
//.get(columns.GetColumnsById);

module.exports = router;