// assets/main.js
/* =========================================================
   NORDA — main.js
   Splash · GSAP entrances · Cart · Language · Fly-to-bag · FABs
   ========================================================= */

// ─── GSAP (CDN loaded in HTML <head>) ────────────────────
const gsap = window.gsap;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Toast ───────────────────────────────────────────────
let toastTimer;
function toast(msg, ms = 2400) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), ms);
}
window.toast = toast;

// ─── Safe storage (private mode / blocked storage) ───────
const store = {
  get(k, area = 'local') { try { return window[area + 'Storage'].getItem(k); } catch { return null; } },
  set(k, v, area = 'local') { try { window[area + 'Storage'].setItem(k, v); } catch {} }
};

// ─── Splash (once per session) ───────────────────────────
(function splash() {
  const el = document.querySelector('.splash');
  const start = () => {
    document.documentElement.classList.add('js-ready');
    runEntrances();
  };
  // No splash on this page, or already seen this session → reveal immediately
  if (!el || store.get('norda:seen', 'session') === '1') {
    el?.remove();
    start();
    return;
  }
  setTimeout(() => {
    store.set('norda:seen', '1', 'session');
    el.classList.add('is-gone');
    setTimeout(() => el.remove(), 700);
    start();
  }, reduceMotion ? 300 : 3000);
})();

// ─── GSAP entrances ──────────────────────────────────────
function runEntrances() {
  if (!gsap || reduceMotion) {
    document.querySelectorAll('.nav, .hero > *, .section-head > *').forEach(n => {
      n.style.opacity = 1; n.style.transform = 'none';
    });
    return;
  }
  gsap.utils.toArray('.nav').forEach(n =>
    gsap.to(n, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'transform' })
  );
  gsap.utils.toArray('.hero > *').forEach((n, i) => {
    gsap.to(n, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', delay: .1 + i * .07 });
  });
  gsap.utils.toArray('.section-head > *').forEach((n, i) => {
    gsap.to(n, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .1 + i * .06 });
  });
  // card reveals
  gsap.utils.toArray('.prod, .store-head > *, .faq-item, .contact-list a, .contact-form').forEach((n, i) => {
    gsap.from(n, {
      opacity: 0, y: 24, duration: .7, ease: 'power3.out',
      delay: .04 * (i % 8),
      clearProps: 'transform,opacity'
    });
  });
}

// ─── Nav: scroll state + mobile toggle ───────────────────
(function nav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = nav.querySelector('.nav__toggle');
  if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('is-open'));
})();

// ─── Language dropdown ───────────────────────────────────
(function lang() {
  const wrap = document.querySelector('.lang');
  if (!wrap) return;
  const btn = wrap.querySelector('.lang__btn');
  const items = wrap.querySelectorAll('.lang__item');
  const current = store.get('norda_lang') || document.documentElement.lang || 'ar';
  items.forEach(i => i.setAttribute('aria-checked', String(i.dataset.lang === current)));
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', () => { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
  items.forEach(i => {
    i.addEventListener('click', () => {
      const l = i.dataset.lang;
      store.set('norda_lang', l);
      if (typeof window.NORDA_SET_LANGUAGE === 'function') {
        window.NORDA_SET_LANGUAGE(l);
      } else {
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      }
      items.forEach(x => x.setAttribute('aria-checked', String(x === i)));
      wrap.classList.remove('is-open');
      const names = { ar: 'العربية', en: 'English', fr: 'Français' };
      toast(names[l]);
    });
  });
})();

// ─── Cart ────────────────────────────────────────────────
const CART_KEY = 'norda:cart';
const esc = (v) => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Reads the bag from storage but trusts only the catalog for name/price/image.
// Anything tampered with in localStorage is ignored.
function getCart() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(CART_KEY)); } catch { raw = null; }
  if (!Array.isArray(raw)) return [];
  const catalog = window.NORDA_PRODUCTS || [];
  const seen = new Set();
  const out = [];
  for (const it of raw) {
    const p = catalog.find(x => x.id === it?.id);
    if (!p || seen.has(p.id)) continue;
    seen.add(p.id);
    const price = Number(p.price);
    if (!Number.isFinite(price) || price < 0) continue;
    const qty = p.subscription ? 1 : Math.min(Math.max(parseInt(it.qty, 10) || 1, 1), 99);
    out.push({ id: p.id, name: String(p.name || ''), price, image: String(p.image || ''), qty, subscription: p.subscription === true, interval: p.interval || 'month' });
  }
  return out;
}
function setCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items.map(x => ({ id: x.id, qty: x.qty })))); } catch {}
  renderCart();
  updateCartBadge();
}
function updateCartBadge() {
  const n = getCart().reduce((s, x) => s + x.qty, 0);
  document.querySelectorAll('.cart-btn').forEach(b => {
    b.classList.toggle('has-items', n > 0);
    const c = b.querySelector('.cart-btn__count');
    if (c) c.textContent = n;
  });
}
function cartTotal() {
  return getCart().reduce((s, x) => s + x.qty * x.price, 0);
}

