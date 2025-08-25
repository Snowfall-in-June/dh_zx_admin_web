DH Admin (minimal)

This is a minimal Vue 3 + Vite admin skeleton with:
- Login (mocked)
- Article list, create, edit, delete (stored in localStorage)

Quick start (zsh):

```bash
cd /Users/mars/disk/dhCode/dh_zx_admin_web
npm install
npm run dev
```

Open http://localhost:5173 and you'll be redirected to /login. Any non-empty username/password will succeed (demo).

Production build with code obfuscation

After installing dependencies, run:

```bash
npm run build
```

The `build` script runs `vite build` and then `node scripts/obfuscate.js`, which obfuscates `.js` files in `dist/` using `javascript-obfuscator`.
