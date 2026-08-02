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
        // NOTE: the compiled React bundle mounts into #saasvibe-app and the
        // settings stylesheet scopes every rule under #saasvibe-app. The id must
        // stay "saasvibe-app" or the entire scoped style layer (typography, form
        // controls, focus states, dark mode) silently fails to apply.
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

        $js_url = SAASVIBE_URL . 'views/assets/dist/saasvibe.js';
        $css_url = SAASVIBE_URL . 'views/assets/dist/saasvibe.css';

        // Check if files exist (optional, for debugging)
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            $js_file = SAASVIBE_PATH . 'views/assets/dist/saasvibe.js';
            $css_file = SAASVIBE_PATH . 'views/assets/dist/saasvibe.css';
            
            if ( ! file_exists( $js_file ) ) {
                Saasvibe_Logger::warning( "JS file not found: $js_file" );
            }
            if ( ! file_exists( $css_file ) ) {
                Saasvibe_Logger::warning( "CSS file not found: $css_file" );
            }
        }

        // Load the webpack-generated dependency + version manifest so the script
        // declares exactly the handles it was built against (react, react-dom,
        // wp-element, wp-i18n) and gets a content-hash cache-buster. Fall back to
        // sensible defaults if the asset file is ever missing.
        $asset_file = SAASVIBE_PATH . 'views/assets/dist/saasvibe.asset.php';
        $asset      = file_exists( $asset_file )
            ? require $asset_file
            : [ 'dependencies' => [ 'wp-element', 'wp-i18n' ], 'version' => SAASVIBE_VERSION ];

        // Enqueue JavaScript
        wp_enqueue_script(
            'saasvibe-admin',
            $js_url,
            $asset['dependencies'],
            $asset['version'],
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

            // Gather menu items list. Prefer the pristine snapshot captured before
            // role-based hiding ran (priority 1 admin_menu hook) so the matrix always
            // lists every menu item — otherwise a menu hidden for the current user's
            // role would drop out of this list and become impossible to re-enable.
            global $menu;
            $menu_source = ! empty( $GLOBALS['saasvibe_menu_snapshot'] )
                ? $GLOBALS['saasvibe_menu_snapshot']
                : (array) $menu;
            $menu_list = [];

            if ( ! empty( $menu_source ) ) {
                foreach ( $menu_source as $item ) {
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

            // Get WordPress admin color scheme primary accent color
            global $_wp_admin_css_colors;
            $admin_color = get_user_option( 'admin_color' );
            if ( empty( $admin_color ) ) {
                $admin_color = 'fresh';
            }
            $wp_brand_color = '#2271b1'; // default Fresh blue fallback
            if ( ! empty( $_wp_admin_css_colors[ $admin_color ]->colors ) ) {
                $colors = $_wp_admin_css_colors[ $admin_color ]->colors;
                if ( isset( $colors[2] ) ) {
                    $wp_brand_color = $colors[2];
                } elseif ( isset( $colors[3] ) ) {
                    $wp_brand_color = $colors[3];
                } elseif ( isset( $colors[0] ) ) {
                    $wp_brand_color = $colors[0];
                }
            }

            // Localize React App variables
            $saasvibe_vars = [
                'rest_url'   => esc_url_raw( rest_url( 'saasvibe/v1/' ) ),
                'permission' => wp_create_nonce( 'wp_rest' ),
                'is_admin'   => current_user_can( 'manage_options' ),
                'version'    => SAASVIBE_VERSION,
                'settings'   => $settings,
                'templates'  => $templates,
                'roles'      => $roles_list,
                'menuItems'  => $menu_list,
                'wp_brand_color' => $wp_brand_color,
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
            ];

            // The compiled bundle reads its data from window.Saasvibe_Vars.
            wp_localize_script( 'saasvibe-admin', 'Saasvibe_Vars', $saasvibe_vars );

            Saasvibe_Logger::debug( 'Settings localized for React app' );

        } catch ( Exception $e ) {
            Saasvibe_Logger::error( 'Error preparing settings: ' . $e->getMessage() );
            
            // Still pass empty settings to prevent JS errors
            $saasvibe_vars = [
                'rest_url'   => esc_url_raw( rest_url( 'saasvibe/v1/' ) ),
                'permission' => wp_create_nonce( 'wp_rest' ),
                'error'      => 'Failed to load settings. Check server logs.',
            ];
            wp_localize_script( 'saasvibe-admin', 'Saasvibe_Vars', $saasvibe_vars );
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

        // A site saved before a template was renamed still holds the old id, and
        // the stylesheet it names is gone -- without this the admin would quietly
        // lose its styling until the user re-picked a template.
        $template_id = \Saasvibe\Controllers\Template_Controller::resolve_template_id( $template_id );

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

        // Get WordPress admin color scheme primary accent color
        global $_wp_admin_css_colors;
        $admin_color = get_user_option( 'admin_color' );
        if ( empty( $admin_color ) ) {
            $admin_color = 'fresh';
        }
        $wp_brand_color = '#2271b1'; // default Fresh blue fallback
        if ( ! empty( $_wp_admin_css_colors[ $admin_color ]->colors ) ) {
            $colors = $_wp_admin_css_colors[ $admin_color ]->colors;
            if ( isset( $colors[2] ) ) {
                $wp_brand_color = $colors[2];
            } elseif ( isset( $colors[3] ) ) {
                $wp_brand_color = $colors[3];
            } elseif ( isset( $colors[0] ) ) {
                $wp_brand_color = $colors[0];
            }
        }

        // Inject user-driven custom properties. Brand hover/text colors are
        // left to each template's own fallbacks so light/dark themes stay legible.
        $brand   = $settings['brandColor'] ?? '';
        $hover   = '';

        // The template's own chrome color is needed either way: to fall back to
        // its accent when no brand color is set, and to work out how far a brand
        // color has to move to stay legible as a label on that chrome.
        $template_controller = new \Saasvibe\Controllers\Template_Controller();
        $chrome_bg = '';
        $muted     = [];
        foreach ( $template_controller->get_templates_list() as $t ) {
            if ( $t['id'] === $template_id ) {
                $chrome_bg = $t['defaultColors']['background'] ?? '';
                $muted     = $t['mutedColors'] ?? [];
                if ( empty( $brand ) ) {
                    $brand = $t['defaultColors']['accent'] ?? '';
                    $hover = $t['defaultColors']['hover'] ?? '';
                }
                break;
            }
        }
        if ( empty( $brand ) ) {
            $brand = $wp_brand_color;
        }
        $sidebar = (int) ( $settings['sidebarWidth'] ?? 200 );
        $topbar  = (int) ( $settings['topBarHeight'] ?? 46 );
        $density = $settings['density'] ?? 'normal';

        // Density drives menu-item padding. 'relaxed' is now a first-class option
        // (the settings UI offers Normal / Compact / Relaxed).
        switch ( $density ) {
            case 'compact':
                $pad      = '6px 10px';
                $pad_left = '10px';
                break;
            case 'relaxed':
                $pad      = '12px 16px';
                $pad_left = '16px';
                break;
            default: // normal
                $pad      = '8px 12px';
                $pad_left = '12px';
                break;
        }

        // Re-validate the brand color at output time (defense in depth). The save/
        // import paths already hex-validate, but never trust the stored option in a
        // raw CSS context: an invalid value falls back to the default.
        $brand = sanitize_text_field( $brand );
        if ( ! preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $brand ) ) {
            $brand = $wp_brand_color;
        }

        // Derive brand hover tint + contrast text color so the preview's
        // brand-driven highlights are reproduced 1:1 in the real admin.
        $rgb         = saasvibe_hex_to_rgb( $brand );
        $brand_hover = ! empty( $hover ) ? $hover : sprintf( 'rgba(%d,%d,%d,0.10)', $rgb['r'], $rgb['g'], $rgb['b'] );

        // Surfaces that carry text are painted with the legible fill, not the raw
        // pick: a mid-tone around #767676 reaches only ~4.48:1 against both black
        // and white, so the fill itself is nudged clear of that band. Every other
        // brand color passes straight through untouched.
        $target      = saasvibe_contrast_target( $settings );
        $brand_fill  = saasvibe_legible_fill( $rgb, $target );
        $fill_rgb    = saasvibe_hex_to_rgb( $brand_fill );
        $brand_text  = saasvibe_contrast_color( $fill_rgb );

        // Hover washes move the surface AWAY from its text color, so a label keeps
        // its ratio when a hover fill slides underneath it.
        $surface      = saasvibe_surface_rgba( $fill_rgb, 0.12 );
        $surface_up   = saasvibe_surface_rgba( $fill_rgb, 0.15 );
        $line         = saasvibe_surface_rgba( $fill_rgb, 0.14 );

        // Every surface a brand-chrome label can sit on: the chrome itself and the
        // two hover washes. Text colors are checked against all three.
        $wash = function( $alpha ) use ( $fill_rgb, $brand_text ) {
            $channel = '#FFFFFF' === $brand_text ? 0 : 255;
            return [
                'r' => $alpha * $channel + ( 1 - $alpha ) * $fill_rgb['r'],
                'g' => $alpha * $channel + ( 1 - $alpha ) * $fill_rgb['g'],
                'b' => $alpha * $channel + ( 1 - $alpha ) * $fill_rgb['b'],
            ];
        };
        $chrome_surfaces = [ $fill_rgb, $wash( 0.12 ), $wash( 0.15 ) ];

        // Where the brand color is used as a label or icon color rather than as a
        // fill, it has to clear AA against every surface behind it -- resting and
        // hover alike. Classic Elevated paints its chrome with the brand color
        // itself, so there the brand-colored label sits on the derived contrast
        // fill; every other template puts it on the template's own background.
        // Each template's own hover fill, the second surface a label can sit on.
        $accent_hover = 'vercel-minimal' === $template_id ? '#F3F4F6' : '#1A1A1A';

        if ( 'classic-elevated' === $template_id ) {
            $accent_bgs = [ saasvibe_hex_to_rgb( $brand_text ) ];
        } else {
            $base = ! empty( $chrome_bg ) ? $chrome_bg : '#000000';
            $accent_bgs = [ saasvibe_hex_to_rgb( $base ) ];
            // The templates' own hover fill, which the accent label also sits on.
            $accent_bgs[] = saasvibe_hex_to_rgb( $accent_hover );
        }
        $brand_accent = saasvibe_accessible_on( $rgb, $accent_bgs, $target );

        // The templates' own static greys (menu icons, flyout headers, the collapse
        // button) are brand-independent but not target-independent: several clear
        // AA comfortably and land just under AAA. Hold each to the configured
        // target against every surface it is drawn on, so switching to AAA
        // tightens them instead of leaving them behind.
        $muted_surfaces = [];
        foreach ( array_unique( [ $chrome_bg ?: '#000000', $accent_hover ] ) as $muted_surface ) {
            $muted_surfaces[] = saasvibe_hex_to_rgb( $muted_surface );
        }
        $muted_vars = '';
        foreach ( [ 'icon', 'head', 'control' ] as $role ) {
            if ( empty( $muted[ $role ] ) ) {
                continue;
            }
            $muted_vars .= sprintf(
                '--saasvibe-chrome-%s:%s;',
                $role,
                saasvibe_accessible_on( saasvibe_hex_to_rgb( $muted[ $role ] ), $muted_surfaces, $target )
            );
        }

        // Tinted variants of the contrast color, each opaque enough to stay above
        // the target on the chrome and on both hover washes. Templates that paint
        // their chrome with the brand color (Classic Elevated) use these for idle
        // labels and dividers, so those flip with the brand color instead of being
        // hardcoded white on a possibly light background.
        $vars = sprintf(
            ':root{%16$s--saasvibe-brand-color:%1$s;--saasvibe-brand-fill:%2$s;--saasvibe-brand-hover-color:%3$s;'
            . '--saasvibe-brand-text-color:%4$s;--saasvibe-brand-accent:%5$s;'
            . '--saasvibe-brand-text-strong:%6$s;--saasvibe-brand-text-soft:%7$s;--saasvibe-brand-text-faint:%8$s;'
            . '--saasvibe-brand-surface:%9$s;--saasvibe-brand-surface-strong:%10$s;--saasvibe-brand-line:%11$s;'
            . '--saasvibe-sidebar-width:%12$dpx;--saasvibe-topbar-height:%13$dpx;'
            . '--saasvibe-menu-item-padding:%14$s;--saasvibe-menu-item-padding-left:%15$s;}',
            $brand,
            $brand_fill,
            $brand_hover,
            $brand_text,
            $brand_accent,
            saasvibe_contrast_rgba( $fill_rgb, 0.85, $target, $chrome_surfaces ),
            saasvibe_contrast_rgba( $fill_rgb, 0.75, $target, $chrome_surfaces ),
            saasvibe_contrast_rgba( $fill_rgb, 0.6, $target, $chrome_surfaces ),
            $surface,
            $surface_up,
            $line,
            $sidebar,
            $topbar,
            $pad,
            $pad_left,
            $muted_vars
        );

        wp_add_inline_style( 'saasvibe-template', $vars );
        Saasvibe_Logger::debug( "Applied template '$safe_id' to admin chrome" );

    } catch ( Exception $e ) {
        Saasvibe_Logger::error( 'Failed to apply template to admin: ' . $e->getMessage() );
    }
}, 20 );

