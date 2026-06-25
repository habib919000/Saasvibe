# Saasvibe — QA Report

**Plugin:** Saasvibe (admin dashboard theming / branding / role visibility)
**Reviewed build:** `saasvibe.php` header `Version: 1.0.0` (see versioning discrepancy QA‑D04)
**Review type:** White‑box / source‑level QA (static analysis of PHP, the compiled React bundle, REST routes, and template CSS)
**Reviewer:** Senior QA Engineer
**Date:** 2026‑06‑14

> **Scope note.** Per agreement, this pass is source‑level only. Findings are derived from reading the shipped code (`saasvibe.php`, `bootstrap/loaders.php`, `routes/templates.php`, `src/Controllers/Template_Controller.php`, `views/assets/dist/saasvibe.js`, and `assets/css/templates/*.css`). Items that genuinely require a running install — cross‑browser rendering, theme/plugin conflicts, responsive breakpoints, real screenshots — are called out as **Needs live verification** rather than asserted. Where a screenshot would normally accompany a finding, the exact on‑screen location is described instead.

---

## 1. Executive summary

Saasvibe is a well‑structured plugin with genuinely good engineering hygiene in places: PSR‑4 autoloading, defensive try/catch around bootstrapping, nonce + capability checks on every mutating REST endpoint, hex/URL/range input validation, `focus-visible` outlines, and live WCAG contrast math in the color picker. The security posture of the write path is solid for a v1.

However, the build is **not release‑ready**. Two of the three headline features are broken or misleading, and the documentation/marketing materially overstate what the code does. The most serious problems are not security holes — they are **feature/data‑model defects and truth‑in‑advertising issues** that would generate immediate support tickets and put a WordPress.org submission at risk of rejection.

### Key risks

| # | Risk | Severity |
|---|------|----------|
| QA‑F01 | **"Relaxed" density is selectable in the UI but rejected by the server** — saving fails outright. | High |
| QA‑F02 | **Role Visibility matrix does nothing and silently corrupts its own data** — no menu items are ever hidden; nested per‑role/per‑item selections are flattened on save and never persist. | High |
| QA‑D01 | **Advertised "6 templates (3 free, 3 premium)" — only 3 exist in code.** Stripe Crisp / Notion Panel / GitHub Dark are not shipped. | Medium |
| QA‑D03 | **`Tested up to: 7.0`** is an invalid WordPress version — will be flagged/rejected by WordPress.org. | Medium |
| QA‑C01 | Template CSS uses 75–79 `!important` overrides each with **no `@media` queries** — high risk of breaking WP's responsive admin/menu‑collapse. | Medium |
| QA‑F06 | "All changes apply instantly, no reload needed" is false for the **real** admin chrome (only the in‑page React preview updates live). | Medium |

**Overall quality rating: 5/10 — promising foundation, ships with broken headline features and inaccurate documentation.** Recommend a fix pass before any public release.

---

## 2. Test environment

| Attribute | Value |
|---|---|
| Method | Static / white‑box code review (no runtime install) |
| Plugin version under test | 1.0.0 (per plugin header) |
| Declared "Requires at least" | WordPress 5.8 |
| Declared "Requires PHP" | 7.4 |
| Declared "Tested up to" | 7.0 *(invalid — see QA‑D03)* |
| Front‑end stack | React (webpack bundle, `views/assets/dist/saasvibe.js`) |
| Global injected to JS | `window.Saasvibe_Vars` |
| REST namespace (actual) | `saasvibe/v1` |
| Browsers/OS tested live | **None** — out of scope this pass; compatibility items flagged as *Needs live verification* |

**Recommended live test matrix for the next pass:** WordPress 5.8, 6.4, and latest 6.x; PHP 7.4 and 8.2; Chrome, Firefox, Safari, Edge (current); default themes (Twenty Twenty‑One → Twenty Twenty‑Five); alongside common plugins (WooCommerce, Yoast, Elementor, an admin‑menu editor) to surface admin‑bar/menu conflicts; viewport widths 360 / 768 / 960 / 1280 px.

---

## 3. Detailed findings

Severity = user/business impact. Priority = fix urgency (P1 highest).

---

### QA‑F01 — "Relaxed" density option is rejected by the backend
**Severity: High · Priority: P1 · Type: Functional**

**Reproduction**
1. Open **Settings → Saasvibe**, go to the sizing/density control.
2. Select **Relaxed** density (the UI offers Normal / Compact / Relaxed — see `saasvibe.js`, density options array includes `{ value: 'relaxed', label: 'Relaxed' }`).
3. Click **Save Settings**.

