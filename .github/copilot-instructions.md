# Copilot Instructions for `tuportafolioweb`

This is a static portfolio website built with HTML5, CSS3, and Vanilla JavaScript.

## Architecture & Tech Stack
- **Type:** Static Website (HTML/CSS/JS)
- **Deployment:** GitHub Pages (managed via `CNAME`)
- **Core Files:**
  - `index.html`: Main structure and content (Single Page Application feel).
  - `styles.css`: All styling, using native CSS variables for theming.
  - `script.js`: Interactive behavior (navigation, gallery filtering, animations).

## Coding Conventions

### HTML (`index.html`)
- Use semantic HTML tags (`header`, `nav`, `section`, `article`, `footer`).
- Image paths are relative to `assets/` folder (e.g., `src="assets/logo.png"`).
- IDs are used for navigation anchors (`#servicios`, `#proyectos`).
- Maintain accessibility attributes (`aria-label`, `alt` text).

### CSS (`styles.css`)
- **Theme System:** STRICTLY use existing CSS variables defined in `:root` (e.g., `var(--color-primary)`, `var(--sp-4)`). Do not hardcode hex values or pixel spacings unless correcting the theme itself.
- **Methodology:** Loose BEM conventions mixed with descriptive utility classes.
- **Responsive:** Mobile-first considerations. Large screens handled via media queries (typically `min-width`).
- **Typography:** Uses 'Playfair Display' for headings and 'Inter' for body.

### JavaScript (`script.js`)
- **Style:** Vanilla JavaScript (ES6+). No jQuery or framework dependencies.
- **Events:** Use `DOMContentLoaded` for initialization.
- **Performance:** Throttle scroll events (see `scrollTimeout` implementation).
- **Language:** Comments and variable names for business logic tend to be in Spanish (e.g., `filtroBtns`, `proyectos`), while generic utils might be English. Follow the existing file's pattern.

## Key Components & Patterns

1.  **Navigation**:
    - Header becomes `scrolled` on scroll (handled in JS).
    - Mobile menu uses `.menu-toggle` and `.main-nav` with class toggling.

2.  **Gallery/Projects**:
    - Filtering relies on `data-` attributes (check HTML structure for `data-category`).
    - Grid layout managed via CSS Grid/Flexbox.

3.  **Styling**:
    - "Cards" use `var(--surface-1)`, `var(--shadow-sm)`, `var(--radius-md)`.
    - Buttons rely on classes like `.btn-principal` and `.btn-secundario`.

## External Dependencies
- **Font Awesome:** Loaded via CDN for icons.
- **Google Fonts:** Inter & Playfair Display.

## Development Workflow
- **Run:** Open `index.html` directly in a browser or use a local server (e.g., Live Server).
- **Build:** None. Files are served as-is.
- **Deploy:** Push to `main` branch trigger GitHub Pages build.