// ============================================
// 5c. Apply Helpers + Chrome Feature Parity
// ============================================
//
// The settings UI previews a custom sidebar logo, an environment badge, and
// hidden top-bar items. These hooks reproduce those features in the live admin
// so the real dashboard matches the preview.

/**
 * Convert a #hex color (3 or 6 digit) to an [r,g,b] map.
 */
if ( ! function_exists( 'saasvibe_hex_to_rgb' ) ) {
    function saasvibe_hex_to_rgb( $hex ) {
        $hex = ltrim( (string) $hex, '#' );
        if ( strlen( $hex ) === 3 ) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        if ( strlen( $hex ) !== 6 || ! ctype_xdigit( $hex ) ) {
            return [ 'r' => 94, 'g' => 106, 'b' => 210 ]; // #5E6AD2 fallback
        }
        return [
            'r' => hexdec( substr( $hex, 0, 2 ) ),
            'g' => hexdec( substr( $hex, 2, 2 ) ),
            'b' => hexdec( substr( $hex, 4, 2 ) ),
        ];
    }
}

/**
 * WCAG 2.1 relative luminance (0 = black, 1 = white) for an [r,g,b] map.
 *
 * Channels are linearized out of sRGB's gamma curve before being weighted; a
 * plain weighted average of the raw 0-255 channels overstates how bright mid
 * and dark colors are and picks unreadable text for them.
 *
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
if ( ! function_exists( 'saasvibe_relative_luminance' ) ) {
    function saasvibe_relative_luminance( array $rgb ) {
        $channels = [];

        foreach ( [ 'r', 'g', 'b' ] as $key ) {
            $c = ( isset( $rgb[ $key ] ) ? (float) $rgb[ $key ] : 0.0 ) / 255;
            $channels[] = $c <= 0.03928 ? $c / 12.92 : pow( ( $c + 0.055 ) / 1.055, 2.4 );
        }

        return 0.2126 * $channels[0] + 0.7152 * $channels[1] + 0.0722 * $channels[2];
    }
}

/**
 * Pick black or white -- whichever carries more contrast -- for legible text on
 * a given brand color. Mirrors the React idealTextColor() in
 * views/assets/src/utils/color.js so the live admin matches the preview.
 *
 * White wins while the background's relative luminance stays under the
 * crossover point where both candidates yield the same WCAG contrast ratio:
 * sqrt(1.05 * 0.05) - 0.05 ~= 0.1791.
 */
