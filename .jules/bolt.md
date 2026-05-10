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
## 2026-05-10 - Animation Loop Optimization
**Learning:** Calling `.toLocaleString()` on every frame in a `requestAnimationFrame` loop creates implicit locale resolution overhead and garbage collection pressure. Unconditional `.textContent` updates cause redundant browser repaints even if the value string hasn't changed.
**Action:** Instantiate `Intl.NumberFormat` outside of the loop and guard DOM `.textContent` updates with a state check to prevent unnecessary repaints and GC overhead.
