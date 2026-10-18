'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — движок
// =====================================================================
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const RF = (a, b) => a + Math.random() * (b - a);
const ch = p => Math.random() < p;
const pick = a => a[Math.floor(Math.random() * a.length)];
const wpick = arr => { let s = arr.reduce((a, x) => a + x[1], 0), r = Math.random() * s; for (const x of arr) { r -= x[1]; if (r < 0) return x[0]; } return arr[0][0]; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const H = 60, DAY = 1440;

let G = null;
const SND = n => { if (window.SFX) SFX.play(n); };
const setAct = t => { if (G) { G.act = t; G.actAt = G.time; } };
const FEED = t => { if (G && G.coop && window.COOP) COOP.feed(t); };
const roomName = () => G.room != null && LOCS[G.loc].rooms[G.room] ? LOCS[G.loc].rooms[G.room].n : '';
// слоты сохранений: 1 — старый ключ (совместимость), 2 и 3 — новые
const slotKey = n => n === 1 ? 'moti3_save' : 'moti3_save_' + n;
var SAVE_SLOT = (() => { try { return [1, 2, 3].includes(+localStorage.getItem('moti3_slot')) ? +localStorage.getItem('moti3_slot') : 1; } catch (e) { return 1; } })();
var SAVE_KEY = slotKey(SAVE_SLOT);
function slotInfo(n) { try { const s = JSON.parse(localStorage.getItem(slotKey(n))); if (!s || s.v !== 3) return null; return { name: s.ch && s.ch.name, mode: s.mode, day: Math.floor(s.time / DAY) + 1, dead: !!s.dead, coop: s.coop ? s.coop.code : null, gen: s.w && s.w.gen }; } catch (e) { return null; } }
function setSlot(n) { if (G && !G.dead) save(); SAVE_SLOT = n; SAVE_KEY = slotKey(n); try { localStorage.setItem('moti3_slot', String(n)); } catch (e) {} G = null; }
const F = () => MODES[G.mode].f;
const IT = id => ITEMS[id];
const L = id => LOCS[id || G.loc];

// ---------------- время ----------------
const day = () => Math.floor(G.time / DAY) + 1;
const hour = () => Math.floor((G.time % DAY) / H);
const clock = () => { const m = G.time % DAY; return String(Math.floor(m / H)).padStart(2, '0') + ':' + String(m % H).padStart(2, '0'); };
const isNight = () => { const h = hour(); return h >= 21 || h < 6; };
const isBloodNight = () => day() % 7 === 0 && (hour() >= 22) || (day() % 7 === 1 && day() > 1 && hour() < 4);
const weather = () => WEATHER.find(w => w.id === G.weather.id);
const inShelter = () => !!(L().shelter && !G.traveling);
// в кооперативе мировые события и производство считает только «ведущий» игрок
const worldAuth = () => !(G && G.coop && window.COOP) || COOP.isAuth();
const CH2 = () => !!(typeof G !== 'undefined' && G && G.w && G.w.ch2);
const boatReady = () => (G.w.struct.boat || 0) >= 2;
const artPool = () => CH2() ? [['medusa', 3], ['fireball', 2], ['drop', 2], ['crystal', 3], ['cshard', 7]] : [['medusa', 4], ['fireball', 3], ['drop', 3], ['crystal', 2]];
const atBase = () => G.loc === 'base' && !G.traveling;

// ---------------- инвентарь ----------------
function invAdd(list, id, n = 1, extra) {
  const it = IT(id);
  if (!it) { console.warn('no item', id); return; }
  const single = it.c === 'melee' || it.c === 'gun' || it.c === 'wear' || it.c === 'art' || it.uses || it.sp;
  if (single && !it.sp) {
    for (let i = 0; i < n; i++) list.push(Object.assign({ id, n: 1 }, it.dur ? { dur: it.dur } : {}, it.uses ? { uses: it.uses } : {}, extra || {}));
    return;
  }
  if (it.sp) { const born = extra && extra.born != null ? extra.born : G.time; const e = list.find(x => x.id === id && Math.abs((x.born || 0) - born) < 360); if (e) e.n += n; else list.push({ id, n, born }); return; }
  const e = list.find(x => x.id === id); if (e) e.n += n; else list.push({ id, n });
}
const cnt = (list, id) => list.reduce((a, x) => a + (x.id === id ? x.n : 0), 0);
function take(list, id, n = 1) { // берём сначала самые старые
  const es = list.filter(x => x.id === id).sort((a, b) => (a.born || 0) - (b.born || 0));
  let left = n;
  for (const e of es) { const k = Math.min(left, e.n); e.n -= k; left -= k; if (left <= 0) break; }
  for (let i = list.length - 1; i >= 0; i--) if (list[i].n <= 0) list.splice(i, 1);
  return left <= 0;
}
const allCnt = id => cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0);
function allTake(id, n) { const a = Math.min(n, cnt(G.inv, id)); take(G.inv, id, a); if (n - a > 0) take(G.stash, id, n - a); }
const hasAll = need => Object.entries(need).every(([k, v]) => allCnt(k) >= v);
const eqList = () => [G.eq.weapon, G.eq.body, G.eq.vest, G.eq.bag, G.eq.mask, ...G.eq.art].filter(Boolean);
const weightOf = list => list.reduce((a, x) => a + IT(x.id).w * x.n, 0);
const curW = () => weightOf(G.inv) + weightOf(eqList());
const capW = () => 20 + mod('carry') + (G.eq.bag ? IT(G.eq.bag.id).cap : 0) + G.eq.art.filter(Boolean).reduce((a, x) => a + (IT(x.id).art.cap || 0), 0);
const overW = () => curW() > capW();
function freshness(e) { const it = IT(e.id); if (!it.sp || !F().spoil) return 0; return (G.time - (e.born || 0)) / H / it.sp; }

// ---------------- персонаж ----------------
const hasTrait = t => G.ch.traits.includes(t);
const PERK_BY = {}; for (const sk in PERKS) for (const lv in PERKS[sk]) for (const p of PERKS[sk][lv]) PERK_BY[p.id] = Object.assign({ sk, lv: +lv }, p);
// сумма модификаторов: черты + профессия + перки (+ питомец/сезон)
function mod(k) {
  const c = G.ch; let v = 0;
  for (const t of c.traits) { const T = TRAITS[t]; if (T && T.m && T.m[k]) v += T.m[k]; }
  const P = PROFS[c.prof]; if (P && P.m && P.m[k]) v += P.m[k];
  if (c.perks) for (const id of c.perks) { const q = PERK_BY[id]; if (q && q.m && q.m[k]) v += q.m[k]; }
  if (typeof extraMod === 'function') v += extraMod(k);
  return v;
}
const mul = (k, min = 0.1) => Math.max(min, 1 + mod(k));
function skill(k) { let lv = 0; for (let i = 1; i < SKILL_XP.length; i++) if (G.ch.xp[k] >= SKILL_XP[i]) lv = i; let b = 0; for (const t of G.ch.traits) { const T = TRAITS[t]; if (T && T.sk && T.sk[k]) b += T.sk[k]; } const P = PROFS[G.ch.prof]; if (P && P.sk && P.sk[k]) b += P.sk[k]; return clamp(lv + b, 0, 7); }
function checkPerks() {
  if (!G || G.dead || !G.ch) return;
  const c = G.ch; c.perks = c.perks || []; c.perkAsk = c.perkAsk || {};
  for (const k in PERKS) for (const tier of [2, 4]) {
    const key = k + tier; if (c.perkAsk[key] || skill(k) < tier) continue;
    if (PERKS[k][tier].some(p => c.perks.includes(p.id))) { c.perkAsk[key] = 1; continue; }
    c.perkAsk[key] = 1;
    if (typeof hint === 'function') hint('perks');
    const opts = PERKS[k][tier];
    UI.event({ title: `⭐ ${SKILLS[k].ic} ${SKILLS[k].n} ${tier}: выбери путь`, cls: 'good', text: opts.map(o => `${o.ic} ${o.n} — ${o.d}`).join('\n\n') + '\n\nВыбор навсегда для этого персонажа.', choices: opts.map(o => ({ t: `${o.ic} ${o.n}`, fn: () => { if (!c.perks.includes(o.id)) c.perks.push(o.id); UI.log(`⭐ Новый перк: ${o.ic} ${o.n}.`, 'good'); FEED(`⭐ взял перк «${o.n}»`); } })) });
  }
}
function xp(k, n) { n *= Math.max(0.2, 1 + mod('xp_all') + mod('xp_' + k)); const b = skill(k); G.ch.xp[k] = (G.ch.xp[k] || 0) + n; const a = skill(k); if (a > b) { SND('level'); UI.log(`${SKILLS[k].ic} Навык «${SKILLS[k].n}» вырос до ${a}!`, 'good'); if (a === 2 || a === 4 || a > 4) checkPerks(); } }
function armor() { return eqList().reduce((a, x) => a + (IT(x.id).arm || 0), 0); }
function warmth() { return eqList().reduce((a, x) => a + (IT(x.id).warm || 0) + ((IT(x.id).art || {}).warm || 0), 0); }
function healthPct() {
  if (!F().parts) return clamp(G.ch.hp, 0, 100);
  let s = 0, m = 0; for (const p in PARTS) { s += G.ch.parts[p] * PARTS[p].w / PARTS[p].max; m += PARTS[p].w; } return clamp(Math.round(s / m * 100), 0, 100);
}
const bleeding = () => F().parts ? G.ch.inj.some(j => !j.band && j.bleed > 0) : G.ch.bleed > 0;
function inPain() {
  if (G.ch.painUntil > G.time) return false;
  if (!F().parts) return G.ch.hp < 35;
  return Object.keys(PARTS).some(p => G.ch.parts[p] < PARTS[p].max * 0.4) || G.ch.inj.some(j => j.t === 'frac' && !j.splint);
}
const legHurt = () => F().parts && (G.ch.inj.some(j => j.t === 'frac' && (j.part === 'lleg' || j.part === 'rleg')) || G.ch.parts.lleg < 25 || G.ch.parts.rleg < 25);
const fever = () => F().parts && (G.ch.inj.some(j => j.inf >= 40) || (G.ch.virus && G.time - G.ch.virus > 24 * H));

function moodles() {
  const c = G.ch, m = [], f = F();
  const lv = (v, a, b, cc) => v <= cc ? 3 : v <= b ? 2 : v <= a ? 1 : 0;
  const add = (ic, n, l, d) => l && m.push({ ic, n, l, d });
  add('🍗', 'Голод', lv(c.food, 40, 20, 5), 'Поешь. При нуле теряешь здоровье.');
  add('💧', 'Жажда', lv(c.drink, 40, 20, 5), 'Попей. Без воды здоровье падает быстро.');
  add('😴', 'Усталость', lv(c.energy, 35, 20, 8), 'Выспись. Уставший хуже дерётся и медленнее.');
  add('😰', 'Стресс', c.stress >= 80 ? 3 : c.stress >= 60 ? 2 : c.stress >= 40 ? 1 : 0, 'Снижает меткость. Помогает сон, сигареты, шоколад, кот.');
  if (bleeding()) add('🩸', 'Кровотечение', 3, 'Перевяжи рану!');
  if (inPain()) add('🤕', 'Боль', 2, 'Удары и стрельба хуже. Обезболивающее поможет.');
  if (c.ill.cold > 0) add('🤧', 'Простуда', 2, 'Быстро устаёшь, можешь чихнуть и выдать себя.');
  if (c.ill.poison > 0) add('🤢', 'Отравление', 2, 'Тошнит, теряешь воду. Пройдёт само.');
  if (fever()) add('🥵', 'Лихорадка', 3, f.virus && c.virus ? 'Это не похоже на обычную инфекцию...' : 'Рана воспалилась. Нужны антибиотики!');
  if (f.rad && c.rad >= 30) add('☢️', 'Облучение', c.rad >= 150 ? 3 : c.rad >= 80 ? 2 : 1, 'Антирад или водка. Выше 200 — смерть.');
  if (f.cold && c.cold >= 40) add('🥶', 'Холод', c.cold >= 80 ? 3 : c.cold >= 60 ? 2 : 1, 'Тёплая одежда, огонь, укрытие.');
  if (c.wet >= 40) add('💦', 'Промок', 1, 'Сырость — путь к простуде.');
  if (overW()) add('🏋️', 'Перегруз', curW() > capW() * 1.3 ? 3 : 2, 'Медленнее ходишь и быстрее устаёшь.');
  if (legHurt()) add('🦵', 'Хромота', 2, 'Переходы дольше, убежать сложнее.');
  return m;
}

// ---------------- новая игра ----------------
function newWorld() {
  const locs = {};
  for (const id in LOCS) locs[id] = { seen: id === 'base', rooms: LOCS[id].rooms.map(() => ({ cont: {}, en: [], enAt: -1e9, an: null, art: null, ground: [], aware: true, fixed: false })), kills: 0 };
  return { locs, struct: { bed: 0, fire: 0, bench: 0, walls: 0, traps: 0, rain: 0, smoke: 0, garden: 0, radio: 0, distill: 0, boat: 0 }, wallHp: 0,
    bp: {}, flags: {}, quests: {}, qstart: {}, rep: { semen: 0, serg: 0, levin: 0, nomad: 0 }, notes: [], counters: { anomFound: 0 }, corpses: [],
    prod: { rain: 0, garden: 0 }, catAt: -1e9, catLove: 0, car: { loc: 'gas', stage: 0, fuel: 0, hp: 100 }, gen: 1, hordeDone: {}, ending: null, deaths: [], events: [] };
}
function newChar(name, traits, prof) {
  const ch = { name, traits, prof: PROFS[prof] ? prof : 'unemployed', perks: [], perkAsk: {}, xp: {}, hp: 100, parts: {}, inj: [], bleed: 0, food: 80, drink: 80, energy: 90, stress: 10, rad: 0, cold: 0, wet: 0,
    ill: { cold: 0, poison: 0 }, virus: null, painUntil: 0, antibioUntil: 0, lastSmoke: 0, kills: 0, born: 0 };
  for (const k in SKILLS) ch.xp[k] = 0;
  for (const p in PARTS) ch.parts[p] = PARTS[p].max;
  return ch;
}
function newGame(mode, name, traits, prof) {
  G = { v: 3, mode, time: 8 * H, loc: 'base', room: null, sneak: false, traveling: false, noise: 0, money: 20,
    weather: { id: 'clear', until: 6 * H + 8 * H }, em: { next: DAY * 3 + R(10, 20) * H, warned: false },
    inv: [], stash: [], eq: { weapon: null, body: null, vest: null, bag: null, mask: null, art: [null, null] },
    ch: newChar(name, traits, prof), w: newWorld(), log: [], combat: null, dead: false };
  G.ch.born = G.time;
  startKit();
  G.w.quests.m_camp = 'active';
  G.tut = { on: true, done: {} };
  addNote('n_start');
  UI.log(`День 1. ${MODES[mode].ic} Сложность: ${MODES[mode].n}.`, 'sys');
  save();
}
function startKit() {
  invAdd(G.inv, 'water', 2); invAdd(G.inv, 'lighter', 1); invAdd(G.inv, 'bottle', 2); invAdd(G.inv, 'crackers', 2); invAdd(G.inv, 'rag', 2);
  G.eq.weapon = { id: 'stick', n: 1, dur: 30 };
  if (hasTrait('medic')) { invAdd(G.inv, 'bandage', 2); invAdd(G.inv, 'antisep', 1); }
  if (hasTrait('smoker')) invAdd(G.inv, 'cigs', 3);
  const P = PROFS[G.ch.prof]; if (P && P.kit) for (const [id, n] of P.kit) { if (['melee', 'gun'].includes(IT(id).c) && (!G.eq.weapon || G.eq.weapon.id === 'stick')) G.eq.weapon = { id, n: 1, dur: IT(id).dur }; else if (IT(id).c === 'wear' && IT(id).slot && !G.eq[IT(id).slot]) G.eq[IT(id).slot] = { id, n: 1 }; else invAdd(G.inv, id, n); }
  if (G.w.gen === 1) { invAdd(G.stash, 'wood', 1); invAdd(G.stash, 'planks', 2); invAdd(G.stash, 'nails', 6); invAdd(G.stash, 'canned', 1); }
}

