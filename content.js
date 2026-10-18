'use strict';
// =====================================================================
//  MYSTERY OF THE ISLAND — контент-обновление:
//  контракты, генератор и электричество, кулинария с бонусами, модули оружия,
//  новые места и враги, главари группировок, событие недели, Глава 3
//  (подключается после ext.js и до coop.js — новые локации должны попасть в синхронизацию)
// =====================================================================

// ---------------- ПРЕДМЕТЫ ----------------
Object.assign(ITEMS, {
  // кулинария (buff — временный бонус)
  ukha:     { n: 'Уха', ic: '🍲', c: 'food', w: 0.5, v: 40, f: 45, d: 15, sp: 48, buff: 'warm' },
  stew:     { n: 'Рагу с мясом', ic: '🥘', c: 'food', w: 0.6, v: 50, f: 55, d: 5, sp: 48, buff: 'strong' },
  pie:      { n: 'Ягодный пирог', ic: '🥧', c: 'food', w: 0.4, v: 35, f: 30, stress: -25, sp: 72, buff: 'calm' },
  tea:      { n: 'Травяной чай', ic: '🍵', c: 'drink', w: 0.4, v: 20, d: 35, btl: 1, buff: 'healthy' },
  jerky:    { n: 'Вяленое мясо', ic: '🥓', c: 'food', w: 0.3, v: 35, f: 28 },
  coffee:   { n: 'Кофе из армейского пайка', ic: '☕', c: 'drink', w: 0.2, v: 30, d: 15, buff: 'alert' },
  // модули оружия
  scope:    { n: 'Прицел', ic: '🔭', c: 'mod', w: 0.3, v: 150, mod: { gun: 1, m: { gunAcc: 0.08 } }, info: 'Огнестрел: точность +8%' },
  silencer: { n: 'Глушитель', ic: '🔇', c: 'mod', w: 0.4, v: 180, mod: { gun: 1, m: { gunNoise: -0.5 } }, info: 'Огнестрел: шум выстрела −50%' },
  bottlesil:{ n: 'Глушитель из бутылки', ic: '🍾', c: 'mod', w: 0.2, v: 20, mod: { gun: 1, m: { gunNoise: -0.25 } }, info: 'Огнестрел: шум −25%. Самоделка.' },
  stock:    { n: 'Приклад', ic: '🪵', c: 'mod', w: 0.6, v: 90, mod: { gun: 1, m: { gunAcc: 0.04, ammoSave: 0.1 } }, info: 'Огнестрел: точность +4%, отдача меньше' },
  extmag:   { n: 'Расширенный магазин', ic: '📦', c: 'mod', w: 0.3, v: 120, mod: { gun: 1, m: { ammoSave: 0.15 } }, info: 'Огнестрел: 15% патрон не тратится' },
  spikes:   { n: 'Шипы и гвозди', ic: '📍', c: 'mod', w: 0.3, v: 15, mod: { melee: 1, m: { meleeDmg: 0.15 } }, info: 'Ближний бой: урон +15%' },
  grip:     { n: 'Обмотка рукояти', ic: '🧵', c: 'mod', w: 0.1, v: 10, mod: { melee: 1, m: { meleeAcc: 0.04, dur: -0.3 } }, info: 'Ближний бой: точнее, оружие служит дольше' },
  // новое снаряжение и ресурсы
  scuba:    { n: 'Акваланг', ic: '🤿', c: 'key', w: 6, v: 400, info: 'Нужен, чтобы нырнуть в затопленный отсек сухогруза.' },
  k_prison: { n: 'Ключ от оружейки тюрьмы', ic: '🔑', c: 'key', w: 0, v: 40 },
  code1:    { n: 'Шифровка «Пионер»', ic: '📄', c: 'quest', w: 0, v: 0 },
  code2:    { n: 'Шифровка «Штольня»', ic: '📄', c: 'quest', w: 0, v: 0 },
  code3:    { n: 'Шифровка «Северная»', ic: '📄', c: 'quest', w: 0, v: 0 },
  wolfcloak:{ n: 'Плащ Вожака', ic: '🐺', c: 'wear', w: 2, v: 500, slot: 'body', warm: 4, arm: 3 },
  vest2:    { n: 'Тяжёлый бронежилет', ic: '🦺', c: 'wear', w: 9, v: 800, slot: 'vest', arm: 7 },
  staff:    { n: 'Посох Пророка', ic: '🔱', c: 'melee', w: 1.6, v: 900, dmg: [18, 25], dur: 200, noise: 3, reach: 1 },
  marked:   { n: 'Карта Меченого', ic: '🗺️', c: 'val', w: 0.05, v: 600, info: 'Тайники сталкеров по всему острову. Дорого продаётся.' },
  parcel:   { n: 'Посылка', ic: '📦', c: 'quest', w: 1, v: 0 },
  bp_mods:  { n: 'Чертёж: модули оружия', ic: '📐', c: 'bp', w: 0.05, v: 120, bp: 'mods' },
});
// лут: модули и акваланг в контейнерах
const addLoot = (ct, list) => { if (CONT[ct]) CONT[ct].loot.push(...list); };
addLoot('milcrate', [['scope', 1], ['stock', 1], ['extmag', 1], ['coffee', 2]]);
addLoot('armory', [['silencer', 1], ['scope', 1], ['extmag', 1]]);
addLoot('toolbox', [['grip', 1], ['bp_mods', 1]]);
addLoot('stash', [['scuba', 1], ['scope', 1]]);
addLoot('locker', [['coffee', 1]]);
CONT.minecart = { n: 'Вагонетка', ic: '🛒', t: 18, roll: [1, 3], loot: [['scrap', 5], ['elec', 2], ['battery', 2], ['carpart', 2], ['fuel', 2], ['tools', 1], ['wire', 3], ['crowbar', 1]] };
CONT.cabin = { n: 'Капитанский сейф', ic: '🧳', t: 15, roll: [2, 3], loot: [['cash', 5], ['watch', 2], ['ring', 2], ['pm', 1], ['a9', 2], ['scope', 1], ['vodka', 2]] };
CONT.cargo = { n: 'Затопленный контейнер', ic: '📦', t: 25, roll: [2, 4], loot: [['ration', 3], ['medkit', 2], ['vest', 1], ['ak', 1], ['a545', 3], ['drop', 1], ['silencer', 1], ['bag3', 1], ['elec', 3]] };