if ( ! function_exists( 'saasvibe_contrast_color' ) ) {
    function saasvibe_contrast_color( array $rgb ) {
        $luminance = saasvibe_relative_luminance( $rgb );
        return $luminance <= ( sqrt( 1.05 * 0.05 ) - 0.05 ) ? '#FFFFFF' : '#000000';
    }
}

/** WCAG 2.1 minimum contrast ratios for body text: AA is 4.5:1, AAA is 7:1. */
if ( ! defined( 'SAASVIBE_AA_CONTRAST' ) ) {
    define( 'SAASVIBE_AA_CONTRAST', 4.5 );
}
if ( ! defined( 'SAASVIBE_AAA_CONTRAST' ) ) {
    define( 'SAASVIBE_AAA_CONTRAST', 7.0 );
}

/**
 * The contrast ratio every derived color is held to, per the site's setting.
 *
 * AAA shifts brand-derived colors further from the picked hue -- on a mid-tone
 * brand color a 7:1 fill is visibly darker or lighter than 4.5:1 -- so it is
 * opt-in rather than the default.
 *
 * @param array $settings Plugin settings.
 * @return float 4.5 or 7.0.
 */
if ( ! function_exists( 'saasvibe_contrast_target' ) ) {
    function saasvibe_contrast_target( array $settings = [] ) {
        return 'aaa' === ( $settings['contrastLevel'] ?? 'aa' )
            ? SAASVIBE_AAA_CONTRAST
            : SAASVIBE_AA_CONTRAST;
    }
}