// ---------------- сохранение ----------------
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) {} if (G && G.coop && window.COOP) COOP.sync(); if (G && typeof lbSubmit === 'function') lbSubmit(); if (G && typeof achCheck === 'function') achCheck(); if (G && typeof PVP !== 'undefined') PVP.publish(); }
function load() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.v === 3) { G = s; migrate(); return true; } } catch (e) {} return false; }
function migrate() { if (G.ch && !G.ch.prof) { G.ch.prof = 'unemployed'; G.ch.perks = G.ch.perks || []; G.ch.perkAsk = G.ch.perkAsk || {}; } for (const id in LOCS) if (!G.w.locs[id]) G.w.locs[id] = { seen: false, rooms: LOCS[id].rooms.map(() => ({ cont: {}, en: [], enAt: -1e9, an: null, art: null, ground: [], aware: true, fixed: false })), kills: 0 }; if (G.w.struct.boat == null) G.w.struct.boat = 0; if (!G.w.events) G.w.events = []; if (G.w.rep.nomad == null) G.w.rep.nomad = 0; if (!G.tut) G.tut = { on: day() <= 2 && !G.w.struct.fire, done: {} }; if (!G.w.flags.mig_bottles) { G.w.flags.mig_bottles = 1; if (G.w.struct.distill == null) G.w.struct.distill = 0; if (!G.dead) { invAdd(G.inv, 'bottle', 2); G.log.push({ t: '🍶 Обновление: теперь воду можно набирать в бутылки. В рюкзаке 2 пустые бутылки.', c: 'good', d: day(), k: clock() }); } } }
function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

// =====================================================================
//  ТЕЧЕНИЕ ВРЕМЕНИ
// =====================================================================
// opts: { sleep, bed, interrupt } ; возвращает false, если прервано/смерть
function advance(min, opts = {}) {
  let left = Math.round(min);
  G.interrupt = false;
  while (left > 0 && !G.dead) {
    const st = Math.min(10, left);
    tick(st, opts);
    left -= st;
    if (G.interrupt && opts.interruptible) return false;
  }
  return !G.dead;
}

function tick(st, o) {
  const c = G.ch, f = F(), t = st / H, w = weather();
  const prevDay = day();
  G.time += st;
  const sleep = !!o.sleep, outside = !inShelter();
  const nr = f.needs * (sleep ? 0.5 : 1);
  // --- потребности
  c.food = clamp(c.food - 3 * t * nr * mul('hunger', 0.3), 0, 100);
  c.drink = clamp(c.drink - 4 * t * nr * (c.ill.poison > 0 ? 2 : 1) * mul('thirst', 0.3), 0, 100);
  if (sleep) c.energy = clamp(c.energy + (o.bed ? 13 : 8) * t * mul('sleep', 0.3), 0, 100);
  else c.energy = clamp(c.energy - 4 * t * f.needs * mul('fatigue', 0.3) * (c.ill.cold > 0 ? 1.5 : 1) * (overW() ? 1.3 : 1) * (fever() ? 1.5 : 1), 0, 100);
  let ds = 0;
  if (isNight() && outside && !sleep) ds += 2;
  if (sleep) ds -= o.bed ? 6 : 3;
  if (atBase()) ds -= 1;
  if (hasTrait('smoker') && G.time - c.lastSmoke > 12 * H) ds += 4;
  if (mod('claustro') > 0 && G.room != null && LOCS[G.loc].rooms[G.room] && LOCS[G.loc].rooms[G.room].dark) ds += 4;
  if (ds > 0) ds *= mul('stress', 0.3);
  c.stress = clamp(c.stress + ds * t, 0, 100);
  if (c.food <= 0) dmgTorso(2 * t, 'голод');
  if (c.drink <= 0) dmgTorso(4 * t, 'жажда');
  if (c.drink < 35 && typeof hint === 'function') hint('thirst');
  if (isNight() && !sleep && typeof hint === 'function' && day() <= 3) hint('night');
  // --- кровотечение и раны
  if (f.parts) {
    for (const j of c.inj) {
      if (!j.band && j.bleed > 0) hurtPart(j.part, j.bleed * 5 * t * mul('bleedRes', 0.2), true);
      if (f.infection && ['scratch', 'lacer', 'bite', 'bullet', 'burn'].includes(j.t) && !j.dis && G.time - j.born < 48 * H) {
        if (c.antibioUntil > G.time) j.inf = Math.max(0, j.inf - 12 * t);
        else j.inf = clamp(j.inf + 3.5 * t * mul('infect', 0.1) * (j.dirty ? 1.4 : 1) * (j.band ? 0.7 : 1), 0, 100);
      } else if (c.antibioUntil > G.time) j.inf = Math.max(0, j.inf - 12 * t);
      if (j.inf >= 100) dmgTorso(2 * t, 'заражение крови');
      const canHeal = j.t === 'frac' ? j.splint : (j.band || j.bleed === 0);
      if (canHeal && j.inf < 40) j.prog += t * (sleep ? (atBase() && typeof npcs === 'function' && npcs().some(n => n.role === 'medic') ? 2.4 : 1.6) : 1) * (1 + skill('med') * 0.08) * mul('heal', 0.2);
    }
    const before = c.inj.length;
    c.inj = c.inj.filter(j => j.prog < INJ[j.t].heal);
    if (c.inj.length < before) UI.log('🩹 Одна из ран зажила.', 'good');
    const regen = (c.food > 15 && c.drink > 15 && (!f.rad || c.rad < 80)) ? (sleep ? 2.5 : 1) + artSum('heal') : 0;
    if (regen) for (const p in PARTS) c.parts[p] = Math.min(PARTS[p].max, c.parts[p] + regen * t * (p === 'torso' ? 2 : 1));
  } else {
    if (c.bleed > 0) c.hp -= c.bleed * 6 * t * mul('bleedRes', 0.2);
    if (c.food > 10 && c.drink > 10) c.hp = Math.min(100, c.hp + (sleep ? 4 : 2) * t + artSum('heal') * t);
  }
  // --- радиация
  if (f.rad) {
    const zr = G.traveling ? 0 : (ZONE_RAD[L().zone || 0] || 0) * (st / 10) * (G.eq.mask ? 0.5 : 1) * mul('rad', 0.1);
    c.rad = clamp(c.rad + zr + artSum('rad') * t - 0.5 * t, 0, 250);
    if (c.rad >= 100) dmgTorso(3 * t, 'лучевая болезнь');
    if (c.rad >= 50) c.food = Math.max(0, c.food - 1 * t);
  }
  // --- холод и сырость
  const wet = w.wet && outside ? w.wet : 0;
  c.wet = clamp(c.wet + (wet ? 30 * wet * t : -20 * t), 0, 100);
  if (f.cold) {
    let dc = 0;
    if (outside) dc += (isNight() ? 6 : 0) + (c.wet > 40 ? 6 : 0) + (G.weather.id === 'snow' ? 6 : 0) - warmth() * 1.5 - artSum('warm') * 1.5;
    else dc -= atBase() && G.w.struct.fire ? 18 : 8;
    if (campHere()) dc -= 14;
    if (dc > 0) dc *= mul('cold', 0.2);
    c.cold = clamp(c.cold + dc * t, 0, 100);
    if (c.cold >= 80) dmgTorso(2 * t, 'переохлаждение');
  }
  // --- болезни
  if (f.illness && c.ill.cold <= 0) {
    let p = 0;
    if (c.wet > 50) p += 0.02;
    if (sleep && !o.bed && outside) p += 0.05;
    if (f.cold && c.cold > 60) p += 0.05;
    p *= mul('ill', 0.1);
    if (ch(p * t)) { c.ill.cold = R(40, 70); UI.log('🤧 Ты простудился. Нужен отдых в тепле или таблетки.', 'bad'); }
  }
  if (c.ill.cold > 0) c.ill.cold = Math.max(0, c.ill.cold - t * (sleep && o.bed ? 2.5 : 1));
  if (c.ill.poison > 0) { c.ill.poison = Math.max(0, c.ill.poison - t); dmgTorso(1 * t, 'отравление'); }
  if (f.virus && c.virus && G.time - c.virus > 96 * H) { die('вирус — вы обратились'); return; }
  // --- погода
  if (G.time >= G.weather.until) {
    const nw = wpick(typeof seasonWeather === 'function' ? seasonWeather() : WEATHER.map(x => [x.id, x.w]));
    if (nw !== G.weather.id) { const x = WEATHER.find(q => q.id === nw); UI.log(`${x.ic} Погода: ${x.n.toLowerCase()}.`, 'sys'); }
    G.weather = { id: nw, until: G.time + R(4, 9) * H };
  }
  // --- новый день
  if (day() !== prevDay) newDay();
  // --- производство базы
  const s = G.w.struct;
  if (worldAuth() && s.rain && w.wet) { G.w.prod.rain += t; if (G.w.prod.rain >= 2) { G.w.prod.rain -= 2; invAdd(G.stash, 'water', 1); } }
  if (worldAuth() && s.garden && !(typeof season === 'function' && season() === 1)) { G.w.prod.garden += t * mul('garden', 0.3); if (G.w.prod.garden >= 10) { G.w.prod.garden -= 10; invAdd(G.stash, 'veg', 1); } }
  // --- шум
  G.noise = Math.max(0, G.noise - 5 * (st / 10));
  // --- выброс
  emissionTick(o);
  // --- кровавая ночь
  hordeTick(o);
  checkDeath();
}
function artSum(k) { return G.eq.art.filter(Boolean).reduce((a, x) => a + (IT(x.id).art[k] || 0), 0); }
function newDay() {
  UI.log(`☀️ День ${day()}.` + (day() % 7 === 0 ? ' 🌕 Сегодня Кровавая ночь!' : day() % 7 === 6 ? ' Завтра Кровавая ночь.' : ''), 'sys');
  if (!worldAuth()) return;
  if (G.w.struct.walls) { G.w.wallHp = Math.max(1, G.w.wallHp - 4); }
  dailyEvent();
}
function dmgTorso(n, why) {
  if (F().parts) hurtPart('torso', n, true, why); else { G.ch.hp -= n; G.lastHurt = why; }
}
function hurtPart(p, n, silent, why) {
  const c = G.ch; c.parts[p] = Math.max(0, c.parts[p] - n);
  if ((p.endsWith('arm') || p.endsWith('leg')) && c.parts[p] <= 0) c.parts.torso = Math.max(0, c.parts.torso - n * 0.5);
  if (why) G.lastHurt = why;
}
function checkDeath() {
  if (G.dead) return;
  const c = G.ch;
  if (F().parts ? (c.parts.head <= 0 || c.parts.torso <= 0) : c.hp <= 0) die(G.lastHurt || 'раны');
  else if (F().rad && c.rad >= 200) die('радиация');
}

// ---------------- Выброс (Сталкер) ----------------
function emissionTick(o) {
  const e = G.em, warnAt = e.next - F().emWarn;
  if (!e.warned && G.time >= warnAt) {
    e.warned = true; G.interrupt = true; SND('siren');
    UI.event({ title: '🔴 Приближается Выброс!', cls: 'bad', text: `Небо наливается багровым, воет ветер. До Выброса около ${Math.max(10, e.next - G.time)} минут.\n\nУкрытия: база, Рыбацкая деревня, Маяк, Метеостанция.` + (inShelter() ? '\n\n✅ Ты в укрытии.' : '\n\n⚠️ Ты под открытым небом — беги в укрытие!'), choices: [{ t: 'Понял' }] });
  }
  if (G.time >= e.next) {
    e.next = G.time + DAY * (CH2() && !(G.w.ch2 && G.w.ch2.end === 'seal') ? R(2, 4) : R(3, 5)) + R(0, 12) * H; e.warned = false; G.interrupt = true;
    const f = F();
    if (inShelter()) UI.event({ title: '⚡ Выброс', text: 'Земля дрожит, стены гудят. Ты пережидаешь Выброс в укрытии. Когда всё стихает, в аномалиях наверняка появились новые артефакты.', choices: [{ t: 'Выйти' }] });
    else if (f.death === 'wake') { G.time += 4 * H; G.ch.hp = Math.min(G.ch.hp, 40); UI.event({ title: '⚡ Выброс застал тебя!', cls: 'bad', text: 'Тебя сбило с ног волной. Очнулся через 4 часа — живой, но разбитый.', choices: [{ t: 'Подняться' }] }); }
    else if (f.death === 'perma' && ch(0.6)) { die('Выброс'); return; }
    else { for (const p in PARTS) G.ch.parts[p] = Math.max(1, G.ch.parts[p] * 0.4); G.ch.rad += 60; G.ch.stress = 100; G.lastHurt = 'Выброс'; UI.event({ title: '⚡ Выброс застал тебя!', cls: 'bad', text: 'Волна прошла сквозь тело. Ты выжил — чудом. Здоровье сильно подорвано, +60 радиации.', choices: [{ t: 'Подняться' }] }); }
    // новые артефакты
    if (worldAuth()) for (const id in LOCS) LOCS[id].rooms.forEach((r, i) => { if (r.anom && ch(0.55 + (LOCS[id].zone || 0) * 0.1)) G.w.locs[id].rooms[i].art = wpick(artPool()); });
  }
}
const emissionSoon = () => G.em.warned;

