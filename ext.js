'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — расширения: питомцы, машина
//  (подключается после game.js; кнопки рисует через UI.btn / UI.mbtn)
// =====================================================================

// ---------- общие модификаторы от систем (питомец, сезон …) ----------
function extraMod(k) {
  let v = 0;
  const p = G && G.pet;
  if (p && p.hp > 0) {
    if (p.type === 'dog') { if (k === 'carry') v += 6; if (k === 'ambush') v -= 0.3; if (k === 'noise') v += 0.1; }
    if (p.type === 'cat') { if (k === 'stress') v -= 0.3; if (k === 'loot') v += 0.05; }
  }
  if (typeof seasonMod === 'function') v += seasonMod(k);
  return v;
}

// =====================================================================
//  ПИТОМЦЫ
// =====================================================================
const PET_FOOD = ['meat', 'cmeat', 'fish', 'cfish', 'smoked', 'canned', 'ration'];
const DOG_NAMES = ['Шарик', 'Бобик', 'Рекс', 'Джек', 'Граф', 'Тузик', 'Буран', 'Лорд', 'Найда', 'Дымка'];
function petFood() { return PET_FOOD.find(id => cnt(G.inv, id)) || (atBase() && PET_FOOD.find(id => cnt(G.stash, id))); }
function tameDog(i) {
  const cb = G.combat, e = cb.en[i];
  if (!e || e.id !== 'dog' || e.hp <= 0) return;
  const food = PET_FOOD.find(id => cnt(G.inv, id) && ['meat', 'cmeat', 'fish', 'cfish', 'smoked'].includes(id));
  if (!food) { cLog('Нечем приманить — нужно мясо или рыба.', 'dim'); return UI.combat(); }
  take(G.inv, food, 1);
  const p = 0.3 + skill('surv') * 0.05 + (e.hp < e.max * 0.5 ? 0.15 : 0) - (G.pet ? 1 : 0);
  if (G.pet) { cLog('У тебя уже есть питомец — второй не пойдёт за тобой.', 'dim'); return endPlayerTurn(); }
  if (ch(p)) {
    e.hp = 0; e.dead = true; e.tamed = true;
    G.pet = { type: 'dog', name: pick(DOG_NAMES), hp: 40, max: 40, loyal: 60, fedAt: G.time, kills: 0 };
    cLog(`🐕 Пёс схватил ${IT(food).n.toLowerCase()} и… завилял хвостом. Теперь его зовут ${G.pet.name}!`, 'good');
    SND('bark'); xp('surv', 6); FEED(`🐕 приручил пса по кличке ${G.pet.name}`);
    if (cb.en.every(x => x.hp <= 0)) return endCombat('win');
    return endPlayerTurn();
  }
  cLog(`🍖 Пёс схватил ${IT(food).n.toLowerCase()}, но всё ещё скалится.`, 'dim');
  endPlayerTurn();
}
// пёс в бою: кусает каждый ход; враги иногда бьют его
function petTurn(cb) {
  const p = G.pet; if (!p || p.type !== 'dog' || p.hp <= 0 || cb.opts.raidDef === false) return false;
  const tg = cb.en.filter(e => e.hp > 0 && e.dist <= 1); if (!tg.length) return false;
  const e = pick(tg), D = ENEMY[e.id];
  if (ch(0.7)) { const d = Math.max(1, Math.round(R(4, 8) * (1 + p.loyal / 200) - (D.arm || 0) * 0.5)); e.hp -= d; cb.log.push({ t: `🐕 ${p.name} вцепился в ${D.ic} ${D.n}: −${d}`, c: 'good' }); if (e.hp <= 0) p.kills++; if (ch(0.25)) e.stun = Math.max(e.stun, 1); }
  else cb.log.push({ t: `🐕 ${p.name} рычит и кружит вокруг ${D.n}.`, c: 'dim' });
  return true;
}
function petHit(e, dmg) { // вызывается из enemyHit: true — удар пришёлся по псу
  const p = G.pet; if (!p || p.type !== 'dog' || p.hp <= 0 || !ch(0.18)) return false;
  const D = ENEMY[e.id]; p.hp -= dmg; cLog(`💢 ${D.ic} ${D.n} бьёт пса ${p.name}: −${dmg}`, 'bad');
  if (p.hp <= 0) { cLog(`💔 ${p.name} погиб, защищая тебя.`, 'bad'); G.ch.stress = clamp(G.ch.stress + 25, 0, 100); FEED(`💔 потерял пса ${p.name}`); G.pet = null; }
  return true;
}
function feedPet(id) {
  const p = G.pet; if (!p) return;
  id = id || petFood(); if (!id) return UI.toast('Нет подходящей еды: мясо, рыба, тушёнка.');
  allTake(id, 1); p.fedAt = G.time; p.loyal = Math.min(100, p.loyal + 15); p.hp = Math.min(p.max, p.hp + 8);
  UI.log(`${p.type === 'dog' ? '🐕' : '🐈'} ${p.name} съел ${IT(id).n.toLowerCase()}. Доволен.`, 'good'); UI.render();
}
function releasePet() { if (!G.pet) return; UI.log(`${G.pet.type === 'dog' ? '🐕' : '🐈'} ${G.pet.name} ушёл своей дорогой.`); G.pet = null; UI.render(); }
function takeCat() {
  if (G.pet) return UI.toast('У тебя уже есть питомец.');
  if ((G.w.catLove || 0) < 4) return UI.toast('Кот тебе пока не доверяет. Гладь его почаще.');
  G.pet = { type: 'cat', name: 'Кот', hp: 20, max: 20, loyal: 70, fedAt: G.time, kills: 0 }; G.w.catAway = true;
  UI.log('🐈 Кот запрыгнул тебе на рюкзак. Похоже, он идёт с тобой.', 'good'); FEED('🐈 взял кота с базы в поход'); UI.render();
}
function catHome() { if (!G.pet || G.pet.type !== 'cat') return; if (!atBase()) return UI.toast('Кота можно отпустить только на базе.'); G.pet = null; G.w.catAway = false; UI.log('🐈 Кот спрыгнул и пошёл досыпать на своё место.'); UI.render(); }
function petDaily() {
  const p = G.pet; if (!p) return;
  p.hp = Math.min(p.max, p.hp + 10);
  if (G.time - p.fedAt > 30 * H) {
    const id = petFood();
    if (id) { allTake(id, 1); p.fedAt = G.time; UI.log(`${p.type === 'dog' ? '🐕' : '🐈'} ${p.name} поел (${IT(id).n.toLowerCase()} из запасов).`, 'dim'); }
    else { p.loyal -= 25; UI.log(`${p.type === 'dog' ? '🐕' : '🐈'} ${p.name} голоден и смотрит с укором. Покорми его!`, 'warn'); }
  }
  if (p.loyal <= 0) { UI.event({ title: `${p.type === 'dog' ? '🐕' : '🐈'} ${p.name} ушёл`, cls: 'bad', text: 'Голодный зверь не стал ждать и ушёл искать еду сам.', choices: [{ t: 'Эх…' }] }); if (p.type === 'cat') G.w.catAway = false; G.pet = null; }
}