**Expected:** Settings save; density persists as "relaxed".
**Actual:** Save fails. `Template_Controller::validate_and_sanitize_settings()` only whitelists `['normal','compact']` and returns `WP_Error('invalid_density', 'Density must be "normal" or "compact"')` with HTTP 400. The React error handler surfaces this as a red toast, and *the entire save is rejected* (not just the density field), so unrelated changes in the same save are also lost.

**Root cause:** Front‑end offers three density values; back‑end validates only two. The live‑admin code in `loaders.php` similarly only branches on `compact` vs. not, so even if persisted, "relaxed" would render identically to "normal".

**Fix:** Add `'relaxed'` to the whitelist and give it real padding values in `loaders.php` (`$pad`/`$pad_left`), **or** remove the Relaxed option from the UI. Whichever is chosen, front‑end and back‑end must agree.

---

### QA‑F02 — Role Visibility matrix is non‑functional and corrupts its own data
**Severity: High · Priority: P1 · Type: Functional / data integrity**

This is the most consequential defect. The "Role‑based menu visibility" matrix is advertised as a core feature in the readme ("hide menu items per WordPress role… Perfect for limiting access to sensitive settings"). In practice it does nothing, and saving it destroys the user's selections.

**Reproduction**
1. Go to the **Role Visibility** tab.
2. For a role (e.g. Editor), toggle visibility of one or more specific menu items.
3. Save, then reload the page and revisit the tab.

**Expected:** Selected menu items are hidden from that role in the admin menu; the matrix reflects the saved per‑role / per‑item state on reload.

**Actual (three compounding bugs):**
1. **Data‑model mismatch.** The UI writes a *nested* structure — `roleVisibility[roleKey][menuItemId] = bool` (`saasvibe.js`: `settings.roleVisibility?.[role.key]?.[item.id]`). The server validator does `array_map('rest_sanitize_boolean', $role_visibility)`, which casts each role's inner object to a single boolean. The per‑menu‑item granularity is collapsed and lost on the first save.
2. **No enforcement anywhere.** There is **no `remove_menu_page()` / `remove_submenu_page()` / `$menu` filtering** in the codebase. The menu list is gathered only to populate the UI table; nothing on the server ever hides a menu item for any role. The feature has no runtime effect even with correct data.
3. **Selections never persist visually.** On reload the server returns the flattened `{ role: bool }` map, but the UI reads `roleVisibility[role][item]` (`true?.[item]` → `undefined`), so every checkbox renders unchecked again.

**Side effect (latent):** `saasvibe_get_applied_settings()` reuses `roleVisibility` as a gate for whether the *template styling* applies to a user. Once any non‑empty `roleVisibility` is saved, theme application becomes governed by these flattened booleans — i.e. configuring "menu visibility" can unexpectedly toggle whether the whole template renders for a role. The two intents (hide menu items vs. gate styling) are conflated on one field.

**Fix:** Decide the feature's true scope. If per‑role/per‑item menu hiding is intended: (a) preserve the nested shape in validation, (b) implement an `admin_menu`‑priority hook that calls `remove_menu_page()` based on the current user's roles, and (c) separate the styling‑gate concept onto its own setting. Add an automated test covering save → reload round‑trip.

---

### QA‑F06 — "Changes apply instantly, no reload needed" is inaccurate for the real admin
**Severity: Medium · Priority: P2 · Type: UX / functional**

**Reproduction:** Change template/brand color/logo/badge, click Save, observe the surrounding WordPress admin (not the in‑page preview).

**Expected (per readme):** "All changes apply instantly. No page reload needed."
**Actual:** Only the **in‑page React preview** updates live. The actual admin chrome (sidebar template CSS, environment badge, injected logo, hidden top‑bar items) is applied by PHP hooks that read `get_option('saasvibe_settings')` on the **next page load**. So the real dashboard does not restyle until the user navigates/reloads. The promise sets a false expectation.

**Fix:** Either soften the copy ("reload to see changes applied to your dashboard") or push the generated CSS into the current page on save (the unused `/preview/css` endpoint, QA‑F03, was likely meant for this).

---

### QA‑F03 — Dead REST endpoint: `POST /preview/css`
**Severity: Low · Priority: P3 · Type: Maintainability / attack surface**

The `saasvibe/v1/preview/css` route and its `preview_css()` controller method exist and are fully wired, but the React bundle computes preview CSS entirely client‑side and **never calls this endpoint** (no reference to `preview/css` in `saasvibe.js`). It is dead code that still adds a maintenance and (minor) attack surface.