// ---------------- Кровавая ночь (7 Days to Die) ----------------
function hordeTick(o) {
  if (typeof raidTick === 'function') raidTick();
  const d = day();
  if (d % 7 !== 0 || hour() < 22 || G.w.hordeDone[d]) return;
  G.w.hordeDone[d] = true; G.interrupt = true;
  const power = Math.round((25 + d * 2.5) * F().horde); SND('horde');
  if (atBase()) UI.horde(power);
  else if (!worldAuth()) { UI.event({ title: '🌕 Кровавая ночь', cls: 'bad', text: `Орда пошла на вашу общую базу. Её встретят укрепления${G.coop ? ' и друг, если он на базе' : ''} — итог появится в общем мире.\n\nЗдесь до утра будет опаснее обычного.`, choices: [{ t: 'Ясно' }] }); }
  else {
    const res = resolveHordeAuto(power);
    UI.event({ title: '🌕 Кровавая ночь', cls: 'bad', text: `Вдалеке слышен вой сотен глоток. Орда пошла на твою базу, а тебя там нет.\n\n${res}\n\nИ здесь до утра будет опаснее обычного.`, choices: [{ t: 'Держаться' }] });
  }
}
function defense() { const s = G.w.struct; return STRUCT.walls.def[s.walls] + STRUCT.traps.def[s.traps] + (s.fire ? 5 : 0) + (typeof npcDef === 'function' ? npcDef() : 0) + (G.pet && G.pet.type === 'dog' && G.pet.hp > 0 && atBase() ? 6 : 0) + (G.coop && window.COOP ? COOP.others().filter(p => p.online && p.alive !== false && p.loc === 'base' && !p.from).length * 15 : 0); }
function wallsHit(n) {
  if (!worldAuth()) return ''; // урон базе в кооперативе считает только ведущий
  const s = G.w.struct; let msg = [];
  while (n > 0 && s.walls > 0) {
    const k = Math.min(n, G.w.wallHp); G.w.wallHp -= k; n -= k;
    if (G.w.wallHp <= 0) { s.walls--; G.w.wallHp = s.walls ? 100 : 0; msg.push('🧱 Укрепления разрушены на уровень!'); }
  }
  if (n > 0 && F().hordeLoot) {
    const lost = []; let k = Math.ceil(n / 12);
    while (k-- > 0 && G.stash.length) { const e = pick(G.stash); const q = Math.max(1, Math.ceil(e.n / 2)); take(G.stash, e.id, q); lost.push(`${IT(e.id).ic}${IT(e.id).n}×${q}`); }
    if (lost.length) msg.push('📦 Орда ворвалась на склад и разнесла: ' + lost.join(', '));
  }
  return msg.join('\n');
}
function resolveHordeAuto(power) {
  const left = Math.max(0, power - defense());
  if (!left) return '🛡️ Укрепления выдержали натиск.';
  return wallsHit(left) || 'База потрёпана, но цела.';
}

// =====================================================================
//  СМЕРТЬ — разная на каждой сложности
// =====================================================================
function die(cause) {
  if (G.dead) return;
  const f = F(), c = G.ch, days = Math.floor((G.time - c.born) / DAY);
  G.combat = null; G.interrupt = true; SND('death');
  G.w.deaths.push({ name: c.name, days, cause, kills: c.kills }); setAct('погиб'); FEED(`💀 погиб: ${cause}`);
  try { lbSubmit(true, true); } catch (e) {}
  if (f.death === 'wake') {
    c.hp = 50; c.bleed = 0; c.food = Math.max(c.food, 40); c.drink = Math.max(c.drink, 40); c.rad = 0; c.stress = 50;
    G.time += 6 * H; G.loc = 'base'; G.room = null; G.traveling = false;
    UI.event({ title: '😵 Ты потерял сознание', text: `Причина: ${cause}.\n\nСемёныч снова нашёл тебя и дотащил до базы. Все вещи при тебе. Прошло 6 часов.`, choices: [{ t: 'Встать' }] });
    return;
  }
  // вещи остаются на трупе
  const items = G.inv.splice(0); eqList().forEach(x => items.push(x));
  G.eq = { weapon: null, body: null, vest: null, bag: null, mask: null, art: [null, null] };
  if (items.length) G.w.corpses.push({ loc: G.traveling ? G.travelTo || G.loc : G.loc, items, name: c.name, at: G.time });
  if (f.death === 'corpse') {
    for (const p in PARTS) c.parts[p] = Math.ceil(PARTS[p].max * 0.5);
    c.inj = []; c.bleed = 0; c.food = 50; c.drink = 50; c.energy = 60; c.rad = 0; c.stress = 60; c.ill = { cold: 0, poison: 0 }; c.cold = 0;
    for (const k in c.xp) c.xp[k] = Math.floor(c.xp[k] * 0.75);
    G.time += 8 * H; const where = G.w.corpses.length ? LOCS[G.w.corpses[G.w.corpses.length - 1].loc].n : '';
    G.loc = 'base'; G.room = null; G.traveling = false; G.eq.weapon = { id: 'stick', n: 1, dur: 30 };
    UI.event({ title: '💀 Ты погиб… почти', cls: 'bad', text: `Причина: ${cause}.\n\nСемёныч нашёл тебя едва живым и дотащил до базы. Всё, что было при тебе, осталось там${where ? ` — в локации «${where}»` : ''}. Можно вернуться и забрать с тела.\n\nНавыки немного забылись (−25% опыта).`, choices: [{ t: 'Прийти в себя' }] });
    return;
  }
  // хардкор: навсегда
  G.dead = true;
  save();
  UI.deathScreen({ name: c.name, days, cause, kills: c.kills });
}
function continueWorld(name, traits, prof) { // новый персонаж в том же мире
  G.w.gen++;
  G.ch = newChar(name, traits, prof); G.ch.born = G.time; G.dead = false;
  G.loc = 'base'; G.room = null; G.traveling = false;
  G.eq = { weapon: null, body: null, vest: null, bag: null, mask: null, art: [null, null] };
  startKit();
  UI.log(`🧍 ${name} приплыл на остров на обломке лодки. На базе его ждёт склад предшественника.`, 'sys');
  save();
}

// =====================================================================
//  ПЕРЕМЕЩЕНИЕ
// =====================================================================
function travelTime(to) {
  let m = LOCS[G.loc].links[to];
  if (curW() > capW()) m *= 1.5;
  if (isNight() && !(mod('nightEye') > 0)) m *= 1.3;
  m *= mul('travel', 0.4);
  if (legHurt()) m *= 1.5;
  if (LOCS[to].boat && !boatReady()) m *= 1.5; // пешком по льду
  return Math.round(m);
}
function canTravel(to) {
  if (curW() > capW() * 1.5) return 'Слишком тяжело — выложи что-нибудь.';
  if (LOCS[to].ch2 && !CH2()) return 'Туда не добраться.';
  if (LOCS[to].boat && !boatReady() && !(typeof iceRoute === 'function' && iceRoute())) return 'Нужна лодка с кристальным двигателем (База → Постройки → Лодка).';
  if (LOCS[to].lock && !cnt(G.inv, LOCS[to].lock)) return `Нужен: ${IT(LOCS[to].lock).ic} ${IT(LOCS[to].lock).n}`;
  return '';
}
function travel(to, topt = {}) {
  const err = canTravel(to); if (err) return UI.toast(err);
  const mins = topt.car ? Math.max(10, Math.round(travelTime(to) * 0.35)) : travelTime(to);
  SND('travel'); setAct(`идёт: ${LOCS[to].ic} ${LOCS[to].n}`);
  G.room = null; G.traveling = true; G.travelTo = to; G.noise = 0;
  const half = Math.round(mins / 2);
  advance(half);
  if (G.dead) return;
  // событие в пути
  const dg = (LOCS[G.loc].dg + LOCS[to].dg) / 2;
  let p = (0.12 + dg * 0.08) * (isNight() ? 1.8 : 1) * F().enemies;
  if (isBloodNight()) p *= 3;
  p *= mul('ambush', 0.2);
  if (topt.car) p *= 0.5;
  if (fogEvent()) p *= 1.6;
  const finish = () => {
    if (G.dead) return;
    advance(mins - half);
    if (G.dead) return;
    G.traveling = false; G.loc = to; G.w.locs[to].seen = true; if (to === 'forest') tutMark('forest');
    if (to === 'gas' && typeof hint === 'function') hint('car');
    if (day() >= 3 && to === 'base' && typeof hint === 'function') hint('raids');
    if (to === 'reef' && !G.w.flags.reef_seen) { G.w.flags.reef_seen = true; FEED('⛵ доплыл до Острова-8'); checkQuests(); }
    for (const l in LOCS[to].links) if (F().hints) G.w.locs[l].seen = G.w.locs[l].seen || F().hints > 0;
    UI.log(`${topt.car ? '🚗 Ты доехал' : '📍 Ты добрался'}: ${LOCS[to].ic} ${LOCS[to].n} (${mins} мин).`); setAct('осматривается');
    corpseHint();
    if (G.route && G.route.length) UI.log(`🧭 Маршрут: дальше ${LOCS[G.route[0]].ic} ${LOCS[G.route[0]].n}.`, 'sys'); else if (G.routeDest === to) { G.routeDest = null; UI.log('🧭 Ты на месте.', 'good'); }
    if (!LOCS[to].shelter && !LOCS[to].base && ch(0.08)) setTimeout(() => wounded(), 0);
    UI.go('loc');
  };
  if (ch(p)) roadEvent(to, finish); else finish();
}
function corpseHint() { if (G.w.corpses.some(x => x.loc === G.loc)) UI.log('🪦 Где-то здесь лежит тело твоего прошлого «я» с вещами.', 'warn'); }
function roadEvent(to, done) {
  const night = isNight();
  const evs = [
    [() => fightRoad(night ? [['runner', 1, 2], ['zombie', 0, 1]] : [['zombie', 1, 3]], 'На дороге бродят заражённые.', done), 5],
    [() => fightRoad([['dog', 2, 3]], 'Из кустов вылетает стая одичавших псов!', done), 2],
    [() => stranger(done), 2],
    [() => { const id = wpick([['canned', 2], ['water', 2], ['bandage', 2], ['a9', 1], ['cigs', 1], ['antibio', 1]]), n = IT(id).c === 'ammo' ? R(4, 8) : 1; invAdd(G.inv, id, n); UI.event({ title: '🎒 Находка', text: `У обочины лежит брошенная сумка. Внутри: ${IT(id).ic} ${IT(id).n} ×${n}.`, choices: [{ t: 'Забрать', fn: done }] }); }, 2],
    [() => { G.ch.wet = 100; UI.event({ title: '🌧️ Ливень', text: 'Хлынул ливень. Ты промок до нитки.', choices: [{ t: 'Идти дальше', fn: done }] }); }, F().illness ? 1 : 0],
  ];
  if (LOCS[to].zone || LOCS[G.loc].zone) evs.push([() => fightRoad([['pdog', 1, 2]], 'Между деревьев мелькает что-то большое… Псевдопсы!', done), 2]);
  wpick(evs)();
}
function fightRoad(spec, text, done) {
  const en = spawnList(spec);
  if (!en.length) return done();
  const p = stealthChance() + 0.1;
  UI.event({ title: '⚠️ В пути', cls: 'bad', text: text + `\n\n${en.map(e => ENEMY[e.id].ic + ' ' + ENEMY[e.id].n).join(', ')}`, choices: [
    { t: `🌿 Обойти стороной (${Math.round(p * 100)}%)`, fn: () => { if (ch(p)) { xp('stealth', 3); UI.log('🐾 Ты обошёл опасность.', 'good'); advance(15); done(); } else { UI.log('Тебя заметили!', 'bad'); startCombat(en, { onEnd: done, road: true }); } } },
    { t: '⚔️ Принять бой', fn: () => startCombat(en, { onEnd: done, road: true }) },
  ] });
}
function stranger(done) {
  const hostile = ch(0.5);
  UI.event({ title: '🧍 Незнакомец', text: 'Впереди на дороге стоит человек с рюкзаком. Он тоже тебя заметил и держит руку у пояса.', choices: [
    { t: '👋 Помахать рукой', fn: () => { if (hostile) { UI.log('Он выхватил оружие!', 'bad'); startCombat([mkEnemy('raider')], { onEnd: done, road: true, talk: true }); } else { const id = pick(['bandage', 'canned', 'water', 'a9', 'cigs']); invAdd(G.inv, id, IT(id).c === 'ammo' ? 6 : 1); G.ch.stress = Math.max(0, G.ch.stress - 15); UI.event({ title: '🤝 Мирная встреча', text: `Вы обменялись новостями. На прощание он дал тебе ${IT(id).ic} ${IT(id).n}. «Береги себя. И не ходи на болото».`, choices: [{ t: 'Идти дальше', fn: done }] }); } } },
    ...((o) => o ? [{ t: o.t, fn: () => { if (!o.fn()) UI.log('Незнакомец пожал плечами и ушёл.'); done(); } }] : [])(!hostile && typeof npcOffer === 'function' && npcs().length < bunkCap() ? npcOffer(null, 'встречен в пути') : null),
    { t: '🌿 Спрятаться и переждать', fn: () => { advance(20); UI.log('Ты переждал в кустах. Незнакомец ушёл.'); done(); } },
    { t: '🔫 Напасть первым', fn: () => { G.ch.stress = clamp(G.ch.stress + 10, 0, 100); const e = mkEnemy('raider'); e.hp = Math.ceil(e.hp * 0.6); UI.log(hostile ? 'Похоже, он и правда собирался напасть.' : 'Он даже не успел понять, что происходит…', hostile ? '' : 'bad'); startCombat([e], { onEnd: done, road: true }); } },
  ] });
}

