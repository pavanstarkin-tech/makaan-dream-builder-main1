<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php echo get_bloginfo('description'); ?> — Odisha's trusted civil engineering and infrastructure partner for developers, builders and homeowners. Residential, commercial & industrial construction.">
    <meta name="author" content="<?php echo get_bloginfo('name'); ?>">
    <link rel="canonical" href="<?php echo esc_url( home_url( '/' ) ); ?>">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo esc_url( home_url( '/' ) ); ?>">
    <meta property="og:title" content="<?php echo get_bloginfo('name'); ?> | Plan Better. Build Better. — Odisha">
    <meta property="og:description" content="Odisha's trusted civil engineering and infrastructure partner. Residential, commercial & industrial construction. Quality assured, on-time delivery.">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/logo.png">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo get_bloginfo('name'); ?> | Plan Better. Build Better.">
    <meta name="twitter:description" content="Odisha's trusted civil engineering and infrastructure partner for developers and builders.">
    <meta name="twitter:image" content="<?php echo get_template_directory_uri(); ?>/assets/logo.png">

    <!-- Favicon -->
    <?php
    $favicon_url = get_template_directory_uri() . '/assets/logo.png';
    if ( has_site_icon() ) {
        $favicon_url = get_site_icon_url();
    }
    ?>
    <link rel="icon" type="image/png" href="<?php echo esc_url( $favicon_url ); ?>">

    <!-- WordPress Head Hook -->
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <header id="site-header" class="sr-only">
        <h1><?php bloginfo('name'); ?></h1>
        <nav><?php wp_nav_menu(array('theme_location' => 'primary')); ?></nav>
    </header>
