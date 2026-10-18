'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — звук: всё синтезируется в браузере
// =====================================================================
const SFX = (() => {
  let ac = null, master = null, sfxG = null, ambG = null, musG = null, noiseBuf = null;
  let on = true, vol = 0.7, music = true;
  try { const p = JSON.parse(localStorage.getItem('moti3_audio') || '{}'); if (p.on === false) on = false; if (typeof p.vol === 'number') vol = p.vol; if (p.music === false) music = false; } catch (e) {}
  const savePrefs = () => { try { localStorage.setItem('moti3_audio', JSON.stringify({ on, vol, music })); } catch (e) {} };

  function ensure() {
    if (ac) return true;
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
      ac = new C(); master = ac.createGain(); master.gain.value = on ? vol : 0; master.connect(ac.destination);
      const mk = v => { const g = ac.createGain(); g.gain.value = v; g.connect(master); return g; };
      sfxG = mk(0.9); ambG = mk(0.5); musG = mk(music ? 0.3 : 0);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch (e) { ac = null; return false; }
  }
  const ok = () => ac && on && ac.state === 'running';
  // разблокировка звука первым касанием
  ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if (ensure() && ac.state === 'suspended') ac.resume().then(() => refresh()); else refresh(); }, { capture: true }));
  document.addEventListener('visibilitychange', () => { if (!ac) return; if (document.hidden) ac.suspend(); else if (on) ac.resume(); });

  // ---------- кирпичики ----------
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(type, f0, f1, t, dur, peak, dest = sfxG, a = 0.005) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a, peak, dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + a + dur + 0.05); return o;
  }
  function noise(t, dur, peak, ftype = 'lowpass', f0 = 1000, f1, q = 0.8, dest = sfxG, a = 0.004) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ac.createBiquadFilter(); f.type = ftype; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
    const g = ac.createGain(); env(g, t, a, peak, dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + a + dur + 0.05);
  }
  function growl(t, base, dur, peak) {
    const o = ac.createOscillator(), l = ac.createOscillator(), lg = ac.createGain(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'sawtooth'; o.frequency.value = base; l.frequency.value = 7 + Math.random() * 5; lg.gain.value = base * 0.25; l.connect(lg); lg.connect(o.frequency);
    f.type = 'lowpass'; f.frequency.value = 520; env(g, t, 0.06, peak, dur); o.connect(f); f.connect(g); g.connect(sfxG); o.start(t); l.start(t); o.stop(t + dur + 0.2); l.stop(t + dur + 0.2);
  }

  // ---------- звуки ----------
  const S = {
    click: t => tone('square', 900, 700, t, 0.03, 0.03),
    step: t => { noise(t, 0.07, 0.18, 'bandpass', 380, 0, 1.2); noise(t + 0.28, 0.07, 0.16, 'bandpass', 340, 0, 1.2); },
    travel: t => { for (let i = 0; i < 4; i++) noise(t + i * 0.27, 0.07, 0.16, 'bandpass', 360 + (i % 2) * 40, 0, 1.2); },
    search: t => { for (let i = 0; i < 5; i++) noise(t + i * 0.09 + Math.random() * 0.04, 0.06, 0.12, 'bandpass', 2400 + Math.random() * 1200, 0, 1.5); },
    pickup: t => { tone('triangle', 660, 990, t, 0.08, 0.12); tone('triangle', 990, 1320, t + 0.07, 0.08, 0.08); },
    hit: t => { noise(t, 0.1, 0.45, 'lowpass', 1200, 300); tone('sine', 140, 55, t, 0.16, 0.4); },
    miss: t => noise(t, 0.16, 0.12, 'highpass', 1500, 5000, 0.7),
    hurt: t => { tone('sawtooth', 180, 70, t, 0.25, 0.18); noise(t, 0.15, 0.22, 'lowpass', 800, 200); },
    growl: t => growl(t, 70 + Math.random() * 25, 0.7, 0.2),
    bark: t => { tone('sawtooth', 520, 300, t, 0.09, 0.18); tone('sawtooth', 480, 280, t + 0.18, 0.09, 0.15); },
    roar: t => { growl(t, 48, 1.1, 0.3); noise(t, 0.9, 0.12, 'lowpass', 400, 150); },
    shot: t => { noise(t, 0.3, 0.7, 'lowpass', 4000, 250, 0.5, sfxG, 0.001); tone('sine', 110, 40, t, 0.2, 0.45); },
    shotgun: t => { noise(t, 0.5, 0.9, 'lowpass', 2500, 120, 0.5, sfxG, 0.001); tone('sine', 80, 30, t, 0.35, 0.6); },
    eat: t => { for (let i = 0; i < 3; i++) noise(t + i * 0.16, 0.05, 0.1, 'bandpass', 1500, 0, 2); },
    drink: t => { for (let i = 0; i < 3; i++) tone('sine', 260, 150, t + i * 0.22, 0.12, 0.14); },
    band: t => noise(t, 0.35, 0.12, 'highpass', 2500, 6000, 0.6),
    craft: t => { for (let i = 0; i < 3; i++) { noise(t + i * 0.16, 0.04, 0.3, 'bandpass', 1900, 0, 3); tone('square', 1300, 900, t + i * 0.16, 0.03, 0.04); } },
    build: t => { for (let i = 0; i < 5; i++) noise(t + i * 0.14, 0.05, 0.3, 'bandpass', 1500 + (i % 2) * 400, 0, 3); tone('sine', 90, 50, t + 0.75, 0.25, 0.35); },
    door: t => { tone('sawtooth', 180, 240, t, 0.4, 0.05); noise(t + 0.35, 0.15, 0.3, 'lowpass', 400, 150); },
    fire: t => { for (let i = 0; i < 8; i++) noise(t + i * 0.08 + Math.random() * 0.05, 0.03, 0.12, 'highpass', 2000, 0, 1); },
    splash: t => noise(t, 0.4, 0.25, 'lowpass', 2500, 300),
    purr: t => { const o = tone('sawtooth', 26, 26, t, 1.2, 0.12, sfxG, 0.2); },
    zap: t => { for (let i = 0; i < 6; i++) tone('square', 900 + Math.random() * 1600, 0, t + i * 0.04, 0.03, 0.1); noise(t, 0.3, 0.25, 'highpass', 3000); },
    level: t => [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, t + i * 0.09, 0.18, 0.12)),
    quest: t => { tone('sine', 880, 880, t, 1.2, 0.14, sfxG, 0.01); tone('sine', 1320, 1320, t + 0.12, 1.1, 0.1, sfxG, 0.01); tone('sine', 1760, 1760, t + 0.24, 0.9, 0.06, sfxG, 0.01); },
    siren: t => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(380, t); for (let k = 0; k < 3; k++) { o.frequency.linearRampToValueAtTime(820, t + k * 1.6 + 0.8); o.frequency.linearRampToValueAtTime(380, t + k * 1.6 + 1.6); } g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.3); g.gain.setValueAtTime(0.16, t + 4.4); g.gain.linearRampToValueAtTime(0.0001, t + 4.8); o.connect(g); g.connect(sfxG); o.start(t); o.stop(t + 5); },
    horde: t => { for (let i = 0; i < 8; i++) { tone('sine', 62, 40, t + i * 0.5, 0.3, 0.5); if (i % 2) growl(t + i * 0.5 + 0.1, 55 + Math.random() * 30, 0.6, 0.14); } },
    death: t => { tone('sawtooth', 300, 50, t, 1.6, 0.18, sfxG, 0.02); noise(t, 1.4, 0.08, 'lowpass', 600, 80); },
    heli: t => { for (let i = 0; i < 24; i++) noise(t + i * 0.09, 0.05, 0.18 * Math.min(1, i / 6, (24 - i) / 6), 'lowpass', 300, 0, 1); },
    radio: t => { noise(t, 0.8, 0.08, 'bandpass', 1800, 900, 0.6); tone('sine', 1000, 1000, t + 0.85, 0.12, 0.06); },
    notify: t => { tone('sine', 740, 740, t, 0.15, 0.08); tone('sine', 988, 988, t + 0.1, 0.2, 0.07); },
  };
  let lastAt = {};
  function play(name) {
    if (!ensure() || !ok() || !S[name]) return;
    const now = ac.currentTime; if (lastAt[name] && now - lastAt[name] < 0.05) return; lastAt[name] = now;
    try { S[name](now + 0.01); } catch (e) {}
  }

  // ---------- фон ----------
  let ambKey = '', ambNodes = [], ambTimers = [];
  function stopAmb() {
    const t = ac.currentTime; ambNodes.forEach(n => { try { if (n.gain) { n.gain.cancelScheduledValues(t); n.gain.setValueAtTime(n.gain.value, t); n.gain.linearRampToValueAtTime(0.0001, t + 1.2); } if (n.stop) n.stop(t + 1.3); } catch (e) {} });
    ambTimers.forEach(clearInterval); ambNodes = []; ambTimers = [];
  }
  function loopNoise(ftype, f, q, level, lfoRate, lfoDepth) {
    const t = ac.currentTime, s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const fl = ac.createBiquadFilter(); fl.type = ftype; fl.frequency.value = f; fl.Q.value = q;
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + 2);
    s.connect(fl); fl.connect(g); g.connect(ambG); s.start();
    ambNodes.push(s, g);
    if (lfoRate) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = lfoRate; lg.gain.value = lfoDepth; l.connect(lg); lg.connect(g.gain); l.start(); ambNodes.push(l); }
  }
  function drone(f, level, type = 'sawtooth', lp = 220) {
    const t = ac.currentTime, o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
    o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = lp; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(level, t + 3);
    o.connect(fl); fl.connect(g); g.connect(ambG); o.start(); ambNodes.push(o, g);
  }
  const chirps = (fmin, fmax, every, dens) => ambTimers.push(setInterval(() => { if (!ok() || Math.random() > dens) return; const t = ac.currentTime; const f = fmin + Math.random() * (fmax - fmin); for (let k = 0; k < 3; k++) tone('sine', f, f * (fmin > 3000 ? 1 : 1.3), t + k * 0.07, 0.04, 0.025, ambG); }, every));
  function setAmbient(parts) {
    if (!ensure()) return;
    const key = parts.join(',');
    if (key === ambKey) return; ambKey = key;
    stopAmb();
    for (const p of parts) {
      if (p === 'sea') loopNoise('lowpass', 500, 0.6, 0.22, 0.11, 0.12);
      if (p === 'wind') loopNoise('bandpass', 450, 0.8, 0.1, 0.07, 0.06);
      if (p === 'rain') loopNoise('highpass', 1400, 0.4, 0.2);
      if (p === 'storm') { loopNoise('lowpass', 160, 0.7, 0.3, 0.05, 0.2); }
      if (p === 'crickets') chirps(4200, 4800, 900, 0.7);
      if (p === 'birds') chirps(1800, 3200, 2600, 0.5);
      if (p === 'swamp') { drone(43, 0.08, 'sine', 120); chirps(180, 260, 3000, 0.4); }
      if (p === 'hum') { drone(55, 0.08); drone(110.5, 0.04, 'sine', 400); }
      if (p === 'indoor') loopNoise('lowpass', 220, 0.5, 0.05);
    }
  }
  function ambientFor() {
    if (!G || G.dead) return [];
    const w = weather(), parts = [], L0 = LOCS[G.loc];
    if (G.room != null && LOCS[G.loc].rooms[G.room]) { parts.push('indoor'); if (/Аппарат/.test(LOCS[G.loc].rooms[G.room].n)) parts.push('hum'); }
    else {
      if (L0.water === 'sea' || G.loc === 'lighthouse') parts.push('sea');
      if (G.loc === 'swamp') parts.push('swamp');
      if (G.loc === 'nii') parts.push('hum');
      if (isNight()) parts.push('crickets'); else if (['forest', 'farm', 'village', 'meteo'].includes(G.loc)) parts.push('birds');
      parts.push('wind');
    }
    if (w.wet) parts.push('rain'); if (w.id === 'storm') parts.push('storm');
    return parts;
  }

  // ---------- музыка: тихие пэды ----------
  let musTimer = null, mood = '';
  const PROG = { calm: [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]], night: [[220, 261.6, 329.6], [146.8, 174.6, 220], [164.8, 196, 246.9], [220, 261.6, 311.1]], dread: [[110, 130.8, 155.6], [103.8, 123.5, 146.8], [116.5, 138.6, 164.8]] };
  function chord(notes, t) {
    for (const f of notes) for (const det of [-3, 3]) {
      const o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; fl.type = 'lowpass'; fl.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 2.2); g.gain.linearRampToValueAtTime(0.0001, t + 7.5);
      o.connect(fl); fl.connect(g); g.connect(musG); o.start(t); o.stop(t + 7.6);
    }
  }
  function setMood(m) {
    if (!ensure() || m === mood) return; mood = m; clearInterval(musTimer);
    let i = 0; const go = () => { if (!ok() || !music) return; const P = PROG[mood] || PROG.calm; chord(P[i++ % P.length], ac.currentTime + 0.05); };
    go(); musTimer = setInterval(go, 6000);
  }
  function moodFor() { if (!G || G.dead) return 'night'; if (isBloodNight() || G.em.warned || G.combat) return 'dread'; if (isNight() || L().zone) return 'night'; return 'calm'; }

  function refresh() { if (!ac || ac.state !== 'running') return; setAmbient(on ? ambientFor() : []); setMood(moodFor()); }
  function toggle() { on = !on; ensure(); if (master) master.gain.setTargetAtTime(on ? vol : 0, ac.currentTime, 0.05); savePrefs(); if (on && ac && ac.state === 'suspended') ac.resume(); refresh(); return on; }
  function setVol(v) { vol = Math.max(0, Math.min(1, v)); if (master && on) master.gain.setTargetAtTime(vol, ac.currentTime, 0.05); savePrefs(); }
  function toggleMusic() { music = !music; if (musG) musG.gain.setTargetAtTime(music ? 0.3 : 0, ac.currentTime, 0.1); savePrefs(); return music; }
  return { play, refresh, toggle, setVol, toggleMusic, get on() { return on; }, get vol() { return vol; }, get music() { return music; } };
})();
window.SFX = SFX;