// ---------------- ВРАГИ ----------------
Object.assign(ENEMY, {
  armored: { n: 'Бронированный заражённый', ic: '🛡️', spr: 'soldier', hp: 60, dmg: [8, 12], sp: 1, acc: 0.55, arm: 5, inj: ['lacer', 'bite', 'bruise'], loot: 'locker', xp: 12 },
  acid:    { n: 'Кислотник', ic: '🤢', spr: 'swamper', hp: 30, dmg: [6, 10], sp: 1, acc: 0.6, inj: ['burn', 'scratch'], noVirus: 1, xp: 9, acid: 1 },
  hunterN: { n: 'Ночной охотник', ic: '🦇', spr: 'runner', hp: 45, dmg: [10, 16], sp: 2, acc: 0.65, inj: ['lacer', 'bite'], xp: 15, night: 1 },
  crawler: { n: 'Ползун', ic: '🕷️', spr: 'zombie', hp: 20, dmg: [4, 7], sp: 1, acc: 0.6, inj: ['scratch', 'bite'], xp: 5 },
  warden:  { n: 'Надзиратель', ic: '⛓️', spr: 'guard', hp: 170, dmg: [13, 20], sp: 1, acc: 0.6, arm: 5, inj: ['frac', 'lacer', 'bruise'], xp: 70, boss: 1, drop: [['vest2', 1], ['code3', 1]] },
  // главари группировок
  wolfboss: { n: 'Вожак Серый', ic: '🐺', spr: 'raider', hp: 130, dmg: [12, 18], sp: 1, acc: 0.65, arm: 3, human: 1, inj: ['bullet', 'lacer'], xp: 50, boss: 1, noVirus: 1, gear: [['sawn', 1]], drop: [['wolfcloak', 1], ['cash', 6]] },
  stalkerboss: { n: 'Меченый', ic: '☢️', spr: 'raider', hp: 140, dmg: [12, 19], sp: 1, acc: 0.7, arm: 4, human: 1, inj: ['bullet', 'lacer'], xp: 55, boss: 1, noVirus: 1, gear: [['ak', 1]], drop: [['marked', 1], ['detector', 1], ['drop', 1]] },
  deserterboss: { n: 'Полковник', ic: '🎖️', spr: 'soldier', hp: 160, dmg: [13, 20], sp: 1, acc: 0.7, arm: 5, human: 1, inj: ['bullet', 'lacer'], xp: 60, boss: 1, noVirus: 1, gear: [['ak', 1]], drop: [['vest2', 1], ['bp_c4', 1], ['c4', 2]] },
  cultboss: { n: 'Пророк Синего света', ic: '🔵', spr: 'sci', hp: 170, dmg: [14, 22], sp: 1, acc: 0.65, arm: 3, human: 1, inj: ['burn', 'lacer'], xp: 65, boss: 1, noVirus: 1, drop: [['staff', 1], ['serum', 2], ['crystal', 1]] },
});
// кислотник портит броню, ночной охотник выходит только ночью
const _enemyHitC = enemyHit;
enemyHit = function (e, ranged, near) {
  const D = ENEMY[e.id];
  if (D.acid && !ranged && G.eq.vest && ch(0.3)) { const v = G.eq.vest; v.acidN = (v.acidN || 0) + 1; cLog(`🧪 Кислота разъедает ${IT(v.id).n}!`, 'bad'); if (v.acidN >= 6) { cLog(`💥 ${IT(v.id).n} развалился от кислоты.`, 'bad'); G.eq.vest = null; } }
  return _enemyHitC.apply(this, arguments);
};
const _armorC = armor;
armor = function () { let a = _armorC(); if (G.eq.vest && G.eq.vest.acidN) a = Math.max(0, a - Math.floor(G.eq.vest.acidN / 2)); return a; };

