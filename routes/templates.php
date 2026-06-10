<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function() {
    $controller = new \SaasMenu\Controllers\Template_Controller();

    // GET /templates — fetch active templates catalogue
    register_rest_route( 'saasmenu/v1', '/templates', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'get_templates' ],
        'permission_callback' => '__return_true',
    ] );

    // GET /settings — fetch active plugin settings
    register_rest_route( 'saasmenu/v1', '/settings', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'get_settings' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

    // POST /settings — save plugin settings
    register_rest_route( 'saasmenu/v1', '/settings', [
        'methods'             => 'POST',
        'callback'            => [ $controller, 'save_settings' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

    // GET /settings/export — download plugin settings
    register_rest_route( 'saasmenu/v1', '/settings/export', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'export_settings' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

    // POST /settings/import — import plugin settings from JSON
    register_rest_route( 'saasmenu/v1', '/settings/import', [
        'methods'             => 'POST',
        'callback'            => [ $controller, 'import_settings' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

    // POST /preview/css — return raw CSS for preview frame
    register_rest_route( 'saasmenu/v1', '/preview/css', [
        'methods'             => 'POST',
        'callback'            => [ $controller, 'preview_css' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );
} );
