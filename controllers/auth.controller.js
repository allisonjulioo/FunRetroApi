const board_db = require('../migration/board.js')
const express = require('express')
const app = express()
require('dotenv-safe').config()
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const user_db = require('../migration/user.js')

exports.Authenticate = (req, res, next) => {
  const sql = 'select * from user where email = ? AND password = ?'
  const params = [req.body.email, md5(req.body.password)]
  user_db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    if (row) {
      console.log(req.params.id_user)
      const id = req.params.id_user
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 3600 // expires in 1h
      })
      res.status(200).send({
        message: 'success',
        auth: true,
        id_user: row.id_user,
        name: row.name,
        token: token
      })
    } else {
      res.send({
        auth: false,
        message: 'Login ou senha incorretos'
      })
    }
  })
}

exports.Logout = (req, res) => {
  res.status(200).send({ auth: false, token: null })
}

exports.verifyJWT = (req, res, next) => {
  var token = req.headers['x-access-token']
  if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' })

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' })

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id
    next()
  })
}

/* Verificar se existe token na request

// Proxy request
app.get('/users', verifyJWT, (req, res, next) => {
  userServiceProxy(req, res, next);
})

app.get('/products', verifyJWT, (req, res, next) => {
  productsServiceProxy(req, res, next);
})
*/
