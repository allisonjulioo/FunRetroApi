const express = require('express')
const app = express()
const user_routes = require('./routes/users.route')
const board_routes = require('./routes/boards.route')
const column_routes = require('./routes/columns.route')
const auth = require('./routes/auth.route')
const cors = require('cors')
app.use(cors())
app.use(user_routes, board_routes, column_routes, auth)

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use(function (req, res, next) {
  res.header('Pragma', 'no-cache')
  res.removeHeader('Pragma')
  next()
})
app.get('/', (req, res, next) => {
  res.json("Api Moe's bar works")
})
