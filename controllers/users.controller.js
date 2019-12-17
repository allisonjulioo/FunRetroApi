
var db = require("../database.js"); 
var md5 = require("md5");

function GetUsers(req, res, next) {
    var sql = "select * from user"
    var params = []
    return db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
};