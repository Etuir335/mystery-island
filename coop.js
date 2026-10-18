'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — кооператив
//  Общий мир (база, склад, сюжет, локации, время) живёт в db артефакта.
//  Персонаж, рюкзак и деньги — у каждого свои.
// =====================================================================
const COOP = (() => {
  let db = null, user = null, uid = null, avail = null;
  let code = null, ready = false, status = 'off'; // off | connecting | online | offline | readonly
  let subs = [], timer = null, pushing = false, again = false, rTimer = null;
  let feedL = [], chatLoaded = false, feedLoaded = false;
  let players = {}, chat = [], lastMe = '', lastMeAt = 0, lastPersonal = '', unread = 0;
  const sent = {};
  const ONLINE_MS = 15 * 60 * 1000;
  const LOC_IDS = Object.keys(LOCS);

  // --- стабильная сериализация (сервер может переставить ключи) ---
  function canon(v) {
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    if (v && typeof v === 'object') return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
    return JSON.stringify(v === undefined ? null : v);
  }

  async function probe() {
    if (avail) return true;
    try {
      if (!window.claude || !window.claude.use) { avail = false; return false; }
      db = await window.claude.use('db'); user = await window.claude.use('user');
      uid = user ? await user.id() : null;
      avail = !!(db && uid);
    } catch (e) { avail = false; }
    return avail;
  }

  // --- тексты ошибок зависят от того, где запущена игра ---
  const FBM = () => !!(window.claude && window.claude._fb);
  const NOPERM = () => FBM() ? 'Сервер кооператива отказал в доступе. Попробуй перезапустить игру.' : 'Нет прав на запись в общий мир. Нужно: «Поделиться» → выключить доступ по ссылке и пригласить друга по email с правом редактора.';
  const NOAVAIL = () => window.TGA ? 'Нет связи с сервером кооператива. Проверь интернет и попробуй ещё раз.' : 'Кооператив работает только на опубликованной странице claude.ai, когда ты вошёл в аккаунт.';

  // --- что общее ---
  function parts() {
    const w = G.w;
    const o = {
      base: { struct: w.struct, wallHp: w.wallHp, bp: w.bp, stash: G.stash, prod: w.prod, catAt: w.catAt },
      story: { mode: G.mode, flags: w.flags, quests: w.quests, qstart: w.qstart, rep: w.rep, notes: w.notes, counters: w.counters, corpses: w.corpses, events: w.events || [], ending: w.ending || null, deaths: w.deaths, gen: w.gen },
      clock: { time: G.time, weather: G.weather, em: G.em, hordeDone: w.hordeDone },
    };
    for (const id of LOC_IDS) o['loc_' + id] = w.locs[id];
    return o;
  }
  const pathOf = n => n.startsWith('loc_') ? `coop/${code}/loc/${n.slice(4)}` : `coop/${code}/w/${n}`;
  const personalPath = () => `data/users/${uid}/coop-${code}`;

  function applyDoc(n, data, force) {
    const js = canon(data);
    if (sent[n] === js) return false;
    if (!force && sent[n] !== undefined && canon(parts()[n]) !== sent[n]) return false; // у нас несохранённые изменения — отправим свои
    if (n === 'base') { Object.assign(G.w, { struct: data.struct, wallHp: data.wallHp, bp: data.bp || {}, prod: data.prod, catAt: data.catAt }); G.stash = data.stash || []; }
    else if (n === 'story') { for (const k of ['flags', 'quests', 'qstart', 'rep', 'notes', 'counters', 'corpses', 'deaths', 'events']) G.w[k] = data[k] || (Array.isArray(G.w[k]) ? [] : {}); G.w.ending = data.ending || null; G.w.gen = data.gen || 1; }
    else if (n === 'clock') {
      if (data.time > G.time + 1) { const d = data.time - G.time; G.time = data.time; if (d >= 30) UI.log(`⏩ Пока тебя не было, в общем мире прошло ${d >= 60 ? Math.round(d / 6) / 10 + ' ч' : d + ' мин'}.`, 'sys'); }
      if (!G.weather || (data.weather && data.weather.until > G.weather.until)) G.weather = data.weather;
      if (data.em && (!G.em || data.em.next > G.em.next)) G.em = data.em;
      G.w.hordeDone = Object.assign({}, G.w.hordeDone, data.hordeDone || {});
    } else { const id = n.slice(4); if (G.combat && id === G.loc) return false; G.w.locs[id] = data; }
    sent[n] = js;
    return true;
  }

  function scheduleRender() { clearTimeout(rTimer); rTimer = setTimeout(() => { if (G && !G.dead) UI.render(); }, 150); }
  function onErr(e) {
    const c = e && e.code;
    if (c === 'invalid_argument') { if (status !== 'readonly') UI.event({ title: '🔒 Только чтение', cls: 'bad', text: NOPERM() + '\n\nПока что ты видишь общий мир, но твои действия в него не сохраняются.', choices: [{ t: 'Понятно' }] }); status = 'readonly'; }
    else if (c === 'quota_exceeded') { UI.toast('Хранилище общего мира заполнено.'); }
    else if (c === 'revoked' || c === 'not_granted' || c === 'capability_disabled') { status = 'offline'; ready = false; }
    else if (c === 'permission_denied' || c === 'unavailable') { status = 'offline'; }
    scheduleRender();
  }

  // --- отправка изменений ---
  function sync() { if (!code || !ready || status === 'readonly') return; clearTimeout(timer); timer = setTimeout(push, 700); }
  async function push() {
    if (!ready) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      const p = parts();
      for (const n in p) { const js = canon(p[n]); if (js !== sent[n]) { await db.doc(pathOf(n)).set(JSON.parse(js)); sent[n] = js; } }
      await pushMe(); await pushPersonal();
    } catch (e) { onErr(e); }
    finally { pushing = false; if (again) { again = false; sync(); } }
  }
  function meDoc() {
    const w = G.eq.weapon && IT(G.eq.weapon.id);
    const dmg = w && w.dmg ? (w.dmg[0] + w.dmg[1]) / 2 : 4;
    const c = G.ch;
    return { name: c.name, loc: G.traveling ? (G.travelTo || G.loc) : G.loc, from: G.traveling ? G.loc : null, room: roomName(), act: G.act || 'осматривается', combat: !!G.combat,
      hp: healthPct(), food: Math.round(c.food), drink: Math.round(c.drink), energy: Math.round(c.energy), bleed: bleeding(), alive: !G.dead, dmg, wn: w ? w.n : 'кулаки', gen: G.w.gen, t: G.time, clock: clock(), day: day() };
  }
  async function pushMe(force) {
    const d = meDoc(), js = canon(d);
    if (!force && js === lastMe && Date.now() - lastMeAt < 60000) return;
    d.at = Date.now();
    await db.doc(`coop/${code}/p/${uid}`).set(d); lastMe = js; lastMeAt = d.at;
  }
  async function pushPersonal() {
    const d = { ch: G.ch, inv: G.inv, eq: G.eq, money: G.money, loc: G.loc, sneak: G.sneak, campfire: G.campfire || null, dead: !!G.dead };
    const js = canon(d); if (js === lastPersonal) return;
    try { await db.doc(personalPath()).set(JSON.parse(js)); lastPersonal = js; } catch (e) { /* личная копия — не критично */ }
  }

  // --- подписки ---
  function unsub() { subs.forEach(u => { try { u(); } catch (e) {} }); subs = []; chatLoaded = false; feedLoaded = false; }
  function subscribe() {
    unsub();
    for (const n of Object.keys(parts())) subs.push(db.doc(pathOf(n)).onSnapshot(s => { if (s.exists && applyDoc(n, s.data())) scheduleRender(); }, onErr));
    subs.push(db.collection(`coop/${code}/p`).onSnapshot(qs => { const o = {}; qs.docs.forEach(d => { if (d.exists) o[d.id] = d.data(); }); players = o; scheduleRender(); }, onErr));
    subs.push(db.doc(`coop/${code}/chat/log`).onSnapshot(s => {
      const m = s.exists ? (s.data().msgs || []) : [];
      const fresh = m.filter(x => x.u !== uid && !chat.some(y => y.at === x.at && y.u === x.u));
      if (chatLoaded && fresh.length) { unread += fresh.length; fresh.forEach(x => { if (x.ping) { if (window.SFX) SFX.play('notify'); UI.event({ title: `📣 ${x.n}`, text: `${x.t}\n\n${x.loc && LOCS[x.loc] ? `Где: ${LOCS[x.loc].ic} ${LOCS[x.loc].n}` : ''}`, choices: x.loc && LOCS[x.loc] && x.loc !== G.loc ? [{ t: `🧭 Идти туда`, fn: () => goTo(x.loc) }, { t: 'Позже' }] : [{ t: 'Понял' }] }); } else UI.log(`💬 ${x.n}: ${x.t}`, 'sys'); }); }
      chat = m; chatLoaded = true; scheduleRender();
    }, onErr));
    subs.push(db.doc(`coop/${code}/feed/log`).onSnapshot(s => {
      const m = s.exists ? (s.data().items || []) : [];
      const fresh = m.filter(x => x.u !== uid && !feedL.some(y => y.at === x.at && y.u === x.u));
      if (feedLoaded && fresh.length) fresh.forEach(x => { UI.log(`📢 ${x.n} ${x.t}`, 'sys'); UI.toast(`📢 ${x.n} ${x.t}`); });
      feedL = m; feedLoaded = true; scheduleRender();
    }, onErr));
    subs.push(db.doc(`coop/${code}/mail/${uid}`).onSnapshot(async s => {
      if (!s.exists) return; const items = s.data().items || []; if (!items.length) return;
      try { await db.doc(`coop/${code}/mail/${uid}`).set({ items: [] }); } catch (e) { return; }
      for (const g of items) { if (g.item && ITEMS[g.item.id]) { G.inv.push(g.item); UI.log(`🎁 ${g.from} передал тебе: ${IT(g.item.id).ic} ${IT(g.item.id).n}${g.item.n > 1 ? ' ×' + g.item.n : ''}.`, 'good'); } }
      save(); scheduleRender();
    }, onErr));
  }
  async function fetchAll() {
    for (const n of Object.keys(parts())) { const s = await db.doc(pathOf(n)).get(); if (s.exists) applyDoc(n, s.data(), true); }
  }

  // --- публичные действия ---
  function genCode() { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)]; return s; }
  async function create() {
    if (!await probe()) return NOAVAIL();
    status = 'connecting'; UI.render();
    try {
      let c = genCode(); for (let k = 0; k < 3; k++) { const s = await db.doc(`coop/${c}`).get(); if (!s.exists) break; c = genCode(); }
      await db.doc(`coop/${c}`).set({ created: Date.now(), host: uid, mode: G.mode, v: 1 });
      code = c; G.coop = { code: c };
      for (const k in sent) delete sent[k];
      ready = true; status = 'online';
      await push(); await pushMe(true); subscribe(); save();
      UI.log(`🤝 Общий мир создан. Код: ${c}`, 'good');
      return '';
    } catch (e) { status = 'off'; G.coop = null; code = null; ready = false; return e && e.code === 'invalid_argument' ? NOPERM() : 'Не удалось создать мир. Попробуй ещё раз.'; }
  }
  async function join(c, name, traits) {
    if (!await probe()) return NOAVAIL();
    c = (c || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{4,8}$/.test(c)) return 'Код — 6 букв и цифр, например K7QX2M.';
    try {
      const meta = await db.doc(`coop/${c}`).get();
      if (!meta.exists) return FBM() ? 'Мир с таким кодом не найден. Попроси друга прислать приглашение ещё раз.' : 'Мир с таким кодом не найден. Проверь код и что друг поделился с тобой этой страницей.';
      const mode = meta.data().mode;
      try { await db.doc(`coop/${c}/p/${uid}`).set({ probe: Date.now() }); } catch (e) { if (e && e.code === 'invalid_argument') return NOPERM(); throw e; }
      code = c;
      const ps = await db.doc(`data/users/${uid}/coop-${c}`).get();
      if (G && !G.coop && !G.dead) { try { localStorage.setItem(SOLO_KEY, JSON.stringify(G)); } catch (e) {} }
      newGame(mode, name, traits);
      G.coop = { code: c };
      for (const k in sent) delete sent[k];
      await fetchAll();
      if (ps.exists) { const p = ps.data(); if (!p.dead) { Object.assign(G, { ch: p.ch, inv: p.inv || [], eq: p.eq, money: p.money || 0, loc: p.loc || 'base', sneak: !!p.sneak, campfire: p.campfire || null }); UI.log(`🤝 С возвращением в общий мир, ${G.ch.name}!`, 'good'); } }
      G.room = null; G.traveling = false;
      ready = true; status = 'online';
      subscribe(); save(); await push(); await pushMe(true);
      return '';
    } catch (e) { code = null; ready = false; status = 'off'; return e && e.code === 'invalid_argument' ? NOPERM() : 'Не удалось подключиться. Попробуй ещё раз.'; }
  }
  async function init() {
    if (!G || !G.coop) return;
    code = G.coop.code; status = 'connecting';
    if (!await probe()) { status = 'offline'; scheduleRender(); return; }
    try {
      for (const k in sent) delete sent[k];
      await fetchAll();
      ready = true; status = 'online';
      subscribe(); save(); await pushMe(true);
      scheduleRender();
    } catch (e) { status = 'offline'; onErr(e); }
  }
  const SOLO_KEY = 'moti3_solo';
  function leave() {
    unsub(); ready = false; status = 'off'; code = null; G.coop = null; players = {}; chat = [];
    let solo = null; try { solo = JSON.parse(localStorage.getItem(SOLO_KEY)); } catch (e) {}
    if (solo && solo.v === 3) { G = solo; try { localStorage.removeItem(SOLO_KEY); } catch (e) {} migrate(); UI.log('🏝 Ты вернулся в свою одиночную игру.', 'good'); }
    save();
  }
  const hasSolo = () => { try { return !!localStorage.getItem(SOLO_KEY); } catch (e) { return false; } };
  async function send(text) {
    text = (text || '').trim().slice(0, 240); if (!text || !ready) return;
    const ref = db.doc(`coop/${code}/chat/log`);
    try { const s = await ref.get(); const m = s.exists ? (s.data().msgs || []).slice(-39) : []; m.push({ u: uid, n: G.ch.name, t: text, at: Date.now() }); await ref.set({ msgs: m }); }
    catch (e) { onErr(e); }
  }
  async function feed(text) {
    if (!ready || status === 'readonly') return;
    const ref = db.doc(`coop/${code}/feed/log`);
    try { const s = await ref.get(); const m = s.exists ? (s.data().items || []).slice(-49) : []; m.push({ u: uid, n: G.ch.name, t: text, at: Date.now() }); await ref.set({ items: m }); feedL = m; } catch (e) { onErr(e); }
  }
  async function ping(text) {
    if (!ready) return;
    const ref = db.doc(`coop/${code}/chat/log`);
    try { const s = await ref.get(); const m = s.exists ? (s.data().msgs || []).slice(-39) : []; m.push({ u: uid, n: G.ch.name, t: text, at: Date.now(), ping: 1, loc: G.loc }); await ref.set({ msgs: m }); chat = m; UI.toast('📣 Сигнал отправлен'); }
    catch (e) { onErr(e); }
  }
  async function give(to, e, n) {
    if (!ready) return;
    const q = Math.min(n || e.n, e.n), item = Object.assign({}, e, { n: q });
    const ref = db.doc(`coop/${code}/mail/${to}`);
    try {
      const s = await ref.get(); const items = s.exists ? (s.data().items || []).slice() : [];
      items.push({ from: G.ch.name, item }); await ref.set({ items });
      const i = G.inv.indexOf(e); if (i >= 0) { e.n -= q; if (e.n <= 0) G.inv.splice(i, 1); }
      UI.log(`🎁 Ты передал: ${IT(e.id).ic} ${IT(e.id).n}${q > 1 ? ' ×' + q : ''}.`); save(); UI.render();
    } catch (err) { onErr(err); }
  }
  const others = () => Object.entries(players).filter(([id]) => id !== uid).map(([id, p]) => Object.assign({ id, online: Date.now() - (p.at || 0) < ONLINE_MS }, p));
  const here = () => others().filter(p => p.online && p.alive && p.loc === G.loc && !G.traveling);
  // друг рядом помогает в бою
  function allyTurn(cb) {
    if (!ready || cb.opts.road) return false;
    const al = here(); if (!al.length) return false;
    let acted = false;
    for (const p of al) {
      const tg = cb.en.filter(e => e.hp > 0); if (!tg.length) break;
      const e = tg[Math.floor(Math.random() * tg.length)], D = ENEMY[e.id];
      if (Math.random() < 0.7) { const d = Math.max(1, Math.round((p.dmg || 4) * (0.8 + Math.random() * 0.4) - (D.arm || 0))); e.hp -= d; cb.log.push({ t: `🤝 ${p.name} (${p.wn || 'оружие'}) бьёт ${D.ic} ${D.n}: −${d}`, c: 'good' }); }
      else cb.log.push({ t: `🤝 ${p.name} промахивается по ${D.n}.`, c: 'dim' });
      acted = true;
    }
    return acted;
  }
  return {
    hasSolo, probe, create, join, init, sync, leave, send, give, allyTurn, others, here, feed, ping, get feedList() { return feedL; },
    get code() { return code; }, get status() { return status; }, get chat() { return chat; }, get uid() { return uid; },
    get unread() { return unread; }, readAll() { unread = 0; },
  };
})();
window.COOP = COOP;