/**
 * WCAG contrast ratio between two [r,g,b] maps, 1:1 to 21:1.
 */
if ( ! function_exists( 'saasvibe_contrast_ratio' ) ) {
    function saasvibe_contrast_ratio( array $a, array $b ) {
        $la = saasvibe_relative_luminance( $a );
        $lb = saasvibe_relative_luminance( $b );
        return ( max( $la, $lb ) + 0.05 ) / ( min( $la, $lb ) + 0.05 );
    }
}

/**
 * Format an [r,g,b] map as an uppercase #RRGGBB string.
 */
if ( ! function_exists( 'saasvibe_rgb_to_hex' ) ) {
    function saasvibe_rgb_to_hex( array $rgb ) {
        return sprintf(
            '#%02X%02X%02X',
            (int) max( 0, min( 255, round( $rgb['r'] ) ) ),
            (int) max( 0, min( 255, round( $rgb['g'] ) ) ),
            (int) max( 0, min( 255, round( $rgb['b'] ) ) )
        );
    }
}

/**
 * Convert [r,g,b] (0-255) to [h,s,l] with h in degrees and s/l in 0-1.
 */
if ( ! function_exists( 'saasvibe_rgb_to_hsl' ) ) {
    function saasvibe_rgb_to_hsl( array $rgb ) {
        $r = $rgb['r'] / 255;
        $g = $rgb['g'] / 255;
        $b = $rgb['b'] / 255;
        $max = max( $r, $g, $b );
        $min = min( $r, $g, $b );
        $delta = $max - $min;
        $l = ( $max + $min ) / 2;
        $h = 0.0;
        $s = 0.0;

        if ( $delta > 0 ) {
            $s = $delta / ( 1 - abs( 2 * $l - 1 ) );

            if ( $max === $r ) {
                $h = fmod( ( $g - $b ) / $delta, 6 );
            } elseif ( $max === $g ) {
                $h = ( $b - $r ) / $delta + 2;
            } else {
                $h = ( $r - $g ) / $delta + 4;
            }

            $h *= 60;
            if ( $h < 0 ) {
                $h += 360;
            }
        }

        return [ 'h' => $h, 's' => $s, 'l' => $l ];
    }
}

/**
 * Convert [h,s,l] back to [r,g,b] (0-255, unrounded).
 */
