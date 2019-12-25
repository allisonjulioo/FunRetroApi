const card_db = require('../migration/cards.js')
const express = require('express')
const app = express()

exports.CreateCards = (req, res, next) => {
  const errors = []
  if (!req.body.content) {
    errors.push('No title specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  let data = {
    content: req.body.content,
    created_date: new Date().toISOString(),
    board_id: req.params.board_id,
    column_id: req.params.column_id,
    user_id: req.params.user_id
  }
  const sql = `INSERT INTO card (content, created_date, board_id, column_id, user_id) VALUES (?,?,?,?,?)`
  const params = [
    data.content,
    data.created_date,
    data.board_id,
    data.column_id,
    data.user_id
  ]
  card_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: data
    })
  })
}
exports.GetCards = (req, res, next) => {
  const sql = 'SELECT * FROM card WHERE board_id LIKE ? AND column_id LIKE ?;'
  const params = [req.params.board_id, req.params.column_id]
  return card_db.all(sql, params, (err, cards) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (cards) {
      res.json({
        message: 'success',
        total: cards.length,
        cards: cards
      })
    } else res.json({ error: 'No find cards by id:' + params[0] })
  })
}
exports.UpdateCard = (req, res, next) => {
  const sql = `UPDATE card set
        content = COALESCE(?,content)
        WHERE card_id = ?`
  const params = [
    req.body.content,
    req.params.card_id
  ]
  card_db.run(sql, params, (err, card) => {
    if (err) {
      res.status(400).json({ error: res.message })
      return
    }
    res.json({
      message: 'success',
      card: card,
      changes: this.changes
    })
  })
}
exports.DeleteCard = (req, res, next) => {
  card_db.run(
    'DELETE FROM card WHERE card_id = ?',
    req.params.card_id,
    (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message })
        return
      }
      res.json({ deleted: 'ok', changes: result })
    }
  )
}