// =====================================================================
//  МАШИНА
// =====================================================================
const CAR_STAGES = [
  { n: 'Колёса и ходовая', c: { carpart: 3, scrap: 4 } },
  { n: 'Аккумулятор и проводка', c: { battery: 2, wire: 2, elec: 1 } },
];
const CAR_TANK = 12;
function car() { if (!G.w.car) G.w.car = { loc: 'gas', stage: 0, fuel: 0, hp: 100 }; return G.w.car; }
const carReady = () => car().stage >= CAR_STAGES.length;
function carCost(st) { const c = Object.assign({}, CAR_STAGES[st].c); if (mod('car') > 0 && c.carpart) c.carpart = Math.max(1, c.carpart - 1); return c; }
function carRepair() {
  const c = car(); if (carReady() || c.loc !== G.loc || G.traveling) return;
  if (!cnt(G.inv, 'tools') && !(atBase() && cnt(G.stash, 'tools'))) return UI.toast('Нужен набор инструментов.');
  const need = carCost(c.stage); if (!hasAll(need)) return UI.toast('Не хватает деталей.');
  for (const [k, v] of Object.entries(need)) allTake(k, v);
  advance(90); if (G.dead) return;
  noise(20); xp('craft', 8); SND('build');
  UI.log(`🔧 Машина: ${CAR_STAGES[c.stage].n} — готово.`, 'good');
  c.stage++;
  if (carReady()) { FEED('🚗 починил машину'); UI.event({ title: '🚗 Машина на ходу!', cls: 'good', text: `Мотор чихнул и завёлся. Осталось залить бензин (канистры ищи в багажниках и на заправке).\n\nМашина ездит только по дорогам: база, деревня, заправка, ферма, лес, блокпост, маяк, метеостанция. Втрое быстрее пешком, но шумно.`, choices: [{ t: 'Поехали!' }] }); }
  UI.render();
}
function carRefuel() {
  const c = car(); if (!cnt(G.inv, 'fuel')) return UI.toast('Нужна канистра бензина.');
  if (c.fuel >= CAR_TANK) return UI.toast('Бак полон.');
  take(G.inv, 'fuel', 1); c.fuel = Math.min(CAR_TANK, c.fuel + 4); advance(5); UI.log(`⛽ Залил канистру. В баке ${c.fuel}/${CAR_TANK}.`, 'good'); UI.render();
}
const roadOk = (a, b) => LOCS[a] && LOCS[b] && LOCS[a].road && LOCS[b].road;
function driveCost(to) { const m = LOCS[G.loc].links[to] || 999; return Math.max(1, Math.ceil(m / 35)); }
function canDrive(to) {
  const c = G.w.car; if (!c || !carReady() || c.loc !== G.loc || G.traveling) return 'no';
  if (!roadOk(G.loc, to) || LOCS[G.loc].links[to] == null) return 'Туда нет дороги.';
  if (c.fuel < driveCost(to)) return `Мало бензина (нужно ${driveCost(to)}).`;
  const e = canTravel(to); return e || '';
}
function drive(to) {
  const err = canDrive(to); if (err) return UI.toast(err === 'no' ? 'Машины здесь нет.' : err);
  const c = car(); c.fuel -= driveCost(to);
  travel(to, { car: true });
  if (!G.dead && G.loc === to) { c.loc = to; noise(30); }
}