// ─── Fly-to-bag (your snippet, integrated) ───────────────
const animateProduct = (button, card) => {
  const img = card?.querySelector('.prod__img img, .prod-page__img img');
  const bag = document.querySelector('[data-bag]');
  if (!img || !bag) return;
  const from = img.getBoundingClientRect();
  const to = bag.getBoundingClientRect();
  if (!from.width || !from.height || !to.width || !to.height) return;
  const size = Math.min(Math.max(from.width * 0.6, 56), 140);
  const fly = img.cloneNode(true);
  fly.removeAttribute('data-ph');
  fly.removeAttribute('loading');
  Object.assign(fly.style, {
    position: 'fixed',
    left: (from.left + (from.width - size) / 2) + 'px',
    top: (from.top + (from.height - size) / 2) + 'px',
    width: size + 'px',
    height: size + 'px',
    zIndex: '99999',
    pointerEvents: 'none',
    objectFit: 'contain',
    margin: '0',
    opacity: '1',
    willChange: 'transform,opacity'
  });
  document.body.append(fly);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const motion = fly.animate(
    [
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
      {
        transform: 'translate3d(' + (dx * 0.55 + 70) + 'px,' + (dy * 0.55 - 85) + 'px,0) scale(.72)',
        opacity: 1,
        offset: 0.58
      },
      {
        transform: 'translate3d(' + dx + 'px,' + dy + 'px,0) scale(.12) rotate(24deg)',
        opacity: 0
      }
    ],
    { duration: 850, easing: 'cubic-bezier(.2,.7,.2,1)' }
  );
  motion.onfinish = () => fly.remove();
  motion.oncancel = () => fly.remove();
  button.classList.add('is-added');
  setTimeout(() => button.classList.remove('is-added'), 1400);
  bag.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.2) rotate(-8deg)' },
      { transform: 'scale(1) rotate(0)' }
    ],
    { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
};
window.animateProduct = animateProduct;

// ─── Add to cart ─────────────────────────────────────────
function addToCart(id, btn, card) {
  const p = (window.NORDA_PRODUCTS || []).find(x => x.id === id);
  if (!p) return;
  const items = getCart();
  const existing = items.find(x => x.id === id);
  if (existing && p.subscription) { toast(p.name + ' — already in your bag'); return; }
  if (existing) existing.qty = Math.min(existing.qty + 1, 99);
  else items.push({ id, qty: 1 });
  setCart(items);
  if (btn && card) animateProduct(btn, card);
  toast(p.name + ' — added to bag');
}

// ─── Render cart drawer ──────────────────────────────────
function renderCart() {
  const items = getCart();
  const wrap = document.querySelector('.cart__items');
  const foot = document.querySelector('.cart__foot');
  if (!wrap) return;
  if (!items.length) {
    wrap.innerHTML = `
      <div class="cart__empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Your bag is empty</p>
        <a href="templates.html" class="btn btn--ghost btn--sm">Browse templates</a>
      </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  wrap.innerHTML = items.map(it => `
    <div class="cart-item" data-id="${esc(it.id)}">
      <div class="cart-item__img">${it.image ? `<img src="${esc(it.image)}" alt="">` : ''}</div>
      <div>
        <div class="cart-item__name">${esc(it.name)}</div>
        <div class="cart-item__meta">${it.subscription ? (it.interval === 'year' ? 'Yearly subscription' : 'Monthly subscription') : 'One-time · Qty ' + it.qty}</div>
        <button class="cart-item__remove" data-remove="${esc(it.id)}" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="cart-item__price">${window.NORDA_FMT(it.price * it.qty)}${it.subscription ? '<small>/' + (it.interval === 'year' ? 'yr' : 'mo') + '</small>' : ''}</div>
    </div>
  `).join('');
  if (foot) foot.querySelector('strong').textContent = window.NORDA_FMT(cartTotal());
  wrap.querySelectorAll('[data-remove]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.remove;
      setCart(getCart().filter(x => x.id !== id));
    });
  });
}

// ─── Cart open/close ─────────────────────────────────────
function openCart() {
  document.querySelector('.cart')?.classList.add('is-open');
  document.querySelector('.cart-backdrop')?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  renderCart();
}
function closeCart() {
  document.querySelector('.cart')?.classList.remove('is-open');
  document.querySelector('.cart-backdrop')?.classList.remove('is-open');
  document.body.style.overflow = '';
}
window.openCart = openCart;
window.closeCart = closeCart;

// ─── Global click handlers ───────────────────────────────
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (addBtn) {
    e.preventDefault();
    addToCart(addBtn.dataset.addToCart, addBtn, addBtn.closest('.prod, .prod-page'));
    return;
  }
  if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openCart(); return; }
  if (e.target.closest('[data-cart-close]') || e.target.closest('.cart-backdrop')) { closeCart(); return; }
});

// ─── Back-to-top FAB ─────────────────────────────────────
(function backToTop() {
  const btn = document.querySelector('.fab--top');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 400);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();


// ─── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCart();
  // ESC closes cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
});
// ─── Social links: driven by config.js ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.NORDA_CONFIG;
  if (!cfg) return; // config.js not loaded on this page → leave links as authored
  const socials = cfg.SOCIAL || {};
  const base = { instagram: 'https://instagram.com/', telegram: 'https://t.me/' };
  const clean = (v) => String(v || '').trim().replace(/^@/, '');

  document.querySelectorAll('a[data-social], a[href*="instagram"], a[href*="t.me"]').forEach(link => {
    const net = link.dataset.social || (link.getAttribute('href').includes('instagram') ? 'instagram' : 'telegram');
    const handle = clean(socials[net]);
    const host = link.closest('li') || link;
    if (!handle) { host.style.display = 'none'; return; }
    link.href = base[net] + encodeURIComponent(handle);
  });

  document.querySelectorAll('[data-social-handle]').forEach(el => {
    const handle = clean(socials[el.dataset.socialHandle]);
    if (handle) el.textContent = '@' + handle;
  });
});
