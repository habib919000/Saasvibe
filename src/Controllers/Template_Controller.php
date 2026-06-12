<?php
namespace Saasvibe\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Template Controller - Handles template management and settings
 * 
 * Validates all inputs and implements security best practices.
 */
class Template_Controller {

    /**
     * Get list of all available templates
     *
     * @return array List of templates with metadata
     */
    public function get_templates_list(): array {
        return [
            [
                'id'            => 'linear-dark',
                'name'          => __( 'Linear Dark', 'saasvibe' ),
                'style'         => 'sidebar',
                'tier'          => 'free',
                'designRef'     => 'Linear.app',
                'defaultColors' => [
                    'background' => '#16161A',
                    'text'       => '#FFFFFF',
                    'accent'     => '#5E6AD2',
                    'hover'      => '#1E1E24',
                ],
            ],
            [
                'id'            => 'vercel-minimal',
                'name'          => __( 'Vercel Minimal', 'saasvibe' ),
                'style'         => 'sidebar',
                'tier'          => 'free',
                'designRef'     => 'Vercel.com',
                'defaultColors' => [
                    'background' => '#FFFFFF',
                    'text'       => '#000000',
                    'accent'     => '#000000',
                    'hover'      => '#F3F4F6',
                ],
            ],
            [
                'id'            => 'classic-elevated',
                'name'          => __( 'Classic Elevated', 'saasvibe' ),
                'style'         => 'both',
                'tier'          => 'free',
                'designRef'     => 'WordPress',
                'defaultColors' => [
                    'background' => '#154B75',
                    'text'       => '#FFFFFF',
                    'accent'     => '#2271B1',
                    'hover'      => '#1B5B8E',
                ],
            ],
        ];
    }

    /**
     * REST API: Get templates
     *
     * @return \WP_REST_Response
     */
    public function get_templates(): \WP_REST_Response {
        $templates = $this->get_templates_list();
        return rest_ensure_response( $templates );
    }

    /**
     * REST API: Get current settings
     *
     * @return \WP_REST_Response|\WP_Error
     */
    public function get_settings() {
        // Try cache first
        $cache_key = 'saasvibe_settings_cache';
        $cached = wp_cache_get( $cache_key );
        
        if ( false !== $cached ) {
            return rest_ensure_response( $cached );
        }
        
        // Fetch from options
        $settings = get_option( 'saasvibe_settings', $this->get_default_settings() );
        
        // Cache for 6 hours
        wp_cache_set( $cache_key, $settings, '', 6 * HOUR_IN_SECONDS );
        
        return rest_ensure_response( $settings );
    }