// =====================================================================
//  ИНТЕРФЕЙС (вызывается из ui.js)
// =====================================================================
const EXTUI = {
  // строки на экране локации
  locRows() {
    const b = UI.btn; let h = '';
    const c = G.w.car;
    if (c && c.loc === G.loc && !G.traveling) {
      if (!carReady()) {
        const st = CAR_STAGES[c.stage], need = carCost(c.stage);
        const parts = Object.entries(need).map(([k, v]) => `<span class="${allCnt(k) >= v ? '' : 'bad'}">${IT(k).ic}${IT(k).n} ${allCnt(k)}/${v}</span>`).join(', ');
        h += `<div class="row"><span class="ic">🚗</span><div class="grow"><span class="t">Брошенная машина · ремонт ${c.stage}/${CAR_STAGES.length}</span><span class="s">→ ${st.n}: ${parts} · нужен 🧰 набор инструментов</span></div>${b('🔧 Чинить (1,5 ч)', carRepair, 'sm', !hasAll(need))}</div>`;
      } else h += `<div class="row"><span class="ic">🚗</span><div class="grow"><span class="t">Твоя машина</span><span class="s">⛽ ${c.fuel}/${CAR_TANK} · ездит по дорогам (карта → выбери место)</span></div>${b('⛽ Залить канистру', carRefuel, 'sm', !cnt(G.inv, 'fuel') || c.fuel >= CAR_TANK)}</div>`;
    }
    const p = G.pet;
    if (p) h += `<div class="row"><span class="ic">${p.type === 'dog' ? '🐕' : '🐈'}</span><div class="grow"><span class="t">${xesc(p.name)} рядом</span><span class="s">❤️ ${Math.round(p.hp)}/${p.max} · 💛 верность ${Math.round(p.loyal)}${G.time - p.fedAt > 24 * H ? ' · голоден' : ''}</span></div>${b('🍖 Покормить', () => feedPet(), 'sm', !petFood())}</div>`;
    return h;
  },
  // кнопка поездки на карте
  mapDrive(sel) {
    const e = canDrive(sel); if (e === 'no') return '';
    const mins = Math.max(10, Math.round(travelTime(sel) * 0.35));
    return UI.btn(`🚗 Ехать — ${mins} мин (⛽−${driveCost(sel)})`, () => { st_sel_clear(); drive(sel); }, '', !!e) + (e ? `<p class="muted">${xesc(e)}</p>` : '');
  },
  // доп. действия в бою против конкретного врага
  combatActs(i, e) {
    if (e.id === 'dog' && !G.pet && PET_FOOD.slice(0, 5).some(id => cnt(G.inv, id))) return UI.mbtn('🍖 Приманить', () => tameDog(i), 'sm');
    return '';
  },
  // панель на экране персонажа
  charPanel() {
    const p = G.pet, b = UI.btn;
    if (!p) return `<div class="sec"><h2>🐾 Компаньон</h2><p class="muted">Одичавшего пса можно приманить в бою мясом или рыбой — шанс выше, если он ранен. Кот с базы пойдёт с тобой, если часто его гладить.</p></div>`;
    return `<div class="sec"><h2>${p.type === 'dog' ? '🐕' : '🐈'} ${xesc(p.name)}</h2><div class="list"><div class="row"><div class="grow"><span class="t">Здоровье ${Math.round(p.hp)}/${p.max}</span>${uiBar(p.hp, p.max)}<span class="t">Верность ${Math.round(p.loyal)}/100</span>${uiBar(p.loyal, 100)}<span class="s">${p.type === 'dog' ? 'Кусает врагов рядом, несёт +6 кг, чует засады (−30%). Ест раз в сутки.' : 'Снимает стресс (−30%), иногда находит мелочь. Ест раз в сутки.'}${p.kills ? ` · загрыз врагов: ${p.kills}` : ''}</span></div></div></div>
      <div class="acts">${b('🍖 Покормить', () => feedPet(), '', !petFood())}${p.type === 'cat' ? b('🏚️ Оставить на базе', catHome, '', !atBase()) : b('Отпустить', releasePet)}</div></div>`;
  },
};
const xesc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const uiBar = (v, m) => `<div class="bar ${v / m < 0.3 ? 'low' : v / m < 0.6 ? 'mid' : ''}"><i style="width:${Math.max(0, Math.min(100, v / m * 100))}%"></i></div>`;
function st_sel_clear() { if (UI._st) UI._st.sel = null; }

