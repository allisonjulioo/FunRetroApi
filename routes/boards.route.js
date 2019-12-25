const express = require('express');
const app = express();
const router = express.Router();

const boards = require('../controllers/boards.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Get list boards
router.route('/api/boards/:user_id/')
.get(boards.GetBoards);

// Get board by id
router.route('/api/boards/:user_id/:board_id')
.get(boards.GetBoardsById);

// Create board
router.route('/api/boards/')
.post(urlencodedParser, boards.CreateBoards);

// Update board
router.route('/api/boards/:user_id/:board_id')
.patch(urlencodedParser, boards.UpdateBoard);

// Delete board
router.route('/api/boards/:user_id/:board_id')
.delete(urlencodedParser, boards.DeleteBoard);

/* Initil manipulation columns board */
module.exports = router;