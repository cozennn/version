// assets/products.js
// NORDA — products catalog
// To edit: change name, price, category, image, description
// To add: append a new object to the array

window.NORDA_PRODUCTS = [
  // ─── TEMPLATES (websites) ───────────────────────
  {
    id: "tpl-atelier",
    type: "template",
    name: "Atelier",
    tagline: "Portfolio site for designers & photographers",
    price: 79,
    category: "layout",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    tags: ["Portfolio", "Dark", "Minimal"],
    description: "A gallery-first portfolio with masonry grid, case-study pages and a contact form. Built with vanilla HTML, CSS and a sprinkling of GSAP for entrances.",
    includes: ["HTML + CSS + JS", "4 pages", "Masonry gallery", "Contact form", "Figma file"],
    featured: true
  },
  {
    id: "tpl-studio",
    type: "template",
    name: "Studio",
    tagline: "Bold agency site with sticky sections",
    price: 99,
    category: "navigation",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tags: ["Agency", "Bold", "Sticky"],
    description: "An agency site with sticky hero, scroll-triggered reveals, a services list and a project index. Perfect for studios that want to feel big.",
    includes: ["HTML + CSS + JS", "5 pages", "Sticky sections", "Scroll animations", "Figma file"],
    featured: true
  },
  {
    id: "tpl-form",
    type: "template",
    name: "Form",
    tagline: "Conversion-focused landing page",
    price: 49,
    category: "form",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["Landing", "Conversion", "Light"],
    description: "A single-page landing site with a multi-step form, social proof and a pricing table. Built to convert.",
    includes: ["HTML + CSS + JS", "1 page", "Multi-step form", "Pricing table", "Figma file"],
    featured: false
  },
  {
    id: "tpl-motion",
    type: "template",
    name: "Motion",
    tagline: "Animation-heavy showcase",
    price: 129,
    category: "animation",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    tags: ["Animation", "Dark", "GSAP"],
    description: "A scroll-driven showcase with image transitions, text reveals and a custom cursor. Uses GSAP + ScrollTrigger.",
    includes: ["HTML + CSS + JS", "3 pages", "GSAP ScrollTrigger", "Custom cursor", "Figma file"],
    featured: true
  },

  // ─── DIGITAL (subscriptions / tools) ────────────
  {
    id: "dig-icons",
    type: "digital",
    name: "Icon Set — Mono",
    tagline: "400 monoline SVG icons",
    price: 29,
    category: "icon",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    tags: ["Icons", "SVG", "Monoline"],
    description: "400 hand-drawn monoline icons in SVG, optimized for 24px. Includes Figma library and icon font.",
    includes: ["400 SVG icons", "Figma library", "Icon font", "License (single project)"],
    subscription: false,
    featured: true
  },
  {
    id: "dig-presets",
    type: "digital",
    name: "Grain Presets",
    tagline: "12 film-grain presets for Lightroom",
    price: 19,
    category: "preset",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    tags: ["Lightroom", "Presets", "Film"],
    description: "Twelve film-inspired grain presets for Lightroom Classic and CC. Warm, cool, neutral, and gritty variations.",
    includes: ["12 .xmp presets", "Install guide", "License (unlimited personal)"],
    subscription: false,
    featured: false
  },
  {
    id: "dig-norda-plus",
    status: "inquiry",
    type: "digital",
    name: "NORDA Plus",
    tagline: "Monthly access to all templates",
    price: 25,
    category: "subscription",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tags: ["Subscription", "All access", "Monthly"],
    description: "Every template we've ever made, plus new ones as they ship. Cancel anytime. Includes Figma files and updates.",
    includes: ["All templates", "New releases", "Figma files", "Priority support", "Cancel anytime"],
    subscription: true,
    interval: "month",
    featured: true
  },
  {
    id: "dig-norda-pro",
    status: "inquiry",
    type: "digital",
    name: "NORDA Pro",
    tagline: "Yearly access + 1:1 review",
    price: 199,
    category: "subscription",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    tags: ["Subscription", "Yearly", "Review"],
    description: "Everything in Plus, plus a yearly 1:1 design review with our team and early access to new releases.",
    includes: ["Everything in Plus", "1:1 review (60 min)", "Early access", "Commercial license"],
    subscription: true,
    interval: "year",
    featured: false
  }
];

// Category display names — change here to rename filters
window.NORDA_CATEGORIES = {
  // templates
  animation:   "Animation",
  navigation:  "Navigation",
  layout:      "Layout",
  form:        "Form",
  // digital
  icon:        "Icons",
  preset:      "Presets",
  subscription:"Subscriptions"
};

// Format price with currency
window.NORDA_FMT = (n) => "$" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

// Load the managed catalog from NORDA's Worker. The local catalog above remains
// a safe fallback if the API is unavailable.
(function loadManagedCatalog() {
  const api = (window.NORDA_CONFIG && window.NORDA_CONFIG.TELEGRAM_API) ||
    "https://norda-api.houda2004houdaa.workers.dev";
  fetch(api.replace(/\\/+$/, "") + "/products/public", { headers: { Accept: "application/json" } })
    .then(response => response.ok ? response.json() : null)
    .then(result => {
      if (!result || !Array.isArray(result.products) || !result.products.length) return;
      const products = result.products.map(item => ({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : [],
        includes: Array.isArray(item.includes) ? item.includes : [],
        featured: item.featured === true,
        subscription: item.subscription === true
      }));
      const signature = JSON.stringify(products);
      let previous = "";
      try { previous = sessionStorage.getItem("norda:managed-catalog") || ""; } catch {}
      window.NORDA_PRODUCTS = products;
      try { sessionStorage.setItem("norda:managed-catalog", signature); } catch {}
      // Page-level product renderers are synchronous; reload once when the
      // managed catalog differs so every page renders the latest records.
      if (previous && previous !== signature) location.reload();
      else if (!previous) {
        try { sessionStorage.setItem("norda:managed-catalog", signature); } catch {}
        if (products.length !== 8) location.reload();
      }
    })
    .catch(() => {});
})();