// ---------- обёртки над функциями движка ----------
(() => {
  const _newDay = newDay;
  newDay = function () { _newDay.apply(this, arguments); try { petDaily(); if (typeof extNewDay === 'function') extNewDay(); } catch (e) { console.warn(e); } };
  const _migrate = migrate;
  migrate = function () { _migrate.apply(this, arguments); car(); if (typeof extMigrate === 'function') extMigrate(); };
})();

// =====================================================================
//  ВЫЖИВШИЕ НА БАЗЕ
// =====================================================================
const NPC_ROLES = {
  fisher:  { n: 'Рыбак', ic: '🎣', d: 'каждый день приносит рыбу' },
  guard:   { n: 'Охранник', ic: '🛡️', d: '+12 к обороне базы' },
  crafter: { n: 'Мастер', ic: '🔨', d: 'пилит доски из дров и латает стены' },
  medic:   { n: 'Медик', ic: '⛑️', d: 'раны заживают быстрее, пока ты спишь на базе; кипятит повязки' },
  forager: { n: 'Собиратель', ic: '🧺', d: 'приносит ягоды, грибы, травы и дрова' },
  hunter:  { n: 'Охотник', ic: '🏹', d: 'иногда приносит мясо' },
};
const NPC_NAMES = ['Лёха', 'Марина', 'Дед Иван', 'Света', 'Костя', 'Нина', 'Юра', 'Оксана', 'Гоша', 'Таня', 'Вадим', 'Люба', 'Петрович', 'Аня', 'Слава', 'Зоя'];
const bunkCap = () => [0, 2, 4][G.w.struct.bunks || 0] || 0;
const npcs = () => (G.w.npcs = G.w.npcs || []);
function newNpc(role) { return { id: 'n' + G.time + R(0, 999), name: pick(NPC_NAMES.filter(n => !npcs().some(x => x.name === n))) || 'Выживший', role: role || pick(Object.keys(NPC_ROLES)), morale: 70, days: 0 }; }
function inviteNpc(n, src) {
  if (npcs().length >= bunkCap()) { UI.toast(bunkCap() ? 'На базе нет свободных нар.' : 'Сначала построй нары на базе (Постройки).'); return false; }
  npcs().push(n); FEED(`🏘️ позвал на базу: ${n.name} (${NPC_ROLES[n.role].n})`);
  UI.log(`🏘️ ${n.name} (${NPC_ROLES[n.role].ic} ${NPC_ROLES[n.role].n}) идёт на твою базу${src ? ' — ' + src : ''}.`, 'good'); return true;
}
function dismissNpc(id) { const i = npcs().findIndex(x => x.id === id); if (i < 0) return; UI.log(`👋 ${npcs()[i].name} собрал вещи и ушёл.`); npcs().splice(i, 1); UI.render(); }
const NPC_FOOD = n => G.stash.find(e => IT(e.id).c === 'food' && (IT(e.id).f || 0) >= 8 && !IT(e.id).smoke && freshness(e) < 1);
const NPC_DRINK = () => G.stash.find(e => IT(e.id).c === 'drink' && (IT(e.id).d || 0) > 10 && !IT(e.id).salt);
function npcDaily() {
  const list = npcs(); if (!list.length) return;
  const out = [];
  for (const n of list.slice()) {
    n.days++;
    const f = NPC_FOOD(), d = NPC_DRINK();
    if (f) take(G.stash, f.id, 1); if (d) { take(G.stash, d.id, 1); if (IT(d.id).btl) invAdd(G.stash, 'bottle', 1); }
    if (f && d) n.morale = Math.min(100, n.morale + 5); else { n.morale -= f || d ? 15 : 30; out.push(`😟 ${n.name} голодает`); }
    if (n.morale <= 0) { list.splice(list.indexOf(n), 1); out.push(`🚪 ${n.name} ушёл с базы — не было еды`); continue; }
    const r = n.role, win = season() === 1;
    if (r === 'fisher') { const k = win ? 1 : R(1, 3); invAdd(G.stash, 'fish', k); out.push(`🎣 ${n.name}: рыба ×${k}`); }
    if (r === 'forager') { const got = []; for (let k = win ? 1 : R(2, 3); k > 0; k--) { const id = wpick(win ? [['wood', 3], ['stick', 1]] : [['berries', 3], ['mushroom', 3], ['herbs', 2], ['wood', 3]]); invAdd(G.stash, id, 1); got.push(IT(id).ic); } out.push(`🧺 ${n.name}: ${got.join('')}`); }
    if (r === 'hunter' && ch(0.45)) { invAdd(G.stash, 'meat', 2); out.push(`🏹 ${n.name}: мясо ×2`); }
    if (r === 'crafter') { if (cnt(G.stash, 'wood') >= 2) { take(G.stash, 'wood', 2); invAdd(G.stash, 'planks', 1); out.push(`🔨 ${n.name}: доска`); } if (G.w.struct.walls && G.w.wallHp < 100) G.w.wallHp = Math.min(100, G.w.wallHp + 10); }
    if (r === 'medic' && cnt(G.stash, 'dband')) { take(G.stash, 'dband', 1); invAdd(G.stash, 'bandage', 1); out.push(`⛑️ ${n.name}: стерильный бинт`); }
  }
  if (out.length) UI.log('🏘️ База: ' + out.join(' · '), 'sys');
}
const npcDef = () => npcs().reduce((a, n) => a + (n.role === 'guard' ? 12 : 3), 0);
// приглашения: в событиях «Незнакомец» и «Раненый» и отдельный выживший на карте
function npcOffer(role, src) {
  const n = newNpc(role);
  return { t: `🏘️ Позвать на базу (${NPC_ROLES[n.role].ic} ${NPC_ROLES[n.role].n})`, fn: () => inviteNpc(n, src) };
}