// ---------------- НОВЫЕ МЕСТА ----------------
Object.assign(LOCS, {
  wreck: { n: 'Сухогруз «Пионер»', ic: '🚢', x: 5, y: 43, dg: 2,
    d: 'Ржавый сухогруз сел на мель у западного берега. Часть трюма под водой.',
    links: { beach: 50 }, fish: 1, water: 'sea',
    rooms: [
      { n: 'Палуба', cont: ['shore', 'body'], en: [['drowned', 1, 2]] },
      { n: 'Трюм', cont: ['milcrate', 'backpack'], en: [['drowned', 1, 2], ['crawler', 0, 1]], dark: 1 },
      { n: 'Затопленный отсек', cont: ['cargo', 'cargo'], en: [['drowned', 1, 1]], lock: 'scuba', dark: 1 },
      { n: 'Капитанская каюта', cont: ['cabin', 'desk'], en: [['runner', 0, 1]], fixed: { item: 'code1', note: 'n_wreck' } },
    ] },
  mine: { n: 'Старая шахта', ic: '⛏️', x: 24, y: 40, dg: 2, zone: 1,
    d: 'Заброшенная шахта в холмах. Темно, сыро, где-то капает. Говорят, шахтёры докопались до чего-то синего.',
    links: { forest: 50, lighthouse: 55 },
    rooms: [
      { n: 'Вход в штольню', cont: ['toolbox', 'body'], en: [['zombie', 1, 2]] },
      { n: 'Штрек', cont: ['minecart', 'minecart'], en: [['crawler', 1, 3]], dark: 1 },
      { n: 'Забой', cont: ['minecart', 'stash'], en: [['crawler', 1, 2], ['acid', 0, 1]], anom: 2, dark: 1, fixed: { item: 'code2', note: 'n_mine' } },
      { n: 'Затопленный горизонт', cont: ['backpack', 'body'], en: [['drowned', 1, 2]], dark: 1 },
    ] },
  prison: { n: 'Тюрьма «Северная»', ic: '⛓️', x: 74, y: 40, dg: 3,
    d: 'Колония строгого режима. Охрана ушла, заключённые остались — и обратились.',
    links: { post: 50, swamp: 60, farm: 75 },
    rooms: [
      { n: 'КПП тюрьмы', cont: ['desk', 'locker'], en: [['armored', 1, 1], ['zombie', 1, 2]] },
      { n: 'Блок А', cont: ['locker', 'locker', 'body'], en: [['zombie', 2, 3], ['armored', 0, 1]], fixed: { item: 'k_prison' } },
      { n: 'Оружейка', cont: ['armory', 'milcrate'], lock: 'k_prison', en: [['armored', 1, 1]] },
      { n: 'Кабинет начальника', cont: ['safe', 'desk'], en: [['warden', 1, 1]], dark: 1, fixed: { note: 'n_prison' } },
    ] },
});
LOCS.beach.links.wreck = 50; LOCS.forest.links.mine = 50; LOCS.lighthouse.links.mine = 55;
LOCS.post.links.prison = 50; LOCS.swamp.links.prison = 60; LOCS.farm.links.prison = 75;
// новые враги в старых местах
LOCS.swamp.rooms[1].en.push(['acid', 0, 1]);
LOCS.post.rooms[1].en.push(['armored', 0, 1]);
LOCS.nii.rooms[0].en.push(['armored', 0, 1]);
Object.assign(NOTES, {
  n_wreck:  { t: 'Судовой журнал «Пионера»', x: '«Груз: оборудование для НИИ “Остров-7”. Получатель — в/ч … Капитан приказал не открывать контейнер №3. Он светится по ночам.»' },
  n_mine:   { t: 'Записка штейгера', x: '«На сорок втором метре порода синяя. Инженер из НИИ забрал образцы и велел завалить забой. Ребята, что спускались туда, по ночам говорят во сне на чужом языке.»' },
  n_prison: { t: 'Рапорт начальника колонии', x: '«Заключённых использовали для испытаний сыворотки. Партия №4 не сработала. Прошу эвакуировать личный состав. Ответа нет.»' },
  n_c3:     { t: 'Перехват: «Северный»', x: '«…говорит спасательное судно “Северный”. Слышим ваш маяк. Чтобы войти в пролив, нужен код опознавания из трёх частей. Части у вас на острове: “Пионер”, “Штольня”, “Северная”…»' },
});

// ---------------- ПОСТРОЙКИ: генератор, холодильник, прожектор, мощная рация ----------------
Object.assign(STRUCT, {
  gen:    { n: 'Генератор', ic: '⚡', lv: [{ n: 'Нет' }, { n: 'Бензиновый генератор', c: { scrap: 6, elec: 3, wire: 4, carpart: 1 } }] },
  fridge: { n: 'Холодильник', ic: '🧊', need: 'gen', lv: [{ n: 'Нет' }, { n: 'Холодильник', c: { scrap: 4, elec: 2, wire: 1 } }] },
  lights: { n: 'Прожекторы', ic: '💡', need: 'gen', def: [0, 15], lv: [{ n: 'Нет' }, { n: 'Прожекторы на крыше', c: { elec: 2, wire: 3, battery: 2, scrap: 2 } }] },
  stove:  { n: 'Кухонная плита', ic: '🍳', lv: [{ n: 'Нет' }, { n: 'Плита из бочки', c: { scrap: 5, planks: 2, wire: 1 } }] },
});
STRUCT.radio.lv.push({ n: 'Мощный передатчик', c: { elec: 4, battery: 4, wire: 4, cshard: 2 }, ch3: 1 });

// ---------------- РЕЦЕПТЫ ----------------
RECIPES.push(
  { id: 'ukha', n: 'Уха (тепло 8 ч)', need: { fish: 2, water: 1 }, out: { ukha: 1, bottle: 1 }, st: 'stove', t: 40 },
  { id: 'stew', n: 'Рагу (сила 6 ч)', need: { meat: 1, veg: 1, water: 1 }, out: { stew: 1, bottle: 1 }, st: 'stove', t: 45 },
  { id: 'stew2', n: 'Рагу с грибами (сила 6 ч)', need: { meat: 1, mushroom: 2, water: 1 }, out: { stew: 1, bottle: 1 }, st: 'stove', t: 45 },
  { id: 'pie', n: 'Ягодный пирог (спокойствие 8 ч)', need: { berries: 3, crackers: 1 }, out: { pie: 1 }, st: 'stove', t: 50 },
  { id: 'tea', n: 'Травяной чай (здоровье 8 ч)', need: { herbs: 2, water: 1 }, out: { tea: 1 }, st: 'fire', t: 15 },
  { id: 'jerky', n: 'Вяленое мясо (не портится)', need: { meat: 2, wood: 1 }, out: { jerky: 2 }, st: 'smoke', t: 60 },
  { id: 'spikes', n: 'Шипы для оружия', need: { nails: 10, wire: 1 }, out: { spikes: 1 }, st: 'bench', t: 20 },
  { id: 'grip', n: 'Обмотка рукояти', need: { rag: 2, tape: 1 }, out: { grip: 1 }, t: 10 },
  { id: 'bottlesil', n: 'Глушитель из бутылки', need: { bottle: 1, tape: 2, rag: 1 }, out: { bottlesil: 1 }, st: 'bench', bp: 'mods', t: 20 },
  { id: 'stockc', n: 'Самодельный приклад', need: { planks: 2, tape: 2, nails: 4 }, out: { stock: 1 }, st: 'bench2', bp: 'mods', t: 40 },
);
// новые станции
const _stationOk = stationOk;
stationOk = function (st) { if (st === 'stove') return atBase() && G.w.struct.stove > 0; return _stationOk(st); };
STATION_N.stove = 'кухонная плита';
const _canBuild = canBuild;
canBuild = function (id) { const S = STRUCT[id]; if (S && S.need && !G.w.struct[S.need]) return 'need'; const nx = S && S.lv[(G.w.struct[id] || 0) + 1]; if (nx && nx.ch3 && !(G.w.flags.ch3)) return 'ch3'; return _canBuild(id); };

