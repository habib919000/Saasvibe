# SaasvibeWP — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-13

### Added - Core Features
- **6 Design Templates** (3 free, 3 premium)
  - Linear Dark — Minimalist dark theme inspired by Linear.app
  - Vercel Minimal — Clean light interface from Vercel.com
  - Classic Elevated — Professional WordPress-inspired design
  - Stripe Crisp (Pro) — Premium light theme
  - Notion Panel (Pro) — Sophisticated sidebar layout
  - GitHub Dark (Pro) — Developer-friendly dark interface

- **Brand Customization Suite**
  - Custom brand color picker with hex validation
  - Company logo upload to sidebar
  - Adjustable sidebar width (150-400px)
  - Top bar height customization (30-200px)
  - Menu density controls (compact, normal, relaxed)

- **Access Control**
  - Role-based menu visibility matrix
  - Per-role access restrictions
  - Environment badges for dev/staging/production

- **Data Management**
  - Settings export as JSON
  - Settings import from JSON
  - One-click configuration deployment
  - Version control compatible

- **Developer Features**
  - RESTful API with 6 endpoints
  - React-based admin interface
  - Dependency injection architecture
  - 30+ comprehensive unit tests
  - Type hints for PHP 7.4+
  - Complete API documentation (docs/API.md)

- **Onboarding**
  - Interactive setup wizard
  - Live interface preview
  - Template selection guide

### Security - P0 Fixes (Ship Blocking)

#### Input Validation
- Hex color validation with regex: `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`
- Template ID whitelist verification
- URL validation using `filter_var(FILTER_VALIDATE_URL)`
- Numeric range validation:
  - Top bar height: 30-200px
  - Sidebar width: 150-400px
- JSON schema validation for imported files
- File size limits (1MB max for imports)

#### CSRF Protection
- X-WP-Nonce header verification on all POST endpoints
- Custom permission callbacks
- HTTP 403 responses on CSRF failure
- Token refresh mechanism

#### Error Handling & Logging
- Try-catch blocks with proper exception handling
- Graceful fallbacks preventing white screens
- Admin notices instead of fatal errors
- SaasMenu_Logger class with 4 levels:
  - ERROR
  - WARNING
  - INFO
  - DEBUG
- Logs to wp-content/debug.log when WP_DEBUG enabled

#### Database Security
- No raw SQL queries
- $wpdb->prepare() for all queries
- Proper escaping for output
- Sanitization for input

### User Experience - P1 Improvements

#### Error Feedback
- Validation failures now display specific error messages
- Toast notifications for all API responses
- User guidance on fixing input errors
- No more confusing success messages on validation failure

#### Theme Color Inversion
- CSS custom properties for light/dark themes
- Automatic theme detection based on template
- Proper contrast ratios in all themes
- Smooth theme switching without page reload

#### Accessibility
- WCAG 2.1 AA compliance
- Contrast ratio validation (4.5:1 minimum)
- Color contrast warnings in UI
- Keyboard navigation support
- Screen reader compatible

### Fixed
- Theme colors now properly invert between light and dark templates
- Invalid color input no longer shows success message
- Border colors adapt to theme context
- Button text visibility improved in all themes
- Tab navigation contrast ratios meet WCAG standards

### Documentation
- **README.md** (450+ lines)
  - Installation methods (automatic and manual)
  - Quick start guide
  - Template descriptions with design references
  - Comprehensive settings reference
  - Troubleshooting guide
  - Pricing tier information
  
- **docs/API.md** (Complete REST API documentation)
  - 6 endpoint specifications
  - Request/response examples
  - Authentication details
  - Error codes and handling
  - Rate limiting info

- **Unit Tests** (30+ tests in tests/unit/SettingsValidationTest.php)
  - Template validation tests
  - Hex color validation tests
  - URL validation tests
  - Numeric range validation tests
  - Environment badge tests
  - Role visibility tests
  - Private method testing via Reflection

- **P1_FIXES_APPLIED.md**
  - Detailed fix documentation
  - Testing procedures
  - Impact assessment

### Testing
- Browser testing completed in WordPress 6.6
- Valid color persistence verified
- Invalid color rejection confirmed
- Real-time preview functionality validated
- WCAG accessibility compliance verified
- Theme switching tested

### Performance
- 6-hour intelligent caching layer
- Minimal JavaScript footprint (84KB minified)
- Optimized React build
- Deferred script loading
- Zero frontend impact

### Developer Experience
- PSR-4 autoloader for namespace support
- Clean dependency injection
- Comprehensive inline documentation
- PHP 7.4+ type hints
- WordPress coding standards compliance
- Internationalization ready (i18n)

### Known Issues
- None reported

### Deprecated
- None

## [1.0.0] - 2026-06-01

### Added - Initial Release
- Basic template system with 3 templates
- Settings management interface
- WordPress admin integration
- Color and layout customization

---

## Version Comparison

| Feature | 1.0.0 | 2.0.0 |
|---------|-------|-------|
| Templates | 3 | 6 |
| Security Audit | ❌ | ✅ |
| Unit Tests | ❌ | 30+ |
| API Docs | ❌ | ✅ |
| WCAG Compliance | ❌ | ✅ |
| Error Feedback | ❌ | ✅ |
| Theme Switching | Basic | Advanced |
| P0 Security Fixes | N/A | All |
| P1 UX Improvements | N/A | All |

---

## Upgrade Path

### From 1.0.0 to 2.0.0
✅ **Fully Compatible** — No data loss, no migration required

- Settings automatically migrate
- Templates remain intact
- Role visibility preserved
- No downtime

### Breaking Changes
None

### Deprecations
None

---

## Security Advisory

Version 2.0.0 includes comprehensive security hardening:
- **P0 (Critical)**: Input validation, CSRF protection, error handling
- All security fixes have been implemented and tested
- Security audit completed
- No known vulnerabilities

---

## Support & Contribution

For issues, feature requests, or security concerns:
- **GitHub**: https://github.com/habib919000/saasvibewp
- **Email**: support@wedevsinfo.com
- **Documentation**: https://wedevsinfo.com/docs/saasvibewp

---

## Release Process

All releases follow semantic versioning:
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for bug fixes

---

Generated: 2026-06-13  
Last Updated: 2026-06-13
