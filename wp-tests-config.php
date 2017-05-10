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

define( 'WP_PHP_BINARY', 'php' );
define( 'WP_TESTS_DOMAIN', getenv('WP_HOME') );
define( 'WP_TESTS_EMAIL', 'hoan@s1t2.com.au' );
define( 'WP_TESTS_TITLE', 'NGS Test' );
define( 'TEST_DATA_DIR', $root_dir.'/tests/data' );
