const express = require('express')
const app = express()
const user_routes = require('./routes/users.route')
const board_routes = require('./routes/boards.route')
const column_routes = require('./routes/columns.route')
const auth = require('./routes/auth.route')
const cors = require('cors')
app.use(cors())
app.use(user_routes, board_routes, column_routes, auth)

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
  console.log(
    "Moe's bar works in http://localhost:%PORT%".replace('%PORT%', HTTP_PORT)
  )
})
app.use(function (req, res, next) {
  res.header('Pragma', 'no-cache')
  res.removeHeader('Pragma')
  next()
})
app.get('/', (req, res, next) => {
  res.json("Api Moe's bar works")
})
