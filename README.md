# Akins Luxury Store — WhatsApp storefront

A static website (no server, no database, no admin panel). Customers browse, add to cart and tap **Send order on WhatsApp**.
The site downloads an order-summary PDF (items + total) and opens WhatsApp to **09167609087** with the order typed in.
You reply with your account details, they transfer, and you confirm and deliver (nationwide).

## Run / host
- Preview: open `index.html`, or run `python3 -m http.server` in this folder and visit http://localhost:8000
- Host anywhere that serves static files: GitHub Pages, Netlify, Cloudflare Pages, or normal cPanel hosting (upload the folder contents).

## Change business details
Edit `js/config.js` — name, phone, WhatsApp number (international format, no +), email, Instagram, Facebook, address, free-shipping threshold and delivery fee.

## Add / edit / remove products
Everything is in `js/products.js`. Each product looks like:
```
{ "id": "akins-example-watch", "name": "Akins Example Watch", "category": "watches",
  "price": 150000, "compareAt": null, "image": "images/products/akins-example-watch.jpg",
  "description": "Short description.", "sizes": [], "featured": false, "sale": false }
```
- Put the photo in `images/products/` (JPG, ~1000px wide is plenty) and match the `image` path.
- `category` must be one of: loafers, sneakers, boots, slides, sandals, watches.
- `sizes`: `[39,40,41,42,43,44,45,46]` for shoes, `[]` for watches.
- `"featured": true` shows it on the home page. For a sale: set `"sale": true` and `"compareAt"` to the old price.
- To remove an item, delete its block.

## Accounts / login
There are no customer accounts: it's a WhatsApp store, so buyers just order as guests. (Accounts need a server and database.)


## Layout (odogwuvibes-style rebuild)
Pages: index, shop, product, cart, checkout, success, wishlist, compare, about, contact, account.
All pages are thin shells; `js/app.js` draws the header, footer, drawers and each page.
- Customer accounts are saved on the customer's own device only (no server).
- Coupons: add codes in `js/config.js` -> `COUPONS`, e.g. `{ AKINS10: { type: "percent", amount: 10 } }`.
- Products per page: `PER_PAGE` in `js/config.js`. Free-shipping threshold and flat rate are there too.
