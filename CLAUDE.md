# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

Open `index.html` directly in a browser — no build step, no server needed:
```
open index.html
```

To syntax-check JS files without a browser:
```
node -c js/app.js
node -c js/templates.js
# etc.
```

There are no tests, no package.json, no build tools. This is intentional: the app must work via `file://` protocol.

## Architecture

Zero-dependency vanilla JS web app. All files use IIFEs and export to `window.ChestScope.*` — **no ES modules** (which would fail on `file://`). Template data uses `window.TEMPLATE_DATA = {...}` for the same reason.

### Script load order (matters — no module bundler)
```
data/template-data.js  → window.TEMPLATE_DATA
js/storage.js          → window.ChestScope.Storage
js/templates.js        → window.ChestScope.Templates
js/report.js           → window.ChestScope.Report
js/ui.js               → window.ChestScope.UI
js/search.js           → window.ChestScope.Search
js/app.js              → main controller (consumes all above)
```

### Module responsibilities
- **`data/template-data.js`** — Clinical template content only. `window.TEMPLATE_DATA` with categories → subcategories. Each subcategory has `findings`, `impression`, `interventional` strings with `[placeholder]` syntax. Built-in subcategories may also have `indication`. Custom additions (in LocalStorage) additionally support `technique`.
- **`js/storage.js`** — LocalStorage CRUD. Key function: `getMergedTemplates()` deep-clones `TEMPLATE_DATA` then applies user overrides/additions/deletions from `chestscope_custom_templates`. Merge order: (1) deep clone, (2) apply `overrides` to built-in subcats, (3) apply `deletions`, (4) push `additions`. **Overrides cannot target custom additions** — those must be edited directly in `additions[]`.
- **`js/templates.js`** — Placeholder pipeline: `parseTemplate(text)` → segments → `renderTemplate(segments, container)` → DOM → `syncSegmentsFromDOM()` → `resolveSegments()` → plain text. **`globalIdCounter`** is a module-level var (never resets) ensuring unique `ph-N` IDs across all concurrent parsed templates.
- **`js/app.js`** — All state and event wiring. `state.parsedFindings/parsedImpressions/parsedInterventional/parsedTechnique/parsedIndication` hold segment arrays. `updatePreview()` syncs DOM → segments → `assembleReport()`.
- **`js/ui.js`** — Floating dropdown menu (positioned with viewport flip logic), toast notifications, template library UI: `renderTemplateLibrary`, `renderTemplateEditForm`, `renderNewTemplateForm`.
- **`js/search.js`** — In-memory token-AND search over concatenated text fields, debounced 150ms.
- **`js/report.js`** — `assembleReport(state)` → plain text suitable for EMR paste.

### Placeholder system
Regex `\[([^\]]+)\]` classifies placeholders in template strings:
- `[option1/option2/option3]` → dropdown chip (teal, clickable)
- `[x]` or `[mm]` (≤3 chars alphanumeric) → numeric `<input>`
- `[YYYY/MM/DD]` or `[date]` → date picker
- `[anything longer]` → free text `<input>`

### LocalStorage keys
- `chestscope_preferences` — physician name, autoFillDate
- `chestscope_custom_templates` — `{ overrides: {subcatId: {...}}, additions: [], deletions: [] }`
- `chestscope_usage_history` — usage counts + lastUsed timestamps
- `chestscope_draft` — auto-saved report state

## Key Invariants

1. **`globalIdCounter` in `templates.js` must never reset** — multiple subcategory templates are active in the DOM simultaneously. Resetting it causes `ph-0` ID collisions and `updateSegmentValue()` updates the wrong segment.

2. **`updateSegmentValue(segId, value)` in `app.js`** searches all segment arrays (indication, technique, all findings, all impressions, all interventional) to find the segment by `segId`. The lookup must use `segId` (the parameter), not any loop variable.

3. **Template data is immutable at runtime** — user edits go into the overlay (`chestscope_custom_templates`), never into `TEMPLATE_DATA` directly. `getMergedTemplates()` always produces a fresh deep clone.

4. **Custom additions cannot be updated via `overrides`** — `getMergedTemplates()` applies `overrides` before pushing `additions`, so `overrides[customId]` never matches a custom addition. In `renderTemplateEditForm`, detect `isCustomAddition` by checking `custom.additions` and update `additions[i]` directly.

5. **Indication uses a hybrid rendering approach** — `#indication-content` (div, hidden by default) renders placeholder syntax; `#field-indication` (textarea, visible by default) handles free-text. `renderIndication(text)` in `app.js` switches between them: non-empty text activates placeholder mode, empty string restores the textarea.

## Clinical Content Notes

This is a medical reporting tool used by a pulmonologist for chest ultrasound and bronchoscopy reports. Template text is clinically validated English. When editing `data/template-data.js`:
- Preserve all existing placeholder syntax `[...]` exactly
- Do not change medical terminology without clinical review
- The three categories are: `chest-us` (6 subcats), `other-us` (1 subcat), `bronchoscopy` (6 subcats)
