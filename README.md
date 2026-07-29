# AtmoSeek 🌤️🔍

AtmoSeek is a weather application built in 2026 with a modern design system, accessibility‑first structure, and performance‑optimized styling. It integrates real‑time weather data via Open‑Meteo's free API and a Netlify serverless function, blending semantic HTML, responsive SCSS, and modular JavaScript into a cohesive user experience.

---

## 🌐 Project Overview

This app demonstrates how a weather interface can be elevated into a professional web project:

- **Semantic HTML5** for clarity, accessibility, and maintainability
- **Responsive SCSS** with variables, grid, flexbox, and adaptive breakpoints
- **JavaScript (ES6 modules)** for state management, API integration, and dynamic DOM rendering
- **Netlify serverless function** proxying Open‑Meteo's geocoding API — no API key required, zero secrets in client code
- **Accessible search** with ARIA‑compliant autocomplete and keyboard navigation
- **7‑day forecast** powered by Open‑Meteo's free weather API

---

## 📂 File Structure

```
AtmoSeek/
│
├── dist/
│   ├── index.html              # App shell
│   ├── css/
│   │   ├── main.min.css        # Compiled CSS
│   │   └── main.min.css.map
│   └── js/
│       ├── main.js             # Entry point, event wiring
│       ├── CurrentLocation.js  # Location state class
│       ├── dataFunctions.js    # API helpers
│       ├── domFunctions.js     # DOM rendering logic
│       └── autocomplete.js     # ARIA combobox search
│
├── scss/
│   ├── abstracts/              # Colors, mixins
│   ├── base/                   # Resets, base styles
│   ├── components/             # Buttons, toast, accessibility helpers
│   ├── layout/                 # Search, controls, current, forecast
│   └── themes/                 # Condition-based background gradients
│
├── netlify/
│   └── functions/
│       └── weather.mjs         # Serverless geocoding proxy (Open‑Meteo)
│
├── netlify.toml                # Netlify build configuration
└── .gitignore                  # Ignored files (.env, .netlify)
```

---

## ✨ Highlights

- **Accessibility‑first design**  
  Semantic elements, ARIA roles, screen reader live regions, toast notifications, and focus styles for keyboard users.

- **Responsive layout**  
  Mobile‑first flexbox and grid, fluid typography, and adaptive breakpoints from 360px up.

- **Modern styling**  
  SCSS variables, condition‑based atmospheric gradients, night mode, frosted glass surfaces, and BEM class naming.

- **Dynamic search**  
  Debounced autocomplete with ARIA combobox support, keyboard navigation (arrow keys, Enter, Escape), and pointer interaction.

- **Serverless integration**  
  Netlify function proxies Open‑Meteo's geocoding API — no API key anywhere in client code. Weather forecast data is fetched directly from Open‑Meteo's keyless public API.

- **7‑day forecast**  
  Full week outlook with WMO weather code mapping to Font Awesome icons, condition labels, and atmospheric background themes.

- **Toast notifications**  
  Lightweight save confirmation with auto‑dismiss, mobile‑responsive wrapping, and reduced‑motion support.

---

## 🚀 Getting Started

1. Clone the repository:

```bash
   git clone https://github.com/jjmginon/atmoseek.git
```

2. Navigate into the project folder:

```bash
   cd atmoseek
```

3. Install the Netlify CLI if you haven't already:

```bash
   npm install -g netlify-cli
```

4. Log in to Netlify:

```bash
   netlify login
```

5. Run locally with Netlify Dev:

```bash
   netlify dev
```

> No API key or `.env` file needed — Open‑Meteo is completely free and keyless.

---

## 🛠️ Technologies

- **HTML5** — semantic structure and accessibility
- **SCSS** — BEM methodology, variables, mixins, mobile‑first breakpoints
- **JavaScript (ES6 modules)** — state management, API integration, DOM rendering
- **Open‑Meteo API** — free, keyless weather and geocoding data
- **Netlify Functions** — serverless geocoding proxy, zero secrets in client code
- **Netlify CLI** — local development and deployment

---

## 📖 Context

AtmoSeek was designed as a modern weather application showcasing accessibility, performance, and design clarity. It demonstrates how modular SCSS, ES6 JavaScript, and serverless functions can combine into a scalable, professional web experience — including a deliberate API architecture decision: Open‑Meteo was chosen over key‑based alternatives specifically because it eliminates credential exposure without requiring a full backend.

---

## 👨‍💻 Author

**JJ Ginon**  
Front‑end Web Developer | Accessibility‑first, performance‑optimized, modern web projects
