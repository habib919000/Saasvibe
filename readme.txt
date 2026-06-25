=== Saasvibe ===
Contributors: habib919000
Tags: admin, dashboard, customization, templates, branding
Requires at least: 5.8
Requires PHP: 7.4
Tested up to: 7.0
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Transform your admin dashboard with modern design templates, brand customization, and role-based access. Secure and WCAG accessible.

== Description ==

**Saasvibe** is a professional-grade WordPress plugin that transforms your admin dashboard with beautiful, modern design templates and comprehensive customization options. Perfect for agencies, enterprises, and anyone seeking a polished, branded admin interface.

Built for WordPress 5.8+, tested through 7.0, with full PHP 7.4 compatibility.

= ✨ Core Features =

**Modern Design Templates**
* Linear Dark — Sleek, minimalist dark theme inspired by Linear.app
* Vercel Minimal — Clean, light interface based on Vercel.com design
* Classic Elevated — Professional WordPress-inspired template
* Plus more templates planned for future releases

**Brand Customization**
* Custom brand color with live WCAG contrast validation
* Upload your company logo to the sidebar
* Adjustable sidebar width (150-400px range)
* Top bar height customization (30-200px)
* Menu density toggle (compact, normal, relaxed)
* Environment badges for dev/staging/production

**Security & Access Control**
* Role-based visibility — hide menu items per WordPress role
* Input validation for all customizations
* CSRF protection on all API endpoints
* Nonce verification for data integrity
* Secure REST API with proper permissions
* Error logging and monitoring

**Developer Features**
* RESTful API with 5 endpoints
* React-based admin interface
* Internationalization ready
* Complete API documentation

**Data Management**
* Export settings as JSON
* Import configurations across sites
* One-click deployment
* Version control compatible

= 🔒 Security =

Saasvibe includes comprehensive security hardening:
* All inputs validated and sanitized
* CSRF tokens on POST requests
* SQL injection prevention
* Proper capability checks
* Error handling with graceful fallbacks
* Security audit completed

= ♿ Accessibility =

WCAG 2.1 AA compliant:
* Proper contrast ratios in all themes
* Light and dark theme support
* Accessible form controls
* Keyboard navigation support
* Screen reader compatible

= ⚡ Performance =

* Intelligent 6-hour caching layer
* Minimal JavaScript footprint (84KB)
* Optimized React build
* Zero impact on frontend performance
* Deferred script loading

== Source Code ==

This plugin is open source and its full, uncompiled source code is included in
the plugin package as well as in a public repository.

* Public source repository: https://github.com/habib919000/Saasvibe
* Uncompiled JavaScript/React source: included in `views/assets/src/`
* Build configuration: `webpack.config.js`, `package.json` (uses @wordpress/scripts)

The files in `views/assets/dist/` are generated from the source above using the
WordPress build toolchain (webpack via @wordpress/scripts). To build them
yourself:

1. Install dependencies: `npm install`
2. Produce the production build: `npm run build`
3. For a development watch build: `npm start`

== Installation ==

**Automatic Installation:**
1. Go to Plugins → Add New in WordPress admin
2. Search for "Saasvibe"
3. Click Install Now
4. Activate the plugin

**Manual Installation:**
1. Download the plugin ZIP from WordPress.org
2. Extract to `/wp-content/plugins/saasvibe/`
3. Activate via Plugins menu in WordPress admin

**Requirements:**
* WordPress 5.8 or higher
* PHP 7.4 or higher
* Modern browser (Chrome, Firefox, Safari, Edge)

== Getting Started ==

1. Navigate to Settings → Saasvibe
2. Use the onboarding wizard for quick setup (60 seconds)
3. Choose a design template
4. Set your brand color and logo
5. Adjust sidebar width and spacing
6. Configure role visibility if needed
7. Click Save Settings

The live preview inside the settings screen updates instantly as you edit. Your
changes are applied to the rest of the WordPress admin (sidebar, badge, logo,
hidden top-bar items) on the next page load after you save.

== Frequently Asked Questions ==

= Will this slow down my WordPress site? =
No. The plugin is highly optimized with intelligent caching, minimal JavaScript (84KB), and deferred loading. Performance impact is negligible—most sites see zero measurable impact.

= Can I use this on multisite? =
Yes. The plugin works on WordPress multisite installations. Settings are site-specific and don't affect other sites in the network.

= Can I reset a setting to default? =
Yes. Each setting has a "Reset to Default" button. You can also clear all settings and reconfigure.

= What happens when I deactivate the plugin? =
The WordPress admin immediately returns to the default appearance. Your saved settings remain in the database and can be reactivated anytime without losing configuration.

= Can I hide menu items from specific user roles? =
Yes! Use the Role Visibility matrix to choose which admin menu items each WordPress role can see. Perfect for limiting access to sensitive settings.

= Does this work on my theme or plugin? =
This plugin only affects the WordPress admin interface (wp-admin), not your public website. It's compatible with all WordPress themes and plugins.

= Can I export and import settings? =
Yes. The Advanced tab includes import/export functionality. Export settings as JSON and import on other WordPress installations.

= Is my data secure? =
All inputs are validated and sanitized, and every mutating API endpoint requires nonce verification and the `manage_options` capability. Settings are stored in the standard WordPress options table and the plugin performs no external data collection.

= Do you offer support? =
Yes. Visit our documentation at https://github.com/habib919000/Saasvibe for guides, troubleshooting, and contact information.

== Screenshots ==

1. **Templates Tab** — Browse and preview all available design templates with live interface preview
2. **Colors & Sizing** — Brand color picker with WCAG contrast validation and sizing controls
3. **Role Visibility** — Fine-grained matrix for showing/hiding menu items per user role
4. **Onboarding Wizard** — Quick 60-second setup process for new installations
5. **Linear Dark Theme** — Sleek dark design applied to WordPress dashboard
6. **Settings Management** — Complete customization interface with real-time preview

== Changelog ==

= 1.0.0 =
**Security Hardening (P0 Priority):**
* Comprehensive input validation for hex colors, URLs, numeric ranges
* CSRF protection on all REST API endpoints with nonce verification
* Output escaping and input sanitization throughout (settings use the WordPress options API; no direct SQL queries)
* Proper WordPress capability checks
* Error handling with graceful fallbacks
* Security audit and code review completed
* Error logging system with WP_DEBUG support

**User Experience Improvements (P1 Priority):**
* Error notifications for validation failures (no more false success messages)
* Theme-aware CSS variables for proper light/dark color inversion
* WCAG 2.1 AA accessibility compliance
* Improved contrast ratios in all themes
* Better error messages for user guidance

**Features:**
* 3 design templates (Linear Dark, Vercel Minimal, Classic Elevated)
* Brand customization (color and logo)
* Adjustable sidebar width and top bar height
* Menu density controls (compact, normal, relaxed)
* Environment badge system
* Role-based menu visibility
* Advanced configuration options
* Settings export/import
* Onboarding wizard
* Live interface preview

**Developer Experience:**
* RESTful API with 5 endpoints (GET/POST)
* React-based modern UI
* Internationalization support
* Complete API documentation in docs/API.md
* Type hints for PHP 7.4+ compatibility

**Documentation:**
* Complete API reference (docs/API.md)
* Technical architecture documentation


== Upgrade Notice ==

= 1.0.0 =
Initial release. Enterprise-grade plugin with comprehensive security hardening, user experience improvements, and modern design templates. Perfect for transforming your WordPress admin dashboard.
