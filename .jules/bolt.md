# Bolt's Journal

## 2024-05-22 - [Perceived Performance: Image Preloading]
**Learning:** In a simple SPA game relying on external images, the biggest performance bottleneck is network latency. Preloading the next asset significantly improves perceived speed.
**Action:** Always look for opportunities to preload assets in user flows where the next step is predictable.

## 2024-05-23 - [DOM Performance: innerHTML vs textContent]
**Learning:** In high-frequency animation loops (requestAnimationFrame), using `innerHTML` causes unnecessary HTML parsing overhead even for text-only updates, leading to layout thrashing.
**Action:** Use `textContent` for text-only updates in animation loops.