// =====================================================================
//  ЛОКАЦИИ, КОМНАТЫ, ОБЫСК
// =====================================================================
const roomDef = (i, loc) => LOCS[loc || G.loc].rooms[i];
const roomSt = (i, loc) => G.w.locs[loc || G.loc].rooms[i];
function mkEnemy(id) {
  const d = ENEMY[id], m = F().enemies;
  const e = { id, hp: Math.round(d.hp * (d.boss ? 1 : m * (CH2() ? 1.25 : 1))), dist: d.sp > 1 ? 1 : R(1, 2), stun: 0 };
  e.max = e.hp;
  if (d.gear) e.gear = wpick(d.gear);
  return e;
}
function spawnList(spec) {
  const out = [];
  for (const [id, a, b] of spec) {
    let n = R(a, b); if (!ENEMY[id].boss) n = Math.max(a ? 1 : 0, Math.round(n * F().count) + (F().count > 1 && ch(0.2) ? 1 : 0));
    for (let i = 0; i < n; i++) out.push(mkEnemy(id));
  }
  return out;
}
function stealthChance() {
  let p = 0.25 + skill('stealth') * 0.08 + (G.sneak ? 0.3 : 0) + (weather().stealth || 0) + (isNight() ? 0.1 : 0);
  p += mod('stealth') + (mod('nightEye') > 0 && isNight() ? 0.1 : 0);
  if (G.ch.ill.cold > 0) p -= 0.15;
  return clamp(p, 0.05, 0.92);
}
function noise(n) { G.noise = clamp(G.noise + n * F().noise * mul('noise', 0.2) * (G.sneak ? 0.35 : 1), 0, 100); }
function enterRoom(i) {
  const d = roomDef(i), s = roomSt(i);
  if (d.lock && !s.open) return UI.lockMenu(i);
  advance(G.sneak ? 8 : 5);
  if (G.dead) return;
  G.room = i;
  // спавн врагов
  if (d.en && G.time - s.enAt > 48 * H) {
    s.en = spawnList(d.en); s.enAt = G.time;
    if (isNight() && !d.safe && ch(0.3) && !LOCS[G.loc].base) s.en.push(mkEnemy('runner'));
    if (isBloodNight() && !d.safe) s.en.push(mkEnemy('runner'), mkEnemy('zombie'));
    if (fogEvent() && !d.safe && ch(0.5)) s.en.push(mkEnemy(L().zone >= 2 ? 'pdog' : 'runner'));
    if (CH2() && !d.safe && !LOCS[G.loc].base && !(G.w.ch2 && G.w.ch2.end === 'seal') && ch(d.anom || L().zone ? 0.4 : 0.12)) s.en.push(mkEnemy('crys'));
  }
  // аномалии
  if (d.anom && !s.an) { s.an = []; for (let k = 0; k < d.anom; k++) s.an.push({ t: pick(Object.keys(ANOM)), found: false }); if (ch(CH2() ? 0.7 : 0.5)) s.art = wpick(artPool()); }
  if (s.an && cnt(G.inv, 'detector')) s.an.forEach(a => { if (!a.found) { a.found = true; } });
  // финальный зал без стража
  if (d.en && s.en.length) {
    const p = stealthChance();
    if (ch(p)) { s.aware = false; UI.log(`🐾 Тебя не заметили: ${s.en.map(e => ENEMY[e.id].ic).join(' ')}`, 'good'); xp('stealth', 2); }
    else { s.aware = true; UI.log('⚠️ Тебя заметили!', 'bad'); UI.go('room'); startCombat(s.en, { room: i }); return; }
  }
  UI.go('room');
}
function leaveRoom() { G.room = null; advance(3); UI.go('loc'); }
function openLock(i, how) {
  const d = roomDef(i), s = roomSt(i);
  if (how === 'key') { s.open = true; UI.log(`🔑 Ты открыл дверь: ${d.n}.`); }
  else if (how === 'pry') { SND('door'); advance(10); noise(25); s.open = true; damageWeapon(5); UI.log('🪛 Ты с грохотом вскрыл дверь монтировкой. Шумно!', 'warn'); }
  else if (how === 'picks') {
    advance(15); const e = G.inv.find(x => x.id === 'picks');
    if (ch(mod('pick') ? 0.9 : 0.5 + skill('craft') * 0.06 + skill('stealth') * 0.04)) { s.open = true; UI.log('🗝️ Замок тихо щёлкнул.', 'good'); xp('craft', 3); }
    else UI.log('Отмычка соскользнула…', 'warn');
    if (e && !mod('pick')) { e.uses--; if (e.uses <= 0) { take(G.inv, 'picks', 1); UI.log('Отмычки сломались.', 'warn'); } }
  }
  if (s.open) enterRoom(i); else UI.render();
}
function searchTime(ct, d) {
  let t = CONT[ct].t * (1 - skill('search') * 0.07) * (G.sneak ? 1.4 : 1) * mul('searchTime', 0.3);
  if (d.dark && isNight() && !cnt(G.inv, 'flash') && !mod('dark')) t *= 1.8;
  return Math.max(3, Math.round(t));
}
function contReady(i, k) { const s = roomSt(i), d = roomDef(i); const last = s.cont[k]; if (last == null) return true; if (d.once || LOCS[G.loc].base) return false; return G.time - last > 72 * H; }
function searchCont(k) {
  if (G.room == null || G.dead) return;
  const i = G.room, d = roomDef(i), s = roomSt(i), ct = d.cont[k], C = CONT[ct];
  if (!contReady(i, k)) return UI.toast('Уже обыскано. Может, потом что-то появится.');
  const t = searchTime(ct, d);
  advance(t);
  if (G.dead) return;
  noise(G.sneak ? 1 : 4);
  const second = s.cont[k] != null;
  s.cont[k] = G.time; setAct(`обыскивает «${C.n}» · ${d.n}`);
  const got = [];
  let n = R(C.roll[0], C.roll[1]) + (skill('search') >= 3 ? 1 : 0) - (second ? 1 : 0);
  if (d.dark && isNight() && !cnt(G.inv, 'flash') && !mod('dark')) n -= 1;
  const lk = mod('loot'); if (lk && ch(Math.abs(lk) * 2)) n += lk > 0 ? 1 : -1;
  for (let q = 0; q < n; q++) {
    const id = wpick(C.loot); const it = IT(id);
    if (it.c === 'bp' && G.w.bp[it.bp]) continue;
    if (it.c === 'key' && (cnt(G.inv, id) || cnt(G.stash, id))) continue;
    if (id === 'serum' && !F().virus && ch(0.7)) continue;
    const amt = it.c === 'ammo' ? R(3, 10) : id === 'nails' ? R(4, 12) : id === 'bolts' ? R(5, 10) : 1;
    invAdd(G.inv, id, amt); got.push(`${it.ic} ${it.n}${amt > 1 ? ' ×' + amt : ''}`);
  }
  // уникальные находки
  if (d.fixed && !s.fixed && k === 0) {
    s.fixed = true;
    if (d.fixed.item) { invAdd(G.inv, d.fixed.item, 1); got.push(`${IT(d.fixed.item).ic} ${IT(d.fixed.item).n} ★`); }
    if (d.fixed.note) addNote(d.fixed.note);
  }
  if (G.loc === 'base' && k === 1 && !G.w.flags.vknote) { G.w.flags.vknote = 1; addNote('n_vk'); }
  if (mod('sneeze') > 0 && ch(0.12)) { noise(25); UI.log('🤧 Апчхи! Пыль…', 'warn'); }
  xp('search', 2); tutMark('search');
  SND(got.length ? 'pickup' : 'search');
  UI.log(`🔍 ${C.ic} ${C.n} (${t} мин): ` + (got.length ? got.join(', ') : 'ничего полезного'), got.length ? '' : 'dim');
  anomalyStep(0.1);
  afterNoise();
  UI.render();
}
// если враги в комнате не заметили — шанс, что заметят; шум зовёт новых
function afterNoise() {
  if (G.dead || G.combat || G.room == null) return;
  const s = roomSt(G.room), d = roomDef(G.room);
  if (d.safe) return;
  const alive = s.en.filter(e => e.hp > 0);
  if (alive.length && !s.aware) {
    const p = clamp(0.2 + G.noise / 150 - skill('stealth') * 0.03, 0.05, 0.9) * (G.ch.ill.cold > 0 && ch(0.3) ? 2 : 1);
    if (ch(p)) { s.aware = true; UI.log(G.ch.ill.cold > 0 && ch(0.5) ? '🤧 Апчхи! Тебя услышали!' : '⚠️ Тебя заметили!', 'bad'); startCombat(s.en, { room: G.room }); return; }
  }
  if (!alive.length && G.noise > 25 && ch(G.noise / 300 * (1 + L().dg * 0.3) * F().enemies)) {
    const id = L().zone >= 2 ? pick(['pdog', 'zombie']) : isNight() ? 'runner' : 'zombie';
    const e = mkEnemy(id); e.dist = 2; s.en.push(e); s.aware = true; s.enAt = G.time;
    UI.log(`🔊 На шум пришёл ${ENEMY[id].ic} ${ENEMY[id].n}!`, 'bad');
    startCombat(s.en, { room: G.room });
  }
}
function takeGround(idx) { const s = roomSt(G.room); const e = s.ground[idx]; if (!e) return; G.inv.push(e); s.ground.splice(idx, 1); UI.render(); }
function takeAllGround() { const s = roomSt(G.room); for (const e of s.ground) G.inv.push(e); s.ground = []; UI.render(); }
function lootCorpse(ci) { const c = G.w.corpses[ci]; for (const e of c.items) G.inv.push(e); G.w.corpses.splice(ci, 1); UI.log('🪦 Ты забрал свои вещи с тела.', 'good'); advance(10); UI.render(); }

// ---------------- аномалии ----------------
function throwBolt() {
  const s = roomSt(G.room);
  if (!cnt(G.inv, 'bolts')) return UI.toast('Нет болтов. Их можно сделать из металлолома или купить у Левина.');
  take(G.inv, 'bolts', 1); advance(5);
  const hid = s.an.filter(a => !a.found);
  if (!hid.length) { UI.log('🔩 Болт упал в траву. Больше аномалий не видно.'); return UI.render(); }
  const a = pick(hid); a.found = true; G.w.counters.anomFound++;
  xp('surv', 3);
  UI.log(`🔩 Болт отлетел в сторону — ${ANOM[a.t].ic} ${ANOM[a.t].n}! (${ANOM[a.t].hint})`, 'good');
  UI.render();
}
function anomalyStep(mult) {
  if (G.room == null) return;
  const s = roomSt(G.room); if (!s.an) return;
  for (const a of s.an) if (!a.found && ch(0.3 * mult)) { triggerAnom(a); a.found = true; G.w.counters.anomFound++; return; }
}
function triggerAnom(a) {
  const A = ANOM[a.t], d = R(A.dmg[0], A.dmg[1]);
  if (A.mask && G.eq.mask) { UI.log(`${A.ic} Ты зашёл в ${A.n.toLowerCase()} — противогаз спас.`, 'warn'); G.ch.rad += (A.rad || 0) * 0.3; return; }
  UI.log(`${A.ic} Ты угодил в аномалию «${A.n}»!`, 'bad'); SND('zap');
  if (A.rad && F().rad) G.ch.rad += A.rad;
  hitPlayer(d, A.inj, a.t === 'grav' ? pick(['lleg', 'rleg', 'larm', 'rarm']) : null, `аномалия «${A.n}»`);
  checkDeath();
}
function grabArtifact() {
  const s = roomSt(G.room); if (!s.art) return;
  advance(15);
  const hid = s.an.filter(a => !a.found);
  for (const a of hid) if (ch(0.35)) { triggerAnom(a); a.found = true; G.w.counters.anomFound++; if (G.dead) return; break; }
  if (G.dead) return;
  invAdd(G.inv, s.art, s.art === 'cshard' ? R(2, 3) : 1); FEED(`✨ достал артефакт: ${IT(s.art).ic} ${IT(s.art).n}`); UI.log(`✨ Ты достал артефакт: ${IT(s.art).ic} ${IT(s.art).n}!`, 'good'); xp('surv', 6); s.art = null;
  UI.render();
}

