  // SCORE BODY — Мирный, интерфейс (inside buildScore(); see kit/score-head.js). 120 BPM, D minor -> F major.
  //  act 1: a dark pad and a tick; act 2: a lighter pad that grows a pulse (kick on the beat, hats on the 8ths, a bass line, an arpeggio);
  //  the pulse drops out at 14.0 and returns as a chord on the lit quarter; a soft tail on the address.
  const T = TIMELINE, q = T.cues;
  to = 'm';
  pad(0.0, 3.6, ['D3', 'F3', 'A3'], 0.03, { type: 'triangle', cut: 900, att: 0.6, rel: 0.2, send: 0.4 });
  pad(3.45, 14.1, ['D3', 'F3', 'A3', 'C4'], 0.03, { type: 'triangle', cut: 1500, att: 0.4, rel: 0.2, send: 0.4, swellTo: 0.04, swellAt: 13.9 });
  pad(14.5, 16.2, ['F2', 'C3', 'F3', 'A3', 'C4', 'E4'], 0.046, { type: 'sawtooth', cut: 2600, att: 0.02, rel: 0.3, send: 0.5 });
  pad(16.0, 18.0, ['F3', 'A3', 'C4', 'E4'], 0.026, { type: 'triangle', cut: 1500, att: 0.3, rel: 1.2, send: 0.6 });
  // the bass, one note per beat, following the chords D - Bb - F - C (two bars each)
  const roots = ['D2', 'Bb1', 'F2', 'C2'];
  for (let t = 3.5, i = 0; t < 14.0 - 1e-6; t += BEAT, i++) bass(t, nz(roots[Math.floor(i / 4) % 4]), 0.1);
  // the arpeggio on the 8ths, from 3.9
  const arp = [['D5', 'F5', 'A5', 'F5'], ['Bb4', 'D5', 'F5', 'D5'], ['F5', 'A5', 'C6', 'A5'], ['C5', 'E5', 'G5', 'E5']];
  for (let t = 3.9, i = 0; t < 14.0 - 1e-6; t += E8, i++) pluck(t, nz(arp[Math.floor(i / 8) % 4][i % 4]), 0.05, ((i % 4) - 1.5) * 0.15, 0.25, 3200, 0.3);
  chime(14.5, [nz('F6'), nz('A6'), nz('C7')], 0.12);
  chime(q.sign, [nz('C6'), nz('F6'), nz('A6')], 0.08);
  to = 's';
  // the drums: a kick on every beat, hats on the off 8ths, from the first screen to the drop at 14.0
  for (let t = 3.5; t < 14.0 - 1e-6; t += BEAT) { sub(t, 0.22); }
  for (let t = 3.5 + E8; t < 14.0 - 1e-6; t += BEAT) noiseHit(t, 0.05, 'highpass', 7000, 0.7, 0.03, 0.2);
  // the clock-like tick in the dark first act; the tap clicks; the swap whooshes
  for (let t = 0.5; t < 3.2; t += 0.5) blip(t, 1700, 1300, 0.03, 0.04, 0);
  [q.tap1, q.tap2, q.tap3].forEach((t) => { blip(t, 2200, 900, 0.05, 0.09); });
  [q.s1, q.s2, q.s3].forEach((t) => noiseHit(t - 0.05, 0.3, 'bandpass', 1400, 1.0, 0.04, 0, 0.2, 3600));
  sweep(3.0, 3.5, 0.01, 500, 2400, 0);
  sweep(13.9, 14.5, 0.012, 500, 3000, 0);
  // the payoff: the quarter lights up
  sub(14.5, 0.8); noiseHit(14.5, 0.6, 'lowpass', 3000, 0.7, 0.22, 0, 0.5, 400);
  for (let k = 0; k < 12; k++) blip(14.7 + k * 0.07, 2400 + (k % 4) * 300, 2000, 0.025, 0.035, ((k % 3) - 1) * 0.4);
  sub(q.end, 0.12);
