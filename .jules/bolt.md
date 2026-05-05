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

## 2026-05-05 - [Animation Performance: toLocaleString & DOM Updates]
**Learning:** Calling `.toLocaleString()` inside `requestAnimationFrame` creates unnecessary GC pressure due to implicit locale resolution on every frame. Additionally, unconditional `textContent` updates cause redundant DOM repaints even if the visible value hasn't changed.
**Action:** Instantiate `Intl.NumberFormat` once outside the loop and use its `.format()` method. Guard DOM updates (`textContent`) with a value-change check to prevent unnecessary browser repaints.