// =====================================================================
//  БОЙ
// =====================================================================
function startCombat(en, opts = {}) {
  if (G.dead) return;
  G.combat = { en, opts, turn: 1, log: [] };
  if (typeof hint === 'function' && !G.pet && en.some(e => e.id === 'dog')) hint('dog');
  setAct('⚔️ в бою: ' + [...new Set(en.filter(e => e.hp > 0).map(e => ENEMY[e.id].n))].join(', '));
  if (G.coop && window.COOP && (en.length >= 3 || en.some(e => ENEMY[e.id].boss))) { const here = COOP.here(); if (here.length) cLog(`🤝 ${here.map(p => p.name).join(', ')} рядом — поможет в бою.`, 'good'); else FEED(`⚔️ в тяжёлом бою (${LOCS[G.loc].ic} ${LOCS[G.loc].n}) — нужна помощь!`); }
  const first = en.find(e => e.hp > 0); if (first) { const D = ENEMY[first.id]; SND(D.boss || first.id === 'swamper' ? 'roar' : (first.id === 'dog' || first.id === 'pdog') ? 'bark' : D.human ? 'click' : 'growl'); }
  UI.combat();
}
const cLog = (t, c) => { G.combat.log.push({ t, c }); };
const curWeapon = () => G.eq.weapon && IT(G.eq.weapon.id);
function meleeStats() {
  const w = G.eq.weapon && IT(G.eq.weapon.id).c === 'melee' ? IT(G.eq.weapon.id) : null;
  return w ? { n: w.n, dmg: w.dmg, reach: w.reach, push: w.push, noise: w.noise } : { n: 'кулаки', dmg: [2, 5], noise: 2 };
}
function accMods() {
  let m = 0; const c = G.ch;
  const pn = mod('panic');
  if (pn >= 0) { if (c.stress >= 60) m -= 0.1; if (c.stress >= 80) m -= 0.1; }
  if (pn > 0 && G.combat && G.combat.en.filter(e => e.hp > 0).length >= 2) m -= 0.1;
  if (inPain()) m -= 0.12; if (c.energy < 15) m -= 0.15; if (fever()) m -= 0.1;
  if (F().parts && (c.parts.rarm < 20 || c.parts.larm < 20)) m -= 0.1;
  return m;
}
function damageWeapon(n) {
  const w = G.eq.weapon; if (!w || !w.dur) return;
  w.dur -= n * mul('dur', 0.2); if (w.dur <= 0) { UI.log(`💥 ${IT(w.id).n} сломалось!`, 'bad'); G.eq.weapon = null; }
}
function pAttack(i, sneak) {
  const cb = G.combat, e = cb.en[i], D = ENEMY[e.id], ms = meleeStats();
  if (!sneak && e.dist > (ms.reach ? 1 : 0)) { cLog('Слишком далеко для удара.', 'dim'); return UI.combat(); }
  const hit = sneak ? 0.95 : 0.72 + skill('melee') * 0.04 + accMods() + mod('meleeAcc');
  if (ch(hit)) {
    let d = R(ms.dmg[0], ms.dmg[1]) * (1 + skill('melee') * 0.08) * mul('meleeDmg', 0.3);
    if (sneak) d *= (D.boss ? 1.5 : 3) * (1 + mod('sneakDmg'));
    if (ch(0.08 + skill('melee') * 0.02 + mod('crit'))) { d *= 1.6; cLog('💥 Критический удар!', 'good'); }
    d = Math.max(1, Math.round(d - (D.arm || 0)));
    e.hp -= d; cLog(`${sneak ? '🗡️ Удар из засады' : '⚔️ Ты бьёшь'} (${ms.n}) ${D.ic} ${D.n}: −${d}`, 'good');
    damageWeapon(R(1, 3)); xp('melee', 2); SND('hit');
  } else { cLog(`⚔️ Промах по ${D.ic} ${D.n}.`, 'dim'); SND('miss'); }
  noise(ms.noise); G.ch.energy = Math.max(0, G.ch.energy - 1.5);
  endPlayerTurn();
}
function pShoot(i) {
  const cb = G.combat, w = curWeapon();
  if (!w || w.c !== 'gun') return;
  if (!cnt(G.inv, w.ammo)) { cLog('🔫 Щёлк! Патронов нет.', 'bad'); return UI.combat(); }
  if (ch(mod('ammoSave'))) cLog('🧮 Патрон сэкономлен.', 'dim'); else take(G.inv, w.ammo, 1); SND(w.spread ? 'shotgun' : 'shot');
  const targets = w.spread ? cb.en.filter(e => e.hp > 0 && e.dist <= 1).slice(0, w.spread) : [cb.en[i]];
  if (w.spread && !targets.includes(cb.en[i])) targets[0] = cb.en[i];
  for (const e of targets) {
    const D = ENEMY[e.id];
    const hit = w.acc + skill('shoot') * 0.05 - e.dist * 0.08 + accMods() + mod('gunAcc');
    if (ch(hit)) { const cr = ch(mod('gunCrit')); const d = Math.max(1, Math.round(R(w.dmg[0], w.dmg[1]) * (1 + skill('shoot') * 0.06) * (cr ? 2 : 1) - (D.arm || 0) * 0.5)); if (cr) cLog('🎯 В голову!', 'good'); e.hp -= d; e.stun = Math.max(e.stun, D.boss ? 0 : (ch(0.3) ? 1 : 0)); cLog(`🔫 Попадание в ${D.ic} ${D.n}: −${d}`, 'good'); }
    else cLog(`🔫 Мимо ${D.ic} ${D.n}.`, 'dim');
  }
  const gn = w.noise * mul('gunNoise', 0.2);
  xp('shoot', 3); noise(gn);
  if (!cb.opts.road && (cb.reinf || 0) < 2 && ch(gn / 160 * F().noise)) { cb.reinf = (cb.reinf || 0) + 1; const id = isNight() ? 'runner' : (L().zone >= 2 ? 'pdog' : 'zombie'); const ne = mkEnemy(id); ne.dist = 2; cb.en.push(ne); cLog(`🔊 На выстрел прибежал ${ENEMY[id].ic} ${ENEMY[id].n}!`, 'bad'); }
  endPlayerTurn();
}
function pPush(i) {
  const e = G.combat.en[i], D = ENEMY[e.id];
  if (e.dist > 0) return;
  G.ch.energy = Math.max(0, G.ch.energy - 3);
  if (!D.boss && ch(0.75 + (meleeStats().push ? 0.15 : 0))) { e.dist = 1; e.stun = 1; cLog(`🦶 Ты отталкиваешь ${D.ic} ${D.n} — он пошатнулся.`, 'good'); }
  else cLog(`🦶 ${D.n} не сдвинулся с места.`, 'dim');
  endPlayerTurn();
}
function fleeChance() {
  const cb = G.combat; const fast = cb.en.filter(e => e.hp > 0 && ENEMY[e.id].sp > 1 && e.dist <= 1).length;
  let p = 0.5 + skill('stealth') * 0.03 + mod('flee') - fast * 0.12 - (legHurt() ? 0.25 : 0) - (overW() ? 0.15 : 0);
  if (cb.en.some(e => e.hp > 0 && ENEMY[e.id].boss)) p -= 0.1;
  return clamp(p, 0.08, 0.9);
}
function pFlee() {
  if (ch(fleeChance())) { cLog('🏃 Ты вырвался и убежал!', 'good'); G.ch.energy = Math.max(0, G.ch.energy - 8); endCombat('fled'); return; }
  cLog('🏃 Убежать не вышло!', 'bad'); endPlayerTurn();
}
function pTalk() {
  const cb = G.combat;
  if (ch(0.45)) { cLog('🤝 «Ладно-ладно, разойдёмся». Мародёр опускает оружие и уходит.', 'good'); endCombat('talk'); return; }
  cLog('🤝 «Не заговаривай мне зубы!»', 'bad'); endPlayerTurn();
}
function pUse(id) { useItem(id, true); endPlayerTurn(); }
function endPlayerTurn() {
  const cb = G.combat; if (!cb) return;
  cb.en.forEach(e => { if (e.hp <= 0 && !e.dead) { e.dead = true; onKill(e); } });
  if (cb.en.every(e => e.hp <= 0)) return endCombat('win');
  if (window.COOP && COOP.allyTurn(cb)) {
    cb.en.forEach(e => { if (e.hp <= 0 && !e.dead) { e.dead = true; onKill(e); } });
    if (cb.en.every(e => e.hp <= 0)) return endCombat('win');
  }
  if (typeof petTurn === 'function' && petTurn(cb)) {
    cb.en.forEach(e => { if (e.hp <= 0 && !e.dead) { e.dead = true; onKill(e); } });
    if (cb.en.every(e => e.hp <= 0)) return endCombat('win');
  }
  enemyTurn();
}
function enemyTurn() {
  const cb = G.combat, mult = F().enemies;
  const near = cb.en.filter(e => e.hp > 0 && e.dist === 0).length;
  for (const e of cb.en) {
    if (e.hp <= 0) continue; const D = ENEMY[e.id];
    if (e.stun > 0) { e.stun--; continue; }
    if (e.dist > 0) {
      if (D.human && e.gear && IT(e.gear).c === 'gun' && ch(0.6)) enemyHit(e, true);
      else { e.dist = Math.max(0, e.dist - D.sp); cLog(`${D.ic} ${D.n} ${e.dist === 0 ? 'уже рядом!' : 'приближается.'}`, 'dim'); }
      continue;
    }
    enemyHit(e, false, near);
    checkDeath();
    if (!G.combat || G.dead) { UI.closeCombat('dead'); return; }
  }
  cb.turn++;
  checkDeath();
  if (G.dead) return;
  UI.combat();
}
function enemyHit(e, ranged, near) {
  const D = ENEMY[e.id];
  let acc = D.acc - armor() * 0.02 + (near >= 2 && !D.human ? 0.08 : 0);
  if (!ch(acc)) { cLog(`${D.ic} ${D.n} промахивается.`, 'dim'); return; }
  let dmg = R(D.dmg[0], D.dmg[1]) * (D.boss ? 1 : F().enemies * (CH2() ? 1.2 : 1));
  if (e.gear) { const g = IT(e.gear); if (g.dmg) dmg = R(g.dmg[0], g.dmg[1]) * 0.8; }
  dmg = Math.max(1, Math.round(dmg - armor()));
  if (!ranged && ch(mod('block'))) { dmg = Math.max(1, Math.round(dmg / 2)); cLog('🛡️ Блок!', 'good'); }
  let inj = ranged || (e.gear && IT(e.gear).c === 'gun') ? 'bullet' : pick(D.inj);
  if (!ranged && typeof petHit === 'function' && petHit(e, dmg)) return;
  cLog(`💢 ${D.ic} ${D.n} ${ranged ? 'стреляет' : 'бьёт'}: −${dmg}`, 'bad'); SND(ranged ? 'shot' : 'hurt');
  const r = hitPlayer(dmg, ch(clamp(0.45 + mod('injChance'), 0.1, 0.9)) ? inj : 'bruise', null, D.n);
  if (r) cLog(r, 'bad');
  if (inj === 'bite' && F().virus && !D.noVirus && !G.ch.virus && ch(0.12 * mul('virus', 0.1))) { G.ch.virus = G.time; UI.log('🦠 Укус горит огнём… Похоже, вирус. Нужна сыворотка (Левин, кочевой торговец, лаборатории) — у тебя около 4 суток.', 'bad'); }
  G.ch.stress = clamp(G.ch.stress + 4, 0, 100);
}
// урон игроку: часть тела + травма
function hitPlayer(dmg, inj, part, why) {
  G.lastHurt = why;
  if (!F().parts) {
    G.ch.hp -= dmg * 0.55;
    if (inj && INJ[inj] && INJ[inj].bleed >= 1 && ch(0.5)) { G.ch.bleed = 1; return '🩸 Кровотечение!'; }
    return '';
  }
  const p = part || wpick([['torso', 34], ['larm', 14], ['rarm', 14], ['lleg', 14], ['rleg', 14], ['head', 10]]);
  hurtPart(p, dmg);
  if (!inj || inj === 'bruise' && ch(0.5)) return `(${PARTS[p].n})`;
  let t = inj;
  if (t === 'frac' && (p === 'head' || p === 'torso')) t = 'bruise';
  if (dmg >= 14 && (p.endsWith('leg') || p.endsWith('arm')) && ch(0.15)) t = 'frac';
  if (typeof hint === 'function' && t !== 'bruise') setTimeout(() => hint('wound'), 0);
  G.ch.inj.push({ t, part: p, bleed: INJ[t].bleed, band: false, dis: false, dirty: false, inf: 0, prog: 0, born: G.time, splint: false });
  return `${INJ[t].n}: ${PARTS[p].n}` + (INJ[t].bleed ? ' 🩸' : '');
}
function onKill(e) {
  const D = ENEMY[e.id]; G.ch.kills++; xp(D.human ? 'shoot' : 'melee', 1);
  G.w.locs[G.combat.opts.road ? G.travelTo || G.loc : G.loc].kills++;
  if (D.human) G.ch.stress = clamp(G.ch.stress + 12, 0, 100);
  if (D.boss) { G.w.flags[e.id === 'keeper' ? 'keeper_dead' : 'guard_dead'] = true; FEED(`⚔️ победил босса: ${D.ic} ${D.n}`); }
  cLog(`☠️ ${D.ic} ${D.n} повержен.`, 'good');
  // лут на землю
  const ground = [];
  if (D.loot) { const C = CONT[D.loot]; for (let k = R(0, 2); k > 0; k--) { const id = wpick(C.loot); if (IT(id).c === 'bp' || IT(id).c === 'key') continue; invAdd(ground, id, IT(id).c === 'ammo' ? R(3, 8) : 1); } }
  if (D.drop) D.drop.forEach(([id, n]) => invAdd(ground, id, n));
  if (e.gear) { invAdd(ground, e.gear, 1); if (IT(e.gear).ammo) invAdd(ground, IT(e.gear).ammo, R(2, 6)); }
  if (G.combat.opts.road) { ground.forEach(x => G.inv.push(x)); if (ground.length) cLog('Ты подобрал: ' + ground.map(x => IT(x.id).ic + IT(x.id).n).join(', '), 'good'); }
  else if (G.room != null) roomSt(G.room).ground.push(...ground);
}
function endCombat(res) {
  setAct(res === 'win' ? 'отбился' : res === 'fled' ? 'сбежал из боя' : 'осматривается');
  const cb = G.combat; G.combat = null;
  if (G.room != null && !cb.opts.road) {
    const s = roomSt(G.room);
    s.en = s.en.filter(e => e.hp > 0);
    if (res === 'fled' || res === 'talk') { if (res === 'fled') { G.room = null; UI.go('loc'); } }
    if (res === 'win') s.aware = true;
  }
  advance(5);
  if (G.dead) return;
  UI.closeCombat(res, cb);
  if (cb.opts.onEnd) cb.opts.onEnd(res);
  else UI.render();
}

// =====================================================================
//  ПРЕДМЕТЫ: использование
// =====================================================================
function worstInjury(pred) { return G.ch.inj.filter(pred).sort((a, b) => b.bleed - a.bleed || b.inf - a.inf)[0]; }
function useItem(id, quick, target) {
  const it = IT(id), c = G.ch, f = F();
  const e = G.inv.find(x => x.id === id) || (atBase() && G.stash.find(x => x.id === id));
  if (!e) return;
  const src = G.inv.includes(e) ? G.inv : G.stash;
  const consume = () => take(src, id, 1);
  if (it.c === 'food' || it.c === 'drink') {
    if (it.smoke) { consume(); c.lastSmoke = G.time; c.stress = clamp(c.stress + it.stress, 0, 100); UI.log('🚬 Затянулся. Полегчало.'); if (!quick) advance(5); return; }
    const fr = freshness(e);
    consume();
    c.food = clamp(c.food + (it.f || 0), 0, 100); c.drink = clamp(c.drink + (it.d || 0), 0, 100);
    if (it.stress) c.stress = clamp(c.stress + it.stress, 0, 100);
    if (it.rad && f.rad) c.rad = Math.max(0, c.rad + it.rad);
    if (it.btl) invAdd(G.inv, 'bottle', 1);
    SND(it.c === 'drink' ? 'drink' : 'eat'); tutMark('eat');
    let msg = `${it.ic} ${it.c === 'drink' ? 'Выпил' : 'Съел'}: ${it.n}.`;
    if (it.salt) msg += ' Солёная! Пить захотелось ещё сильнее.';
    let pois = it.raw || 0; if (fr >= 1) { pois = Math.max(pois, 0.7); msg += ' Фу, испортилось!'; }
    pois *= mul('eatRaw', 0);
    if (ch(pois)) { if (f.illness || f.parts) { c.ill.poison = 6; msg += ' 🤢 Отравление!'; } else { c.hp -= 8; msg += ' 🤢 Живот скрутило.'; } }
    UI.log(msg, pois && c.ill.poison ? 'bad' : '');
    if (!quick) advance(it.c === 'drink' ? 2 : 10);
    return;
  }
  if (it.c === 'med') {
    const m = it.med; SND('band');
    if (!f.parts) { // простое здоровье
      if (m === 'band') { if (!c.bleed) return UI.toast('Кровотечения нет.'); c.bleed = 0; consume(); UI.log('🩹 Перевязал рану.'); }
      else if (m === 'kit') { consume(); c.bleed = 0; c.hp = Math.min(100, c.hp + 40 * mul('medEff')); UI.log('🧰 Аптечка: +40 здоровья.', 'good'); }
      else if (m === 'pain') { consume(); c.painUntil = G.time + 4 * H; c.hp = Math.min(100, c.hp + 10); UI.log('💉 Боль отступила.'); }
      else return UI.toast('На этой сложности это не нужно.');
      xp('med', 2); if (!quick) advance(5); return;
    }
    if (m === 'band') {
      const j = target || worstInjury(j => !j.band && j.t !== 'frac' && j.t !== 'bruise');
      if (!j) return UI.toast('Нечего перевязывать.');
      j.band = true; j.dirty = !!it.dirty; consume(); xp('med', 2);
      UI.log(`🩹 Перевязал: ${INJ[j.t].n} (${PARTS[j.part].n})${it.dirty ? '. Повязка грязная — может воспалиться.' : '.'}`);
    } else if (m === 'disinf') {
      const j = target || worstInjury(j => !j.dis && j.t !== 'frac' && j.t !== 'bruise');
      if (!j) return UI.toast('Нечего обрабатывать.');
      j.dis = true; j.inf = Math.max(0, j.inf - 30); e.uses = (e.uses || 1) - 1; if (e.uses <= 0) consume(); xp('med', 2);
      UI.log(`🧴 Обработал рану: ${INJ[j.t].n} (${PARTS[j.part].n}). Воспаления не будет.`);
    } else if (m === 'splint') {
      const j = target || G.ch.inj.find(j => j.t === 'frac' && !j.splint);
      if (!j) return UI.toast('Переломов нет.');
      j.splint = true; consume(); xp('med', 3); UI.log(`🦯 Наложил шину: ${PARTS[j.part].n}.`);
    } else if (m === 'antibio') { consume(); c.antibioUntil = G.time + 12 * H; c.ill.cold = Math.max(0, c.ill.cold - 24); UI.log('💊 Антибиотики приняты: воспаление пойдёт на спад.'); }
    else if (m === 'pain') { consume(); c.painUntil = G.time + 4 * H * mul('medEff'); UI.log('💉 Обезболивающее: боль не мешает 4 часа.'); }
    else if (m === 'kit') { consume(); c.inj.forEach(j => { j.band = true; j.dis = true; j.dirty = false; }); for (const p in PARTS) c.parts[p] = Math.min(PARTS[p].max, c.parts[p] + 15 * mul('medEff')); xp('med', 4); UI.log('🧰 Аптечка: все раны обработаны и перевязаны.', 'good'); }
    else if (m === 'antirad') { consume(); c.rad = Math.max(0, c.rad - 80 * mul('medEff')); UI.log('🟡 Антирад: −80 радиации.'); }
    else if (m === 'cold') { consume(); c.ill.cold = Math.max(0, c.ill.cold - 24); UI.log('🤧 Таблетки от простуды приняты.'); }
    else if (m === 'serum') { consume(); if (c.virus) { c.virus = null; UI.log('🧪 Жар отступил. Сыворотка сработала!', 'good'); } else UI.log('🧪 Ничего не почувствовал. Видимо, ты здоров.'); }
    if (!quick) advance(5);
    return;
  }
  if (it.c === 'bp') {
    G.w.bp[it.bp] = true; consume(); xp('craft', 5);
    UI.log(`📐 Ты изучил чертёж: ${it.n.replace('Чертёж: ', '')}. Теперь это можно сделать на базе.`, 'good');
    advance(15); return;
  }
}
// вылить содержимое бутылки (например, морскую воду без опреснителя)
function pourOut(id) { if (!IT(id).btl || !cnt(G.inv, id)) return; const n = cnt(G.inv, id); take(G.inv, id, n); invAdd(G.inv, 'bottle', n); UI.log(`🫗 Вылил: ${IT(id).n} ×${n}. Бутылки свободны.`); UI.render(); }
function equip(e) {
  const it = IT(e.id); let slot = it.slot;
  if (it.c === 'melee' || it.c === 'gun') slot = 'weapon';
  if (it.c === 'art') {
    const i = G.eq.art.findIndex(x => !x); const idx = i < 0 ? 0 : i;
    if (G.eq.art[idx]) G.inv.push(G.eq.art[idx]);
    G.eq.art[idx] = e; G.inv.splice(G.inv.indexOf(e), 1);
    UI.log(`${it.ic} Артефакт на поясе: ${it.n}.`); return;
  }
  if (!slot) return;
  if (G.eq[slot]) G.inv.push(G.eq[slot]);
  G.eq[slot] = e; const i = G.inv.indexOf(e); if (i >= 0) G.inv.splice(i, 1);
  UI.log(`${it.ic} Экипировано: ${it.n}.`);
}
function unequip(slot, idx) {
  if (slot === 'art') { if (G.eq.art[idx]) { G.inv.push(G.eq.art[idx]); G.eq.art[idx] = null; } return; }
  if (G.eq[slot]) { G.inv.push(G.eq[slot]); G.eq[slot] = null; }
}
function drop(e, n) {
  const i = G.inv.indexOf(e); if (i < 0) return;
  const q = n || e.n;
  if (G.room != null) { const s = roomSt(G.room); const copy = Object.assign({}, e, { n: q }); s.ground.push(copy); }
  e.n -= q; if (e.n <= 0) G.inv.splice(i, 1);
}
function toStash(e, n) { const i = G.inv.indexOf(e); if (i < 0) return; const q = n || e.n; const copy = Object.assign({}, e, { n: q }); if (IT(e.id).c === 'mat' || IT(e.id).c === 'ammo' || (!IT(e.id).sp && !copy.dur && !copy.uses && !['melee', 'gun', 'wear', 'art'].includes(IT(e.id).c))) invAdd(G.stash, e.id, q); else G.stash.push(copy); e.n -= q; if (e.n <= 0) G.inv.splice(i, 1); }
function fromStash(e, n) { const i = G.stash.indexOf(e); if (i < 0) return; const q = n || e.n; const copy = Object.assign({}, e, { n: q }); if (!IT(e.id).sp && !copy.dur && !copy.uses && !['melee', 'gun', 'wear', 'art'].includes(IT(e.id).c)) invAdd(G.inv, e.id, q); else G.inv.push(copy); e.n -= q; if (e.n <= 0) G.stash.splice(i, 1); }
function stashAllMats() { for (const e of G.inv.slice()) if (['mat', 'val', 'bp', 'quest'].includes(IT(e.id).c) && e.id !== 'rpart') toStash(e); }
function repairWeapon() {
  const w = G.eq.weapon; if (!w || !w.dur) return UI.toast('Нечего чинить.');
  if (!allCnt('tape')) return UI.toast('Нужен скотч.');
  allTake('tape', 1); w.dur = Math.min(IT(w.id).dur, w.dur + 25 + skill('craft') * 5); xp('craft', 2); advance(15); UI.log(`🩶 Подлатал ${IT(w.id).n} скотчем.`); UI.render();
}

