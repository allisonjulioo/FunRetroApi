const user_db = require('../migration/user.js')
const md5 = require('md5')
const express = require('express')
const app = express()

exports.GetUsers = (req, res, next) => {
  const sql = 'select * from user'
  const params = []
  return user_db.all(sql, params, (err, rows) => {
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
      data: rows,
      password: md5(rows[0].password)
    })
  })
}

exports.GetUserById = (req, res, next) => {
  const sql = 'select * from user where id_user = ?'
  const params = [req.params.id]
  user_db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (row)
      res.json({
        message: 'success',
        data: row
      })
    else res.json({ error: 'No find user by id:' + params })
  })
}
// Create user
exports.CreateUser = (req, res, next) => {
  const errors = []
  if (!req.body.password) {
    errors.push('No password specified')
  }
  if (!req.body.email) {
    errors.push('No email specified')
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') })
    return
  }
  let data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null
  }
  const sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  const params = [data.name, data.email, data.password]
  user_db.run(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    // Ao criar busca id do usuario criado
    const sql = 'select * from user where email = ?'
    const email = [req.body.email]
    user_db.get(sql, email, (err, row) =>
      res.json({
        isValid: true,
        message: data.name + ' cadastrado com sucesso',
        data: row
      })
    )
  })
}
// Update user
exports.UpdateUser = (req, res, next) => {
  let data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null
  }
  user_db.run(
    `UPDATE user set
        name = COALESCE(?,name),
        email = COALESCE(?,email),
        password = COALESCE(?,password)
        WHERE id_user = ?`,
    [data.name, data.email, data.password, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message })
        return
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes
      })
    }
  )
}
// Delete user
exports.DeleteUser = (req, res, next) => {
  user_db.run(
    'DELETE FROM user WHERE id_user = ?',
    req.params.id,
    (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message })
        return
      }
      res.json({ deleted: 'ok', changes: result })
    }
  )
}
