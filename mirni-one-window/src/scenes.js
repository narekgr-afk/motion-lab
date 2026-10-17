// =====================================================================
//  SCENES — Мирный, 20s. The constant: a house facade of windows; the accent is a lit window.
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

// ---- 1 (0-3.2): one lit window; the question drowns in the shared chat
const CHAT = { iso: { ox: 540, oy: 1075, u: 1.18 }, h: [-130, -100, 260, 200, 480], lit: [0, 1, 4] };
function sceneChat() {
  setIso(CHAT.iso);
  isoPlates(-190, -160, -26, 380, 360, [{ h: 14, r: 36 }, { h: 12, gap: 5, inset: 12, r: 30 }]);
  const LIT = CHAT.lit;
  const H1 = house(...CHAT.h, { lit: (f, c, r) => (f === LIT[0] && c === LIT[1] && r === LIT[2] ? spring(TT, 0.15, { k: 90, damp: 0.7 }) : 0) });
  const wp = H1.winAt(...LIT);
  DEFER.push(() => {
    // the chat: grey bubbles pile in from the window and push the question up and away
    const t = TT, n = Math.max(0, Math.floor((t - 0.9) / 0.2) + 1), step = 92, bx = 470, by = wp[1] - 40;
    for (let k = n; k >= 1; k--) {   // newest at the bottom
      const yy = by - (n - k) * step + (1 - spring(t, 0.9 + (k - 1) * 0.2, { k: 260, damp: 0.7 })) * 40;
      if (yy < 120) continue;
      const w = 260 + ((k * 37) % 90), x = bx + ((k * 53) % 70);
      card(x, yy, w, 64, { al: 0.9 });
      cardLines(x + 24, yy + 26, [w * 0.6, w * 0.38], 0.9);
    }
    if (t > 0.45) {   // the question, pushed up by every new message
      const s = clamp(spring(t, 0.45, { k: 160, damp: 0.6 })), qy = by - 100 - n * step, qx = 110, qw = 580;
      if (qy > 100) {
        card(qx, qy, qw, 92, { edge: PAL.accent, al: s });
        cardText('Кто знает хорошего мастера?', qx + 28, qy + 58, 34, PAL.text, { al: s });
      }
      thread(wp, [300, Math.max(qy + 92, 110)], s);
    }
  });
  caption2('Вопрос соседям', 'утонул в общем чате', 0.45, 2.45);
}
// the lit window's outline (for the bridge into the sign)
function chatWindowPts() { setIso(CHAT.iso); return houseLayout(...CHAT.h).winPts(...CHAT.lit); }

// ---- 2 (3.2-7): the sign grows out of the lit window; the name
const SIGN = { x: 540 - 118 - 13, y: 640, size: 118 };
const signLitPts = () => rrectPts(SIGN.x + SIGN.size * 1.22, SIGN.y, SIGN.size, SIGN.size, SIGN.size * 0.14, 3);
function sceneLogo() {
  const t = TT;
  sign(SIGN.x, SIGN.y, SIGN.size, { grow: (k) => spring(t, 3.85 + [0.18, 0, 0.36, 0.54][k], { k: 170, damp: 0.55 }) });
  DEFER.push(() => {
    const s = clamp(spring(t, 4.6, { k: 110, damp: 0.75 })), s2 = clamp(spring(t, 5.1, { k: 110, damp: 0.8 }));
    ctx.save(); ctx.globalAlpha = s; ctx.font = `800 132px ${SANS}`; ctx.fillStyle = PAL.text; ctx.textAlign = 'center';
    ctx.fillText('Мирный', CX, 1060 + (1 - s) * 30); ctx.restore();
    ctx.save(); ctx.globalAlpha = s2; ctx.font = `500 44px ${SANS}`; ctx.fillStyle = PAL.textD; ctx.textAlign = 'center';
    ctx.fillText('сайт ЖК «Томилино Парк»', CX, 1150 + (1 - s2) * 18); ctx.restore();
  });
}

