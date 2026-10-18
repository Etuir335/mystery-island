'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — интерфейс
// =====================================================================
const UI = (() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let ACT = [], MACT = [];
  const a = fn => { ACT.push(fn); return `UI.run(${ACT.length - 1})`; };
  const m = fn => { MACT.push(fn); return `UI.mrun(${MACT.length - 1})`; };
  const st = { tab: 'loc', sel: null, open: null, trader: null, ttab: 'buy', confirmNew: false, showRules: false };
  let queue = [], cur = null, full = null, toastT = null;

  function run(i) { const f = ACT[i]; if (!f) return; if (G && G.dead) { deathScreen(G.w.deaths[G.w.deaths.length - 1] || {}); return; } f(); if (G && !G.dead) save(); render(); }
  function mrun(i) { const f = MACT[i]; if (!f) return; f(); if (G && !G.dead) save(); }

  // ---------------- лог / тост ----------------
  function log(t, c = '') { if (!G) return; G.log.push({ t, c, d: day(), k: clock() }); if (G.log.length > 250) G.log.splice(0, G.log.length - 250); }
  function toast(t) { const el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 2400); }

  const bar = (v, max = 100, inv) => { const p = clamp(v / max * 100, 0, 100); const q = inv ? 100 - p : p; return `<div class="bar ${q < 25 ? 'low' : q < 50 ? 'mid' : ''}"><i style="width:${p}%"></i></div>`; };
  const btn = (t, fn, cls = '', dis) => `<button class="btn ${cls}" ${dis ? 'disabled' : `onclick="${a(fn)}"`}>${t}</button>`;
  const mbtn = (t, fn, cls = '', dis) => `<button class="btn ${cls}" ${dis ? 'disabled' : `onclick="${m(fn)}"`}>${t}</button>`;
  const itName = (id, n) => `${IT(id).ic} ${esc(IT(id).n)}${n > 1 ? ' ×' + n : ''}`;
  const DANGER = ['безопасно', 'низкая', 'средняя', 'высокая'];
  const dangerChip = d => `<span class="chip ${d >= 3 ? 'bad' : d >= 2 ? 'warn' : d ? '' : 'good'}">опасность: ${DANGER[d]}</span>`;

  // ---------------- верхняя полоса ----------------
  function renderTop() {
    const c = G.ch, w = weather(), f = F();
    const toBN = 7 - ((day() - 1) % 7) - 1;
    const hp = healthPct();
    let ban = '';
    if (G.em.warned) ban += `<div class="banner">🔴 Выброс через ~${Math.max(0, G.em.next - G.time)} мин! ${inShelter() ? 'Ты в укрытии.' : 'Беги в укрытие!'}</div>`;
    if (fogEvent()) ban += `<div class="banner" style="background:var(--zone)">🌫️ Туман с тварями: врагов больше обычного.</div>`;
    if (isBloodNight()) ban += `<div class="banner">🌕 Кровавая ночь! Заражённые повсюду.</div>`;
    const FIX = { 'Голод': 'eat', 'Жажда': 'drink', 'Кровотечение': 'bleed', 'Боль': 'pain', 'Усталость': 'sleep' };
    const md = moodles().map(x => FIX[x.n] ? `<button class="mood l${x.l} fix" title="${esc(x.d)}" onclick="${a(() => quickFix(FIX[x.n]))}">${x.ic} ${x.n} ›</button>` : `<span class="mood l${x.l}" title="${esc(x.d)}">${x.ic} ${x.n}</span>`).join('');
    if (!inShelter() && !G.traveling && (hour() >= 18 && hour() < 21)) { const sh = nearestShelter(); if (sh) ban += `<div class="banner" style="background:var(--warn)">🌇 Скоро ночь. Ближайшее укрытие: ${LOCS[sh.loc].ic} ${LOCS[sh.loc].n} (~${sh.mins} мин)</div>`; }
    const sq = G.coop ? squadStrip() : '';
    $('top').innerHTML = `
      <div class="toprow"><span class="clock">${clock()}</span><b>День ${day()}</b><span>${w.ic} ${w.n}</span><span>${isNight() ? '🌙 ночь' : '☀️ день'}</span><span>${toBN === 0 ? '🌕 сегодня Кровавая ночь' : `🌕 через ${toBN} дн.`}</span><button class="sndbtn" onclick="${a(() => { SFX.toggle(); })}" aria-label="Звук">${SFX.on ? '🔊' : '🔇'}</button><span>💰 ${G.money}₽</span>${G.coop ? `<span class="${COOP.status === 'online' ? 'good' : 'warn'}">🤝 ${COOP.others().filter(p => p.online).length + 1} в игре${COOP.unread ? ` · 💬${COOP.unread}` : ''}</span>` : ''}</div>
      <div class="vitals">
        <div class="vit">❤️ ${hp}%${bar(hp)}</div><div class="vit">🍗 ${Math.round(c.food)}${bar(c.food)}</div>
        <div class="vit">💧 ${Math.round(c.drink)}${bar(c.drink)}</div><div class="vit">⚡ ${Math.round(c.energy)}${bar(c.energy)}</div>
      </div>
      ${md ? `<div class="moods">${md}</div>` : ''}${sq}${ban}`;
  }
  function stIcon(p) { return !p.online ? '💤' : p.alive === false ? '☠️' : p.combat ? '⚔️' : (p.act || '').startsWith('😴') ? '😴' : p.from ? '🚶' : '📍'; }
  function squadStrip() {
    const ps = COOP.others(); if (!ps.length) return '';
    return `<div class="squad">${ps.map(p => `<button class="sq ${p.online ? '' : 'off'} ${p.combat ? 'fight' : ''}" onclick="${a(() => friendSheet(p))}"><b>${esc(p.name || 'Выживший')}</b> ${stIcon(p)} ${LOCS[p.loc] ? LOCS[p.loc].ic : ''} <span class="${p.hp < 35 ? 'bad' : ''}">❤️${p.hp ?? '?'}</span>${p.bleed ? '🩸' : ''}</button>`).join('')}</div>`;
  }
  function friendSheet(p) {
    const L0 = LOCS[p.loc], r = L0 && p.loc !== G.loc ? route(G.loc, p.loc) : null;
    const lines = [
      `${L0 ? L0.ic + ' ' + L0.n : '—'}${p.room ? ' · ' + p.room : ''}${p.from && LOCS[p.from] ? ` (идёт из: ${LOCS[p.from].n})` : ''}`,
      `Сейчас: ${p.act || '—'}`,
      `❤️ ${p.hp ?? '?'}%  🍗 ${p.food ?? '?'}  💧 ${p.drink ?? '?'}  ⚡ ${p.energy ?? '?'}${p.bleed ? '  🩸 кровотечение!' : ''}`,
      `Оружие: ${p.wn || '—'}`,
      p.online ? `В игре · у него день ${p.day ?? '?'}, ${p.clock || ''}` : `Не в игре · был ${ago(p.at)}`,
    ];
    const ch = [];
    if (r && r.path.length) ch.push({ t: `🧭 Идти к нему (~${r.mins} мин)`, fn: () => goTo(p.loc) });
    if (p.loc === G.loc && p.online) ch.push({ t: '🎁 Передать вещь', fn: () => giveMenu(p) });
    ch.push({ t: '📣 Позвать к себе', fn: () => COOP.ping('Иди сюда!') });
    ch.push({ t: 'Закрыть' });
    event({ title: `👤 ${p.name || 'Выживший'}`, text: lines.join('\n'), choices: ch });
  }
  function renderTabs() {
    const tabs = [['map', '🗺️', 'Карта'], ['loc', '📍', 'Место'], ['inv', '🎒', 'Вещи'], ['char', '🧍', 'Тело'], ['base', '🏚️', 'База'], ['jour', '📓', 'Журнал']];
    $('tabs').innerHTML = tabs.map(([k, ic, n]) => `<button class="${st.tab === k ? 'on' : ''}" onclick="${a(() => { st.tab = k; st.open = null; if (k !== 'loc') st.trader = null; })}"><span>${ic}</span>${n}</button>`).join('');
  }
  function logLast(n = 4) {
    const L = G.log.slice(-n);
    return L.length ? `<div id="loglast">${L.map(x => `<div class="lg ${x.c}">${esc(x.t)}</div>`).join('')}</div>` : '';
  }

  // ---------------- КАРТА ----------------
  const ISLAND = 'M22,7 C40,1 70,3 90,9 C99,19 97,38 93,52 C98,68 93,88 80,95 C60,100 34,97 20,91 C8,85 4,70 6,56 C2,40 5,19 22,7 Z';
  function renderMap() {
    const f = F(); const sel = st.sel || G.loc; const near = LOCS[G.loc].links;
    const seen = id => !f.fog || G.w.locs[id].seen || near[id] != null || id === G.loc;
    const drawn = new Set(); let lines = '';
    const vis = id => !LOCS[id].ch2 || CH2();
    for (const id in LOCS) for (const to in LOCS[id].links) { if (!vis(id) || !vis(to)) continue; const k = [id, to].sort().join(); if (drawn.has(k)) continue; drawn.add(k); const A = LOCS[id], B = LOCS[to]; const nr = (id === G.loc || to === G.loc); lines += `<line class="link ${nr ? 'near' : ''} ${LOCS[id].boat || LOCS[to].boat ? 'sea' : ''}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`; }
    let nodes = '';
    for (const id in LOCS) {
      if (!vis(id)) continue;
      const l = LOCS[id], s = seen(id);
      const evs = eventsAt(id); if (evs.length && s) nodes += `<text x="${l.x - 6.5}" y="${l.y - 2.6}" style="font-size:3.6px">${EVTS[evs[0].type].ic}</text>`;
      const fr = G.coop ? COOP.others().filter(p => p.online && p.loc === id) : [];
      fr.forEach((p, k) => { nodes += `<text class="fname" x="${l.x}" y="${l.y - 5.2 - k * 3.2}">👤${esc((p.name || '').slice(0, 10))} ${stIcon(p)}</text>`; });
      nodes += `<g class="node ${id === G.loc ? 'cur' : ''} ${id === sel ? 'sel' : ''} ${l.zone ? 'zn' : ''}" onclick="${a(() => { st.sel = id; })}"><circle cx="${l.x}" cy="${l.y}" r="3.6"/><text class="emo" x="${l.x}" y="${l.y + 1.4}">${s ? l.ic : '?'}</text><text x="${l.x}" y="${l.boat ? l.y - 5 : l.y + 7.2}">${s ? esc(l.n) : '???'}</text></g>`;
    }
    let grid = ''; for (let i = 10; i < 100; i += 10) grid += `<line class="grid" x1="${i}" y1="0" x2="${i}" y2="100"/><line class="grid" x1="0" y1="${i}" x2="100" y2="${i}"/>`;
    const l = LOCS[sel], s = seen(sel), ls = G.w.locs[sel];
    let card = `<div class="sec"><div class="sechead"><h2>${s ? l.ic + ' ' + esc(l.n) : '❓ Неизведанное место'}</h2>${sel === G.loc ? '<span class="chip good">ты здесь</span>' : ''}</div>`;
    if (s) {
      card += `<p class="muted">${esc(l.d)}</p><div class="acts">`;
      if (f.hints >= 1 || ls.seen) card += dangerChip(l.dg);
      if (l.zone && (f.hints >= 1 || ls.seen)) card += `<span class="chip zone">☢ зона ${l.zone}</span>`;
      if (l.shelter) card += '<span class="chip good">укрытие от Выброса</span>';
      if (l.trader) card += `<span class="chip">${TRADERS[l.trader].ic} ${TRADERS[l.trader].n}</span>`;
      if (f.hints >= 2) card += `<span class="chip">комнат: ${l.rooms.length}</span>`;
      if (l.lock) card += `<span class="chip ${cnt(G.inv, l.lock) ? 'good' : 'bad'}">🔒 ${IT(l.lock).n}</span>`;
      if (G.w.corpses.some(x => x.loc === sel)) card += '<span class="chip warn">🪦 твоё тело</span>';
      eventsAt(sel).forEach(ev => card += `<span class="chip warn">${EVTS[ev.type].ic} ${EVTS[ev.type].n}</span>`);
      card += '</div>';
    } else card += '<p class="muted">Ты ещё не бывал в этой части острова.</p>';
    if (sel === G.loc) card += btn('📍 Осмотреться', () => { st.tab = 'loc'; }, 'pri');
    else if (near[sel] != null) { const err = canTravel(sel); card += `<div class="acts">${btn(`🚶 Идти — ${travelTime(sel)} мин${isNight() ? ' (ночью опаснее)' : ''}`, () => { st.sel = null; travel(sel); }, 'pri', !!err)}</div>${err ? `<p class="bad">${esc(err)}</p>` : ''}`; }
    else { const r = route(G.loc, sel); card += r ? `<p class="muted">Маршрут: ${r.path.map(k => seen(k) ? LOCS[k].n : '???').join(' → ')} · ~${r.mins} мин</p><div class="acts">${btn('🧭 Проложить маршрут', () => { st.sel = null; goTo(sel); }, 'pri', !!canTravel(r.path[0]))}</div>` : '<p class="muted">Сюда пока не пройти.</p>'; }
    if (sel !== G.loc && (G.ch.food < 25 || G.ch.drink < 25)) card += '<p class="warn">⚠️ Мало еды или воды — поешь перед дорогой.</p>';
    card += '</div>';
    return `${tutCard()}${logLast(3)}<div class="mapwrap"><svg viewBox="0 0 100 100" role="img" aria-label="Карта острова"><image href="${ART.mapBg(ISLAND, CH2())}" x="0" y="0" width="100" height="100" preserveAspectRatio="none" style="image-rendering:pixelated"/>${lines}${nodes}</svg></div>${card}`;
  }

  // ---------------- МЕСТО ----------------
  function renderLoc() {
    if (st.trader) return renderTrader(st.trader);
    if (G.room != null) return renderRoom();
    const l = L(), ls = G.w.locs[G.loc], f = F();
    const rt = G.route && G.route.length ? `<div class="row evt"><span class="ic">🧭</span><div class="grow"><span class="t">Маршрут: ${LOCS[G.routeDest] ? LOCS[G.routeDest].n : ''}</span><span class="s">дальше → ${LOCS[G.route[0]].ic} ${LOCS[G.route[0]].n} (~${travelTime(G.route[0])} мин) · осталось переходов: ${G.route.length}</span></div><div class="acts">${btn('Продолжить', continueRoute, 'pri sm')}${btn('✕', cancelRoute, 'sm')}</div></div>` : '';
    let h = `${ART.sceneTag({ loc: G.loc, key: G.loc, alt: l.n, camp: campHere() })}${rt}${tutCard()}${logLast()}<div class="sec"><div class="eyebrow">${l.zone ? `☢ аномальная зона ${l.zone} · ` : ''}${l.shelter ? 'укрытие · ' : ''}опасность: ${DANGER[l.dg]}</div><h1>${l.ic} ${esc(l.n)}</h1><p class="muted">${esc(l.d)}</p></div>`;
    h += `<div class="sechead"><div class="toggle"><button class="${!G.sneak ? 'on' : ''}" onclick="${a(() => G.sneak = false)}">🚶 Обычно</button><button class="${G.sneak ? 'on' : ''}" onclick="${a(() => G.sneak = true)}">🐾 Крадучись</button></div><span class="mono muted">🔊 шум ${Math.round(G.noise)}</span></div>`;
    const acts = [];
    if (l.base) acts.push(btn('🏚️ Открыть базу', () => { st.tab = 'base'; }, 'pri'));
    if (l.water) { const b = cnt(G.inv, 'bottle'); acts.push(btn(`${{ sea: '🌊 Набрать морской воды', well: '🪣 Вода из колодца', stream: '💧 Вода из ручья' }[l.water]} (🍶${b})`, collectWater, '', !b)); }
    if (l.fish) acts.push(btn('🎣 Рыбачить (1 ч)', doFish, '', !cnt(G.inv, 'rod')));
    if (l.forage) acts.push(btn('🌿 Собирать (40 мин)', doForage));
    if (l.hunt) acts.push(btn('🦌 Охотиться (1.5 ч)', doHunt));
    if (l.forage) acts.push(btn('🪓 Рубить дрова', doChop, '', !(G.eq.weapon && IT(G.eq.weapon.id).chop)));
    if (l.shelter && !l.base) acts.push(btn('😴 Переночевать', () => sleepHere()));
    if (!l.base) acts.push(campHere() ? btn(`🔥 Костёр (${G.campfire.until - G.time} мин) — готовить`, () => { st.tab = 'inv'; st.scrollCraft = true; }) : btn('🔥 Развести костёр', makeCamp, '', !cnt(G.inv, 'lighter') || cnt(G.inv, 'wood') < 2));
    acts.push(btn('🔨 Крафт', () => { st.tab = 'inv'; st.scrollCraft = true; }));
    if (acts.length) h += `<div class="acts">${acts.join('')}</div>`;
    for (const ev of eventsAt(G.loc)) {
      const E = EVTS[ev.type], left = Math.ceil((ev.until - G.time) / H);
      if (ev.type === 'drop') h += `<div class="row evt"><span class="ic">${E.ic}</span><div class="grow"><span class="t">Контейнер гуманитарки</span><span class="s">ещё ~${left} ч${ev.checked ? '' : ' · возможно, рядом мародёры'}</span></div>${btn('Вскрыть (20 мин)', () => openDrop(ev), 'pri sm')}</div>`;
      if (ev.type === 'nomad') h += `<div class="row evt"><span class="ic">${E.ic}</span><div class="grow"><span class="t">Кочевой торговец</span><span class="s">редкие товары · уйдёт через ~${left} ч</span></div>${btn('Торговать', () => { st.trader = 'nomad'; st.ttab = 'buy'; }, 'pri sm')}</div>`;
      if (ev.type === 'camp') { const n = ev.en.filter(e => e.hp > 0).length;
        h += `<div class="row evt hot"><span class="ic">${E.ic}</span><div class="grow"><span class="t">Лагерь мародёров</span><span class="s">${ev.cleared ? 'зачищен — можно обыскать' : `часовых: ${n} · ещё ~${left} ч`}</span></div><div class="acts">${ev.cleared ? btn('Обыскать', () => campLoot(ev), 'pri sm') : btn('⚔️ Напасть', () => campAttack(ev), 'bad sm') + (ev.stolen ? '' : btn(`🐾 Украсть (${Math.round(stealthChance() * 80)}%)`, () => campSteal(ev), 'sm'))}</div></div>`; }
    }
    if (G.coop) COOP.here().forEach(p => { h += `<div class="row"><span class="ic">👤</span><div class="grow"><span class="t">${esc(p.name)} рядом</span><span class="s">❤️ ${p.hp}% · поможет в бою (${esc(p.wn || 'оружие')})</span></div>${btn('🎁 Передать', () => giveMenu(p), 'sm')}</div>`; });
    G.w.corpses.forEach((c, i) => { if (c.loc === G.loc) h += `<div class="row hot"><span class="ic">🪦</span><div class="grow"><span class="t">Тело: ${esc(c.name)}</span><span class="s">${c.items.length} вещей</span></div>${btn('Забрать всё', () => lootCorpse(i), 'pri sm')}</div>`; });
    h += `<div class="sec"><h2>Места</h2><div class="list">`;
    l.rooms.forEach((r, i) => {
      const s = ls.rooms[i]; const chips = [];
      if (r.trader) chips.push(`<span class="chip good">${TRADERS[r.trader].ic} торговец</span>`);
      if (r.safe && !r.trader) chips.push('<span class="chip good">безопасно</span>');
      if (r.lock && !s.open) chips.push(`<span class="chip bad">🔒 ${r.lock === 'pry' ? 'заперто' : IT(r.lock).n}</span>`);
      const alive = s.en.filter(e => e.hp > 0).length;
      if (alive && s.enAt > -1e8) chips.push(`<span class="chip bad">враги: ${alive}</span>`);
      if (r.anom) chips.push(`<span class="chip zone">☢ аномалии${s.an ? ` ${s.an.filter(x => x.found).length}/${s.an.length}` : ''}</span>`);
      if (r.cont && r.cont.length) { const done = r.cont.filter((_, k) => s.cont[k] != null && !contReadyAt(i, k)).length; chips.push(`<span class="chip">обыскано ${done}/${r.cont.length}</span>`); }
      if (r.final) chips.push('<span class="chip zone">???</span>');
      h += `<div class="row ${alive ? 'hot' : ''}"><div class="grow"><span class="t">${esc(r.n)}</span><span class="acts">${chips.join('')}</span></div>${btn('Войти', () => enterRoom(i), 'sm')}</div>`;
    });
    h += '</div></div>';
    return h;
  }
  function tutCard() {
    const t = tutState(); if (!t) return '';
    const dots = TUT.map((s, i) => `<i class="${G.tut.done[s.id] ? 'on' : s === t.cur ? 'cur' : ''}"></i>`).join('');
    return `<div class="tut"><div class="sechead"><span class="eyebrow">🎓 Первый день · выполнено ${t.n} из ${TUT.length}</span>${btn('Скрыть', () => { G.tut.on = false; }, 'sm')}</div><div class="tutt">${esc(t.cur.t)}</div><div class="muted" style="font-size:13px">${esc(t.cur.h)}</div><div class="dots">${dots}</div></div>`;
  }
  function contReadyAt(i, k) { const s = roomSt(i), d = roomDef(i); if (s.cont[k] == null) return true; if (d.once || LOCS[G.loc].base) return false; return G.time - s.cont[k] > 72 * H; }
  function renderRoom() {
    const i = G.room, d = roomDef(i), s = roomSt(i);
    let h = `${ART.sceneTag({ loc: G.loc, room: d.n, key: G.loc + ':' + i, alt: d.n })}${logLast()}<div class="sechead"><h1>${esc(d.n)}</h1>${btn('↩ Выйти', leaveRoom, 'sm')}</div>`;
    if (d.trader) h += `<div class="row"><span class="ic">${TRADERS[d.trader].ic}</span><div class="grow"><span class="t">${TRADERS[d.trader].n}</span><span class="s">${esc(TRADERS[d.trader].d)}</span></div>${btn('Говорить', () => { st.trader = d.trader; st.ttab = 'quest'; }, 'pri sm')}</div>`;
    const alive = s.en.filter(e => e.hp > 0);
    if (alive.length) {
      h += `<div class="sec"><h2 class="bad">Враги</h2><p class="muted">${s.aware ? 'Они знают, что ты здесь.' : '🐾 Тебя не заметили. Каждое действие может выдать тебя — тише, если крадёшься.'}</p><div class="list">`;
      s.en.forEach((e, k) => { if (e.hp <= 0) return; const D = ENEMY[e.id]; h += `<div class="row hot">${ART.enemyImg(e.id)}<div class="grow"><span class="t">${D.n}${e.gear ? ` (${IT(e.gear).n})` : ''}</span><span class="s">❤️ ${Math.max(0, Math.round(e.hp))}/${e.max}</span></div>${!s.aware ? btn('🗡️ Из засады', () => sneakAttack(k), 'pri sm') : ''}</div>`; });
      h += `</div><div class="acts">${btn('⚔️ Напасть открыто', () => { s.aware = true; startCombat(s.en, { room: i }); }, 'bad')}</div></div>`;
    }
    if (s.an) {
      const found = s.an.filter(x => x.found);
      h += `<div class="sec"><h2 class="zone">☢ Аномалии</h2><p class="muted">${found.length ? 'Обнаружены: ' + found.map(x => ANOM[x.t].ic + ' ' + ANOM[x.t].n).join(', ') + '. ' : ''}${s.an.length - found.length ? `Ещё скрыто: ${s.an.length - found.length}. Любое действие здесь может завести тебя в аномалию.` : 'Все аномалии найдены — путь безопасен.'}</p>`;
      if (s.art) h += `<p class="good">✨ ${cnt(G.inv, 'detector') ? `Детектор пищит: ${IT(s.art).ic} ${IT(s.art).n}` : 'Между аномалиями что-то мерцает — артефакт!'}</p>`;
      h += `<div class="acts">${btn(`🔩 Бросить болт (${cnt(G.inv, 'bolts')})`, throwBolt, '', !cnt(G.inv, 'bolts') || found.length === s.an.length)}${s.art ? btn(`✨ Достать артефакт${s.an.length - found.length ? ` (риск ${Math.round((1 - Math.pow(0.65, s.an.length - found.length)) * 100)}%)` : ''}`, grabArtifact, 'pri') : ''}</div></div>`;
    }
    if (d.cont && d.cont.length) {
      const readyN = d.cont.filter((_, k) => contReadyAt(i, k)).length;
      h += `<div class="sec"><div class="sechead"><h2>Обыскать</h2>${readyN >= 2 ? btn(`🔍 Обыскать всё (${readyN})`, searchAll, 'sm pri') : ''}</div><div class="list">`;
      d.cont.forEach((ct, k) => {
        const C = CONT[ct], ready = contReadyAt(i, k), was = s.cont[k] != null;
        const sub = ready ? `~${searchTime(ct, d)} мин${was ? ' · снова, но меньше' : ''}${d.dark && isNight() && !cnt(G.inv, 'flash') ? ' · темно, нужен фонарик' : ''}` : (d.once || L().base ? 'пусто' : `обыскано · пополнится через ${Math.ceil((72 * H - (G.time - s.cont[k])) / H)} ч`);
        h += `<div class="row ${ready ? '' : 'dim'}"><span class="ic">${C.ic}</span><div class="grow"><span class="t">${C.n}</span><span class="s">${sub}</span></div>${btn('Обыскать', () => searchCont(k), 'sm', !ready)}</div>`;
      });
      h += '</div></div>';
    }
    if (s.ground.length) {
      h += `<div class="sec"><div class="sechead"><h2>На земле</h2>${btn('Забрать всё', takeAllGround, 'sm pri')}</div><div class="list">`;
      s.ground.forEach((e, k) => { h += `<div class="row">${ART.tile(e.id)}<div class="grow"><span class="t">${esc(IT(e.id).n)}${e.n > 1 ? ' ×' + e.n : ''}</span><span class="s">${(IT(e.id).w * e.n).toFixed(1)} кг</span></div>${btn('Взять', () => takeGround(k), 'sm')}</div>`; });
      h += '</div></div>';
    }
    if (d.final && !alive.length) h += renderApparatus();
    if (d.final2 && !alive.length) h += renderSpire();
    if (!alive.length && !s.an && !(d.cont && d.cont.length) && !d.trader && !d.final && !d.final2) h += '<p class="muted">Здесь пусто.</p>';
    return h;
  }
  function renderSpire() {
    if (G.w.ch2 && G.w.ch2.end) return `<div class="note">💠 ${G.w.ch2.end === 'seal' ? 'Шпиль погас. Сердце острова спит, и ядро спит вместе с ним.' : 'Шпиль светит ровно и спокойно — он узнаёт тебя. Ты Мастер острова.'}</div>`;
    if (!G.w.flags.keeper_dead) return '';
    return `<div class="sec"><h2 class="zone">💠 Сердце острова</h2><p>Хранитель рассыпался осколками. В центре Шпиля, в коконе из кристаллов, бьётся Сердце — огромный синий камень. Ядро в двигателе твоей лодки отзывается ему через весь остров.</p>
      <div class="choices">${btn('🌙 Вернуть ядро к Сердцу. Пусть остров уснёт — навсегда.', () => ending2('seal'), 'pri')}${btn('💠 Забрать Сердце. Остров будет слушаться тебя.', () => ending2('rule'))}${btn('↩ Уйти и подумать', () => leaveRoom())}</div></div>`;
  }
  function renderApparatus() {
    if (G.w.ending) return `<div class="note">🔮 Аппарат ${G.w.ending === 'silence' ? 'молчит. Остров затих.' : 'мёртв без ядра — но ядро тихо гудит в твоём рюкзаке.'}</div>`;
    return `<div class="sec"><h2 class="zone">🔮 Аппарат</h2><p>Посреди зала — машина размером с дом. По кабелям течёт синий свет. В центре пульсирует ядро. От него по коже бегут мурашки, и ты понимаешь: Выбросы рождаются здесь.</p>
      <div class="choices">${btn('⏹️ Вынуть ядро и разбить. Пусть остров затихнет.', () => apparatus('off'), 'pri')}${btn('🔮 Забрать ядро себе. Посмотрим, на что оно способно.', () => apparatus('take'))}${btn('↩ Уйти и подумать', leaveRoom)}</div></div>`;
  }
  function lockMenu(i) {
    const d = roomDef(i), opts = [];
    if (d.lock !== 'pry' && cnt(G.inv, d.lock)) opts.push({ t: `🔑 Открыть ключом (${IT(d.lock).n})`, fn: () => openLock(i, 'key') });
    if (d.lock === 'pry') {
      if (G.eq.weapon && IT(G.eq.weapon.id).pry || cnt(G.inv, 'crowbar')) opts.push({ t: '🪛 Вскрыть монтировкой (громко)', fn: () => openLock(i, 'pry') });
      if (cnt(G.inv, 'picks')) opts.push({ t: '🗝️ Вскрыть отмычками (тихо, может не выйти)', fn: () => openLock(i, 'picks') });
    }
    opts.push({ t: 'Уйти' });
    event({ title: `🔒 ${d.n}`, text: d.lock === 'pry' ? 'Дверь заперта. Нужна монтировка или отмычки.' : `Заперто. Нужен ключ: ${IT(d.lock).ic} ${IT(d.lock).n}.`, choices: opts });
  }

  // ---------------- ТОРГОВЕЦ ----------------
  function renderTrader(tid) {
    const T = TRADERS[tid];
    const rep = G.w.rep[tid] || 0;
    let h = `<div class="sechead"><h1>${T.ic} ${T.n}</h1>${btn('↩ Назад', () => { st.trader = null; }, 'sm')}</div><p class="muted">${esc(T.d)}</p><div class="toprow"><span>⭐ репутация <b>${rep}</b></span><span>💰 <b>${G.money}₽</b></span></div>`;
    if (tid === 'nomad' && st.ttab === 'quest') st.ttab = 'buy';
    h += `<div class="toggle">${(tid === 'nomad' ? [['buy', 'Купить'], ['sell', 'Продать']] : [['quest', 'Задания'], ['buy', 'Купить'], ['sell', 'Продать']]).map(([k, n]) => `<button class="${st.ttab === k ? 'on' : ''}" onclick="${a(() => st.ttab = k)}">${n}</button>`).join('')}</div>`;
    if (st.ttab === 'buy') {
      h += '<div class="list">' + T.stock.map(([id, tier]) => { const p = buyPrice(tid, id), lock = rep < tier; const n = IT(id).c === 'ammo' || id === 'bolts' ? 10 : 1; return `<div class="row ${lock ? 'dim' : ''}">${ART.tile(id)}<div class="grow"><span class="t">${esc(IT(id).n)}${n > 1 ? ' ×' + n : ''}</span><span class="s">${lock ? `🔒 нужна репутация ${tier}` : `${IT(id).w} кг`}</span></div>${btn(`${p}₽`, () => buy(tid, id), 'sm', lock || G.money < p)}</div>`; }).join('') + '</div>';
    } else if (st.ttab === 'sell') {
      const items = G.inv.filter(e => sellPrice(tid, e.id) > 0);
      h += items.length ? '<div class="list">' + items.map(e => { const p = sellPrice(tid, e.id); return `<div class="row">${ART.tile(e.id)}<div class="grow"><span class="t">${esc(IT(e.id).n)}${e.n > 1 ? ' ×' + e.n : ''}</span><span class="s">${p}₽ за шт.</span></div><div class="acts">${btn(`+${p}₽`, () => sell(tid, e, false), 'sm')}${e.n > 1 ? btn(`все +${p * e.n}₽`, () => sell(tid, e, true), 'sm') : ''}</div></div>`; }).join('') + '</div>' : '<p class="muted">Ему нечего у тебя купить.</p>';
    } else {
      const qs = T.quests.filter(q => !QUESTS[q].ch2 || CH2());
      const nextQ = qs.find(q => G.w.quests[q] !== 'done');
      qs.filter(q => G.w.quests[q] === 'done').forEach(q => h += `<div class="row dim"><span class="ic">✅</span><div class="grow"><span class="t">${QUESTS[q].n}</span></div></div>`);
      if (!nextQ) h += '<p class="muted">«Больше просить не о чем. Спасибо тебе.»</p>';
      else { const Q = QUESTS[nextQ], act = G.w.quests[nextQ] === 'active';
        h += `<div class="row"><span class="ic">📜</span><div class="grow"><span class="t">${Q.n}</span><span class="s">«${esc(Q.d)}»</span>${act ? `<span class="s">Прогресс: ${questProgress(nextQ)}</span>` : ''}<span class="s">Награда: ${[Q.rew.money ? Q.rew.money + '₽' : '', ...Object.entries(Q.rew.items || {}).map(([k, v]) => itName(k, v))].filter(Boolean).join(', ')}</span></div>${act ? btn('Сдать', () => turnIn(nextQ), 'pri sm', !questDone(nextQ)) : btn('Взять', () => acceptQuest(nextQ), 'pri sm')}</div>`; }
    }
    return h;
  }

  // ---------------- ВЕЩИ ----------------
  const CAT_ORDER = ['gun', 'melee', 'ammo', 'med', 'food', 'drink', 'wear', 'art', 'tool', 'key', 'quest', 'bp', 'mat', 'val'];
  const CAT_N = { gun: 'Оружие', melee: 'Оружие', ammo: 'Патроны', med: 'Медицина', food: 'Еда', drink: 'Питьё', wear: 'Снаряжение', art: 'Артефакты', tool: 'Инструменты', key: 'Ключи', quest: 'Сюжетное', bp: 'Чертежи', mat: 'Материалы', val: 'Ценности' };
  function itemSub(e) {
    const it = IT(e.id), p = [];
    p.push(`${(it.w * e.n).toFixed(it.w * e.n < 1 ? 2 : 1)} кг`);
    if (e.dur != null && it.dur) p.push(`прочность ${Math.round(e.dur / it.dur * 100)}%`);
    if (e.uses != null && it.uses) p.push(`ещё ${e.uses} раз`);
    if (it.sp && F().spoil) { const fr = freshness(e); p.push(fr >= 1 ? '<span class="bad">испорчено</span>' : fr >= 0.7 ? '<span class="warn">скоро испортится</span>' : 'свежее'); }
    if (it.f || it.d) p.push(`${it.f ? '🍗+' + it.f : ''} ${it.d ? '💧+' + it.d : ''}`.trim());
    if (it.raw) p.push('<span class="warn">лучше приготовить</span>');
    if (it.dmg) p.push(`урон ${it.dmg[0]}–${it.dmg[1]}`);
    if (it.c === 'gun') p.push(`патроны: ${cnt(G.inv, it.ammo)}`);
    if (it.arm) p.push(`броня +${it.arm}`); if (it.warm) p.push(`тепло +${it.warm}`); if (it.cap) p.push(`+${it.cap} кг`);
    if (it.d && it.c === 'art') p.push(esc(it.d));
    return p.join(' · ');
  }
  function itemActs(e, where) {
    const it = IT(e.id), out = [];
    if (where === 'inv') {
      if (it.c === 'food' || it.c === 'drink') out.push(btn(it.c === 'drink' ? 'Выпить' : it.smoke ? 'Закурить' : 'Съесть', () => useItem(e.id), 'pri sm'));
      if (it.c === 'med') out.push(btn('Использовать', () => useItem(e.id), 'pri sm'));
      if (it.c === 'bp') out.push(btn('Изучить', () => useItem(e.id), 'pri sm'));
      if (['melee', 'gun', 'wear', 'art'].includes(it.c)) out.push(btn('Надеть', () => equip(e), 'pri sm'));
      if (atBase()) out.push(btn('На склад', () => toStash(e)), e.n > 1 ? '' : '');
      if (e.n > 1) out.push(btn(G.room != null ? 'Бросить 1' : 'Выбросить 1', () => { drop(e, 1); }, 'sm'));
      out.push(btn(G.room != null ? (e.n > 1 ? 'Бросить все' : 'Бросить') : (e.n > 1 ? 'Выбросить все' : 'Выбросить'), () => { drop(e); }, 'sm'));
    } else out.push(btn('Взять', () => fromStash(e), 'pri sm'), (it.c === 'food' || it.c === 'drink' || it.c === 'med') ? btn('Использовать', () => useItem(e.id), 'sm') : '');
    return out.join('');
  }
  function itemList(list, where) {
    const sorted = list.slice().sort((x, y) => CAT_ORDER.indexOf(IT(x.id).c) - CAT_ORDER.indexOf(IT(y.id).c) || IT(x.id).n.localeCompare(IT(y.id).n));
    let h = '', lastCat = '';
    sorted.forEach(e => {
      const it = IT(e.id), key = where + list.indexOf(e);
      if (CAT_N[it.c] !== lastCat) { lastCat = CAT_N[it.c]; h += `<div class="eyebrow">${lastCat}</div>`; }
      const open = st.open === key;
      h += `<div class="row" style="flex-wrap:wrap">${ART.tile(e.id)}<div class="grow" onclick="${a(() => st.open = open ? null : key)}" style="cursor:pointer"><span class="t">${esc(it.n)}${e.n > 1 ? ' ×' + e.n : ''}</span><span class="s">${itemSub(e)}</span></div>${open ? `<div class="acts" style="width:100%">${itemActs(e, where)}</div>` : `<button class="btn sm" onclick="${a(() => st.open = key)}">⋯</button>`}</div>`;
    });
    return h || '<p class="muted">Пусто.</p>';
  }
  const canMake = r => Math.min(30, ...Object.entries(r.need).map(([k, v]) => Math.floor(allCnt(k) / v)));
  function handCraft() {
    const fire = campHere() || (atBase() && G.w.struct.fire > 0);
    const rs = RECIPES.filter(r => (!r.st || (r.st === 'fire' && fire)) && (!r.bp || G.w.bp[r.bp]) && (!r.ch2 || CH2()));
    const rows = rs.map(r => { const w = recipeState(r); return `<div class="row ${w ? 'dim' : ''}"><div class="grow"><span class="t">${esc(r.n)}</span><span class="s">${Object.entries(r.need).map(([k, v]) => `${IT(k).ic}${IT(k).n} ${allCnt(k)}/${v}`).join(', ')}${r.st ? ' · на огне' : ''} · ${r.t} мин</span></div><div class="acts">${btn('Сделать', () => craft(r), 'sm', !!w)}${!w && canMake(r) > 1 ? btn(`×${canMake(r)}`, () => craftMax(r), 'sm') : ''}</div></div>`; }).join('');
    const camp = campHere() ? `<span class="chip good">🔥 костёр: ещё ${G.campfire.until - G.time} мин</span>` : (!L().base ? btn('🔥 Развести костёр (2 дров)', makeCamp, 'sm', !cnt(G.inv, 'lighter') || cnt(G.inv, 'wood') < 2) : '');
    return `<div class="sec" id="craftsec"><div class="sechead"><h2>Крафт в руках</h2>${camp}</div><p class="muted" style="font-size:13px">Простые вещи можно делать где угодно. ${fire ? 'Огонь рядом — можно жарить и кипятить.' : 'Чтобы жарить и кипятить вне базы, разведи костёр.'} Сложное — на верстаке базы.</p><div class="list">${rows}</div></div>`;
  }
  function renderInv() {
    const w = curW(), cap = capW();
    const slot = (name, e, s, idx) => `<div class="row"><div class="grow"><span class="s">${name}</span><span class="t">${e ? `${IT(e.id).ic} ${esc(IT(e.id).n)}` : '<span class="muted">—</span>'}</span>${e ? `<span class="s">${itemSub(e)}</span>` : ''}</div>${e ? btn('Снять', () => unequip(s, idx), 'sm') : ''}</div>`;
    let h = `${tutCard()}${logLast(2)}<div class="sec"><div class="sechead"><h1>Вещи</h1><span class="mono ${w > cap ? 'bad' : 'muted'}">${w.toFixed(1)} / ${cap} кг</span></div>${bar(w, cap * 1.5, true)}${w > cap ? `<p class="bad">Перегруз: ходишь медленнее${w > cap * 1.5 ? ', а с таким весом вообще не уйти' : ''}.</p>` : ''}</div>`;
    h += `<div class="sec"><h2>Снаряжение</h2><div class="eqgrid">${slot('Оружие', G.eq.weapon, 'weapon')}${slot('Одежда', G.eq.body, 'body')}${slot('Бронежилет', G.eq.vest, 'vest')}${slot('Рюкзак', G.eq.bag, 'bag')}${slot('Маска', G.eq.mask, 'mask')}${slot('Пояс: артефакт 1', G.eq.art[0], 'art', 0)}${slot('Пояс: артефакт 2', G.eq.art[1], 'art', 1)}</div>`;
    if (G.eq.weapon && G.eq.weapon.dur != null) h += `<div class="acts">${btn('🩶 Подлатать оружие скотчем', repairWeapon, 'sm', !allCnt('tape'))}</div>`;
    const FL = { all: ['Всё', null], food: ['Еда', ['food', 'drink']], med: ['Медицина', ['med']], war: ['Оружие', ['melee', 'gun', 'ammo', 'wear']], mat: ['Прочее', ['mat', 'tool', 'bp', 'key', 'quest', 'val', 'art']] };
    const f = FL[st.invf || 'all'] || FL.all; const shown = f[1] ? G.inv.filter(e => f[1].includes(IT(e.id).c)) : G.inv;
    h += `</div><div class="sec"><h2>Рюкзак</h2><div class="toggle filt">${Object.entries(FL).map(([k, v]) => `<button class="${(st.invf || 'all') === k ? 'on' : ''}" onclick="${a(() => st.invf = k)}">${v[0]}</button>`).join('')}</div><div class="list">${itemList(shown, 'inv')}</div></div>`;
    h += handCraft();
    if (atBase()) h += `<div class="sec"><div class="sechead"><h2>Склад базы</h2>${btn('Сложить материалы', stashAllMats, 'sm')}</div><div class="list">${itemList(G.stash, 'stash')}</div></div>`;
    return h;
  }

  // ---------------- ТЕЛО ----------------
  function renderChar() {
    const c = G.ch, f = F();
    let h = `${logLast(2)}<div class="sec"><div class="eyebrow">${MODES[G.mode].ic} ${MODES[G.mode].n}${G.w.gen > 1 ? ` · выживший №${G.w.gen}` : ''}</div><h1>${esc(c.name)}</h1><div class="acts"><span class="chip good">${(PROFS[c.prof] || PROFS.unemployed).ic} ${(PROFS[c.prof] || PROFS.unemployed).n}</span>${c.traits.filter(t => TRAITS[t]).map(t => `<span class="chip" title="${esc(TRAITS[t].d)}">${TRAITS[t].ic} ${TRAITS[t].n}</span>`).join('') || '<span class="muted">без черт</span>'}</div>${(c.perks || []).length ? `<div class="acts">${c.perks.map(id => PERK_BY[id] ? `<span class="chip warn" title="${esc(PERK_BY[id].d)}">⭐ ${PERK_BY[id].ic} ${PERK_BY[id].n}</span>` : '').join('')}</div>` : ''}<p class="muted mono">Жив ${Math.floor((G.time - c.born) / DAY)} дн. · убито ${c.kills} · ${G.w.deaths.length ? `смертей: ${G.w.deaths.length}` : 'ни разу не умирал'}</p></div>`;
    if (f.parts) {
      const kinds = [['bandage', 'dband'], ['antisep', 'alcohol'], ['splint']];
      const have = k => kinds[k].find(id => cnt(G.inv, id));
      h += `<div class="sec"><h2>Здоровье ${healthPct()}%</h2><div class="list">`;
      for (const p in PARTS) {
        const inj = c.inj.filter(j => j.part === p);
        h += `<div class="row" style="flex-wrap:wrap"><div class="grow"><span class="t">${PARTS[p].n} <span class="mono muted">${Math.round(c.parts[p])}/${PARTS[p].max}</span></span>${bar(c.parts[p], PARTS[p].max)}</div>`;
        if (inj.length) h += `<div class="list" style="width:100%">${inj.map(j => {
          const tags = [j.bleed > 0 && !j.band ? '<span class="chip bad">🩸 кровит</span>' : '', j.band ? `<span class="chip ${j.dirty ? 'warn' : 'good'}">перевязано${j.dirty ? ' (грязно)' : ''}</span>` : '', j.dis ? '<span class="chip good">обработано</span>' : '', j.inf >= 15 ? `<span class="chip ${j.inf >= 60 ? 'bad' : 'warn'}">воспаление ${Math.round(j.inf)}%</span>` : '', j.t === 'frac' ? `<span class="chip ${j.splint ? 'good' : 'bad'}">${j.splint ? 'в шине' : 'нужна шина'}</span>` : ''].join('');
          const b = [];
          if (!j.band && j.t !== 'frac' && j.t !== 'bruise') { const id = have(0); b.push(btn('🩹 Перевязать', () => useItem(id, false, j), 'sm', !id)); }
          if (!j.dis && f.infection && j.t !== 'frac' && j.t !== 'bruise') { const id = have(1); b.push(btn('🧴 Обработать', () => useItem(id, false, j), 'sm', !id)); }
          if (j.t === 'frac' && !j.splint) { const id = have(2); b.push(btn('🦯 Шина', () => useItem(id, false, j), 'sm', !id)); }
          return `<div class="row" style="flex-wrap:wrap;background:var(--panel2)"><div class="grow"><span class="t">${INJ[j.t].n}</span><span class="acts">${tags}<span class="chip">заживает ${Math.min(99, Math.round(j.prog / INJ[j.t].heal * 100))}%</span></span></div><div class="acts">${b.join('')}</div></div>`;
        }).join('')}</div>`;
        h += '</div>';
      }
      h += '</div></div>';
    } else h += `<div class="sec"><h2>Здоровье ${Math.round(c.hp)}%</h2>${bar(c.hp)}${c.bleed ? `<div class="acts"><span class="chip bad">🩸 кровотечение</span>${btn('🩹 Перевязать', () => useItem(cnt(G.inv, 'bandage') ? 'bandage' : 'dband'), 'sm', !cnt(G.inv, 'bandage') && !cnt(G.inv, 'dband'))}</div>` : ''}</div>`;
    const stats = [['🍗 Сытость', c.food], ['💧 Вода', c.drink], ['⚡ Силы', c.energy], ['😰 Стресс', c.stress, 1]];
    if (f.rad) stats.push(['☢️ Радиация', c.rad / 2, 1, Math.round(c.rad)]);
    if (f.cold) stats.push(['🥶 Холод', c.cold, 1]);
    stats.push(['💦 Сырость', c.wet, 1]);
    h += `<div class="sec"><h2>Состояние</h2><div class="grid2">${stats.map(([n, v, inv, shown]) => `<div class="vit" style="font-size:12.5px">${n} <span class="mono">${shown != null ? shown : Math.round(v)}</span>${bar(v, 100, inv)}</div>`).join('')}</div>`;
    const md = moodles(); if (md.length) h += `<div class="list">${md.map(x => `<div class="row"><span class="ic">${x.ic}</span><div class="grow"><span class="t">${x.n}</span><span class="s">${esc(x.d)}</span></div></div>`).join('')}</div>`;
    h += '</div>';
    h += `<div class="sec"><h2>Навыки</h2><div class="grid2">${Object.keys(SKILLS).map(k => { const lv = skill(k), raw = SKILL_XP.findIndex((x, i) => i > 0 && c.xp[k] < x); const lo = SKILL_XP[Math.max(0, (raw < 0 ? SKILL_XP.length : raw) - 1)], hi = raw < 0 ? lo : SKILL_XP[raw]; return `<div class="vit" style="font-size:12.5px">${SKILLS[k].ic} ${SKILLS[k].n} <b class="mono">${lv}</b>${bar(raw < 0 ? 1 : c.xp[k] - lo, raw < 0 ? 1 : hi - lo)}</div>`; }).join('')}</div><p class="muted" style="font-size:13px">Навыки растут от дела: дерёшься — растёт ближний бой, обыскиваешь — поиск.</p></div>`;
    h += `<div class="sec"><div class="sechead"><h2>Правила сложности</h2>${btn(st.showRules ? 'Скрыть' : 'Показать', () => st.showRules = !st.showRules, 'sm')}</div>${st.showRules ? `<ul class="muted" style="margin:0;padding-left:18px">${MODES[G.mode].rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</div>`;
    return h;
  }

  // ---------------- БАЗА ----------------
  function renderBase() {
    const s = G.w.struct;
    if (!atBase()) return `${logLast(2)}<h1>🏚️ База</h1><div class="note">Ты не на базе. Лодочная станция — ${LOCS.base.links[G.loc] ? `${LOCS.base.links[G.loc]} мин отсюда` : 'далеко отсюда'}.<br>Укрепления: ${STRUCT.walls.lv[s.walls].n}${s.walls ? ` (${G.w.wallHp}%)` : ''} · защита ${defense()}</div>`;
    const d = day(), nextBN = d % 7 === 0 && hour() < 22 ? d : d + (7 - d % 7);
    const power = Math.round((25 + nextBN * 2.5) * F().horde);
    let h = `${ART.sceneTag({ loc: 'base', key: 'base', alt: 'Лодочная станция', camp: false })}${tutCard()}${logLast(3)}<div class="sec"><h1>🏚️ Лодочная станция</h1><p class="muted">Защита <b class="mono">${defense()}</b> · следующая Кровавая ночь — день ${nextBN}, натиск ≈ <b class="mono">${power}</b> за ночь (3 волны).${s.walls ? ` Укрепления: ${G.w.wallHp}%.` : ''}</p></div>`;
    h += `<div class="grid2">${btn(`😴 Спать до утра${s.bed ? ' (кровать)' : ''}`, () => sleepHere())}${btn('😴 Вздремнуть 2 ч', () => sleepHere(2))}${btn('🐈 Погладить кота', petCat)}${btn('🔨 Подлатать стены (2 доски, 4 гвоздя)', repairWalls, '', !s.walls)}${s.radio ? btn('📻 Слушать эфир', radioMsg) : ''}</div>`;
    h += '<div class="sec"><h2>Постройки</h2><div class="list">';
    for (const id in STRUCT) {
      if (STRUCT[id].ch2 && !CH2()) continue;
      const S = STRUCT[id], lv = s[id] || 0, nx = S.lv[lv + 1], why = canBuild(id);
      const need = nx && nx.c ? Object.entries(nx.c).map(([k, v]) => `<span class="${allCnt(k) >= v ? '' : 'bad'}">${IT(k).ic}${IT(k).n} ${allCnt(k)}/${v}</span>`).join(', ') : '';
      h += `<div class="row ${why === 'bp' ? 'dim' : ''}"><span class="ic">${S.ic}</span><div class="grow"><span class="t">${S.n}: ${lv ? S.lv[lv].n : '<span class="muted">нет</span>'}</span>${nx ? `<span class="s">${why === 'bp' ? '📐 нужен чертёж' : `→ ${nx.n}: ${need}`}</span>` : '<span class="s">максимум</span>'}</div>${nx && why !== 'bp' ? btn(lv ? 'Улучшить' : 'Построить', () => build(id), 'sm pri', !!why) : ''}</div>`;
    }
    h += '</div></div>';
    const rs = RECIPES.map(r => ({ r, w: recipeState(r) })).filter(x => x.w !== 'bp').sort((x, y) => (x.w ? 1 : 0) - (y.w ? 1 : 0));
    h += `<div class="sec"><h2>Мастерская</h2><div class="list">${rs.map(({ r, w }) => `<div class="row ${w ? 'dim' : ''}"><div class="grow"><span class="t">${esc(r.n)}</span><span class="s">${Object.entries(r.need).map(([k, v]) => `${IT(k).ic}${IT(k).n} ${allCnt(k)}/${v}`).join(', ')}${r.st ? ` · нужен ${STATION_N[r.st]}` : ''} · ${r.t} мин</span></div><div class="acts">${btn('Сделать', () => craft(r), 'sm', !!w)}${!w && canMake(r) > 1 ? btn(`×${canMake(r)}`, () => craftMax(r), 'sm') : ''}</div></div>`).join('')}</div><p class="muted" style="font-size:13px">Чертежи из лута открывают новые постройки и рецепты. Изучи чертёж в рюкзаке.</p></div>`;
    h += `<div class="sec"><div class="sechead"><h2>Склад</h2>${btn('Сложить материалы', stashAllMats, 'sm')}</div><div class="list">${itemList(G.stash, 'stash')}</div></div>`;
    return h;
  }

  // ---------------- ЖУРНАЛ ----------------
  function renderJour() {
    const q = Object.entries(G.w.quests);
    const act = q.filter(([, v]) => v === 'active'), done = q.filter(([, v]) => v === 'done');
    const giver = g => g === 'main' ? '⭐ Главное' : TRADERS[g].ic + ' ' + TRADERS[g].n;
    let h = `<h1>📓 Журнал</h1><div class="sec"><h2>Задания</h2><div class="list">${act.map(([id]) => `<div class="row"><div class="grow"><span class="s">${giver(QUESTS[id].g)}</span><span class="t">${QUESTS[id].n}</span><span class="s">${esc(QUESTS[id].d)}</span><span class="s">Прогресс: ${questProgress(id)}</span></div></div>`).join('') || '<p class="muted">Нет активных заданий. Поговори с жителями острова.</p>'}</div>${done.length ? `<p class="muted">Выполнено: ${done.map(([id]) => QUESTS[id].n).join(', ')}</p>` : ''}</div>`;
    if (G.w.ending === 'master' && !G.w.ch2) h += `<div class="sec"><h2>🔮 Глава 2 «Мастер»</h2><p class="muted">Ты забрал ядро Аппарата. Остров ждёт своего Мастера: сильнее враги, чаще Выбросы, кристаллы, лодка и путь к синему шпилю за проливом.</p><div class="acts">${btn('Начать Главу 2', startCh2, 'pri')}</div></div>`;
    h += coopPanel();
    h += lbPanel();
    h += `<div class="sec"><h2>Записки (${G.w.notes.length}/${Object.keys(NOTES).length})</h2><div class="list">${G.w.notes.slice().reverse().map(id => `<div class="note"><b>${esc(NOTES[id].t)}</b><br>${esc(NOTES[id].x)}</div>`).join('')}</div></div>`;
    h += `<div class="sec"><h2>События</h2><div class="list" style="gap:2px">${G.log.slice(-60).reverse().map(x => `<div class="lg ${x.c}" style="font-size:13px"><span class="mono muted">Д${x.d} ${x.k}</span> ${esc(x.t)}</div>`).join('')}</div></div>`;
    h += `<div class="sec"><h2>Звук</h2><div class="acts">${btn(SFX.on ? '🔊 Звук включён' : '🔇 Звук выключен', () => SFX.toggle(), 'sm')}${btn(SFX.music ? '🎵 Музыка: да' : '🎵 Музыка: нет', () => SFX.toggleMusic(), 'sm')}</div><label class="muted" style="display:flex;gap:8px;align-items:center;font-size:13px">Громкость <input type="range" id="vol" min="0" max="100" value="${Math.round(SFX.vol * 100)}" oninput="SFX.setVol(this.value/100)" style="flex:1"></label></div>`;
    h += `<div class="sec"><h2>Игра</h2>${st.confirmNew ? `<p class="bad">Прогресс этой игры удалится. Точно?</p><div class="acts">${btn('Да, начать заново', () => { wipe(); G = null; st.confirmNew = false; startScreen(); }, 'bad')}${btn('Отмена', () => st.confirmNew = false)}</div>` : btn('Новая игра', () => st.confirmNew = true)}<p class="muted" style="font-size:13px">Игра сохраняется сама после каждого действия — в этом браузере.</p></div>`;
    return h;
  }

  // ---------------- КООПЕРАТИВ ----------------
  const ST_N = { off: 'выключен', connecting: 'подключение…', online: 'в сети', offline: 'нет связи — изменения не синхронизируются', readonly: 'только чтение — нет прав на запись' };
  function ago(at) { const m = Math.round((Date.now() - (at || 0)) / 60000); return m < 1 ? 'только что' : m < 60 ? `${m} мин назад` : m < 1440 ? `${Math.round(m / 60)} ч назад` : `${Math.round(m / 1440)} дн. назад`; }
  const FBM = () => !!(window.claude && window.claude._fb);
  function inviteLink(code) { return (window.TG_APP_LINK || '') + '?startapp=' + code; }
  function invite() {
    if (!G || !G.coop) return;
    const link = inviteLink(G.coop.code), text = `🏝 Заходи ко мне на остров! Выживаем вместе в Mystery of the Island.`;
    try { if (window.TGA && TGA.ver('6.1')) { TGA.tg.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(text)); return; } } catch (e) {}
    try { navigator.clipboard.writeText(link).then(() => toast('Ссылка скопирована — отправь её другу'), () => toast(link)); } catch (e) { toast(link); }
  }
  // ---------------- ТАБЛИЦА ВЫЖИВШИХ ----------------
  const lbs = { list: null, at: 0, busy: false, err: '' };
  const MODE_IC = { tourist: '🏖️', survivor: '🎒', hardcore: '☠️' };
  function lbLoad(force) {
    if (!window.FB || !FB.lb || lbs.busy || (!force && Date.now() - lbs.at < 60000)) return;
    lbs.busy = true;
    lbSubmit(true).then(() => FB.lb.top(20)).then(l => { lbs.list = l; lbs.err = ''; }, () => { lbs.err = 'Нет связи с сервером.'; }).finally(() => { lbs.busy = false; lbs.at = Date.now(); if (st.tab === 'jour') render(); });
  }
  function lbPanel() {
    if (!window.FB || !FB.lb) return '';
    lbLoad();
    const me = FB.uid;
    const rows = (lbs.list || []).map((e, i) => `<div class="row ${e.id === me ? 'evt' : ''}"><span class="ic mono">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span><div class="grow"><span class="t">${esc(e.name || 'Выживший')}${e.id === me ? ' (ты)' : ''}${e.alive ? '' : ' ☠️'}</span><span class="s">${MODE_IC[e.mode] || ''} ${MODES[e.mode] ? MODES[e.mode].n : ''}${e.coop ? ' · 🤝' : ''} · убито: ${e.kills || 0}</span></div><b class="mono">${e.days} дн.</b></div>`).join('');
    return `<div class="sec"><div class="sechead"><h2>🏆 Таблица выживших</h2>${btn(lbs.busy ? '…' : '↻', () => lbLoad(true), 'sm')}</div>
      <p class="muted" style="font-size:13px">Сколько дней прожил персонаж. У каждого игрока в таблице — лучший забег; живой забег обновляется по ходу игры.</p>
      <div class="list">${lbs.list ? (rows || '<p class="muted">Пока никого — будь первым.</p>') : `<p class="muted">${lbs.err || 'Загружаю…'}</p>`}</div></div>`;
  }
  function coopPanel() {
    if (window.TGA && !window.claude) return `<div class="sec"><h2>🤝 Кооператив</h2><p class="muted">В Telegram-версии кооператив появится в следующем обновлении: друг будет заходить в твой мир по ссылке-приглашению.</p></div>`;
    if (!G.coop) return `<div class="sec"><h2>🤝 Кооператив</h2><p class="muted">Позови друга в свой мир. База, склад, постройки, задания и время станут общими; персонаж и рюкзак у каждого свои. Если вы в одной локации, друг помогает в бою.</p>
      ${FBM() ? `<ol class="muted" style="margin:0;padding-left:20px;font-size:14px;display:grid;gap:2px"><li>Нажми «Создать общий мир».</li><li>Нажми «Пригласить друга» и отправь ему ссылку в Телеграме.</li><li>Друг открывает ссылку — и сразу попадает в твой мир.</li></ol>` : `<ol class="muted" style="margin:0;padding-left:20px;font-size:14px;display:grid;gap:2px"><li>Нажми «Создать общий мир» — получишь код.</li><li>«Поделиться» вверху страницы → пригласи друга по email с правом <b>редактора</b>.</li><li>Друг открывает страницу → «Присоединиться к другу» → вводит код.</li></ol>`}
      <div class="acts">${btn(st.coopBusy ? 'Создаю…' : '🌍 Создать общий мир', async () => { if (st.coopBusy) return; st.coopBusy = true; render(); const err = await COOP.create(); st.coopBusy = false; if (err) toast(err); render(); }, 'pri', st.coopBusy)}</div></div>`;
    COOP.readAll();
    const ps = COOP.others();
    let h = `<div class="sec"><div class="sechead"><h2>🤝 Кооператив</h2><span class="chip ${COOP.status === 'online' ? 'good' : 'warn'}">${ST_N[COOP.status] || COOP.status}</span></div>
      <div class="row"><div class="grow"><span class="s">Код мира — отправь другу</span><span class="t mono" style="font-size:22px;letter-spacing:.2em;user-select:all">${esc(G.coop.code)}</span></div>${btn('Копировать', () => { try { navigator.clipboard.writeText(G.coop.code).then(() => toast('Код скопирован'), () => toast('Выдели код и скопируй вручную')); } catch (e) { toast('Выдели код и скопируй вручную'); } }, 'sm')}</div>
      ${FBM() ? `<div class="acts">${btn('📨 Пригласить друга', invite, 'pri')}</div><p class="muted" style="font-size:13px">Друг откроет ссылку в Телеграме и сразу окажется в этом мире.</p>` : `<p class="muted" style="font-size:13px">Друг должен быть приглашён к этой странице как редактор («Поделиться» → по email).</p>`}
      <div class="list">${ps.length ? ps.map(p => `<div class="row ${p.online ? '' : 'dim'}"><span class="ic">${stIcon(p)}</span><div class="grow"><span class="t">${esc(p.name || 'Выживший')}${p.alive === false ? ' ☠️' : ''}</span><span class="s">${LOCS[p.loc] ? LOCS[p.loc].ic + ' ' + LOCS[p.loc].n : '—'}${p.room ? ' · ' + esc(p.room) : ''} · ❤️ ${p.hp ?? '?'}%</span><span class="s">${esc(p.act || '')} · ${p.online ? 'в игре' : 'был ' + ago(p.at)}</span></div>${btn('›', () => friendSheet(p), 'sm')}</div>`).join('') : '<p class="muted">Пока в мире только ты.</p>'}</div>
      <h3>Сигналы</h3><div class="acts">${['Нужна помощь!', 'Иди сюда!', 'Иду к тебе', 'Встречаемся на базе'].map(t => btn('📣 ' + t, () => COOP.ping(t), 'sm')).join('')}</div>
      <h3>Лента отряда</h3><div class="clog" style="max-height:180px">${COOP.feedList.slice(-15).reverse().map(x => `<div class="lg"><b>${esc(x.n)}</b> ${esc(x.t)} <span class="muted mono" style="font-size:11px">${ago(x.at)}</span></div>`).join('') || '<div class="lg dim">Пока тихо.</div>'}</div>
      <h3>Чат</h3><div class="clog" style="max-height:220px">${COOP.chat.slice(-20).map(x => `<div class="lg"><b>${esc(x.n)}:</b> ${esc(x.t)} <span class="muted mono" style="font-size:11px">${ago(x.at)}</span></div>`).join('') || '<div class="lg dim">Сообщений нет.</div>'}</div>
      <div style="display:flex;gap:6px"><input type="text" id="chatin" maxlength="240" placeholder="Написать другу…" onkeydown="if(event.key==='Enter'){UI._chat()}"><button class="btn pri" onclick="UI._chat()">➤</button></div>
      <div class="acts">${st.confirmLeave ? `<span class="bad">Выйти из общего мира? Твоя копия мира останется у тебя как одиночная игра.</span>${btn('Да, выйти', () => { COOP.leave(); st.confirmLeave = false; }, 'bad sm')}${btn('Отмена', () => st.confirmLeave = false, 'sm')}` : btn('Выйти из общего мира', () => st.confirmLeave = true, 'sm')}</div></div>`;
    return h;
  }
  async function sendChat() { const el = $('chatin'); if (!el) return; const t = el.value; el.value = ''; await COOP.send(t); render(); }
  function giveMenu(p) {
    const items = G.inv.filter(e => IT(e.id).c !== 'quest' || e.id === 'rpart');
    if (!items.length) return toast('Рюкзак пуст.');
    event({ title: `🎁 Передать: ${p.name}`, text: 'Что отдать? Предмет уйдёт целиком (вся пачка).', choices: items.slice(0, 14).map(e => ({ t: `${IT(e.id).ic} ${IT(e.id).n}${e.n > 1 ? ' ×' + e.n : ''}`, fn: () => COOP.give(p.id, e) })).concat([{ t: 'Отмена' }]) });
  }

  // ---------------- ГЛАВНЫЙ РЕНДЕР ----------------
  function render() {
    if (!G || full) return;
    ACT = [];
    renderTop(); renderTabs();
    const scr = { map: renderMap, loc: renderLoc, inv: renderInv, char: renderChar, base: renderBase, jour: renderJour }[st.tab]();
    const mn = $('main'); const keep = st.lastTab === st.tab ? mn.scrollTop : 0; st.lastTab = st.tab;
    const ae = document.activeElement, keepId = ae && ae.id && ae.tagName === 'INPUT' ? ae.id : null, keepVal = keepId ? ae.value : null, chatVal = $('chatin') ? $('chatin').value : '';
    mn.innerHTML = scr; mn.scrollTop = keep;
    if ($('chatin') && chatVal) $('chatin').value = chatVal;
    if (keepId && $(keepId)) { $(keepId).value = keepVal; $(keepId).focus(); }
    ART.paintAll($('main'));
    if (window.SFX) SFX.refresh();
    if (st.scrollCraft) { st.scrollCraft = false; const c = $('craftsec'); if (c) c.scrollIntoView(); }
  }
  function go(tab) { if (tab === 'room' || tab === 'loc') { st.tab = 'loc'; if (tab === 'loc') st.trader = null; } else st.tab = tab; render(); }

  // ---------------- СОБЫТИЯ ----------------
  function event(e) { queue.push(e); if (!cur && !G.combat && !full) showNext(); }
  function showNext() {
    if (G && G.combat) return;
    cur = queue.shift();
    if (!cur) { $('modal').innerHTML = ''; return; }
    if (cur.horde) return hordeSheet(cur);
    MACT = [];
    const ch = (cur.choices && cur.choices.length ? cur.choices : [{ t: 'OK' }]).map(c => `<button class="btn ${c.cls || ''}" onclick="${m(() => { const was = cur; cur = null; $('modal').innerHTML = ''; if (c.fn) c.fn(); if (G && !G.dead) save(); if (!full) { showNext(); render(); } })}">${esc(c.t)}</button>`).join('');
    $('modal').innerHTML = `<div class="overlay"><div class="sheet ${cur.cls || ''} anim" role="dialog" aria-modal="true"><h2>${esc(cur.title)}</h2><div class="txt">${esc(cur.text || '')}</div><div class="choices">${ch}</div></div></div>`;
  }

  // ---------------- БОЙ ----------------
  function combat() {
    const cb = G.combat;
    if (!cb) { closeCombat('none'); return; }
    MACT = [];
    const ms = meleeStats(), w = curWeapon(), gun = w && w.c === 'gun';
    const DIST = ['вплотную', 'рядом', 'далеко'];
    const alive = cb.en.filter(e => e.hp > 0);
    const enemies = cb.en.map((e, i) => { const D = ENEMY[e.id]; if (e.hp <= 0) return `<div class="enemy dead">${ART.enemyImg(e.id)}<div>${D.n} ☠️</div><span></span></div>`;
      const acts = [];
      if (e.dist <= (ms.reach ? 1 : 0)) acts.push(mbtn(`⚔️ ${esc(ms.n)}`, () => pAttack(i), 'pri sm'));
      if (gun) acts.push(mbtn(`🔫 (${cnt(G.inv, w.ammo)})`, () => pShoot(i), 'sm', !cnt(G.inv, w.ammo)));
      if (e.dist === 0 && !D.boss) acts.push(mbtn('🦶', () => pPush(i), 'sm'));
      return `<div class="enemy">${ART.enemyImg(e.id, e.stun ? 'stun' : '')}<div><div class="t">${D.n}${e.gear ? ` <span class="muted">(${IT(e.gear).n})</span>` : ''}${e.stun ? ' 💫' : ''}</div>${bar(e.hp, e.max)}<span class="dist">${DIST[Math.min(2, e.dist)]}</span></div><div class="acts">${acts.join('')}</div></div>`; }).join('');
    const meds = ['bandage', 'dband', 'medkit', 'painkill', 'antisep', 'splint'].filter(id => cnt(G.inv, id));
    const human = alive.some(e => ENEMY[e.id].human);
    const lg = cb.log.slice(-8).map(x => `<div class="lg ${x.c || ''}">${esc(x.t)}</div>`).join('');
    const fresh = !$('modal').querySelector('.combat');
    $('modal').innerHTML = `<div class="overlay"><div class="sheet bad combat ${fresh ? 'anim' : ''}" role="dialog" aria-modal="true">
      <div class="sechead"><h2>⚔️ Бой · ход ${cb.turn}</h2><span class="mono muted">❤️ ${healthPct()}% · ⚡${Math.round(G.ch.energy)}${bleeding() ? ' · 🩸' : ''}</span></div>
      <div class="list">${enemies}</div>
      ${lg ? `<div class="clog" id="clog">${lg}</div>` : ''}
      <div class="acts">${alive.every(e => e.dist > (ms.reach ? 1 : 0)) ? mbtn('⏳ Ждать, пока подойдут', () => { G.combat.log.push({ t: '⏳ Ты ждёшь, сжимая оружие…', c: 'dim' }); endPlayerTurn(); }) : ''}${mbtn(`🏃 Бежать (${Math.round(fleeChance() * 100)}%)`, pFlee)}${human ? mbtn('🤝 Договориться', pTalk) : ''}${G.coop && COOP.status === 'online' && !G.combat.called ? mbtn('📣 Позвать на помощь', () => { G.combat.called = true; COOP.ping('Нужна помощь! Я в бою.'); combat(); }) : ''}${meds.map(id => mbtn(`${IT(id).ic} ${IT(id).n}`, () => pUse(id), 'sm')).join('')}</div>
      <p class="muted" style="font-size:12.5px">Бить можно только тех, кто вплотную${ms.reach ? ' (копьём — и тех, кто рядом)' : ''}. 🦶 — оттолкнуть и оглушить. Выстрелы шумят и привлекают других.</p>
    </div></div>`;
    const cl = $('clog'); if (cl) cl.scrollTop = 1e9;
    renderTop();
  }
  function closeCombat(res, cb) {
    if (full) return;
    $('modal').innerHTML = '';
    if (cb && cb.log.length) { const k = cb.log.filter(x => x.t.startsWith('☠️')).length; log(res === 'win' ? `⚔️ Бой выигран${k ? `, повержено: ${k}` : ''}.` : res === 'fled' ? '🏃 Ты сбежал из боя.' : res === 'talk' ? '🤝 Разошлись миром.' : '⚔️ Бой окончен.', res === 'win' || res === 'talk' ? 'good' : 'warn'); }
    cur = null;
    if (full) return;
    showNext(); render();
  }

  // ---------------- КРОВАВАЯ НОЧЬ ----------------
  function horde(power) { event({ horde: power, wave: 0, txt: [] }); }
  function hordeSheet(h) {
    MACT = [];
    const w = curWeapon(), gun = w && w.c === 'gun' && cnt(G.inv, w.ammo);
    const wp = h.power / 3 * RF(0.85, 1.2);
    let body;
    if (h.wave < 3 && !G.dead) {
      body = `<div class="txt">${h.wave === 0 ? `Из темноты накатывает рёв. Орда идёт на базу. Натиск ≈ ${h.power}, твоя защита ${defense()}.\n\n` : ''}${esc(h.txt.join('\n\n'))}</div><h3>Волна ${h.wave + 1} из 3. Что делаешь?</h3>
      <div class="choices">${mbtn(`🔫 Стрелять с крыши${gun ? ` (${cnt(G.inv, w.ammo)} патр.)` : ' — нет огнестрела/патронов'}`, () => step('shoot'), 'pri', !gun)}${mbtn(`⚔️ Держать проход (${esc(meleeStats().n)}) — рискованно`, () => step('melee'))}${mbtn('🕳️ Спрятаться в подвале — стены примут удар', () => step('hide'))}</div>`;
    } else body = `<div class="txt">${esc(h.txt.join('\n\n'))}\n\n🌅 Небо светлеет. Орда откатывается в лес.</div><div class="choices">${mbtn('Пережил', () => { cur = null; $('modal').innerHTML = ''; save(); showNext(); render(); }, 'pri')}</div>`;
    function step(c) {
      const deaths = G.w.deaths.length;
      const r = hordeWave(c, wp); h.txt.push(`— Волна ${h.wave + 1} —\n` + r); h.wave++;
      if (G.w.deaths.length === deaths) advance(80);
      if (G.dead) return;
      if (G.w.deaths.length !== deaths) { cur = null; $('modal').innerHTML = ''; save(); showNext(); render(); return; }
      hordeSheet(h); renderTop();
    }
    $('modal').innerHTML = `<div class="overlay"><div class="sheet bad" role="dialog" aria-modal="true"><h2>🌕 Кровавая ночь</h2>${body}</div></div>`;
  }

  // ---------------- ПОЛНЫЕ ЭКРАНЫ ----------------
  function showFull(html) { full = true; MACT = []; $('modal').innerHTML = `<div class="full"><div class="inner">${html()}</div></div>`; ART.paintAll($('modal')); }
  function closeFull() { full = null; $('modal').innerHTML = ''; showNext(); render(); }
  const sel = { mode: 'survivor', traits: [], name: '', prof: 'unemployed' };
  // ---------- конструктор персонажа: профессия + черты ----------
  function cpts(o) { const P = PROFS[o.prof] || PROFS.unemployed; return P.pts - o.traits.reduce((a, t) => a + TRAITS[t].cost, 0); }
  function toggleTrait(o, k) { if (o.traits.includes(k)) o.traits = o.traits.filter(x => x !== k); else { const g = TRAITS[k].g; o.traits = o.traits.filter(x => !g || TRAITS[x].g !== g).concat(k); } }
  function charBuilder(o, draw) {
    o.prof = o.prof || 'unemployed';
    const P = PROFS[o.prof], left = cpts(o);
    const skl = sk => Object.entries(sk || {}).map(([k, v]) => `${SKILLS[k].ic}${v > 0 ? '+' : ''}${v}`).join(' ');
    const tbtn = ([k, T]) => `<button class="trait ${o.traits.includes(k) ? 'on' : ''}" onclick="${m(() => { toggleTrait(o, k); draw(); })}"><span class="tn"><span>${T.ic} ${T.n}</span><span class="mono ${T.cost > 0 ? 'warn' : 'good'}">${T.cost > 0 ? '−' + T.cost : '+' + (-T.cost)}</span></span><span class="muted">${esc(T.d)}${T.sk ? ' · ' + skl(T.sk) : ''}</span></button>`;
    let h = `<h2>Профессия</h2><div class="traits">${Object.entries(PROFS).map(([k, Q]) => `<button class="trait ${o.prof === k ? 'on' : ''}" onclick="${m(() => { o.prof = k; draw(); })}"><span class="tn"><span>${Q.ic} ${Q.n}</span><span class="mono ${Q.pts >= 4 ? 'good' : Q.pts < 0 ? 'bad' : ''}">${Q.pts} оч.</span></span><span class="muted">${esc(Q.d)}${Q.sk ? ' · ' + skl(Q.sk) : ''}</span></button>`).join('')}</div>`;
    h += `<div class="sechead"><h2>Черты</h2><span class="mono ${left < 0 ? 'bad' : 'good'}">очки: ${left}</span></div><p class="muted" style="font-size:13px">${P.ic} ${P.n} даёт ${P.pts} оч. Плюсы стоят очков, минусы их дают. Итог не может быть меньше нуля. Похожие черты взаимоисключают друг друга.</p>`;
    const T = Object.entries(TRAITS);
    h += `<h3>Плюсы</h3><div class="traits">${T.filter(([, x]) => x.cost > 0).map(tbtn).join('')}</div><h3>Минусы</h3><div class="traits">${T.filter(([, x]) => x.cost < 0).map(tbtn).join('')}</div>`;
    return h;
  }
  function startScreen(cont) {
    const pts = () => cpts(sel);
    const draw = () => showFull(() => {
      let h = `${ART.sceneTag({ loc: cont ? 'base' : 'lighthouse', key: 'title', title: true, alt: 'Остров на закате' })}<div class="title"><small>${cont ? 'ОСТРОВ ЖДЁТ НОВОГО' : 'ВЫЖИВАНИЕ · С 2020 ГОДА'}</small>${cont ? 'Новый выживший' : 'Mystery of the Island'}</div>`;
      if (!cont) {
        h += `<p class="muted">Ты очнулся в лодочном сарае на острове, закрытом на карантин. Заражённые, аномалии, Выбросы и Кровавые ночи. Где-то в глубине острова — Аппарат, с которого всё началось.</p>`;
        h += `<div class="acts">${localHas() ? mbtn('▶ Продолжить игру', () => { if (load()) { if (G.dead) return deathScreen(G.w.deaths[G.w.deaths.length - 1] || {}); closeFull(); if (G.coop) COOP.init(); } }, 'pri') : ''}${(window.TGA && !window.claude ? '' : mbtn('🤝 Присоединиться к другу', joinScreen))}</div>`;
        h += `<h2>Сложность</h2><div class="modes">${Object.entries(MODES).map(([k, M]) => `<button class="mode ${sel.mode === k ? 'on' : ''}" onclick="${m(() => { sel.mode = k; draw(); })}"><span class="sechead"><h3>${M.ic} ${M.n}</h3><span class="muted" style="font-size:12.5px">${M.tag}</span></span><ul>${M.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></button>`).join('')}</div>`;
      } else h += `<p class="muted">Прошлый выживший погиб. Мир остался прежним: база, склад и всё построенное ждут тебя.</p>`;
      h += `<h2>Имя</h2><input type="text" id="pname" maxlength="24" placeholder="Как тебя звать?" value="${esc(sel.name)}" oninput="UI._name(this.value)">`;
      h += charBuilder(sel, draw);
      h += `<div class="acts">${mbtn(cont ? 'Высадиться на остров' : 'Начать', () => {
        const nm = (sel.name || '').trim() || 'Выживший';
        if (pts() < 0) return toast('Не хватает очков: убери плюс или добавь минус.');
        if (cont) { continueWorld(nm, sel.traits.slice(), sel.prof); }
        else { newGame(sel.mode, nm, sel.traits.slice(), sel.prof); intro(); }
        setTimeout(checkPerks, 300);
        sel.traits = []; closeFull(); st.tab = 'loc';
      }, 'pri')}</div>`;
      return h;
    });
    draw();
  }
  const jsel = { code: '', name: '', traits: [], err: '', busy: false, prof: 'unemployed' };
  function joinScreen() {
    const pts = () => cpts(jsel);
    const draw = () => showFull(() => `<div class="title"><small>КООПЕРАТИВ</small>Присоединиться к другу</div>
      ${FBM() ? `<p class="muted">Ты войдёшь в мир друга своим персонажем: база, склад, сюжет и время — общие, рюкзак — твой.</p>${localHas() && !(G && G.coop) ? '<p class="muted">Твоя одиночная игра не пропадёт: выйти из общего мира и вернуться к ней можно в Журнале → Кооператив.</p>' : ''}` : `<p class="muted">Друг создаёт общий мир в своей игре (Журнал → Кооператив) и присылает код. Чтобы ты мог играть, он должен пригласить тебя к этой странице через «Поделиться» с правом редактора. Ты войдёшь в его мир своим персонажем: база, склад и сюжет общие.</p>`}
      <h2>Код мира</h2><input type="text" id="jcode" maxlength="8" placeholder="Например, K7QX2M" value="${esc(jsel.code)}" oninput="UI._j('code', this.value)" style="text-transform:uppercase;font-family:var(--f-mono);letter-spacing:.15em">
      <h2>Имя персонажа</h2><input type="text" id="jname" maxlength="24" placeholder="Как тебя звать?" value="${esc(jsel.name)}" oninput="UI._j('name', this.value)">
      ${charBuilder(jsel, draw)}
      ${jsel.err ? `<p class="bad">${esc(jsel.err)}</p>` : ''}
      <div class="acts">${mbtn(jsel.busy ? 'Подключаюсь…' : 'Войти в мир', async () => {
        if (jsel.busy) return; if (pts() < 0) return toast('Не хватает очков.');
        jsel.busy = true; jsel.err = ''; draw();
        const err = await COOP.join(jsel.code, (jsel.name || '').trim() || 'Выживший', jsel.traits.slice(), jsel.prof);
        jsel.busy = false;
        if (err) { jsel.err = err; draw(); return; }
        closeFull(); st.tab = 'loc';
        if (G.w.struct.fire || day() > 2) { G.tut.on = false; save(); }
        event({ title: '🤝 Ты в мире друга', text: `Ты высадился у Лодочной станции — это ваша общая база.\n\n🏚️ Общее: база, склад, постройки, задания, время и погода.\n🎒 Твоё: персонаж, рюкзак и деньги.\n\n👥 Вверху — панель отряда. Нажми на друга: увидишь, где он и чем занят, сможешь пойти к нему или передать вещь.\n📣 Журнал → Кооператив: сигналы вроде «Нужна помощь!», чат и лента событий отряда.\n⚔️ Если вы в одной локации — деретесь вместе.`, choices: [{ t: 'Понятно' }] });
        setTimeout(() => { try { const f = COOP.others().filter(p => p.online && p.alive !== false)[0]; if (!f || !G || f.loc === G.loc || !LOCS[f.loc]) return;
          event({ title: `👋 ${f.name || 'Друг'} сейчас здесь: ${LOCS[f.loc].ic} ${LOCS[f.loc].n}`, text: `${f.act ? 'Занят: ' + f.act + '.\n\n' : ''}Можно сразу отправиться к нему — маршрут построится сам. Или сначала осмотрись на базе и загляни в общий склад.`, choices: [{ t: '🧭 Идти к другу', fn: () => goTo(f.loc) }, { t: 'Сначала осмотрюсь' }] }); } catch (e) {} }, 1800);
      }, 'pri', jsel.busy)}${mbtn('Назад', () => startScreen())}</div>`);
    draw();
  }
  function localHas() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); return !!(s && s.v === 3); } catch (e) { return false; } }
  function intro() {
    event({ title: '🙂 Я смотрю, ты уже очнулся?', text: `«Я тебя притащил сюда, в безопасное место. Я Семёныч, живу в деревне на юге. Тебя выбросило на берег после шторма.\n\nОстров на карантине. Мёртвые ходят. Небо иногда краснеет — тогда прячься под крышу. А раз в неделю, в полнолуние, они идут толпой. Укрепи этот сарай.\n\nНачни с простого: разведи огонь, сделай нормальную лежанку. Дрова — в лесу. Заходи ко мне в деревню, если что.»\n\nПодсказки:\n• 📍 Место — обыскивай комнаты, 🗺️ Карта — путешествуй.\n• 🐾 Крадучись — медленнее, но враги реже замечают.\n• Время идёт от каждого действия. Следи за едой, водой и сном.\n• Воду набирай в бутылки. Морскую надо опреснить, из ручья и колодца — вскипятить.`, choices: [{ t: 'Встать и осмотреться' }] });
  }
  function deathScreen(d) {
    showFull(() => `<div class="title"><small>КОНЕЦ ИСТОРИИ</small>☠️ ${esc(d.name || '')}</div>
      <p>Причина смерти: <b>${esc(d.cause || '—')}</b>.</p><p class="mono">Прожил дней: ${d.days || 0} · убито врагов: ${d.kills || 0}</p>
      ${G && G.w.deaths.length > 1 ? `<div class="sec"><h2>Те, кто был до</h2><div class="list">${G.w.deaths.slice(0, -1).map(x => `<div class="row"><div class="grow"><span class="t">${esc(x.name)}</span><span class="s">${x.days} дн. · ${esc(x.cause)}</span></div></div>`).join('')}</div></div>` : ''}
      <p class="muted">Вещи остались на теле. Мир, база и склад — на месте.</p>
      <div class="acts">${mbtn('Новый выживший в этом мире', () => startScreen(true), 'pri')}${mbtn('Начать мир заново', () => { wipe(); G = null; startScreen(); })}</div>`);
  }
  function ending(choice, d) {
    const txt = choice === 'off'
      ? 'Ты вырываешь ядро и бьёшь его о бетон. Синий свет гаснет. Впервые за месяцы над островом обычное серое небо.\n\nЧерез три дня у пристани появляется катер с красным крестом. Семёныч машет с берега — он остаётся. «Это мой дом».\n\nКонцовка: «Тишина».'
      : 'Ты вынимаешь ядро. Оно тёплое и бьётся, как сердце. Аппарат умирает, но остров вздрагивает — и где-то в глубине просыпается что-то большее.\n\nВыбросы станут сильнее. Аномалии — богаче. Ты держишь в руках ключ от Мастер-режима.\n\nКонцовка: «Мастер». Продолжение — во второй главе.';
    showFull(() => `<div class="title"><small>ФИНАЛ ДЕМО</small>${choice === 'off' ? 'Тишина' : 'Мастер'}</div><p style="white-space:pre-wrap">${esc(txt)}</p><p class="mono">${esc(d.name)} · дней на острове: ${d.days} · врагов: ${d.kills} · записок: ${G.w.notes.length}/${Object.keys(NOTES).length}</p>
      <div class="acts">${choice === 'take' ? mbtn('🔮 Глава 2 «Мастер»', () => { closeFull(); startCh2(); }, 'pri') : ''}${mbtn('Продолжить исследовать остров', closeFull, choice === 'take' ? '' : 'pri')}${mbtn('Новая игра', () => { wipe(); G = null; startScreen(); })}</div>`);
  }
  function ending2Screen(choice, d) {
    const txt = choice === 'seal'
      ? 'Ты вынимаешь ядро из двигателя и вкладываешь его в Сердце. Кристаллы вокруг гаснут один за другим, как свечи. Шпиль замолкает.\n\nНа обратном пути лодка идёт на одних вёслах. Над островом впервые за месяцы — обычное небо. Выбросов больше не будет. Кристаллиды рассыпаются в пыль.\n\nСемёныч встречает тебя на пристани: «Ну что, отвоевался? Пошли, уха стынет».'
      : 'Ты кладёшь ладонь на Сердце — и оно отрывается от кокона само, будто ждало тебя. Тяжёлое, холодное, живое.\n\nОстров вздыхает. Аномалии тянутся к тебе, кристаллиды расступаются. Выбросы не прекратятся — но теперь это твоя буря.\n\nСердце острова у тебя в рюкзаке. Мастер вернулся.';
    showFull(() => `<div class="title"><small>ФИНАЛ ГЛАВЫ 2</small>${choice === 'seal' ? 'Сон' : 'Мастер острова'}</div><p style="white-space:pre-wrap">${esc(txt)}</p><p class="mono">${esc(d.name)} · дней на острове: ${d.days} · врагов: ${d.kills} · записок: ${G.w.notes.length}/${Object.keys(NOTES).length}</p>
      <p class="muted">Спасибо, что прошёл историю «Mystery of the Island». Мир остаётся с тобой — можно играть дальше, строить базу и звать друзей.</p>
      <div class="acts">${mbtn('Продолжить', closeFull, 'pri')}${mbtn('Новая игра', () => { wipe(); G = null; startScreen(); })}</div>`);
  }

  // ---------------- старт ----------------
  function boot() {
    const inv = window.TGA && String(TGA.startParam || '').toUpperCase();
    if (inv && /^[A-Z0-9]{4,8}$/.test(inv) && FBM()) {
      const had = load();
      if (!(had && G.coop && G.coop.code === inv)) { jsel.code = inv; jsel.name = had && !G.dead ? G.ch.name : String((TGA.user && TGA.user.first_name) || '').slice(0, 24); return joinScreen(); }
    }
    if (load()) { if (G.dead) deathScreen(G.w.deaths[G.w.deaths.length - 1] || {}); else { render(); if (G.coop) COOP.init(); setTimeout(dailyBonus, 400); setTimeout(checkPerks, 900); } }
    else startScreen();
  }
  return { run, mrun, log, toast, render, go, event, combat, closeCombat, horde, lockMenu, deathScreen, ending, ending2: ending2Screen, boot, startScreen,
    _name: v => { sel.name = v; }, _st: st, _j: (k, v) => { jsel[k] = v; }, _chat: sendChat };
})();
(window.TGA ? TGA.before() : Promise.resolve()).then(() => UI.boot(), () => UI.boot());