// =====================================================================
//  СЕЗОНЫ: по 10 дней — осень → зима → весна → лето
// =====================================================================
const SEASONS = [
  { n: 'Осень', ic: '🍂', d: 'Грибная пора: в лесу больше находок, охота удачнее.' },
  { n: 'Зима', ic: '❄️', d: 'Снег и мороз: больше ешь, дороги медленнее, в лесу пусто, огород не растёт. Море у берега замерзает.' },
  { n: 'Весна', ic: '🌱', d: 'Дожди и ручьи: огород растёт быстрее.' },
  { n: 'Лето', ic: '☀️', d: 'Много еды в лесу и на огороде, но сильнее хочется пить.' },
];
const SEASON_LEN = 10;
const season = () => Math.floor((day() - 1) / SEASON_LEN) % 4;
const seasonDay = () => (day() - 1) % SEASON_LEN + 1;
function seasonMod(k) {
  if (!G || !G.time) return 0;
  const s = season();
  if (s === 0) return { forage: 1, hunt: 0.1 }[k] || 0;
  if (s === 1) return { hunger: 0.2, travel: 0.15, forage: -1, fish: -1, cold: 0.5, garden: -1 }[k] || 0;
  if (s === 2) return { garden: 0.25 }[k] || 0;
  if (s === 3) return { thirst: 0.3, forage: 1, garden: 0.5 }[k] || 0;
  return 0;
}
function seasonWeather() {
  const s = season();
  return WEATHER.map(x => {
    let w = x.w;
    if (x.id === 'snow') w = s === 1 ? 4 : 0;
    if (s === 1 && (x.id === 'rain' || x.id === 'storm')) w = 0;
    if (s === 2 && x.id === 'rain') w += 2;
    if (s === 3 && x.id === 'clear') w += 3;
    if (s === 0 && x.id === 'fog') w += 1;
    return [x.id, w];
  }).filter(([, w]) => w > 0);
}
const iceRoute = () => season() === 1 && seasonDay() >= 3;
function seasonNewDay() {
  if (seasonDay() !== 1 || day() === 1) return;
  const S = SEASONS[season()];
  UI.event({ title: `${S.ic} Наступила ${S.n.toLowerCase()}`, text: S.d + (season() === 1 && CH2() ? '\n\nЧерез пару дней пролив замёрзнет — до Острова-8 можно будет дойти пешком по льду.' : ''), choices: [{ t: 'Ясно' }] });
}

