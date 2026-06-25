<?php
/**
 * REST API Routes - All endpoints with security hardening
 * 
 * Features:
 * - CSRF protection via nonce verification
 * - Role-based permission checks
 * - Input validation on all routes
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function() {
    $controller = new \Saasvibe\Controllers\Template_Controller();

    // ============================================
    // GET /templates — Fetch active templates catalogue
    // ============================================
    register_rest_route( 'saasvibe/v1', '/templates', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'get_templates' ],
        'permission_callback' => '__return_true', // Public endpoint
    ] );

    // ============================================
    // GET /settings — Fetch current plugin settings
    // ============================================
    register_rest_route( 'saasvibe/v1', '/settings', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'get_settings' ],
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

    // ============================================
    // POST /settings — Save plugin settings
    // ============================================
    register_rest_route( 'saasvibe/v1', '/settings', [
        'methods'             => 'POST',
        'callback'            => [ $controller, 'save_settings' ],
        'permission_callback' => function( $request ) {
            // Verify nonce (CSRF protection)
            $nonce = $request->get_header( 'X-WP-Nonce' );
            if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
                return new WP_Error(
                    'rest_csrf_failure',
                    __( 'Invalid security token. Please reload the page and try again.', 'saasvibe' ),
                    [ 'status' => 403 ]
                );
            }
            
            // Verify user capability
            if ( ! current_user_can( 'manage_options' ) ) {
                return new WP_Error(
                    'rest_forbidden',
                    __( 'You do not have permission to update settings.', 'saasvibe' ),
                    [ 'status' => 403 ]
                );
            }
            
            return true;
        },
    ] );

    // ============================================
    // GET /settings/export — Download plugin settings as JSON
    // ============================================
    register_rest_route( 'saasvibe/v1', '/settings/export', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'export_settings' ],
        'permission_callback' => function( $request ) {
            if ( ! current_user_can( 'manage_options' ) ) {
                return new WP_Error(
                    'rest_forbidden',
                    __( 'You do not have permission to export settings.', 'saasvibe' ),
                    [ 'status' => 403 ]
                );
            }
            return true;
        },
    ] );

    // ============================================
    // POST /settings/import — Import plugin settings from JSON
    // ============================================
    register_rest_route( 'saasvibe/v1', '/settings/import', [
        'methods'             => 'POST',
        'callback'            => [ $controller, 'import_settings' ],
        'args'                => [
            'content' => [
                'type'              => 'string',
                'required'          => true,
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => function( $value ) {
                    if ( empty( $value ) ) {
                        return new WP_Error(
                            'empty_content',
                            __( 'Import content is required', 'saasvibe' )
                        );
                    }
                    return true;
                },
            ],
        ],
        'permission_callback' => function( $request ) {
            // Verify nonce (CSRF protection)
            $nonce = $request->get_header( 'X-WP-Nonce' );
            if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
                return new WP_Error(
                    'rest_csrf_failure',
                    __( 'Invalid security token. Please reload the page and try again.', 'saasvibe' ),
                    [ 'status' => 403 ]
                );
            }
            
            // Verify user capability
            if ( ! current_user_can( 'manage_options' ) ) {
                return new WP_Error(
                    'rest_forbidden',
                    __( 'You do not have permission to import settings.', 'saasvibe' ),
                    [ 'status' => 403 ]
                );
            }
            
            return true;
        },
    ] );
} );
