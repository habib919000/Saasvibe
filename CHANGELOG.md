# Saasvibe — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-07-30

### Added
- **Automatic font contrast for the brand colour**: Text on every brand-filled surface — active submenu fills, the avatar, the environment badge, and Classic Elevated's whole chrome — is now derived from the brand colour's WCAG 2.1 relative luminance, so a light brand colour gets dark text and a dark one gets light text, in all four templates and in the live preview. Classic Elevated's idle labels, dividers and hover fills follow the same derived colour through `--saasvibe-brand-text-strong` / `-soft` / `-faint`, `--saasvibe-brand-surface` / `-strong` and `--saasvibe-brand-line`, with tint opacity raised automatically wherever 85% / 75% / 60% would drop under AA.
- **Legible brand fill (`--saasvibe-brand-fill`)**: Mid-tone colours around `#767676` top out near 4.48:1 against both black and white, so no text colour can rescue them. Every surface that carries text on a brand fill — the active menu item, the avatar, the environment badge, and the whole of Classic Elevated's chrome — is now painted with a fill whose lightness is nudged just clear of that band. Colours outside it are painted exactly as picked, and the contrast warning is gone: no brand colour can leave text under AA any more.
- **Accessible brand accent (`--saasvibe-brand-accent`)**: Where the brand colour is drawn as a label or icon rather than as a fill — active parent items, admin-bar hovers, menu icons — it is now lightened or darkened, hue and saturation untouched, by the smallest amount that clears 4.5:1 against the chrome behind it. A near-black brand colour on Linear Dark's black sidebar and a pale one on Vercel Minimal's white sidebar both stay legible; colours that already pass are used exactly as picked.

- **Contrast target setting (AA / AAA)**: Styling now offers a contrast target. AA (4.5:1) stays the default; AAA holds every derived colour — fills, accents, tinted labels, and the templates' own static greys — to 7:1, which moves brand-derived colours further from the picked hue in exchange for the stricter ratio. The setting is validated server-side and threaded through both the PHP and JavaScript colour engines.

- **Reduced-motion and forced-colours support**: All four templates now drop their decorative colour transitions under `prefers-reduced-motion: reduce`, and re-mark the active row with the system highlight plus system-coloured focus rings under `forced-colors: active`, where the brand fill is stripped by the OS.

### Changed
- **weDevs Dark is now Dev Dark**: The template and its stylesheet were renamed (`wedevs-dark` → `dev-dark`), and its design reference now reads "Dark UI". Sites already using it keep working — the stored id is mapped to the new one on read and on save, so no site loses its styling or fails validation after updating.

### Removed
- **Licence tab and tiering**: The License tab activated nothing — it checked whether the key began with `PRO-` or `AGENCY-`, reported "License activated successfully!", and contacted no server. The flag it set (`is_pro`) was never emitted by PHP, so it read as `false` on every page load: export and import were permanently disabled for everyone, and the "PRO ONLY" template lock could never trigger since all four templates are free. The tab, the tier badges, the upsell notice, and the client-side gating are gone; export and import are available to anyone who can manage options, authorised server-side via `saasvibe_can_transfer_settings()`.

