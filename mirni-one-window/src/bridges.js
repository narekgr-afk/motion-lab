// =====================================================================
//  ERAS, CAMERAS, BRIDGES — Мирный (read by kit/morph.js)
// =====================================================================
const ERA_BG = [PAL.paper, PAL.paper, PAL.paper, PAL.paper, PAL.paper];
function pieceCam(era, t) { return era === 3 ? push(t, 10.0, 17.8, { z: 1.06, p: [540, 900], to: [540, 900] }) : null; }
const BRIDGES = [
  // the lit window -> the sign's lit window
  { tc: 3.25, d: 0.5,
    A: () => ({ P: chatWindowPts(), c: PAL.accent }),
    B: () => ({ P: signLitPts(), c: PAL.accent }) },
];
