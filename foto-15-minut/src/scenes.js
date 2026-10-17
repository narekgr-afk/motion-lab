// =====================================================================
//  SCENES — «Фото за 15 минут», riso. World 1080x1920; TT on 2s. Every colour is plate tones { teal, pink, yellow } or a MIX name.
//  Each world = a coarse field layer + one world layer. Captions go through defer (printed at screen size after the camera).
// =====================================================================
const CLOCK = { x: 700, y: 610, r: 150 };
const LENS = { x: 640, y: 800, r: 118 };
const STOP = { x: 470, y: 640, r: 230 };
const HERO4 = { x: 470, y: 1130, r: 210 };

// two-line caption as printed cards (absolute start time t0)
const cap2 = (a, b, t0) => defer(() => {
  printCard(a, CX, 1360, 42, { s: popS(t0), frac: ev(t0 + 0.12, 0.5) });
  if (b) printCard(b, CX, 1432, 42, { s: popS(t0 + 0.2), frac: ev(t0 + 0.32, 0.5), rot: -0.012 });
});
const tag = (str, t0) => defer(() => printTag(str, 70 + (typeW(str, 64) + 58) / 2, 330, 64, { s: popS(t0) }));

// a 3x4 photo card: paper, rough rim, a teal backdrop, the hero's head
function idPhoto(x, y, w, h, key) {
  fill(hand(boxPts(x - w / 2 + 9, y - h / 2 + 11, w, h), key + 's', 1), { teal: 0.28, pink: 0.22 });
  const P = boxPts(x - w / 2, y - h / 2, w, h);
  fill(hand(P, key, 1), {});
  rimLine(P, key + 'r', { w: 5, amt: 1, rough: 0.4 });
  fill(rect(x - w / 2 + 12, y - h / 2 + 12, w - 24, h - 24), { teal: 0.22, yellow: 0.1 });
  const hr = w * 0.26;
  fill(ell(x, y + h * 0.26, w * 0.36, h * 0.2), MIX.blue);
  fill(ell(x, y - h * 0.04, hr, hr * 1.12), MIX.blue);
  for (const s of [-1, 1]) { fill(circ(x + s * hr * 0.42, y - h * 0.07, hr * 0.2), {}); fill(circ(x + s * hr * 0.42, y - h * 0.065, hr * 0.1), MIX.dark); }
  line(arcPts(x, y - h * 0.02, hr * 0.38, Math.PI * 0.15, Math.PI * 0.85, 8), {}, { w: Math.max(3, w * 0.025), amt: 0.2, key: key + 'sm', knock: true });
}
function dial(cx, cy, r, key, o = {}) {
  fill(hand(ellipsePts(cx, cy, r, r, 0, 56), key, 1.4), {});
  rimLine(ringPts(cx, cy, r), key + 'rim', { w: o.rim ?? 10, amt: 1.2, rough: 0.5, tones: MIX.dark });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU - Math.PI / 2, a0 = r * 0.82, a1 = r * (i % 3 === 0 ? 0.64 : 0.72);
    line([[cx + Math.cos(a) * a0, cy + Math.sin(a) * a0], [cx + Math.cos(a) * a1, cy + Math.sin(a) * a1]], MIX.dark, { w: i % 3 === 0 ? 9 : 5, amt: 0.3, key: key + 't' + i, knock: true });
  }
}
const hand_ = (cx, cy, ang, len, w, key, tones = MIX.dark) => line([[cx, cy], [cx + Math.cos(ang) * len, cy + Math.sin(ang) * len]], tones, { w, amt: 0.3, key, knock: true });

