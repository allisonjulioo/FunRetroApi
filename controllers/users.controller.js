
var db = require("../migrations/migration.js");
var md5 = require("md5");
var express = require("express");
var app = express();

exports.GetUsers = function(req, res, next) {
    var sql = "select * from user"
    var params = []
    return db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data": rows,
            "length": rows.length,
        });
    });
};

exports.GetUserById = (req, res, next) => {
    const sql = "select * from user where id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if (row)
            res.json({
                "message":"success",
                "data":row
        });
        else res.json({'error': "No find user by id:" + params})
    });
}
// Create user
exports.CreateUser = (req, res, next) => {
    const errors = []
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    const sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    const params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
}
// Update user
exports.UpdateUser = (req, res, next) => {
 let data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set
           name = COALESCE(?,name),
           email = COALESCE(?,email),
           password = COALESCE(?,password)
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
};
// Delete user
exports.DeleteUser = (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"deleted":"ok", changes: result})
    });
};