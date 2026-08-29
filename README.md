# 🎬 COEP Impressions '26 (Coming Soon)

<div align="center">

![COEP Impressions '26](assets/impressions-text-logo.png)

### **The 11th Edition of COEP Technological University's Annual Cultural Festival**
*“By the artist, for the artist”*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Status-Live%20Coming%20Soon-brightgreen?style=for-the-badge)](#)

</div>

---

## 🌟 Overview

Welcome to the official repository for the **COEP Impressions '26 Coming Soon Webpage**. Designed with a **Vintage Retro Bollywood Cinema Poster** aesthetic, this theatrical landing page introduces the 11th edition of Impressions — the signature annual cultural festival of **COEP Technological University, Pune**.

The centerpiece is a high-fidelity **3D Interactive Cinema Ticket Pass** that responds dynamically to mouse movement, complemented by sweeping 35mm filmstrip ribbons, floating cinema dust particles, and iconic vintage stage props.

---

## ✨ Key Features

- 🎟️ **Interactive 3D Ticket Pass**:
  - Realistic 3D perspective tilt reacting to cursor motion.
  - Dynamic **specular sheen glare** shader that tracks mouse position across the ticket face.
  - Authentic semicircular edge notches and dashed perforation tear lines.
  - Official COEP crest header, edition ribbon, and red script Impressions logo stub.
  - Sleek **COMING SOON** stage status banner.

- 🎞️ **Theatrical Proscenium & Film Tapes**:
  - Sweeping 35mm filmstrip ribbon arching across the top proscenium.
  - Curving film ribbons framing the right and bottom stage borders.
  - Ambient floating projector dust particles and subtle vintage vignette lighting.

- 🎙️ **Vintage Theatrical Props & Parallax**:
  - Stylized retro studio microphone (top-left) with a dynamic angle tilt.
  - Director's clapperboard (lower-left).
  - Retro loudspeaker horn (top-right) with luminous contrast backlight.
  - Glitter disco ball with ruby & silver stars (lower-right).
  - Smooth multi-plane mouse parallax movement across all stage elements.

- 📱 **Responsive & Mobile-Ready**:
  - Seamless adaptation across ultra-wide monitors, laptops, tablets, and mobile devices.
  - Clean flexbox and grid layouts that preserve readability on any screen size.

- ⚡ **Lightweight & High Performance**:
  - **100% Vanilla Tech Stack**: Pure HTML5, Vanilla CSS3, and native JavaScript.
  - Zero heavy third-party framework overhead for instant page load times.

- ♿ **Accessibility First**:
  - Full fallback support for `prefers-reduced-motion` (disables 3D tilt and floating loops for users sensitive to motion).
  - Semantic HTML landmarks (`<main>`, `<footer>`, `<header>`) and ARIA labels.

---

## 🎨 Design System & Aesthetics

| Element | Specification |
| :--- | :--- |
| **Theme** | Vintage Retro Bollywood Cinema Poster / Theatrical Event Pass |
| **Crimson Palette** | Base: `#7A0F15` · Deepest: `#2B0305` · Curtain: `#680E14` |
| **Gold Accents** | Bright Gold: `#FBD34D` · Antique Gold: `#E5A823` · Glow: `rgba(251, 211, 77, 0.45)` |
| **Parchment Paper** | Pure: `#FFFBF0` · Cream: `#F5E8CB` · Dark: `#E2CF9F` |
| **Ink Typography** | Vintage Charcoal: `#18090A` · Soft Maroon: `#381E21` |
| **Typography** | `Dinosic` (Title), `Anorthic` (Vintage Script), `Uber Move` & `Uber Move Text` |

---

## 📁 Repository Structure

```text
finalwebsite/
├── index.html                  # Main semantic HTML5 markup & proscenium structure
├── styles.css                  # CSS tokens, 3D card physics, animations & media queries
├── script.js                   # Vanilla JS 3D cursor tilt, specular glare & parallax
├── README.md                   # Project documentation & overview
│
├── assets/                     # Graphic assets, SVGs & raster props
│   ├── COEP-logo.webp          # Official COEP University crest
│   ├── Foot_logo_red.png       # Impressions red footprint emblem
│   ├── impressions-text-logo.png # Official Impressions script logo
│   ├── bg-bollywood-poster.png # Vintage Bollywood textured backdrop
│   ├── film-ribbon-top.svg     # Top sweeping 35mm film ribbon
│   ├── film-ribbon-right.svg   # Right flank curving film tape
│   ├── film-ribbon-bottom.svg  # Bottom flank curving film tape
│   ├── prop-mic.png            # Vintage studio microphone (top-left)
│   ├── prop-clapper.svg        # Director clapperboard (lower-left)
│   ├── download.png            # Retro loudspeaker horn (top-right)
│   ├── ballnew.png             # Glitter disco ball with stars (lower-right)
│   └── favicon.png             # Website favicon
│
├── fonts/                      # Custom typography webfonts
│   ├── Dinosic.otf
│   ├── anorthic.otf
│   ├── UberMove-Bold.woff2
│   ├── UberMove-Medium.woff2
│   ├── UberMove-Regular.woff2
│   ├── UberMoveText-Bold.woff2
│   └── UberMoveText-Regular.woff2
│
└── imaaages/                   # Source inspiration & design reference assets
```

---

## 🚀 Quick Start & Local Development

No complex build setup is required. You can run the project locally using any static web server:

### Option 1: Using `serve` (Node.js)
```bash
# Start local server on port 8080
npx -y serve -l 8080 .
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Using Python
```bash
# Python 3
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 3: VS Code Live Server
1. Install the **Live Server** extension in VS Code.
2. Right-click [`index.html`](index.html) and select **Open with Live Server**.

---

## 🌐 Connect With Us

Stay tuned for official event dates, pass releases, and artist line-ups:

- 📷 **Instagram**: [@impressions_coep](https://www.instagram.com/impressions_coep/)
- 🎥 **YouTube**: [@COEPImpressions](https://www.youtube.com/@COEPImpressions)
- 💼 **LinkedIn**: [COEP Impressions](https://www.linkedin.com/company/impressions-coep/)
- 🏛️ **University**: [COEP Technological University, Pune](https://www.coep.org.in/)

---

<div align="center">

Made with ❤️ by the **COEP Impressions Web & Design Team**  
*COEP Technological University, Shivajinagar, Pune — 411005*

</div>