// ---------------- ЭЛЕКТРИЧЕСТВО ----------------
const powered = () => !!(G.w.struct.gen && (G.w.power || 0) > 0);
function genRefuel() {
  if (!G.w.struct.gen) return;
  const src = cnt(G.inv, 'fuel') ? G.inv : cnt(G.stash, 'fuel') ? G.stash : null; if (!src) return UI.toast('Нужна канистра бензина.');
  take(src, 'fuel', 1); G.w.power = (G.w.power || 0) + 36; advance(5); SND('build');
  UI.log(`⚡ Генератор заправлен: хватит на ~${Math.round(G.w.power)} ч.`, 'good'); UI.render();
}
function powerTick(st) {
  if (!powered() || !worldAuth()) return;
  const h = st / H; G.w.power = Math.max(0, G.w.power - h * (1 + (G.w.struct.fridge ? 0.2 : 0) + (G.w.struct.lights && isNight() ? 0.3 : 0)));
  if (G.w.struct.fridge) for (const e of G.stash) if (IT(e.id).sp) e.born = (e.born || 0) + st * 0.8; // в холодильнике еда стареет в 5 раз медленнее
  if (G.w.power <= 0) UI.log('⚡ Генератор заглох — кончился бензин.', 'warn');
}
const _defenseC = defense;
defense = function () { return _defenseC() + (G.w.struct.lights && powered() ? 15 : 0); };

// ---------------- БОНУСЫ ОТ ЕДЫ ----------------
const BUFFS = {
  warm:    { n: 'Согрет', ic: '🔥', h: 8, m: { cold: -0.6 } },
  strong:  { n: 'Сытая сила', ic: '💪', h: 6, m: { meleeDmg: 0.12, carry: 3 } },
  calm:    { n: 'Спокойствие', ic: '😌', h: 8, m: { stress: -0.5 } },
  healthy: { n: 'Бодрость', ic: '🌿', h: 8, m: { ill: -0.5, heal: 0.2 } },
  alert:   { n: 'Бодрячок', ic: '☕', h: 6, m: { fatigue: -0.4, gunAcc: 0.03 } },
};
function addBuff(id) { const B = BUFFS[id]; if (!B) return; G.ch.buffs = (G.ch.buffs || []).filter(b => b.id !== id); G.ch.buffs.push({ id, until: G.time + B.h * H }); UI.log(`${B.ic} ${B.n} на ${B.h} ч.`, 'good'); }
const activeBuffs = () => (G && G.ch && G.ch.buffs || []).filter(b => b.until > G.time && BUFFS[b.id]);
const _useItemC = useItem;
useItem = function (id) { const it = IT(id); const before = cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0); const r = _useItemC.apply(this, arguments); if (it && it.buff && cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0) < before) addBuff(it.buff); return r; };

// ---------------- МОДУЛИ ОРУЖИЯ ----------------
function weaponMods(w) { return (w && w.mods) || []; }
function canMod(w, modId) { const it = IT(w.id), M = IT(modId).mod; if (!M) return false; if (M.gun && it.c !== 'gun') return false; if (M.melee && it.c !== 'melee') return false; return weaponMods(w).length < 2 && !weaponMods(w).includes(modId); }
function installMod(modId) {
  const w = G.eq.weapon; if (!w || !canMod(w, modId) || !cnt(G.inv, modId)) return UI.toast('Этот модуль сюда не подходит (максимум 2 модуля).');
  take(G.inv, modId, 1); w.mods = [...weaponMods(w), modId]; advance(10); xp('craft', 2); SND('craft');
  UI.log(`🔧 На ${IT(w.id).n} установлен модуль: ${IT(modId).ic} ${IT(modId).n}.`, 'good'); UI.render();
}

// ---------------- ОБЩИЕ МОДИФИКАТОРЫ (бонусы еды, модули оружия) ----------------
const _extraModC = extraMod;
extraMod = function (k) {
  let v = _extraModC(k);
  for (const b of activeBuffs()) if (BUFFS[b.id].m[k]) v += BUFFS[b.id].m[k];
  for (const id of weaponMods(G && G.eq && G.eq.weapon)) { const M = IT(id).mod; if (M && M.m[k]) v += M.m[k]; }
  if (k === 'stress' && atBase() && powered()) v -= 0.2;
  return v;
};

