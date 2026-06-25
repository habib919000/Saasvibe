# SaasvibeWP - REST API Documentation

Base URL: `/wp-json/saasvibe/v1/`

All endpoints require WordPress to be installed and REST API enabled.

---

## Authentication

Most endpoints require WordPress admin capability (`manage_options`). Make requests as an authenticated administrator.

### Nonce Header

Mutating requests (POST, PUT, DELETE) require CSRF protection via nonce:

```
X-WP-Nonce: [wordpress-nonce]
```

Get the nonce from the WordPress admin via:

```javascript
fetch('/wp-json/saasvibe/v1/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': Saasvibe_Vars.permission, // Provided by plugin
  },
  body: JSON.stringify(settings),
});
```

---

## Endpoints

### 1. GET /templates

Fetch list of all available templates.

**Authentication:** Not required (public endpoint)

**Response:** `200 OK`

```json
[
  {
    "id": "linear-dark",
    "name": "Linear Dark",
    "style": "sidebar",
    "tier": "free",
    "designRef": "Linear.app",
    "defaultColors": {
      "background": "#16161A",
      "text": "#FFFFFF",
      "accent": "#5E6AD2",
      "hover": "#1E1E24"
    }
  },
  {
    "id": "vercel-minimal",
    "name": "Vercel Minimal",
    "style": "sidebar",
    "tier": "free",
    "designRef": "Vercel.com",
    "defaultColors": {
      "background": "#FFFFFF",
      "text": "#000000",
      "accent": "#000000",
      "hover": "#F3F4F6"
    }
  },
  {
    "id": "classic-elevated",
    "name": "Classic Elevated",
    "style": "both",
    "tier": "free",
    "designRef": "WordPress",
    "defaultColors": {
      "background": "#154B75",
      "text": "#FFFFFF",
      "accent": "#2271B1",
      "hover": "#1B5B8E"
    }
  }
]
```

**Errors:**

```json
{
  "code": "rest_no_route",
  "message": "No route was found matching the URL and request method.",
  "data": { "status": 404 }
}
```

---

### 2. GET /settings

Fetch current plugin settings.

**Authentication:** Required (`manage_options`)

**Response:** `200 OK`

```json
{
  "templateId": "linear-dark",
  "brandColor": "#5E6AD2",
  "customLogo": "https://example.com/logo.png",
  "density": "normal",
  "topBarHeight": 46,
  "sidebarWidth": 240,
  "environmentBadge": {
    "enabled": true,
    "label": "Development",
    "color": "#5E6AD2"
  },
  "hideTopBarItems": {
    "wpLogo": true,
    "siteName": false,
    "search": false,
    "notifications": false,
    "howdy": false
  },
  "roleVisibility": {
    "administrator": true,
    "editor": false
  },
  "wizard_completed": true
}
```

**Errors:**

```json
{
  "code": "rest_forbidden",
  "message": "You do not have permission to view settings.",
  "data": { "status": 403 }
}
```

---

### 3. POST /settings

Save plugin settings.

**Authentication:** Required (`manage_options`)

**Headers:** Include `X-WP-Nonce` header

**Request Body:**

```json
{
  "templateId": "vercel-minimal",
  "brandColor": "#000000",
  "customLogo": "https://example.com/new-logo.png",
  "density": "compact",
  "topBarHeight": 50,
  "sidebarWidth": 260,
  "environmentBadge": {
    "enabled": true,
    "label": "Staging",
    "color": "#FF9800"
  },
  "hideTopBarItems": {
    "wpLogo": true,
    "siteName": true,
    "search": false,
    "notifications": false,
    "howdy": false
  },
  "roleVisibility": {
    "administrator": true,
    "editor": true,
    "author": false
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Settings saved successfully"
}
```

**Errors:**

```json
{
  "code": "invalid_template",
  "message": "Template \"fake-template\" does not exist",
  "data": { "status": 400 }
}
```

```json
{
  "code": "invalid_color",
  "message": "Brand color must be valid hex format (#000000)",
  "data": { "status": 400 }
}
```

```json
{
  "code": "invalid_logo_url",
  "message": "Logo URL must be a valid URL",
  "data": { "status": 400 }
}
```

```json
{
  "code": "rest_csrf_failure",
  "message": "Invalid security token. Please reload the page and try again.",
  "data": { "status": 403 }
}
```

---

### 4. GET /settings/export

Download current settings as JSON file.

**Authentication:** Required (`manage_options`)

**Response:** `200 OK` with `Content-Disposition: attachment`

```json
{
  "templateId": "linear-dark",
  "brandColor": "#5E6AD2",
  "customLogo": "https://example.com/logo.png",
  "density": "normal",
  ...
}
```

**Example using cURL:**

```bash
curl -H "X-WP-Nonce: YOUR_NONCE" --cookie "wordpress_logged_in=..." \
  https://example.com/wp-json/saasvibe/v1/settings/export \
  -o settings.json
```

**Errors:**

```json
{
  "code": "rest_forbidden",
  "message": "You do not have permission to export settings.",
  "data": { "status": 403 }
}
```

---

### 5. POST /settings/import

Import settings from JSON file.

**Authentication:** Required (`manage_options`)

**Headers:** Include `X-WP-Nonce` header

**Request Body:**

```json
{
  "content": "{\"templateId\":\"vercel-minimal\",\"brandColor\":\"#6772E5\", ...}"
}
```