// ---- 1: night. The clock ticks, the note says tomorrow, the hero holds a blank photo with a question mark
function sceneNight() {
  const cu = TIMELINE.cues, pan = ev(cu.panic, 0.4);
  beginSheet();
  printed(PITCH.field, { full: true }, () => {
    fill(rect(-80, -80, W + 160, H + 160), { teal: lin(0, 0, 0, 1300, [[0, 0.5], [1, 0.22]]), pink: 0.28, yellow: 0.1 });
  });
  printed(PITCH.world, { shapes: true }, () => {
    // the window with a night sky, a moon and stars
    const win = boxPts(110, 400, 330, 440);
    fill(hand(win, 'win', 1.2), { teal: 0.95, pink: 0.45 });
    fill(circ(330, 530, 58), { yellow: 1 });
    fill(circ(352, 518, 50), { teal: 0.95, pink: 0.45 });
    for (const [x, y] of [[190, 480], [250, 600], [380, 660], [170, 700]]) { const k = (B + x) % 3 ? 1 : 0.6; line([[x - 12 * k, y], [x + 12 * k, y]], { yellow: 1 }, { w: 5, amt: 0.2, key: 'st' + x, knock: true }); line([[x, y - 12 * k], [x, y + 12 * k]], { yellow: 1 }, { w: 5, amt: 0.2, key: 'sv' + x, knock: true }); }
    rimLine(win, 'winr', { w: 12, amt: 1.2, rough: 0.5, tones: MIX.dark });
    line([[275, 400], [275, 840]], MIX.dark, { w: 9, amt: 0.4, key: 'mull', knock: true });
    line([[110, 620], [440, 620]], MIX.dark, { w: 9, amt: 0.4, key: 'mull2', knock: true });
    // the clock: ten to eleven, the minute hand racing
    dial(CLOCK.x, CLOCK.y, CLOCK.r, 'clk');
    hand_(CLOCK.x, CLOCK.y, -Math.PI / 2 + (10 + 0.9) / 12 * TAU - TAU / 4 * 0, CLOCK.r * 0.5, 13, 'hh');
    hand_(CLOCK.x, CLOCK.y, -Math.PI / 2 + (TT * 0.9 + 0.8) * TAU, CLOCK.r * 0.74, 8, 'mh', MIX.coral);
    fill(circ(CLOCK.x, CLOCK.y, 12), MIX.dark);
    // the floor and a rug
    fill(rect(-80, 1280, W + 160, H), { teal: 0.55, pink: 0.2, yellow: 0.2 });
    fill(rect(-80, 1280, W + 160, 22), { teal: 0.9, pink: 0.55, yellow: 0.3 });
    fill(hand(ellipsePts(470, 1470, 420, 120, 0, 40), 'rug', 2), { pink: 0.65, yellow: 0.3 });
    // the hero: wow, arms flapping, holding the blank photo with a «?»
    const fl = Math.sin(TT * 11) * 0.35 * pan;
    risoHero(470, 1170, 150, {
      key: 'hero', look: [0.2, -0.4], mood: 'wow', hop: pan > 0 ? Math.abs(Math.sin(TT * 7)) * 26 * pan : 0,
      arms: [2.3 + fl, 2.3 - fl],
      hold: (hx, hy) => {
        const P = boxPts(hx - 70, hy - 175, 140, 185);
        fill(hand(P, 'blank', 1), {}); rimLine(P, 'blankr', { w: 5, amt: 1, rough: 0.4 });
        type('?', hx, hy - 52, 110, { pink: 1 }, { align: 'center', key: 'q' });
      },
    });
  });
  // the sticky note: «ЗАВТРА»
  const nr = -0.07 + Math.sin(TT * 6) * 0.012;
  printed(PITCH.fine, { T: { s: 1, x: 700, y: 905, rot: nr }, shapes: true, box: [-200, -110, 200, 120] }, () => {
    fill(hand(boxPts(-168, -78, 340, 170), 'notesh', 1), { pink: 0.7 });
    fill(hand(boxPts(-175, -85, 340, 170), 'note', 1), { yellow: 1 });
    type('ЗАВТРА', -140, 22, 76, MIX.coral, { key: 'tomorrow', frac: ev(cu.panic + 0.3, 0.4) });
  });
  endSheet();
  tag('вечер', 0.2);
  cap2('Документы сдавать завтра,', 'а фото нет?', 0.75);
}

