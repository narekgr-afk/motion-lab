// =====================================================================
//  ERAS, CAMERAS, BRIDGES — Мирный, интерфейс (read by kit/morph.js)
// =====================================================================
const ERA_BG = [PAL.paper, PAL.paper, PAL.paper];
function pieceCam(era, t) {
  if (era !== 1) return null;
  // a slow push-in over the phone, with a small kick on every tap
  const z = 1 + 0.07 * EZ.io(seg(t, 3.9, 14.0)) + [5.9, 9.5, 12.9].reduce((a, tt) => a + 0.035 * kick(t, tt, { k: 220, damp: 0.5 }), 0);
  return camOf({ z, p: [470, 814], to: [470, 814] });
}
const BRIDGES = [
  { tc: 3.5, d: 0.45,    // the lit window -> the phone screen
    A: () => ({ P: introWindowPts(), c: PAL.accent }),
    B: () => ({ P: phoneScreenPts(), c: PAL.edge }) },
  { tc: 14.5, d: 0.45,   // the phone screen -> the lit window of the sign
    A: () => ({ P: phoneScreenPts(), c: PAL.edge }),
    B: () => ({ P: rrectPts(403 + 60 * 1.22, 215, 60, 60, 8, 3), c: PAL.accent }) },
];
