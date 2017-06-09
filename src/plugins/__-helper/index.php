<?php
/*
Plugin Name: Helpers
Author: Hoan Dang
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('plugins_loaded', ['Helper', 'getInstance']);

if (!class_exists('Helper')):

class Helper
{
  private static $instance = null;

  public static function getInstance()
  {
    if (!isset(self::$instance)) self::$instance = new self;
    return self::$instance;
  }

  static function is_dev_env() 
  {
    return getenv('WP_ENV') == 'development';
  }
}

endif;
