<?php
function virat_theme_enqueue_scripts()
{
    // Enqueue CSS
    wp_enqueue_style(
        'virat-theme-style',
        get_template_directory_uri() . '/assets/styles123311.css',
        array(),
        '1.2'
    );

    // Enqueue JavaScript
    wp_enqueue_script(
        'virat-theme-script',
        get_template_directory_uri() . '/assets/script123311.js',
        array(),
        '1.2',
        true
    );
}
add_action('wp_enqueue_scripts', 'virat_theme_enqueue_scripts');
?>
