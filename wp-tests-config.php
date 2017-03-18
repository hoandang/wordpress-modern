<?php

require_once('vendor/autoload.php');

$root_dir = dirname(__FILE__);

/**
 * Use Dotenv to set required environment variables and load .env file in root
 */
$dotenv = new Dotenv\Dotenv($root_dir);
$dotenv->load();
$dotenv->required([
	'TEST_DB_NAME',
	'TEST_DB_USER',
	'TEST_DB_PASSWORD',
	'WP_HOME',
	'WP_SITEURL'
]);

define( 'IS_TEST', true );

define( 'WP_DEBUG', true );

define( 'WP_HOME', getenv('WP_HOME') );
define( 'WP_SITEURL', getenv('WP_SITEURL') );

define( 'DB_NAME', getenv('TEST_DB_NAME') );
define( 'DB_USER', getenv('TEST_DB_USER') );
define( 'DB_PASSWORD', getenv('TEST_DB_PASSWORD') );
define( 'DB_HOST', getenv('TEST_DB_HOST') );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

/**
 * Custom Content Directory
 */
define('CONTENT_DIR', '/src');
define('WP_CONTENT_DIR', $root_dir . CONTENT_DIR);
define('WP_CONTENT_URL', WP_HOME . CONTENT_DIR);

$table_prefix  = 'wptests_';   // Only numbers, letters, and underscores please!

/**
 * Authentication Unique Keys and Salts
 */
define('AUTH_KEY',         'VrMG~?GUUN6`<r:OU<E9Dlk,#nx76.oE6R5I+UX<R|2ToMpm.z:8v&W+E1@AJ|nq');
define('SECURE_AUTH_KEY',  'brJJ?1ZZ9a]3}*oTWEP/qw_vI,?*Z0o^mf6|R-@t9*|@yr+Cyyd-%E6kdq`,VY&N');
define('LOGGED_IN_KEY',    'q200E43C-rzst{{,i&k4,l4Yfkm;r)cD#Vd^v;vD9R;K}z-H+%~;?_v+9[^?H5P>');
define('NONCE_KEY',        'bZi[ku: iT<|W1X=Oj|oJ&.Rjra#ZA0sTc7`:j-:kuO(]zit||k-Yqr~`u@&-jnw');
define('AUTH_SALT',        'ux+BS=a=qvcaYC%M40*2vvVsd/KAIdAX~-A|Z[|h13<g(pH^)C-}7Y|(vK&Yq#D(');
define('SECURE_AUTH_SALT', 'o8E`-dwC/|lhIZs_.9~+v:g^AxyMoz0&~jejiZm-VBQWcL6MTdlO]HfS,bicU`>s');
define('LOGGED_IN_SALT',   'sn>znS+5?6W?r`)l?V5K0N/VnZ8+Lo%.,%yW/Ifzl(*6^2]jgN+{-J33vT-otFpD');
define('NONCE_SALT',       '!FFp7)NN0u/KR[aWZxXu)c`I2$qAdkNYIDkz!ipuJ3N-;n)!pJd&;#Fu&V>N5+]P');

define( 'WP_PHP_BINARY', 'php' );
define( 'WP_TESTS_DOMAIN', getenv('WP_HOME') );
define( 'WP_TESTS_EMAIL', 'hoan@s1t2.com.au' );
define( 'WP_TESTS_TITLE', 'NGS Test' );
define( 'TEST_DATA_DIR', $root_dir.'/tests/data' );
