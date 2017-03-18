<?php
add_action('after_setup_theme', function() {
  add_theme_support('automatic-feed-links');
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');

  require_once('helpers.php');
});
