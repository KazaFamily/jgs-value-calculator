**JGS Value Calculator**

A small web app that helps salespeople articulate the value potential of the software and services they sell. Enter customer inputs and assumptions to calculate and present ROI, cost savings, and other value metrics that support selling conversations.

Live demo: https://KazaFamily.github.io/jgs-value-calculator

**Current requirements**
- Node.js (v18+ recommended)
- npm (or a compatible package manager)
- A modern browser
- (Optional) `GEMINI_API_KEY` if you want to enable AI features that call the Gemini API

**Install and run locally**
1. Install dependencies
   npm install
2. Create your environment file (optional)
   Copy `.env.example` to `.env.local` and set any values you need, for example:
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
3. Run the dev server
   npm run dev

The dev server uses Vite and serves on port 3000 by default (`vite --port=3000`).

**Build for production**
1. Build the app
   npm run build
   This generates a production-ready `dist/` output using Vite.
2. Preview the build locally (optional)
   npm run preview

**Deploy**
- GitHub Pages: build the app (`npm run build`) and publish the contents of `dist/` to the `gh-pages` branch or to a `docs/` folder on the `main` branch. There are many ways to automate this (GitHub Actions, `gh-pages` npm package, or manual upload).
- Any static host: copy `dist/` to your static hosting provider (Netlify, Vercel, S3, etc.).

**Notes**
- The codebase is built with React + TypeScript and Vite. See `package.json` for current scripts and dependency versions.
- If you do not set `GEMINI_API_KEY`, core calculator functionality works without AI features; AI-enhanced helper features will be disabled.
- If you want a recommended Node version or CI setup, add an `engines` field to `package.json` or a simple GitHub Actions workflow to build and publish the `dist/` folder.

If you'd like, I can also add a short GitHub Actions workflow to automatically build and publish to GitHub Pages.
