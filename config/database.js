// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': ''
    },
	'database': 'goparty',
    'users_table': 'usuarios',
    'use_database': true,
    "facebook_api_key"      :     "493594601166223",
    "facebook_api_secret"   :     "eb4ee00e5d00e8adaab1a30c8e9e25fa",
    "callback_url"          :     "http://localhost:3000/auth/facebook/callback",
};