// ---------------- КОНТРАКТЫ (заказы на день у торговцев) ----------------
const CONTRACT_ITEMS = {
  semen: [['fish', 4], ['wood', 6], ['berries', 6], ['mushroom', 5], ['meat', 3], ['herbs', 4], ['planks', 4]],
  serg:  [['a9', 15], ['scrap', 5], ['tape', 2], ['bandage', 3], ['knife', 1], ['bat', 1], ['canned', 3]],
  levin: [['herbs', 6], ['elec', 2], ['battery', 3], ['alcohol', 1], ['antisep', 1], ['bolts', 10]],
};
const CONTRACT_KILLS = { semen: ['zombie', 'dog', 'drowned'], serg: ['raider', 'soldier', 'bandit', 'runner'], levin: ['sci', 'pdog', 'acid', 'crawler'] };
function genContracts() {
  const out = {};
  for (const tr of ['semen', 'serg', 'levin']) {
    const list = [];
    const [id, n] = pick(CONTRACT_ITEMS[tr]); list.push({ k: tr + day() + 'a', type: 'items', id, n, pay: Math.round(IT(id).v * n * 1.4 + 15) });
    if (ch(0.7)) { const en = pick(CONTRACT_KILLS[tr]); const n2 = R(3, 6); list.push({ k: tr + day() + 'b', type: 'kill', en, n: n2, pay: n2 * (ENEMY[en].xp + 6) }); }
    else { const loc = pick(Object.keys(LOCS).filter(l => l !== 'base' && !LOCS[l].ch2 && LOCS[l].dg >= 1)); list.push({ k: tr + day() + 'c', type: 'visit', loc, pay: 30 + LOCS[loc].dg * 25 }); }
    out[tr] = list;
  }
  G.w.contracts = { day: day(), list: out, taken: {}, base: {} };
}
function contracts() { if (!G.w.contracts || G.w.contracts.day !== day()) { if (worldAuth()) genContracts(); else return { list: {}, taken: {}, base: {} }; } return G.w.contracts; }
function contractTake(tr, c) {
  const C = contracts(); C.taken[c.k] = 'active';
  if (c.type === 'kill') C.base[c.k] = (G.w.killsBy || {})[c.en] || 0;
  if (c.type === 'visit') C.base[c.k] = 0;
  UI.log(`📋 Взят заказ: ${contractText(c)}`, 'good'); UI.render();
}
function contractProgress(c) {
  const C = contracts();
  if (c.type === 'items') return Math.min(cnt(G.inv, c.id), c.n);
  if (c.type === 'kill') return Math.min(((G.w.killsBy || {})[c.en] || 0) - (C.base[c.k] || 0), c.n);
  if (c.type === 'visit') return C.base[c.k] ? 1 : 0;
  return 0;
}
const contractGoal = c => c.type === 'visit' ? 1 : c.n;
function contractText(c) { return c.type === 'items' ? `принести ${IT(c.id).ic} ${IT(c.id).n} ×${c.n}` : c.type === 'kill' ? `упокоить ${ENEMY[c.en].ic} ${ENEMY[c.en].n} ×${c.n}` : `разведать ${LOCS[c.loc].ic} ${LOCS[c.loc].n} и вернуться`; }
function contractDone(tr, c) {
  const C = contracts(); if (contractProgress(c) < contractGoal(c)) return;
  if (c.type === 'items') take(G.inv, c.id, c.n);
  C.taken[c.k] = 'done'; G.money += c.pay; G.w.contractsDone = (G.w.contractsDone || 0) + 1;
  if (G.w.contractsDone % 3 === 0 && tr in G.w.rep) { G.w.rep[tr]++; UI.log(`⭐ Репутация у ${TRADERS[tr].n} выросла.`, 'good'); }
  if (ch(0.35)) { const bonus = pick(['bandage', 'canned', 'a9', 'tape', 'coffee', 'grip']); invAdd(G.inv, bonus, IT(bonus).c === 'ammo' ? 8 : 1); UI.log(`🎁 Сверху дали: ${IT(bonus).ic} ${IT(bonus).n}.`, 'good'); }
  weekProgress('contracts', 1); SND('quest'); FEED(`📋 выполнил заказ ${TRADERS[tr].n}`);
  UI.log(`📋 Заказ выполнен: +${c.pay}₽.`, 'good'); save(); UI.render();
}
// счётчик убийств по типам + отметка разведки
const _onKillC = onKill;
onKill = function (e) { G.w.killsBy = G.w.killsBy || {}; G.w.killsBy[e.id] = (G.w.killsBy[e.id] || 0) + 1; weekProgress('kills', 1); if (ENEMY[e.id].boss) weekProgress('bosses', 1); return _onKillC.apply(this, arguments); };

// ---------------- СОБЫТИЕ НЕДЕЛИ ----------------
const WEEKLY = [
  { id: 'kills', n: 'Чистка острова', d: 'Упокой 120 врагов', goal: 120, ic: '🔪' },
  { id: 'hordes', n: 'Кровавая неделя', d: 'Переживи 2 Кровавые ночи', goal: 2, ic: '🌕' },
  { id: 'raids', n: 'Гроза лагерей', d: 'Разграбь 3 лагеря или базы', goal: 3, ic: '💣' },
  { id: 'fish', n: 'Большой улов', d: 'Поймай 40 рыб', goal: 40, ic: '🐟' },
  { id: 'contracts', n: 'Работяга', d: 'Выполни 10 заказов торговцев', goal: 10, ic: '📋' },
  { id: 'arts', n: 'Охота за артефактами', d: 'Достань 6 артефактов или горстей осколков', goal: 6, ic: '✨' },
  { id: 'bosses', n: 'Охотник на главарей', d: 'Победи 2 босса', goal: 2, ic: '👑' },
];
const weekNo = () => Math.floor((Date.now() / 864e5 + 3) / 7); // недели с понедельника
const weekly = () => WEEKLY[weekNo() % WEEKLY.length];
function weekState() { let s0; try { s0 = JSON.parse(localStorage.getItem('moti3_week')) || {}; } catch (e) { s0 = {}; } if (s0.wk !== weekNo()) s0 = { wk: weekNo(), prog: 0, done: false }; return s0; }
function weekProgress(kind, n) {
  if (!G || weekly().id !== kind) return;
  const s0 = weekState(); s0.prog += n;
  if (!s0.done && s0.prog >= weekly().goal) { s0.done = true; setTimeout(() => { invAdd(G.inv, pick(['serum', 'medkit', 'c4', 'scope', 'bag3']), 1); G.money += 300; UI.event({ title: `🏆 Событие недели выполнено!`, cls: 'good', text: `${weekly().ic} ${weekly().n}: ${weekly().d}.\n\nНаграда: 300₽ и ценный ящик в рюкзаке.`, choices: [{ t: 'Отлично' }] }); save(); }, 0); }
  try { localStorage.setItem('moti3_week', JSON.stringify(s0)); } catch (e) {}
  weekSubmit();
}
let weekT = 0;
function weekSubmit(force) { if (!window.FB || !FB.init || (!force && Date.now() - weekT < 60000)) return; weekT = Date.now(); FB.init().then(() => firebase.database().ref(`d/week/${weekNo()}_${FB.uid}`).set({ name: G.ch.name, prog: weekState().prog, wk: weekNo(), at: Date.now() })).catch(() => {}); }
const WK = { list: null, busy: false };
function weekLoad() { if (!window.FB || !FB.init || WK.busy) return; WK.busy = true; FB.init().then(() => firebase.database().ref('d/week').get()).then(s => { const o = []; s.forEach(c => { const v = c.val(); if (v && v.wk === weekNo()) o.push(v); }); WK.list = o.sort((a, b) => b.prog - a.prog).slice(0, 10); }).catch(() => { WK.list = []; }).finally(() => { WK.busy = false; if (UI._st.tab === 'jour') UI.render(); }); }
// отслеживание прогресса недели
const _doFishC = doFish; doFish = function () { const b = cnt(G.inv, 'fish'); const r = _doFishC.apply(this, arguments); const d = cnt(G.inv, 'fish') - b; if (d > 0) weekProgress('fish', d); return r; };
const _grabArtC = grabArtifact; grabArtifact = function () { const had = roomSt(G.room) && roomSt(G.room).art; const r = _grabArtC.apply(this, arguments); if (had && !(G.room != null && roomSt(G.room).art)) weekProgress('arts', 1); return r; };

