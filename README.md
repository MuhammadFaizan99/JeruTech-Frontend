# JeruTech

Modern online platform for mobiles, laptops, accessories, and electronic devices.

## Tech Stack

- **React.js** with **Vite**
- **React Router DOM** — page navigation
- **Framer Motion** — animations, page transitions, micro-interactions
- **AOS** — scroll reveal animations
- **React Icons** — icon library
- **SCSS** — premium custom theme (`premium.scss`)
- **Bootstrap** — responsive grid layout
- **Tailwind CSS** — utility classes (prefixed with `tw-`)
- **Material UI (MUI)** — UI components, forms, layout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Pages

| Route       | Page          |
|-------------|---------------|
| `/`         | Home          |
| `/products` | Products      |
| `/discount` | 50% Discount  |
| `/learn`    | Learn / Blogs |
| `/contact`  | Contact Us    |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── BlogCard.jsx
│   ├── CategoryCard.jsx
│   └── effects/
│       ├── PageBackground.jsx
│       ├── ScrollReveal.jsx
│       ├── GlowButton.jsx
│       ├── HeroShowcase.jsx
│       ├── CountdownTimer.jsx
│       └── ...
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Discount.jsx
│   ├── Learn.jsx
│   └── Contact.jsx
├── data/
│   ├── products.js
│   └── blogs.js
├── styles/
│   ├── main.scss
│   └── variables.scss
├── App.jsx
├── main.jsx
└── index.css
```

## Theme Colors

- `#0F172A` — Primary background
- `#1E3A8A` — Dark blue
- `#2563EB` — Primary blue
- `#3B82F6` — Light blue accent