// =====================================================================
//  ЛОКАЦИОННЫЕ ДЕЙСТВИЯ
// =====================================================================
function doFish() {
  setAct('🎣 рыбачит');
  if (!cnt(G.inv, 'rod')) return UI.toast('Нужна удочка.');
  SND('splash'); advance(60); if (G.dead) return;
  const n = ch(0.45 + skill('surv') * 0.07) ? R(1, 2 + Math.floor(skill('surv') / 2)) + mod('fish') : 0;
  if (n) invAdd(G.inv, 'fish', n);
  xp('surv', 3);
  UI.log(n ? `🎣 Улов: ${n} рыб(ы).` : '🎣 Не клюёт…', n ? 'good' : 'dim'); UI.render();
}
const WATER_SRC = { sea: ['seawater', '🌊 Ты набрал морской воды. Пить её нельзя — сначала опреснить.'], well: ['dwater', '🪣 Ты набрал воды из колодца. Её лучше прокипятить.'], stream: ['dwater', '💧 Ты набрал воды из ручья. Её лучше прокипятить.'] };
function collectWater() {
  const src = WATER_SRC[L().water]; if (!src) return;
  if (L().water === 'sea' && !(atBase() && G.w.struct.distill)) return UI.toast('Морскую воду пить нельзя, а кипячение соль не убирает. Сначала построй опреснитель на базе — или набери воды в колодце деревни / ручье в лесу.');
  const n = cnt(G.inv, 'bottle'); if (!n) return UI.toast('Нужны пустые бутылки.');
  take(G.inv, 'bottle', n); invAdd(G.inv, src[0], n);
  advance(5 + n * 2); if (G.dead) return;
  if (L().water !== 'sea') noise(3);
  UI.log(`${src[1]} (${n} бут.)`); UI.render();
}
function doForage() {
  setAct('🌿 собирает');
  advance(40); if (G.dead) return;
  const got = []; for (let k = R(1, 2) + Math.floor(skill('surv') / 2) + mod('forage'); k > 0; k--) { const id = wpick([['berries', 4], ['mushroom', 3], ['herbs', 2], ['wood', 3], ['stick', 1]]); invAdd(G.inv, id, 1); got.push(IT(id).ic + IT(id).n); }
  xp('surv', 2); UI.log('🌿 Собрал: ' + got.join(', ')); UI.render();
}
function doChop() {
  const w = G.eq.weapon && IT(G.eq.weapon.id).chop;
  if (!w) return UI.toast('Нужен топор в руках.');
  advance(30); if (G.dead) return; const n = R(2, 3); invAdd(G.inv, 'wood', n); damageWeapon(2); noise(10); xp('surv', 1); UI.log(`🪓 Нарубил дров: ${n}.`); UI.render();
}
function doHunt() {
  setAct('🦌 охотится');
  advance(80); if (G.dead) return;
  xp('surv', 3);
  if (ch(0.25)) { UI.log('🐾 Следы привели тебя прямо к стае…', 'bad'); startCombat(spawnList([['dog', 2, 3]]), { road: true, onEnd: () => UI.render() }); return; }
  const w = curWeapon(); const gun = w && w.c === 'gun' && cnt(G.inv, w.ammo);
  const p = 0.3 + skill('surv') * 0.06 + mod('hunt') + (gun ? 0.3 : 0) + (G.eq.weapon && IT(G.eq.weapon.id).reach ? 0.1 : 0);
  if (gun) { take(G.inv, w.ammo, 1); noise(20); }
  if (ch(p)) { invAdd(G.inv, 'meat', R(2, 4)); invAdd(G.inv, 'rag', 1); UI.log('🦌 Удачная охота! Мясо и шкура (тряпка).', 'good'); xp('surv', 4); }
  else UI.log('🦌 Олень ушёл. Ты только устал.', 'dim');
  UI.render();
}
function sleepHere(hours) {
  const base = atBase(), bed = base && G.w.struct.bed > 0;
  const room = G.room != null ? roomSt(G.room) : null;
  if (!inShelter() && room && room.en.some(e => e.hp > 0)) return UI.toast('Здесь враги — не уснуть.');
  if (G.ch.energy > 85) return UI.toast('Ты не хочешь спать.');
  let mins = hours ? hours * H : (() => { const h = hour(); return ((h >= 7 ? 31 - h : 7 - h) * H); })();
  mins = Math.min(mins, 12 * H);
  UI.log(`😴 Ты ложишься спать${bed ? ' в кровать' : ''}…`, 'dim'); setAct('😴 спит');
  if (G.coop) FEED(`😴 лёг спать на ~${Math.round(mins / 60)} ч — общее время пойдёт быстрее`);
  let slept = 0;
  while (slept < mins && !G.dead) {
    const step = Math.min(60, mins - slept);
    const ok = advance(step, { sleep: true, bed, interruptible: true });
    slept += step;
    if (!ok) { UI.log('Сон прерван!', 'warn'); break; }
    if (!inShelter() && ch(0.06 * (1 + L().dg) * F().enemies)) { UI.log('😱 Тебя разбудил хрип рядом!', 'bad'); startCombat(spawnList([[isNight() ? 'runner' : 'zombie', 1, 2]]), { road: true, onEnd: () => UI.render() }); return; }
    if (G.ch.energy >= 100) break;
  }
  if (!G.dead && base && slept >= 120) tutMark('sleep');
  if (!G.dead) UI.log(`☀️ Проснулся в ${clock()}. Спал ${Math.round(slept / 6) / 10} ч.`);
  UI.render();
}
// переждать время в укрытии (когда спать не хочется, а ночью идти опасно)
function waitHere(hours) {
  if (!inShelter()) return UI.toast('Пережидать безопасно только в укрытии.');
  setAct('⏳ пережидает'); const ok = advance((hours || 1) * H, { interruptible: true });
  UI.log(ok ? `⏳ Ты переждал ${hours || 1} ч. Сейчас ${clock()}.` : '⏳ Ожидание прервано!', ok ? 'dim' : 'warn'); UI.render();
}
function petCat() {
  if (G.w.catAway && !(G.pet && G.pet.type === 'cat')) return UI.toast('Кота нет на базе.');
  if (G.time - G.w.catAt < 6 * H) return UI.toast('Кот спит и не хочет, чтобы его трогали.');
  G.w.catLove = (G.w.catLove || 0) + 1; if (G.w.catLove === 4) UI.log('🐈 Кот, похоже, к тебе привязался. Его можно взять с собой (База).', 'good');
  SND('purr'); G.w.catAt = G.time; G.ch.stress = Math.max(0, G.ch.stress - 20); advance(10);
  UI.log(pick(['🐈 Кот замурчал. Стало спокойнее.', '🐈 Кот принёс дохлую мышь. Видимо, это подарок.', '🐈 Кот потёрся о ногу и ушёл по своим делам.']), 'good');
  if (ch(0.15)) { invAdd(G.inv, 'fish', 1); UI.log('🐈 …и притащил рыбу. Хороший кот.', 'good'); }
  UI.render();
}

// =====================================================================
//  БАЗА, КРАФТ
// =====================================================================
function buildCost(c) { const o = {}; for (const [k, v] of Object.entries(c || {})) o[k] = IT(k).c === 'quest' ? v : Math.max(1, Math.round(v * mul('build', 0.5))); return o; }
function canBuild(id) {
  const S = STRUCT[id], lv = G.w.struct[id] || 0, nx = S.lv[lv + 1];
  if (!nx) return 'max';
  if (S.ch2 && !CH2()) return 'ch2';
  if (S.bp && !G.w.bp[S.bp]) return 'bp';
  return hasAll(buildCost(nx.c)) ? '' : 'res';
}
function build(id) {
  if (canBuild(id)) return;
  const S = STRUCT[id], lv = G.w.struct[id] || 0, nx = S.lv[lv + 1];
  for (const [k, v] of Object.entries(buildCost(nx.c))) allTake(k, v);
  advance(60 + lv * 30); if (G.dead) return;
  G.w.struct[id] = lv + 1; xp('craft', 6); SND('build'); FEED(`🏗️ построил: ${S.ic} ${nx.n}`);
  if (id === 'walls') G.w.wallHp = 100;
  UI.log(`🏗️ Построено: ${S.ic} ${nx.n}.`, 'good');
  if (G.w.struct.fire && G.w.struct.bed && !G.w.flags.camp_ready) { G.w.flags.camp_ready = true; }
  if (id === 'radio') { G.w.flags.radio_built = true; radioMsg(); }
  if (id === 'bunks' && typeof hint === 'function') hint('npc');
  if (id === 'boat' && lv + 1 >= 2) { G.w.flags.boat_ready = true; UI.event({ title: '⛵ Лодка готова', cls: 'good', text: 'Ядро встало в двигатель, осколки загудели. Лодка дрожит у пристани, будто сама рвётся в пролив.\n\nНа карте открылся путь к Острову-8 (от базы, 2 часа по воде).', choices: [{ t: 'Отлично' }] }); }
  checkQuests(); UI.render();
}
function radioMsg() {
  SND('radio');
  UI.event({ title: '📻 Эфир ожил', text: '…шшш… «Говорит штаб карантинной зоны. Остров Остров-7 закрыт. Причина — неконтролируемая активность установки «Аппарат» в НИИ. Эвакуации не будет. Повторяю…» …шшш…\n\nКто-то поставил на острове крест. Но если Аппарат — причина, может, его можно остановить?\n\nНовая цель: добраться до НИИ. Нужен пропуск — Сержант на маяке может знать, где его взять.', choices: [{ t: 'Понятно' }] });
}
function repairWalls() {
  if (!G.w.struct.walls) return;
  if (!hasAll({ planks: 2, nails: 4 })) return UI.toast('Нужно: 2 доски и 4 гвоздя.');
  allTake('planks', 2); allTake('nails', 4); advance(30); G.w.wallHp = Math.min(100, G.w.wallHp + 50); xp('craft', 2); UI.log('🔨 Укрепления подлатаны.'); UI.render();
}
// ---------------- костёр в поле ----------------
const campHere = () => !!(G.campfire && G.campfire.loc === G.loc && G.campfire.until > G.time && !G.traveling);
function makeCamp() {
  if (campHere()) return UI.toast('Костёр уже горит.');
  if (!cnt(G.inv, 'lighter')) return UI.toast('Нужна зажигалка.');
  if (cnt(G.inv, 'wood') < 2) return UI.toast('Нужно 2 дров.');
  take(G.inv, 'wood', 2); advance(15); if (G.dead) return;
  const mins = weather().wet ? 90 : 180;
  G.campfire = { loc: G.loc, until: G.time + mins }; SND('fire'); setAct('🔥 сидит у костра');
  noise(isNight() ? 15 : 6); xp('surv', 2);
  UI.log(`🔥 Ты развёл костёр. Прогорит ~${mins} мин${weather().wet ? ' (дождь его быстро зальёт)' : ''}. Можно жарить и кипятить.${isNight() ? ' Ночью огонь видно издалека.' : ''}`, 'good');
  UI.render();
}
function stationOk(st) {
  if (!st) return true;
  const s = G.w.struct;
  if (st === 'fire') return (atBase() && s.fire > 0) || campHere();
  if (st === 'smoke') return atBase() && s.smoke > 0;
  if (st === 'distill') return atBase() && s.distill > 0 && s.fire > 0;
  if (st === 'bench') return atBase() && s.bench > 0;
  if (st === 'bench2') return atBase() && s.bench > 1;
  return false;
}
const STATION_N = { distill: 'опреснитель и очаг', fire: 'очаг', smoke: 'коптильня', bench: 'верстак', bench2: 'мастерская' };
function recipeState(r) {
  if (r.ch2 && !CH2()) return 'bp';
  if (r.bp && !G.w.bp[r.bp]) return 'bp';
  if (!stationOk(r.st)) return 'st';
  return hasAll(r.need) ? '' : 'res';
}
function craft(r) {
  setAct(`мастерит: ${r.n}`);
  if (recipeState(r)) return;
  for (const [k, v] of Object.entries(r.need)) allTake(k, v);
  advance(Math.round(r.t * (1 - skill('craft') * 0.06) * mul('craftTime', 0.3))); if (G.dead) return;
  for (const [k, v] of Object.entries(r.out)) invAdd(G.inv, k, v * (mod('ammoCraft') > 0 && ['ammo', 'raid'].includes(IT(k).c) ? 2 : 1));
  if (ch(mod('refund'))) { const [k] = Object.entries(r.need).find(([id]) => !['melee', 'gun', 'wear', 'quest'].includes(IT(id).c)) || []; if (k) { invAdd(G.inv, k, 1); UI.log(`♻️ Сэкономил: ${IT(k).ic} ${IT(k).n}.`, 'good'); } }
  SND(r.st === 'fire' ? 'fire' : 'craft'); if (r.id === 'dband') tutMark('band');
  xp(r.st === 'fire' ? 'surv' : 'craft', 2);
  UI.log(`🔨 Сделано: ${r.n}.`); UI.render();
}