// ---- 3 (7-10): neighbours light up and answer, marked as residents
const ANS = [[0, 2, 1], [1, 1, 3], [0, 0, 6]];   // [face, col, row] in house B
function sceneNeighbours() {
  setIso({ ox: 500, oy: 1105, u: 1.0 });
  isoPlates(-340, -240, -26, 620, 400, [{ h: 14, r: 40 }, { h: 12, gap: 5, inset: 12, r: 34 }]);
  const t = TT - 7;
  const A = house(-300, -40, 200, 160, 520, { cols: 3, sideCols: 3, rows: 8, lit: (f, c, r) => (f === 0 && c === 1 && r === 3 ? 1 : 0) });
  const B = house(40, -200, 200, 160, 560, { cols: 3, sideCols: 3, rows: 9,
    lit: (f, c, r) => { const i = ANS.findIndex((a) => a[0] === f && a[1] === c && a[2] === r); return i < 0 ? 0 : spring(t, 0.7 + i * 0.4, { k: 110, damp: 0.7 }); } });
  const qa = A.winAt(0, 1, 3);
  DEFER.push(() => {
    const s = clamp(spring(t, 0.15, { k: 150, damp: 0.6 }));
    if (s > 0.01) {
      const qx = 80, qy = 270, qw = 560;
      card(qx, qy + (1 - s) * 30, qw, 92, { edge: PAL.accent, al: s });
      cardText('Кто знает хорошего мастера?', qx + 28, qy + 58 + (1 - s) * 30, 34, PAL.text, { al: s });
      thread(qa, [qx + 120, qy + 92], s);
    }
    ANS.forEach(([f, c, r], i) => {
      const a = clamp(spring(t, 0.85 + i * 0.4, { k: 170, damp: 0.62 }));
      if (a <= 0.01) return;
      const p = B.winAt(f, c, r), w = 330, x = 120 + i * 40, y = 420 + i * 120 + (1 - a) * 24;
      thread(p, [x + w, y + 46], a);
      card(x, y, w, 92, { al: a });
      cardText('✓ Житель · дом ' + [5, 12, 3][i], x + 24, y + 38, 26, PAL.accent, { al: a, weight: 600 });
      cardLines(x + 24, y + 62, [w * 0.62], a);
    });
  });
  caption2('Спросите соседей —', 'ответят быстрее, чем в общем чате', 7.45);
}

