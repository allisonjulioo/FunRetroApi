var express = require("express");
var app = express();
var user_routes = require('./routes/users.route');
var retro_routes = require('./routes/retros.route');

app.use(user_routes, retro_routes);

var HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
    console.log("Moe's bar works in http://localhost:%PORT%".replace("%PORT%",HTTP_PORT))
});
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});