<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load routes
require_once SAASMENU_PATH . 'routes/templates.php';

/**
 * Register Admin Settings Page
 */
add_action( 'admin_menu', function() {
    add_options_page(
        __( 'Nav Designer', 'saasmenu' ),
        __( 'Nav Designer', 'saasmenu' ),
        'manage_options',
        'saasmenu',
        'saasmenu_render_settings_page'
    );
} );

/**
 * Render Settings Page Mount Point
 */
function saasmenu_render_settings_page() {
    echo '<div id="saasmenu-app"></div>';
    echo '<div id="saasmenu-portal-root"></div>';
}

/**
 * Enqueue Admin Settings Assets (React App)
 */
add_action( 'admin_enqueue_scripts', function( $hook ) {
    // Only load React app assets on our settings page
    if ( 'settings_page_saasmenu' !== $hook ) {
        return;
    }

    // Enqueue WP Media Library helper scripts
    wp_enqueue_media();

    $js_url = SAASMENU_URL . 'views/assets/dist/saasmenu.js';
    $css_url = SAASMENU_URL . 'views/assets/dist/saasmenu.css';

    // We enqueue wp-element (WordPress standard package for React + ReactDOM)
    // and wp-i18n (WordPress translation package)
    wp_enqueue_script(
        'saasmenu-admin',
        $js_url,
        [ 'wp-element', 'wp-i18n' ],
        SAASMENU_VERSION,
        true
    );

    wp_enqueue_style(
        'saasmenu-admin',
        $css_url,
        [],
        SAASMENU_VERSION
    );

    // Get current settings
    $settings = get_option( 'saasmenu_settings', [] );
    $license  = get_option( 'saasmenu_license', [] );
    $is_pro   = ! empty( $license['tier'] ) && in_array( $license['tier'], [ 'pro', 'agency' ], true );

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

    // Load templates catalogue
    $controller = new \SaasMenu\Controllers\Template_Controller();
    $templates = $controller->get_templates_list();

    // Localize React App variables
    wp_localize_script( 'saasmenu-admin', 'SaasMenu_Vars', [
        'rest_url'   => esc_url_raw( rest_url( 'saasmenu/v1/' ) ),
        'permission' => wp_create_nonce( 'wp_rest' ),
        'is_admin'   => current_user_can( 'manage_options' ),
        'is_pro'     => $is_pro,
        'settings'   => $settings,
        'templates'  => $templates,
        'roles'      => $roles_list,
        'menuItems'  => $menu_list,
        'language'   => [
            'locale_data' => [
                'saasmenu' => [
                    '' => [
                        'domain' => 'saasmenu',
                        'lang'   => get_user_locale(),
                    ],
                ],
            ],
        ],
    ] );
} );

/**
 * Enqueue Active Template and CSS Custom Properties globally in admin
 */
add_action( 'admin_enqueue_scripts', function() {
    // Check if Safe Mode is activated via query param
    if ( isset( $_GET['saasmenu_safe_mode'] ) && '1' === $_GET['saasmenu_safe_mode'] ) {
        return;
    }

    $settings = get_option( 'saasmenu_settings', [] );
    if ( empty( $settings['templateId'] ) ) {
        return;
    }

    $template_id = sanitize_key( $settings['templateId'] );
    
    // Check if template file exists
    $template_css_file = SAASMENU_PATH . 'assets/css/templates/' . $template_id . '.css';
    $template_css_url  = SAASMENU_URL . 'assets/css/templates/' . $template_id . '.css';

    if ( file_exists( $template_css_file ) ) {
        wp_enqueue_style(
            'saasmenu-template-' . $template_id,
            $template_css_url,
            [],
            SAASMENU_VERSION
        );

        // Derive and inject dynamic CSS variables
        $controller = new \SaasMenu\Controllers\Template_Controller();
        $custom_css = $controller->generate_dynamic_css( $settings );

        if ( ! empty( $custom_css ) ) {
            wp_add_inline_style( 'saasmenu-template-' . $template_id, $custom_css );
        }
    }
}, 99 );

/**
 * Append User Roles as Admin Body Class
 */
add_filter( 'admin_body_class', function( $classes ) {
    $current_user = wp_get_current_user();
    if ( ! empty( $current_user->roles ) ) {
        foreach ( $current_user->roles as $role ) {
            $classes .= ' role-' . sanitize_html_class( $role );
        }
    }
    return $classes;
} );