// =====================================================================
//  ТОРГОВЛЯ И КВЕСТЫ
// =====================================================================
const buyPrice = (tr, id) => Math.ceil(IT(id).v * (tr === 'nomad' ? 1.6 : 1.3) * (1 - (G.w.rep[tr] || 0) * 0.05) * mul('buy', 0.5));
const sellPrice = (tr, id) => { const T = TRADERS[tr]; if (!T.buys.includes(IT(id).c)) return 0; return Math.max(1, Math.floor(IT(id).v * 0.45 * (1 + (G.w.rep[tr] || 0) * 0.05) * (IT(id).c === 'art' && T.artBonus ? T.artBonus : 1) * mul('sell', 0.5))); };
function buy(tr, id) {
  const p = buyPrice(tr, id); if (G.money < p) return UI.toast('Не хватает денег.');
  G.money -= p; const n = IT(id).c === 'ammo' ? 10 : id === 'bolts' ? 10 : 1; invAdd(G.inv, id, n);
  UI.log(`💰 Куплено: ${IT(id).ic} ${IT(id).n}${n > 1 ? ' ×' + n : ''} за ${p}₽.`); UI.render();
}
function sell(tr, e, all) {
  const p = sellPrice(tr, e.id); if (!p) return;
  const n = all ? e.n : 1; G.money += p * n;
  const i = G.inv.indexOf(e); e.n -= n; if (e.n <= 0) G.inv.splice(i, 1);
  UI.log(`💰 Продано: ${IT(e.id).ic} ${IT(e.id).n} ×${n} за ${p * n}₽.`); UI.render();
}
function questProgress(qid) {
  const q = QUESTS[qid];
  if (q.type === 'items') return Object.entries(q.need).map(([k, v]) => `${IT(k).ic} ${Math.min(cnt(G.inv, k), v)}/${v}`).join(', ');
  if (q.type === 'kill') return `${Math.min(G.w.locs[q.loc].kills - (G.w.qstart[qid] || 0), q.count)}/${q.count}`;
  if (q.type === 'count') return `${Math.min(G.w.counters[q.key] - (G.w.qstart[qid] || 0), q.count)}/${q.count}`;
  if (q.type === 'art') return G.inv.some(x => IT(x.id).c === 'art') ? 'есть артефакт' : 'нет артефакта';
  return G.w.flags[q.flag] ? 'выполнено' : '—';
}
function questDone(qid) {
  const q = QUESTS[qid];
  if (q.type === 'items') return Object.entries(q.need).every(([k, v]) => cnt(G.inv, k) >= v);
  if (q.type === 'kill') return G.w.locs[q.loc].kills - (G.w.qstart[qid] || 0) >= q.count;
  if (q.type === 'count') return G.w.counters[q.key] - (G.w.qstart[qid] || 0) >= q.count;
  if (q.type === 'art') return G.inv.some(x => IT(x.id).c === 'art' && x.id !== 'crown');
  return !!G.w.flags[q.flag];
}
function acceptQuest(qid) {
  const q = QUESTS[qid]; G.w.quests[qid] = 'active';
  if (q.type === 'kill') G.w.qstart[qid] = G.w.locs[q.loc].kills;
  if (q.type === 'count') G.w.qstart[qid] = G.w.counters[q.key];
  UI.log(`📓 Новое задание: ${q.n}.`, 'good'); UI.render();
}
function turnIn(qid) {
  const q = QUESTS[qid]; if (!questDone(qid)) return;
  if (q.type === 'items') for (const [k, v] of Object.entries(q.need)) take(G.inv, k, v);
  if (q.type === 'art') { const a = G.inv.find(x => IT(x.id).c === 'art' && x.id !== 'crown'); G.inv.splice(G.inv.indexOf(a), 1); }
  giveRew(qid); UI.render();
}
function giveRew(qid) {
  const q = QUESTS[qid], r = q.rew; G.w.quests[qid] = 'done'; FEED(`✅ выполнил задание «${q.n}»`);
  const parts = [];
  if (r.money) { G.money += r.money; parts.push(r.money + '₽'); }
  if (r.items) for (const [k, v] of Object.entries(r.items)) { invAdd(G.inv, k, v); parts.push(`${IT(k).ic} ${IT(k).n}${v > 1 ? ' ×' + v : ''}`); }
  if (r.rep && q.g in G.w.rep) { G.w.rep[q.g] += r.rep; parts.push(`репутация +${r.rep}`); }
  if (r.xp) for (const [k, v] of Object.entries(r.xp)) xp(k, v);
  SND('quest');
  UI.event({ title: `✅ Задание выполнено: ${q.n}`, cls: 'good', text: parts.length ? 'Награда: ' + parts.join(', ') : 'Так держать.', choices: [{ t: 'Отлично' }] });
  if (q.next) { G.w.quests[q.next] = 'active'; UI.log(`📓 Новая цель: ${QUESTS[q.next].n}.`, 'good'); }
}
function checkQuests() { for (const qid in G.w.quests) if (G.w.quests[qid] === 'active' && QUESTS[qid].g === 'main' && questDone(qid)) giveRew(qid); }
function addNote(id) { if (!G.w.notes.includes(id)) { G.w.notes.push(id); UI.log(`📜 Найдена записка: «${NOTES[id].t}». (Журнал)`, 'good'); } }

// ---------------- скрытная атака ----------------
function sneakAttack(i) {
  const s = roomSt(G.room), e = s.en[i], D = ENEMY[e.id], ms = meleeStats();
  let d = R(ms.dmg[0], ms.dmg[1]) * (1 + skill('melee') * 0.08) * (D.boss ? 1.5 : 3) * (1 + mod('sneakDmg')) * mul('meleeDmg', 0.3);
  d = Math.max(1, Math.round(d - (D.arm || 0)));
  e.hp -= d; damageWeapon(R(1, 3)); xp('stealth', 4); xp('melee', 2); noise(ms.noise * 0.5);
  advance(2);
  UI.log(`🗡️ Удар из засады по ${D.ic} ${D.n}: −${d}${e.hp <= 0 ? ' — наповал!' : ''}`, 'good');
  if (e.hp <= 0) {
    G.combat = { en: s.en, opts: { room: G.room }, turn: 0, log: [] }; e.dead = true; onKill(e); G.combat = null;
    s.en = s.en.filter(x => x.hp > 0);
    if (!s.en.length) { UI.render(); return; }
    if (ch(clamp(0.5 - skill('stealth') * 0.05 + G.noise / 200, 0.1, 0.9))) { UI.log('⚠️ Остальные услышали!', 'bad'); s.aware = true; startCombat(s.en, { room: G.room }); return; }
    UI.log('🐾 Остальные ничего не заметили.', 'good'); UI.render(); return;
  }
  s.aware = true; startCombat(s.en, { room: G.room });
}

// ---------------- волна Кровавой ночи (интерактивно на базе) ----------------
function hordeWave(choice, wp) {
  const per = defense() / 3; let contrib = 0, txt = [];
  if (choice === 'shoot') {
    const w = curWeapon(); const have = w && w.c === 'gun' ? cnt(G.inv, w.ammo) : 0;
    const shots = Math.min(8, have); take(G.inv, w.ammo, shots);
    contrib = shots * (w.dmg[0] + w.dmg[1]) / 2 / 5 * (1 + skill('shoot') * 0.1); xp('shoot', shots);
    txt.push(`🔫 Ты стреляешь с крыши: ${shots} выстрелов.`);
  } else if (choice === 'melee') {
    const ms = meleeStats(); contrib = (ms.dmg[0] + ms.dmg[1]) * (1 + skill('melee') * 0.12); xp('melee', 6); damageWeapon(R(5, 10));
    const hits = R(1, 3); for (let k = 0; k < hits; k++) { const r = hitPlayer(R(4, 10), pick(['scratch', 'lacer', 'bite', 'bruise']), null, 'Кровавая ночь'); if (F().virus && !G.ch.virus && ch(0.06)) G.ch.virus = G.time; if (r) txt.push('💢 ' + r); }
    txt.push(`⚔️ Ты держишь проход (${ms.n}).`);
  } else txt.push('🕳️ Ты прячешься в подвале и слушаешь, как ломают стены.');
  const left = Math.max(0, Math.round(wp - per - contrib));
  txt.push(`Натиск ${Math.round(wp)} · укрепления ${Math.round(per)} · ты ${Math.round(contrib)}`);
  if (left > 0) { const m = wallsHit(left); txt.push(m || '🧱 Стены трещат, но держатся.'); }
  else txt.push('🛡️ Волна отбита!');
  if (G.w.struct.traps && ch(0.4)) txt.push('🪤 Ловушки сработали.');
  G.ch.stress = clamp(G.ch.stress + 10, 0, 100);
  checkDeath();
  return txt.join('\n');
}

// ---------------- маршруты ----------------
function route(from, to) {
  if (from === to) return { path: [], mins: 0 };
  const dist = {}, prev = {}, Q = new Set(Object.keys(LOCS));
  for (const k of Q) dist[k] = Infinity; dist[from] = 0;
  while (Q.size) {
    let u = null; for (const k of Q) if (u === null || dist[k] < dist[u]) u = k;
    if (dist[u] === Infinity) break; Q.delete(u); if (u === to) break;
    for (const [v, m] of Object.entries(LOCS[u].links)) if (Q.has(v) && !(LOCS[v].ch2 && (!CH2() || !(boatReady() || (typeof iceRoute === 'function' && iceRoute())))) && !(LOCS[v].lock && v !== to && !cnt(G.inv, LOCS[v].lock)) && dist[u] + m < dist[v]) { dist[v] = dist[u] + m; prev[v] = u; }
  }
  if (dist[to] === Infinity) return null;
  const path = []; let c = to; while (c !== from) { path.unshift(c); c = prev[c]; }
  return { path, mins: dist[to] };
}
function goTo(dest) {
  const r = route(G.loc, dest); if (!r || !r.path.length) return;
  G.route = r.path.slice(1); G.routeDest = dest;
  travel(r.path[0]);
}
function continueRoute() { if (!G.route || !G.route.length) return; const n = G.route.shift(); travel(n); }
function cancelRoute() { G.route = []; G.routeDest = null; }
const SHELTERS = () => Object.keys(LOCS).filter(k => LOCS[k].shelter);
function nearestShelter() { let best = null; for (const k of SHELTERS()) { const r = route(G.loc, k); if (r && (!best || r.mins < best.mins)) best = { loc: k, mins: r.mins }; } return best; }

// ---------------- быстрые действия ----------------
function bestOf(list, score) { let b = null, bs = -1e9; for (const e of list) { const s = score(e); if (s > bs) { bs = s; b = e; } } return bs > -1e8 ? b : null; }
function quickFix(kind) {
  const pool = atBase() ? G.inv.concat(G.stash) : G.inv;
  let e = null;
  if (kind === 'eat') e = bestOf(pool.filter(x => IT(x.id).c === 'food' && (IT(x.id).f || 0) > 0), x => { const it = IT(x.id); return (it.f || 0) - (it.raw ? 40 : 0) - (freshness(x) >= 1 ? 80 : 0) + (freshness(x) > 0.6 ? 15 : 0); });
  if (kind === 'drink') e = bestOf(pool.filter(x => IT(x.id).c === 'drink' && (IT(x.id).d || 0) > 0 && !IT(x.id).salt && x.id !== 'vodka'), x => (IT(x.id).d || 0) - (IT(x.id).raw ? 40 : 0));
  if (kind === 'bleed') e = bestOf(pool.filter(x => IT(x.id).med === 'band' || IT(x.id).med === 'kit'), x => IT(x.id).med === 'kit' ? 1 : IT(x.id).dirty ? 2 : 3);
  if (kind === 'pain') e = pool.find(x => IT(x.id).med === 'pain');
  if (kind === 'sleep') { if (inShelter()) return sleepHere(); return UI.toast('Спать безопаснее в укрытии: база, деревня, маяк, метеостанция.'); }
  if (!e) return UI.toast({ eat: 'Нет подходящей еды.', drink: 'Нет питья. Набери воды и вскипяти.', bleed: 'Нечем перевязать. Сделай повязку из тряпки.', pain: 'Нет обезболивающего.' }[kind] || 'Нечего использовать.');
  useItem(e.id); UI.render();
}
function searchAll() {
  if (G.room == null) return;
  const d = roomDef(G.room); let n = 0;
  for (let k = 0; k < (d.cont || []).length; k++) {
    if (G.combat || G.dead || G.room == null) break;
    if (!contReady(G.room, k)) continue;
    searchCont(k); n++;
  }
  if (!n) UI.toast('Здесь уже всё обыскано.');
}
function craftMax(r) { let n = 0; while (!recipeState(r) && n < 30 && !G.dead) { craft(r); n++; } if (n > 1) UI.log(`🔨 Сделано ×${n}: ${r.n}.`); }

