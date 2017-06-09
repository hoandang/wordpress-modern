<?php
add_action('wp_enqueue_scripts', function() {
  
  $stylesheet_url = get_stylesheet_uri();
  $template_dir = get_template_directory_uri();

  $cached = Helper::is_dev_env() ? time() : '';
  $WP_CONSTANTS = [
    'AJAX_URL' => admin_url('admin-ajax.php'),
    'NONCE' => wp_create_nonce('frontend_nonce')
  ];
  
  wp_enqueue_script('jquery');

  wp_enqueue_style('main', $stylesheet_url);

  wp_enqueue_style('vendorcss', "$template_dir/dist/vendor.css");
  wp_enqueue_script('vendorjs', "$template_dir/dist/vendor.js");

  if (Helper::is_dev_env()) {
    wp_enqueue_script('indexjs', "$template_dir/vendor/index.js", [], $cached, true);
    wp_localize_script('indexjs', 'WP_CONST_VARS', $WP_CONSTANTS);
  }
  else {
    wp_enqueue_script('distjs', "$template_dir/dist/dist.min.js", [], $cached, true);
    wp_localize_script('distjs', 'WP_CONSTANTS', $WP_CONSTANTS);
  }
  
});