**Fix:** Remove it, or wire it up to deliver the "instant apply" behavior in QA‑F06.

---

### QA‑F04 — Post‑save state sync writes `undefined`
**Severity: Low · Priority: P3 · Type: Functional (latent)**

In `handleSaveSettings`, on success the code does `window.Saasvibe_Vars.settings = response.data`. The save endpoint returns `{ success: true, message: ... }` with **no `data` field**, so the in‑memory settings global is set to `undefined`. Impact is currently masked because a manual reload re‑localizes settings from the database, but any client code that reads `Saasvibe_Vars.settings` after a save (without reload) will get `undefined`.

**Fix:** Return the validated settings object from `save_settings()` (e.g. `'data' => $validated`) and/or sync from local React state instead of `response.data`.

---

### QA‑F05 — Preview dark‑mode detection misses `classic-elevated`
**Severity: Low · Priority: P3 · Type: Visual**

The preview applies its dark‑theme class only for `['linear-dark'].includes(settings.templateId)`. `classic-elevated` ships a dark background (`#154B75`) with white text but is treated as a light template in the preview, so the in‑page preview can render with light‑mode assumptions for that template. **Needs live verification** of the exact visual artifact.

**Fix:** Drive "is dark" from the template's `defaultColors` luminance (the plugin already has luminance math) instead of a hardcoded ID list.

---

### QA‑C01 — Template CSS has no responsive handling and leans on `!important`
**Severity: Medium · Priority: P2 · Type: Compatibility / responsiveness · Needs live verification**

Each of the three template stylesheets contains **0 `@media` queries** and **75–79 `!important` declarations**, overriding core admin chrome (`#adminmenuwrap`, `#wpcontent` margins, `#wpadminbar` height) with fixed `var()` widths/heights. WordPress's admin is responsive below ~960 px (it folds/overlays the menu) and has a "collapse menu" toggle. Blanket `!important` overrides of those exact elements are a classic source of broken mobile layouts and a stuck collapse button.

**Expected:** Admin remains usable and the menu collapses correctly at small widths and when folded.
**Actual:** Unknown without a live install — flagged as a **high‑probability risk** given the override pattern. Must be verified at 360/768/960 px and with the menu collapsed.

**Fix:** Add responsive rules mirroring core breakpoints; scope overrides more tightly; reduce `!important` usage.

---

### QA‑C02 — Script enqueue ignores the generated `*.asset.php`
**Severity: Low · Priority: P3 · Type: Compatibility / build hygiene**

`loaders.php` enqueues the bundle with hardcoded deps `['wp-element','wp-i18n']` and `SAASVIBE_VERSION`, but the webpack‑generated `saasvibe.asset.php` declares `['react','react-dom','wp-element','wp-i18n']` and a content hash. It works today only because `wp-element` transitively pulls in `react`/`react-dom`. Ignoring the asset file is fragile (a future build that drops the `wp-element` dependency would break) and loses per‑build cache‑busting.

**Fix:** Load deps + version from `require 'saasvibe.asset.php'`.

---

### QA‑D01 — Template count overstated (6 advertised, 3 shipped)
**Severity: Medium · Priority: P2 · Type: Documentation / truth‑in‑advertising**

readme.txt, CHANGELOG.md, and docs/API.md advertise **6 templates (3 free + 3 premium: Stripe Crisp, Notion Panel, GitHub Dark)**. `Template_Controller::get_templates_list()` returns exactly **3** (`linear-dark`, `vercel-minimal`, `classic-elevated`), all `tier: free`. The premium templates do not exist in code, CSS, or the bundle. The UI does render Pro/tier affordances but has no Pro templates to show.

**Fix:** Either ship the templates or correct every marketing/doc reference to "3 templates." WordPress.org prohibits advertising features that aren't present.

---

### QA‑D02 — REST docs use the wrong namespace and a non‑existent token
**Severity: Medium · Priority: P2 · Type: Documentation**

`docs/API.md` documents the base URL as `/wp-json/saasvibewp/v1/`, but the routes register under `saasvibe/v1`. Every example in the API doc therefore 404s. The doc also shows bearer-token examples, but the plugin never exposes a token; auth is nonce + cookie only.

**Fix:** Global find/replace `saasvibewp/v1` → `saasvibe/v1`; remove the Bearer/token examples.

---

### QA‑D03 — `Tested up to: 7.0` is invalid
**Severity: Medium · Priority: P2 · Type: Documentation / store compliance**

readme.txt header declares `Tested up to: 7.0`. There is no WordPress 7.0; current is 6.x. (The Description prose separately says "tested through 6.6," contradicting the header.) WordPress.org's readme validator flags/blocks invalid "Tested up to" values.

