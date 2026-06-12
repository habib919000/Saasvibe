<?php
/**
 * Plugin Initialization & Loading
 * 
 * Features:
 * - Comprehensive error handling
 * - Debug logging
 * - Graceful failure handling
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ============================================
// 1. Simple Logger Class
// ============================================

class Saasvibe_Logger {
    const ERROR = 'ERROR';
    const WARNING = 'WARNING';
    const INFO = 'INFO';
    const DEBUG = 'DEBUG';

    public static function log( $message, $level = self::INFO ) {
        if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
            return;
        }

        $timestamp = gmdate( '[Y-m-d H:i:s]' );
        $log_message = "$timestamp [$level] Saasvibe: $message";
        
        // Log to WordPress debug log. Gated behind WP_DEBUG above; intentional debug output.
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        error_log( $log_message );
    }

    public static function error( $message ) {
        self::log( $message, self::ERROR );
    }

    public static function warning( $message ) {
        self::log( $message, self::WARNING );
    }

    public static function info( $message ) {
        self::log( $message, self::INFO );
    }

    public static function debug( $message ) {
        self::log( $message, self::DEBUG );
    }
}

// ============================================
// 2. Load Routes with Error Handling
// ============================================

try {
    $saasvibe_routes_file = SAASVIBE_PATH . 'routes/templates.php';

    if ( ! file_exists( $saasvibe_routes_file ) ) {
        throw new Exception( "Routes file not found: $saasvibe_routes_file" );
    }

    require_once $saasvibe_routes_file;
    Saasvibe_Logger::debug( 'Routes loaded successfully' );
    
} catch ( Exception $e ) {
    Saasvibe_Logger::error( 'Failed to load routes: ' . $e->getMessage() );
    
    // Show admin notice in WP_DEBUG mode
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        add_action( 'admin_notices', function() use ( $e ) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p><strong>Saasvibe Error:</strong> <?php echo esc_html( $e->getMessage() ); ?></p>
            </div>
            <?php
        } );
    }
}

// ============================================
// 3. Register Admin Settings Page
// ============================================

try {
    add_action( 'admin_menu', function() {
        try {
            add_options_page(
                __( 'Saasvibe', 'saasvibe' ),
                __( 'Saasvibe', 'saasvibe' ),
                'manage_options',
                'saasvibe',
                'saasvibe_render_settings_page'
            );
            Saasvibe_Logger::debug( 'Admin menu registered' );
        } catch ( Exception $e ) {
            Saasvibe_Logger::error( 'Failed to register admin menu: ' . $e->getMessage() );
        }
    } );
} catch ( Exception $e ) {
    Saasvibe_Logger::error( 'Error setting up admin menu hook: ' . $e->getMessage() );
}

// ============================================
// 4. Render Settings Page Mount Point
// ============================================

function saasvibe_render_settings_page() {
    try {
        echo '<div id="saasvibe-app"></div>';
        echo '<div id="saasvibe-portal-root"></div>';
    } catch ( Exception $e ) {
        Saasvibe_Logger::error( 'Error rendering settings page: ' . $e->getMessage() );
        wp_die( 'Failed to render settings page. Check error logs.' );
    }
}

// ============================================
// 5. Enqueue Admin Assets with Error Handling
// ============================================

add_action( 'admin_enqueue_scripts', function( $hook ) {
    try {
        // Only load React app assets on our settings page
        if ( 'settings_page_saasvibe' !== $hook ) {
            return;
        }

        Saasvibe_Logger::debug( "Loading assets for hook: $hook" );

        // Enqueue WP Media Library helper scripts
        wp_enqueue_media();

        $js_url = SAASVIBE_URL . 'views/assets/dist/saasmenu.js';
        $css_url = SAASVIBE_URL . 'views/assets/dist/saasmenu.css';

        // Check if files exist (optional, for debugging)
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            $js_file = SAASVIBE_PATH . 'views/assets/dist/saasmenu.js';
            $css_file = SAASVIBE_PATH . 'views/assets/dist/saasmenu.css';
            
            if ( ! file_exists( $js_file ) ) {
                Saasvibe_Logger::warning( "JS file not found: $js_file" );
            }
            if ( ! file_exists( $css_file ) ) {
                Saasvibe_Logger::warning( "CSS file not found: $css_file" );
            }
        }

        // Enqueue JavaScript
        wp_enqueue_script(
            'saasvibe-admin',
            $js_url,
            [ 'wp-element', 'wp-i18n' ],
            SAASVIBE_VERSION,
            true
        );

        // Enqueue CSS
        wp_enqueue_style(
            'saasvibe-admin',
            $css_url,
            [],
            SAASVIBE_VERSION
        );

        Saasvibe_Logger::debug( 'JavaScript and CSS enqueued successfully' );

        // ================================
        // Prepare Settings & Localization
        // ================================

        try {
            // Get current settings
            $settings = get_option( 'saasvibe_settings', [] );

            // Gather roles list
            $wp_roles = wp_roles();
            $roles_list = [];
            
            if ( ! empty( $wp_roles->roles ) ) {
                foreach ( $wp_roles->roles as $role_key => $role_data ) {
                    $roles_list[] = [
                        'key'  => $role_key,
                        'name' => translate_user_role( $role_data['name'] ),
                    ];
                }
            }

            Saasvibe_Logger::debug( 'Loaded ' . count( $roles_list ) . ' roles' );

            // Gather menu items list
            global $menu;
            $menu_list = [];
            
            if ( ! empty( $menu ) ) {
                foreach ( $menu as $item ) {
                    if ( empty( $item[0] ) ) {
                        continue;
                    }
                    $title = wp_strip_all_tags( $item[0] );
                    $slug = $item[2];
                    $clean_slug = sanitize_title( $slug );
                    $id = ! empty( $item[5] ) ? $item[5] : ( 'menu-' . $clean_slug );
                    $menu_list[] = [
                        'id'    => $id,
                        'title' => $title,
                        'slug'  => $slug,
                    ];
                }
            }

            Saasvibe_Logger::debug( 'Loaded ' . count( $menu_list ) . ' menu items' );

            // Load templates catalogue
            try {
                $controller = new \Saasvibe\Controllers\Template_Controller();
                $templates = $controller->get_templates_list();
                Saasvibe_Logger::debug( 'Loaded ' . count( $templates ) . ' templates' );
            } catch ( Exception $e ) {
                Saasvibe_Logger::error( 'Failed to load templates: ' . $e->getMessage() );
                $templates = [];
            }

            // Localize React App variables
            wp_localize_script( 'saasvibe-admin', 'SaasMenu_Vars', [
                'rest_url'   => esc_url_raw( rest_url( 'saasvibe/v1/' ) ),
                'permission' => wp_create_nonce( 'wp_rest' ),
                'is_admin'   => current_user_can( 'manage_options' ),
                'settings'   => $settings,
                'templates'  => $templates,
                'roles'      => $roles_list,
                'menuItems'  => $menu_list,
                'language'   => [
                    'locale_data' => [
                        'saasvibe' => [
                            '' => [
                                'domain' => 'saasvibe',
                                'lang'   => get_user_locale(),
                            ],
                        ],
                    ],
                ],
            ] );

            Saasvibe_Logger::debug( 'Settings localized for React app' );

        } catch ( Exception $e ) {
            Saasvibe_Logger::error( 'Error preparing settings: ' . $e->getMessage() );
            
            // Still pass empty settings to prevent JS errors
            wp_localize_script( 'saasvibe-admin', 'SaasMenu_Vars', [
                'rest_url'   => esc_url_raw( rest_url( 'saasvibe/v1/' ) ),
                'permission' => wp_create_nonce( 'wp_rest' ),
                'error'      => 'Failed to load settings. Check server logs.',
            ] );
        }

    } catch ( Exception $e ) {
        Saasvibe_Logger::error( 'Critical error in asset enqueue: ' . $e->getMessage() );
        
        // Show admin notice
        add_action( 'admin_notices', function() use ( $e ) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p><strong>Saasvibe Error:</strong> Failed to load admin interface. Check error logs.</p>
            </div>
            <?php
        } );
    }
} );

// ============================================
// 5b. Apply Active Template to the WP Admin Chrome
// ============================================
//
// Runs on every admin page (not just the settings page) so the chosen
// template + brand settings actually style the dashboard. The template
// stylesheets live in assets/css/templates/{templateId}.css and consume
// CSS custom properties that we inject inline from the saved settings.

add_action( 'admin_enqueue_scripts', function() {
    try {
        $settings = get_option( 'saasvibe_settings', [] );

        $template_id = $settings['templateId'] ?? '';
        if ( '' === $template_id ) {
            return;
        }

        // Role visibility: empty == show to everyone. Otherwise only apply
        // when one of the current user's roles is enabled. Supports both a
        // list of role keys and a { role: bool } map.
        $role_visibility = $settings['roleVisibility'] ?? [];
        if ( ! empty( $role_visibility ) ) {
            $user    = wp_get_current_user();
            $allowed = false;
            foreach ( (array) $user->roles as $role ) {
                if ( in_array( $role, $role_visibility, true )
                    || ( isset( $role_visibility[ $role ] ) && $role_visibility[ $role ] ) ) {
                    $allowed = true;
                    break;
                }
            }
            if ( ! $allowed ) {
                return;
            }
        }

        // Resolve template stylesheet (guard against path traversal).
        $safe_id   = sanitize_file_name( $template_id );
        $css_path  = SAASVIBE_PATH . 'assets/css/templates/' . $safe_id . '.css';
        if ( ! file_exists( $css_path ) ) {
            Saasvibe_Logger::warning( "Template CSS not found: $css_path" );
            return;
        }

        wp_enqueue_style(
            'saasvibe-template',
            SAASVIBE_URL . 'assets/css/templates/' . $safe_id . '.css',
            [],
            SAASVIBE_VERSION
        );

        // Inject user-driven custom properties. Brand hover/text colors are
        // left to each template's own fallbacks so light/dark themes stay legible.
        $brand   = $settings['brandColor'] ?? '#5E6AD2';
        $sidebar = (int) ( $settings['sidebarWidth'] ?? 240 );
        $topbar  = (int) ( $settings['topBarHeight'] ?? 46 );
        $compact = ( ( $settings['density'] ?? 'normal' ) === 'compact' );

        $pad      = $compact ? '6px 10px' : '8px 12px';
        $pad_left = $compact ? '10px' : '12px';

        $brand    = sanitize_text_field( $brand );

        $vars = sprintf(
            ':root{--saasmenu-brand-color:%s;--saasmenu-sidebar-width:%dpx;--saasmenu-topbar-height:%dpx;--saasmenu-menu-item-padding:%s;--saasmenu-menu-item-padding-left:%s;}',
            $brand,
            $sidebar,
            $topbar,
            $pad,
            $pad_left
        );

        wp_add_inline_style( 'saasvibe-template', $vars );
        Saasvibe_Logger::debug( "Applied template '$safe_id' to admin chrome" );

    } catch ( Exception $e ) {
        Saasvibe_Logger::error( 'Failed to apply template to admin: ' . $e->getMessage() );
    }
}, 20 );

// ============================================
// 6. Global Error Handler
// ============================================

// Catch fatal errors during initialization
register_shutdown_function( function() {
    $last_error = error_get_last();
    
    if ( $last_error && in_array( $last_error['type'], [ E_ERROR, E_PARSE, E_CORE_ERROR ], true ) ) {
        Saasvibe_Logger::error( sprintf(
            'Fatal Error (%s): %s in %s on line %d',
            $last_error['type'],
            $last_error['message'],
            $last_error['file'],
            $last_error['line']
        ) );
    }
} );

// Log successful initialization
Saasvibe_Logger::info( 'Plugin loader initialized successfully' );