/**
 * Customize WP Admin Bar (Top Bar)
 */
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    // Check Safe Mode
    if ( isset( $_GET['saasmenu_safe_mode'] ) && '1' === $_GET['saasmenu_safe_mode'] ) {
        return;
    }

    $settings = get_option( 'saasmenu_settings', [] );
    if ( empty( $settings ) ) {
        return;
    }

    // Hide default nodes if configured
    $hide_settings = isset( $settings['hideTopBarItems'] ) ? $settings['hideTopBarItems'] : [];
    
    if ( ! empty( $hide_settings['wpLogo'] ) ) {
        $wp_admin_bar->remove_node( 'wp-logo' );
    }
    if ( ! empty( $hide_settings['siteName'] ) ) {
        $wp_admin_bar->remove_node( 'site-name' );
    }
    if ( ! empty( $hide_settings['search'] ) ) {
        $wp_admin_bar->remove_node( 'search' );
    }
    if ( ! empty( $hide_settings['notifications'] ) ) {
        $wp_admin_bar->remove_node( 'comments' ); // Comments are the notification hook in standard WP
    }
    if ( ! empty( $hide_settings['howdy'] ) ) {
        // Howdy is inside user-info. We will restyle it using CSS instead since deleting the node deletes the user menu.
    }

    // Add Environment Badge if active
    $env_badge = isset( $settings['environmentBadge'] ) ? $settings['environmentBadge'] : [];
    if ( ! empty( $env_badge['enabled'] ) ) {
        $label = ! empty( $env_badge['label'] ) ? $env_badge['label'] : wp_get_environment_type();
        $color = ! empty( $env_badge['color'] ) ? $env_badge['color'] : '#5E6AD2';
        
        $wp_admin_bar->add_node( [
            'id'    => 'saasmenu-env-badge',
            'title' => sprintf(
                '<span class="saasmenu-env-badge-pill" style="background-color: %s; color: #fff; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; line-height: 1; display: inline-block; vertical-align: middle;">%s</span>',
                esc_attr( $color ),
                esc_html( $label )
            ),
            'href'  => '#',
            'meta'  => [
                'class' => 'saasmenu-env-badge-container',
            ],
        ] );
    }

    // Handle Custom Logo in Top Bar
    if ( ! empty( $settings['customLogo'] ) ) {
        // If site name is removed or we want the custom logo to replace/augment the site name link
        $logo_html = sprintf(
            '<div class="saasmenu-topbar-logo-wrapper"><img class="saasmenu-topbar-logo" src="%s" alt="%s" style="max-height: 24px; max-width: 150px; object-fit: contain; vertical-align: middle;" /></div>',
            esc_url( $settings['customLogo'] ),
            esc_attr( get_bloginfo( 'name' ) )
        );

        $wp_admin_bar->add_node( [
            'id'    => 'saasmenu-site-logo',
            'title' => $logo_html,
            'href'  => admin_url(),
            'meta'  => [
                'class' => 'saasmenu-topbar-logo-node',
            ],
        ] );
    }
}, 11 );

/**
 * Handle custom JS scripts globally in admin (e.g. prepending sidebar custom logo)
 */
add_action( 'admin_footer', function() {
    if ( isset( $_GET['saasmenu_safe_mode'] ) && '1' === $_GET['saasmenu_safe_mode'] ) {
        return;
    }

    $settings = get_option( 'saasmenu_settings', [] );
    if ( empty( $settings ) ) {
        return;
    }

    $custom_logo = ! empty( $settings['customLogo'] ) ? esc_url( $settings['customLogo'] ) : '';
    $site_name   = esc_html( get_bloginfo( 'name' ) );
    
    // Check if we want a logo in the sidebar
    // We can inject it using a tiny footer script
    ?>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            var adminMenu = document.getElementById('adminmenu');
            var customLogo = <?php echo json_encode( $custom_logo ); ?>;
            var siteName = <?php echo json_encode( $site_name ); ?>;
            
            if (adminMenu && customLogo) {
                // Remove existing sidebar logo if any
                var existingLogo = document.getElementById('saasmenu-sidebar-logo-wrap');
                if (existingLogo) {
                    existingLogo.remove();
                }
                
                var logoWrap = document.createElement('div');
                logoWrap.id = 'saasmenu-sidebar-logo-wrap';
                logoWrap.className = 'saasmenu-sidebar-logo-container';
                logoWrap.style.padding = '16px';
                logoWrap.style.textAlign = 'center';
                logoWrap.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
                
                var logoImg = document.createElement('img');
                logoImg.src = customLogo;
                logoImg.alt = siteName;
                logoImg.style.maxHeight = '40px';
                logoImg.style.maxWidth = '100%';
                logoImg.style.objectFit = 'contain';
                logoImg.style.display = 'block';
                logoImg.style.margin = '0 auto';
                
                logoWrap.appendChild(logoImg);
                adminMenu.insertBefore(logoWrap, adminMenu.firstChild);
            }
        });
    </script>
    <?php
} );
