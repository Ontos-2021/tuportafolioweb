## Copilot instructions for this repo

Project type and purpose
- Static, single-page portfolio/landing site in Spanish. No build step, no frameworks.
- Key files: `index.html` (markup & minimal inline scripts), `styles.css` (design system, layout, responsive), `script.js` (UX interactions), `assets/` (images). `CNAME` indicates GitHub Pages custom domain.

Architecture and data flow
- Sections in `index.html`: header (sticky), hero, servicios, proceso, galeria (filterable), testimonios, contacto (CTA WhatsApp), footer, CTA.
- `styles.css` defines a design system in `:root` (CSS variables for color, typography, spacing), component classes (e.g., `.servicio-card`, `.paquete-card`) and breakpoints (1024, 768, 480).
- `script.js` is vanilla JS. Patterns used:
	- DOMContentLoaded wrapper; query elements once, then attach listeners.
	- Smooth scroll for internal anchors with fixed-header offset (100px) and `header.scrolled` toggle on scroll (throttled via timeout).
	- Gallery filtering via `[data-category]` + `.filtro-btn[data-filter]`, using a `.fade-out` class and 300ms timeout.
	- Animated stats in hero: `IntersectionObserver` (threshold 0.5) triggers `animateNumbers()` once; easing is `easeOutCubic`.
		- Scroll-in animations: elements get `.animate-on-scroll` then `.element-visible` via an observer; a consolidated observer applies `.fade-in.visible` a secciones y cards.

Repo-specific conventions
- Language: all UI text is Spanish; keep diacritics (á, é, í, ó, ú, ñ) and tone consistent.
- CSS: extend `:root` variables; prefer component classes over inline styles; keep shadows/radii/spacing via vars; match media query breakpoints already used.
- JS: avoid heavy work in `scroll`; keep throttling/debouncing; prefer augmenting existing observers over creating new ones; add/remove classes rather than inline styles.
- Assets: reference via relative paths under `assets/`; provide meaningful Spanish `alt` text.

Integration points and dependencies
- External CDNs: Google Fonts, Font Awesome; no bundler.
- Contacto es exclusivamente vía WhatsApp (CTA en `#contacto` con `https://wa.me/<numero>`). Ajusta el número y el texto `?text=` según necesidad.
- No hay formulario de contacto ni backend asociado.

Common tasks (how to do them here)
- Add a new section: create a `<section id="...">` in `index.html`; add styles near the matching section header in `styles.css`; include the section class in the animated selectors in `script.js` so it fades in on scroll.
- Add a gallery item: duplicate a `.proyecto` card in `#galeria`, set `data-category` to `portafolios|landing|desarrollo`, update image and text. Filtering will work automatically.
- Tweak anchor scrolling: update the `offsetTop - 100` constant in `script.js` if header height changes.
- Personalizar WhatsApp CTA: edita el enlace de `#contacto` (y el botón flotante si aplica) con el número y mensaje correcto.

Pitfalls seen in this repo (avoid/reconcile)
- Evita reintroducir scripts inline en `index.html` (centraliza en `script.js`).
- Observers de scroll: usa el existente; evita crear más de los necesarios para no duplicar animaciones.

Run/preview and deployment
- No build. Preview locally with a static server (e.g., VS Code Live Server). Paths are root-relative; keep `index.html` at repo root for GitHub Pages.
- Because `CNAME` is present, keep the root file layout and don’t rename `index.html`.

Examples
- New gallery card snippet (HTML): duplicate `.proyecto` and set `data-category="landing"` and `img alt="Landing ..."`.
- Adding a new animated component: ensure its selector is included where `animatedElements` and the consolidated observer select elements in `script.js`.

Code pointers
- Header scroll logic: `script.js` toggles `.header-main.scrolled`; styles live under “HEADER” in `styles.css`.
- Filter behavior: `.filtro-btn` click handler; fade timing is 300ms; CSS class `.fade-out` injected via `<style>` tag in `script.js`.
- Stats animation: `.number` elements in hero; easing and duration (2000ms) in `animateNumbers()`.

If you’re unsure
- Favor existing class names and variables; mirror patterns already present.
- Ask before introducing new libraries or a build step.
