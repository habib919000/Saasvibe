/**
 * Saasvibe Modern Icons Injection
 * Replaces WordPress Dashicons with Lucide icons
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide === 'undefined') {
        console.warn('Saasvibe: Lucide library not loaded');
        return;
    }

    // Mapping from popular WP Dashicon classes to Lucide icon names
    const iconMap = {
        'dashicons-dashboard': 'layout-dashboard',
        'dashicons-admin-post': 'pin',
        'dashicons-admin-media': 'image',
        'dashicons-admin-page': 'file-text',
        'dashicons-admin-comments': 'message-square',
        'dashicons-admin-appearance': 'palette',
        'dashicons-admin-plugins': 'plug',
        'dashicons-admin-users': 'users',
        'dashicons-admin-tools': 'wrench',
        'dashicons-admin-settings': 'settings',
        'dashicons-admin-network': 'globe',
        'dashicons-admin-home': 'home',
        'dashicons-admin-links': 'link',
        'dashicons-format-image': 'image',
        'dashicons-format-video': 'video',
        'dashicons-format-audio': 'music',
        'dashicons-format-gallery': 'layout-grid',
        'dashicons-format-quote': 'quote',
        'dashicons-welcome-write-blog': 'pen-tool',
        'dashicons-welcome-view-site': 'monitor',
        'dashicons-welcome-widgets-menus': 'layout',
        'dashicons-welcome-comments': 'message-circle',
        'dashicons-welcome-learn-more': 'graduation-cap',
        'dashicons-email': 'mail',
        'dashicons-email-alt': 'mail',
        'dashicons-megaphone': 'megaphone',
        'dashicons-chart-pie': 'pie-chart',
        'dashicons-chart-bar': 'bar-chart-2',
        'dashicons-chart-line': 'line-chart',
        'dashicons-chart-area': 'activity',
        'dashicons-groups': 'users',
        'dashicons-businessman': 'user',
        'dashicons-id': 'id-card',
        'dashicons-id-alt': 'id-card',
        'dashicons-products': 'package',
        'dashicons-awards': 'award',
        'dashicons-forms': 'file-input',
        'dashicons-portfolio': 'briefcase',
        'dashicons-book': 'book',
        'dashicons-book-alt': 'book-open',
        'dashicons-download': 'download',
        'dashicons-upload': 'upload',
        'dashicons-backup': 'database-backup',
        'dashicons-clock': 'clock',
        'dashicons-image-filter': 'wand-2',
        'dashicons-image-flip-vertical': 'flip-vertical',
        'dashicons-image-flip-horizontal': 'flip-horizontal',
        'dashicons-visibility': 'eye',
        'dashicons-hidden': 'eye-off',
        'dashicons-store': 'store',
        'dashicons-cart': 'shopping-cart',
        'dashicons-shield': 'shield',
        'dashicons-shield-alt': 'shield-check',
        'dashicons-tag': 'tag',
        'dashicons-category': 'folder',
        'dashicons-archive': 'archive',
        'dashicons-menu': 'menu',
        'dashicons-ellipsis': 'more-horizontal',
        'dashicons-arrow-up': 'arrow-up',
        'dashicons-arrow-down': 'arrow-down',
        'dashicons-arrow-left': 'arrow-left',
        'dashicons-arrow-right': 'arrow-right',
        'dashicons-arrow-up-alt2': 'arrow-up-circle',
        'dashicons-arrow-down-alt2': 'arrow-down-circle',
        'dashicons-arrow-left-alt2': 'arrow-left-circle',
        'dashicons-arrow-right-alt2': 'arrow-right-circle',
        'dashicons-plus': 'plus',
        'dashicons-minus': 'minus',
        'dashicons-no': 'x',
        'dashicons-yes': 'check',
        'dashicons-edit': 'edit-2',
        'dashicons-trash': 'trash-2',
        'dashicons-search': 'search',
        'dashicons-share': 'share-2',
        'dashicons-external': 'external-link',
        'dashicons-star-filled': 'star',
        'dashicons-star-half': 'star-half',
        'dashicons-star-empty': 'star',
        'dashicons-info': 'info',
        'dashicons-warning': 'alert-triangle',
        'dashicons-dismiss': 'x-circle',
        'dashicons-tickets': 'ticket',
        'dashicons-tickets-alt': 'ticket',
        'dashicons-update': 'refresh-cw',
        'dashicons-calendar': 'calendar',
        'dashicons-calendar-alt': 'calendar-days',
        'dashicons-layout': 'layout-template',
        'dashicons-admin-site-alt2': 'monitor',
        'dashicons-admin-site-alt3': 'globe',
        'dashicons-editor-code': 'code',
    };

    // Find all elements with dashicons classes
    const dashiconElements = document.querySelectorAll('[class*="dashicons-"]');
    
    dashiconElements.forEach(el => {
        // If it's already an SVG or has data-lucide, skip
        if (el.tagName.toLowerCase() === 'svg' || el.hasAttribute('data-lucide')) {
            return;
        }

        // Determine which icon it is
        let lucideName = null;
        for (const [dashicon, lucide] of Object.entries(iconMap)) {
            if (el.classList.contains(dashicon)) {
                lucideName = lucide;
                break;
            }
        }

        // If we found a match or fallback to 'circle'
        if (lucideName) {
            el.setAttribute('data-lucide', lucideName);
        } else {
            // Unmapped dashicons get a generic circle so we don't end up with broken boxes if the font is overridden
            el.setAttribute('data-lucide', 'circle');
        }

        // Clear existing content (like pseudo-element text) by adding a class 
        // to reset the dashicon font-family and pseudo content, if needed.
        el.classList.add('saasvibe-lucide-replaced');
    });

    // Determine config
    const config = window.SaasvibeModernIcons || { style: 'line' };
    
    // Setup attributes based on style
    const attrs = {};
    if (config.style === 'flat') {
        attrs.fill = 'currentColor';
        attrs['stroke-width'] = 0;
    }

    // Render icons
    lucide.createIcons({
        attrs,
        nameAttr: 'data-lucide'
    });
});
