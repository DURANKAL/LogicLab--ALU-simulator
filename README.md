# LogicLab

An interactive four-bit ALU field guide. The homepage and simulator run entirely in the browser; no account or backend is required.

## Run locally

```powershell
npm install
npm run dev -- --host 127.0.0.1
```

Open the local address printed by Vite (by default `http://127.0.0.1:5173`). Run the testable ALU engine with `npm test` and create a production build with `npm run build`.

The optional Three.js hero is loaded only on eligible desktop viewports when reduced motion and Save-Data are disabled. The simulator itself uses an accessible SVG circuit and works independently of WebGL.
