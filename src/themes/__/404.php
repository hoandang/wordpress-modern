<?php get_header(); ?>

<?php
/* $interests = [ */
/*   'culture,experiential,motion,virtual reality,web', */
/*   'culture,experiential,motion,web', */
/*   'culture,experiential,virtual reality,motion', */
/*   'culture,experiential,virtual reality,web', */
/*   'culture,experientail,web', */
/*   'culture,experiential,motion', */
/*   'experiential,web', */
/*   'experiential,motion', */
/*   'culture,motion', */
/*   'culture,web', */
/*   'culture,experiential', */
/*   'culture,virtual reality', */
/*   'motion,virtual reality', */
/*   'web,virtual reality', */
/*   'motion,web', */
/*   'culture,virtual reality,motion,web', */
/*   'web,motion,experiential', */
/*   'experiential,motion,virtual reality', */
/*   'experiential,web,virtual reality', */
/*   'motion,web,virtual reality', */
/*   'culture,motion,web', */
/*   'culture,experiential,virtual reality', */
/*   'culture,motion,virtual reality', */
/*   'culture,web,virtual reality', */
/*   'experiential,virtual reality', */
/*   'culture', */
/*   'expperiential', */
/*   'virtual reality', */
/*   'web', */
/*   'motion', */
/*   'culture' */
/* ]; */
/* $today = getdate(); */

/* foreach($interests as $interest) { */
/*   $posts = Timber::get_posts([ */
/*     'post_type' => 'post', */
/*     'posts_per_page' => 5, */
/*     'post_status' => 'publish', */
/*     'year' => $today['year'], */
/*     'monthnum' => $today['mon'], */
/*     'tax_query' => [ */
/*       [ */
/*         'taxonomy' => 'category', */
/*         'field' => 'slug', */
/*         'terms' => array_map('sanitize_title', explode(',', $interest)) */
/*       ] */
/*     ] */
/*   ]); */
/* } */

/* $sub = new \App\Models\Subscriber; */

/* r($sub->getCurrentInterests()); */

?>

<div id="error-wrapper">
  <div>
    <img src="<? echo home_url('app/themes/s1t2blog/images/404.png'); ?>" alt="404">
  
    <div>
      <p>Sorry the page you're looking for cannot be found</p>
      <p>We're working hard to find the page but in the meantime you can continue exploring our site in the navigation above, or visit our work page to learn more about our projects.</p>
      <a href="<?php echo getRootUrl(); ?>/our-work">View Our Work</a>
    </div>
  </div>
</div>

<?php get_footer(); ?>