// ---------------- ГЛАВАРИ ГРУППИРОВОК ----------------
const FACTION_BOSS = { wolves: 'wolfboss', stalkers: 'stalkerboss', deserters: 'deserterboss', cult: 'cultboss' };
function bossRaid(k) {
  const F0 = FACTIONS[k], c = camps()[k], B = FACTION_BOSS[k]; if (!B || c.dead) return;
  setAct(`👑 идёт за главарём: ${F0.n}`); G.room = null; advance(F0.mins); if (G.dead) return;
  const en = [mkEnemy(B), mkEnemy(F0.en), mkEnemy(F0.en)]; en.forEach(e => e.dist = 1);
  UI.log(`👑 ${ENEMY[B].ic} ${ENEMY[B].n} встречает тебя лично.`, 'bad');
  startCombat(en, { road: true, onEnd: (r) => {
    advance(F0.mins); if (G.dead) return; G.loc = 'base'; G.traveling = false;
    if (r === 'win') { c.dead = true; c.grudge = 0; raidStats().won++; FEED(`👑 победил главаря ${F0.n}`); UI.event({ title: `👑 ${F0.n} больше нет`, cls: 'good', text: `${ENEMY[B].n} повержен. Без главаря группировка разбежалась — больше они не придут мстить. Трофеи главаря — у тебя в рюкзаке.`, choices: [{ t: 'Вернуться на базу' }] }); }
    else UI.event({ title: '🏚️ Отступил', cls: 'bad', text: 'Главарь оказался не по зубам. Подготовься лучше.', choices: [{ t: 'OK' }] });
    save(); UI.go('loc'); } });
}
const _raidDailyC = raidDaily;
raidDaily = function () { const c = camps(); for (const k in c) if (c[k].dead) c[k].grudge = 0; return _raidDailyC.apply(this, arguments); };
const _raidAfterC = raidAfter;
raidAfter = function (k, r, back) { if (r === 'win') weekProgress('raids', 1); return _raidAfterC.apply(this, arguments); };