**Fix:** Set to the actual highest WP version tested (e.g. `6.6` or current 6.x) and reconcile the prose.

---

### QA‑D04 — Version identity is inconsistent across files
**Severity: Low · Priority: P3 · Type: Release hygiene**

- `saasvibe.php` header + `SAASVIBE_VERSION`: **1.0.0**
- readme.txt `Stable tag`: **1.0.0**
- CHANGELOG.md latest entry: **2.0.0**
- docs/API.md changelog: **v2.0.0**

A consumer cannot tell which version this is. Cache‑busting uses 1.0.0.

**Fix:** Pick one version and align all four locations.

---

### QA‑D05 — Incomplete legacy-name rebrand
**Severity: Low · Priority: P3 · Type: Consistency**

The old build mixed legacy and current naming across the JS global, CSS custom properties, and bundle filenames. Cosmetic, but it signaled an unfinished refactor and risked confusion in future maintenance.

**Fix:** Complete the rename or document the intentional legacy global; correct the inaccurate comment.

---

### QA‑D06 — README/CHANGELOG claim artifacts that aren't in the package
**Severity: Low · Priority: P3 · Type: Documentation accuracy**

The docs reference deliverables that don't exist in the reviewed tree: `tests/unit/SettingsValidationTest.php` ("30+ unit tests"), `P1_FIXES_APPLIED.md`, and a "450+ line README.md" (only `readme.txt` is present). The changelog also lists "`$wpdb->prepare()` for all queries / SQL injection prevention," but the plugin issues **no SQL at all** (it uses the Options API), so the claim is moot. The FAQ states "Settings are encrypted in the database" — they are stored as a plain serialized option, **not encrypted**.

**Fix:** Remove or substantiate each claim. The "encrypted" claim in particular is a security misrepresentation and should be deleted.

---

### QA‑S01 — Brand color re‑injected into CSS without output‑time re‑validation
**Severity: Low · Priority: P3 · Type: Security (defense‑in‑depth)**

In `loaders.php` (template chrome hook), `brandColor` is passed through `sanitize_text_field()` and printed into `:root{--saasvibe-brand-color:%s;}`. On the save/import paths the value is strictly hex‑validated, so practical exploitability is low. But the *render‑time* code trusts whatever is in the option; if the option is ever written by another mechanism, only `sanitize_text_field` stands between input and a raw CSS context (which permits e.g. `}` to break out of the rule). The environment‑badge color, by contrast, *is* re‑validated with a hex regex at render time — so the handling is inconsistent.

**Fix:** Re‑validate `brandColor` with the same hex regex at output time (mirror the badge code), or escape for CSS context.

---

### QA‑S02 — Environment badge color has no contrast guard
**Severity: Low · Priority: P2 · Type: Accessibility / security‑adjacent**

The badge renders white text (`color:#fff`) on a user‑chosen background. The color is format‑validated (hex) but **not contrast‑validated**. A light badge color (e.g. `#FFEB3B`) yields white‑on‑light text that fails WCAG. The brand color picker *does* warn on low contrast; the badge does not, which is an inconsistency given the plugin's accessibility claims.

**Fix:** Compute badge text color via the existing `saasvibe_contrast_color()` luminance helper instead of hardcoding white, and/or warn in the UI.

---

### QA‑S03 — Minor security/cleanup notes
**Severity: Info–Low · Priority: P3**

- **Public `GET /templates`** uses `permission_callback => __return_true`. Low sensitivity (a static catalogue) but unnecessary exposure — consider requiring auth.
- **No `uninstall.php`.** `saasvibe_settings` and `saasvibe_version` options persist after the plugin is deleted. Deactivation intentionally preserves config (reasonable), but uninstall should offer cleanup per WP guidelines.
- **Inline‑JS logo injection** on the `common` handle is CSP‑unfriendly (builds DOM from a string). The URL is `esc_url()`‑escaped, so XSS risk is low, but a server‑side render or properly enqueued approach is cleaner.

**Positive security notes:** All POST endpoints verify `X‑WP‑Nonce` **and** `manage_options`. Import validates JSON, enforces a 1 MB cap, and re‑runs full schema validation. URL fields use `esc_url_raw`/`FILTER_VALIDATE_URL`. Numeric ranges are clamped. This write path is well hardened.

---

### QA‑A01 — Accessibility: strengths and gaps (code‑level)
**Severity: Low · Priority: P2 · Type: Accessibility · Needs live verification for full audit**

