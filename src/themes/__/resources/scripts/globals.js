window.wpAjax = (action, data = {}) =>
{
  return jQuery.ajax({
    type: 'post',
    url: WP_CONSTANTS.AJAX_URL,
    data: jQuery.extend({ action: action }, data)
  });
};
