const express = require('express');
const app = express();
const router = express.Router();

const cards = require('../controllers/cards.controller.js');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

/* Get list cards */
router.route('/api/cards/:board_id/:column_id/')
.get(cards.GetCards);

/* Create cards */
router.route('/api/cards/:board_id/:column_id/:user_id/')
.post(urlencodedParser, cards.CreateCards);

/* Update card */
router.route('/api/cards/:card_id/')
.patch(urlencodedParser, cards.UpdateCard);

/* Delete card */
router.route('/api/cards/:card_id/')
.delete(cards.DeleteCard);

module.exports = router;