// ---- 2: the studio. Walk in without an appointment, the flash, or a selfie
function sceneStudio() {
  const cu = TIMELINE.cues, fl = ev(cu.flash, 0.12), flOn = TT >= cu.flash && TT < cu.flash + 0.3;
  const wv = TT >= cu.wave ? Math.sin((TT - cu.wave) * 12) * 0.4 : 0;
  beginSheet();
  printed(PITCH.field, { full: true }, () => {
    fill(rect(-80, -80, W + 160, H + 160), { yellow: 0.5, pink: lin(0, 200, 0, 1300, [[0, 0.08], [1, 0.3]]), teal: 0.05 });
    if (flOn) fill(circ(LENS.x, LENS.y, 520), { yellow: rad(LENS.x, LENS.y, 100, 520, [[0, 0.9], [1, 0]]) }, { over: true });
  });
  printed(PITCH.world, { shapes: true }, () => {
    // the white backdrop (a paper roll) behind the hero
    const bd = (g) => { g.moveTo(60, 500); g.lineTo(420, 500); g.lineTo(420, 1240); g.quadraticCurveTo(400, 1330, 330, 1340); g.lineTo(60, 1340); g.closePath(); };
    fill(bd, {}); rimLine(resample([[60, 500], [420, 500], [420, 1240], [330, 1340], [60, 1340]], true, 8), 'bdr', { w: 7, amt: 1.4, rough: 0.45 });
    // the camera: tripod, body, lens (the bridge circle), the flash
    for (const [a, b] of [[[640, 960], [520, 1330]], [[640, 960], [640, 1340]], [[640, 960], [770, 1330]]]) line([a, b], MIX.dark, { w: 12, amt: 0.6, key: 'tp' + a[0] + b[0], knock: true });
    fill(hand(boxPts(470, 660, 350, 300), 'cam', 1.4), MIX.dark);
    specks(480, 670, 810, 950, 50, 'cam');
    fill(hand(boxPts(520, 620, 110, 56), 'camtop', 1), MIX.dark);
    fill(circ(LENS.x, LENS.y, LENS.r), { teal: 0.9, pink: 0.2 });
    rimLine(ringPts(LENS.x, LENS.y, LENS.r), 'lensr', { w: 12, amt: 1, rough: 0.5, tones: { pink: 1, yellow: 0.6, teal: 0.2 } });
    fill(circ(LENS.x, LENS.y, LENS.r * 0.55), MIX.blue);
    line(arcPts(LENS.x, LENS.y, LENS.r * 0.4, Math.PI * 1.1, Math.PI * 1.45, 8), {}, { w: 11, taper: 0.4, knock: true, key: 'lensg' });
    fill(hand(boxPts(740, 690, 56, 40), 'flb', 1), { yellow: flOn ? 1 : 0.7 });
    if (flOn) for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + 0.3, k = 1 + 0.15 * ((B + i) % 2);
      line([[LENS.x + Math.cos(a) * 190 * k, LENS.y + Math.sin(a) * 190 * k], [LENS.x + Math.cos(a) * 270 * k, LENS.y + Math.sin(a) * 270 * k]], MIX.coral, { w: 9, taper: 0.4, amt: 0.6, key: 'fs' + i, knock: true });
    }
    // the floor
    fill(rect(-80, 1340, W + 160, H), { teal: 0.55, yellow: 0.35, pink: 0.08 });
    fill(rect(-80, 1340, W + 160, 24), { teal: 0.85, pink: 0.6, yellow: 0.6 });
    // the hero walks in, waves, then smiles for the flash
    const enter = EZ.o3(ev(3.9, 0.5)), x = lerp(-120, 250, enter), st = TT >= cu.flash;
    risoHero(x, 1185, 135, {
      key: 'hero', look: [0.7, -0.15], mood: st ? 'happy' : 'smile', hop: TT >= cu.flash && TT < cu.flash + 0.4 ? Math.sin(seg(TT, cu.flash, cu.flash + 0.4) * Math.PI) * 28 : 0,
      arms: [0.35, 0.35 + (TT >= cu.wave && TT < cu.flash - 0.3 ? 1.9 + wv : 0)],
    });
  });
  // the hanging sign: «БЕЗ ЗАПИСИ»
  const sa = Math.sin(TT * 3.2) * 0.05;
  printed(PITCH.world, { T: { s: 1, x: 700, y: 270, rot: sa }, shapes: true, box: [-200, -40, 200, 260] }, () => {
    line([[-90, -30], [-100, 70]], MIX.dark, { w: 4, amt: 0.4, key: 'ss1', knock: true }); line([[90, -30], [100, 70]], MIX.dark, { w: 4, amt: 0.4, key: 'ss2', knock: true });
    fill(hand(boxPts(-165, 66, 330, 130), 'sgn', 1.2), MIX.dark);
    specks(-155, 75, 155, 185, 40, 'sgn');
    type('БЕЗ ЗАПИСИ', 0, 150, 46, {}, { align: 'center', key: 'bez', weight: 900 });
  });
  endSheet();
  tag('без записи', 3.95);
  cap2('Без записи — или', 'по селфи', 4.7);
  defer(() => printTag('селфи', 690, 1160, 60, { s: popS(cu.selfie), rot: 0.05, tones: { pink: 0.55, yellow: 1 } }));
}

