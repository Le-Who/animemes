## 2026-02-02 - CSS Injection in CSS Variables
**Vulnerability:** Unsanitized URLs used in `style.setProperty('--bg-image', ...)` allowed potential CSS injection via quote breaking.
**Learning:** CSP does not prevent CSS injection within `style` attributes if the attribute itself is trusted but the content is malicious.
**Prevention:** Implement strict input validation and escaping for any string interpolated into CSS values, especially `url()`.
