<?php
/*
* Template Name: Home Page
* */

/* get_header(); */

/* $data = Timber::get_context(); */

/* $data['page'] = new TimberPost; */
/* $data['message'] = 'Home Page'; */

$to = 'hoan@s1t2.com.au';
$subject = 'The subject';
$body = 'The email body content';
$headers = array('Content-Type: text/html; charset=UTF-8');

/* phpinfo();die; */

$res = wp_mail($to, $subject, $body, $headers);

var_dump($res);

/* Timber::render('Views/home/index.twig', $data); */

/* get_footer(); */