    /**
     * REST API: Save settings
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function save_settings( \WP_REST_Request $request ) {
        try {
            $params = $request->get_json_params();
            
            // Validate incoming data
            $validated = $this->validate_and_sanitize_settings( $params );
            
            if ( is_wp_error( $validated ) ) {
                return $validated;
            }
            
            // Save to options. update_option() returns false when the value is
            // unchanged from what's already stored, which is not an error.
            $existing = get_option( 'saasvibe_settings' );
            $result   = update_option( 'saasvibe_settings', $validated );

            if ( ! $result && $existing !== $validated ) {
                return new \WP_Error(
                    'save_failed',
                    __( 'Failed to save settings', 'saasvibe' ),
                    [ 'status' => 500 ]
                );
            }
            
            // Invalidate cache
            wp_cache_delete( 'saasvibe_settings_cache' );
            
            return rest_ensure_response( [
                'success' => true,
                'message' => __( 'Settings saved successfully', 'saasvibe' ),
            ] );
        } catch ( \Exception $e ) {
            return new \WP_Error(
                'save_error',
                $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * REST API: Export settings as JSON
     *
     * @return \WP_REST_Response|\WP_Error
     */
    public function export_settings() {
        try {
            $settings = get_option( 'saasvibe_settings', [] );
            
            // Create JSON response with download headers
            return new \WP_REST_Response(
                $settings,
                200,
                [
                    'Content-Disposition' => 'attachment; filename="saasvibe-settings.json"',
                    'Content-Type'        => 'application/json',
                ]
            );
        } catch ( \Exception $e ) {
            return new \WP_Error(
                'export_error',
                $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * REST API: Import settings from JSON
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function import_settings( \WP_REST_Request $request ) {
        try {
            $params = $request->get_json_params();
            $file_content = $params['content'] ?? '';
            
            if ( empty( $file_content ) ) {
                return new \WP_Error(
                    'empty_content',
                    __( 'No settings provided', 'saasvibe' ),
                    [ 'status' => 400 ]
                );
            }
            
            // Validate file size (1MB max)
            if ( strlen( $file_content ) > 1048576 ) {
                return new \WP_Error(
                    'file_too_large',
                    __( 'Import file exceeds 1MB limit', 'saasvibe' ),
                    [ 'status' => 400 ]
                );
            }
            
            // Parse JSON
            $data = json_decode( $file_content, true );
            
            if ( json_last_error() !== JSON_ERROR_NONE ) {
                return new \WP_Error(
                    'invalid_json',
                    sprintf(
                        /* translators: %s: JSON error message from json_last_error_msg(). */
                        __( 'Invalid JSON format: %s', 'saasvibe' ),
                        json_last_error_msg()
                    ),
                    [ 'status' => 400 ]
                );
            }
            
            // Validate settings schema
            $validated = $this->validate_and_sanitize_settings( $data );
            
            if ( is_wp_error( $validated ) ) {
                return $validated;
            }
            
            // Save imported settings
            update_option( 'saasvibe_settings', $validated );
            wp_cache_delete( 'saasvibe_settings_cache' );
            
            return rest_ensure_response( [
                'success' => true,
                'message' => __( 'Settings imported successfully', 'saasvibe' ),
            ] );
        } catch ( \Exception $e ) {
            return new \WP_Error(
                'import_error',
                $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * REST API: Generate preview CSS
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response|\WP_Error
     */
    public function preview_css( \WP_REST_Request $request ) {
        try {
            $params = $request->get_json_params();
            
            // Validate settings
            $validated = $this->validate_and_sanitize_settings( $params );
            
            if ( is_wp_error( $validated ) ) {
                return $validated;
            }
            
            // Generate CSS (simplified for preview)
            $css = $this->generate_css_from_settings( $validated );
            
            return new \WP_REST_Response(
                [ 'css' => $css ],
                200,
                [ 'Content-Type' => 'application/json' ]
            );
        } catch ( \Exception $e ) {
            return new \WP_Error(
                'preview_error',
                $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * Validate and sanitize settings
     *
     * @param array $settings Raw settings from request
     * @return array|\WP_Error Validated/sanitized settings or error
     */
    private function validate_and_sanitize_settings( array $settings = [] ) {
        $validated = [];
        
        // Validate template ID
        $template_id = $settings['templateId'] ?? 'linear-dark';
        if ( ! $this->is_valid_template( $template_id ) ) {
            return new \WP_Error(
                'invalid_template',
                /* translators: %s: template identifier that was not found. */
                sprintf( __( 'Template "%s" does not exist', 'saasvibe' ), $template_id ),
                [ 'status' => 400 ]
            );
        }
        $validated['templateId'] = sanitize_text_field( $template_id );
        
        // Validate brand color
        $brand_color = $settings['brandColor'] ?? '#5E6AD2';
        if ( ! $this->validate_hex_color( $brand_color ) ) {
            return new \WP_Error(
                'invalid_color',
                __( 'Brand color must be valid hex format (#000000)', 'saasvibe' ),
                [ 'status' => 400 ]
            );
        }
        $validated['brandColor'] = sanitize_text_field( $brand_color );
        
        // Validate custom logo URL
        $custom_logo = $settings['customLogo'] ?? '';
        if ( ! empty( $custom_logo ) ) {
            if ( ! filter_var( $custom_logo, FILTER_VALIDATE_URL ) ) {
                return new \WP_Error(
                    'invalid_logo_url',
                    __( 'Logo URL must be a valid URL', 'saasvibe' ),
                    [ 'status' => 400 ]
                );
            }
            $validated['customLogo'] = esc_url_raw( $custom_logo );
        } else {
            $validated['customLogo'] = '';
        }
        
        // Validate density
        $density = $settings['density'] ?? 'normal';
        if ( ! in_array( $density, [ 'normal', 'compact' ], true ) ) {
            return new \WP_Error(
                'invalid_density',
                __( 'Density must be "normal" or "compact"', 'saasvibe' ),
                [ 'status' => 400 ]
            );
        }
        $validated['density'] = sanitize_text_field( $density );
        
        // Validate numeric values
        $validated['topBarHeight'] = absint( $settings['topBarHeight'] ?? 46 );
        $validated['sidebarWidth'] = absint( $settings['sidebarWidth'] ?? 240 );
        
        if ( $validated['topBarHeight'] < 30 || $validated['topBarHeight'] > 200 ) {
            return new \WP_Error(
                'invalid_top_bar_height',
                __( 'Top bar height must be between 30 and 200 pixels', 'saasvibe' ),
                [ 'status' => 400 ]
            );
        }
        
        if ( $validated['sidebarWidth'] < 150 || $validated['sidebarWidth'] > 400 ) {
            return new \WP_Error(
                'invalid_sidebar_width',
                __( 'Sidebar width must be between 150 and 400 pixels', 'saasvibe' ),
                [ 'status' => 400 ]
            );
        }
        
        // Validate environment badge
        $env_badge = $settings['environmentBadge'] ?? [];
        $validated['environmentBadge'] = [
            'enabled' => (bool) ( $env_badge['enabled'] ?? true ),
            'label'   => sanitize_text_field( $env_badge['label'] ?? 'Development' ),
            'color'   => $this->validate_hex_color( $env_badge['color'] ?? '#5E6AD2' ) 
                ? sanitize_text_field( $env_badge['color'] ) 
                : '#5E6AD2',
        ];
        
        // Validate hide top bar items
        $hide_items = $settings['hideTopBarItems'] ?? [];
        $validated['hideTopBarItems'] = [
            'wpLogo'      => (bool) ( $hide_items['wpLogo'] ?? true ),
            'siteName'    => (bool) ( $hide_items['siteName'] ?? false ),
            'search'      => (bool) ( $hide_items['search'] ?? false ),
            'notifications' => (bool) ( $hide_items['notifications'] ?? false ),
            'howdy'       => (bool) ( $hide_items['howdy'] ?? false ),
        ];
        
        // Validate role visibility
        $role_visibility = $settings['roleVisibility'] ?? [];
        if ( is_array( $role_visibility ) ) {
            $validated['roleVisibility'] = array_map( 'rest_sanitize_boolean', $role_visibility );
        } else {
            $validated['roleVisibility'] = [];
        }
        
        // Wizard flag
        $validated['wizard_completed'] = (bool) ( $settings['wizard_completed'] ?? false );
        
        return $validated;
    }

    /**
     * Validate hex color format
     *
     * @param string $color
     * @return bool
     */
    private function validate_hex_color( string $color ): bool {
        return (bool) preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color );
    }

    /**
     * Check if template ID exists and user has access
     *
     * @param string $template_id
     * @return bool
     */
    private function is_valid_template( string $template_id ): bool {
        foreach ( $this->get_templates_list() as $template ) {
            if ( $template['id'] === $template_id ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate CSS from settings (simplified)
     *
     * @param array $settings Validated settings
     * @return string CSS string
     */
    private function generate_css_from_settings( array $settings ): string {
        $brand_color = $settings['brandColor'] ?? '#5E6AD2';
        $sidebar_width = $settings['sidebarWidth'] ?? 240;
        $top_bar_height = $settings['topBarHeight'] ?? 46;
        
        $css  = ':root {';
        $css .= '--saasvibe-brand-color: ' . $brand_color . ';';
        $css .= '--saasvibe-sidebar-width: ' . $sidebar_width . 'px;';
        $css .= '--saasvibe-topbar-height: ' . $top_bar_height . 'px;';
        $css .= '}';
        $css .= '#wpadminbar { height: var(--saasvibe-topbar-height); }';
        $css .= '#adminmenuback, #adminmenuwrap { width: var(--saasvibe-sidebar-width); }';
        $css .= '.wp-admin #wpcontent { margin-left: var(--saasvibe-sidebar-width); }';

        return $css;
    }

    /**
     * Get default settings
     *
     * @return array
     */
    private function get_default_settings(): array {
        return [
            'templateId'      => 'linear-dark',
            'brandColor'      => '#5E6AD2',
            'customLogo'      => '',
            'density'         => 'normal',
            'topBarHeight'    => 46,
            'sidebarWidth'    => 240,
            'environmentBadge' => [
                'enabled' => true,
                'label'   => 'Development',
                'color'   => '#5E6AD2',
            ],
            'hideTopBarItems' => [
                'wpLogo'      => true,
                'siteName'    => false,
                'search'      => false,
                'notifications' => false,
                'howdy'       => false,
            ],
            'roleVisibility'  => [],
            'wizard_completed' => false,
        ];
    }
}
