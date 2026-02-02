# PALETTE'S JOURNAL

This journal tracks critical UX and accessibility learnings from the project.

## 2026-02-01 - Keyboard Shortcut Discoverability
**Learning:** Users may not realize keyboard shortcuts exist without visual cues. Adding persistent visual hints (like keycaps) reinforces accessibility and power-user features simultaneously.
**Action:** Always pair keyboard listeners with visual indicators or tooltips.

## 2026-02-02 - Custom Controls & Accessibility Tree
**Learning:** Using `display: none` on custom form controls (like checkboxes) completely removes them from the accessibility tree, preventing keyboard interaction.
**Action:** Use a "visually hidden" CSS pattern (e.g., `opacity: 0; width: 1px; clip: rect(...)`) instead of `display: none` to keep the native input focusable while hiding it visually.