// ---- 3: printing. The stopwatch counts 15 minutes, the printer pushes out photos
const PHOTOS = [[310, 'p1'], [490, 'p2'], [670, 'p3']];
function scenePrint() {
  const cu = TIMELINE.cues, prog = EZ.io(seg(TT, 7.8, 10.9));
  const left = Math.max(0, 15 * 60 * (1 - prog)), mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(Math.floor(left % 60)).padStart(2, '0');
  beginSheet();
  printed(PITCH.field, { full: true }, () => {
    fill(rect(-80, -80, W + 160, H + 160), { teal: lin(0, 0, 0, 1500, [[0, 0.42], [1, 0.12]]), yellow: 0.3, pink: 0.06 });
  });
  printed(PITCH.world, { shapes: true }, () => {
    // the stopwatch (the bridge circle): crown, face, a pink arc that fills, the minute hand
    fill(rect(STOP.x - 44, STOP.y - STOP.r - 62, 88, 56), MIX.dark);
    fill(rect(STOP.x - 72, STOP.y - STOP.r - 84, 144, 32), MIX.dark);
    fill(hand(ellipsePts(STOP.x, STOP.y, STOP.r, STOP.r, 0, 64), 'swb', 1.4), MIX.dark);
    fill(hand(ellipsePts(STOP.x, STOP.y, STOP.r * 0.9, STOP.r * 0.9, 0, 64), 'swf', 1.2), {});
    const arcP = arcPts(STOP.x, STOP.y, STOP.r * 0.78, -Math.PI / 2, -Math.PI / 2 + Math.max(0.01, prog) * TAU, 60);
    line(arcP, { pink: 1, yellow: 0.25 }, { w: 26, amt: 0.3, key: 'sarc', rough: 0.2 });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU - Math.PI / 2;
      line([[STOP.x + Math.cos(a) * STOP.r * 0.86, STOP.y + Math.sin(a) * STOP.r * 0.86], [STOP.x + Math.cos(a) * STOP.r * 0.8, STOP.y + Math.sin(a) * STOP.r * 0.8]], MIX.dark, { w: 4, amt: 0.2, key: 'stk' + i, knock: true });
    }
    hand_(STOP.x, STOP.y, -Math.PI / 2 + prog * TAU, STOP.r * 0.66, 11, 'smh');
    fill(circ(STOP.x, STOP.y, 14), MIX.dark);
    type(mm + ':' + ss, STOP.x, STOP.y + STOP.r * 0.5, 62, MIX.blue, { align: 'center', key: 'cnt' });
    // the photos first, so the printer body hides the slot
    PHOTOS.forEach(([x, k], i) => {
      const t0 = cu['p' + (i + 1)], u = EZ.o3(ev(t0, 0.55));
      if (u > 0) idPhoto(x, lerp(1050, 1225, u), 150, 195, k);
    });
    // the printer: body, lid, a paper slot, a status light
    fill(hand(boxPts(170, 900, 640, 250), 'prb', 1.4), { teal: 0.6, pink: 0.3 });
    fill(hand(boxPts(150, 880, 680, 70), 'prl', 1.2), MIX.dark);
    specks(160, 885, 820, 945, 50, 'prl');
    fill(rect(250, 1118, 480, 20), MIX.dark);
    fill(circ(750, 1010, 12), TT % 0.5 < 0.25 ? { yellow: 1 } : {});
    rimLine(boxPts(170, 900, 640, 250), 'prr', { w: 6, amt: 1.2, rough: 0.4 });
    // the floor line
    fill(rect(-80, 1420, W + 160, H), { teal: 0.6, yellow: 0.3 });
  });
  endSheet();
  tag('15 минут', 7.7);
  cap2('Готово за 15 минут.', 'Без доплаты за срочность', 8.0);
}

