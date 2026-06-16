# Bolt's Journal

## 2024-05-22 - [Perceived Performance: Image Preloading]
**Learning:** In a simple SPA game relying on external images, the biggest performance bottleneck is network latency. Preloading the next asset significantly improves perceived speed.
**Action:** Always look for opportunities to preload assets in user flows where the next step is predictable.

## 2024-10-24 - [DOM Performance: innerText vs textContent]
**Learning:** `innerText` triggers a forced reflow (synchronous layout) to calculate visibility, which causes measurable frame drops in high-frequency animation loops. `innerHTML` adds parsing overhead. `textContent` avoids both.
**Action:** Use `textContent` by default for all text updates, especially in `requestAnimationFrame` loops, unless visibility awareness is strictly required.
## 2024-05-23 - [Caching Strategy: Static Data]
**Learning:** Aggressive cache-busting (e.g., timestamp query params) on static data files forces unnecessary redownloads on every page load, hurting repeat visit performance.
**Action:** Relies on standard HTTP caching (ETag/Last-Modified) for static assets unless instant updates are critical for development.

## 2024-06-16 - [Performance: Intl.NumberFormat vs toLocaleString]
**Learning:** Calling `Number.prototype.toLocaleString()` inside high-frequency paths like a 60 FPS `requestAnimationFrame` loop creates a new formatter instance on every invocation, causing significant overhead (up to ~6.5x slower).
**Action:** Instantiate a single `new Intl.NumberFormat()` outside the loop and reuse its `.format()` method to format numbers in high-performance or animation-heavy scenarios.
