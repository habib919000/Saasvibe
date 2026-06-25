<?php
/**
 * Plugin Name:       Saasvibe
 * Plugin URI:        https://github.com/habib919000/Saasvibe
 * Description:       Transform your WordPress dashboard with beautiful design templates, brand customization, and role-based access control. Enterprise-grade security with WCAG accessibility.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            habib919000
 * Author URI:        https://uxhabib.framer.website
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       saasvibe
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'SAASVIBE_VERSION', '1.0.0' );
define( 'SAASVIBE_FILE', __FILE__ );
define( 'SAASVIBE_PATH', plugin_dir_path( __FILE__ ) );
define( 'SAASVIBE_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register PSR-4 Autoloader
 */
spl_autoload_register( function( $class ) {
    $prefix = 'Saasvibe\\';
    $base_dir = SAASVIBE_PATH . 'src/';

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
function saasvibe_activate_plugin() {
    // Set default settings if not already present
    $default_settings = [
        'templateId'         => 'linear-dark',
        'brandColor'         => '',
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
        'modernIcons'        => [
            'enabled' => false,
            'style'   => 'line',
        ],
        'wizard_completed'   => false,
    ];

    if ( false === get_option( 'saasvibe_settings' ) ) {
        update_option( 'saasvibe_settings', $default_settings );
    }

    update_option( 'saasvibe_version', SAASVIBE_VERSION );
}
register_activation_hook( __FILE__, 'saasvibe_activate_plugin' );

/**
 * Handle Plugin Deactivation
 */
function saasvibe_deactivate_plugin() {
    // We do not delete the settings on deactivation to preserve user config.
    // Deactivating the plugin will naturally unhook stylesheets and restore default WP admin.
}
register_deactivation_hook( __FILE__, 'saasvibe_deactivate_plugin' );

// Bootstrap the plugin loaders
require_once SAASVIBE_PATH . 'bootstrap/loaders.php';
