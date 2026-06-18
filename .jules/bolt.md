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
## 2024-06-18 - Use requests.Session() for API connection pooling
**Learning:** The Python `requests` library does not use connection pooling by default when `requests.get()` is called directly. It establishes a new TCP and TLS connection for every request, which creates significant overhead when making multiple requests to the same host in a loop.
**Action:** When making multiple or repeated HTTP requests to the same host in Python, initialize a `requests.Session()` object once at the module level and use it to execute the requests (e.g., `session.get()`). This reuses underlying TCP/TLS connections and drastically reduces request latency.
