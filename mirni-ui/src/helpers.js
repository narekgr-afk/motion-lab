// =====================================================================
//  SCENES — Мирный (интерфейс), 18s. The constant: a house facade of windows; the accent is a lit window.
//  World units ~ px; TT on 1s; springs settle every move. Content inside x 60-940, y 250-1500.
// =====================================================================

// ---- a house's window layout (pure: no drawing), shared by the drawing and the bridge outline
function houseLayout(x, y, w, d, h, o = {}) {
  const rows = o.rows ?? 8, top = o.top ?? 30, bot = o.bot ?? 52;
  const pv = (h - top - bot) / rows, wh = pv * 0.56;
  const front = faceOf([x, y + d, h], [1, 0, 0], [0, 0, -1]);
  const side = faceOf([x + w, y, h], [0, 1, 0], [0, 0, -1]);
  const grid = (span, cols) => { const mx = 18, pu = (span - 2 * mx) / cols; return { mx, pu, ww: pu * 0.58, cols }; };
  const gf = grid(w, o.cols ?? 4), gs = grid(d, o.sideCols ?? 3);
  const rect = (face, c, r) => { const g = face ? gs : gf; return [g.mx + c * g.pu + (g.pu - g.ww) / 2, top + r * pv + (pv - wh) / 2, g.ww, wh]; };
  const fpOf = (face) => (face ? side : front);
  return { front, side, gf, gs, rows, rect, fpOf,
    winAt: (face, c, r) => { const [u, v, ww, hh] = rect(face, c, r); return isoP(fpOf(face)(u + ww / 2, v + hh / 2)); },
    winPts: (face, c, r) => { const [u, v, ww, hh] = rect(face, c, r); return facePts(fpOf(face), rrectPts(u, v, ww, hh, 3, 3)); } };
}
// ---- a house: a rounded block with a roof plate, a door, and windows on the two faces we see.
//  lit(face, c, r) -> 0..1 how lit a window is (face 0 = front, +y; 1 = side, +x)
function house(x, y, w, d, h, o = {}) {
  const lit = o.lit || (() => 0), L = houseLayout(x, y, w, d, h, o);
  isoBox(x, y, 0, w, d, h, { r: 8 });
  isoBox(x + 8, y + 8, h, w - 16, d - 16, o.roof ?? 10, { r: 6 });
  for (const face of [0, 1]) {
    const g = face ? L.gs : L.gf;
    for (let r = 0; r < L.rows; r++) for (let c = 0; c < g.cols; c++) {
      const l = clamp(lit(face, c, r)), [u, v, ww, hh] = L.rect(face, c, r);
      faceRR(L.fpOf(face), u, v, ww, hh, 3, { fill: l > 0.01 ? mixHex(PAL.win, PAL.accent, l) : PAL.win, stroke: l > 0.5 ? PAL.accent : PAL.inner });
    }
  }
  faceRR(L.front, w / 2 - 15, h - 40, 30, 40, 4, { fill: PAL.face, stroke: PAL.edge });   // the door
  return L;
}

// ---- screen-space cards and type (drawn after the scene, through DEFER)
function card(x, y, w, h, o = {}) {
  ctx.save(); ctx.globalAlpha = o.al ?? 1;
  polyPath(rrectPts(x, y + 8, w, h, 18, 6), true); ctx.fillStyle = PAL.paper; ctx.fill(); hair(PAL.inner); ctx.stroke();   // thickness
  polyPath(rrectPts(x, y, w, h, 18, 6), true); ctx.fillStyle = o.fill ?? PAL.face; ctx.fill(); hair(o.edge ?? PAL.edge); ctx.stroke();
  ctx.restore();
}
function cardText(str, x, y, size, color, o = {}) {
  ctx.save(); ctx.globalAlpha = o.al ?? 1;
  ctx.font = `${o.weight ?? 500} ${size}px ${SANS}`; ctx.fillStyle = color; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}
function cardLines(x, y, ws, al = 1) {   // grey text lines (no invented words)
  ws.forEach((w, i) => { ctx.save(); ctx.globalAlpha = al; polyPath([[x, y + i * 22], [x + w, y + i * 22]], false); hair(PAL.inner, 6); ctx.stroke(); ctx.restore(); });
}
function thread(a, b, al) { ctx.save(); ctx.setLineDash([2, 10]); ctx.globalAlpha = 0.6 * al; polyPath([a, b], false); hair(PAL.accent); ctx.stroke(); ctx.restore(); }
// a two-line caption shown over [t0, t1] (absolute seconds)
function caption2(a, b, t0, t1 = 1e9, y = 1405) {
  const f = () => {
    const s = spring(TT, t0, { k: 120, damp: 0.8 }) * (1 - clamp((TT - t1) / 0.25));
    if (s <= 0.001) return;
    ctx.save(); ctx.globalAlpha = clamp(s);
    polyPath([[CX - 22, y - 62], [CX + 22, y - 62]], false); hair(PAL.accent); ctx.stroke();
    ctx.fillStyle = PAL.text; ctx.textAlign = 'center';
    const fit = (str) => { ctx.font = `500 46px ${SANS}`; const w = ctx.measureText(str).width; ctx.font = `500 ${Math.floor(46 * Math.min(1, 720 / w))}px ${SANS}`; };
    fit(a); ctx.fillText(a, CX, y + (1 - s) * 18);
    if (b) { fit(b); ctx.fillText(b, CX, y + 60 + (1 - s) * 18); }
    ctx.restore();
  };
  if (DEFER) DEFER.push(f); else f();
}
// the sign: four windows, one lit (top right). size = one window's side
function sign(x, y, size, o = {}) {
  const gap = size * 0.22, al = o.al ?? 1;
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b], k) => {
    const s = k === 1 ? 1 : clamp(o.grow ? o.grow(k) : 1);
    if (s <= 0.01) return;
    const cx = x + a * (size + gap) + size / 2, cy = y + b * (size + gap) + size / 2, z = size * s;
    polyPath(rrectPts(cx - z / 2, cy - z / 2, z, z, size * 0.14, 3), true);
    ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = k === 1 ? PAL.accent : PAL.win; ctx.fill(); hair(k === 1 ? PAL.accent : PAL.edge, size > 60 ? 3 : HAIR); ctx.stroke(); ctx.restore();
  });
}

