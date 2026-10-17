  // SCORE BODY — Мирный (inside buildScore(); see kit/score-head.js). 120 BPM, D minor -> F major.
  //  act 1: a cold pad and message clicks that thicken; silence at the window->sign morph;
  //  act 2: a chime and a warm pad; act 3: plucks on every answer, a bass on the beat, pins;
  //  payoff at 16.0 (the loudest moment): every window lights; then a soft tail into the address.
  const T = TIMELINE, q = T.cues;
  to = 'm';
  pad(0.0, 2.85, ['D3', 'F3', 'A3'], 0.022, { type: 'triangle', cut: 900, att: 0.6, rel: 0.4, send: 0.5 });
  pad(3.45, 7.05, ['F3', 'A3', 'C4', 'E4'], 0.026, { type: 'triangle', cut: 1500, att: 0.5, rel: 0.2, send: 0.6 });
  pad(7.0, 15.45, ['D3', 'F3', 'A3', 'C4'], 0.022, { type: 'triangle', cut: 1300, att: 0.2, rel: 0.1, send: 0.5, swellTo: 0.034, swellAt: 15.3 });
  pad(16.0, 18.05, ['F2', 'C3', 'F3', 'A3', 'C4', 'E4'], 0.06, { type: 'sawtooth', cut: 2600, att: 0.02, rel: 0.2, send: 0.6 });
  pad(18.0, 20.0, ['F3', 'A3', 'C4', 'E4'], 0.024, { type: 'triangle', cut: 1400, att: 0.3, rel: 1.2, send: 0.7 });
  // the lit window
  pluck(0.15, nz('A4'), 0.12, 0, 0.6, 2400, 0.4);
  // the sign: a chime when it lands, a pluck per window, a low note under the name
  chime(q.sign, [nz('C6'), nz('F6'), nz('A6')], 0.09);
  [0.0, 0.18, 0.36, 0.54].forEach((dt, i) => pluck(q.sign + dt, nz(['C5', 'F5', 'A5', 'C6'][i]), 0.1, -0.3 + i * 0.2, 0.4, 3000, 0.35));
  bass(q.name, nz('F2'), 0.16);
  // the neighbours: the question, then one pluck per answer, a bass on every beat
  pluck(q.ask, nz('D5'), 0.1, -0.2, 0.4, 2600, 0.3);
  [0, 1, 2].forEach((i) => pluck(q.answers + i * 0.4, nz(['F5', 'A5', 'C6'][i]), 0.12, 0.3, 0.45, 3200, 0.35));
  for (let t = 7.0; t < 15.0 + 1e-6; t += BEAT) bass(t, nz(t < 10 ? 'D2' : t < 13 ? 'Bb1' : 'C2'), 0.11);
  // the quarter: tags, pins, the "open now" pill
  [0, 1, 2].forEach((k) => pluck(q.tags + k * 0.5, nz(['A4', 'C5', 'F5'][k]), 0.11, -0.3 + k * 0.3, 0.4, 3000, 0.3));
  pluck(q.open, nz('E5'), 0.1, 0, 0.4, 3000, 0.3);
  // the payoff: a riser, then the hit, then a wave of plucks as the windows light
  // (15.5-16.0: a held breath before the hit)
  chime(18.15, [nz('F5'), nz('A5'), nz('C6')], 0.06);
  to = 's';
  // the shared chat: message clicks that come faster and thicken until the silence
  for (let k = 0; k < 10; k++) { const t = q.chat + k * 0.2; if (t < 2.8) blip(t, 1800 + (k % 3) * 220, 1500, 0.03, 0.03 + k * 0.004, (k % 2 ? 0.25 : -0.25)); }
  blip(q.question, 900, 1300, 0.08, 0.05);
  // (2.85-3.45: silence while the window shrinks)
  noiseHit(q.sign, 0.25, 'bandpass', 1800, 1.0, 0.03, 0, 0.3, 4000);
  sub(7.0, 0.25); sub(10.0, 0.22);
  for (let k = 0; k < 5; k++) blip(13.25 + k * 0.25, 700, 1200, 0.07, 0.05, -0.4 + k * 0.2);   // pins landing
  sub(16.0, 0.6); noiseHit(16.0, 0.6, 'lowpass', 3000, 0.7, 0.18, 0, 0.5, 400);
  for (let k = 0; k < 12; k++) blip(16.0 + k * 0.07, 2400 + (k % 4) * 300, 2000, 0.025, 0.035, ((k % 3) - 1) * 0.4);   // windows lighting
  sub(18.0, 0.12);
