var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var apiSignup  = {
    apiSignup:apiSignup,
}

function apiSignup(req, res){
    connection.query("SELECT * FROM usuarios WHERE username = ?",[req.body.username], function(err, rows){
        if (err)
            return done(err);
        if (!rows.length) {
            connection.query("INSERT INTO usuarios (username, password, user_email) VALUES (?,?,?)",[req.body.username, req.body.password, req.body.email], function(err2, rows2){
                if(err2) return done(err2);
                if(rows2.length){
                    res.json({ "registrado": true });
                }
            });
        }
        res.json({ "registrado": true });
    });
}
module.exports = apiSignup;