// ---------------- случайные события дня ----------------
const EVTS = {
  drop:  { n: 'Сброс гуманитарки', ic: '🪂', dur: 24, locs: ['beach', 'forest', 'farm', 'gas', 'post', 'swamp', 'meteo'] },
  camp:  { n: 'Лагерь мародёров', ic: '⛺', dur: 48, locs: ['forest', 'farm', 'gas', 'beach', 'swamp'] },
  nomad: { n: 'Кочевой торговец', ic: '🧳', dur: 24, locs: ['village', 'forest', 'gas', 'lighthouse', 'farm'] },
  fog:   { n: 'Туман с тварями', ic: '🌫️', dur: 12 },
};
const activeEvents = () => (G.w.events || []).filter(e => e.until > G.time && !e.done);
const eventsAt = loc => activeEvents().filter(e => e.loc === loc);
const fogEvent = () => activeEvents().some(e => e.type === 'fog');
function dailyEvent(force) {
  G.w.events = (G.w.events || []).filter(e => e.until > G.time && !e.done);
  const first = !G.w.flags.firstDrop && day() >= 2;
  if (!force && !first && (day() < 2 || !ch(0.6))) return;
  const busy = new Set(activeEvents().map(e => e.type));
  let type = force || (first ? 'drop' : wpick([['drop', 4], ['camp', 3], ['nomad', 3], ['fog', 2]].filter(([k]) => !busy.has(k))));
  if (!type) return;
  if (first) G.w.flags.firstDrop = true;
  const E = EVTS[type], ev = { id: type + G.time, type, until: G.time + E.dur * H, loc: E.locs ? pick(E.locs) : null };
  if (type === 'camp') ev.en = spawnList([['raider', 2, 3]]);
  G.w.events.push(ev);
  const where = ev.loc ? `${LOCS[ev.loc].ic} ${LOCS[ev.loc].n}` : '';
  if (type === 'drop') { SND('heli'); UI.event({ title: '🪂 Сброс гуманитарки', text: `Над островом прогудел вертолёт и сбросил контейнер на парашюте. Он упал в локации ${where}.\n\nПока его не нашли другие — там может быть еда, медикаменты и патроны. Контейнер пролежит сутки.`, choices: [{ t: 'Понял' }] }); }
  if (type === 'camp') UI.event({ title: '⛺ Мародёры', text: (G.w.struct.radio ? '📻 По рации перехвачены переговоры: ' : 'Ночью был виден дым от костров: ') + `мародёры разбили лагерь в локации ${where}. У них наверняка есть припасы. Пробудут там двое суток.`, choices: [{ t: 'Учту' }] });
  if (type === 'nomad') UI.event({ title: '🧳 Кочевой торговец', text: `Говорят, по острову бродит торговец с редкими вещами. Сегодня его видели в локации ${where}. Задерживается он ненадолго.`, choices: [{ t: 'Интересно' }] });
  if (type === 'fog') { G.weather = { id: 'fog', until: ev.until }; UI.event({ title: '🌫️ Туман с тварями', cls: 'bad', text: 'Остров затянуло густым туманом. Где-то в нём хрипят и бегают — тварей стало заметно больше. Туман продержится около 12 часов.\n\nПрятаться в тумане проще, но и нарваться легче.', choices: [{ t: 'Осторожно' }] }); }
}
function openDrop(ev) {
  if (!ev.checked) {
    ev.checked = true;
    if (ch(0.45)) { UI.log('⚠️ У контейнера уже кто-то есть!', 'bad'); startCombat(spawnList([['raider', 1, 2]]), { road: true, onEnd: res => { if (res === 'win') lootDrop(ev); else UI.render(); } }); return; }
  }
  lootDrop(ev);
}
function lootDrop(ev) {
  advance(20); if (G.dead) return;
  const got = { ration: 2, bandage: 3, water: 2, medkit: 1, antibio: 1 };
  got[pick(['a9', 'a545', 'a12'])] = R(8, 16);
  if (ch(0.3)) got.bag3 = 1; if (ch(0.3)) got.antirad = 2; if (ch(0.2)) got.vest = 1;
  for (const [k, v] of Object.entries(got)) invAdd(G.inv, k, v);
  ev.done = true; SND('pickup'); xp('search', 4); FEED(`🪂 вскрыл гуманитарку (${L().n})`);
  UI.event({ title: '🪂 Контейнер вскрыт', cls: 'good', text: 'Внутри: ' + Object.entries(got).map(([k, v]) => `${IT(k).ic} ${IT(k).n}${v > 1 ? ' ×' + v : ''}`).join(', '), choices: [{ t: 'Отлично' }] });
}
function campAttack(ev) {
  const alive = ev.en.filter(e => e.hp > 0); if (!alive.length) return;
  if (ch(stealthChance())) { alive.forEach(e => e.hp = Math.ceil(e.hp * 0.6)); UI.log('🗡️ Ты подкрался к лагерю и напал первым!', 'good'); xp('stealth', 4); }
  startCombat(alive, { road: true, onEnd: () => { ev.en = ev.en.filter(e => e.hp > 0); if (!ev.en.length) { ev.cleared = true; FEED(`⛺ зачистил лагерь мародёров (${L().n})`); UI.log('⛺ Лагерь мародёров зачищен. Можно обыскать.', 'good'); } UI.render(); } });
}
function campSteal(ev) {
  advance(25); if (G.dead) return;
  if (ch(stealthChance() * 0.8)) {
    const got = []; for (let k = R(2, 3); k > 0; k--) { const id = wpick(CONT.milcrate.loot); if (IT(id).c === 'bp') continue; const n = IT(id).c === 'ammo' ? R(5, 12) : 1; invAdd(G.inv, id, n); got.push(IT(id).ic + IT(id).n); }
    ev.stolen = true; xp('stealth', 6); SND('pickup');
    UI.log('🐾 Ты незаметно стащил из лагеря: ' + (got.join(', ') || 'ничего ценного'), 'good'); UI.render();
  } else { UI.log('⚠️ Тебя заметили часовые!', 'bad'); startCombat(ev.en.filter(e => e.hp > 0), { road: true, onEnd: () => { ev.en = ev.en.filter(e => e.hp > 0); if (!ev.en.length) ev.cleared = true; UI.render(); } }); }
}
function campLoot(ev) {
  advance(25); if (G.dead) return;
  const got = []; const roll = (ct, n) => { for (let k = 0; k < n; k++) { const id = wpick(CONT[ct].loot); if (IT(id).c === 'bp' && G.w.bp[IT(id).bp]) continue; const q = IT(id).c === 'ammo' ? R(5, 12) : 1; invAdd(G.inv, id, q); got.push(IT(id).ic + IT(id).n); } };
  roll('milcrate', 3); roll('safe', 2); ev.done = true; SND('pickup');
  UI.event({ title: '⛺ Добыча мародёров', cls: 'good', text: 'Ты забрал: ' + got.join(', '), choices: [{ t: 'Забрать' }] });
}
function wounded() {
  if (G.dead || G.combat) return;
  const hasB = cnt(G.inv, 'bandage') || cnt(G.inv, 'dband'), hasA = cnt(G.inv, 'antibio');
  UI.event({ title: '🩸 Раненый незнакомец', text: 'У стены сидит человек, зажимая рану на боку. «Эй… помоги. Я не опасен. Мне бы перевязаться…»', choices: [
    { t: hasB ? '🩹 Отдать бинт' : '🩹 Отдать бинт (нет)', fn: () => { if (!hasB) return UI.toast('Нечего дать.'); take(G.inv, cnt(G.inv, 'bandage') ? 'bandage' : 'dband', 1); const id = pick(['canned', 'a9', 'cigs', 'water', 'picks', 'watch']); invAdd(G.inv, id, IT(id).c === 'ammo' ? 8 : 1); G.ch.stress = Math.max(0, G.ch.stress - 10); UI.log(`🤝 «Спасибо. Держи — мне уже не пригодится». Он дал тебе ${IT(id).ic} ${IT(id).n}.`, 'good'); UI.render(); } },
    { t: hasA ? '💊 Отдать антибиотики' : '💊 Отдать антибиотики (нет)', fn: () => { if (!hasA) return UI.toast('Нечего дать.'); take(G.inv, 'antibio', 1); const id = pick(['bp_traps', 'bp_rain', 'bp_smoke', 'k_armory', 'antirad', 'bag2', 'medkit']); invAdd(G.inv, id, 1); G.ch.stress = Math.max(0, G.ch.stress - 15); UI.log(`🤝 «Ты спас мне жизнь. Вот, возьми самое ценное, что есть»: ${IT(id).ic} ${IT(id).n}.`, 'good'); UI.render(); } },
    ...(typeof npcOffer === 'function' && npcs().length < bunkCap() && (hasB || hasA) ? [{ t: '🏘️ Перевязать и забрать на базу', fn: () => { take(G.inv, cnt(G.inv, 'bandage') ? 'bandage' : cnt(G.inv, 'dband') ? 'dband' : 'antibio', 1); inviteNpc(newNpc(), 'спасён тобой'); UI.render(); } }] : []),
    { t: '🚶 Пройти мимо', fn: () => { UI.log('Ты прошёл мимо. Его стоны ещё долго слышны за спиной.', 'dim'); G.ch.stress = clamp(G.ch.stress + 5, 0, 100); } },
    { t: '🔪 Обобрать', fn: () => { const ids = ['canned', 'water', 'a9', 'cash']; const id = pick(ids); invAdd(G.inv, id, IT(id).c === 'ammo' ? 6 : 1); G.ch.stress = clamp(G.ch.stress + 20, 0, 100); UI.log(`Ты забрал у него ${IT(id).ic} ${IT(id).n}. На душе мерзко.`, 'bad'); UI.render(); } },
  ] });
}

// ---------------- обучение первого дня ----------------
const TUT = [
  { id: 'search', t: 'Обыщи ящик на Пристани', h: '📍 Место → Пристань → «Обыскать»' },
  { id: 'eat', t: 'Поешь или попей', h: '🎒 Вещи → нажми на еду → «Съесть»' },
  { id: 'forest', t: 'Сходи в Сосновый лес', h: '🗺️ Карта → Сосновый лес → «Идти»' },
  { id: 'wood', t: 'Набери 3 дров', h: 'В лесу: «🌿 Собирать» или обыщи «Кусты и поляну»', chk: () => cnt(G.inv, 'wood') + cnt(G.stash, 'wood') >= 3 || G.w.struct.fire > 0 },
  { id: 'band', t: 'Сделай повязку из тряпки', h: '🎒 Вещи → «Крафт в руках» → «Повязка из тряпки»' },
  { id: 'fire', t: 'Вернись на базу и разведи очаг', h: '🏚️ База → «Очаг» → «Построить»', chk: () => G.w.struct.fire > 0 },
  { id: 'sleep', t: 'Выспись на базе', h: '🏚️ База → «Спать до утра» (лучше вечером)' },
];
function tutMark(id) { if (G && G.tut && G.tut.on) G.tut.done[id] = true; }
function tutState() {
  if (!G.tut || !G.tut.on) return null;
  TUT.forEach(s => { if (s.chk && s.chk()) G.tut.done[s.id] = true; });
  const left = TUT.filter(s => !G.tut.done[s.id]);
  if (!left.length) {
    G.tut.on = false; invAdd(G.inv, 'bandage', 2); invAdd(G.inv, 'canned', 2); SND('quest');
    UI.event({ title: '🎓 Первый день пройден', cls: 'good', text: 'Ты освоился на острове. Семёныч оставил у двери гостинец: 2 бинта и 2 банки тушёнки.\n\nДальше — задания в Журнале и торговцы. Береги себя.', choices: [{ t: 'Спасибо' }] });
    return null;
  }
  return { cur: left[0], n: TUT.length - left.length };
}

// ---------------- финал ----------------
function apparatus(choice) {
  G.w.flags.apparatus = true; checkQuests();
  const c = G.ch, days = Math.floor((G.time - c.born) / DAY);
  if (choice === 'off') { G.w.ending = 'silence'; G.em.next = G.time + 9999 * DAY; }
  if (choice === 'take') { G.w.ending = 'master'; invAdd(G.inv, 'core', 1); }
  save();
  UI.ending(choice, { name: c.name, days, kills: c.kills });
}

// ---------- ежедневная награда (реальные сутки, серия до 7 дней) ----------
const DAILY = [
  { t: 'консервы', it: [['canned', 1]] },
  { t: 'бинт и чистая вода', it: [['bandage', 1], ['water', 1]] },
  { t: 'копчёная рыба и тряпки', it: [['smoked', 2], ['rag', 2]] },
  { t: 'обезболивающее и гвозди', it: [['painkill', 1], ['nails', 10]] },
  { t: 'батарейка и металлолом', it: [['battery', 1], ['scrap', 2]] },
  { t: 'патроны и консервы', it: [['a9', 6], ['canned', 1]] },
  { t: 'антибиотики, патроны 12 кал. и 30₽', it: [['antibio', 1], ['a12', 4]], money: 30 },
];
function dailyBonus() {
  if (!G || G.dead) return;
  const key = 'moti3_daily', today = new Date().toLocaleDateString('sv');
  let st = {}; try { st = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
  if (st.d === today) return;
  const yest = new Date(Date.now() - 864e5).toLocaleDateString('sv');
  const streak = st.d === yest ? (st.s || 0) + 1 : 1;
  try { localStorage.setItem(key, JSON.stringify({ d: today, s: streak })); } catch (e) {}
  const R = DAILY[(streak - 1) % DAILY.length];
  for (const [id, n] of R.it) if (ITEMS[id]) invAdd(G.inv, id, n);
  if (R.money) G.money += R.money;
  save();
  UI.event({ title: `🎁 Ежедневная находка · день ${streak}`, text: `Утром у двери сарая кто-то оставил свёрток: ${R.t}.\n\n${streak % 7 ? `Заходи завтра — награда будет лучше (серия ${streak} из 7).` : 'Неделя без пропусков! Завтра серия начнётся заново.'}`, choices: [{ t: 'Забрать' }] });
  if (window.SFX) SFX.play('pickup');
}

// ---------- таблица выживших ----------
let lbLast = 0;
function lbEntry(dead) {
  const c = G.ch; return { name: c.name, days: Math.max(0, Math.floor((G.time - c.born) / DAY)), kills: c.kills || 0, mode: G.mode, ach: typeof achCount === 'function' ? achCount() : 0, alive: !(dead || G.dead), coop: !!G.coop, run: `${G.w.gen || 1}:${c.born}:${c.name}` };
}
function lbSubmit(force, dead) {
  if (!window.FB || !FB.lb || !G || !G.ch) return Promise.resolve();
  if (!force && Date.now() - lbLast < 120000) return Promise.resolve();
  lbLast = Date.now(); return FB.lb.submit(lbEntry(dead)).catch(() => {});
}

// ---------- Глава 2 «Мастер» ----------
function startCh2() {
  if (!G || G.w.ch2) return;
  G.w.ch2 = { at: G.time, end: null };
  G.w.quests.c2_shards = 'active';
  G.em.next = Math.min(G.em.next, G.time + DAY); G.em.warned = false;
  addNote('n_ch2'); FEED('🔮 начал Главу 2 «Мастер»'); SND('zap');
  UI.event({ title: '🔮 Глава 2 · Мастер', cls: 'bad', text: 'Ядро в рюкзаке бьётся, как второе сердце. Остров отвечает ему: враги стали сильнее и злее, Выбросы — чаще, а в аномалиях проросли кристаллы.\n\nНо теперь их можно добыть. Из осколков делают оружие, броню — и двигатель, который увезёт тебя к синему шпилю за проливом.\n\nНовое задание: «Пробуждение».', choices: [{ t: 'Начать' }] });
  save(); UI.render();
}
function ending2(choice) {
  if (!G.w.ch2 || G.w.ch2.end) return;
  G.w.ch2.end = choice; G.w.flags.ch2_done = true;
  if (choice === 'seal') { G.em.next = G.time + 9999 * DAY; G.em.warned = false; }
  if (choice === 'rule') invAdd(G.inv, 'cheart', 1);
  FEED(choice === 'seal' ? '🌙 усыпил остров' : '💠 стал Мастером острова');
  const c = G.ch; save();
  UI.ending2(choice, { name: c.name, days: Math.floor((G.time - c.born) / DAY), kills: c.kills });
}
