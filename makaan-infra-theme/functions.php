<?php
/**
 * Makaan Infra functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Makaan_Infra
 */

if (!function_exists('makaan_infra_setup')) :
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     */
    function makaan_infra_setup()
    {
        // Add default posts and comments RSS feed links to head.
        add_theme_support('automatic-feed-links');

        /*
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support('title-tag');

        /*
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support('post-thumbnails');

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus(array(
            'primary' => esc_html__('Primary Menu', 'makaan-infra-theme'),
        ));

        /*
         * Switch default core markup for search form, comment form, and comments
         * to output valid HTML5.
         */
        add_theme_support('html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ));

        // Add theme support for selective refresh for widgets.
        add_theme_support('customize-selective-refresh-widgets');

        /**
         * Add support for core custom logo.
         *
         * @link https://codex.wordpress.org/Theme_Logo
         */
        add_theme_support('custom-logo', array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        ));
    }
endif;
add_action('after_setup_theme', 'makaan_infra_setup');

/**
 * Enqueue scripts and styles.
 */
function makaan_infra_scripts()
{
    // Enqueue main stylesheet
    wp_enqueue_style(
      'makaan-infra-style',
      get_template_directory_uri() . '/assets/makaan-bundle.css',
      array(),
      '1.0.0'
    );

    // Enqueue main JavaScript bundle
    wp_enqueue_script(
      'makaan-infra-script',
      get_template_directory_uri() . '/assets/makaan-bundle.js',
      array(),
      '1.0.0',
      true
    );

    // If utilizing React-friendly data passage:
    wp_localize_script('makaan-infra-script', 'makaanInfraData', array(
        'rootUrl' => home_url(),
        'apiUrl'  => rest_url(),
        'nonce'   => wp_create_nonce('wp_rest'),
        'siteName' => get_bloginfo('name')
    ));
}
add_action('wp_enqueue_scripts', 'makaan_infra_scripts');

/**
 * Add type="module" and crossorigin attributes to the React bundle script tag.
 * Vite outputs ES modules; without type="module" the browser won't parse them.
 */
function makaan_infra_add_module_type($tag, $handle, $src)
{
    if ('makaan-infra-script' === $handle) {
        return '<script type="module" crossorigin src="' . esc_url($src) . '" id="makaan-infra-script"></script>' . "\n";
    }
    return $tag;
}
add_filter('script_loader_tag', 'makaan_infra_add_module_type', 10, 3);

/**
 * SPA routing: always serve index.php (the React app) for all front-end requests.
 * This lets React Router handle /about, /services, /gallery, etc. instead of
 * WordPress returning 404 for those client-side routes.
 */
add_filter('template_include', function () {
    return get_template_directory() . '/index.php';
});

/**
 * Clean up WordPress head for a cleaner React integration
 */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head');