// ---- 4 (10-18): the quarter. 10-13 listings over the roofs; 13-16 places on the map; 16 every window lights
const Q = { iso: { ox: 540, oy: 990, u: 0.7 } };
const QH = (() => { const R = RNG(7), out = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out.push({ i, j, x: -310 + i * 220, y: -310 + j * 220, h: 300 + Math.floor(R.f() * 4) * 40 }); return out; })();
const PINS = [[-120, -40], [100, -200], [100, 150], [-260, 100], [-40, 300]];
const TAGS = [[2, 'Объявления'], [4, 'Потеряшки'], [6, 'Работа']];   // [house index, label]: real sections of the site
function sceneQuarter() {
  setIso(Q.iso);
  isoPlates(-360, -360, -30, 720, 720, [{ h: 18, r: 60 }, { h: 12, gap: 6, inset: 16, r: 50 }]);
  const t = TT;
  isoGrid(3, 3, (i, j) => {
    const q = QH[i * 3 + j];
    house(q.x, q.y, 160, 140, q.h, { cols: 3, sideCols: 3, rows: Math.round(q.h / 60), top: 22, bot: 44,
      lit: (f, c, r) => {
        const h = RNG(31, i, j, f, c, r).f, base = h() < 0.38 ? spring(t, 10.15 + (i + j) * 0.12 + h() * 0.3, { k: 120, damp: 0.75 }) : 0;
        return Math.max(base, spring(t, 16.0 + (i + j) * 0.07 + h() * 0.18, { k: 140, damp: 0.7 }));
      } });
  });
  // pins on the streets (13-16)
  PINS.forEach(([px, py], k) => {
    const s = spring(t, 13.25 + k * 0.25, { k: 170, damp: 0.5 });
    if (s <= 0.01) return;
    const z = (1 - s) * 120, top = iso(px, py, 70 + z), foot = iso(px, py, 0);
    polyPath([foot, top], false); hair(PAL.edge); ctx.stroke();
    ctx.beginPath(); ctx.arc(top[0], top[1], 15, 0, TAU); ctx.fillStyle = PAL.accent; ctx.fill(); hair(PAL.accent); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(foot[0], foot[1], 12, 6, 0, 0, TAU); hair(PAL.inner); ctx.stroke();
  });
  DEFER.push(() => {
    // 10-13: section tags over three roofs
    TAGS.forEach(([hi, label], k) => {
      const a = clamp(spring(t, 10.5 + k * 0.5, { k: 170, damp: 0.6 })) * (1 - clamp((t - 12.8) / 0.3));
      if (a <= 0.01) return;
      const q = QH[hi], roof = iso(q.x + 80, q.y + 70, q.h + 14);
      ctx.save(); ctx.font = `600 34px ${SANS}`; const tw = ctx.measureText(label).width; ctx.restore();
      const w = tw + 56, x = clamp(roof[0] - w / 2, 70, 1010 - w), y = roof[1] - 150 - (1 - a) * 24;
      thread(roof, [roof[0], y + 70], a);
      card(x, y, w, 70, { al: a, edge: PAL.accent });
      cardText(label, x + 28, y + 47, 34, PAL.text, { al: a, weight: 600 });
    });
    // 13-16: the "open now" filter
    const o = clamp(spring(t, 13.1, { k: 150, damp: 0.7 })) * (1 - clamp((t - 15.8) / 0.3));
    if (o > 0.01) {
      const w = 400, x = CX - w / 2, y = 300 - (1 - o) * 20;
      card(x, y, w, 76, { al: o, edge: PAL.accent });
      ctx.save(); ctx.globalAlpha = o; ctx.beginPath(); ctx.arc(x + 40, y + 38, 9, 0, TAU); ctx.fillStyle = PAL.accent; ctx.fill(); ctx.restore();
      cardText('Открыто сейчас', x + 64, y + 50, 34, PAL.text, { al: o, weight: 600 });
    }
  });
  caption2('Объявления, потеряшки,', 'работа — рядом', 10.4, 12.85);
  caption2('Заведения района', 'на одной карте', 13.3, 15.85);
  caption2('Весь двор —', 'в одном месте', 16.2);
}

// ---- 5 (18-20): the sign, the name, the address
function sceneEnd() {
  const t = TT;
  DEFER.push(() => {
    const s = clamp(spring(t, 18.0, { k: 160, damp: 0.75 })), s2 = clamp(spring(t, 18.6, { k: 120, damp: 0.8 }));
    sign(CX - 61, 620, 50, { al: s });
    ctx.save(); ctx.globalAlpha = s; ctx.font = `800 120px ${SANS}`; ctx.fillStyle = PAL.text; ctx.textAlign = 'center';
    ctx.fillText('Мирный', CX, 900); ctx.restore();
    ctx.save(); ctx.globalAlpha = s2; ctx.font = `600 64px ${SANS}`; ctx.fillStyle = PAL.accent; ctx.textAlign = 'center';
    ctx.fillText('mirni.ru', CX, 1040 + (1 - s2) * 20); ctx.restore();
    ctx.save(); ctx.globalAlpha = s2; ctx.font = `500 40px ${SANS}`; ctx.fillStyle = PAL.textD; ctx.textAlign = 'center';
    ctx.fillText('для жителей ЖК «Томилино Парк»', CX, 1120 + (1 - s2) * 20); ctx.restore();
  });
}
