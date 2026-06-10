<?php
namespace SaasMenu\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Template_Controller {

    /**
     * Get list of all available templates
     */
    public function get_templates_list() {
        return [
            [
                'id'            => 'linear-dark',
                'name'          => __( 'Linear Dark', 'saasmenu' ),
                'style'         => 'sidebar',
                'tier'          => 'free',
                'designRef'     => 'Linear.app',
                'defaultColors' => [
                    'background' => '#16161A',
                    'text'       => '#FFFFFF',
                    'accent'     => '#5E6AD2',
                    'hover'      => '#1E1E24',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/linear-dark.png',
            ],
            [
                'id'            => 'vercel-minimal',
                'name'          => __( 'Vercel Minimal', 'saasmenu' ),
                'style'         => 'sidebar',
                'tier'          => 'free',
                'designRef'     => 'Vercel.com',
                'defaultColors' => [
                    'background' => '#FFFFFF',
                    'text'       => '#000000',
                    'accent'     => '#000000',
                    'hover'      => '#F3F4F6',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/vercel-minimal.png',
            ],
            [
                'id'            => 'classic-elevated',
                'name'          => __( 'Classic Elevated', 'saasmenu' ),
                'style'         => 'both',
                'tier'          => 'free',
                'designRef'     => 'WordPress',
                'defaultColors' => [
                    'background' => '#154B75',
                    'text'       => '#FFFFFF',
                    'accent'     => '#2271B1',
                    'hover'      => '#1B5B8E',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/classic-elevated.png',
            ],
            [
                'id'            => 'stripe-crisp',
                'name'          => __( 'Stripe Crisp', 'saasmenu' ),
                'style'         => 'both',
                'tier'          => 'pro',
                'designRef'     => 'Stripe.com',
                'defaultColors' => [
                    'background' => '#FFFFFF',
                    'text'       => '#333333',
                    'accent'     => '#6772E5',
                    'hover'      => '#F6F9FC',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/stripe-crisp.png',
            ],
            [
                'id'            => 'notion-panel',
                'name'          => __( 'Notion Panel', 'saasmenu' ),
                'style'         => 'sidebar',
                'tier'          => 'pro',
                'designRef'     => 'Notion.so',
                'defaultColors' => [
                    'background' => '#F7F6F3',
                    'text'       => '#37352F',
                    'accent'     => '#2EAADC',
                    'hover'      => '#EFEFED',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/notion-panel.png',
            ],
            [
                'id'            => 'github-dark',
                'name'          => __( 'GitHub Dark', 'saasmenu' ),
                'style'         => 'sidebar',
                'tier'          => 'pro',
                'designRef'     => 'GitHub.com',
                'defaultColors' => [
                    'background' => '#0D1117',
                    'text'       => '#C9D1D9',
                    'accent'     => '#238636',
                    'hover'      => '#161B22',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/github-dark.png',
            ],
            [
                'id'            => 'figma-light',
                'name'          => __( 'Figma Light', 'saasmenu' ),
                'style'         => 'both',
                'tier'          => 'pro',
                'designRef'     => 'Figma.com',
                'defaultColors' => [
                    'background' => '#FFFFFF',
                    'text'       => '#2C2C2C',
                    'accent'     => '#18A0FB',
                    'hover'      => '#F5F5F5',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/figma-light.png',
            ],
            [
                'id'            => 'loom-bold',
                'name'          => __( 'Loom Bold', 'saasmenu' ),
                'style'         => 'sidebar',
                'tier'          => 'pro',
                'designRef'     => 'Loom.com',
                'defaultColors' => [
                    'background' => '#7B5EA7',
                    'text'       => '#FFFFFF',
                    'accent'     => '#FF6B6B',
                    'hover'      => '#694E91',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/loom-bold.png',
            ],
            [
                'id'            => 'shopify-polaris',
                'name'          => __( 'Shopify Polaris', 'saasmenu' ),
                'style'         => 'both',
                'tier'          => 'pro',
                'designRef'     => 'Shopify.com',
                'defaultColors' => [
                    'background' => '#008060',
                    'text'       => '#FFFFFF',
                    'accent'     => '#5C5F62',
                    'hover'      => '#006E52',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/shopify-polaris.png',
            ],
            [
                'id'            => 'framer-glass',
                'name'          => __( 'Framer Glass', 'saasmenu' ),
                'style'         => 'both',
                'tier'          => 'pro',
                'designRef'     => 'Framer.com',
                'defaultColors' => [
                    'background' => '#F3F3F3',
                    'text'       => '#111111',
                    'accent'     => '#0055FF',
                    'hover'      => '#EAEAEA',
                ],
                'thumbnailUrl'  => SAASMENU_URL . 'assets/images/framer-glass.png',
            ],
        ];
    }

    /**
     * REST: GET /templates
     */
    public function get_templates( \WP_REST_Request $request ) {
        return rest_ensure_response( [
            'data' => $this->get_templates_list(),
        ] );
    }

    /**
     * REST: GET /settings
     */
    public function get_settings( \WP_REST_Request $request ) {
        $settings = get_option( 'saasmenu_settings', [] );
        return rest_ensure_response( [
            'data' => $settings,
        ] );
    }

    /**
     * REST: POST /settings
     */
    public function save_settings( \WP_REST_Request $request ) {
        $params = wp_unslash( $request->get_params() );

        // License and pro validation
        $license  = get_option( 'saasmenu_license', [] );
        $is_pro   = ! empty( $license['tier'] ) && in_array( $license['tier'], [ 'pro', 'agency' ], true );

        $template_id = isset( $params['templateId'] ) ? sanitize_key( $params['templateId'] ) : 'linear-dark';
        
        // Find template tier
        $templates = $this->get_templates_list();
        $target_template = null;
        foreach ( $templates as $tpl ) {
            if ( $tpl['id'] === $template_id ) {
                $target_template = $tpl;
                break;
            }
        }

        // If template is Pro but current license is not Pro, block save.
        if ( $target_template && 'pro' === $target_template['tier'] && ! $is_pro ) {
            return new \WP_Error(
                'saasmenu_error',
                __( 'Selected template is a Pro feature. Please activate a Pro license.', 'saasmenu' ),
                [ 'status' => 403 ]
            );
        }

        // Sanitize incoming settings
        $sanitized_settings = [
            'templateId'       => $template_id,
            'brandColor'       => isset( $params['brandColor'] ) ? sanitize_hex_color( $params['brandColor'] ) : '#5E6AD2',
            'darkMode'         => isset( $params['darkMode'] ) ? (bool) $params['darkMode'] : true,
            'density'          => isset( $params['density'] ) ? sanitize_text_field( $params['density'] ) : 'normal',
            'customLogo'       => isset( $params['customLogo'] ) ? esc_url_raw( $params['customLogo'] ) : '',
            'topBarHeight'     => isset( $params['topBarHeight'] ) ? min( 52, max( 32, intval( $params['topBarHeight'] ) ) ) : 46,
            'sidebarWidth'     => isset( $params['sidebarWidth'] ) ? min( 320, max( 200, intval( $params['sidebarWidth'] ) ) ) : 240,
            'wizard_completed' => isset( $params['wizard_completed'] ) ? (bool) $params['wizard_completed'] : false,
        ];

        // Sanitize Environment Badge settings
        if ( isset( $params['environmentBadge'] ) && is_array( $params['environmentBadge'] ) ) {
            $sanitized_settings['environmentBadge'] = [
                'enabled' => isset( $params['environmentBadge']['enabled'] ) ? (bool) $params['environmentBadge']['enabled'] : false,
                'label'   => isset( $params['environmentBadge']['label'] ) ? sanitize_text_field( $params['environmentBadge']['label'] ) : '',
                'color'   => isset( $params['environmentBadge']['color'] ) ? sanitize_hex_color( $params['environmentBadge']['color'] ) : '#5E6AD2',
            ];
        } else {
            $sanitized_settings['environmentBadge'] = [
                'enabled' => false,
                'label'   => '',
                'color'   => '#5E6AD2',
            ];
        }

        // Sanitize Top Bar Hide options
        if ( isset( $params['hideTopBarItems'] ) && is_array( $params['hideTopBarItems'] ) ) {
            $sanitized_settings['hideTopBarItems'] = [
                'wpLogo'        => isset( $params['hideTopBarItems']['wpLogo'] ) ? (bool) $params['hideTopBarItems']['wpLogo'] : false,
                'siteName'      => isset( $params['hideTopBarItems']['siteName'] ) ? (bool) $params['hideTopBarItems']['siteName'] : false,
                'search'        => isset( $params['hideTopBarItems']['search'] ) ? (bool) $params['hideTopBarItems']['search'] : false,
                'notifications' => isset( $params['hideTopBarItems']['notifications'] ) ? (bool) $params['hideTopBarItems']['notifications'] : false,
                'howdy'         => isset( $params['hideTopBarItems']['howdy'] ) ? (bool) $params['hideTopBarItems']['howdy'] : false,
            ];
        } else {
            $sanitized_settings['hideTopBarItems'] = [
                'wpLogo'        => false,
                'siteName'      => false,
                'search'        => false,
                'notifications' => false,
                'howdy'         => false,
            ];
        }

        // Sanitize Role Visibility mappings
        if ( isset( $params['roleVisibility'] ) && is_array( $params['roleVisibility'] ) ) {
            $sanitized_visibility = [];
            foreach ( $params['roleVisibility'] as $role => $menu_mapping ) {
                $role_key = sanitize_key( $role );
                if ( is_array( $menu_mapping ) ) {
                    $sanitized_visibility[ $role_key ] = [];
                    foreach ( $menu_mapping as $menu_id => $is_hidden ) {
                        $sanitized_visibility[ $role_key ][ sanitize_key( $menu_id ) ] = (bool) $is_hidden;
                    }
                }
            }
            $sanitized_settings['roleVisibility'] = $sanitized_visibility;
        } else {
            $sanitized_settings['roleVisibility'] = [];
        }

        update_option( 'saasmenu_settings', $sanitized_settings );

        do_action( 'saasmenu_after_save_settings', $sanitized_settings );

        return rest_ensure_response( [
            'success' => true,
            'data'    => $sanitized_settings,
        ] );
    }

    /**
     * REST: GET /settings/export
     */
    public function export_settings( \WP_REST_Request $request ) {
        $settings = get_option( 'saasmenu_settings', [] );
        
        $response = new \WP_REST_Response( $settings );
        $response->header( 'Content-Type', 'application/json' );
        $response->header( 'Content-Disposition', 'attachment; filename="saasmenu-settings.json"' );
        
        return $response;
    }

    /**
     * REST: POST /settings/import
     */
    public function import_settings( \WP_REST_Request $request ) {
        // Validate JSON body
        $params = wp_unslash( $request->get_params() );

        if ( empty( $params ) || ! isset( $params['templateId'] ) ) {
            return new \WP_Error(
                'saasmenu_error',
                __( 'Invalid settings schema.', 'saasmenu' ),
                [ 'status' => 400 ]
            );
        }

        // Run through standard save routines
        return $this->save_settings( $request );
    }

    /**
     * REST: POST /preview/css
     */
    public function preview_css( \WP_REST_Request $request ) {
        $params = wp_unslash( $request->get_params() );
        $css = $this->generate_dynamic_css( $params );

        return rest_ensure_response( [
            'css' => $css,
        ] );
    }

    /**
     * Helper: Convert Hex Color to Relative Luminance
     */
    private function get_luminance( $hex ) {
        $hex = str_replace( '#', '', $hex );
        if ( strlen( $hex ) === 3 ) {
            $r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
            $g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
            $b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
        } else {
            $r = hexdec( substr( $hex, 0, 2 ) );
            $g = hexdec( substr( $hex, 2, 2 ) );
            $b = hexdec( substr( $hex, 4, 2 ) );
        }

        $r = $r / 255;
        $g = $g / 255;
        $b = $b / 255;

        $r = ( $r <= 0.03928 ) ? $r / 12.92 : pow( ( $r + 0.055 ) / 1.055, 2.4 );
        $g = ( $g <= 0.03928 ) ? $g / 12.92 : pow( ( $g + 0.055 ) / 1.055, 2.4 );
        $b = ( $b <= 0.03928 ) ? $b / 12.92 : pow( ( $b + 0.055 ) / 1.055, 2.4 );

        return 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;
    }

    /**
     * Helper: Check Contrast Ratio between two colors
     */
    private function get_contrast_ratio( $c1, $c2 ) {
        $l1 = $this->get_luminance( $c1 );
        $l2 = $this->get_luminance( $c2 );

        if ( $l1 > $l2 ) {
            return ( $l1 + 0.05 ) / ( $l2 + 0.05 );
        } else {
            return ( $l2 + 0.05 ) / ( $l1 + 0.05 );
        }
    }

    /**
     * Helper: Get ideal text color (black or white) for a background hex color
     */
    private function get_ideal_text_color( $bg_hex ) {
        $white_contrast = $this->get_contrast_ratio( $bg_hex, '#FFFFFF' );
        $black_contrast = $this->get_contrast_ratio( $bg_hex, '#000000' );

        return ( $white_contrast >= $black_contrast ) ? '#FFFFFF' : '#000000';
    }

    /**
     * Generate dynamic inline CSS overrides
     */
    public function generate_dynamic_css( $settings ) {
        $brand_color = isset( $settings['brandColor'] ) ? sanitize_hex_color( $settings['brandColor'] ) : '#5E6AD2';
        $sidebar_width = isset( $settings['sidebarWidth'] ) ? min( 320, max( 200, intval( $settings['sidebarWidth'] ) ) ) : 240;
        $topbar_height = isset( $settings['topBarHeight'] ) ? min( 52, max( 32, intval( $settings['topBarHeight'] ) ) ) : 46;
        $density = isset( $settings['density'] ) ? sanitize_text_field( $settings['density'] ) : 'normal';

        // Derive text color for brand color contrast
        $brand_text = $this->get_ideal_text_color( $brand_color );

        // Parse hex to rgb for opacity tint
        $clean_hex = str_replace( '#', '', $brand_color );
        if ( strlen( $clean_hex ) === 3 ) {
            $r = hexdec( substr( $clean_hex, 0, 1 ) . substr( $clean_hex, 0, 1 ) );
            $g = hexdec( substr( $clean_hex, 1, 1 ) . substr( $clean_hex, 1, 1 ) );
            $b = hexdec( substr( $clean_hex, 2, 1 ) . substr( $clean_hex, 2, 1 ) );
        } else {
            $r = hexdec( substr( $clean_hex, 0, 2 ) );
            $g = hexdec( substr( $clean_hex, 2, 2 ) );
            $b = hexdec( substr( $clean_hex, 4, 2 ) );
        }

        $brand_hover = sprintf( 'rgba(%d, %d, %d, 0.10)', $r, $g, $b );

        // Determine spacing padding values based on density
        $padding_val = '8px 12px';
        if ( 'compact' === $density ) {
            $padding_val = '4px 8px';
        } elseif ( 'relaxed' === $density ) {
            $padding_val = '14px 16px';
        }

        $css = ":root {
            --saasmenu-brand-color: {$brand_color} !important;
            --saasmenu-brand-text-color: {$brand_text} !important;
            --saasmenu-brand-hover-color: {$brand_hover} !important;
            --saasmenu-sidebar-width: {$sidebar_width}px !important;
            --saasmenu-topbar-height: {$topbar_height}px !important;
            --saasmenu-menu-item-padding: {$padding_val} !important;
        }\n";

        // Add CSS to hide top bar links if configured
        $hide_settings = isset( $settings['hideTopBarItems'] ) ? $settings['hideTopBarItems'] : [];
        if ( ! empty( $hide_settings['howdy'] ) ) {
            $css .= "#wpadminbar #wp-admin-bar-my-account .ab-item .welcome { display: none !important; }\n";
        }

        // Add role-based item visibility styling
        $role_visibility = isset( $settings['roleVisibility'] ) ? $settings['roleVisibility'] : [];
        if ( ! empty( $role_visibility ) ) {
            foreach ( $role_visibility as $role => $menu_mapping ) {
                $clean_role = sanitize_html_class( $role );
                foreach ( $menu_mapping as $menu_id => $is_hidden ) {
                    if ( $is_hidden ) {
                        $clean_menu_id = sanitize_html_class( $menu_id );
                        $css .= "body.role-{$clean_role} #{$clean_menu_id} { display: none !important; }\n";
                    }
                }
            }
        }

        return $css;
    }
}
