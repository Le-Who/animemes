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

## 2024-11-20 - [Animation Performance: GC and DOM Thrashing]
**Learning:** Calling `.toLocaleString()` inside a `requestAnimationFrame` loop creates unnecessary garbage collection overhead. Additionally, unconditionally updating `textContent` even when the computed integer hasn't changed triggers redundant browser repaints.
**Action:** Instantiate `Intl.NumberFormat` outside of animation loops and guard DOM updates with a check against the previous value.