// ---------- ежедневные хуки и миграция ----------
function extNewDay() { npcDaily(); seasonNewDay(); if (typeof raidDaily === 'function') raidDaily(); if (typeof achCheck === 'function') achCheck(); }
function extMigrate() { npcs(); if (G.w.struct.bunks == null) G.w.struct.bunks = 0; }

// ---------- интерфейс: база (жильцы) ----------
EXTUI.basePanel = function () {
  const b = UI.btn, list = npcs(), cap = bunkCap();
  let h = `<div class="sec"><div class="sechead"><h2>🏘️ Жильцы ${list.length}/${cap}</h2></div>`;
  if (!cap) h += '<p class="muted">Построй нары (Постройки), чтобы приютить выживших. Их можно встретить в пути — незнакомцы и раненые иногда готовы пойти к тебе.</p>';
  else if (!list.length) h += '<p class="muted">Пока никого. Позови незнакомца в пути или помоги раненому — и у тебя появятся помощники. Жильцы едят и пьют из общего склада раз в день.</p>';
  h += `<div class="list">${list.map(n => { const R0 = NPC_ROLES[n.role]; return `<div class="row"><span class="ic">${R0.ic}</span><div class="grow"><span class="t">${xesc(n.name)} · ${R0.n}</span><span class="s">${R0.d}</span>${uiBar(n.morale, 100)}<span class="s">настроение ${Math.round(n.morale)} · живёт ${n.days} дн.</span></div>${b('Выгнать', () => dismissNpc(n.id), 'sm')}</div>`; }).join('')}</div></div>`;
  return h;
};
