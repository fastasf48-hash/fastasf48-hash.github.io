# rahulsharma.dev — portfolio site

A single-page portfolio for Rahul Sharma, Automation Engineer. No build step, no
framework, no dependencies — open `index.html` and it runs.

```
Profile Website/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── img/rahul-casual.jpg          hero portrait
│   ├── img/rahul-formal.jpg          about-section portrait
│   └── Rahul_Sharma_Automation_Engineer_Resume.pdf
└── README.md
```

## Sections

Hero · Stats · About · Experience · Skills · Framework deep-dive · Projects ·
Education & Achievements · Contact.

The Framework section is the centrepiece: three test layers, six "why it holds up"
pillars, a clickable architecture explorer, four tabbed code samples, an animated
CI pipeline, and an accordion of real bugs that were debugged out of the project.

## Publishing it (GitHub Pages — free, ~3 minutes)

```bash
cd "C:\Users\alkas\OneDrive\Desktop\Profile Website"
git init
git add .
git commit -m "Portfolio site"
gh repo create fastasf48-hash.github.io --public --source=. --push
```

The site is then live at `https://fastasf48-hash.github.io` — put that URL at the
top of the résumé next to the GitHub and LinkedIn links.

To use a custom domain later, add a `CNAME` file containing the domain and point
its DNS at GitHub Pages.

Any static host works equally well: drag the folder onto
[netlify.com/drop](https://app.netlify.com/drop), or run `vercel` in this folder.

## Editing

- **Text** — all copy lives in `index.html`, in plain HTML, section by section.
- **Colours** — the `:root` block at the top of `style.css`. Deep ink base with a
  single emerald→cyan accent: `--acc` is the emerald (which doubles as the
  "passing" signal, via the `--pass` alias), `--acc-2` the cyan that closes the
  gradient. `--acc-3` is violet and is deliberately reserved for the AI project
  only — badge, glow, DB tag — so it reads as "this one is different" rather than
  as decoration. Light-theme overrides sit right below.
- **The terminal animation** — the `script` array in the `terminal()` function in
  `main.js`. Keep lines under ~45 characters so they don't wrap.
- **The architecture explorer** — each folder is a `<button class="node">` in
  `index.html`; its `data-title`, `data-desc` and `data-meta` attributes are what
  render in the panel. Add a button, get a new entry.
- **Résumé** — replace the PDF in `assets/` with the same filename and the
  download buttons keep working.

> **After editing CSS or JS, bump the `?v=` number** on the `<link>` and
> `<script>` tags in `index.html`. GitHub Pages serves assets with
> `Cache-Control: max-age=600`, so without the bump a browser that already
> visited the site keeps showing the old stylesheet and it looks like the change
> never deployed.

## Notes

- Dark theme by default; the toggle persists the choice in `localStorage`.
- Fully responsive down to 390px, with a mobile nav drawer.
- Honours `prefers-reduced-motion` — every animation is disabled for users who
  ask for that.
- Has a print stylesheet, so "Save as PDF" from the browser produces something
  readable.
- Only external request is the Google Fonts stylesheet; everything else is local.
