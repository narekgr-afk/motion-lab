// =====================================================================
//  SCENES — Мирный, интерфейс. Real screenshots (assets/m-*.jpg) inside a phone, between the isometric night house (0-3.5)
//  and the lit quarter (14.5-18). The tour screenshots are of the live site; every word on the phone is the site's own.
// =====================================================================
const HOUSE1 = { iso: { ox: 470, oy: 1075, u: 1.18 }, h: [-130, -100, 260, 200, 480], lit: [0, 1, 4] };
const PH = { x: 470 - 298, y: 340, w: 596, h: 948, bz: 18, r: 56 };           // the phone frame (screen inset by bz)
const SCR = { x: PH.x + PH.bz, y: PH.y + PH.bz, w: PH.w - 2 * PH.bz, h: PH.h - 2 * PH.bz };
const SCREENS = [['m-home.jpg', 3.9], ['m-business.jpg', 7.7], ['m-card.jpg', 11.3]];   // [asset, appears at]
const TAPS = [[5.9, 0.5, 0.708], [9.5, 0.73, 0.4], [12.9, 0.43, 0.566]];                // [t, rel x, rel y] on the screen

// ---- 1: night. One lit window; the site's own headline
function sceneIntro() {
  setIso(HOUSE1.iso);
  isoPlates(-190, -160, -26, 380, 360, [{ h: 14, r: 36 }, { h: 12, gap: 5, inset: 12, r: 30 }]);
  const L = HOUSE1.lit;
  house(...HOUSE1.h, { lit: (f, c, r) => (f === L[0] && c === L[1] && r === L[2] ? spring(TT, 0.3, { k: 80, damp: 0.7 }) : 0) });
  caption2('Всё рядом с домом', 'спросите соседей', 0.9, 3.25, 1405);
}
const introWindowPts = () => { setIso(HOUSE1.iso); return houseLayout(...HOUSE1.h).winPts(...HOUSE1.lit); };

