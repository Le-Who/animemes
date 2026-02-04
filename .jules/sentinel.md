## 2024-05-22 - URL Sanitization vs Relative Paths
**Vulnerability:** DOM-based XSS and CSS Injection via untrusted JSON data in `img.src` and `style` attributes.
**Learning:** A strict whitelist validator (e.g., `^https?://` or `^/`) breaks functionality for valid relative paths that don't start with a slash (e.g., `images/foo.jpg`), which are common in simple static sites.
**Prevention:** For `src` attributes, use a blacklist approach for dangerous schemes (`javascript:`, `vbscript:`, `data:`) if relative paths must be supported without complex parsing. For `style` attributes, always escape context-breaking characters (`'` and `\`) when inserting URLs into `url('...')`.
