<?php
/*
* Template Name: Home Page
* */

get_header();

$data = Timber::get_context();

$data['page'] = new TimberPost;
$data['message'] = 'Home Page';

Timber::render('Views/home/index.twig', $data);

get_footer();
