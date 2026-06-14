# Saasvibe — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-14

### Added
- **Full Admin Chrome Parity**: Successfully ported preview features directly to the actual WordPress admin panel:
  - Custom sidebar logo injection dynamically rendered at the top of the admin menu.
  - Environment badge pill on the WordPress admin bar with automatic, contrast-aware text coloring.
  - Top-bar element visibility toggles (hide WordPress logo, site name, search, comments, and profile/howdy greeting).
- **Dynamic Brand Coloring**: Implemented runtime PHP calculations (`saasvibe_hex_to_rgb` and `saasvibe_contrast_color`) to compute brand hover highlights and contrast-safe text colors, ensuring a 1:1 match with the frontend live preview.

### Changed
- **Loader Centralization**: Refactored the settings parsing logic and styling hook registrations inside `bootstrap/loaders.php` to clean up execution flows and improve maintainability.

### Fixed
- **Live Preview Display Issue**: Fixed an issue where the settings live preview was blank due to mismatches between PHP-injected globals and React bundle globals (`SaasMenu_Vars` vs `Saasvibe_Vars`). Localized data under both globals to guarantee robust loading.

## [1.0.0] - 2026-06-13

Initial public release.

### Added — Core Features

- **3 Design Templates**
  - Linear Dark — Minimalist dark theme inspired by Linear.app
  - Vercel Minimal — Clean light interface inspired by Vercel.com
  - Classic Elevated — Professional WordPress-inspired design

- **Brand Customization Suite**
  - Custom brand color picker with hex validation and live WCAG contrast check
  - Company logo injected into the admin sidebar
  - Adjustable sidebar width (150–400px)
  - Top bar height customization (30–200px)
  - Menu density controls (compact, normal, relaxed)

- **Access Control**
  - Role-based menu visibility matrix — hide top-level admin menus per WordPress role
  - Environment badge for dev/staging/production

- **Data Management**
  - Settings export as JSON
  - Settings import from JSON (1MB limit, schema-validated)

- **Developer Features**
  - REST API with 5 endpoints
  - React-based admin interface
  - PSR-4 autoloader
  - Type hints for PHP 7.4+
  - Complete API documentation (docs/API.md)

- **Onboarding**
  - Setup wizard and live in-page interface preview

### Security

- Input validation:
  - Hex color regex: `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$` (validated on save/import and re-validated at CSS output)
  - Template ID whitelist verification
  - URL validation via `filter_var( …, FILTER_VALIDATE_URL )`
  - Numeric range validation (top bar height 30–200px, sidebar width 150–400px)
  - JSON schema validation and 1MB size limit on imports
- CSRF protection: `X-WP-Nonce` verification on every mutating endpoint
- Capability checks: `manage_options` required for all settings operations
- Settings stored via the WordPress options API (no direct SQL queries)
- Error handling with graceful fallbacks and a WP_DEBUG-gated logger
- `uninstall.php` removes plugin options on deletion (multisite-aware)

### Accessibility

- `:focus-visible` outlines on admin menu and admin bar links
- `role="dialog"` / `aria-modal` / `aria-labelledby` on the export modal
- Live WCAG contrast warning when the brand/text ratio falls below 4.5:1
- Contrast-aware environment badge text color

### Documentation

- `readme.txt` — installation, quick start, FAQ
- `docs/API.md` — REST API reference (5 endpoints, request/response examples, error codes)

### Known Issues

- Template stylesheets do not yet ship responsive (`@media`) rules; verify the
  admin layout at small viewport widths and with the menu collapsed.

---

## Support & Contribution

- **GitHub**: https://github.com/habib919000/saasvibe
- **Email**: habib919000@gmail.com

---

## Release Process

All releases follow semantic versioning:
- **MAJOR** for incompatible API changes
- **MINOR** for backward-compatible functionality
- **PATCH** for bug fixes