if ( ! function_exists( 'saasvibe_hsl_to_rgb' ) ) {
    function saasvibe_hsl_to_rgb( array $hsl ) {
        $c = ( 1 - abs( 2 * $hsl['l'] - 1 ) ) * $hsl['s'];
        $x = $c * ( 1 - abs( fmod( $hsl['h'] / 60, 2 ) - 1 ) );
        $m = $hsl['l'] - $c / 2;
        $sextant = ( (int) floor( $hsl['h'] / 60 ) ) % 6;
        if ( $sextant < 0 ) {
            $sextant += 6;
        }
        $table = [
            [ $c, $x, 0 ],
            [ $x, $c, 0 ],
            [ 0, $c, $x ],
            [ 0, $x, $c ],
            [ $x, 0, $c ],
            [ $c, 0, $x ],
        ];
        list( $r, $g, $b ) = $table[ $sextant ];

        return [
            'r' => ( $r + $m ) * 255,
            'g' => ( $g + $m ) * 255,
            'b' => ( $b + $m ) * 255,
        ];
    }
}

/**
 * Nudge a foreground color's lightness -- hue and saturation untouched -- until
 * it clears $target against the given background, and no further. Mirrors
 * accessibleOn() in views/assets/src/utils/color.js.
 *
 * Keeps brand-colored labels and icons legible on a template's own chrome: a
 * near-black brand color on a black sidebar is lightened just enough to pass, a
 * pale one on a white sidebar is darkened. Colors that already pass come back
 * untouched, so most brand choices render exactly as picked.
 *
 * Pass every surface the color appears on -- an item's resting background AND
 * its hover fill, say -- because a label tuned only to the resting background
 * loses ratio the moment the hover fill slides underneath it.
 *
 * @param array $fg_rgb  Foreground channels.
 * @param array $bg_list Background channels, or a list of them.
 * @param float $target Minimum contrast ratio.
 * @return string Hex color meeting the target where achievable.
 */
if ( ! function_exists( 'saasvibe_accessible_on' ) ) {
    function saasvibe_accessible_on( array $fg_rgb, array $bg_list, $target = SAASVIBE_AA_CONTRAST ) {
        // A single [r,g,b] map is accepted as shorthand for a one-surface list.
        if ( isset( $bg_list['r'] ) ) {
            $bg_list = [ $bg_list ];
        }

        $worst = function( array $color ) use ( $bg_list ) {
            $ratios = [];
            foreach ( $bg_list as $bg ) {
                $ratios[] = saasvibe_contrast_ratio( $color, $bg );
            }
            return min( $ratios );
        };

        if ( $worst( $fg_rgb ) >= $target ) {
            return saasvibe_rgb_to_hex( $fg_rgb );
        }

        $hsl = saasvibe_rgb_to_hsl( $fg_rgb );

        // Candidates are measured after rounding to 8-bit hex, so the ratio
        // checked here is the ratio the browser will actually render.
        $at = function( $l ) use ( $hsl ) {
            $hsl['l'] = $l;
            return saasvibe_hex_to_rgb( saasvibe_rgb_to_hex( saasvibe_hsl_to_rgb( $hsl ) ) );
        };

        // Move away from the backgrounds: lighten on dark ones, darken on light.
        // A saturated hue can top out below the target at one end, so the other
        // direction is tried before giving up.
        $sum = 0.0;
        foreach ( $bg_list as $bg ) {
            $sum += saasvibe_relative_luminance( $bg );
        }
        $bg_is_dark = ( $sum / count( $bg_list ) ) < 0.1791;
        $directions = $bg_is_dark ? [ 1.0, 0.0 ] : [ 0.0, 1.0 ];

        foreach ( $directions as $bound ) {
            if ( $worst( $at( $bound ) ) < $target ) {
                continue;
            }

            // Smallest lightness shift that still passes, so the adjusted color
            // stays as close to the user's pick as possible.
            $near = $hsl['l'];
            $far  = $bound;

            for ( $i = 0; $i < 24; $i++ ) {
                $mid = ( $near + $far ) / 2;

                if ( $worst( $at( $mid ) ) >= $target ) {
                    $far = $mid;
                } else {
                    $near = $mid;
                }
            }

            return saasvibe_rgb_to_hex( $at( $far ) );
        }

        // Fully desaturated fallback: black or white, whichever the backgrounds take.
        return saasvibe_contrast_color( $bg_list[0] );
    }
}

/**
 * Nudge a fill color's lightness until black or white text can clear $target on
 * top of it, and no further. Mirrors legibleFill() in utils/color.js.
 *
 * Mid-tone colors around #767676 top out near 4.48:1 against both black and
 * white -- no text color can rescue them, so the fill itself has to give. Every
 * surface that carries text on a brand fill is painted with this rather than the
 * raw pick, so no brand color leaves text under AA. Anything already clear of
 * the band comes back untouched.
 *
 * @param array $rgb    Fill color channels.
 * @param float $target Minimum contrast ratio.
 * @return string Hex color whose ideal text color meets the target.
 */
