<?php
/*
Plugin Name: General Settings
Author: Hoan Dang
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('plugins_loaded', ['Setting', 'getInstance']);

if (!class_exists('Setting')):

class Setting
{
  private static $instance = null;

  const UNUSED_PAGES = [];

  public static function getInstance()
  {
    if (!isset(self::$instance)) {
      self::$instance = new self;
    }
    return self::$instance;
  }

  private function __construct()
  {
    $this->publicSetup();

    if (is_admin()) {
      $this->adminSetup();
    }
  }

  private function adminSetup()
  {
    // Remove "Thank you for creating with WordPress" footer text
    add_filter('admin_footer_text', '__return_empty_string', 11);
    add_filter('update_footer', '__return_empty_string', 11);

    add_action('pre_get_posts', [$this, 'hideUnusedPages']);

    add_filter('tiny_mce_before_init', [$this, 'removeUnusedFormatsInTinymce']);

    add_action('admin_menu', [$this, 'removeWordpressVersionInFooter']);

    add_action('admin_footer-options-general.php', [$this, 'customiseGeneralSettings']);

    add_filter('theme_page_templates', [$this, 'removeUnusedPageTemplates']);

    add_action('after_setup_theme', [$this, 'regsiterNav']);

    add_action('admin_menu', [$this, 'adjustAdminMenu']);

    add_action('admin_init', [$this, 'styleNavMenuScreen']);
  }

  private function publicSetup()
  {
    add_action('init', [$this, 'bootstrap']);

    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

    add_action('init', [$this, 'addExcerptToPage']);

    // remove those below for security 
    add_filter('xmlrpc_methods', function( $methods ) {
      unset( $methods['pingback.ping'] );
      return $methods;
    });

    add_filter('wp_headers', function($headers) {
      unset($headers['X-Pingback']);
      return $headers;
    });
  }

  public function bootstrap() 
  {
    date_default_timezone_set('Australia/Sydney');
    if (!session_id()) session_start();
    ob_start();
  }

  public function hideUnusedPages($query)
  {
    $get_page_by_template = function ($template) {
      return current(get_pages([
        'meta_key'   => '_wp_page_template',
        'meta_value' => "$template",
      ]));
    };

    $unused_page_ids = array_map(function ($page) use ($get_page_by_template) {
      return $get_page_by_template($page)->ID;
    }, self::UNUSED_PAGES);

    if (isset($query->query_vars['post_type']) && $query->query_vars['post_type'] === 'page') {
      $query->set('post__not_in', $unused_page_ids);
    }
  }

  public function removeUnusedFormatsInTinymce($init)
  {
    // Add block format elements you want to show in dropdown
    $init['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3';
    return $init;
  }

  public function regsiterNav()
  {
    register_nav_menu('header-menu', __('Header Menu'));
  }

  public function adjustAdminMenu()
  {
    global $menu;

    remove_submenu_page('themes.php', 'nav-menus.php');

    // Add nav menu as top element
    $menu[31] = [__('Menus', 'theme-slug'), 'edit_theme_options', 'nav-menus.php', __('Menus', 'theme-slug'), 'menu-top menu-nav', 'menu-nav', 'dashicons-menu'];
  }

  public function styleNavMenuScreen()
  {
    if ($_SERVER['REQUEST_URI'] == '/wp/wp-admin/nav-menus.php') {
      ob_start();
      ?>
      <style>
      .page-title-action,
      .nav-tab-wrapper .nav-tab:last-child ,
      .menu-settings,
      #nav-menu-footer .delete-action,
      #add-custom-links,
      #add-post-type-post,
      #add-page_tag,
      #add-category,
      .manage-menus {
        display: none;
      }

      </style>
      <?php
      echo ob_get_clean();
    }
  }

  public function removeWordpressVersionInFooter()
  {
    remove_filter('update_footer', 'core_update_footer');
  }

  public function customiseGeneralSettings()
  {
    ?>
    <script type="text/javascript">
      jQuery(document).ready( function($) {
        var $table = $('.form-table');
        var $site_title = $table.find('tr:first-child');
        var $wp_url = $table.find('tr:nth-child(3)');
        var $email = $table.find('tr:nth-child(5)');
        var $membership = $table.find('tr:nth-child(6)');
        var $week_start = $table.find('tr:nth-child(11)');
        var $language = $table.find('tr:nth-child(12)');

        $site_title.find('label').html('Website Title');
        $wp_url.remove();
        $email.find('label').html('Email');
        $membership.remove();
        $week_start.remove();
        $language.remove();
      });
    </script>
    <?php
  }

  public function removeUnusedPageTemplates($page_templates)
  {
    foreach(self::UNUSED_PAGES as $page) {
      unset($page_templates[$page]);
    }

    return $page_templates;
  }

  public function addExcerptToPage()
  {
    add_post_type_support('page', 'excerpt');
  }
}

endif;
