const column_db = require('../migration/columns.js')
const express = require('express')
const app = express()

exports.GetColumns = (req, res, next) => {
  const sql = 'SELECT * FROM column WHERE user_id LIKE ? AND board_id LIKE ?;'
  const params = [req.params.user_id, req.params.board_id]
  return column_db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (row) {
      row.forEach(row => {
        Object.assign(row, { cards: [{id: row.user_id, data: 'Card exemplo'}] })
      });
      res.json({
        message: 'success',
        total: row.length,
        columns: row
      })
    } else res.json({ error: 'No find columns by id:' + params[0] })
  })
}

exports.CreateColumn = (req, res, next) => {
  const errors = []
  if (!req.body.title) {
    errors.push('No title specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  let data = {
    title: req.body.title,
    color: req.body.color,
    user_id: req.params.user_id,
    board_id: req.params.user_id
  }
  const sql = `INSERT INTO column (title, color, user_id, board_id) VALUES (?,?,?,?)`
  const params = [data.title, data.color, data.user_id, data.board_id]
  column_db.run(sql, params, (err, result) => {
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
