/* Dependency-free PDF writer for the Akins order summary (dark "YOUR ORDER" layout, A4). */
window.AkinsPDF = (function () {
  const WR = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  const WB = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
  const clean = s => String(s == null ? "" : s).replace(/₦/g, "N").replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/×/g, "x").replace(/[^\x20-\x7E]/g, "?");
  const esc = s => clean(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const cw = (ch, bold) => ((bold ? WB : WR)[ch.charCodeAt(0) - 32] || 556) / 1000;
  const tw = (s, size, bold) => clean(s).split("").reduce((a, ch) => a + cw(ch, bold), 0) * size;
  const fmt = n => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const wrap = (t, size, w, bold) => { const out = []; let cur = ""; clean(t).split(" ").forEach(wd => { const nx = cur ? cur + " " + wd : wd; if (tw(nx, size, bold) > w && cur) { out.push(cur); cur = wd; } else cur = nx; }); if (cur) out.push(cur); return out; };
  const RED = "0.75 0.06 0.06", WHITE = "1 1 1", GREY = "0.78 0.78 0.78", GOLD = "0.85 0.68 0.25", PAGE = "0.10 0.10 0.10", PANEL = "0.07 0.07 0.07", LINE = "0.24 0.24 0.24";

  function build(o, logo) { // logo: Uint8Array of a baseline JPEG (optional)
    const W = 595, H = 842, M = 36, PX = M + 22, PR = W - M - 22; // panel padding
    const pages = []; let ops, y;
    const text = (x, yy, s, size, bold, rgb, align, width) => { s = clean(s); let px = x; if (align === "r") px = x + width - tw(s, size, bold); else if (align === "c") px = x + (width - tw(s, size, bold)) / 2;
      ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${rgb} rg ${px.toFixed(1)} ${yy.toFixed(1)} Td (${esc(s)}) Tj ET`); };
    // Naira amount: draws N + two strokes, then digits (Helvetica has no N-with-bars glyph)
    const moneyW = (n, size, bold) => cw("N", bold) * size + size * 0.12 + tw(fmt(n), size, bold);
    const money = (xRight, yy, n, size, bold, rgb) => { const digits = fmt(n), wN = cw("N", bold) * size, gap = size * 0.12, w = moneyW(n, size, bold), x = xRight - w;
      ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${rgb} rg ${x.toFixed(1)} ${yy.toFixed(1)} Td (N) Tj ET`);
      const t = Math.max(0.7, size * 0.065); [0.36, 0.5].forEach(k => ops.push(`${rgb} rg ${(x - size * 0.04).toFixed(1)} ${(yy + size * k).toFixed(1)} ${(wN + size * 0.08).toFixed(1)} ${t.toFixed(2)} re f`));
      text(x + wN + gap, yy, digits, size, bold, rgb); };
    const rule = yy => ops.push(`${LINE} RG 1.2 w ${PX} ${yy.toFixed(1)} m ${PR} ${yy.toFixed(1)} l S`);
    const newPage = (first) => { ops = []; pages.push(ops); ops.push(`${PAGE} rg 0 0 ${W} ${H} re f`);
      if (first) { // header: logo + store name + reference
        if (logo) ops.push(`q 54 0 0 54 ${M} ${H - 86} cm /Im1 Do Q`);
        text(M + (logo ? 64 : 0), H - 50, o.store || "Akins Luxury Store", 16, true, GOLD);
        text(M + (logo ? 64 : 0), H - 68, "Style - Quality - Class", 9, false, GREY);
        text(W - M - 200, H - 50, "Order " + o.reference, 10, true, WHITE, "r", 200); text(W - M - 200, H - 66, o.date, 10, false, GREY, "r", 200);
        y = H - 104;
      } else y = H - 50; };
    newPage(true);
    text(M, y - 20, "YOUR ORDER", 26, true, WHITE, "c", W - 2 * M); y -= 44;
    const panelTop = y; const panelIdx = ops.length; ops.push(""); // placeholder for panel rect (filled at the end of page)
    y -= 26; text(PX, y, "PRODUCT", 15, true, WHITE); y -= 12; rule(y); y -= 8;
    o.lines.forEach(l => {
      const title = l.name + (l.size ? " - " + l.size : ""); const lines = wrap(title, 12.5, PR - PX);
      const need = lines.length * 17 + 52; if (y - need < 330) { // close panel, start a new page
        ops[panelIdx] = `${PANEL} rg ${M} ${y - 10} ${W - 2 * M} ${panelTop - y + 10} re f`; newPage(false); y -= 0; }
      y -= 22; lines.forEach(t => { text(PX, y, t, 12.5, false, GREY); y -= 17; });
      text(PX, y, "x " + l.qty, 12.5, true, WHITE); y -= 22; money(PX + moneyW(l.unit_price * l.qty, 12.5, false), y, l.unit_price * l.qty, 12.5, false, GREY); y -= 12; rule(y); y -= 4;
    });
    y -= 22; text(PX, y, "Subtotal", 14, true, WHITE); money(PR, y, o.subtotal, 14, true, RED); y -= 14; rule(y);
    y -= 28; text(PX, y, "Delivery", 14, true, WHITE); text(PX, y - 17, "Flat rate" + (o.shipping ? "" : " (free over " + "N" + Number(o.freeOver || 0).toLocaleString("en-US") + ")"), 10.5, false, GREY);
    if (o.shipping) money(PR, y, o.shipping, 14, true, RED); else text(PR - 60, y, "FREE", 14, true, RED, "r", 60); y -= 32; rule(y);
    y -= 32; text(PX, y, "Total", 17, true, WHITE); money(PR, y - 1, o.total, 20, true, RED); y -= 26;
    ops[panelIdx] = `${PANEL} rg ${M} ${y} ${W - 2 * M} ${panelTop - y} re f`;
    // payment + delivery details
    y -= 30; text(M, y, "Pay by bank transfer", 17, false, WHITE); y -= 14;
    const bx = y - 66; ops.push(`${PANEL} rg ${M} ${bx} ${W - 2 * M} 66 re f`);
    wrap("Send this order on WhatsApp (" + (o.phone || "") + "). We will reply with our account details. Pay the total above, then send your receipt in the same chat.", 11.5, W - 2 * M - 40).forEach((t, i) => text(M + 20, y - 26 - i * 16, t, 11.5, false, GREY)); y = bx - 30;
    const c = o.customer || {}; text(M, y, "Deliver to", 14, true, WHITE); y -= 18;
    [c.name, c.phone, c.email, [c.address, c.city, c.state].filter(Boolean).join(", ")].filter(Boolean).forEach(l => wrap(l, 11.5, W - 2 * M).forEach(t => { text(M, y, t, 11.5, false, GREY); y -= 16; }));
    text(M, 36, (o.store || "Akins Luxury Store") + "  |  " + (o.address || "") + "  |  " + (o.email || ""), 8, false, "0.55 0.55 0.55");
    // assemble
    const objs = []; const add = s => { objs.push(s); return objs.length; };
    add("<< /Type /Catalog /Pages 2 0 R >>"); add("");
    const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    let im = 0; if (logo) { let bs = ""; for (let i = 0; i < logo.length; i++) bs += String.fromCharCode(logo[i]); im = add(`<< /Type /XObject /Subtype /Image /Width ${o.logoW || 256} /Height ${o.logoH || 256} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.length} >>\nstream\n${bs}\nendstream`); }
    const kids = [];
    pages.forEach(p => { const body = p.join("\n"); const cn = add(`<< /Length ${body.length} >>\nstream\n${body}\nendstream`);
      kids.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >>${im ? ` /XObject << /Im1 ${im} 0 R >>` : ""} >> /Contents ${cn} 0 R >>`)); });
    objs[1] = `<< /Type /Pages /Kids [${kids.map(k => k + " 0 R").join(" ")}] /Count ${kids.length} >>`;
    let out = "%PDF-1.4\n"; const off = [];
    objs.forEach((s, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${s}\nendobj\n`; });
    const xr = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(n => String(n).padStart(10, "0") + " 00000 n \n").join("") + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`;
    const bytes = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255; return bytes;
  }
  return { build, async download(o, name) {
    let logo = null; try { const r = await fetch(o.logoUrl || "images/logo-small.jpg"); if (r.ok) { const b = new Uint8Array(await r.arrayBuffer()); if (b[0] === 0xFF && b[1] === 0xD8) logo = b; } } catch (e) {}
    const blob = new Blob([build(o, logo)], { type: "application/pdf" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 2000); } };
})();
