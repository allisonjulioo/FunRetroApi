const retro_db = require('../migration/retro.js')
const express = require('express')
const app = express()

exports.GetRetros = (req, res, next) => {
  var sql = 'select * from retro'
  var params = []
  return retro_db.all(sql, params, (err, rows) => {
      console.log(rows);
    if (err) {
      res.status(400).json({
        message: 'error',
        error: err.message
      })
      return
    }
    res.json({
      message: 'success',
      total: rows.length,
      data: rows
    })
  })
};
// Create retro
exports.CreateRetros = (req, res, next) => {
  const errors = []
  if (!req.body.title) {
    errors.push('No title specified')
  }
  if (!req.body.user_id) {
    errors.push('No user id specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  let data = {
    title: req.body.title,
    created_date: new Date(),
    user_id: req.body.user_id,
  }
  const sql = 'INSERT INTO retro (title, created_date, user_id) VALUES (?,?,?)'
  const params = [data.title, data.created_date, data.user_id]
  retro_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    })
  })
}
