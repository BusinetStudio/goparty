// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': ''
    },
	'database': 'partyapp',
    'users_table': 'usuarios',
    'use_database': true,
    "facebook_api_key"      :     "493594601166223",
    "facebook_api_secret"   :     "eb4ee00e5d00e8adaab1a30c8e9e25fa",
    "callback_url"          :     "https://gopartyperu.herokuapp.com/auth/facebook/callback",
};
/*
module.exports = {
    'connection': {
        'host': 'businet-web.com',
        'user': 'fsanmcbx_macrote',
        'password': 'appcontraseñ@'
    },
	'database': 'fsanmcbx_goparty',
    'users_table': 'usuarios',
    'use_database': true,
    "facebook_api_key"      :     "493594601166223",
    "facebook_api_secret"   :     "eb4ee00e5d00e8adaab1a30c8e9e25fa",
    "callback_url"          :     "https://gopartyperu.herokuapp.com/auth/facebook/callback",
};
*/
