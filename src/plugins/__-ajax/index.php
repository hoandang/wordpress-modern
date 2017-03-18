<?php
/*
Plugin Name: Ajax Handler
Author: Hoan Dang
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('plugins_loaded', ['AjaxHandler', 'getInstance']);

if (!class_exists('AjaxHandler')):

class AjaxHandler
{
  private static $instance = null;

  public static function getInstance()
  {
    if (!isset(self::$instance)) {
      self::$instance = new self;
    }
    return self::$instance;
  }

  private function __construct()
  {
    add_action('wp_ajax_test_ajax', 'test_ajax');
    add_action('wp_ajax_nopriv_test_ajax', 'test_ajax');
  }

  function test_ajax()
  {
    // Check ajax nonce https://codex.wordpress.org/Function_Reference/check_ajax_referer
    check_ajax_referer('ajax_nonce', 'security');

    echo wp_send_json(['message' => 'success']);

    die;
  }
}

endif;