**Strengths observed in code:** `:focus-visible` outlines on admin‑menu and admin‑bar links (brand‑colored, 2 px); `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the export modal; `aria-label` on the color input; live WCAG 2.1 AA contrast math with a visible "WCAG Contrast Warning" when the brand/text ratio < 4.5:1.

**Gaps:**
- **A01a** — Injected sidebar logo uses a generic `alt="Logo"`. Use the site name or a configurable alt; if decorative, use `alt=""`.
- **A01b** — The contrast warning compares brand color against the template's **default** text color, not the actually rendered foreground/background pair in the live admin, so warnings can be both false‑positive and false‑negative.
- **A01c** — Keyboard navigation, focus order, and screen‑reader labeling of the tabbed settings UI and the role‑visibility table need a **live** audit (axe/Lighthouse + manual tab‑through) before the "WCAG 2.1 AA compliant" claim can be substantiated.

---

## 4. Severity / priority roll‑up

| ID | Title | Severity | Priority |
|----|-------|----------|----------|
| QA‑F01 | "Relaxed" density rejected by server | High | P1 |
| QA‑F02 | Role Visibility non‑functional + corrupts data | High | P1 |
| QA‑F06 | "Instant apply" false for real admin chrome | Medium | P2 |
| QA‑C01 | Template CSS: no `@media`, heavy `!important` | Medium | P2 |
| QA‑D01 | 6 templates advertised, 3 shipped | Medium | P2 |
| QA‑D02 | API docs wrong namespace/token | Medium | P2 |
| QA‑D03 | Invalid `Tested up to: 7.0` | Medium | P2 |
| QA‑S02 | Badge color no contrast guard | Low | P2 |
| QA‑A01 | Accessibility gaps (alt text, contrast basis, live audit) | Low | P2 |
| QA‑F03 | Dead `/preview/css` endpoint | Low | P3 |
| QA‑F04 | Post‑save sync writes `undefined` | Low | P3 |
| QA‑F05 | Preview dark‑mode misses `classic-elevated` | Low | P3 |
| QA‑C02 | Enqueue ignores generated `.asset.php` | Low | P3 |
| QA‑D04 | Version inconsistent across files | Low | P3 |
| QA‑D05 | Incomplete legacy-name rebrand | Low | P3 |
| QA‑D06 | Docs reference missing files / false "encrypted" claim | Low | P3 |
| QA‑S01 | Brand color not re‑validated at output | Low | P3 |
| QA‑S03 | Public templates route / no uninstall / inline‑JS logo | Info–Low | P3 |

---

## 5. Recommendations (UI/UX & usability)

1. **Make features match their promises.** Ship the 3 Pro templates or remove all "6 templates / premium" references; implement real menu hiding for Role Visibility or remove the matrix; reconcile the density options. Today the three most prominent selling points (template count, role visibility, instant apply) each fail to deliver.
2. **Close the front‑end/back‑end contract gaps.** QA‑F01 and QA‑F02 are both "UI offers a shape the server doesn't accept." Add a shared schema and a save→reload round‑trip integration test so these can't regress silently.
3. **Show real save feedback, field‑level.** Because one invalid field rejects the whole save (QA‑F01), surface validation inline on the offending control, not only as a global toast, and don't discard the user's other edits.
4. **Deliver true "instant apply"** by injecting generated CSS into the current page on save (repurpose the dead `/preview/css` endpoint), or change the copy to set the right expectation.
5. **Responsive pass on the admin chrome.** Add breakpoints, reduce `!important`, and verify the collapse‑menu toggle and <960 px layouts on a live install before release.
6. **Extend the contrast tooling** you already built to the environment badge, and base warnings on the actually rendered color pair.
7. **Clean the docs to store standards.** Fix `Tested up to`, the REST namespace, the version number, the "encrypted" claim, and the references to files that aren't in the package — these alone could cause a WordPress.org rejection.
8. **Finish the rebrand and run a live accessibility audit** (axe + manual keyboard pass) to back the WCAG claim.

---

## 6. What this pass did not cover (next steps)

Because no live WordPress instance was used, the following remain **unverified** and should be the focus of a runtime QA cycle: cross‑browser rendering (Chrome/Firefox/Safari/Edge), PHP 7.4 vs 8.x execution, multisite behavior, theme compatibility, conflicts with popular plugins (WooCommerce, Yoast, Elementor, admin‑menu editors), responsive breakpoints and the menu‑collapse interaction (QA‑C01), real screenshots/recordings, and an instrumented accessibility audit (QA‑A01c). I can stand up that environment and produce a runtime report with screenshots on request.
