// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, id);
        /*
        console.log(id);
        connection.query("SELECT * FROM usuarios WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
        */
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM usuarios WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO usuarios ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM usuarios WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

    passport.use(
        'api-login',
        new LocalStrategy(
        function(username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM usuarios WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    
                    return done(null, false); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
    passport.use( 'api-facebookLogin',
        new LocalStrategy(
        function( facebookId, displayName, done) { 
            connection.query('SELECT * FROM usuarios WHERE facebook_profile_id = '+facebookId+';', function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    connection.query('INSERT INTO usuarios ( facebook_display_name, facebook_profile_id ) values ('+displayName+', '+facebookId+')',function(err, rows) {
                        if(err) console.log(err);
                        return done(null, rows[0]);
                    });
                }
                return done(null, rows[0]);
            });
        })
    );
    passport.use(new FacebookStrategy({
        clientID: dbconfig.facebook_api_key,
        clientSecret:dbconfig.facebook_api_secret ,
        callbackURL: dbconfig.callback_url
      },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                connection.query("SELECT facebook_profile_id FROM usuarios WHERE facebook_profile_id = ?",[profile.id], function(err, rows){
                    if (err) return done(err);
                    if (!rows.length) {
                        connection.query("INSERT INTO usuarios (facebook_display_name, facebook_profile_id) VALUES (?,?)",[profile.displayName, profile.id], function(err, rows){
                            if(err) return done(err);
                            if(rows.length){
                                return done(null, profile);
                            }
                        });
                    }else{
                        return done(null, profile);
                    }
                });
            });
        }
    ));
   

    passport.use('google-movil', 
    new GoogleStrategy({
        clientID: '653015851148-jpfm471lcv3oe04ts4lgrcb8bsf8odes.apps.googleusercontent.com',
        clientSecret: 'fAQ8tEF0mA52Ok-7Z8PzoBEK',
        callbackURL: 'https://gopartyperu.herokuapp.com/auth/google-movil/callback'
    },
    (token, refreshToken, profile, done) => {
        process.nextTick(function () {
            connection.query("SELECT google_profile_id FROM usuarios WHERE google_profile_id = ?",[profile.id], function(err, rows){
                if (err) return done(err);
                if (!rows.length) {
                    connection.query("INSERT INTO usuarios (google_display_name, google_profile_id) VALUES (?,?)",[profile.displayName, profile.id], function(err, rows){
                        if(err) return done(err);
                        if(rows.length){
                            return done(null, profile);
                        }
                    });
                }else{
                    return done(null, profile);
                }
            });
        });
    }));


    passport.use(new GoogleStrategy({
        clientID: '653015851148-jpfm471lcv3oe04ts4lgrcb8bsf8odes.apps.googleusercontent.com',
        clientSecret: 'fAQ8tEF0mA52Ok-7Z8PzoBEK',
        callbackURL: 'https://gopartyperu.herokuapp.com/auth/google/callback'
    },
    (token, refreshToken, profile, done) => {
        process.nextTick(function () {
            connection.query("SELECT google_profile_id FROM usuarios WHERE google_profile_id = ?",[profile.id], function(err, rows){
                if (err) return done(err);
                if (!rows.length) {
                    connection.query("INSERT INTO usuarios (google_display_name, google_profile_id) VALUES (?,?)",[profile.displayName, profile.id], function(err, rows){
                        if(err) return done(err);
                        if(rows.length){
                            return done(null, rows[0]);
                        }
                    });
                }else{
                    return done(null, rows[0]);
                }
            });
        });
    }));
};

