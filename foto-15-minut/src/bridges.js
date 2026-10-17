// =====================================================================
//  ERAS, CAMERAS, BRIDGES — «Фото за 15 минут» (read by kit/morph.js). Printed colours of plate tones, so the fades stay in the inks.
// =====================================================================
const eraBg = (t) => rgbHex(inkRGB(t));
const ERA_BG = [eraBg({ teal: 0.3, pink: 0.28, yellow: 0.1 }), eraBg({ yellow: 0.5, pink: 0.2, teal: 0.05 }), eraBg({ teal: 0.3, yellow: 0.3, pink: 0.06 }), eraBg({ pink: 0.3, yellow: 0.7 })];
function pieceCam(era, t) { return null; }
const BRIDGES = [
  { tc: 3.75, d: 0.45,   // the clock -> the camera lens
    A: () => ({ P: ellipsePts(CLOCK.x, CLOCK.y, CLOCK.r, CLOCK.r, 0, 64), c: eraBg({ teal: 0.2, pink: 0.1 }) }),
    B: () => ({ P: ellipsePts(LENS.x, LENS.y, LENS.r, LENS.r, 0, 64), c: eraBg({ teal: 0.9, pink: 0.2 }) }) },
  { tc: 7.5, d: 0.45,    // the lens -> the stopwatch
    A: () => ({ P: ellipsePts(LENS.x, LENS.y, LENS.r, LENS.r, 0, 64), c: eraBg({ teal: 0.9, pink: 0.2 }) }),
    B: () => ({ P: ellipsePts(STOP.x, STOP.y, STOP.r, STOP.r, 0, 64), c: eraBg({ teal: 0.1 }) }) },
  { tc: 11.25, d: 0.45,  // the stopwatch -> the hero's body
    A: () => ({ P: ellipsePts(STOP.x, STOP.y, STOP.r, STOP.r, 0, 64), c: eraBg({ teal: 0.1 }) }),
    B: () => ({ P: ellipsePts(HERO4.x, HERO4.y + 70, HERO4.r * 0.78, HERO4.r, 0, 64), c: rgbHex(inkRGB(HERO_TONES)) }) },
];
