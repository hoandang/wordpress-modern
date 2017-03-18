<?php

namespace App\Models;

use Exception;

class Mailer 
{
  protected function __construct() { }
  protected function __wakeup() { }
  protected function __clone() { }

  public static function new_instance()
  {
    static $instance = null;
    if ($instance === null) {
      $instance = new static();
    }

    return $instance;
  }
}

