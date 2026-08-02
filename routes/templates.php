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

/**
 * Whether the current user may export or import settings.
 *
 * The settings screen also gates these behind a licence tier, but that check
 * lives in the browser and cannot be trusted on its own -- the REST routes are
 * reachable directly. This is the authoritative check: `manage_options` by
 * default, and filterable so a licensing add-on can enforce its own tiers
 * server-side without touching these routes.
 *
 * @param string $operation 'export' or 'import'.
 * @return bool
 */
if ( ! function_exists( 'saasvibe_can_transfer_settings' ) ) {
    function saasvibe_can_transfer_settings( $operation ) {
        /**
         * Filters whether the current user may export/import Saasvibe settings.
         *
         * @param bool   $allowed   Defaults to current_user_can( 'manage_options' ).
         * @param string $operation 'export' or 'import'.
         */
        return (bool) apply_filters(
            'saasvibe_can_transfer_settings',
            current_user_can( 'manage_options' ),
            $operation
        );
    }
}

add_action( 'rest_api_init', function() {
    $controller = new \Saasvibe\Controllers\Template_Controller();

    // ============================================
    // GET /templates — Fetch active templates catalogue
    // ============================================
    register_rest_route( 'saasvibe/v1', '/templates', [
        'methods'             => 'GET',
        'callback'            => [ $controller, 'get_templates' ],
        'permission_callback' => function() {
            // Only the settings screen consumes this; no reason to expose the
            // catalogue to anonymous callers.
            return current_user_can( 'manage_options' );
        },
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
            if ( ! saasvibe_can_transfer_settings( 'export' ) ) {
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
                'type'     => 'string',
                'required' => true,
                // No sanitize_callback: this is a raw JSON document, and
                // sanitize_text_field() would strip the newlines and encode the
                // characters it needs. import_settings() json_decode()s it and
                // runs the decoded array through the settings schema validator.
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
            if ( ! saasvibe_can_transfer_settings( 'import' ) ) {
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
