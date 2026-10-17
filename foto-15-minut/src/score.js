  // SCORE BODY — «Фото за 15 минут» (inside buildScore(); see kit/score-head.js). 120 BPM, D minor -> D major.
  //  act 1: a tense pad and a ticking clock; act 2: a lighter pad, a shutter click; act 3: a printer's hiss and a pluck per photo,
  //  a riser into the silence at 10.75; payoff on the hit at 11.25, then a chord and a soft tail.
  const T = TIMELINE, cu = T.cues;
  to = 'm';
  pad(0.0, 3.85, ['D3', 'F3', 'A3'], 0.03, { type: 'triangle', cut: 900, att: 0.5, rel: 0.2, send: 0.4 });
  pad(3.75, 7.6, ['D3', 'A3', 'C4', 'E4'], 0.034, { type: 'triangle', cut: 1500, att: 0.25, rel: 0.2, send: 0.4 });
  pad(7.5, 10.4, ['D3', 'Fs3', 'A3', 'E4'], 0.032, { type: 'triangle', cut: 1700, att: 0.2, rel: 0.1, send: 0.2 });
  pad(11.25, 13.4, ['D2', 'A2', 'D3', 'Fs3', 'A3', 'D4'], 0.042, { type: 'sawtooth', cut: 2600, att: 0.02, rel: 0.4, send: 0.5 });
  pad(13.3, 15.0, ['D3', 'Fs3', 'A3', 'E4'], 0.028, { type: 'triangle', cut: 1500, att: 0.3, rel: 1.1, send: 0.6 });
  [['A4', 0], ['D5', 0.25], ['Fs5', 0.5]].forEach(([n, dt], i) => pluck(cu.wave + dt, nz(n), 0.12, -0.1 + i * 0.1, 0.4, 3000, 0.3));
  [cu.p1, cu.p2, cu.p3].forEach((t, i) => pluck(t + 0.45, nz(['A4', 'D5', 'Fs5'][i]), 0.13, -0.2 + i * 0.2, 0.4, 3600, 0.3));
  [['D5', 0], ['Fs5', E16], ['A5', E8], ['D6', E8 + E16]].forEach(([n, dt], i) => pluck(cu.hop + dt, nz(n), 0.16, -0.2 + i * 0.13, 0.35, 4800, 0.3));
  chime(11.25, [nz('D6'), nz('A6'), nz('Fs6')], 0.14);
  to = 's';
  // the clock: ticks that speed up through the first act, silence at the morph
  for (let t = 0.5; t < 3.2; t += 0.5 - 0.12 * ((t - 0.5) / 2.7)) blip(t, 1700, 1300, 0.03, 0.04 + 0.01 * t, ((t * 4) | 0) % 2 ? 0.2 : -0.2);
  sweep(3.3, 3.8, 0.01, 500, 2400, 0);
  // the studio: a shutter click and a flash
  blip(cu.flash, 2000, 600, 0.05, 0.12); noiseHit(cu.flash, 0.2, 'bandpass', 3200, 1.2, 0.06, 0, 0.3, 1200); blip(cu.selfie, 1600, 2400, 0.06, 0.05);
  sweep(7.0, 7.5, 0.01, 500, 2400, 0);
  // the printer: a hiss and a feed per photo; stopwatch ticks that densify; a riser into the hush
  [cu.p1, cu.p2, cu.p3].forEach((t) => { noiseHit(t, 0.5, 'bandpass', 1400, 1.2, 0.04, 0, 0.1, 3200); for (let k = 0; k < 4; k++) blip(t + 0.05 + k * 0.12, 700 + k * 120, 600, 0.04, 0.03); });
  for (let t = 7.8; t < 10.4; t += 0.25) blip(t, 1500, 1200, 0.02, 0.03);
  riser(9.6, 10.4, 0.04);
  // the payoff: the loudest hit, then a sparkle of blips on the hop
  sub(11.25, 0.9); noiseHit(11.25, 0.6, 'lowpass', 3000, 0.7, 0.24, 0, 0.5, 400);
  for (let k = 0; k < 10; k++) blip(cu.hop + k * 0.06, 2400 + (k % 4) * 300, 2000, 0.025, 0.035, ((k % 3) - 1) * 0.4);
  sub(cu.card, 0.12);
