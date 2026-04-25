## 2025-02-18 - CSS Injection via Unsanitized CSS Variables
**Vulnerability:** `index.html` injected external API data directly into a CSS variable (`--bg-image`) used in a `url()` function. This allowed potential CSS injection if the data contained single quotes or parentheses.
**Learning:** Even CSS variables can be injection vectors when used in functional contexts like `url()`, `attr()`, or `calc()`. Trusting external data (API) for style properties requires the same sanitization rigor as DOM injection.
**Prevention:** Always sanitize data before assigning it to CSS variables, especially if they are destined for functional CSS notation. Use specific sanitization that escapes context-breaking characters (quotes, parens) and encodes the URI.
## 2026-02-02 - CSS Injection in CSS Variables
**Vulnerability:** Unsanitized URLs used in `style.setProperty('--bg-image', ...)` allowed potential CSS injection via quote breaking.
**Learning:** CSP does not prevent CSS injection within `style` attributes if the attribute itself is trusted but the content is malicious.
**Prevention:** Implement strict input validation and escaping for any string interpolated into CSS values, especially `url()`.
## 2026-10-27 - Shadowed Security Functions
**Vulnerability:** `index.html` contained multiple definitions of critical sanitizer functions (`safeUrl`, `safeCSSUrl`), where later definitions silently overwrote earlier ones. This created ambiguity about which security policy was active (blacklist vs whitelist) and led to double-sanitization bugs.
**Learning:** In single-file applications without modules, hoisting and global scope pollution make it easy to accidentally shadow functions.
**Prevention:** Centralize all security functions at the top of the script. Adopt a "sanitize at sink" pattern: helper functions should return raw data, and sanitizers should be applied only at the point of DOM insertion to avoid double-encoding issues.
## 2024-05-23 - Prevent API Parameter Injection in Python Requests
**Vulnerability:** URL parameter injection via f-strings and string concatenation in `requests.get()` in `update.py`. The `tag` variable was being interpolated directly into the query string (`url = f"{API_URL}&tags={tag} sort:score:desc&limit=20"`), which is unsafe if `tag` contains unexpected characters like `&` or `#`.
**Learning:** The `requests` library automatically and safely URL-encodes parameters when they are passed via the `params` dictionary argument. Using f-strings to build query strings bypasses this safety mechanism.
**Prevention:** Always use the `params` dictionary for dynamic query parameters in `requests.get()` instead of manual string formatting.
