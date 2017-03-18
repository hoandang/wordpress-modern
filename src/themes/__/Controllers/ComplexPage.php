<?php
/*
* Template Name: Complex Page
* */

get_header();

$data = Timber::get_context();

$data['title'] = 'Complex page';

Timber::render('Views/complexpage/index.twig', $data);

get_footer();
