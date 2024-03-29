const express = require("express");
const app = express();
const user_routes = require("./routes/users.route");
const board_routes = require("./routes/boards.route");
const column_routes = require("./routes/columns.route");
const card_routes = require("./routes/cards.route");
const auth = require("./routes/auth.route");
const cors = require("cors");
const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(user_routes, board_routes, column_routes, card_routes, auth);

io.on("connection", (socket) => {
  console.log("A user connected");
});

app.listen(process.env.PORT || 8000, function () {
  console.log(
    "Express sport %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

app.get("/", (req, res, next) => {
  res.json("Api Moe's bar works");
});