Note: Send the JSON as a **string**, not parsed object.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Settings imported successfully"
}
```

**Errors:**

```json
{
  "code": "invalid_json",
  "message": "Invalid JSON format: Syntax error",
  "data": { "status": 400 }
}
```

```json
{
  "code": "file_too_large",
  "message": "Import file exceeds 1MB limit",
  "data": { "status": 400 }
}
```

```json
{
  "code": "invalid_template",
  "message": "Template \"nonexistent\" does not exist",
  "data": { "status": 400 }
}
```

---

## Settings Schema

### Required Fields

- `templateId` (string) - One of the template IDs from `/templates` endpoint

### Optional Fields

- `brandColor` (hex color) - Default: `#5E6AD2`
- `customLogo` (URL) - Default: empty
- `density` (string) - `normal` or `compact` - Default: `normal`
- `topBarHeight` (integer) - 30-200 pixels - Default: `46`
- `sidebarWidth` (integer) - 150-400 pixels - Default: `240`
- `environmentBadge` (object) - Badge configuration
  - `enabled` (boolean) - Default: `true`
  - `label` (string) - Badge text - Default: `Development`
  - `color` (hex color) - Badge background - Default: `#5E6AD2`
- `hideTopBarItems` (object) - Top bar visibility
  - `wpLogo` (boolean) - Default: `true`
  - `siteName` (boolean) - Default: `false`
  - `search` (boolean) - Default: `false`
  - `notifications` (boolean) - Default: `false`
  - `howdy` (boolean) - Default: `false`
- `roleVisibility` (object) - Role-based visibility
  - Key: role slug (e.g., `administrator`, `editor`)
  - Value: boolean (true = show, false = hide)
  - Default: empty (show to all)
- `wizard_completed` (boolean) - Flag for onboarding - Default: `false`

### Validation Rules

| Field | Type | Constraints | Error |
|-------|------|-------------|-------|
| `templateId` | string | Must exist in templates list | `invalid_template` |
| `brandColor` | hex | Format: `#ABC` or `#AABBCC` | `invalid_color` |
| `customLogo` | URL | Must be valid URL or empty | `invalid_logo_url` |
| `density` | string | `normal` \| `compact` \| `relaxed` | `invalid_density` |
| `topBarHeight` | int | 30-200 | `invalid_top_bar_height` |
| `sidebarWidth` | int | 150-400 | `invalid_sidebar_width` |

---

## Rate Limiting

Currently no rate limiting. For high-traffic sites, implement rate limiting via:

```php
// In permission callback
$client_ip = $_SERVER['REMOTE_ADDR'];
$key = 'saasvibe_api_' . $client_ip;
$count = (int) get_transient( $key );

if ( $count >= 10 ) {
    return new WP_Error( 'rate_limit', 'Too many requests', [ 'status' => 429 ] );
}

set_transient( $key, $count + 1, MINUTE_IN_SECONDS );
```

---

## Caching

Settings are cached for 6 hours:

```
Cache-Key: saasvibe_settings_cache
TTL: 6 hours (21600 seconds)
```

Cache is invalidated on `POST /settings` or `POST /settings/import`.

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `rest_no_route` | 404 | Endpoint not found |
| `rest_forbidden` | 403 | User lacks required capability |
| `rest_csrf_failure` | 403 | Invalid or missing nonce |
| `invalid_template` | 400 | Template ID doesn't exist |
| `invalid_color` | 400 | Invalid hex color format |
| `invalid_json` | 400 | Malformed JSON in request |
| `file_too_large` | 400 | Import file exceeds 1MB |
| `save_failed` | 500 | Database save failed |

---

## Examples

### JavaScript (Fetch API)

**Get Settings:**

```javascript
fetch('/wp-json/saasvibe/v1/settings', {
  headers: {
    'X-WP-Nonce': Saasvibe_Vars.permission,
  },
})
  .then(r => r.json())
  .then(data => console.log(data));
```

**Save Settings:**

```javascript
const settings = {
  templateId: 'vercel-minimal',
  brandColor: '#6772E5',
  density: 'compact',
};

fetch('/wp-json/saasvibe/v1/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': Saasvibe_Vars.permission,
  },
  body: JSON.stringify(settings),
})
  .then(r => r.json())
  .then(data => console.log('Saved:', data));
```

### PHP (wp_remote_post)

```php
$response = wp_remote_post( 'https://example.com/wp-json/saasvibe/v1/settings', [
    'body'    => json_encode( [ 'brandColor' => '#FF0000' ] ),
    'headers' => [
        'Content-Type' => 'application/json',
        'X-WP-Nonce'   => wp_create_nonce( 'wp_rest' ),
    ],
] );

if ( is_wp_error( $response ) ) {
    error_log( 'API Error: ' . $response->get_error_message() );
    return;
}

$data = json_decode( wp_remote_retrieve_body( $response ) );
echo 'Success: ' . $data->message;
```

### cURL

```bash
# Get settings
curl -H "X-WP-Nonce: YOUR_NONCE" \
  https://example.com/wp-json/saasvibe/v1/settings

# Save settings
curl -X POST https://example.com/wp-json/saasvibe/v1/settings \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -d '{"brandColor": "#FF0000"}'
```

---

## Changelog

### v1.0.0
- Initial REST API release
- 5 endpoints
- CSRF protection via nonce
- Input validation and sanitization
- Response caching (6 hours)

