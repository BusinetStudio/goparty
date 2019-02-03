// app/routes.js
const facebookloginController = require('./controllers/facebookLogin');
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
	app.post('/api/login', passport.authenticate('api-login',{ session: false }), 
		function(req, res) {
			res.json({ "autorizacion": true });
		}
	);
	app.post('/api/signup', passport.authenticate('api-signup',{ session: false }), 
		function(req, res) {
			res.json({ "registrado": true });
		}
	);
	app.post('/api/facebook-movil-login', facebookloginController.login);
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('dashboard.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { 
			successRedirect : '/dashboard', 
			failureRedirect: '/login' 
		}),
		function(req, res) {
			if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
			req.session.cookie.expires = false;
			}
			res.redirect('/');
		}
	);
	

	app.get('/auth/google', passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login']
	}));
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/dashboard', 
			failureRedirect: '/login' 
		}),
		(req, res) => {
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect('/');
		}
	);
	app.get('/auth/google-movil/callback', 
		passport.authenticate('google-movil',
		{	
			successRedirect : 'https://auth.expo.io/@anonymous/goparty-ac600cb6-8c77-4253-827d-7de62339b656', 
			failureRedirect: 'https://auth.expo.io/@anonymous/goparty-ac600cb6-8c77-4253-827d-7de62339b656' 
		})
	);

	
};



// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