// ---------------- ГЛАВА 3: «Большая земля» ----------------
Object.assign(QUESTS, {
  c3_radio: { g: 'main', n: 'Мощный передатчик', d: 'Слабая рация не добивает до материка. Улучши радиостанцию на базе до мощного передатчика (электроника, батарейки, проволока, осколки кристалла).', type: 'flag', flag: 'radio2', rew: {}, next: 'c3_codes' },
  c3_codes: { g: 'main', n: 'Код опознавания', d: 'Судно «Северный» войдёт в пролив только по коду из трёх шифровок: на сухогрузе «Пионер» (каюта), в старой шахте (забой) и в тюрьме «Северная» (у Надзирателя).', type: 'items', need: { code1: 1, code2: 1, code3: 1 }, rew: { xp: { surv: 20 } }, next: 'c3_signal' },
  c3_signal: { g: 'main', n: 'Сигнал', d: 'Передай код с базы (База → «📡 Передать код»). Потом продержись до прихода судна.', type: 'flag', flag: 'c3_sent', rew: {}, next: 'c3_hold' },
  c3_hold: { g: 'main', n: 'Последняя ночь', d: 'Судно придёт на рассвете. Остров не хочет тебя отпускать — продержись на базе.', type: 'flag', flag: 'c3_held', rew: { money: 1000 } },
});
const ch3Ready = () => !G.w.flags.ch3 && (G.w.ending === 'silence' || !!(G.w.ch2 && G.w.ch2.end));
function startCh3() {
  if (G.w.flags.ch3) return; G.w.flags.ch3 = true; G.w.quests.c3_radio = 'active'; addNote('n_c3'); FEED('📡 начал Главу 3 «Большая земля»');
  UI.event({ title: '📡 Глава 3 · Большая земля', cls: 'good', text: 'Сквозь треск рации пробивается голос: спасательное судно «Северный» ищет выживших. Чтобы оно вошло в пролив, нужен код опознавания — три шифровки, спрятанные на острове.\n\nНовые места на карте: 🚢 сухогруз «Пионер» (у пляжа), ⛏️ старая шахта (за лесом), ⛓️ тюрьма «Северная» (у блокпоста).', choices: [{ t: 'Начать' }] });
  save(); UI.render();
}
function sendCode() {
  if (!(G.w.struct.radio >= 2) || G.w.flags.c3_sent || !atBase()) return;
  if (!(allCnt('code1') && allCnt('code2') && allCnt('code3')) && G.w.quests.c3_codes !== 'done') return UI.toast('Нужны все три шифровки.');
  G.w.flags.c3_sent = true; G.w.c3At = (day()) * DAY + 5 * H; checkQuests(); SND('radio');
  UI.event({ title: '📡 Код передан', cls: 'good', text: '«Принято. Идём к вам. Будем у пристани на рассвете». Связь обрывается — и в ту же секунду с острова поднимается вой. Ночь будет тяжёлой: всё, что живёт на острове, идёт к твоей базе.\n\nОставайся на базе до рассвета.', choices: [{ t: 'Держать оборону' }] });
  save(); UI.render();
}
function ch3Tick() {
  if (!G.w.flags.c3_sent || G.w.flags.c3_held || G.w.c3Fight || G.time < (G.w.c3At || 1e15) - 6 * H) return;
  if (!worldAuth() && !atBase()) return;
  G.w.c3Fight = true; G.interrupt = true; setTimeout(ch3Siege, 60);
}
function ch3Siege() {
  if (!G || G.dead || G.w.flags.c3_held) return;
  const md = document.getElementById('modal');
  if (G.combat || G.traveling || (md && md.children.length)) return setTimeout(ch3Siege, 1500);
  if (atBase()) {
    const en = spawnList([['armored', 2, 2], ['hunterN', 1, 2], ['zombie', 3, 3]]); en.forEach((e, i) => e.dist = i < 3 ? 1 : 2);
    SND('horde'); UI.log('🌑 Они пришли — всё, что живёт на острове.', 'bad');
    startCombat(en, { road: true, onEnd: (r) => {
      if (r === 'win') return ch3Dawn();
      G.w.c3Fight = false; G.w.c3At = G.time + DAY; save();
      UI.event({ title: '🌑 Ночь не кончилась', cls: 'bad', text: 'Тебе пришлось отступить. Судно не подойдёт к берегу, пока у базы враги. Передатчик снова ловит «Северный»: они придут следующим рассветом.', choices: [{ t: 'Попробовать снова' }] });
    } });
  } else {
    G.w.c3Fight = false; G.w.c3At += DAY; save();
    UI.event({ title: '🚢 «Северный» ушёл', cls: 'bad', text: 'Тебя не было на базе. Судно ждало у пристани и ушло. Обещали вернуться завтра на рассвете — будь на базе к 23:00.', choices: [{ t: 'Понял' }] });
  }
}
function ch3Dawn() {
  G.w.flags.c3_held = true; checkQuests(); save();
  UI.event({ title: '🚢 Рассвет', cls: 'good', text: 'Из тумана выходит серый борт с красной полосой. С палубы машут. Семёныч стоит на пристани и не двигается.\n\n«Ну? Плывёшь? Или остаёшься — остров теперь без хозяина не может».', choices: [
    { t: '🚢 Уплыть на Большую землю', fn: () => ending3('leave') },
    { t: '🏝️ Остаться хранителем острова', fn: () => ending3('stay') }] });
}
function ending3(choice) {
  G.w.flags.ch3_end = choice; G.w.c3Fight = false; const c = G.ch; FEED(choice === 'leave' ? '🚢 уплыл на Большую землю' : '🏝️ остался хранителем острова'); save();
  const txt = choice === 'leave' ? 'Остров уменьшается за кормой, пока не становится тёмной полоской на горизонте. На материке тебя ждут вопросы, карантин и чужая жизнь. Но иногда по ночам ты всё ещё слышишь, как гудит Аппарат.\n\nКонец истории.' : 'Ты машешь «Северному» вслед. Кто-то должен следить за аномалиями, кормить кота и встречать тех, кого выбросит море. Семёныч молча ставит чайник.\n\nОстров твой.';
  UI.event({ title: choice === 'leave' ? '🚢 Большая земля' : '🏝️ Хранитель', cls: 'good', text: txt + `\n\n${c.name} · дней на острове: ${Math.floor((G.time - c.born) / DAY)} · врагов: ${c.kills}\n\nСпасибо, что прошёл «Mystery of the Island» до конца! Мир остаётся с тобой.`, choices: [{ t: 'Продолжить играть' }] });
}

// ---------------- хуки: тик, день, миграция ----------------
const _tickC = tick;
tick = function (st, o) { _tickC.apply(this, arguments); if (G && !G.dead) { powerTick(st); ch3Tick(); } };
const _extNewDayC = extNewDay;
extNewDay = function () { _extNewDayC.apply(this, arguments); if (worldAuth()) contracts(); if (ch3Ready() && worldAuth()) startCh3(); };
const _buildC = build;
build = function (id) { const lv = G.w.struct[id] || 0; const r = _buildC.apply(this, arguments); if (id === 'radio' && (G.w.struct.radio || 0) >= 2 && lv < 2) { G.w.flags.radio2 = true; checkQuests(); } return r; };
const _extMigrateC = extMigrate;
extMigrate = function () { _extMigrateC.apply(this, arguments); for (const k of ['gen', 'fridge', 'lights', 'stove']) if (G.w.struct[k] == null) G.w.struct[k] = 0; if (G.w.power == null) G.w.power = 0; if (ch3Ready() && worldAuth()) setTimeout(() => { if (G && ch3Ready()) startCh3(); }, 1500); };
// ночной охотник: иногда присоединяется к врагам ночью
const _mkEnemyC = mkEnemy;
const _spawnListC = spawnList;
spawnList = function (spec) { const out = _spawnListC.apply(this, arguments); if (G && isNight() && !LOCS[G.loc].base && ch(0.1) && spec.some(([id]) => !ENEMY[id].boss && !ENEMY[id].human)) out.push(_mkEnemyC('hunterN')); return out; };

