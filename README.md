# LogicLab

An interactive four-bit ALU field guide. The homepage and simulator run entirely in the browser; no account or backend is required.

## Run locally

### Recommended: Vite

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Open the local address printed by Vite (by default `http://127.0.0.1:5173`). Vite supports both the homepage and direct navigation to `/simulator`.

### VS Code Live Server

Open the repository's root `index.html` with Live Server. Stylesheets are linked directly from the HTML, and the import map resolves the optional Three.js hero from the installed local dependency. Install dependencies first with `npm ci`.

Live Server serves static files and may not rewrite `/simulator` to `index.html` on a page refresh. Use Vite when you need reliable direct route refreshes.

Run the testable ALU engine with `npm test` and create a production build with `npm run build`.

The optional Three.js hero is loaded only on eligible desktop viewports when reduced motion and Save-Data are disabled. The simulator itself uses an accessible SVG circuit and works independently of WebGL.
