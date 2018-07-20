<?php
add_action('wp_enqueue_scripts', function() 
{
  $WP_CONSTANTS = [
    'AJAX_URL' => admin_url('admin-ajax.php'),
    'NONCE' => wp_create_nonce('frontend_nonce')
  ];
  
  wp_enqueue_script('jquery');

  wp_enqueue_style('main', get_stylesheet_directory_uri() . '/style.css', [], filemtime( get_stylesheet_directory() . '/style.css'));

  wp_enqueue_script('vendorjs', get_template_directory_uri() . '/dist/vendor.js');

  wp_enqueue_script('appjs', get_template_directory_uri() . '/dist/app.js', [], filemtime(get_stylesheet_directory() . '/dist/app.js'), true);
  wp_localize_script('appjs', 'WP_CONST_VARS', $WP_CONSTANTS);
});
