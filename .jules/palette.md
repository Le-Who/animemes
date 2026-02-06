# PALETTE'S JOURNAL

This journal tracks critical UX and accessibility learnings from the project.

## 2026-02-01 - Keyboard Shortcut Discoverability
**Learning:** Users may not realize keyboard shortcuts exist without visual cues. Adding persistent visual hints (like keycaps) reinforces accessibility and power-user features simultaneously.
**Action:** Always pair keyboard listeners with visual indicators or tooltips.

## 2026-10-24 - Hidden Inputs Accessibility
**Learning:** Hiding form inputs with `display: none` completely removes them from the accessibility tree, preventing keyboard and screen reader interaction.
**Action:** Use a `.visually-hidden` CSS class (using `clip: rect`) to hide native inputs while preserving their focusability and semantics.
