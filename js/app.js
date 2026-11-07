/* Akins Luxury Store — storefront (static, WhatsApp checkout). No server, no database. */
(function () {
  "use strict";
  const C = window.AKINS_CONFIG, D = window.AKINS_DATA;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => "₦" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const qs = new URLSearchParams(location.search);
  const page = document.body.dataset.page;

  /* ---------- icons ---------- */
  const P = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    compare: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    shop: '<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>', down: '<path d="m6 9 6 6 6-6"/>', up: '<path d="m18 15-6-6-6 6"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', check: '<path d="m20 6-11 11-5-5"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 6-10 7L2 6"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.2-5.4A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>',
    twitter: '<path d="M4 4l16 16M20 4 4 20"/>',
    pinterest: '<circle cx="12" cy="12" r="9"/><path d="M10 21l2-8M9.5 12.5c0-2 1.3-3 2.7-3 1.6 0 2.5 1 2.5 2.4 0 1.9-1.1 3.6-2.6 3.6-.8 0-1.3-.5-1.3-1.2"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>',
    telegram: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'
  };
  const ic = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------- catalogue helpers ---------- */
  const byId = id => D.products.find(p => p.id === id);
  const inCat = id => D.products.filter(p => p.category === id);
  const liveCats = () => D.categories.filter(c => inCat(c.id).length);
  const catName = id => (D.categories.find(c => c.id === id) || {}).name || id;
  const hasSale = () => D.products.some(p => p.sale && p.compareAt > p.price);
  const pct = p => p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const priceHTML = p => p.compareAt > p.price ? `<del><span class="sr">Original price was: </span>${fmt(p.compareAt)}</del><ins><span class="sr">Current price is: </span>${fmt(p.price)}</ins>` : `<ins>${fmt(p.price)}</ins>`;
  const short = (t, n = 78) => { t = String(t || ""); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t; };
  const shopURL = o => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => { if (v !== "" && v != null) p.set(k, v); }); const s = p.toString(); return "shop.html" + (s ? "?" + s : ""); };
  const heroImg = id => ((byId(id) || {}).image) || "images/placeholder.svg";
  const catImage = id => { const l = inCat(id); const f = l.find(p => p.featured) || l[0]; return f ? f.image : "images/placeholder.svg"; };

  /* ---------- state: cart, wishlist, compare, coupon, users ---------- */
  const cart = () => load("akins_cart", []);
  const wish = () => load("akins_wish", []);
  const cmp = () => load("akins_cmp", []);
  const key = (id, size) => id + "|" + (size || "");
  function toast(msg) { let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400); }
  function cartLines(c = cart()) { return c.map(i => { const p = byId(i.id); return p ? { ...i, p, total: p.price * i.qty } : null; }).filter(Boolean); }
  function totals() {
    const lines = cartLines(); const sub = lines.reduce((a, l) => a + l.total, 0);
    const code = load("akins_coupon", ""); const cp = code && C.COUPONS ? C.COUPONS[code] : null;
    let disc = 0; if (cp) disc = Math.min(sub, cp.type === "percent" ? Math.round(sub * cp.amount / 100) : cp.amount);
    const after = sub - disc; const ship = !after ? 0 : after >= C.FREE_SHIPPING_OVER ? 0 : C.FLAT_SHIPPING;
    return { lines, sub, disc, code: cp ? code : "", ship, total: after + ship, count: lines.reduce((a, l) => a + l.qty, 0) };
  }
  function addToCart(id, size, qty = 1, silent) {
    const p = byId(id); if (!p) return false;
    if (p.sizes && p.sizes.length && !size) { toast("Please choose a shoe size"); return false; }
    const c = cart(), k = key(id, size), ex = c.find(i => key(i.id, i.size) === k);
    if (ex) ex.qty += qty; else c.push({ id, size: size || "", qty });
    save("akins_cart", c); refresh(); if (!silent) openMini(); return true;
  }
  function toggleWish(id) { let w = wish(); if (w.includes(id)) { w = w.filter(x => x !== id); toast("Removed from wishlist"); } else { w.push(id); toast("Added to wishlist"); } save("akins_wish", w); refresh(); }
  function toggleCmp(id) { let c = cmp(); if (c.includes(id)) { c = c.filter(x => x !== id); toast("Removed from compare"); } else { if (c.length >= 4) return toast("You can compare up to 4 products"); c.push(id); toast("Added to compare"); } save("akins_cmp", c); refresh(); }

  /* ---------- local (on-device) customer accounts ---------- */
  const users = () => load("akins_users", []);
  const session = () => load("akins_session", null);
  const me = () => { const s = session(); return s ? users().find(u => u.id === s.id) || null : null; };
  async function hash(pw, salt) {
    try { if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + pw)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); } } catch (e) {}
    let h = 5381; for (const ch of salt + pw) h = ((h << 5) + h + ch.charCodeAt(0)) | 0; return "x" + h;
  }
  const norm = s => String(s || "").trim().toLowerCase().replace(/\s+/g, "");
  async function register(f) {
    const email = norm(f.email), phone = norm(f.phone).replace(/^\+?234/, "0");
    if (!email && !phone) throw new Error("Enter an email address or phone number");
    if ((f.password || "").length < 6) throw new Error("Password must be at least 6 characters");
    if (users().some(u => (email && u.email === email) || (phone && u.phone === phone))) throw new Error("An account with these details already exists. Please log in.");
    const salt = Math.random().toString(36).slice(2), u = { id: "u" + Date.now().toString(36), first: f.first, last: f.last, email, phone, salt, pw: await hash(f.password, salt), address: "", city: "", state: "" };
    const all = users(); all.push(u); save("akins_users", all); save("akins_session", { id: u.id }); refresh(); return u;
  }
  async function login(id, pw) {
    const k = norm(id), ph = k.replace(/^\+?234/, "0"); const u = users().find(x => x.email === k || x.phone === ph);
    if (!u || (await hash(pw, u.salt)) !== u.pw) throw new Error("Incorrect username/email or password");
    save("akins_session", { id: u.id }); refresh(); return u;
  }
  function logout() { try { localStorage.removeItem("akins_session"); } catch (e) {} refresh(); }

  /* ---------- chrome: header, drawers, footer ---------- */
  function chrome() {
    const catOpts = liveCats().map(c => `<option value="${c.id}" ${qs.get("cat") === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
    const nav = (href, label, key, cls = "") => `<a href="${href}" class="${cls} ${page === key ? "active" : ""}">${label}</a>`;
    const wa = `https://wa.me/${C.WHATSAPP}`;
    const searchForm = id => `<form class="search" action="shop.html" role="search"><select name="cat" aria-label="Select category"><option value="">Select category</option>${catOpts}</select><input name="q" type="search" placeholder="Search" aria-label="Search" value="${esc(qs.get("q") || "")}"><button aria-label="Search">${ic("search", 18)}<span>Search</span></button></form>`;
    $("#site-header").innerHTML = `
      <div class="topbar"><div class="container">
        <span class="ship-msg">Free shipping on all orders over ${fmt(C.FREE_SHIPPING_OVER).replace(".00", "")}</span>
        <div class="tb-right"><span class="socials"><a href="${C.INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${ic("instagram", 15)}</a><a href="${C.FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">${ic("facebook", 15)}</a><a href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic("whatsapp", 15)}</a></span>
        <nav><a href="${wa}?text=${encodeURIComponent("Hello " + C.STORE_NAME + ", please add me to your WhatsApp updates list.")}" target="_blank" rel="noopener">Newsletter</a><a href="contact.html">Contact Us</a><a href="contact.html#faq">FAQs</a></nav></div>
      </div></div>
      <header class="header"><div class="container row">
        <button class="menu-btn" data-open="offmenu" aria-label="Menu">${ic("menu", 24)}<span>Menu</span></button>
        <a class="logo" href="index.html" aria-label="${esc(C.STORE_NAME)}"><img src="${C.LOGO}" alt="${esc(C.STORE_NAME)}"></a>
        ${searchForm()}
        <div class="actions">
          <a class="act acct-link" href="account.html" data-login>${ic("user", 20)}<span class="t" data-acct-label>Login / Register</span></a>
          <a class="act" href="wishlist.html">${ic("heart", 20)}<span class="t">Wishlist</span><span class="count" data-wish-count>0</span></a>
          <a class="act" href="compare.html">${ic("compare", 20)}<span class="t"><span data-cmp-count>0</span> Compare</span></a>
          <button class="act cart-btn" data-open="mini" aria-label="Cart">${ic("bag", 20)}<span class="t"><b data-cart-count>0</b> items <b data-cart-total>${fmt(0)}</b></span><span class="count m-only" data-cart-count>0</span></button>
        </div>
      </div>
      <nav class="mainnav"><div class="container">${nav("index.html", "Home", "home")}${nav("shop.html", "Shop", "shop")}${nav("about.html", "About us", "about")}${nav("contact.html", "Contact us", "contact")}<a href="shop.html?sale=1" class="offer">Special Offer</a></div></nav>
      <div class="m-search container">${searchForm()}</div></header>

      <div class="overlay" data-close></div>
      <aside class="drawer left" id="offmenu" aria-label="Menu"><div class="d-head"><a class="logo" href="index.html"><img src="${C.LOGO}" alt=""></a><button data-close aria-label="Close">${ic("x", 22)}</button></div>
        <div class="d-body"><h4>Browse Categories</h4><ul class="d-list">${liveCats().map(c => `<li><a href="shop.html?cat=${c.id}">${esc(c.name)} <span>${inCat(c.id).length}</span></a></li>`).join("")}</ul>
        <h4>Menu</h4><ul class="d-list"><li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact us</a></li><li><a href="shop.html?sale=1">Special Offer</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="compare.html">Compare</a></li><li><a href="account.html" data-acct-label2>Login / Register</a></li></ul></div></aside>
      <aside class="drawer right" id="mini" aria-label="Shopping cart"><div class="d-head"><h3>Shopping cart</h3><button data-close aria-label="Close">${ic("x", 22)}</button></div><div class="d-body" id="mini-body"></div></aside>
      <div class="modal" id="qv" role="dialog" aria-modal="true"><div class="modal-box"><button class="modal-x" data-close aria-label="Close">${ic("x", 22)}</button><div id="qv-body"></div></div></div>
      <div class="modal" id="signin" role="dialog" aria-modal="true"><div class="modal-box narrow"><button class="modal-x" data-close aria-label="Close">${ic("x", 22)}</button><h3>Login</h3>
        <form id="si-form" class="form"><label>Username or email address<input name="id" required autocomplete="username"></label><label>Password<input name="pw" type="password" required autocomplete="current-password"></label>
        <div class="row-between"><label class="chk"><input type="checkbox" name="rem" checked> Remember me</label><a href="account.html#lost">Lost your password?</a></div><p class="form-err" id="si-err"></p><button class="btn btn-gold btn-block">Log in</button></form>
        <p class="alt">No account yet? <a href="account.html#register">Create an Account</a></p></div></div>
      <nav class="bottombar" aria-label="Quick navigation"><a href="shop.html" class="${page === "shop" ? "active" : ""}">${ic("shop", 24)}<span>Shop</span></a><a href="wishlist.html" class="${page === "wishlist" ? "active" : ""}">${ic("heart", 24)}<span>Wishlist</span></a>
        <button data-open="mini" class="bb-cart">${ic("bag", 24)}<span>Cart</span><i class="count" data-cart-count>0</i></button><a href="account.html" class="${page === "account" ? "active" : ""}">${ic("user", 24)}<span>My account</span></a></nav>
      <button class="to-top" aria-label="Back to top">${ic("up", 22)}</button><div id="toast" role="status"></div>`;
    $("#site-footer").innerHTML = `
      <footer class="footer"><div class="container fgrid">
        <div class="fbrand"><a class="logo" href="index.html"><img src="${C.LOGO}" alt="${esc(C.STORE_NAME)}"></a>
          <p>Luxury footwear and timepieces for those who own their path. Style · Quality · Class.</p>
          <ul class="contact-lines"><li>${ic("pin", 16)} ${esc(C.ADDRESS)}</li><li>${ic("phone", 16)} <a href="tel:${C.PHONE.replace(/\s/g, "")}">${esc(C.PHONE)}</a></li><li>${ic("mail", 16)} <a href="mailto:${C.EMAIL}">${esc(C.EMAIL)}</a></li></ul>
          <div class="socials big"><a href="${C.INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${ic("instagram", 18)}</a><a href="${C.FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">${ic("facebook", 18)}</a><a href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic("whatsapp", 18)}</a></div></div>
        <div><h4>Categories</h4><ul>${liveCats().map(c => `<li><a href="shop.html?cat=${c.id}">${esc(c.name)}</a></li>`).join("")}</ul></div>
        <div><h4>Quick Links</h4><ul><li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="shop.html?sale=1">Special Offers</a></li><li><a href="shop.html?orderby=date">New Arrivals</a></li></ul></div>
        <div><h4>Useful Links</h4><ul><li><a href="account.html">My Account</a></li><li><a href="account.html#dashboard">Dashboard</a></li><li><a href="account.html#addresses">Addresses</a></li><li><a href="account.html#orders">Orders</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Cart</a></li></ul></div>
      </div><div class="fbottom"><div class="container"><span>Copyright ${new Date().getFullYear()}. ${esc(C.STORE_NAME)}. All Rights Reserved.</span><span class="paybadges"><b>Bank Transfer</b><b>WhatsApp Order</b></span></div></div></footer>`;
    refresh();
  }

  function refresh() {
    const t = totals();
    $$("[data-cart-count]").forEach(e => e.textContent = t.count);
    $$("[data-cart-total]").forEach(e => e.textContent = fmt(t.sub));
    $$("[data-wish-count]").forEach(e => e.textContent = wish().length);
    $$("[data-cmp-count]").forEach(e => e.textContent = cmp().length);
    const u = me(); $$("[data-acct-label]").forEach(e => e.textContent = u ? (u.first || "My Account") : "Login / Register"); $$("[data-acct-label2]").forEach(e => e.textContent = u ? "My Account" : "Login / Register");
    $$("[data-wishbtn]").forEach(b => b.classList.toggle("on", wish().includes(b.dataset.wishbtn)));
    $$("[data-cmpbtn]").forEach(b => b.classList.toggle("on", cmp().includes(b.dataset.cmpbtn)));
    renderMini();
  }

  function renderMini() {
    const el = $("#mini-body"); if (!el) return; const t = totals();
    if (!t.lines.length) { el.innerHTML = `<div class="empty-mini"><p>No products in the cart.</p><a class="btn btn-gold" href="shop.html">Return to shop</a></div>`; return; }
    el.innerHTML = `<ul class="mini-list">${t.lines.map(l => `<li><a href="product.html?id=${l.p.id}"><img src="${l.p.image}" alt=""></a><div><a class="mn" href="product.html?id=${l.p.id}">${esc(l.p.name)}</a>${l.size ? `<small>Size: ${esc(l.size)}</small>` : ""}<div class="mq">${l.qty} × <b>${fmt(l.p.price)}</b></div></div><button data-rm="${esc(key(l.id, l.size))}" aria-label="Remove">${ic("x", 16)}</button></li>`).join("")}</ul>
      <div class="mini-sub"><span>Subtotal:</span><b>${fmt(t.sub)}</b></div><div class="mini-btns"><a class="btn btn-outline" href="cart.html">View cart</a><a class="btn btn-gold" href="checkout.html">Checkout</a></div>`;
  }
  function openD(id) { const d = $("#" + id); if (!d) return; $$(".drawer.open,.modal.open").forEach(x => x.classList.remove("open")); d.classList.add("open"); document.body.classList.add("lock"); if (d.classList.contains("drawer")) $(".overlay").classList.add("show"); }
  function closeAll() { $$(".drawer.open,.modal.open").forEach(x => x.classList.remove("open")); $(".overlay").classList.remove("show"); document.body.classList.remove("lock"); }
  const openMini = () => { renderMini(); openD("mini"); };

  /* ---------- product card / grid ---------- */
  function card(p) {
    const b = pct(p), hasSize = p.sizes && p.sizes.length;
    return `<article class="pcard" data-id="${p.id}">
      <div class="pimg">${b ? `<span class="badge">-${b}%</span>` : ""}<a href="product.html?id=${p.id}"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"></a>
        <div class="pact"><button data-wishbtn="${p.id}" class="${wish().includes(p.id) ? "on" : ""}" title="Add to wishlist" aria-label="Add to wishlist">${ic("heart", 18)}</button><button data-cmpbtn="${p.id}" class="${cmp().includes(p.id) ? "on" : ""}" title="Add to compare" aria-label="Add to compare">${ic("compare", 18)}</button><button data-qv="${p.id}" title="Quick view" aria-label="Quick view">${ic("eye", 18)}</button></div></div>
      <div class="pbody"><a class="pcat" href="shop.html?cat=${p.category}">${esc(catName(p.category))}</a><h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="price">${priceHTML(p)}</div><p class="pdesc">${esc(short(p.description))}</p>
        ${hasSize ? `<a class="btn btn-outline btn-sm" href="product.html?id=${p.id}">Select options</a>` : `<button class="btn btn-outline btn-sm" data-add="${p.id}">Add to cart</button>`}</div></article>`;
  }
  const grid = (list, cls = "") => `<div class="pgrid ${cls}">${list.map(card).join("")}</div>`;
  const sectionHead = (eyebrow, title, tag) => `<div class="section-head">${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}<h2>${title}</h2>${tag ? `<p>${tag}</p>` : ""}</div>`;
  const catTiles = () => `<div class="cat-grid">${liveCats().map(c => `<a class="cat-tile" href="shop.html?cat=${c.id}"><span class="ct-img"><img loading="lazy" src="${catImage(c.id)}" alt="${esc(c.name)}"></span><h3>${esc(c.name)}</h3><small>${inCat(c.id).length} products</small></a>`).join("")}${hasSale() ? `<a class="cat-tile" href="shop.html?sale=1"><span class="ct-img"><img loading="lazy" src="${(D.products.find(p => p.sale) || {}).image}" alt="Deals"></span><h3>Deals</h3><small>${D.products.filter(p => p.sale).length} products</small></a>` : ""}</div>`;
  const titleBar = (title, crumbs) => `<div class="page-title"><div class="container"><h1>${title}</h1><div class="crumbs">${crumbs}</div></div></div>`;
  const wrap = h => { $("#app").innerHTML = h; };

  /* ---------- pages ---------- */
  const pages = {
    home() {
      const feat = D.products.filter(p => p.featured).slice(0, 8), loaf = inCat("loafers").concat(inCat("half-shoes")).slice(0, 18);
      const saleList = hasSale() ? D.products.filter(p => p.sale) : D.products.slice().reverse();
      wrap(`
      <section class="hero"><div class="slides" id="slides">
        <div class="slide active"><div class="container hero-grid"><div class="copy"><span class="eyebrow">New Collection</span><h1>The Mark of <span class="gold-text">a Leader</span></h1>
          <p>True influence isn’t just heard; it’s seen in every step you take. ${esc(C.STORE_NAME)} brings you an exclusive collection of luxury footwear and timepieces for those who own their path.</p><a class="btn btn-gold" href="shop.html">Click here</a></div>
          <div class="hero-art" aria-hidden="true"><div class="glow"></div><div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"><i></i></div><div class="medal"><img src="images/logo.jpg" alt="" width="600" height="600"></div>
          <span class="chip c1">Premium Footwear</span><span class="chip c2">Luxury Watches</span><span class="chip c3">Nationwide Delivery</span><b class="spark s1"></b><b class="spark s2"></b><b class="spark s3"></b><b class="spark s4"></b></div></div></div>
        <div class="slide"><div class="container hero-grid"><div class="copy"><span class="eyebrow">Style · Quality · Class</span><h1>The Mark of <span class="gold-text">a Leader</span></h1>
          <p>Loafers, sneakers, boots, slides and statement watches. Choose your pair, send your order on WhatsApp, and we deliver nationwide.</p><a class="btn btn-gold" href="shop.html">Shop Now</a></div>
          <div class="hero-art collage" aria-hidden="true"><div class="glow"></div>${["akins-wheat-nubuck-boots", "akins-emerald-steel-automatic-watch", "akins-onyx-puff-loafers"].map((id, i) => `<figure class="cp cp${i + 1}"><img src="${heroImg(id)}" alt=""></figure>`).join("")}</div></div></div>
        <button class="sl-arrow prev" aria-label="Previous slide">${ic("left", 26)}</button><button class="sl-arrow next" aria-label="Next slide">${ic("right", 26)}</button><div class="sl-dots"><button class="on" aria-label="Slide 1"></button><button aria-label="Slide 2"></button></div></div></section>
      <section class="section"><div class="container">${sectionHead(esc(C.STORE_NAME.split(" ")[0]).toUpperCase() + " COLLECTIONS", "FEATURED CATEGORIES", "Distinctly Bold. Uniquely " + esc(C.STORE_NAME.split(" ")[0]) + ".")}${catTiles()}</div></section>
      <section class="section alt"><div class="container">${sectionHead("AKINS PRODUCTS", "FEATURED PRODUCTS", "Distinctly Bold. Uniquely Akins.")}${grid(feat)}</div></section>
      <section class="section"><div class="container">${sectionHead("", "AKINS LOAFERS &amp; HALF SHOES", "")}${grid(loaf)}</div></section>
      <section class="section alt"><div class="container">${sectionHead("AKINS PRODUCTS", hasSale() ? "SALES PRODUCTS" : "NEW ARRIVALS", "Distinctly Bold. Uniquely Akins.")}<div id="sale-grid"></div><p class="center"><button class="btn btn-outline" id="loadmore">Load more products</button></p></div></section>
      <section class="section"><div class="container">${sectionHead(esc(C.STORE_NAME.split(" ")[0]).toUpperCase() + " COLLECTIONS", "FEATURED CATEGORIES", "Distinctly Bold. Uniquely " + esc(C.STORE_NAME.split(" ")[0]) + ".")}${catTiles()}</div></section>`);
      let shown = 0; const step = 12, box = $("#sale-grid");
      box.innerHTML = '<div class="pgrid" id="sg"></div>';
      const more = () => { const part = saleList.slice(shown, shown + step); $("#sg").insertAdjacentHTML("beforeend", part.map(card).join("")); shown += part.length; refresh(); if (shown >= saleList.length) $("#loadmore").style.display = "none"; };
      more(); $("#loadmore").onclick = more;
      // slider
      const sl = $$(".slide"), dots = $$(".sl-dots button"); let cur = 0, timer;
      const go = n => { cur = (n + sl.length) % sl.length; sl.forEach((s, i) => s.classList.toggle("active", i === cur)); dots.forEach((d, i) => d.classList.toggle("on", i === cur)); };
      const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6500); };
      $(".sl-arrow.prev").onclick = () => { go(cur - 1); auto(); }; $(".sl-arrow.next").onclick = () => { go(cur + 1); auto(); }; dots.forEach((d, i) => d.onclick = () => { go(i); auto(); }); auto();
      let sx = 0; const sc = $("#slides"); sc.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true }); sc.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); auto(); } });
    },

    shop() {
      const cat = qs.get("cat") || "", q = (qs.get("q") || "").trim(), sale = qs.get("sale"), orderby = qs.get("orderby") || "menu_order";
      const per = [18, 24, 36].includes(+qs.get("per_page")) ? +qs.get("per_page") : C.PER_PAGE, perRow = [3, 4].includes(+qs.get("per_row")) ? +qs.get("per_row") : 4;
      let list = D.products.filter(p => (!cat || p.category === cat) && (!sale || (p.sale && p.compareAt > p.price)) && (!q || (p.name + " " + p.description + " " + catName(p.category)).toLowerCase().includes(q.toLowerCase())));
      const order = { popularity: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0), rating: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0), date: (a, b) => D.products.indexOf(b) - D.products.indexOf(a), price: (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price };
      if (order[orderby]) list = list.slice().sort(order[orderby]);
      const total = list.length, pages_ = Math.max(1, Math.ceil(total / per)), pg = Math.min(Math.max(1, +qs.get("paged") || 1), pages_), from = (pg - 1) * per;
      const base = o => shopURL({ cat, q, sale, orderby: orderby === "menu_order" ? "" : orderby, per_page: per === C.PER_PAGE ? "" : per, per_row: perRow === 4 ? "" : perRow, paged: "", ...o });
      const title = sale ? "Special Offers" : cat ? catName(cat) : q ? `Search results for “${esc(q)}”` : "Shop";
      const sorts = [["menu_order", "Default sorting"], ["popularity", "Sort by popularity"], ["rating", "Sort by average rating"], ["date", "Sort by latest"], ["price", "Sort by price: low to high"], ["price-desc", "Sort by price: high to low"]];
      const pager = pages_ > 1 ? `<nav class="pager">${pg > 1 ? `<a href="${base({ paged: pg - 1 })}" aria-label="Previous">${ic("left", 16)}</a>` : ""}${Array.from({ length: pages_ }, (_, i) => i + 1).map(n => n === pg ? `<span class="cur">${n}</span>` : `<a href="${base({ paged: n })}">${n}</a>`).join("")}${pg < pages_ ? `<a href="${base({ paged: pg + 1 })}" aria-label="Next">${ic("right", 16)}</a>` : ""}</nav>` : "";
      wrap(`${titleBar(title, `<a href="index.html">Home</a> / ${cat || sale || q ? `<a href="shop.html">Shop</a> / ` : ""}<span>${title}</span>`)}
      <div class="container shop-layout"><aside class="sidebar" id="sidebar"><div class="widget"><h4>Categories</h4><ul class="cat-list"><li><a href="shop.html" class="${!cat && !sale ? "active" : ""}">All <span>${D.products.length}</span></a></li>${liveCats().map(c => `<li><a href="shop.html?cat=${c.id}" class="${cat === c.id ? "active" : ""}">${esc(c.name)} <span>${inCat(c.id).length}</span></a></li>`).join("")}${hasSale() ? `<li><a href="shop.html?sale=1" class="${sale ? "active" : ""}">Deals <span>${D.products.filter(p => p.sale).length}</span></a></li>` : ""}</ul></div></aside>
        <div class="shop-main"><div class="toolbar"><button class="btn btn-outline btn-sm side-toggle" id="sidetoggle">Show sidebar</button>
          <p class="count-line">${total ? `Showing ${from + 1}–${Math.min(total, from + per)} of ${total} results` : "No products were found matching your selection."}</p>
          <div class="tb-ctrl"><span class="perpage">Show: ${[18, 24, 36].map(n => `<a href="${base({ per_page: n === C.PER_PAGE ? "" : n })}" class="${n === per ? "on" : ""}">${n}</a>`).join("")}</span>
          <select id="orderby" aria-label="Shop order">${sorts.map(([v, l]) => `<option value="${v}" ${v === orderby ? "selected" : ""}>${l}</option>`).join("")}</select>
          <span class="views"><a href="${base({ per_row: 3 })}" class="${perRow === 3 ? "on" : ""}" aria-label="3 per row">${ic("menu", 16).replace("M3 6h18M3 12h18M3 18h18", "M4 4h5v5H4zM10 4h5v5h-5zM16 4h5v5h-5zM4 11h5v5H4zM10 11h5v5h-5zM16 11h5v5h-5z")}</a><a href="${base({ per_row: 4 })}" class="${perRow === 4 ? "on" : ""}" aria-label="4 per row">${ic("menu", 16).replace("M3 6h18M3 12h18M3 18h18", "M3 3h4v4H3zM8 3h4v4H8zM13 3h4v4h-4zM18 3h3v4h-3zM3 9h4v4H3zM8 9h4v4H8zM13 9h4v4h-4zM18 9h3v4h-3z")}</a></span></div></div>
          ${total ? grid(list.slice(from, from + per), "per" + perRow) : `<div class="empty"><p>No products were found matching your selection.</p><a class="btn btn-gold" href="shop.html">Back to shop</a></div>`}${pager}</div></div>`);
      $("#orderby").onchange = e => { location.href = base({ orderby: e.target.value === "menu_order" ? "" : e.target.value }); };
      $("#sidetoggle").onclick = e => { const s = $("#sidebar"); s.classList.toggle("open"); e.target.textContent = s.classList.contains("open") ? "Hide sidebar" : "Show sidebar"; };
    },

    product() {
      const p = byId(qs.get("id")); if (!p) return wrap(titleBar("Product not found", `<a href="index.html">Home</a> / Shop`) + `<div class="container empty"><p>Sorry, we couldn’t find that product.</p><a class="btn btn-gold" href="shop.html">Back to shop</a></div>`);
      document.title = p.name + " — " + C.STORE_NAME;
      const same = inCat(p.category), idx = same.indexOf(p), prev = same[(idx - 1 + same.length) % same.length], next = same[(idx + 1) % same.length];
      const sizes = p.sizes || [], related = same.filter(x => x !== p).concat(D.products.filter(x => x.category !== p.category && x !== p)).slice(0, 8);
      const more = D.products.filter(x => x !== p).slice(-4).reverse(), url = encodeURIComponent(location.href), txt = encodeURIComponent(p.name + " — " + C.STORE_NAME);
      wrap(`<div class="container"><nav class="crumbs pcrumbs"><a href="index.html">Home</a> / <a href="shop.html?cat=${p.category}">${esc(catName(p.category))}</a> / <span>${esc(p.name)}</span></nav>
      <div class="pd"><div class="pd-gallery"><div class="pd-nav">${same.length > 1 ? `<a href="product.html?id=${prev.id}" class="pn" title="${esc(prev.name)}">${ic("left", 16)}<img src="${prev.image}" alt=""></a><a href="product.html?id=${next.id}" class="pn" title="${esc(next.name)}"><img src="${next.image}" alt="">${ic("right", 16)}</a>` : ""}</div>
        <div class="pd-main">${pct(p) ? `<span class="badge">-${pct(p)}%</span>` : ""}<img id="mainimg" src="${p.image}" alt="${esc(p.name)}"><button class="enlarge" id="enlarge">${ic("search", 16)} Click to enlarge</button></div></div>
        <div class="pd-info"><h1>${esc(p.name)}</h1><div class="price lg">${priceHTML(p)}</div><p class="pd-short">${esc(p.description)}</p>
          <form id="pform" class="pform">${sizes.length ? `<div class="var-row"><label for="size">Shoe Size</label><div class="sel"><select id="size" name="size"><option value="">Choose an option</option>${sizes.map(s => `<option>${s}</option>`).join("")}</select><a href="#" class="clear" id="clearsz" hidden>Clear</a></div></div>` : ""}
            <div class="buy-row"><div class="qty"><button type="button" data-q="-1" aria-label="Decrease">${ic("minus", 16)}</button><input type="number" id="qty" value="1" min="1" max="99" aria-label="${esc(p.name)} quantity"><button type="button" data-q="1" aria-label="Increase">${ic("plus", 16)}</button></div><button class="btn btn-gold add-big">Add to cart</button></div></form>
          <div class="pd-links"><button data-cmpbtn="${p.id}" class="lnk">${ic("compare", 16)} Add to compare</button><button data-wishbtn="${p.id}" class="lnk">${ic("heart", 16)} Add to wishlist</button></div>
          <ul class="meta"><li><b>SKU:</b> ${esc(p.sku || "")}</li><li><b>Category:</b> <a href="shop.html?cat=${p.category}">${esc(catName(p.category))}</a></li></ul>
          <div class="vendor"><img src="${C.LOGO}" alt=""><div><small>Sold by</small><b>${esc(C.STORE_NAME)}</b></div><a class="btn btn-outline btn-sm" href="https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent("Hello, I have a question about: " + p.name)}" target="_blank" rel="noopener">${ic("whatsapp", 16)} Ask on WhatsApp</a></div>
          <div class="share"><b>Share:</b><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${url}" aria-label="Facebook">${ic("facebook", 16)}</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${url}&text=${txt}" aria-label="X">${ic("twitter", 16)}</a><a target="_blank" rel="noopener" href="https://pinterest.com/pin/create/button/?url=${url}&description=${txt}" aria-label="Pinterest">${ic("pinterest", 16)}</a><a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" aria-label="LinkedIn">${ic("linkedin", 16)}</a><a target="_blank" rel="noopener" href="https://t.me/share/url?url=${url}&text=${txt}" aria-label="Telegram">${ic("telegram", 16)}</a><a target="_blank" rel="noopener" href="https://wa.me/?text=${txt}%20${url}" aria-label="WhatsApp">${ic("whatsapp", 16)}</a></div></div></div>
      <div class="tabs"><div class="tab-bar" role="tablist"><button class="on" data-tab="t1">Description</button><button data-tab="t2">Additional information</button><button data-tab="t3">Reviews (0)</button><button data-tab="t4">Store Info</button><button data-tab="t5">More Products</button></div>
        <div class="tab on" id="t1"><h3>Description</h3><p>${esc(p.description)}</p><p>${esc(C.STORE_NAME)} pieces are chosen for quality, finish and comfort. Please check your size before ordering; if you’re unsure, message us on WhatsApp and we’ll help you choose.</p><p>We deliver nationwide: Lagos typically 1–3 working days, other states 3–7 working days.</p></div>
        <div class="tab" id="t2"><table class="info-table"><tr><th>${sizes.length ? "Shoe Size" : "Type"}</th><td>${sizes.length ? sizes.join(", ") : "Watch"}</td></tr><tr><th>Category</th><td>${esc(catName(p.category))}</td></tr><tr><th>SKU</th><td>${esc(p.sku || "")}</td></tr></table></div>
        <div class="tab" id="t3"><h3>Reviews</h3><p>There are no reviews yet.</p><form id="rform" class="form"><h4>Be the first to review “${esc(p.name)}”</h4><div class="stars" id="stars" role="radiogroup" aria-label="Your rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-s="${n}" title="${["Very poor", "Not that bad", "Average", "Good", "Perfect"][n - 1]}">${ic("star", 22)}</button>`).join("")}</div>
          <label>Your review *<textarea name="review" rows="4" required></textarea></label><div class="two"><label>Name *<input name="name" required></label><label>Email<input name="email" type="email"></label></div><button class="btn btn-gold">Submit</button><p class="note">Reviews are sent to us on WhatsApp.</p></form></div>
        <div class="tab" id="t4"><h3>Store Info</h3><div class="vendor"><img src="${C.LOGO}" alt=""><div><b>${esc(C.STORE_NAME)}</b><small>${esc(C.ADDRESS)}</small></div></div><ul class="contact-lines"><li>${ic("phone", 16)} ${esc(C.PHONE)}</li><li>${ic("mail", 16)} ${esc(C.EMAIL)}</li></ul><p>No ratings found yet!</p></div>
        <div class="tab" id="t5">${grid(more, "per4")}</div></div>
      <section class="related">${sectionHead("", "Related products", "")}${grid(related)}</section></div>`);
      const sel = $("#size"), clr = $("#clearsz");
      if (sel) { sel.onchange = () => clr.hidden = !sel.value; clr.onclick = e => { e.preventDefault(); sel.value = ""; clr.hidden = true; }; }
      $$("[data-q]").forEach(b => b.onclick = () => { const i = $("#qty"); i.value = Math.max(1, Math.min(99, (+i.value || 1) + +b.dataset.q)); });
      $("#pform").onsubmit = e => { e.preventDefault(); addToCart(p.id, sel ? sel.value : "", Math.max(1, +$("#qty").value || 1)); };
      $("#enlarge").onclick = () => lightbox(p.image, p.name); $("#mainimg").onclick = () => lightbox(p.image, p.name);
      $$(".tab-bar button").forEach(b => b.onclick = () => { $$(".tab-bar button,.tab").forEach(x => x.classList.remove("on")); b.classList.add("on"); $("#" + b.dataset.tab).classList.add("on"); });
      let stars = 0; $$("#stars button").forEach(b => b.onclick = () => { stars = +b.dataset.s; $$("#stars button").forEach(x => x.classList.toggle("on", +x.dataset.s <= stars)); });
      $("#rform").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); const m = `New review for ${p.name}:%0ARating: ${stars || "-"}/5%0A${encodeURIComponent(f.get("review"))}%0A— ${encodeURIComponent(f.get("name"))}`; window.open(`https://wa.me/${C.WHATSAPP}?text=${m}`, "_blank"); toast("Opening WhatsApp…"); };
    },

    cart() {
      const t = totals();
      if (!t.lines.length) return wrap(`${titleBar("Cart", `<a href="index.html">Home</a> / <span>Cart</span>`)}<div class="container"><div class="empty big"><h2>Your cart is currently empty!</h2><a class="btn btn-gold" href="shop.html">Return to shop</a></div><section class="related">${sectionHead("", "New in store", "")}${grid(D.products.slice(-4).reverse(), "per4")}</section></div>`);
      wrap(`${titleBar("Cart", `<a href="index.html">Home</a> / <span>Cart</span>`)}<div class="container cart-layout"><div class="cart-main">
        <table class="ctable"><thead><tr><th class="c-rm"></th><th class="c-img"></th><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th></tr></thead><tbody>${t.lines.map(l => `<tr data-k="${esc(key(l.id, l.size))}"><td class="c-rm"><button data-rm="${esc(key(l.id, l.size))}" aria-label="Remove ${esc(l.p.name)}">${ic("x", 18)}</button></td><td class="c-img"><a href="product.html?id=${l.p.id}"><img src="${l.p.image}" alt=""></a></td>
          <td data-l="Product"><a href="product.html?id=${l.p.id}">${esc(l.p.name)}</a>${l.size ? `<small class="vmeta">Shoe Size: ${esc(l.size)}</small>` : ""}</td><td data-l="Price">${fmt(l.p.price)}</td>
          <td data-l="Quantity"><div class="qty sm"><button data-cq="-1" data-k="${esc(key(l.id, l.size))}" aria-label="Decrease">${ic("minus", 14)}</button><input type="number" value="${l.qty}" min="1" max="99" data-k="${esc(key(l.id, l.size))}" class="cq"><button data-cq="1" data-k="${esc(key(l.id, l.size))}" aria-label="Increase">${ic("plus", 14)}</button></div></td><td data-l="Subtotal">${fmt(l.total)}</td></tr>`).join("")}</tbody></table>
        <div class="coupon-row"><form id="cform" class="coupon"><input id="ccode" placeholder="Coupon code" value="${esc(t.code)}" aria-label="Coupon code"><button class="btn btn-outline">Apply coupon</button></form><button class="btn btn-outline" id="clearcart">Clear cart</button></div></div>
        <aside class="totals"><h3>Cart totals</h3><table><tr><th>Subtotal</th><td>${fmt(t.sub)}</td></tr>${t.disc ? `<tr><th>Coupon: ${esc(t.code)}</th><td>−${fmt(t.disc)}</td></tr>` : ""}<tr><th>Shipping</th><td>${t.ship ? `Flat rate: ${fmt(t.ship)}` : "Free shipping"}</td></tr><tr class="grand"><th>Total</th><td>${fmt(t.total)}</td></tr></table><a class="btn btn-gold btn-block" href="checkout.html">Proceed to checkout</a></aside></div>`);
      $$("[data-cq]").forEach(b => b.onclick = () => setQty(b.dataset.k, (cart().find(i => key(i.id, i.size) === b.dataset.k) || { qty: 1 }).qty + +b.dataset.cq));
      $$(".cq").forEach(i => i.onchange = () => setQty(i.dataset.k, +i.value || 1));
      $("#clearcart").onclick = () => { save("akins_cart", []); pages.cart(); refresh(); };
      $("#cform").onsubmit = e => { e.preventDefault(); const v = $("#ccode").value.trim().toUpperCase(); if (!v) { save("akins_coupon", ""); } else if (C.COUPONS && C.COUPONS[v]) { save("akins_coupon", v); toast("Coupon code applied successfully."); } else { save("akins_coupon", ""); toast(`Coupon “${v}” does not exist!`); } pages.cart(); refresh(); };
    },

    checkout() {
      const t = totals(); if (!t.lines.length) { location.replace("cart.html"); return; }
      const u = me() || {}, states = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];
      wrap(`${titleBar("Checkout", `<a href="index.html">Home</a> / <a href="cart.html">Cart</a> / <span>Checkout</span>`)}<div class="container"><form id="co" class="co-layout" novalidate>
        <div class="co-bill"><h3>Billing details</h3><div class="two"><label>First name *<input name="first" required autocomplete="given-name" value="${esc(u.first || "")}"></label><label>Last name *<input name="last" required autocomplete="family-name" value="${esc(u.last || "")}"></label></div>
          <label>Phone *<input name="phone" type="tel" required autocomplete="tel" value="${esc(u.phone || "")}"></label><label>Email address (optional)<input name="email" type="email" autocomplete="email" value="${esc(u.email || "")}"></label>
          <label>Country / Region<input value="Nigeria" disabled></label><label>State *<select name="state" required><option value="">Select a state…</option>${states.map(s => `<option ${u.state === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
          <label>Town / City *<input name="city" required value="${esc(u.city || "")}"></label><label>Street address *<input name="address" required autocomplete="street-address" value="${esc(u.address || "")}" placeholder="House number and street name"></label>
          <label>Order notes (optional)<textarea name="notes" rows="3" placeholder="Notes about your order, e.g. special delivery instructions"></textarea></label></div>
        <div class="co-order"><div class="scallop"></div><div class="order-box"><h3>YOUR ORDER</h3>
          <table class="rev"><thead><tr><th>PRODUCT</th><th>SUBTOTAL</th></tr></thead><tbody>${t.lines.map(l => `<tr><td>${esc(l.p.name)}${l.size ? ` - ${esc(l.size)}` : ""} <strong>× ${l.qty}</strong><div class="vend">Sold by: ${esc(C.STORE_NAME)}</div></td><td>${fmt(l.total)}</td></tr>`).join("")}</tbody>
          <tfoot><tr><th>Subtotal</th><td class="red">${fmt(t.sub)}</td></tr>${t.disc ? `<tr><th>Coupon: ${esc(t.code)}</th><td class="red">−${fmt(t.disc)}</td></tr>` : ""}<tr><th>Shipping</th><td>${t.ship ? `Flat rate: <span class="red">${fmt(t.ship)}</span>` : `<span class="red">Free shipping</span>`}</td></tr><tr class="grand"><th>Total</th><td class="red">${fmt(t.total)}</td></tr></tfoot></table>
          <div class="pay"><label class="radio"><input type="radio" checked name="pm"> Pay by Bank Transfer (via WhatsApp)</label><div class="pay-desc">After you place your order, a PDF of your order is downloaded and WhatsApp opens with your order typed in. We reply with our account details; transfer the total and send your receipt in the same chat.</div></div>
          <p class="privacy">Your personal data will be used to process your order and arrange delivery.</p><p class="form-err" id="co-err"></p><button class="btn btn-gold btn-block" id="place">Place order</button></div></div></form></div>`);
      $("#co").onsubmit = async e => {
        e.preventDefault(); const f = e.target, err = $("#co-err"); err.textContent = "";
        const bad = ["first", "last", "phone", "state", "city", "address"].find(k => !f.elements[k].value.trim());
        if (bad) { f.elements[bad].focus(); err.textContent = "Please fill in all required fields."; return; }
        if (!/^[+0-9\s-]{7,}$/.test(f.elements.phone.value.trim())) { f.elements.phone.focus(); err.textContent = "Please enter a valid phone number."; return; }
        const d = Object.fromEntries(new FormData(f)), tt = totals();
        const o = { reference: "AKN-" + Date.now().toString(36).toUpperCase(), date: Date.now(), customer: { name: (d.first + " " + d.last).trim(), phone: d.phone, email: d.email, address: d.address, city: d.city, state: d.state, notes: d.notes },
          lines: tt.lines.map(l => ({ id: l.id, name: l.p.name, size: l.size, qty: l.qty, unit_price: l.p.price })), subtotal: tt.sub, discount: tt.disc, coupon: tt.code, shipping: tt.ship, total: tt.total };
        const orders = load("akins_orders", []); orders.unshift(o); save("akins_orders", orders.slice(0, 50)); save("akins_last_order", o);
        const usr = me(); if (usr && !usr.address) { const all = users(); const x = all.find(y => y.id === usr.id); Object.assign(x, { address: d.address, city: d.city, state: d.state, phone: x.phone || d.phone }); save("akins_users", all); }
        save("akins_cart", []); save("akins_coupon", ""); try { sessionStorage.setItem("akins_wa_pending", "1"); } catch (x) {}
        AkinsPDF.download(pdfData(o), `Akins-Order-${o.reference}.pdf`); setTimeout(() => { location.href = "success.html"; }, 700);
      };
    },

    success() {
      const o = load("akins_last_order", null);
      if (!o) return wrap(`${titleBar("Order received", `<a href="index.html">Home</a> / <span>Order received</span>`)}<div class="container empty"><p>You have no recent order.</p><a class="btn btn-gold" href="shop.html">Continue shopping</a></div>`);
      const c = o.customer;
      wrap(`${titleBar("Order received", `<a href="index.html">Home</a> / <span>Order received</span>`)}<div class="container narrow-c"><p class="thanks">Thank you. Your order has been received.</p>
        <ul class="ov"><li>Order number:<b>${esc(o.reference)}</b></li><li>Date:<b>${new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</b></li><li>Total:<b>${fmt(o.total)}</b></li><li>Payment method:<b>Bank Transfer (via WhatsApp)</b></li></ul>
        <div class="nextbox"><h3>Final step: send your order on WhatsApp</h3><p>Your order summary PDF has been downloaded. Tap the button, attach the PDF, and send. We’ll reply with our account details.</p><div class="btn-row"><a class="btn btn-gold" id="wa" target="_blank" rel="noopener" href="#">${ic("whatsapp", 18)} Send order on WhatsApp</a><button class="btn btn-outline" id="dl">Download PDF again</button></div></div>
        <h3>Order details</h3><table class="rev det"><thead><tr><th>Product</th><th>Total</th></tr></thead><tbody>${o.lines.map(l => `<tr><td>${esc(l.name)}${l.size ? ` - ${esc(l.size)}` : ""} <strong>× ${l.qty}</strong></td><td>${fmt(l.unit_price * l.qty)}</td></tr>`).join("")}</tbody><tfoot><tr><th>Subtotal</th><td>${fmt(o.subtotal)}</td></tr>${o.discount ? `<tr><th>Discount</th><td>−${fmt(o.discount)}</td></tr>` : ""}<tr><th>Shipping</th><td>${o.shipping ? fmt(o.shipping) : "Free shipping"}</td></tr><tr class="grand"><th>Total</th><td>${fmt(o.total)}</td></tr></tfoot></table>
        <h3>Billing address</h3><address>${esc(c.name)}<br>${esc(c.address)}<br>${esc(c.city)}, ${esc(c.state)}<br>${esc(c.phone)}${c.email ? "<br>" + esc(c.email) : ""}</address></div>`);
      $("#wa").href = waLink(o); $("#dl").onclick = () => AkinsPDF.download(pdfData(o), `Akins-Order-${o.reference}.pdf`);
      let pend = false; try { pend = sessionStorage.getItem("akins_wa_pending"); sessionStorage.removeItem("akins_wa_pending"); } catch (e) {}
      if (pend) setTimeout(() => { location.href = waLink(o); }, 1200);
    },

    wishlist() {
      const list = wish().map(byId).filter(Boolean);
      wrap(`${titleBar("Wishlist", `<a href="index.html">Home</a> / <span>Wishlist</span>`)}<div class="container">${list.length ? `<table class="ctable wl"><thead><tr><th class="c-rm"></th><th class="c-img"></th><th>Product</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>${list.map(p => `<tr><td class="c-rm"><button data-wishbtn="${p.id}" data-reload aria-label="Remove">${ic("x", 18)}</button></td><td class="c-img"><a href="product.html?id=${p.id}"><img src="${p.image}" alt=""></a></td><td data-l="Product"><a href="product.html?id=${p.id}">${esc(p.name)}</a></td><td data-l="Price"><span class="price">${priceHTML(p)}</span></td><td data-l="Stock" class="ok">In stock</td><td>${p.sizes && p.sizes.length ? `<a class="btn btn-outline btn-sm" href="product.html?id=${p.id}">Select options</a>` : `<button class="btn btn-gold btn-sm" data-add="${p.id}">Add to cart</button>`}</td></tr>`).join("")}</tbody></table>` : `<div class="empty big"><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here.</p><a class="btn btn-gold" href="shop.html">Return to shop</a></div>`}</div>`);
    },

    compare() {
      const list = cmp().map(byId).filter(Boolean);
      const row = (label, fn) => `<tr><th>${label}</th>${list.map(p => `<td>${fn(p)}</td>`).join("")}</tr>`;
      wrap(`${titleBar("Compare", `<a href="index.html">Home</a> / <span>Compare</span>`)}<div class="container">${list.length ? `<div class="cmp-wrap"><table class="cmp">${row("", p => `<button class="cmp-x" data-cmpbtn="${p.id}" aria-label="Remove">${ic("x", 16)}</button><a href="product.html?id=${p.id}"><img src="${p.image}" alt=""></a>`)}${row("Product", p => `<a href="product.html?id=${p.id}"><b>${esc(p.name)}</b></a>`)}${row("Price", p => `<span class="price">${priceHTML(p)}</span>`)}${row("Category", p => esc(catName(p.category)))}${row("Sizes", p => p.sizes && p.sizes.length ? p.sizes.join(", ") : "—")}${row("Description", p => esc(p.description))}${row("SKU", p => esc(p.sku || ""))}${row("", p => p.sizes && p.sizes.length ? `<a class="btn btn-outline btn-sm" href="product.html?id=${p.id}">Select options</a>` : `<button class="btn btn-gold btn-sm" data-add="${p.id}">Add to cart</button>`)}</table></div>` : `<div class="empty big"><h2>No products to compare</h2><p>Use the compare icon on up to 4 products.</p><a class="btn btn-gold" href="shop.html">Return to shop</a></div>`}</div>`);
    },

    about() {
      wrap(`${titleBar("About us", `<a href="index.html">Home</a> / <span>About us</span>`)}<div class="container prose-wrap"><div class="about"><img class="about-logo" src="images/logo.jpg" alt="${esc(C.STORE_NAME)}"><h2>${esc(C.STORE_NAME).toUpperCase()}</h2><h4>About us</h4><p class="tagline">The Mark of a Leader</p>
        <p>Luxury is a standard, not a price tag. Every pair and every timepiece in our collection is chosen for intentional design, premium materials and finish you can feel the moment you put it on.</p>
        <p>We source carefully and sell only what we’d wear ourselves, from hand-finished loafers and boots to bold sneakers, slides and statement watches. The ${esc(C.STORE_NAME.split(" ")[0])} spirit is bold, resilient and influential: everyday armour for ambition and first impressions.</p>
        <div class="share"><b>Share:</b><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" aria-label="Facebook">${ic("facebook", 16)}</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}" aria-label="X">${ic("twitter", 16)}</a><a target="_blank" rel="noopener" href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(location.href)}" aria-label="Pinterest">${ic("pinterest", 16)}</a><a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}" aria-label="LinkedIn">${ic("linkedin", 16)}</a><a target="_blank" rel="noopener" href="https://t.me/share/url?url=${encodeURIComponent(location.href)}" aria-label="Telegram">${ic("telegram", 16)}</a></div>
        <blockquote>True influence isn’t just heard; it’s seen in every step you take.</blockquote>
        <p>${esc(C.STORE_NAME)} offers an exclusive collection of luxury footwear and timepieces for those who own their path. We deliver nationwide.</p>
        <ul class="contact-lines center"><li>${ic("pin", 16)} ${esc(C.ADDRESS)}</li><li>${ic("phone", 16)} ${esc(C.PHONE)}</li><li>${ic("mail", 16)} ${esc(C.EMAIL)}</li></ul><a class="btn btn-gold" href="shop.html">Shop the collection</a></div></div>`);
    },

    contact() {
      const faq = [["Is the product the same as in the picture?", "Yes. Photos are of the actual items we sell. If you want to see more angles or a video of a specific item before you order, message us on WhatsApp."], ["Where can I find my sales receipt?", "Your order summary is downloaded as a PDF when you place your order, and you can download it again from the order-received page or from My Account → Orders."], ["How do I return an item?", "Contact us within 48 hours of delivery for size exchanges on unworn items, with the item in its original packaging."], ["Are out-of-stock items restocked?", "Many of our pieces are restocked. Message us on WhatsApp and we’ll tell you when your size is available."], ["Where do you ship?", "We deliver nationwide, to every state in Nigeria. Lagos is typically 1–3 working days; other states 3–7 working days."]];
      wrap(`${titleBar("Contact us", `<a href="index.html">Home</a> / <span>Contact us</span>`)}<div class="container"><section id="faq" class="faq">${sectionHead("INFORMATION QUESTIONS", "FREQUENTLY ASKED QUESTIONS", "")}${faq.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
        <section class="contact-sec">${sectionHead("INFORMATION ABOUT US", "CONTACT US FOR ANY QUESTIONS", "")}<div class="contact-grid"><form id="cform" class="form"><label>Your Name *<input name="name" required></label><label>Your Email<input name="email" type="email"></label><label>Phone Number<input name="phone" type="tel"></label><label>Company<input name="company"></label><label>Your Message *<textarea name="message" rows="5" required></textarea></label><button class="btn btn-gold">Send via WhatsApp</button><p class="note">Your message opens in WhatsApp so we can reply quickly.</p></form>
        <div class="contact-card"><h3>${esc(C.STORE_NAME)}</h3><p>Luxury footwear and timepieces for those who own their path.</p><ul class="contact-lines"><li>${ic("pin", 16)} ${esc(C.ADDRESS)}</li><li>${ic("phone", 16)} <a href="tel:${C.PHONE.replace(/\s/g, "")}">${esc(C.PHONE)}</a></li><li>${ic("mail", 16)} <a href="mailto:${C.EMAIL}">${esc(C.EMAIL)}</a></li><li>${ic("whatsapp", 16)} <a href="https://wa.me/${C.WHATSAPP}" target="_blank" rel="noopener">Chat on WhatsApp</a></li></ul><div class="socials big"><a href="${C.INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${ic("instagram", 18)}</a><a href="${C.FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">${ic("facebook", 18)}</a></div></div></div></section></div>`);
      $("#cform").onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); const t = `Hello ${C.STORE_NAME}, I'm ${f.get("name")}${f.get("phone") ? " (" + f.get("phone") + ")" : ""}${f.get("email") ? " " + f.get("email") : ""}${f.get("company") ? ", " + f.get("company") : ""}.\n${f.get("message")}`; window.open(`https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(t)}`, "_blank"); toast("Opening WhatsApp…"); };
    },

    account() {
      const u = me(); const hashv = (location.hash || "").slice(1);
      const note = `<p class="note acct-note">Your account is saved on this device only, so you can reuse your details at checkout and see your past orders.</p>`;
      if (!u) {
        wrap(`${titleBar("My account", `<a href="index.html">Home</a> / <span>My account</span>`)}<div class="container"><div class="auth-grid"><section id="loginbox"><h3>Login</h3><form id="lf" class="form"><label>Username or email address *<input name="id" required autocomplete="username"></label><label>Password *<input name="pw" type="password" required autocomplete="current-password"></label>
          <div class="row-between"><label class="chk"><input type="checkbox" checked> Remember me</label><a href="#lost" id="lostlink">Lost your password?</a></div><p class="form-err" id="lerr"></p><button class="btn btn-gold btn-block">Log in</button></form>
          <form id="lostf" class="form" hidden><h4>Lost your password?</h4><p class="note">Passwords are stored only on this device, so they can’t be emailed. Reset the account on this device and register again, or message us on WhatsApp for help with an order.</p><button type="button" class="btn btn-outline" id="resetdev">Reset accounts on this device</button> <a class="btn btn-outline" target="_blank" rel="noopener" href="https://wa.me/${C.WHATSAPP}">WhatsApp us</a></form></section>
          <section id="regbox"><h3>Register</h3><form id="rf" class="form"><div class="two"><label>First Name *<input name="first" required autocomplete="given-name"></label><label>Last Name *<input name="last" required autocomplete="family-name"></label></div><label>Email address<input name="email" type="email" autocomplete="email"></label><label>Phone Number *<input name="phone" type="tel" required autocomplete="tel"></label><label>Password *<input name="password" type="password" required minlength="6" autocomplete="new-password"></label>
          <p class="note">Your personal data will be used to support your experience on this site.</p><p class="form-err" id="rerr"></p><button class="btn btn-gold btn-block">Register</button></form>${note}</section></div></div>`);
        $("#lf").onsubmit = async e => { e.preventDefault(); const f = new FormData(e.target); try { await login(f.get("id"), f.get("pw")); location.href = "account.html"; } catch (x) { $("#lerr").textContent = x.message; } };
        $("#rf").onsubmit = async e => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); try { await register(f); location.href = "account.html"; } catch (x) { $("#rerr").textContent = x.message; } };
        $("#lostlink").onclick = e => { e.preventDefault(); $("#lf").hidden = true; $("#lostf").hidden = false; };
        $("#resetdev").onclick = () => { if (confirm("This removes every account saved on this device. Continue?")) { ["akins_users", "akins_session"].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); toast("Accounts cleared. You can register again."); setTimeout(() => location.reload(), 800); } };
        if (hashv === "lost") $("#lostlink").click(); if (hashv === "register") $("#regbox").scrollIntoView();
        return;
      }
      const tabs = [["dashboard", "Dashboard"], ["orders", "Orders"], ["addresses", "Addresses"], ["details", "Account details"]]; const cur = tabs.some(t => t[0] === hashv) ? hashv : "dashboard";
      const orders = load("akins_orders", []);
      const body = { dashboard: `<p>Hello <b>${esc(u.first || "there")}</b> (not ${esc(u.first || "you")}? <a href="#" id="lo2">Log out</a>)</p><p>From your account dashboard you can view your recent orders, manage your delivery address and edit your account details.</p>${note}`,
        orders: orders.length ? `<table class="ctable"><thead><tr><th>Order</th><th>Date</th><th>Total</th><th></th></tr></thead><tbody>${orders.map((o, i) => `<tr><td data-l="Order">#${esc(o.reference)}</td><td data-l="Date">${new Date(o.date).toLocaleDateString("en-GB")}</td><td data-l="Total">${fmt(o.total)} for ${o.lines.reduce((a, l) => a + l.qty, 0)} items</td><td><button class="btn btn-outline btn-sm" data-pdf="${i}">Download PDF</button> <a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="${waLink(o)}">WhatsApp</a></td></tr>`).join("")}</tbody></table>` : `<p>No order has been made yet.</p><a class="btn btn-gold" href="shop.html">Browse products</a>`,
        addresses: `<h3>Delivery address</h3><form id="af" class="form"><label>Phone<input name="phone" value="${esc(u.phone || "")}"></label><label>Street address<input name="address" value="${esc(u.address || "")}"></label><label>Town / City<input name="city" value="${esc(u.city || "")}"></label><label>State<input name="state" value="${esc(u.state || "")}"></label><button class="btn btn-gold">Save address</button></form>`,
        details: `<form id="df" class="form"><div class="two"><label>First name *<input name="first" required value="${esc(u.first || "")}"></label><label>Last name *<input name="last" required value="${esc(u.last || "")}"></label></div><label>Email address<input name="email" type="email" value="${esc(u.email || "")}"></label><label>New password (leave blank to keep)<input name="pw" type="password" minlength="6" autocomplete="new-password"></label><button class="btn btn-gold">Save changes</button></form>` }[cur];
      wrap(`${titleBar("My account", `<a href="index.html">Home</a> / <span>My account</span>`)}<div class="container acct-layout"><nav class="acct-nav">${tabs.map(t => `<a href="account.html#${t[0]}" class="${cur === t[0] ? "on" : ""}">${t[1]}</a>`).join("")}<a href="#" id="lo1">Logout</a></nav><div class="acct-body">${body}</div></div>`);
      const lo = e => { e.preventDefault(); logout(); location.href = "account.html"; }; ["lo1", "lo2"].forEach(i => { const el = $("#" + i); if (el) el.onclick = lo; });
      window.onhashchange = () => pages.account(); // re-render on tab change
      $$("[data-pdf]").forEach(b => b.onclick = () => { const o = orders[+b.dataset.pdf]; AkinsPDF.download(pdfData(o), `Akins-Order-${o.reference}.pdf`); });
      const sv = (id, fn) => { const f = $(id); if (f) f.onsubmit = async e => { e.preventDefault(); const all = users(), x = all.find(y => y.id === u.id), d = Object.fromEntries(new FormData(f)); await fn(x, d); save("akins_users", all); refresh(); toast("Saved"); }; };
      sv("#af", (x, d) => Object.assign(x, d)); sv("#df", async (x, d) => { x.first = d.first; x.last = d.last; x.email = norm(d.email); if (d.pw) { x.salt = Math.random().toString(36).slice(2); x.pw = await hash(d.pw, x.salt); } });
    }
  };

  function setQty(k, q) { const c = cart(), it = c.find(i => key(i.id, i.size) === k); if (!it) return; it.qty = Math.max(1, Math.min(99, q)); save("akins_cart", c); if (page === "cart") pages.cart(); refresh(); }
  function removeLine(k) { save("akins_cart", cart().filter(i => key(i.id, i.size) !== k)); if (page === "cart") pages.cart(); refresh(); }

  function lightbox(src, alt) { const l = document.createElement("div"); l.className = "lightbox"; l.innerHTML = `<img src="${src}" alt="${esc(alt)}"><button aria-label="Close">${ic("x", 26)}</button>`; l.onclick = () => l.remove(); document.body.appendChild(l); }
  function quickView(id) {
    const p = byId(id); if (!p) return; const sizes = p.sizes || [];
    $("#qv-body").innerHTML = `<div class="qv"><div class="qv-img"><img src="${p.image}" alt="${esc(p.name)}"></div><div class="qv-info"><a class="pcat" href="shop.html?cat=${p.category}">${esc(catName(p.category))}</a><h2>${esc(p.name)}</h2><div class="price lg">${priceHTML(p)}</div><p>${esc(p.description)}</p>
      <form id="qvf">${sizes.length ? `<div class="var-row"><label>Shoe Size</label><div class="sel"><select name="size"><option value="">Choose an option</option>${sizes.map(s => `<option>${s}</option>`).join("")}</select></div></div>` : ""}<div class="buy-row"><div class="qty"><button type="button" data-qq="-1">${ic("minus", 16)}</button><input type="number" name="qty" value="1" min="1" max="99"><button type="button" data-qq="1">${ic("plus", 16)}</button></div><button class="btn btn-gold">Add to cart</button></div></form>
      <a class="lnk" href="product.html?id=${p.id}">View full details →</a></div></div>`;
    $$("[data-qq]").forEach(b => b.onclick = () => { const i = $("#qvf [name=qty]"); i.value = Math.max(1, (+i.value || 1) + +b.dataset.qq); });
    $("#qvf").onsubmit = e => { e.preventDefault(); const f = e.target; if (addToCart(p.id, f.elements.size ? f.elements.size.value : "", +f.elements.qty.value || 1)) { /* mini cart opens */ } };
    openD("qv");
  }

  /* ---------- order summary helpers (PDF + WhatsApp) ---------- */
  const money = n => "₦" + Number(n).toLocaleString("en-NG");
  function waLink(o) {
    const c = o.customer, L = o.lines.map((l, i) => `${i + 1}. ${l.name}${l.size ? " (Size " + l.size + ")" : ""} x${l.qty} - ${money(l.unit_price * l.qty)}`).join("\n");
    const t = `Hello ${C.STORE_NAME}, I'd like to place an order.\n\nOrder: ${o.reference}\n${L}\n\nSubtotal: ${money(o.subtotal)}${o.discount ? "\nDiscount: -" + money(o.discount) : ""}\nDelivery: ${o.shipping ? money(o.shipping) : "Free"}\nTOTAL: ${money(o.total)}\n\nName: ${c.name}\nPhone: ${c.phone}\nAddress: ${c.address}, ${c.city}, ${c.state}${c.notes ? "\nNote: " + c.notes : ""}\n\nPlease send your account details for payment. (Order summary PDF attached)`;
    return `https://wa.me/${C.WHATSAPP}?text=${encodeURIComponent(t)}`;
  }
  const pdfData = o => ({ store: C.STORE_NAME, phone: C.PHONE, address: C.ADDRESS, email: C.EMAIL, reference: o.reference, date: new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), customer: o.customer, lines: o.lines, subtotal: o.subtotal, shipping: o.shipping, total: o.total, freeOver: C.FREE_SHIPPING_OVER, logoW: 256, logoH: 256 });

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    chrome(); if (pages[page]) pages[page](); refresh();
    document.body.addEventListener("click", e => {
      const t = e.target;
      const op = t.closest("[data-open]"); if (op) { e.preventDefault(); if (op.dataset.open === "mini") renderMini(); return openD(op.dataset.open); }
      const lg = t.closest("[data-login]"); if (lg && !me() && !t.closest("a[href^='http']")) { e.preventDefault(); return openD("signin"); }
      if (t.closest("[data-close]") || t.classList.contains("modal") || t.classList.contains("overlay")) return closeAll();
      const a = t.closest("[data-add]"); if (a) { e.preventDefault(); return void addToCart(a.dataset.add, "", 1); }
      const w = t.closest("[data-wishbtn]"); if (w) { e.preventDefault(); toggleWish(w.dataset.wishbtn); if (w.hasAttribute("data-reload")) pages.wishlist(); return; }
      const cp = t.closest("[data-cmpbtn]"); if (cp) { e.preventDefault(); toggleCmp(cp.dataset.cmpbtn); if (page === "compare") pages.compare(); return; }
      const q = t.closest("[data-qv]"); if (q) { e.preventDefault(); return quickView(q.dataset.qv); }
      const r = t.closest("[data-rm]"); if (r) { e.preventDefault(); return removeLine(r.dataset.rm); }
      if (t.closest(".to-top")) window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
    const tt = $(".to-top"); const onScroll = () => tt.classList.toggle("show", window.scrollY > 500); window.addEventListener("scroll", onScroll, { passive: true });
    const si = $("#si-form"); if (si) si.onsubmit = async e => { e.preventDefault(); const f = new FormData(si); try { await login(f.get("id"), f.get("pw")); toast("Logged in"); closeAll(); if (page === "account") pages.account(); } catch (x) { $("#si-err").textContent = x.message; } };
  });
  window.addEventListener("storage", () => { try { refresh(); } catch (e) {} });
})();
