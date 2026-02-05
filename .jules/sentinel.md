## 2024-05-22 - CSS Injection via CSS Variables
**Vulnerability:** User-controlled or external URLs used in CSS variables (e.g., `style="--bg: url('...')"`) can break out of the string context if they contain quotes or parentheses, leading to CSS injection.
**Learning:** Even if `img.src` is safe from XSS (mostly), CSS variables are interpreted as CSS syntax. A malicious URL like `'); background: red; --x: url('` allows injecting arbitrary CSS properties.
**Prevention:** Always sanitize URLs used in CSS values. Specifically, escape single quotes and parentheses, and validate the protocol (block `javascript:`). Use a `safeCSSUrl` helper.