### Fixed
- **Admin bar text was never styled in any template**: The rule that colours every label in the top bar carried `:not(.dashicons-before::before)`. A pseudo-element is not a valid `:not()` argument at any Selectors level, and an invalid argument invalidates the whole selector — so browsers dropped the rule entirely and the admin bar kept core's light grey `#a7aaad`. On Vercel Minimal's white bar that is 2.33:1, effectively invisible; the labels only looked acceptable on the dark templates by luck. Fixed in all four templates, which now reach 18.88:1 on Vercel Minimal, with the environment badge excluded so it keeps the text colour derived for its own pill.
- **Toolbar and menu icons drifted out of line**: Core lays both out with floats and boxes sized for its own 32px bar and default density — but both are configurable here. Toolbar glyphs floated to the top of the line box (plus core's `top: 2px`, tuned for 32px), so they rode above their labels on a taller bar; and the menu icon box is a fixed 34px while the label box grows with the density setting, so icon and label only lined up at Normal. Both now centre with flex, which holds at any bar height and any density. Only weDevs Dark had the toolbar half of this right; the menu half was wrong in all four.
- **Focus rings used the unadjusted brand colour**: Every template outlined focus with `--saasvibe-brand-color`, the raw pick, while every other token moved to a derived one — so a near-black brand on a dark sidebar left the focus indicator with almost no contrast. They now use `--saasvibe-brand-accent`, which is held to the configured target against the chrome behind it. The contrast audit missed this because it read `outline-color` but not the `outline` shorthand; it now parses both.
- **Skip-link focus ring was invisible on Classic Elevated**: The ring used the brand accent, which that template derives against its inverted active fill — but the link sits on the brand fill, so the two matched at 1.00:1. It now uses the colour derived for that fill.
- **Template cards were not keyboard operable**: The cards were plain `div`s with an `onClick`, so a keyboard user could not select a template at all. They are now a proper radio group with Enter/Space activation and a visible focus ring.
- **Import reported server errors as invalid JSON**: `JSON.parse()` and the request shared one `catch`, so a 400, a 403 or a dropped connection all surfaced as "Invalid JSON file content." Parse failures and request failures are now reported separately, the latter carrying the server's own message.
- **Contrast target control was a radio group in name only**: Two `role="radio"` buttons gave two tab stops and no arrow-key selection. Replaced with native radios in a fieldset — one tab stop, arrow keys, same appearance.
- **Core's fixed 32px label height**: `#wpadminbar .ab-label` and the account name carry `height: 32px` from core, sized for its own bar. Inside a taller bar that boxes the label off-centre regardless of the surrounding flex centring. The height is now cleared so the flex parent positions them.
- **Dropdown rows stretched to the full bar height**: The height rule applied to every `.ab-item`, including rows inside dropdown panels, so a 46px bar produced 46px-tall submenu rows. Height is now scoped to top-level items.
- **Toolbar glyphs drawn on `::before` kept core's grey**: Core draws some toolbar icons on `.ab-icon` spans and others directly on the anchor's `::before` — the site-name house, the WP logo, my-account. Only the first kind was styled, so on a repainted bar the second kind stayed `#a7aaad`: 1.67:1 on a mint brand colour, a pale ghost next to correctly-coloured neighbours. All four templates now cover `.ab-item::before` and `.ab-empty-item::before`, resting and hover.
- **Skip-to-content link rendered in core's palette**: Core's keyboard-only "Skip to main content" shortcut appears over chrome the templates repaint, in colours chosen for core's own bar. Each template now pins it to its own surface with a brand-accent focus ring.
- **RTL layouts offset to the wrong side**: Every template forced `margin-left` on `#wpcontent` / `#wpfooter` (and again in the responsive and auto-fold blocks), but core moves the admin menu to the right in RTL locales — leaving a gap on the wrong side with the content running under the sidebar. All offsets, and the submenu indent, now use logical properties.
- **Version constant lagged the plugin header**: `SAASVIBE_VERSION` was still `2.1.0` while the header had moved on, so admin assets were cache-busted against a stale version and browsers could keep serving old CSS/JS after an update.
- **Import never worked**: The importer posts to `/settings/import`, which reads the uploaded document from `content`, but the modal posted the parsed settings object itself — so `content` was always empty and every import failed with "No settings provided". The modal now sends the raw document, and parses it client-side first so a malformed file reports a clear error instead of a 400.
- **Fatal error on a non-JSON request body**: `save_settings()` and `import_settings()` passed `get_json_params()` straight into an `array`-typed parameter. A request with a non-JSON body makes that return `null`, raising a `TypeError` — which is an `Error`, not an `Exception`, so the surrounding `catch` never saw it and the request died as an uncaught fatal. Both now reject a non-array body with a 400.
- **Custom sidebar logo never appeared**: The injection script is attached to the `common` handle, which prints in the admin `<head>`, so `#adminmenu` did not exist yet and the script returned silently on every page load. It now waits for `DOMContentLoaded` when the document is still parsing.
- **Role visibility could lock an administrator out**: Hiding the Settings menu for a role removed the only route back to this plugin's own screen. Settings is now kept for users who can `manage_options`; every other menu and role hides as configured.
- **Import argument sanitiser corrupted JSON**: The `content` argument declared `sanitize_text_field` as its sanitiser, which strips newlines and encodes the characters a JSON document needs. Removed — the decoded payload is schema-validated by `validate_and_sanitize_settings()` regardless.
- **`/templates` was an unauthenticated endpoint**: `permission_callback` was `__return_true`. Only the settings screen consumes it, so it now requires `manage_options`.
- **Export and import were gated only in the browser**: The Agency-tier check lived in the settings screen while the REST routes asked for nothing beyond `manage_options`, so the routes were reachable directly. Authorisation is now server-side via `saasvibe_can_transfer_settings()`, filterable so a licensing add-on can enforce its own tiers.
- **Client-supplied `is_admin` on every request**: The API helper appended an `is_admin` flag to each call. Every endpoint ignored it — capability comes from the authenticated user — but it read like a trust boundary. Removed.
- **Role Visibility overstated what it does**: It hides menus; it does not revoke capabilities, and a user with the URL can still open the screen. The matrix now says so.
- **Naive luminance picked unreadable text**: The contrast maths averaged raw 0–255 channels instead of linearising them out of sRGB's gamma curve, which overstated the brightness of saturated mid-tones — `#FF5858`, for example, was given white text at 3.09:1. JavaScript and PHP now share one WCAG implementation (`views/assets/src/utils/color.js` and `saasvibe_relative_luminance()`) and resolve identically.
- **False WCAG warning in Styling**: The contrast warning compared the brand colour against the template's static text colour, a pairing that never renders, so light brand colours were flagged even though the preview drew readable dark text on them. It now measures the ratio the auto-selected text colour actually achieves and warns only when no choice can reach 4.5:1.
- **Hover fills eroding label contrast**: Hover washes were drawn in the same colour as the text sitting on them, so every hover slid the background *toward* the label and cost it ratio — white-on-brand fell to 3.92:1 on a mid-tone chrome. Washes now move the surface away from its text colour, and both the accent and the tinted labels are validated against the resting background and both hover fills together.
- **Tints validated in floats but rendered in 8-bit**: The tint search checked un-rounded composites and emitted a two-decimal alpha, so a tint verified at 4.50:1 could rasterise a shade short. Composites are now rounded the way the browser rasterises them and the alpha rounds up.
- **Sub-AA greys in the flyout submenu header**: `.wp-submenu-head` used `#71717A` on Linear Dark and weDevs Dark (4.35:1) and `#9CA3AF` on Vercel Minimal (2.54:1). Raised to `#818189` and `#687081`, which clear AA against the panel and the hover fill alike.
- **Hardcoded white on brand fills**: Linear Dark and weDevs Dark drew focus rings and admin-bar submenu hover text in fixed `#FFFFFF` on top of brand-filled surfaces.

## [2.1.0] - 2026-07-29

### Added
- **Submenu chevrons**: Menu items that own a submenu now render an expand/collapse chevron, drawn with WordPress Dashicons (`\f345` collapsed, `\f347` open) and mirrored for RTL. Core's own flyout arrow is suppressed so the two cannot appear side by side.
- **Reserved trailing gutter**: Items carrying a chevron reserve space on the trailing edge, so long labels and core's update-count bubbles no longer render underneath it.
- **weDevs Dark layout parity**: The template now honours `--saasvibe-sidebar-width` and `--saasvibe-topbar-height` and ships the responsive guard, none of which it previously supported.

### Changed
- **Shared interaction model across all four templates**: The active parent menu item is now marked by label and icon colour alone — no fill, no left border — while the active submenu item carries a solid brand fill. Hover uses a neutral fill rather than a brand tint. Classic Elevated inverts the active fill, since its chrome is already painted with the brand colour.
- **Flat inline submenus**: Expanded submenus render directly on the sidebar with no panel or dividing rule, indented so their labels align beneath the parent's label. Floating flyouts (folded rail, or hovering a closed parent) keep a solid panel and elevation.
- **Linear Dark restyle**: Pure black chrome with a blue accent, driven entirely by `--saasvibe-brand-color`. Template defaults updated to `#000000` / `#2563EB` / `#1A1A1A`.
- **Sidebar width range**: The Styling slider now spans 160px (the WordPress default) to 280px, replacing the previous 200–320px range. Server-side validation still accepts 150–400px so existing configurations and imports keep working.
- **Menu typography**: Dropped the template font-size overrides in favour of the WordPress defaults.
- Version headers realigned — the plugin header and readme had lagged at 1.0.0 while the changelog and package manifest were at 2.0.0.

### Fixed
- **Sidebar width applied to the menu list**: Core sizes `#adminmenu` and its inline submenus at a fixed 160px alongside the wrappers. Only the wrappers were being overridden, so the menu list stayed narrow inside a wider sidebar and the width setting appeared to move only the background.
- **Stray bar on submenu hover**: Core paints an inset bar on the leading edge via `box-shadow`, plus pseudo-element markers, on hovered submenu anchors. Both are now suppressed.
- **Doubled menu item padding**: Padding was set on the anchor while core also applies it to the label div. The density setting now drives `.wp-menu-name` alone, so Compact / Normal / Relaxed behave predictably.
- **Chevron alignment**: Core styles the same `::after` as its current-submenu pointer triangle and gives it a negative margin, knocking the open item's chevron out of line. The chevron now uses a fixed, fully specified box so it lands identically in every state.

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
- **Live Preview Display Issue**: Fixed an issue where the settings live preview was blank due to mismatches between PHP-injected globals and React bundle globals. Standardized the admin app on `Saasvibe_Vars` for robust loading.

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
