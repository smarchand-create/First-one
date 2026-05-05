# ATS Growth OS — Prototype Bundle

Two interactive prototypes for the ATS Growth OS offering:

1. **Growth OS Assessment** — a 25-question maturity diagnostic that captures
   qualified leads, scores them across the five Growth OS dimensions, and
   benchmarks them against peers and the ATS Marketing Floor.
2. **Growth OS Cockpit** — a SaaS dashboard for the four published agents
   (Demand, Content, Analytics, Ops) plus the operating-system layers
   (Governance, Optimization). Includes the Predictive Demand Engine.

## How to run

### Option A — Online (no install, easiest)

1. Go to **stackblitz.com** and sign in (Google or GitHub).
2. Click "New project" → "Import from GitHub or upload" → upload this
   entire folder as a zip.
3. StackBlitz auto-detects the Vite project, installs dependencies, and
   gives you a live URL.

Alternative: same process works on **codesandbox.io** — click
"Create" → "Import" → "Upload" and drop in this zip.

### Option B — Local (if you have Node.js)

Requires Node.js 18+ installed.

```bash
npm install
npm run dev
```

The app will open at http://localhost:5173

### Option C — Hand to a developer

The whole project is standard Vite + React. Any frontend developer
can run it in under a minute. No backend, no database, no API keys —
all data is mocked in the React components for demo purposes.

## Project structure

```
src/
  main.jsx          ← Entry point with prototype switcher
  Assessment.jsx    ← Growth OS Assessment (25-question diagnostic)
  Cockpit.jsx       ← Growth OS Cockpit (SaaS dashboard)
package.json        ← Dependencies (recharts, lucide-react)
vite.config.js      ← Build config
index.html          ← Root HTML
```

## What you'll see

A demo home page lets you choose between the two prototypes. Each opens
in full screen with a "← Demo home" button in the top-right corner to
return to the chooser.

The Assessment is best experienced end-to-end (intro → questions →
lead form → results). The Cockpit's left sidebar navigates between
the four agents and the OS-layer pages.

## Next steps when you're ready to ship

The prototypes are demo-grade — full UI/UX, mock data. Going live
requires:

- Wiring the Demand Agent to a real CRM (Salesforce/HubSpot)
- Building the propensity scoring model on real account data
- Deploying the agents on the Anthropic API
- Standing up the cohort benchmarking dataset (the Assessment seeds this)
- Authentication, multi-tenant data isolation, etc.

— Built April 2026 for Advanced Technology Services
