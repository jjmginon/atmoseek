# AtmoSeek 🌤️🔍

AtmoSeek is a weather application built in 2026 with a modern design system, accessibility‑first structure, and performance‑optimized styling. It integrates real‑time weather data via a Netlify serverless function, blending semantic HTML, responsive SCSS, and modular JavaScript into a cohesive user experience.

---

## 🌐 Project Overview

This app demonstrates how a weather interface can be elevated into a professional web project:

- **Semantic HTML5** for clarity, accessibility, and maintainability
- **Responsive SCSS** with variables, grid, flexbox, and adaptive breakpoints
- **JavaScript (ES6 modules)** for state management, API integration, and dynamic DOM rendering
- **Netlify serverless functions** to securely proxy WeatherAPI requests
- **Accessible search** with ARIA‑compliant autocomplete and keyboard navigation

---

## 📂 File Structure

```
AtmoSeek/
│
├── dist/
│   ├── index.html          # App shell
│   ├── css/
│   │   ├── main.min.css    # Compiled CSS
│   │   └── main.min.css.map
│   ├── js/
│       ├── main.js         # Entry point, event wiring
│       ├── CurrentLocation.js # Location state class
│       ├── dataFunctions.js   # API helpers
│       ├── domFunctions.js    # DOM rendering logic
│       └── autocomplete.js    # ARIA combobox search
│
├── scss/
│   ├── abstracts/          # Colors, mixins
│   ├── base/               # Resets, base styles
│   ├── components/         # Buttons, accessibility helpers
│   ├── layout/             # Search, controls, current, forecast
│   └── themes/             # Background gradients
│
├── netlify/
│   └── functions/
│       └── weather.mjs     # Serverless WeatherAPI proxy
│
├── netlify.toml            # Netlify build configuration
└── .gitignore              # Ignored files (config, .env, .netlify)
```

---

## ✨ Highlights

- **Accessibility‑first design**  
  Semantic elements, ARIA roles, screen reader live regions, and focus styles for keyboard users.

- **Responsive layout**  
  Flexbox and grid for adaptive sections, fluid typography, and mobile‑first breakpoints.

- **Modern styling**  
  SCSS variables, theme gradients, dark/night mode, and component‑based class naming.

- **Dynamic search**  
  Debounced autocomplete with ARIA combobox support, keyboard navigation, and pointer interaction.

- **Serverless integration**  
  Netlify function securely proxies WeatherAPI requests, keeping API keys hidden.

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/AtmoSeek.git
   ```
2. Navigate into the project folder:
   ```bash
   cd AtmoSeek
   ```
3. Install dependencies (if any) and run locally with Netlify Dev:
   ```bash
   netlify dev
   ```
4. Or open `dist/index.html` directly in your browser for a static preview.

---

## 🛠️ Technologies

- **HTML5** — semantic structure and accessibility
- **SCSS** — variables, grid, flexbox, transitions, themes
- **JavaScript (ES6 modules)** — state, API, DOM rendering
- **Netlify Functions** — backend proxy for WeatherAPI

---

## 📖 Context

AtmoSeek was designed as a modern weather application showcasing accessibility, performance, and design clarity. It demonstrates how modular SCSS, ES6 JavaScript, and serverless functions can combine into a scalable, professional web experience.

---

## 👨‍💻 Author

**JJ Ginon**  
Front‑end Web Developer | Accessibility‑first, performance‑optimized, modern web projects