// ---- 2: the phone. Three real screens, a cursor that taps, a pulse on what the site says
function phoneFrame(al = 1) {
  ctx.save(); ctx.globalAlpha = al;
  polyPath(rrectPts(PH.x, PH.y + 12, PH.w, PH.h, PH.r, 8), true); ctx.fillStyle = PAL.paper; ctx.fill(); hair(PAL.inner); ctx.stroke();   // thickness
  polyPath(rrectPts(PH.x, PH.y, PH.w, PH.h, PH.r, 8), true); ctx.fillStyle = PAL.face; ctx.fill(); hair(PAL.edge, 3); ctx.stroke();
  ctx.restore();
}
function screenAt(name, k, o = {}) {   // draws a screenshot into the phone screen, with an optional blur and a slide
  ctx.save(); ctx.beginPath(); ctx.roundRect(SCR.x, SCR.y, SCR.w, SCR.h, PH.r - PH.bz); ctx.clip();
  ctx.globalAlpha = clamp(o.al ?? 1); if (o.blur) ctx.filter = `blur(${o.blur}px)`;
  const dy = o.dy ?? 0; drawAsset(name, SCR.x, SCR.y + dy, SCR.w, SCR.h, { fit: 'cover' });
  ctx.restore();
}
function tapAt(t, rx, ry) {
  const s = TT - t; if (s < 0 || s > 0.8) return;
  const x = SCR.x + rx * SCR.w, y = SCR.y + ry * SCR.h, r = 14 + s * 90, a = 1 - s / 0.8;
  ctx.save(); ctx.globalAlpha = a * 0.9; polyPath(ellipsePts(x, y, r, r, 0, 36), true); hair(PAL.accent, 5); ctx.stroke(); ctx.restore();
}
function cursor(t0, t1, from, to) {   // a small dot that travels, presses (scale), and stays
  const u = EZ.io(seg(TT, t0, t1)), x = SCR.x + lerp(from[0], to[0], u) * SCR.w, y = SCR.y + lerp(from[1], to[1], u) * SCR.h;
  const press = TT >= t1 && TT < t1 + 0.18 ? 0.78 : 1;
  ctx.save(); ctx.globalAlpha = clamp((TT - t0 + 0.2) / 0.2) * (1 - clamp((TT - (t1 + 0.9)) / 0.25));
  ctx.beginPath(); ctx.arc(x, y, 17 * press, 0, TAU); ctx.fillStyle = PAL.accent; ctx.fill(); hair(PAL.paper, 4); ctx.stroke(); ctx.restore();
}
function scenePhone() {
  const e = spring(TT, 3.4, { k: 120, damp: 0.75 }), t = TT;
  ctx.save(); const z = lerp(0.9, 1, e); ctx.translate(470, 814); ctx.scale(z, z); ctx.translate(-470, -814); ctx.globalAlpha = clamp(e * 2);
  phoneFrame();
  // which screen: each swap is a short blur-out of the old one and a spring-in of the new one
  SCREENS.forEach(([name, t0], i) => {
    const t1 = i + 1 < SCREENS.length ? SCREENS[i + 1][1] : 1e9, nxt = clamp((t - t1) / 0.3), cur = clamp((t - t0) / 0.3);
    if (t < t0 - 1e-6 || t > t1 + 0.35) return;
    screenAt(name, i, { al: cur * (1 - nxt), blur: (1 - cur) * 8 + nxt * 8, dy: (1 - spring(t, t0, { k: 140, damp: 0.8 })) * 34 });
  });
  // taps
  TAPS.forEach(([tt, rx, ry], i) => { tapAt(tt, rx, ry); cursor(tt - 0.7, tt, i === 0 ? [0.78, 0.9] : TAPS[i - 1].slice(1), [rx, ry]); });
  ctx.restore();
  caption2('Что ищете рядом?', null, 4.4, 7.5);
  caption2('Каталог местных', 'бизнесов района', 8.0, 11.1);
  caption2('Владелец забирает карточку —', 'сейчас бесплатно', 11.6, 14.4);
}
const phoneScreenPts = () => rrectPts(SCR.x, SCR.y, SCR.w, SCR.h, PH.r - PH.bz, 8);

// ---- 3: the lit quarter and the sign
const QH2 = (() => { const R = RNG(7), out = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out.push({ x: -310 + i * 220, y: -310 + j * 220, h: 300 + Math.floor(R.f() * 4) * 40 }); return out; })();
function sceneEnd() {
  setIso({ ox: 470, oy: 1060, u: 0.64 });
  isoPlates(-360, -360, -30, 720, 720, [{ h: 18, r: 60 }, { h: 12, gap: 6, inset: 16, r: 50 }]);
  const t = TT;
  isoGrid(3, 3, (i, j) => {
    const q = QH2[i * 3 + j];
    house(q.x, q.y, 160, 140, q.h, { cols: 3, sideCols: 3, rows: Math.round(q.h / 60), top: 22, bot: 44,
      lit: (f, c, r) => { const h = RNG(31, i, j, f, c, r).f; return spring(t, 14.7 + (i + j) * 0.09 + h() * 0.25, { k: 130, damp: 0.75 }) * (h() < 0.85 ? 1 : 0); } });
  });
  DEFER.push(() => {
    const s = clamp(spring(t, 15.6, { k: 110, damp: 0.75 })), s2 = clamp(spring(t, 16.2, { k: 110, damp: 0.8 }));
    sign(403, 215, 60, { al: s });
    ctx.save(); ctx.globalAlpha = s; ctx.font = `800 104px ${SANS}`; ctx.fillStyle = PAL.text; ctx.textAlign = 'center'; ctx.fillText('Мирный', 470, 440 + (1 - s) * 24); ctx.restore();
    ctx.save(); ctx.globalAlpha = s2; ctx.font = `600 52px ${SANS}`; ctx.fillStyle = PAL.accent; ctx.textAlign = 'center'; ctx.fillText('mirni.ru', 470, 1410 + (1 - s2) * 18); ctx.restore();
  });
}
