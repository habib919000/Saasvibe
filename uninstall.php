<?php
/**
 * Saasvibe uninstall handler.
 *
 * Runs only when the user deletes the plugin from the Plugins screen (not on
 * deactivation). Removes the options the plugin created so deletion leaves no
 * orphaned data. Multisite-aware.
 */

// Exit if not called by WordPress during uninstall.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

/**
 * Delete all options created by the plugin for a single site.
 */
function saasvibe_delete_plugin_data() {
    delete_option( 'saasvibe_settings' );
    delete_option( 'saasvibe_version' );

    // Clear any cached settings.
    wp_cache_delete( 'saasvibe_settings_cache' );
}

if ( is_multisite() ) {
    $site_ids = get_sites( [ 'fields' => 'ids', 'number' => 0 ] );
    foreach ( $site_ids as $site_id ) {
        switch_to_blog( $site_id );
        saasvibe_delete_plugin_data();
        restore_current_blog();
    }
} else {
    saasvibe_delete_plugin_data();
}
