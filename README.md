# Evanghelina Ciobanu — Concert Cellist & Cello Studio

A bespoke, responsive portfolio and private studio website for professional cellist and educator **Evanghelina Ciobanu** (Doctor of Musical Arts, Peabody Institute). 

Designed with an editorial classical music aesthetic, featuring high-performance media embeds, an interactive 3D gallery carousel, studio inquiries, and performance booking workflows.

---

## ✨ Features & Architecture

- **Editorial Classical Design:** Clean typography pairing Cormorant Garamond with Archivo, grounded in a refined charcoal, ivory, and signature burgundy/wine accent (`#7a2331`) with ruby-red interactive states (`#c41230`).
- **Frosted Glass Navigation:** Sticky, blurred header with a mobile hamburger navigation drawer and accessible focus states.
- **3D Studio Moments Carousel:** Custom CSS 3D perspective wheel carousel supporting keyboard navigation (arrow keys), touch gestures (swipe), and pagination dots.
- **Native Portrait Media Showcase:** Responsive 9:16 vertical video cards running self-hosted, web-compressed MP4 excerpts (edge-to-edge playback with zero letterboxing bars).
- **Interactive Studio FAQ:** Accessible native `<details>` and `<summary>` accordion with smooth auto-closing behavior via JavaScript.
- **Performance & Lesson Inquiries:** Integrated Formspree endpoints with spam honeypot filters and a direct `mailto:` fallback.
- **Floating Action Controls:** Smooth scroll-triggered floating pill for quick booking inquiries and a discrete back-to-top button.
- **SEO & Social Sharing:** Fully configured Open Graph meta tags (`og:title`, `og:image`, `og:description`) and modern favicon support.

---

## 📁 Project Structure

```text
├── index.html              # Main website structure & content
├── styles.css              # Custom styling, responsive layout, & animations
├── script.js               # Carousel mechanics, FAQ accordion, & scroll effects
├── assets/
│   ├── videos/             # Web-optimized performance excerpts (.mp4)
│   │   ├── Short_1745_crop_compress.mp4
│   │   ├── Short_2577_crop_compress.mp4
│   │   └── Short_2578_crop_compress.mp4
│   └── images/             # Studio photography, headshots, and social assets
└── README.md               # Project documentation
