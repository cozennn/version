# NORDA

Static multi-page website for NORDA.

## Run locally

The project uses plain HTML, CSS and JavaScript. From the repository root, start a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

Do not rely on opening the HTML files directly with `file://`; use a local HTTP server so relative assets and browser requests behave as expected.

## Project structure

- `index.html`, `templates.html`, `digital.html`, `product.html`, `contact.html`, `faq.html`: website pages.
- `assets/style.css`: shared site styles.
- `assets/chat.css`: support chat styles.
- `assets/main.js`: navigation, language selector, cart, product animation and shared UI.
- `assets/script.js`: language translations, contact form and support-ticket chat behavior.
- `assets/config.js`: Worker endpoint and social account handles.
- `assets/products.js`: product catalog, category labels and price formatting.

## Update site settings

- Edit `assets/config.js` to update the Cloudflare Worker endpoint and social handles.
- Edit `assets/products.js` to add or update products, categories, prices, images and descriptions.
- Shared layout and visual styles belong in `assets/style.css` and `assets/chat.css`.

## Contact form and support chat

The browser sends contact form and support-ticket requests to the Cloudflare Worker configured in `assets/config.js`. The Worker implementation is maintained separately from this repository. Server-side validation, CORS rules, spam protection, upload validation and rate limiting must be maintained and tested in the Worker itself.

## Deployment

The default branch is `main`. If the hosting provider is connected to this repository and branch, commits pushed to `main` trigger its configured deployment workflow.
