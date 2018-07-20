<?php
function is_dev_env() 
{
  return getenv('WP_ENV') == 'development';
}
