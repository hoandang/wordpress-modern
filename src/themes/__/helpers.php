<?php

if (!function_exists('sendJson')) :
function sendJson($type, $message, $code = 400)
{
  $successStatus = true;

  if ($type == 'error') {
    if ($code == 400) {
      header('HTTP/1.1 400 Bad Request');
    }
    else {
      header('HTTP/1.1 500 Internal Server Error');
    }
    $successStatus = false;
  }

  return wp_send_json([
    'success' => $successStatus,
    'message' => $message
  ]);
}
endif;

if (!function_exists('isHomePage')):
function isHomePage()
{
  return is_front_page();
}
endif;

if (!function_exists('leadUrl')):
function leadUrl()
{
  global $wp;
  return home_url($wp->request);
}
endif;

if (!function_exists('isDevEnv')):
function isDevEnv()
{
  return getenv('WP_ENV') == 'development';
}
endif;

if (!function_exists('asset')) :
function asset($asset_name)
{
  return home_url("src/themes/s1t2/images/$asset_name");
}
endif;

if (!function_exists('hexToRGB')) :
function hexToRGB($hex)
{
  $hex = str_replace("#", "", $hex);

  if(strlen($hex) == 3) {
    $r = hexdec(substr($hex,0,1).substr($hex,0,1));
    $g = hexdec(substr($hex,1,1).substr($hex,1,1));
    $b = hexdec(substr($hex,2,1).substr($hex,2,1));
  } else {
    $r = hexdec(substr($hex,0,2));
    $g = hexdec(substr($hex,2,2));
    $b = hexdec(substr($hex,4,2));
  }
  $rgb = [$r, $g, $b];
  return $rgb;
}
endif;

if (!function_exists('getPagesByTemplate')) :
function getPagesByTemplate($template, $order_by_menu = false, $limit = -1)
{
  $args = [
    'post_type' => 'page',
    'post_status' => 'publish',
    'posts_per_page' => $limit,
    'meta_key' => '_wp_page_template',
    'meta_value' => "Controllers/$template.php",
  ];
  if ($order_by_menu) {
    $args['orderby'] = 'menu_order';
    $args['order'] = 'ASC';
  }

  return array_map(function($page) {
    return new TimberPost($page->ID);
  }, get_posts($args));
}
endif;

if (!function_exists('singularize')) :
function singularize($params) 
{
  if (is_string($params)) {
    $word = $params;
  } else if (!$word = $params['word']) {
    return false;
  }

  $singular = [
    '/(quiz)zes$/i' => '\\1',
    '/(matr)ices$/i' => '\\1ix',
    '/(vert|ind)ices$/i' => '\\1ex',
    '/^(ox)en/i' => '\\1',
    '/(alias|status)es$/i' => '\\1',
    '/([octop|vir])i$/i' => '\\1us',
    '/(cris|ax|test)es$/i' => '\\1is',
    '/(shoe)s$/i' => '\\1',
    '/(o)es$/i' => '\\1',
    '/(bus)es$/i' => '\\1',
    '/([m|l])ice$/i' => '\\1ouse',
    '/(x|ch|ss|sh)es$/i' => '\\1',
    '/(m)ovies$/i' => '\\1ovie',
    '/(s)eries$/i' => '\\1eries',
    '/([^aeiouy]|qu)ies$/i' => '\\1y',
    '/([lr])ves$/i' => '\\1f',
    '/(tive)s$/i' => '\\1',
    '/(hive)s$/i' => '\\1',
    '/([^f])ves$/i' => '\\1fe',
    '/(^analy)ses$/i' => '\\1sis',
    '/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i' => '\\1\\2sis',
    '/([ti])a$/i' => '\\1um',
    '/(n)ews$/i' => '\\1ews',
    '/s$/i' => ''
  ];

  $irregular = [
    'person' => 'people',
    'man' => 'men',
    'child' => 'children',
    'sex' => 'sexes',
    'move' => 'moves'
  ];

  $ignore = [
    'equipment',
    'information',
    'rice',
    'money',
    'species',
    'series',
    'fish',
    'sheep',
    'press',
    'sms'
  ];

  $lower_word = strtolower($word);
  foreach ($ignore as $ignore_word) {
    if (substr($lower_word, (-1 * strlen($ignore_word))) == $ignore_word) {
      return $word;
    }
  }

  foreach ($irregular as $singular_word => $plural_word) {
    if (preg_match('/('.$plural_word.')$/i', $word, $arr)) {
      return preg_replace('/('.$plural_word.')$/i', substr($arr[0],0,1).substr($singular_word,1), $word);
    }
  }

  foreach ($singular as $rule => $replacement) {
    if (preg_match($rule, $word)) {
      return preg_replace($rule, $replacement, $word);
    }
  }

  return $word;
}
endif;