if ( ! function_exists( 'saasvibe_legible_fill' ) ) {
    function saasvibe_legible_fill( array $rgb, $target = SAASVIBE_AA_CONTRAST ) {
        $best = function( array $color ) {
            return max(
                saasvibe_contrast_ratio( $color, [ 'r' => 255, 'g' => 255, 'b' => 255 ] ),
                saasvibe_contrast_ratio( $color, [ 'r' => 0, 'g' => 0, 'b' => 0 ] )
            );
        };

        if ( $best( $rgb ) >= $target ) {
            return saasvibe_rgb_to_hex( $rgb );
        }

        $hsl = saasvibe_rgb_to_hsl( $rgb );
        $at  = function( $l ) use ( $hsl ) {
            $hsl['l'] = $l;
            return saasvibe_hex_to_rgb( saasvibe_rgb_to_hex( saasvibe_hsl_to_rgb( $hsl ) ) );
        };

        // The band is narrow, so both exits are close. Take whichever is the
        // smaller departure from the color the user picked.
        $candidates = [];

        foreach ( [ 0.0, 1.0 ] as $bound ) {
            if ( $best( $at( $bound ) ) < $target ) {
                continue;
            }

            $near = $hsl['l'];
            $far  = $bound;

            for ( $i = 0; $i < 24; $i++ ) {
                $mid = ( $near + $far ) / 2;

                if ( $best( $at( $mid ) ) >= $target ) {
                    $far = $mid;
                } else {
                    $near = $mid;
                }
            }

            $candidates[] = [ 'l' => $far, 'distance' => abs( $far - $hsl['l'] ) ];
        }

        if ( empty( $candidates ) ) {
            return saasvibe_rgb_to_hex( $rgb );
        }

        usort( $candidates, function( $a, $b ) {
            return $a['distance'] <=> $b['distance'];
        } );

        return saasvibe_rgb_to_hex( $at( $candidates[0]['l'] ) );
    }
}

/**
 * A translucent wash for hover fills, dividers and panel borders drawn on a
 * brand-painted surface. Mirrors surfaceTint() in utils/color.js.
 *
 * The INVERSE of saasvibe_contrast_rgba(): it uses the channel furthest from the
 * text color, so the fill slides the background away from the text rather than
 * toward it. Washing a light brand chrome with black would darken it under its
 * own dark labels and drop them below AA; lightening it further keeps them clear.
 *
 * @param array $rgb   Surface color channels.
 * @param float $alpha Opacity, 0-1.
 * @return string rgba() string.
 */
if ( ! function_exists( 'saasvibe_surface_rgba' ) ) {
    function saasvibe_surface_rgba( array $rgb, $alpha ) {
        $channel = '#FFFFFF' === saasvibe_contrast_color( $rgb ) ? 0 : 255;
        return sprintf(
            'rgba(%1$d,%1$d,%1$d,%2$s)',
            $channel,
            rtrim( rtrim( number_format( (float) $alpha, 2, '.', '' ), '0' ), '.' )
        );
    }
}

/**
 * A translucent tint of the contrast color chosen for the given background --
 * white tints on dark brand colors, black tints on light ones -- opaque enough
 * to still clear $target. Used for idle labels, dividers and hover fills that
 * sit on brand-painted chrome. Mirrors contrastTint() in utils/color.js.
 *
 * @param array $rgb    Background color channels.
 * @param float $alpha  Preferred opacity, 0-1.
 * @param float $target Minimum contrast ratio, 0 to skip the check.
 * @return string rgba() string.
 */
if ( ! function_exists( 'saasvibe_contrast_rgba' ) ) {
    function saasvibe_contrast_rgba( array $rgb, $alpha, $target = SAASVIBE_AA_CONTRAST, array $against = [] ) {
        $channel   = '#FFFFFF' === saasvibe_contrast_color( $rgb ) ? 255 : 0;
        $surfaces  = ! empty( $against ) ? $against : [ $rgb ];

        // Composited channels are rounded to 8 bits, the way the browser will
        // rasterize them -- checking the float would pass tints that render a
        // shade short of the target.
        $composite = function( $a ) use ( $channel, $rgb ) {
            return [
                'r' => round( $a * $channel + ( 1 - $a ) * $rgb['r'] ),
                'g' => round( $a * $channel + ( 1 - $a ) * $rgb['g'] ),
                'b' => round( $a * $channel + ( 1 - $a ) * $rgb['b'] ),
            ];
        };

        $worst = function( $a ) use ( $composite, $surfaces ) {
            $ratios = [];
            foreach ( $surfaces as $surface ) {
                $ratios[] = saasvibe_contrast_ratio( $composite( $a ), $surface );
            }
            return min( $ratios );
        };

        $resolved = (float) $alpha;

        if ( $target > 0 && $worst( $resolved ) < $target ) {
            // Contrast rises monotonically with alpha, and fully opaque is the
            // contrast color itself -- the best this background can do.
            $low  = $resolved;
            $high = 1.0;

            for ( $i = 0; $i < 16; $i++ ) {
                $mid = ( $low + $high ) / 2;

                if ( $worst( $mid ) >= $target ) {
                    $high = $mid;
                } else {
                    $low = $mid;
                }
            }

            // The emitted alpha carries two decimals, so round UP -- rounding down
            // would ship a slightly thinner tint than the one just verified.
            $resolved = min( 1.0, ceil( $high * 100 ) / 100 );
        }

        return sprintf(
            'rgba(%1$d,%1$d,%1$d,%2$s)',
            $channel,
            rtrim( rtrim( number_format( $resolved, 2, '.', '' ), '0' ), '.' )
        );
    }
}