// событие недели: пережитая Кровавая ночь
const _hordeTickC = hordeTick;
hordeTick = function () { const d = day(), had = !!G.w.hordeDone[d]; const r = _hordeTickC.apply(this, arguments); if (!had && G.w.hordeDone[d] && !G.dead) weekProgress('hordes', 1); return r; };

// =====================================================================
//  ИНТЕРФЕЙС нового контента (вызывается из ui.js)
// =====================================================================
const cesc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CUI = {
  top() {
    const b = activeBuffs(); if (!b.length && !(atBase() && powered())) return '';
    return `<div class="moods">${b.map(x => `<span class="mood l0" title="ещё ${Math.ceil((x.until - G.time) / H)} ч">${BUFFS[x.id].ic} ${BUFFS[x.id].n}</span>`).join('')}${atBase() && powered() ? `<span class="mood l0">⚡ свет (${Math.round(G.w.power)} ч)</span>` : ''}</div>`;
  },
  modBtn(e) {
    const w = G.eq.weapon; const ok = w && canMod(w, e.id);
    return UI.btn(ok ? `🔧 На ${IT(w.id).n}` : '🔧 Установить', () => installMod(e.id), 'sm', !ok);
  },
  basePanel() {
    const b = UI.btn, s = G.w.struct; let h = '';
    if (s.gen) {
      h += `<div class="sec"><h2>⚡ Электричество</h2><p class="muted" style="font-size:13px">${powered() ? `Генератор гудит: топлива на ~${Math.round(G.w.power)} ч.` : 'Генератор молчит — нужен бензин.'} Свет на базе снимает стресс${s.fridge ? ', холодильник бережёт еду на складе' : ''}${s.lights ? ', прожекторы дают +15 к обороне' : ''}.</p><div class="acts">${b(`⛽ Заправить (+36 ч, есть ${allCnt('fuel')})`, genRefuel, 'sm', !allCnt('fuel'))}</div></div>`;
    }
    if (G.w.flags.ch3 && !G.w.flags.c3_held) {
      const have = ['code1', 'code2', 'code3'].filter(x => allCnt(x)).length;
      h += `<div class="sec"><h2>📡 Большая земля</h2><p class="muted" style="font-size:13px">${G.w.flags.c3_sent ? `Код передан. «Северный» будет на рассвете — продержись на базе с 23:00.` : `Шифровки: ${have}/3 · передатчик: ${s.radio >= 2 ? 'мощный' : 'слабый — улучши радиостанцию'}`}</p>${!G.w.flags.c3_sent ? `<div class="acts">${b('📡 Передать код', sendCode, 'pri sm', !(s.radio >= 2 && (have === 3 || G.w.quests.c3_codes === 'done')))}</div>` : ''}</div>`;
    }
    return h;
  },
  contracts(tid) {
    if (!CONTRACT_ITEMS[tid]) return '';
    const C = contracts(), list = C.list[tid] || [], b = UI.btn;
    let h = `<div class="sec"><h2>📋 Заказы на сегодня</h2><p class="muted" style="font-size:13px">Обновляются каждый день. Каждые 3 выполненных заказа — +1 к репутации.</p><div class="list">`;
    if (!list.length) h += '<p class="muted">Заказов пока нет — загляни завтра.</p>';
    for (const c of list) {
      const stt = C.taken[c.k], pr = stt === 'active' ? contractProgress(c) : 0, goal = contractGoal(c);
      h += `<div class="row ${stt === 'done' ? 'dim' : ''}"><span class="ic">${stt === 'done' ? '✅' : '📋'}</span><div class="grow"><span class="t">${cesc(contractText(c))}</span><span class="s">💰 ${c.pay}₽${stt === 'active' ? ` · прогресс ${pr}/${goal}` : ''}</span></div>${!stt ? b('Взять', () => contractTake(tid, c), 'sm') : stt === 'active' ? b('Сдать', () => contractDone(tid, c), 'sm pri', pr < goal) : ''}</div>`;
    }
    return h + '</div></div>';
  },
  jour() {
    const W0 = weekly(), s0 = weekState(), b = UI.btn;
    if (!WK.list && !WK.busy && window.FB && FB.init) weekLoad();
    let h = `<div class="sec"><div class="sechead"><h2>🏆 Событие недели</h2>${window.FB && FB.init ? b(WK.busy ? '…' : '↻', () => { weekSubmit(true); setTimeout(weekLoad, 800); }, 'sm') : ''}</div>`;
    h += `<div class="row ${s0.done ? 'dim' : ''}"><span class="ic">${W0.ic}</span><div class="grow"><span class="t">${W0.n}</span><span class="s">${W0.d} · прогресс ${Math.min(s0.prog, W0.goal)}/${W0.goal}${s0.done ? ' · ✅ награда получена' : ' · награда: 300₽ и ценный ящик'}</span></div></div>`;
    if (WK.list && WK.list.length) h += `<div class="list" style="gap:2px">${WK.list.map((p, i) => `<div class="lg" style="font-size:13px">${['🥇', '🥈', '🥉'][i] || (i + 1) + '.'} ${cesc(p.name)} — ${p.prog}</div>`).join('')}</div>`;
    h += '</div>';
    if (ch3Ready()) h += `<div class="sec"><h2>📡 Глава 3 «Большая земля»</h2><p class="muted">Рация ловит чужой голос. Может, это шанс уплыть с острова.</p><div class="acts">${b('Начать Главу 3', startCh3, 'pri')}</div></div>`;
    return h;
  },
};
window.CUI = CUI;
