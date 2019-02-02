var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var facebookLogin  = {
    login:login,
}

function login(req, res){
    console.log(req.body);
    connection.query('SELECT * FROM usuarios WHERE facebook_profile_id = "'+req.body.facebookId+'";', function(err, rows){
        if (err)
            res.json(err);
        if (!rows.length) {
            connection.query('INSERT INTO usuarios ( facebook_display_name, facebook_profile_id ) values (?,?)',[req.body.displayName, req.body.facebookId],function(err2, rows2) {
                if(err2) console.log(err2);
                res.json({ "autorizacion": true });
            });
        }else{res.json({ "autorizacion": true });}
    });
}
module.exports = facebookLogin;