/**
 * Resolve the active settings, or null when the plugin should not apply (no
 * template selected). Centralizes the guard shared by every chrome hook.
 *
 * NOTE: roleVisibility is NOT a styling gate. It controls per-role admin-menu
 * hiding (see saasvibe_apply_role_menu_visibility()). The template styling
 * applies to every admin user once a template is selected.
 */
if ( ! function_exists( 'saasvibe_get_applied_settings' ) ) {
    function saasvibe_get_applied_settings() {
        $settings = get_option( 'saasvibe_settings', [] );

        if ( empty( $settings['templateId'] ) ) {
            return null;
        }

        return $settings;
    }
}

/**
 * Snapshot the full admin menu BEFORE any role-based hiding runs (priority 1,
 * which fires before the removal hook at priority 999). The settings UI builds
 * its Role Visibility matrix from this snapshot so every menu item stays listed
 * even after some are hidden for the current user's role — otherwise a hidden
 * item would drop off the matrix and could never be re-enabled.
 */
add_action( 'admin_menu', function() {
    global $menu;
    $GLOBALS['saasvibe_menu_snapshot'] = is_array( $menu ) ? $menu : [];
}, 1 );

/**
 * Role-based menu visibility.
 *
 * The Role Visibility matrix stores roleVisibility[ roleKey ][ menuItemId ] = true
 * to mean "hide this top-level menu for this role". The stored menuItemId matches
 * the id the settings UI was given (the menu's HTML id, e.g. "menu-comments", or a
 * "menu-{slug}" fallback), so we rebuild the same id => menu-slug map from the live
 * $menu and remove any flagged items for the current user's roles.
 */
add_action( 'admin_menu', function() {
    $settings = get_option( 'saasvibe_settings', [] );
    $role_vis = $settings['roleVisibility'] ?? [];
    if ( empty( $role_vis ) || ! is_array( $role_vis ) ) {
        return;
    }

    $user = wp_get_current_user();
    if ( empty( $user->roles ) ) {
        return;
    }

    // Build id => menu_slug map from the current admin menu.
    global $menu;
    $id_to_slug = [];
    if ( ! empty( $menu ) ) {
        foreach ( $menu as $item ) {
            if ( empty( $item[0] ) ) {
                continue;
            }
            $slug       = $item[2];
            $clean_slug = sanitize_title( $slug );
            $id         = ! empty( $item[5] ) ? $item[5] : ( 'menu-' . $clean_slug );
            $id_to_slug[ $id ] = $slug;
        }
    }

    // Collect the menu ids hidden for any of the current user's roles.
    $hidden_ids = [];
    foreach ( (array) $user->roles as $role ) {
        if ( empty( $role_vis[ $role ] ) || ! is_array( $role_vis[ $role ] ) ) {
            continue;
        }
        foreach ( $role_vis[ $role ] as $item_id => $is_hidden ) {
            if ( $is_hidden ) {
                $hidden_ids[ $item_id ] = true;
            }
        }
    }

    // The plugin's own screen lives under Settings. Removing that menu for a user
    // who can still manage options would strand them: no way back to this UI to
    // undo the setting. Keep Settings reachable for those users; every other menu
    // (and every other role) hides as configured.
    $self_host = 'options-general.php';

    foreach ( array_keys( $hidden_ids ) as $item_id ) {
        if ( ! isset( $id_to_slug[ $item_id ] ) ) {
            continue;
        }

        if ( $self_host === $id_to_slug[ $item_id ] && current_user_can( 'manage_options' ) ) {
            Saasvibe_Logger::warning( 'Skipped hiding Settings for a user who can manage options (would remove access to this plugin).' );
            continue;
        }

        remove_menu_page( $id_to_slug[ $item_id ] );
    }
}, 999 );

// --- Custom site logo -------------------------------------------------------
// The logo replaces the house glyph on the toolbar's site-name node, so it sits
// where WordPress already puts the site's identity. Two shapes:
//
//   icon - a square mark alongside the site name, the way core pairs its glyph
//          with the name.
//   full - a wordmark on its own; the name is dropped, since a wordmark already
//          carries it.
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    $settings = saasvibe_get_applied_settings();
    if ( null === $settings ) {
        return;
    }

    $logo = $settings['customLogo'] ?? '';
    if ( empty( $logo ) ) {
        return;
    }

    // Nothing to attach to if the site name was hidden in the top-bar settings.
    if ( ! $wp_admin_bar->get_node( 'site-name' ) ) {
        return;
    }

    $type = 'full' === ( $settings['logoType'] ?? 'icon' ) ? 'full' : 'icon';
    $name = get_bloginfo( 'name' );

    $img = sprintf(
        '<img src="%1$s" alt="%2$s" class="saasvibe-site-logo saasvibe-site-logo--%3$s" />',
        esc_url( $logo ),
        esc_attr(
            'full' === $type
                ? $name
                /* translators: %s: site name, used as the logo's alt text. */
                : sprintf( __( '%s logo', 'saasvibe' ), $name )
        ),
        esc_attr( $type )
    );

    $wp_admin_bar->add_node( [
        'id'    => 'site-name',
        'title' => 'full' === $type
            ? $img
            : $img . '<span class="saasvibe-site-logo-name">' . esc_html( $name ) . '</span>',
    ] );
}, 999 );