// ---- 4: done. The hero holds the photo; the studio card
function sceneDone() {
  const cu = TIMELINE.cues, h = HERO4, hop = TT >= cu.hop ? Math.sin(seg(TT, cu.hop, cu.hop + 0.5) * Math.PI) * 60 : 0, up = EZ.o3(ev(11.4, 0.4));
  beginSheet();
  printed(PITCH.field, { full: true }, () => {
    fill(rect(-80, -80, W + 160, H + 160), { pink: lin(0, 0, 0, 1500, [[0, 0.45], [1, 0.2]]), yellow: 0.7, teal: 0.02 });
    fill(circ(h.x, h.y - 120, 460), { yellow: rad(h.x, h.y - 120, 120, 460, [[0, 0.5], [1, 0]]) }, { over: true });
  });
  printed(PITCH.world, { shapes: true }, () => {
    // printed sparkles around the photo
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + 0.2, k = 1 + 0.14 * ((B + i) % 2), r0 = 330, r1 = 400 + (i % 3) * 30;
      if (TT >= cu.hop - 0.1) line([[h.x + Math.cos(a) * r0 * k, h.y - 250 + Math.sin(a) * r0 * 0.9 * k], [h.x + Math.cos(a) * r1 * k, h.y - 250 + Math.sin(a) * r1 * 0.9 * k]], MIX.coral, { w: 9, taper: 0.4, amt: 0.6, key: 'sp' + i, knock: true });
    }
    fill(rect(-80, 1330, W + 160, H), { teal: 0.55, yellow: 0.4, pink: 0.1 });
    fill(rect(-80, 1330, W + 160, 26), { teal: 0.85, pink: 0.6, yellow: 0.6 });
    risoHero(h.x, h.y + 70, h.r, {
      key: 'hero', look: [0, -0.5], mood: 'happy', hop,
      arms: [lerp(0.35, 2.55, up), lerp(0.35, 2.55, up)],
      hold: up > 0.5 ? (hx, hy) => idPhoto(hx, hy - 150, 210, 275, 'big') : null,
    });
    // the studio card after the hop
    const cs = popS(cu.card);
    if (cs > 0.01) type('Томи Студио', 470, 600, 100, MIX.blue, { align: 'center', key: 'brand', frac: ev(cu.card + 0.1, 0.5) });
  });
  endSheet();
  tag('готово', 11.45);
  defer(() => {
    printCard('Академика Северина, 13', CX, 1360, 42, { s: popS(cu.card + 0.3), frac: ev(cu.card + 0.4, 0.5) });
    printCard('каждый день 9:00–22:00', CX, 1432, 42, { s: popS(cu.card + 0.55), frac: ev(cu.card + 0.65, 0.5), rot: -0.012 });
  });
}
