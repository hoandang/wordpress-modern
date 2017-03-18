<?php
require_once dirname( dirname( __FILE__ ) ) . '/includes/functions.php';

function _manually_load_environment() {
  // Add your theme
	switch_theme('s1t2');

	$plugins_to_active = array(
		's1t2-helper/index.php',
		's1t2-sql-helper/index.php',
		'timber-library/timber.php',
	);

	update_option( 'active_plugins', $plugins_to_active );
}
tests_add_filter( 'muplugins_loaded', '_manually_load_environment' );

require dirname( dirname( __FILE__ ) ) . '/includes/bootstrap.php';
