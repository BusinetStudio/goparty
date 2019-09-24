// server.js

// set up ======================================================================
// get all the tools we need
var express  				= require('express'),
		session  				= require('express-session'),
		cookieParser		= require('cookie-parser'),
		bodyParser 			= require('body-parser'),
		morgan 					= require('morgan'),
		app     				= express(),
		errorhandler 		= require('errorhandler'),
		passport 				= require('passport'),
		flash   				= require('connect-flash'),
		mongoose 				= require('mongoose'),
		MongoStore = require('connect-mongo')(session),
		cors = require('cors'),
		dotenv = require("dotenv");
// configuration ===============================================================
dotenv.config();  
var http = require('http');
const server = http.createServer(app);
var port     = process.env.PORT || 3000;
var isProduction = process.env.NODE_ENV === 'production';

// set up our express application

app.use(cors())
require('./config/passport'); // pass passport for configuration
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(session({ 
	secret: 'secret',
	resave: true,
	saveUninitialized: true
  } )); // session secret
  app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static('public'));


// connect to our database
if (!isProduction) {
  app.use(errorhandler());
}


mongoose.connect('mongodb://rogue789:rogue195@ds149984.mlab.com:49984/heroku_w8jkkwv3');
mongoose.set('debug', true);

require('./app/models/usuarios');
require('./app/models/eventos');
require('./app/models/cotizaciones');


// required for passport

app.use(session({ 
  secret: 'secret',
  saveUninitialized: true,
	resave: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))




// routes ======================================================================
app.use(require('./app/routes'));




// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);
