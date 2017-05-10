<?php
add_action('wp_enqueue_scripts', function() {
  
  $stylesheet_url = get_stylesheet_uri();
  $template_dir = get_template_directory_uri();
  
  wp_enqueue_script('jquery');

  wp_enqueue_style('main', $stylesheet_url);
  wp_enqueue_script('vendorjs', "$template_dir/vendor/vendor.js");
  wp_enqueue_script('indexjs', "$template_dir/vendor/index.js");
  
  wp_localize_script('indexjs', 'WP_CONSTANTS', [
    'AJAX_URL' => admin_url('admin-ajax.php'),
    'NONCE' => wp_create_nonce('frontend_nonce')
  ]);
  
});
