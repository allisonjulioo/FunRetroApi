const board_db = require('../migration/board.js')
const column_db = require('../migration/columns.js')
const express = require('express')
const app = express()

exports.GetBoards = (req, res, next) => {
  const sql = 'SELECT * FROM board WHERE user_id = ?'
  const params = [req.params.user_id]

  return board_db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (row)
      res.json({
        message: 'success',
        total: row.length,
        boards: row
      })
    else res.json({ error: 'No find board by id:' + params })
  })
}
exports.GetBoardsById = (req, res, next) => {
  const sql = 'SELECT * FROM board WHERE user_id LIKE ? AND board_id LIKE ?;'
  const sqlColumn =
    'SELECT * FROM column WHERE user_id LIKE ? AND board_id LIKE ?;'
  const params = [req.params.user_id, req.params.board_id]
  board_db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (row)
      return column_db.all(sqlColumn, params, (err, columns) => {
        if (columns) {
          columns.forEach((column, index) => {
            Object.assign(columns[index], {
              cards: new getCards(column.user_id, column.board_id).then(cards => cards)
            })
          })
          res.json({
            message: 'success',
            total: row.length,
            board: row,
            columns: columns
          })
        }
      })
    else res.json({ error: 'No find board by id:' + params[0] })
  })
  var data = [];
  function getCards (user_id, board_id) {
    return new Promise(resolve => {
      column_db.all(
        'SELECT * FROM column WHERE user_id LIKE ? AND board_id LIKE ?;',
        [user_id, board_id],
        (err, rows) => {
          if (err) {
            return console.error(err.message)
          }
          rows.forEach(row => {
            data.push(row)
          })
          resolve(data)
        }
      )
    })
  }
}

// Create board
exports.CreateBoards = (req, res, next) => {
  const errors = []
  if (!req.body.title) {
    errors.push('No title specified')
  }
  if (!req.body.limit_votes) {
    errors.push('No limite votes specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  let data = {
    title: req.body.title,
    created_date: new Date().toISOString(),
    limit_votes: req.body.limit_votes,
    in_voting:  req.body.in_voting || false,
    user_id: req.body.user_id
  }
  console.log(data.created_date)
  const sql = `INSERT INTO board (
    title,
    created_date,
    limit_votes,
    in_voting,
    user_id
  )
  VALUES (?,?,?,?,?)`
  const params = [
    data.title,
    data.created_date,
    data.limit_votes,
    data.in_voting,
    data.user_id
  ]
  board_db.run(sql, params, (err, result) => {
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

// Update board
exports.UpdateBoard = (req, res, next) => {
  const user_id = req.params.board_id
  let data = {
    title: req.body.title,
    created_date: new Date().toISOString(),
    limit_votes: req.body.limit_votes,
    in_voting:  req.body.in_voting || false,
    user_id: req.body.user_id
  }
  const sql = `UPDATE board SET
        title = COALESCE(?,title),
        created_date = COALESCE(?,created_date),
        limit_votes = COALESCE(?,limit_votes),
        in_voting = COALESCE(?,in_voting),
        user_id = COALESCE(?,user_id)
        WHERE user_id = ? AND board_id = ?`
  const params = [
    data.title,
    data.created_date,
    data.limit_votes,
    data.in_voting,
    data.user_id,
    req.params.user_id,
    req.params.board_id
  ]
  board_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message })
      return
    }
    res.json({
      message: 'success',
      data: data,
      changes: this.changes
    })
  })
}
// Delete board
exports.DeleteBoard = (req, res, next) => {
  const sql = 'DELETE FROM board WHERE user_id = ? AND board_id = ?'
  const params = [req.params.user_id, req.params.board_id]
  board_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message })
      return
    }
    res.json({ deleted: 'ok', changes: result })
  })
}
