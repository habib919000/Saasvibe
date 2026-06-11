<?php
/**
 * Plugin Name:       WP Admin Nav Designer
 * Plugin URI:        https://example.com/wp-admin-nav-designer
 * Description:       Transform your WordPress backend with modern, SaaS-inspired layouts and custom branding.
 * Version:           2.0.0
 * Author:            SaaS Menu Team
 * Author URI:        https://example.com
 * License:           GPLv2 or later
 * Text Domain:       saasmenu
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'SAASMENU_VERSION', '2.0.0' );
define( 'SAASMENU_FILE', __FILE__ );
define( 'SAASMENU_PATH', plugin_dir_path( __FILE__ ) );
define( 'SAASMENU_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register PSR-4 Autoloader
 */
spl_autoload_register( function( $class ) {
    $prefix = 'SaasMenu\\';
    $base_dir = SAASMENU_PATH . 'src/';

    $len = strlen( $prefix );
    if ( strncmp( $prefix, $class, $len ) !== 0 ) {
        return;
    }

    $relative_class = substr( $class, $len );
    $file = $base_dir . str_replace( '\\', '/', $relative_class ) . '.php';

    if ( file_exists( $file ) ) {
        require_once $file;
    }
} );

/**
 * Handle Plugin Activation
 */
function saasmenu_activate_plugin() {
    // Set default settings if not already present
    $default_settings = [
        'templateId'         => 'linear-dark',
        'brandColor'         => '#5E6AD2',
        'density'            => 'normal',
        'customLogo'         => '',
        'topBarHeight'       => 46,
        'sidebarWidth'       => 240,
        'environmentBadge'   => [
            'enabled' => true,
            'label'   => 'Development',
            'color'   => '#5E6AD2',
        ],
        'hideTopBarItems'    => [
            'wpLogo'        => true,
            'siteName'      => false,
            'search'        => false,
            'notifications' => false,
            'howdy'         => false,
        ],
        'roleVisibility'     => [],
        'wizard_completed'   => false,
    ];

    if ( false === get_option( 'saasmenu_settings' ) ) {
        update_option( 'saasmenu_settings', $default_settings );
    }

    update_option( 'saasmenu_version', SAASMENU_VERSION );
}
register_activation_hook( __FILE__, 'saasmenu_activate_plugin' );

/**
 * Handle Plugin Deactivation
 */
function saasmenu_deactivate_plugin() {
    // We do not delete the settings on deactivation to preserve user config.
    // Deactivating the plugin will naturally unhook stylesheets and restore default WP admin.
}
register_deactivation_hook( __FILE__, 'saasmenu_deactivate_plugin' );

// Bootstrap the plugin loaders
require_once SAASMENU_PATH . 'bootstrap/loaders.php';
