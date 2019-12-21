const board_db = require('../migration/board.js')
const express = require('express')
const app = express()
require('dotenv-safe').config()
const jwt = require('jsonwebtoken')

exports.Authenticate = (req, res, next) => {
  if (req.body.name === 'luiz' && req.body.password === '123') {
    //auth ok
    const id = 1 //esse id viria do banco de dados
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 3600 // expires in 1h
    })
    res.status(200).send({ auth: true, token: token })
  }

  res.status(500).send('Login inválido!')
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