// Size the logo against the configured bar height and suppress core's house
// glyph, which would otherwise sit next to it.
add_action( 'admin_enqueue_scripts', function() {
    $settings = saasvibe_get_applied_settings();
    if ( null === $settings || empty( $settings['customLogo'] ) ) {
        return;
    }

    // A short bar would otherwise shrink the logo to nothing, so the height is
    // floored -- overflow is hidden by the bar rather than the logo vanishing.
    $css = '#wpadminbar #wp-admin-bar-site-name > .ab-item::before{display:none !important;}'
        . '#wpadminbar .saasvibe-site-logo{display:inline-block !important;width:auto !important;'
        . 'vertical-align:middle !important;object-fit:contain !important;}'
        . '#wpadminbar .saasvibe-site-logo--icon{height:auto !important;'
        . 'max-height:clamp(16px, calc(var(--saasvibe-topbar-height, 46px) - 14px), 28px) !important;'
        . 'max-width:40px !important;margin-inline-end:8px !important;}'
        . '#wpadminbar .saasvibe-site-logo--full{height:auto !important;'
        . 'max-height:clamp(18px, calc(var(--saasvibe-topbar-height, 46px) - 12px), 40px) !important;'
        . 'max-width:180px !important;}'
        . '#wpadminbar .saasvibe-site-logo-name{vertical-align:middle !important;}';

    if ( wp_style_is( 'saasvibe-template', 'enqueued' ) ) {
        wp_add_inline_style( 'saasvibe-template', $css );
    } else {
        wp_add_inline_style( 'admin-bar', $css );
    }
}, 21 );

// --- Environment badge + hidden top-bar items -------------------------------
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    $settings = saasvibe_get_applied_settings();
    if ( null === $settings ) {
        return;
    }

    // Hide selected native nodes.
    $hide = $settings['hideTopBarItems'] ?? [];
    $node_map = [
        'wpLogo'        => 'wp-logo',
        'siteName'      => 'site-name',
        'search'        => 'search',
        'notifications' => 'comments',
        'howdy'         => 'my-account',
    ];
    foreach ( $node_map as $key => $node_id ) {
        if ( ! empty( $hide[ $key ] ) ) {
            $wp_admin_bar->remove_node( $node_id );
        }
    }

    // Environment badge (right side).
    $badge = $settings['environmentBadge'] ?? [];
    if ( ! empty( $badge['enabled'] ) ) {
        $label = $badge['label'] ?? 'Development';
        $wp_admin_bar->add_node( [
            'id'     => 'saasvibe-env-badge',
            'parent' => 'top-secondary',
            'title'  => '<span class="saasvibe-env-badge">' . esc_html( $label ) . '</span>',
            'meta'   => [ 'class' => 'saasvibe-env-badge-node' ],
        ] );
    }
}, 999 );

// Style the environment badge pill to match the preview.
add_action( 'admin_enqueue_scripts', function() {
    $settings = saasvibe_get_applied_settings();
    if ( null === $settings ) {
        return;
    }
    $badge = $settings['environmentBadge'] ?? [];
    if ( empty( $badge['enabled'] ) ) {
        return;
    }

    $color = $badge['color'] ?? '#5E6AD2';
    if ( ! preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color ) ) {
        $color = '#5E6AD2';
    }

    // Pick black or white text for legibility against the chosen badge color so a
    // light badge (e.g. #FFEB3B) doesn't render white-on-light and fail contrast.
    // The pill itself is painted with the legible fill, so a mid-tone badge color
    // (where neither black nor white clears AA) is nudged clear of that band.
    $color      = saasvibe_legible_fill( saasvibe_hex_to_rgb( $color ), saasvibe_contrast_target( $settings ) );
    $text_color = saasvibe_contrast_color( saasvibe_hex_to_rgb( $color ) );

    $css = sprintf(
        '#wpadminbar .saasvibe-env-badge{display:inline-block;background:%1$s !important;color:%2$s !important;'
        . 'font-size:11px;font-weight:600;line-height:1.6;padding:0 10px;border-radius:9999px;'
        . 'letter-spacing:.02em;}'
        . '#wpadminbar #wp-admin-bar-saasvibe-env-badge .ab-item{background:transparent !important;}',
        $color,
        $text_color
    );

    // Attach to our template stylesheet when present, else to the admin bar style.
    if ( wp_style_is( 'saasvibe-template', 'enqueued' ) ) {
        wp_add_inline_style( 'saasvibe-template', $css );
    } else {
        wp_add_inline_style( 'admin-bar', $css );
    }
}, 21 );

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
