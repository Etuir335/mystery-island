"use strict";
const ART = /* @__PURE__ */ (() => {
  const W = 192, HH = 88;
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const hash = (s) => {
    let h = 2166136261;
    for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  };
  const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const css = (c) => "rgb(".concat(c[0] | 0, ",").concat(c[1] | 0, ",").concat(c[2] | 0, ")");
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  let g = null;
  const R = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const P = (x, y, c) => R(x, y, 1, 1, c);
  function tri(x1, y1, x2, y2, x3, y3, c) {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.lineTo(x3, y3);
    g.closePath();
    g.fill();
  }
  function disc(cx, cy, r, c) {
    for (let y = -r; y <= r; y++) {
      const w = Math.round(Math.sqrt(r * r - y * y));
      R(cx - w, cy + y, w * 2 + 1, 1, c);
    }
  }
  function line(x1, y1, x2, y2, c) {
    const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) | 0;
    for (let i = 0; i <= n; i++) P(Math.round(x1 + (x2 - x1) * i / n), Math.round(y1 + (y2 - y1) * i / n), c);
  }
  function ditherBand(y0, y1, top, bot, steps = 7) {
    const img = g.createImageData(W, Math.max(1, y1 - y0)), d = img.data, T = hex(top), B = hex(bot);
    for (let y = 0; y < y1 - y0; y++) for (let x = 0; x < W; x++) {
      const t = y / Math.max(1, y1 - y0 - 1) * (steps - 1), lo = Math.floor(t), fr = t - lo;
      const s = fr * 16 > BAYER[y & 3][x & 3] ? lo + 1 : lo;
      const c = mix(T, B, Math.min(1, s / (steps - 1))), i = (y * W + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
    g.putImageData(img, 0, y0);
  }
  function skyPal(h, f) {
    if (f.blood) return { top: "#14040a", bot: "#5a1018", night: 1 };
    if (f.emission) return { top: "#3a0820", bot: "#c2402e", night: 0 };
    if (h >= 21 || h < 5) return { top: "#070b1a", bot: "#1c2847", night: 1 };
    if (h < 7) return { top: "#2e3a6c", bot: "#f0a06a" };
    if (h < 18) return f.cloudy ? { top: "#6f8295", bot: "#b9c4cc" } : { top: "#4b84c4", bot: "#b3d6ee" };
    return { top: "#2a2b58", bot: "#ec8a56" };
  }
  function sky(h, f, rnd, t) {
    const p = skyPal(h, f), hz = f.hz;
    ditherBand(0, hz, p.top, p.bot);
    if (p.night) for (let i = 0; i < 70; i++) {
      const x = rnd() * W | 0, y = rnd() * hz * 0.85 | 0;
      P(x, y, (i + (t >> 2)) % 9 === 0 ? "#5a6488" : "#c9d2ee");
    }
    const day = h >= 6 && h < 20;
    const prog = day ? (h - 6) / 14 : (h + 24 - 20) % 24 / 10;
    const sx = 18 + prog * (W - 36), sy = hz - 8 - Math.sin(prog * Math.PI) * (hz - 18);
    if (f.blood) {
      disc(W * 0.72, 18, 11, "#7a1414");
      disc(W * 0.72, 18, 9, "#c8302a");
      P(W * 0.72 - 3, 15, "#e65a48");
    } else if (f.emission) {
      disc(W * 0.5, 14, 7, "#ff9b6a");
    } else if (!f.cloudy || !day) {
      if (day) {
        disc(sx, sy, 5, "#ffe9a8");
        disc(sx, sy, 4, "#fff6d6");
      } else {
        disc(sx, sy, 4, "#dfe6ff");
        disc(sx + 2, sy - 1, 3, p.top);
      }
    }
    const nc = f.cloudy ? 7 : 3, cc = f.night ? "#232c45" : f.cloudy ? "#8e99a5" : "#eef4fa";
    for (let i = 0; i < nc; i++) {
      const x = (rnd() * W + t * (0.15 + i * 0.03)) % (W + 40) - 20, y = 6 + rnd() * hz * 0.45;
      for (let k = 0; k < 5; k++) R(x + k * 5 - (k === 0 || k === 4 ? 0 : 2), y - (k === 2 ? 3 : k === 1 || k === 3 ? 2 : 0), 9, 4 + (k === 2 ? 3 : 1), cc);
    }
  }
  function sea(y0, y1, f, t, rnd) {
    ditherBand(y0, y1, f.night ? "#0d2236" : "#2a6a8a", f.night ? "#06111d" : "#174a63", 5);
    for (let i = 0; i < 40; i++) {
      const x = (rnd() * W + t * 0.5 * (i % 3 + 1)) % W | 0, y = y0 + 1 + rnd() * (y1 - y0 - 2) | 0;
      R(x, y, 3 + i % 3, 1, f.night ? "#22445e" : "#6fb0c8");
    }
  }
  function hills(y, col, amp, seed, step = 9) {
    const r = rng(seed);
    let hh = 0;
    for (let x = 0; x < W; x += step) {
      hh = Math.max(0, Math.min(amp, hh + (r() - 0.5) * amp));
      R(x, y - hh, step, HH - y + hh, col);
    }
  }
  function ground(y, col, col2) {
    R(0, y, W, HH - y, col);
    const r = rng(y * 7);
    for (let i = 0; i < 160; i++) P(r() * W, y + 1 + r() * (HH - y - 1), col2);
  }
  function pine(x, y, h, c, c2) {
    R(x - 1, y - 3, 2, 3, "#3a2a1c");
    for (let i = 0; i < h; i += 3) {
      const w = Math.round((h - i) * 0.45);
      R(x - w, y - 3 - i, w * 2, 3, i % 6 ? c : c2 || c);
    }
  }
  function deadTree(x, y, h, c) {
    R(x, y - h, 2, h, c);
    line(x, y - h * 0.6, x - 6, y - h * 0.9, c);
    line(x + 1, y - h * 0.45, x + 7, y - h * 0.8, c);
    line(x + 1, y - h, x + 3, y - h - 4, c);
  }
  function house(x, y, w, h, wall, roof, lit) {
    R(x, y - h, w, h, wall);
    tri(x - 2, y - h, x + w / 2, y - h - h * 0.7, x + w + 2, y - h, roof);
    const ww = lit ? "#ffd56a" : "#2b3340";
    R(x + 3, y - h + 4, 4, 4, ww);
    if (w > 16) R(x + w - 7, y - h + 4, 4, 4, ww);
    R(x + w / 2 - 2, y - 7, 4, 7, "#3a2618");
  }
  function cat(x, y, c) {
    R(x, y - 3, 5, 3, c);
    R(x + 4, y - 5, 3, 3, c);
    P(x + 4, y - 6, c);
    P(x + 6, y - 6, c);
    R(x - 2, y - 5, 1, 3, c);
    P(x - 1, y - 5, c);
  }
  function gull(x, y, c) {
    P(x, y, c);
    P(x + 1, y - 1, c);
    P(x + 2, y, c);
    P(x + 3, y - 1, c);
    P(x + 4, y, c);
  }
  function fence(y, c, gap) {
    for (let x = 0; x < W; x += 6) if (!gap || x < gap[0] || x > gap[1]) R(x, y - 6, 1, 6, c);
    R(0, y - 5, W, 1, c);
    R(0, y - 2, W, 1, c);
  }
  function rain(t, heavy, rnd) {
    const n = heavy ? 90 : 50;
    for (let i = 0; i < n; i++) {
      const x = (rnd() * W + t * 2) % W, y = (rnd() * HH + t * 7 * (1 + i % 3)) % HH;
      line(x, y, x - 1, y + 3, heavy ? "#a9c1d8" : "#8fa9c0");
    }
  }
  function fog(f, hz) {
    const c = f.night ? [90, 100, 120] : [214, 220, 222];
    for (let y = 0; y < HH; y++) {
      const a = Math.max(0, 0.42 - Math.abs(y - hz - 4) / 70);
      if (a > 0.02) {
        g.fillStyle = "rgba(".concat(c[0], ",").concat(c[1], ",").concat(c[2], ",").concat(a.toFixed(3), ")");
        g.fillRect(0, y, W, 1);
      }
    }
  }
  function haze(col, a) {
    g.fillStyle = col;
    g.globalAlpha = a;
    g.fillRect(0, 0, W, HH);
    g.globalAlpha = 1;
  }
  function sparks(t, rnd, col) {
    for (let i = 0; i < 14; i++) {
      const x = rnd() * W | 0, y = rnd() * HH + Math.sin((t + i * 7) / 6) * 3 | 0;
      if ((t + i) % 5) P(x, y, col);
    }
  }
  function campfire(x, y, t, big) {
    for (let i = 0; i < 5; i++) R(x - 5 + i * 2.5, y, 2, 2, "#6a6a62");
    R(x - 4, y - 1, 9, 1, "#4a2e1a");
    line(x - 4, y - 3, x + 4, y, "#5a3a20");
    line(x + 4, y - 3, x - 4, y, "#5a3a20");
    const fl = [[0, -2, "#ffd25a"], [-1, -4, "#ff9a3a"], [1, -5, "#ff9a3a"], [0, -7, "#e8562a"], [-2, -3, "#ffb84a"], [2, -3, "#ffb84a"]];
    fl.forEach(([dx, dy, c], i) => {
      if ((t + i) % 4 !== 0) R(x + dx - 1, y + dy - (t + i) % 2, 2, 2, c);
    });
    for (let i = 0; i < 6; i++) {
      const k = (t * 0.6 + i * 5) % 30;
      g.globalAlpha = Math.max(0, 0.45 - k / 60);
      disc(x + Math.sin((t + i * 9) / 6) * 2 + k / 6, y - 10 - k, 1 + (k / 12 | 0), "#b8b8b0");
    }
    g.globalAlpha = 1;
    g.globalAlpha = 0.16;
    disc(x, y - 3, big ? 16 : 12, "#ffb84a");
    g.globalAlpha = 1;
  }
  function smokeCol(x, y, t) {
    for (let i = 0; i < 6; i++) {
      const k = (t * 0.5 + i * 6) % 34;
      g.globalAlpha = Math.max(0, 0.5 - k / 60);
      disc(x + Math.sin((t + i * 7) / 7) * 2 + k / 5, y - k, 1 + (k / 12 | 0), "#a8a8a0");
    }
    g.globalAlpha = 1;
  }
  function baseStructs(f, t) {
    const s = typeof G !== "undefined" && G && G.w && G.w.struct || {};
    const hz = f.hz;
    if (s.radio) {
      R(38, hz - 44, 1, 16, "#3a3a3a");
      line(34, hz - 40, 42, hz - 40, "#3a3a3a");
      line(35, hz - 36, 41, hz - 36, "#3a3a3a");
      P(38, hz - 45, (t >> 2) % 2 ? "#ff3a2a" : "#5a1a14");
    }
    if (s.rain) {
      R(50, hz - 2, 8, 12, "#3a5a7a");
      R(49, hz - 3, 10, 1, "#2a4a6a");
      tri(46, hz - 12, 54, hz - 4, 62, hz - 12, "#5a7a5a");
      line(46, hz - 12, 62, hz - 12, "#3a5a3a");
    }
    if (s.garden) {
      for (let r = 0; r < 3; r++) {
        R(4, hz + 22 + r * 5, 36, 2, "#4a3220");
        for (let x = 6; x < 40; x += 5) {
          R(x, hz + 20 + r * 5, 1, 2, "#5aa040");
          P(x - 1, hz + 20 + r * 5, "#6ab84a");
          P(x + 1, hz + 19 + r * 5, "#6ab84a");
        }
      }
    }
    if (s.bench) {
      R(64, hz + 17, 18, 3, "#7a5a3a");
      R(65, hz + 20, 2, 6, "#5a3a20");
      R(79, hz + 20, 2, 6, "#5a3a20");
      R(68, hz + 15, 4, 2, "#8a8a8a");
      R(74, hz + 14, 2, 3, "#6a4a2a");
    }
    if (s.smoke) {
      R(86, hz + 14, 10, 12, "#5a4a3a");
      tri(85, hz + 14, 91, hz + 9, 97, hz + 14, "#3a2a1a");
      smokeCol(91, hz + 8, t);
    }
    if (s.distill) {
      R(100, hz + 20, 8, 6, "#8a8a84");
      R(103, hz + 15, 2, 5, "#a8a8a0");
      line(105, hz + 15, 112, hz + 20, "#c08a4a");
      line(112, hz + 20, 112, hz + 24, "#c08a4a");
      R(110, hz + 24, 5, 3, "#4a6a8a");
    }
    if (s.fire === 1) campfire(57, hz + 26, t, true);
    if (s.fire >= 2) {
      R(52, hz + 16, 12, 10, "#3a3a3a");
      R(54, hz + 19, 8, 4, (t >> 1) % 2 ? "#ff9a3a" : "#e8562a");
      R(60, hz + 4, 3, 12, "#2a2a2a");
      smokeCol(61, hz + 2, t);
    }
    if (s.walls) {
      const col = s.walls >= 3 ? "#7a7f84" : s.walls === 2 ? "#6a5a44" : "#7a5a34", top = hz + 30;
      for (let x = 0; x < 120; x += 4) {
        if (x > 44 && x < 54) continue;
        R(x, top + (x % 8 ? 1 : 0), 3, HH - top, col);
        if (s.walls >= 2 && x % 12 === 0) R(x, top + 4, 7, 5, "#8a8a8a");
      }
      if (s.walls >= 3) for (let x = 2; x < 120; x += 8) P(x, top + 3, "#c8c8c8");
      if (G.w.wallHp < 40) {
        R(20, top + 2, 4, 6, "#2a1a10");
        R(80, top + 4, 3, 5, "#2a1a10");
      }
    }
    if (s.traps) for (let x = 2; x < 118; x += 7) {
      line(x, HH - 1, x + 4, HH - 7, "#8a6a40");
      if (s.traps >= 2) line(x + 3, HH - 3, x + 7, HH - 3, "#b8b8b8");
    }
  }
  const SCENES = {
    base(f, t, r) {
      const hz = f.hz;
      sea(hz, HH, f, t, r);
      R(0, hz + 14, 70, HH - hz - 14, "#7a6a4c");
      ground(hz + 16, "#6a5c40", "#8a7a58");
      R(60, hz + 10, 132, 4, "#6b4a2a");
      for (let x = 64; x < 190; x += 12) R(x, hz + 14, 2, 12, "#4a3220");
      for (let x = 60; x < 192; x += 4) P(x, hz + 10, "#8a6440");
      R(8, hz - 14, 40, 30, "#5b4630");
      for (let y = hz - 12; y < hz + 16; y += 4) R(8, y, 40, 1, "#4a3826");
      tri(4, hz - 14, 28, hz - 30, 52, hz - 14, "#3b2c22");
      R(20, hz + 2, 10, 14, "#2a1e16");
      R(36, hz - 8, 7, 6, f.night ? "#ffcf66" : "#9fb7c4");
      R(150, hz + 3, 22, 4, "#8a3b2a");
      R(152, hz + 1, 18, 2, "#a54a35");
      R(110, hz - 10, 2, 20, "#2a2a2a");
      R(107, hz - 12, 8, 3, f.night ? "#ffe08a" : "#5a5a5a");
      if (f.night) {
        g.globalAlpha = 0.18;
        disc(111, hz - 8, 10, "#ffe08a");
        g.globalAlpha = 1;
      }
      cat(128, hz + 10, f.night ? "#0e0e12" : "#2b2622");
      gull(120 + t % 60, 14, "#f0f0f0");
      baseStructs(f, t);
    },
    beach(f, t, r) {
      const hz = f.hz;
      sea(hz, hz + 18, f, t, r);
      for (let x = 0; x < W; x += 2) P(x, hz + 18 + ((x + t) % 8 < 4 ? 0 : 1), "#e8f1f2");
      ground(hz + 19, "#d9c48c", "#c4ad72");
      R(30, hz + 30, 14, 9, "#8a6a3a");
      R(30, hz + 30, 14, 1, "#6a4e28");
      R(36, hz + 30, 1, 9, "#6a4e28");
      R(120, hz + 24, 30, 6, "#5d6b74");
      R(124, hz + 22, 22, 2, "#4a565e");
      disc(170, hz + 26, 6, "#6a6a62");
      disc(180, hz + 28, 4, "#7c7c72");
      for (let i = 0; i < 3; i++) gull(40 + i * 30 + t % 40, 12 + i * 5, "#f4f4f4");
      R(85, hz + 32, 8, 3, "#3a6a3a");
    },
    village(f, t, r) {
      const hz = f.hz;
      hills(hz + 4, "#4f6b48", 10, 3);
      ground(hz + 10, "#5b7a4a", "#6f8f5a");
      house(10, hz + 24, 24, 16, "#c9b89a", "#7a3b2a", f.night && r() < 0.8);
      house(46, hz + 22, 20, 14, "#a9b8c0", "#4a5a6a", f.night && r() < 0.4);
      house(120, hz + 26, 28, 18, "#d8c9a8", "#6a4a2a", f.night && r() < 0.9);
      house(160, hz + 21, 18, 12, "#b0a08a", "#5a3a2a", false);
      R(84, hz + 18, 10, 8, "#6a6a6a");
      R(83, hz + 14, 12, 2, "#4a3220");
      R(84, hz + 10, 1, 4, "#4a3220");
      R(93, hz + 10, 1, 4, "#4a3220");
      fence(hz + 36, "#7a6040");
    },
    forest(f, t, r) {
      const hz = f.hz;
      ground(hz, "#2c3d28", "#35482f");
      for (let i = 0; i < 26; i++) pine(r() * W, hz + 2 + r() * 4, 20 + r() * 12, "#2a4a33", "#23402c");
      R(0, hz + 22, W, HH, "#3a4f2e");
      for (let i = 0; i < 120; i++) P(r() * W, hz + 23 + r() * 16, "#4a6338");
      tri(70, HH, 96, hz + 22, 122, HH, "#6b5a3c");
      for (let i = 0; i < 9; i++) pine(r() * W, HH + 2, 34 + r() * 14, "#1a3022", "#152a1c");
    },
    farm(f, t, r) {
      const hz = f.hz;
      hills(hz + 2, "#6a7a4a", 8, 9);
      ground(hz + 8, "#8a7a3a", "#a08f48");
      for (let y = hz + 12; y < HH; y += 4) R(0, y, W, 1, "#6a5a2a");
      R(110, hz - 10, 44, 30, "#8a2a20");
      tri(106, hz - 10, 132, hz - 26, 158, hz - 10, "#5a1a14");
      R(126, hz + 6, 12, 14, "#3a1410");
      line(126, hz + 6, 138, hz + 20, "#d8c0a0");
      line(138, hz + 6, 126, hz + 20, "#d8c0a0");
      R(40, hz - 22, 3, 40, "#7a6a5a");
      const a = t * 0.05;
      for (let k = 0; k < 4; k++) {
        const an = a + k * Math.PI / 2;
        line(41, hz - 22, 41 + Math.cos(an) * 12, hz - 22 + Math.sin(an) * 12, "#c8bca8");
      }
      disc(70, hz + 14, 6, "#c9a64a");
      R(64, hz + 14, 13, 6, "#c9a64a");
      fence(hz + 30, "#6a5030");
    },
    gas(f, t, r) {
      const hz = f.hz;
      hills(hz + 2, "#59664c", 6, 4);
      ground(hz + 6, "#5a5a52", "#6a6a60");
      R(0, hz + 22, W, 12, "#36383a");
      for (let x = 0; x < W; x += 14) R(x, hz + 27, 7, 1, "#c8b54a");
      R(20, hz - 16, 100, 4, "#c8402a");
      R(24, hz - 12, 3, 22, "#bcbcbc");
      R(113, hz - 12, 3, 22, "#bcbcbc");
      R(50, hz + 2, 6, 10, "#c8402a");
      R(80, hz + 2, 6, 10, "#c8402a");
      R(51, hz + 4, 4, 2, f.night ? "#ff6a4a" : "#ffd0c0");
      R(130, hz - 8, 50, 20, "#d8d0c0");
      R(136, hz - 2, 14, 8, f.night ? "#ffd56a" : "#56707e");
      R(160, hz - 2, 12, 14, "#4a3a2a");
      R(130, hz - 12, 50, 4, "#c8402a");
      R(150, hz + 26, 26, 7, "#3a5a8a");
      R(154, hz + 22, 16, 4, "#2a4a7a");
      disc(155, hz + 33, 2, "#111");
      disc(171, hz + 33, 2, "#111");
    },
    post(f, t, r) {
      const hz = f.hz;
      hills(hz + 2, "#4a5a44", 6, 8);
      ground(hz + 6, "#6a6a5a", "#7a7a68");
      R(140, hz - 34, 4, 40, "#4a4a3a");
      R(158, hz - 34, 4, 40, "#4a4a3a");
      R(136, hz - 42, 30, 10, "#5a5a48");
      tri(134, hz - 42, 151, hz - 52, 168, hz - 42, "#3a3a2c");
      R(142, hz - 39, 18, 4, "#20241c");
      if (f.night) {
        g.globalAlpha = 0.15;
        tri(151, hz - 38, 60, HH, 110, HH, "#fff6c0");
        g.globalAlpha = 1;
      }
      for (let x = 0; x < W; x += 10) R(x, hz + 2, 1, 14, "#8a8a80");
      for (let x = 0; x < W; x += 2) P(x, hz + 3 + (x % 4 === 0 ? 1 : 0), "#9a9a90");
      R(0, hz + 8, W, 1, "#8a8a80");
      R(40, hz + 10, 50, 3, "#d8d8d0");
      for (let x = 40; x < 90; x += 8) R(x, hz + 10, 4, 3, "#c8302a");
      R(10, hz + 16, 28, 8, "#9a9a90");
      R(100, hz + 18, 26, 8, "#9a9a90");
      R(60, hz + 22, 30, 12, "#4a5a3a");
      tri(58, hz + 22, 75, hz + 12, 92, hz + 22, "#3a4a2c");
    },
    lighthouse(f, t, r) {
      const hz = f.hz;
      sea(hz, HH, f, t, r);
      tri(100, HH, 150, hz - 6, W + 30, HH, "#4a4a44");
      tri(120, HH, 160, hz + 2, W, HH, "#5a5a52");
      R(150, hz - 46, 14, 42, "#e8e2d8");
      for (let y = hz - 40; y < hz - 4; y += 12) R(150, y, 14, 5, "#b8302a");
      R(147, hz - 52, 20, 6, "#2a2a2a");
      R(151, hz - 58, 12, 6, f.night ? "#ffe9a0" : "#9ab8c8");
      tri(147, hz - 58, 157, hz - 64, 167, hz - 58, "#2a2a2a");
      if (f.night || f.cloudy) {
        const sw = Math.sin(t / 10);
        g.globalAlpha = 0.22;
        tri(157, hz - 55, 157 + sw * 190, hz - 70, 157 + sw * 190, hz - 30, "#fff4b0");
        g.globalAlpha = 1;
      }
      R(130, hz - 2, 16, 10, "#7a6a5a");
      tri(128, hz - 2, 138, hz - 10, 148, hz - 2, "#4a3a2a");
    },
    meteo(f, t, r) {
      const hz = f.hz;
      hills(hz + 6, "#4f5f4a", 18, 21, 6);
      ground(hz + 14, "#56664a", "#62744f");
      R(60, hz - 6, 44, 20, "#c8c4b8");
      R(58, hz - 8, 48, 3, "#7a7a74");
      R(66, hz, 8, 6, f.night ? "#9af0c8" : "#4a6a7a");
      R(90, hz, 8, 6, "#4a6a7a");
      R(78, hz + 4, 8, 10, "#3a3a3a");
      R(130, hz - 48, 2, 60, "#8a8a84");
      for (let y = hz - 46; y < hz + 10; y += 8) {
        line(126, y, 134, y + 8, "#8a8a84");
        line(134, y, 126, y + 8, "#8a8a84");
      }
      P(131, hz - 49, (t >> 2) % 2 ? "#ff3a2a" : "#5a1a14");
      disc(40, hz - 8, 8, "#d8d8d0");
      disc(42, hz - 9, 6, "#b8b8b0");
      R(39, hz - 2, 2, 16, "#8a8a84");
      line(150, hz - 10, 158, hz - 16, "#8a8a84");
    },
    swamp(f, t, r) {
      const hz = f.hz;
      ground(hz, "#2e3a26", "#3a4a2e");
      ditherBand(hz + 14, HH, "#3a4a2a", "#1a2414", 4);
      for (let i = 0; i < 30; i++) R(r() * W, hz + 16 + r() * 30, 6 + r() * 8, 1, "#4a5a2e");
      for (let i = 0; i < 7; i++) deadTree(10 + i * 27 + r() * 10, hz + 14 + r() * 12, 18 + r() * 14, "#2a221a");
      R(120, hz + 20, 50, 10, "#6a3a22");
      R(126, hz + 14, 20, 6, "#5a2e1a");
      R(150, hz + 8, 3, 12, "#4a2a18");
      sparks(t, r, "#b7ff8a");
      haze("#7aa83a", 0.12);
    },
    reef(f, t, r) {
      SCENES.beach(f, t, r);
      const hz = f.hz;
      R(150, hz - 34, 5, 34, "#3a4a5a");
      R(151, hz - 40, 3, 6, "#7ad8ff");
      for (let i = 0; i < 4; i++) line(152, hz - 40, 152 + Math.cos(t / 6 + i * 1.6) * 14, hz - 40 + Math.sin(t / 6 + i * 1.6) * 8, "rgba(122,216,255,0.55)");
      sparks(t, r, "#9ae0ff");
    },
    wreck(f, t, r) {
      const hz = f.hz;
      sea(hz, HH, f, t, r);
      tri(20, hz + 22, 30, hz - 4, 176, hz + 6, "#6a3a2a");
      R(30, hz - 4, 146, 10, "#7a4430");
      R(30, hz + 6, 146, 14, "#5a2e22");
      for (let x = 34; x < 176; x += 9) R(x, hz + 8, 2, 10, "#4a2418");
      for (let x = 40; x < 170; x += 11) P(x, hz, "#c06a3a");
      R(40, hz - 2, 120, 1, "#b04a2a");
      R(130, hz - 30, 30, 26, "#d8d0c4");
      R(134, hz - 26, 6, 5, f.night ? "#3a3a2a" : "#4a6a7a");
      R(144, hz - 26, 6, 5, "#4a6a7a");
      R(140, hz - 40, 4, 10, "#3a3a3a");
      R(56, hz - 36, 2, 32, "#5a5a5a");
      line(57, hz - 34, 90, hz - 6, "#5a5a5a");
      R(70, hz - 12, 20, 8, "#3a6a8a");
      R(94, hz - 12, 20, 8, "#8a3a2a");
      for (let i = 0; i < 2; i++) gull(30 + i * 60 + t % 50, 10 + i * 6, "#f0f0f0");
      haze("#2a4a5a", 0.06);
    },
    mine(f, t, r) {
      const hz = f.hz;
      hills(hz + 4, "#5a5a4e", 22, 31, 6);
      ground(hz + 10, "#5a5248", "#6a6256");
      tri(40, hz + 12, 100, hz - 40, 170, hz + 12, "#4a443c");
      R(84, hz - 10, 34, 24, "#120e0c");
      R(80, hz - 14, 42, 4, "#6a4a2a");
      R(80, hz - 14, 4, 28, "#6a4a2a");
      R(118, hz - 14, 4, 28, "#6a4a2a");
      for (let x = 60; x < 150; x += 6) R(x, hz + 26, 4, 2, "#5a3a20");
      R(56, hz + 24, 100, 1, "#8a8a8a");
      R(56, hz + 29, 100, 1, "#8a8a8a");
      R(30, hz + 16, 22, 10, "#6a5a4a");
      R(28, hz + 14, 26, 3, "#4a3a2a");
      disc(34, hz + 27, 2, "#222");
      disc(48, hz + 27, 2, "#222");
      R(150, hz - 20, 3, 36, "#5a4a3a");
      R(146, hz - 22, 11, 4, "#8a7a5a");
      if (f.night || (t >> 3) % 3 === 0) {
        g.globalAlpha = 0.25;
        disc(100, hz + 4, 6, "#7ad8ff");
        g.globalAlpha = 1;
      }
    },
    prison(f, t, r) {
      const hz = f.hz;
      hills(hz + 2, "#4a5446", 6, 41);
      ground(hz + 6, "#5a5a52", "#66665c");
      R(0, hz - 14, W, 22, "#8a8680");
      for (let x = 0; x < W; x += 16) R(x, hz - 14, 1, 22, "#7a7670");
      R(0, hz - 16, W, 2, "#6a6660");
      for (let x = 0; x < W; x += 3) P(x, hz - 18 + (x % 6 ? 0 : 1), "#9a9a9a");
      for (const tx of [20, 170]) {
        R(tx, hz - 46, 4, 34, "#5a5650");
        R(tx + 8, hz - 46, 4, 34, "#5a5650");
        R(tx - 4, hz - 54, 20, 10, "#6a6660");
        tri(tx - 6, hz - 54, tx + 6, hz - 62, tx + 18, hz - 54, "#3a3632");
        R(tx, hz - 51, 12, 4, f.night && (t >> 4) % 2 ? "#ffe9a0" : "#20241c");
      }
      R(80, hz - 10, 40, 18, "#3a3632");
      for (let x = 82; x < 120; x += 4) R(x, hz - 8, 1, 16, "#9a9a9a");
      if (f.night) {
        const sw = Math.sin(t / 12);
        g.globalAlpha = 0.16;
        tri(26, hz - 48, 26 + 80 + sw * 60, HH, 26 + 120 + sw * 60, HH, "#fff6c0");
        g.globalAlpha = 1;
      }
      R(50, hz + 14, 3, 14, "#6a6a6a");
      R(46, hz + 12, 11, 3, "#c8302a");
    },
    depths(f, t, r) {
      const hz = f.hz;
      R(0, 0, W, HH, "#14181c");
      for (let x = 0; x < W; x += 24) {
        R(x, 0, 2, HH, "#20262c");
      }
      R(0, hz + 14, W, HH - hz - 14, "#1c2024");
      for (let x = 0; x < W; x += 8) R(x, hz + 14, 4, 1, "#2a3036");
      tri(60, hz + 14, 96, hz - 30, 132, hz + 14, "#0c0e10");
      R(84, hz - 20, 24, 34, "#08090a");
      for (let i = 0; i < 5; i++) {
        const x = 16 + i * 40, on = (t + i * 5) % 30 > 4;
        R(x, 6, 8, 3, on ? "#ff5a3a" : "#4a1a12");
        if (on) {
          g.globalAlpha = 0.15;
          disc(x + 4, 10, 14, "#ff5a3a");
          g.globalAlpha = 1;
        }
      }
      const pul = 0.2 + 0.15 * Math.sin(t / 5);
      g.globalAlpha = pul;
      disc(96, hz + 6, 18, "#7ad8ff");
      g.globalAlpha = 1;
      sparks(t, r, "#7ad8ff");
      R(20, hz + 4, 14, 10, "#2a2e34");
      R(150, hz, 20, 14, "#2a2e34");
      R(154, hz + 3, 12, 4, "#4a6a7a");
    },
    nii(f, t, r) {
      const hz = f.hz;
      ground(hz + 4, "#4a4a46", "#58584f");
      R(30, hz - 40, 130, 46, "#8c8a84");
      for (let y = hz - 34; y < hz; y += 9) for (let x = 38; x < 155; x += 12) R(x, y, 7, 5, x * y % 7 === 0 && f.night ? "#6ac8ff" : "#2a2e34");
      R(30, hz - 44, 130, 4, "#6a6864");
      R(84, hz - 6, 22, 12, "#2a2e34");
      const pul = 0.25 + 0.15 * Math.sin(t / 4);
      g.globalAlpha = pul;
      R(91, 0, 8, hz - 40, "#7ad8ff");
      disc(95, hz - 44, 10, "#7ad8ff");
      g.globalAlpha = 1;
      for (let x = 0; x < W; x += 8) R(x, hz + 12, 1, 12, "#5a5a56");
      R(0, hz + 14, W, 1, "#6a6a66");
      sparks(t, r, "#9ae0ff");
      haze("#5a3a9a", 0.1);
    }
  };
  function roomKind(n) {
    n = n.toLowerCase();
    if (/аппарат/.test(n)) return "app";
    if (/лаборат|бункер|радиоруб|проходн/.test(n)) return "lab";
    if (/казарм|склад|оружей|кпп/.test(n)) return "mil";
    if (/магазин|касс|кладов/.test(n)) return "shop";
    if (/дом|часовн|подвал|подсобк|нижний|фонарн|гараж|мастерск/.test(n)) return "house";
    return null;
  }
  function interior(kind, f, t, r) {
    const wall = { lab: "#9aa8a8", mil: "#6a705a", shop: "#b8a88a", house: "#8a6a4c", app: "#1a1a2a" }[kind], floor = { lab: "#6a7474", mil: "#4a4a3c", shop: "#7a6a5a", house: "#5a4030", app: "#101018" }[kind];
    R(0, 0, W, HH, wall);
    for (let x = 0; x < W; x += 16) R(x, 0, 1, 60, "rgba(0,0,0,0.12)");
    R(0, 60, W, HH - 60, floor);
    for (let x = 0; x < W; x += 12) R(x, 60, 1, HH - 60, "rgba(0,0,0,0.18)");
    R(0, 60, W, 2, "rgba(0,0,0,0.3)");
    if (kind !== "app" && kind !== "mil") {
      R(80, 14, 30, 22, "#2a2a2a");
      const sp = skyPal(f.hour, f);
      const gr = g.createLinearGradient(0, 16, 0, 34);
      gr.addColorStop(0, sp.top);
      gr.addColorStop(1, sp.bot);
      g.fillStyle = gr;
      g.fillRect(82, 16, 26, 18);
      if (f.wet) for (let i = 0; i < 8; i++) R(83 + (i * 7 + t) % 24, 17 + (i * 5 + t * 3) % 15, 1, 2, "#a9c1d8");
      R(94, 14, 2, 22, "#2a2a2a");
      R(80, 24, 30, 2, "#2a2a2a");
    }
    if (kind === "shop") {
      for (let s = 0; s < 2; s++) {
        const x = s ? 130 : 12;
        R(x, 22, 48, 40, "#5a4030");
        for (let y = 26; y < 62; y += 9) {
          R(x, y, 48, 2, "#3a2818");
          for (let i = 0; i < 6; i++) if (r() < 0.55) R(x + 3 + i * 7, y - 5, 5, 5, ["#c8402a", "#d8b84a", "#4a8ac8", "#6ab84a"][i % 4]);
        }
      }
      R(124, 48, 24, 14, "#3a2818");
    }
    if (kind === "house") {
      R(14, 46, 40, 14, "#7a3a2a");
      R(14, 42, 10, 6, "#d8d0c0");
      R(130, 40, 30, 4, "#5a3a20");
      R(132, 44, 2, 16, "#5a3a20");
      R(156, 44, 2, 16, "#5a3a20");
      R(166, 20, 16, 40, "#4a2e1c");
      R(173, 38, 2, 2, "#c8a84a");
      if (r() < 0.5) R(60, 64, 30, 2, "#3a1a10");
    }
    if (kind === "mil") {
      for (let i = 0; i < 5; i++) {
        R(10 + i * 18, 18, 14, 42, "#4a5a3a");
        R(11 + i * 18, 19, 12, 18, "#3a4a2c");
        R(20 + i * 18, 38, 2, 2, "#aaa");
      }
      R(120, 44, 24, 16, "#5a6a3a");
      R(120, 44, 24, 2, "#3a4a2a");
      R(148, 48, 20, 12, "#5a6a3a");
      R(130, 34, 22, 10, "#4a5a32");
      P(132, 38, "#c8c8a0");
    }
    if (kind === "lab") {
      R(16, 42, 60, 4, "#d8dcdc");
      R(18, 46, 2, 14, "#8a9090");
      R(72, 46, 2, 14, "#8a9090");
      R(26, 34, 6, 8, "#5ab8a0");
      R(40, 36, 4, 6, "#c86a6a");
      R(130, 26, 40, 22, "#2a3034");
      R(133, 29, 34, 16, (t >> 3) % 2 ? "#3ac88a" : "#2aa070");
      for (let i = 0; i < 4; i++) R(135, 31 + i * 3, 10 + (i * 7 + t) % 20, 1, "#a8ffd8");
      R(146, 48, 8, 12, "#4a5054");
    }
    if (kind === "app") {
      const pul = 0.5 + 0.3 * Math.sin(t / 3);
      for (let i = 0; i < 6; i++) R(20 + i * 30, 8, 3, 54, "#2a2a3c");
      R(60, 20, 72, 42, "#3a3a50");
      R(66, 26, 60, 30, "#22223a");
      g.globalAlpha = pul;
      disc(96, 41, 11, "#7ad8ff");
      g.globalAlpha = 1;
      disc(96, 41, 5, "#e8fbff");
      for (let i = 0; i < 5; i++) line(96, 41, 96 + Math.cos(t / 8 + i) * 40, 41 + Math.sin(t / 8 + i) * 18, "rgba(122,216,255,0.6)");
      sparks(t, r, "#9ae0ff");
    }
  }
  function frameFlags(spec) {
    const h = G ? hour() : 19, w = G ? weather() : { id: "clear" };
    return {
      hour: h,
      night: h >= 21 || h < 5,
      cloudy: ["cloud", "rain", "storm", "fog"].includes(w.id),
      wet: w.wet || 0,
      fog: w.id === "fog",
      storm: w.id === "storm",
      winter: G && typeof season === "function" ? season() === 1 : false,
      snowing: G ? G.weather.id === "snow" : false,
      blood: G ? isBloodNight() : false,
      emission: G ? G.em.warned : false,
      hz: 50
    };
  }
  function paint(cv, spec, t) {
    g = cv.getContext("2d");
    g.imageSmoothingEnabled = false;
    const f = spec.title ? { hour: 19, night: false, cloudy: false, hz: 50 } : frameFlags(spec);
    const r = rng(hash(spec.key || "x"));
    const kind = spec.room ? roomKind(spec.room) : null;
    if (kind) {
      interior(kind, f, t, r);
      if (f.night && kind !== "app") haze("#0a1030", 0.35);
    } else {
      sky(f.hour, f, r, t);
      (SCENES[spec.loc] || SCENES.base)(f, t, r);
      if (spec.camp && spec.loc !== "base") campfire(34, HH - 10, t, false);
      if (f.night) haze("#0a1030", 0.28);
      if (f.fog) fog(f, f.hz);
      if (f.wet) rain(t, f.storm, rng(7));
      if (f.winter) {
        haze("#eef4ff", f.night ? 0.06 : 0.16);
        const sr = rng(11);
        for (let i = 0; i < (f.snowing ? 120 : 35); i++) {
          const x = (sr() * W + Math.sin((t + i) / 9) * 6) % W, y = (sr() * HH + t * (0.6 + i % 3 * 0.4)) % HH;
          P(x, y, "#ffffff");
        }
      }
      if (f.storm && t > 0 && t % 41 === 40) haze("#ffffff", 0.45);
      if (f.blood) haze("#a01020", 0.18);
      if (f.emission) haze("#ff3a2a", 0.12 + 0.06 * Math.sin(t / 3));
    }
    if (spec.title) {
      haze("#000", 0.15);
    }
  }
  let tick = 0, timer = null;
  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function paintAll(root) {
    const list = (root || document).querySelectorAll("canvas[data-scene]");
    list.forEach((cv) => {
      try {
        paint(cv, JSON.parse(cv.dataset.scene), tick);
      } catch (e) {
        console.warn(e);
      }
    });
    clearInterval(timer);
    if (list.length && !reduce()) timer = setInterval(() => {
      tick++;
      document.querySelectorAll("canvas[data-scene]").forEach((cv) => {
        if (cv.isConnected) try {
          paint(cv, JSON.parse(cv.dataset.scene), tick);
        } catch (e) {
        }
      });
    }, 160);
  }
  const sceneTag = (spec) => '<canvas class="scene" width="'.concat(W, '" height="').concat(HH, "\" data-scene='").concat(JSON.stringify(spec).replace(/'/g, "&#39;"), '\' role="img" aria-label="').concat((spec.alt || "Иллюстрация").replace(/"/g, ""), '"></canvas>');
  const SPR = {
    zombie: { p: { a: "#7fa36a", b: "#e04030", c: "#2a1a14", d: "#5a6a7a", e: "#8a3a2a", f: "#3a3a4a", g: "#2a2420" }, m: [
      "......aaaa......",
      ".....aaaaaa.....",
      ".....abaaba.....",
      ".....aaaaaa.....",
      "......acca......",
      ".......aa.......",
      "....dddddddd....",
      "..aadddeddddaa..",
      ".aa.dddddedd.aa.",
      "a...dddddddd...a",
      "....ddeddddd....",
      "....ffffffff....",
      "....fff..fff....",
      "....ff....ff....",
      "....ff....ff....",
      "...ggg....ggg..."
    ] },
    runner: { p: { a: "#8aab6a", b: "#ff4a2a", c: "#2a1a14", d: "#7a4a3a", f: "#2a2a3a", g: "#1a1414" }, m: [
      ".......aaaa.....",
      "......aaaaaa....",
      "......abaaba....",
      "......aaacca....",
      ".......aaaa.....",
      "....dddddd......",
      "..aaddddddda....",
      ".a..ddddddd.aa..",
      "....ddddddd...a.",
      "....ffffff......",
      "...fff..fff.....",
      "..ff.....ff.....",
      ".ff.......ff....",
      "ff.........f....",
      "gg.........gg...",
      "................"
    ] },
    drowned: { p: { a: "#6a9aa8", b: "#ffffff", c: "#1a2a30", d: "#3a5a4a", e: "#2a8a5a", f: "#2a3a44", g: "#1a2428" }, m: [
      "......aaaa......",
      ".....aeaaea.....",
      ".....abaaba.....",
      ".....aaaaaa.....",
      "......acca......",
      ".......aa.......",
      "....dddddddd....",
      "..aaddeddeddaa..",
      ".ae.dddddddd.ea.",
      "a...ddeddedd...a",
      "....dddddddd....",
      "....ffffffff....",
      "....fff..fff....",
      "....ff....ff....",
      "....fe....ef....",
      "...ggg....ggg..."
    ] },
    soldier: { p: { a: "#7a9a6a", b: "#e04030", c: "#2a1a14", d: "#4a5a32", e: "#3a4826", h: "#3a4a2a", f: "#2a3220", g: "#1a1a14" }, m: [
      ".....hhhhhh.....",
      "....hhhhhhhh....",
      ".....abaaba.....",
      ".....aaaaaa.....",
      "......acca......",
      ".......aa.......",
      "....dddddddd....",
      "..aaddeddeddaa..",
      ".aa.dddddddd.aa.",
      "a...eeeeeeee...a",
      "....dddddddd....",
      "....ffffffff....",
      "....fff..fff....",
      "....ff....ff....",
      "....ff....ff....",
      "...ggg....ggg..."
    ] },
    dog: { p: { a: "#7a6248", b: "#ffcc4a", c: "#1a1210", d: "#5a4632" }, m: [
      "................",
      "................",
      "................",
      "..........aa....",
      ".........aaaa...",
      ".........abaac..",
      "d.......aaaaa...",
      ".daaaaaaaaaa....",
      "..aaaaaaaaaa....",
      "..aaaaaaaaa.....",
      "..a.a....a.a....",
      "..a.a....a.a....",
      ".aa.aa..aa.aa...",
      "................",
      "................",
      "................"
    ] },
    pdog: { p: { a: "#6a5a6a", b: "#ff3a3a", c: "#2a1a24", d: "#8a7a8a", e: "#4a3a4a" }, m: [
      "................",
      "................",
      "..........aaa...",
      ".........aaaaa..",
      "........aabaaac.",
      "........aaaaaa..",
      "e......aaccaa...",
      ".eaaaaaaaaaa....",
      ".aadaadaadaa....",
      ".aaaaaaaaaaa....",
      "..aaaaaaaaa.....",
      "..a.a....a.a....",
      "..a.a....a.a....",
      ".aa.aa..aa.aa...",
      "................",
      "................"
    ] },
    raider: { p: { a: "#2a2a30", b: "#ffffff", c: "#c89a7a", d: "#3a3a42", e: "#7a2a2a", f: "#1e1e24", g: "#121214", w: "#8a8a8a" }, m: [
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      "....aaccccaa....",
      "....acbccbca....",
      "....aeeeeeea....",
      ".....aaaaaa.....",
      "....dddddddd....",
      "...ddddddddddww.",
      "..dd.dddddd.ddw.",
      "..c..dddddd..c..",
      ".....dddddd.....",
      ".....ffffff.....",
      ".....ff..ff.....",
      ".....ff..ff.....",
      ".....ff..ff.....",
      "....ggg..ggg...."
    ] },
    sci: { p: { a: "#9ab88a", b: "#e04030", c: "#2a1a14", d: "#e8e8e2", e: "#b8b8b2", f: "#3a3a4a", g: "#2a2420", k: "#2a2a2a" }, m: [
      "......aaaa......",
      ".....aaaaaa.....",
      ".....kbkkbk.....",
      ".....aaaaaa.....",
      "......acca......",
      ".......aa.......",
      "....dddddddd....",
      "..aaddddddddaa..",
      ".aa.dddeeddd.aa.",
      "a...dddddddd...a",
      "....dddddddd....",
      "....dddddddd....",
      "....fff..fff....",
      "....ff....ff....",
      "....ff....ff....",
      "...ggg....ggg..."
    ] },
    swamper: { p: { a: "#3a4a2a", b: "#ffdd3a", c: "#8a3a3a", d: "#2a3820", e: "#5a6a3a" }, m: [
      "................",
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      "...aabaaaabaa...",
      "...aaaaaaaaaa...",
      "...aaccccccaa...",
      "..eaacaccacaae..",
      ".eaaaaaaaaaaaae.",
      "ea.aaadaadaaa.ae",
      "e..aaaaaaaaaa..e",
      "e..aadaaaadaa..e",
      "...aaaaaaaaaa...",
      "...aaa....aaa...",
      "..aaa......aaa..",
      ".dd..........dd.",
      "................"
    ] },
    crys: { p: { a: "#4aa8d8", b: "#e8fbff", c: "#2a6a9a", d: "#7ad8ff" }, m: [
      ".......d........",
      "......dad.......",
      ".....daaad......",
      "....daabaad.....",
      ".....aaaaa......",
      "...c.aabaa.c....",
      "..ca.aaaaa.ac...",
      ".caa.aaaaa.aac..",
      "..c..caaac..c...",
      ".....caaac......",
      "....ccaaacc.....",
      "....ca...ac.....",
      "...cca...acc....",
      "...ca.....ac....",
      "..dd.......dd...",
      "................"
    ] },
    keeper: { p: { a: "#2a5a8a", b: "#9ae8ff", c: "#1a3a5a", d: "#4aa8d8", e: "#ffffff" }, m: [
      "...d...dd...d...",
      "...dd.dbbd.dd...",
      "....ddabbadd....",
      "....aaaaaaaa....",
      "....abeaaeba....",
      "....aaaaaaaa....",
      ".dccaaabbaaaccd.",
      "dcaaaabeebaaaacd",
      "ca..aabeebaa..ac",
      "ca..aaabbaaa..ac",
      "dd..aaaaaaaa..dd",
      "....adaaaada....",
      "....aaa..aaa....",
      "...daaa..aaad...",
      "...cccc..cccc...",
      "................"
    ] },
    guard: { p: { a: "#6a6a74", b: "#7ad8ff", c: "#4a4a54", d: "#8a8a94", e: "#e8fbff" }, m: [
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      "....abbaabba....",
      "....aaaaaaaa....",
      "..cccaaaaaaccc..",
      ".ccaaaaaaaaaacc.",
      "ccaaaabbbbaaaacc",
      "ca..aabeebaa..ac",
      "ca..aabeebaa..ac",
      "da..aaabbaaa..ad",
      "dd..aaaaaaaa..dd",
      "....aaaccaaa....",
      "....aaa..aaa....",
      "...aaaa..aaaa...",
      "...cccc..cccc...",
      "................"
    ] }
  };
  const sprCache = {};
  function enemy(id) {
    if (sprCache[id]) return sprCache[id];
    const S = SPR[id] || ENEMY[id] && SPR[ENEMY[id].spr] || SPR.zombie, cv = document.createElement("canvas");
    cv.width = 16;
    cv.height = 16;
    const x = cv.getContext("2d");
    S.m.forEach((row, y) => [...row].forEach((ch, i) => {
      if (ch !== "." && S.p[ch]) {
        x.fillStyle = S.p[ch];
        x.fillRect(i, y, 1, 1);
      }
    }));
    return sprCache[id] = cv.toDataURL();
  }
  const enemyImg = (id, cls = "") => '<img class="spr '.concat(cls, '" src="').concat(enemy(id), '" alt="').concat(ENEMY[id] ? ENEMY[id].n : "", '" width="32" height="32">');
  const mapCache = {};
  function mapBg(islandPath, reef) {
    const ck = reef ? "r" : "n";
    if (mapCache[ck]) return mapCache[ck];
    const S = 2, cv = document.createElement("canvas");
    cv.width = 100 * S;
    cv.height = 100 * S;
    const x = cv.getContext("2d");
    x.imageSmoothingEnabled = false;
    const r = rng(42);
    x.fillStyle = "#2d5f78";
    x.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < 900; i++) {
      x.fillStyle = r() < 0.5 ? "#346b86" : "#27556c";
      x.fillRect(r() * cv.width | 0, r() * cv.height | 0, 2 + (r() * 3 | 0), 1);
    }
    x.save();
    x.scale(S, S);
    const p = new Path2D(islandPath);
    x.lineWidth = 3.2;
    x.strokeStyle = "#4f8aa0";
    x.stroke(p);
    x.lineWidth = 1.6;
    x.strokeStyle = "#d8c48a";
    x.stroke(p);
    x.fillStyle = "#7d9a5a";
    x.fill(p);
    x.restore();
    x.save();
    x.scale(S, S);
    x.clip(new Path2D(islandPath));
    const blob = (cx, cy, rr, cols, n) => {
      for (let i = 0; i < n; i++) {
        const a = r() * 6.28, d = Math.sqrt(r()) * rr;
        x.fillStyle = cols[i % cols.length];
        x.fillRect(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d), 1, 1);
      }
    };
    for (let i = 0; i < 1400; i++) {
      x.fillStyle = r() < 0.5 ? "#86a362" : "#6f8c50";
      x.fillRect(r() * 100 | 0, r() * 100 | 0, 1, 1);
    }
    blob(40, 50, 14, ["#3f6a3a", "#355c32", "#4a7a40"], 520);
    blob(30, 40, 9, ["#3f6a3a", "#355c32"], 200);
    blob(64, 32, 11, ["#5a6a3a", "#6a5a7a", "#4a5a30", "#8aa040"], 380);
    blob(68, 64, 8, ["#c2a85a", "#b8984a", "#a8883a"], 260);
    blob(84, 18, 8, ["#8a8a84", "#6a6a66"], 160);
    blob(86, 50, 6, ["#6a6a5a", "#5a5a4a"], 120);
    x.restore();
    x.save();
    x.scale(S, S);
    x.strokeStyle = "rgba(120,96,60,0.55)";
    x.lineWidth = 1;
    const done = /* @__PURE__ */ new Set();
    for (const a in LOCS) for (const b in LOCS[a].links) {
      if (LOCS[a].ch2 || LOCS[b].ch2) continue;
      const k = [a, b].sort().join();
      if (done.has(k)) continue;
      done.add(k);
      x.beginPath();
      x.moveTo(LOCS[a].x, LOCS[a].y);
      const mx = (LOCS[a].x + LOCS[b].x) / 2 + (r() - 0.5) * 6, my = (LOCS[a].y + LOCS[b].y) / 2 + (r() - 0.5) * 6;
      x.quadraticCurveTo(mx, my, LOCS[b].x, LOCS[b].y);
      x.stroke();
    }
    x.restore();
    if (reef) {
      x.save();
      x.scale(S, S);
      const L8 = LOCS.reef;
      x.fillStyle = "#d8c48a";
      x.beginPath();
      x.ellipse(L8.x, L8.y, 6, 4.2, -0.3, 0, 6.3);
      x.fill();
      x.fillStyle = "#5a6a5a";
      x.beginPath();
      x.ellipse(L8.x, L8.y, 4.6, 3, -0.3, 0, 6.3);
      x.fill();
      x.fillStyle = "#7ad8ff";
      x.fillRect(L8.x + 2, L8.y - 4, 1, 4);
      x.restore();
    }
    return mapCache[ck] = cv.toDataURL();
  }
  const CAT_BG = { food: "#6a8a3a", drink: "#3a7a9a", med: "#a83a3a", melee: "#7a6a5a", gun: "#4a4a52", ammo: "#7a6a2a", wear: "#5a5a7a", art: "#7a4ab0", tool: "#5a6a6a", mat: "#7a5a3a", val: "#b08a2a", key: "#a8862a", quest: "#2a7a6a", bp: "#3a5a8a" };
  const tile = (id) => '<span class="tile" style="--tc:'.concat(CAT_BG[ITEMS[id].c] || "#666", '">').concat(ITEMS[id].ic, "</span>");
  return { paintAll, sceneTag, enemy, enemyImg, mapBg, tile, W, H: HH };
})();
window.ART = ART;
