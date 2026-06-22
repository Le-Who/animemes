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
## 2024-05-24 - Python requests.Session Connection Pooling
**Learning:** For backend scripts making multiple sequential HTTP requests to the same host (like fetching API data in a loop), using `requests.Session()` is vastly more performant than using bare `requests.get()`. A session automatically reuses the underlying TCP/TLS connections, eliminating the latency overhead of establishing a new connection handshake for every single request.
**Action:** When writing scripts that loop API calls to the same server, always initialize a `requests.Session()` and pass it to the fetching functions. To maintain backward compatibility in refactored functions, use `requests` as the default argument value (`def get_data(url, session=requests):`).
