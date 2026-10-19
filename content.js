"use strict";
Object.assign(ITEMS, {
  // кулинария (buff — временный бонус)
  ukha: { n: "Уха", ic: "🍲", c: "food", w: 0.5, v: 40, f: 45, d: 15, sp: 48, buff: "warm" },
  stew: { n: "Рагу с мясом", ic: "🥘", c: "food", w: 0.6, v: 50, f: 55, d: 5, sp: 48, buff: "strong" },
  pie: { n: "Ягодный пирог", ic: "🥧", c: "food", w: 0.4, v: 35, f: 30, stress: -25, sp: 72, buff: "calm" },
  tea: { n: "Травяной чай", ic: "🍵", c: "drink", w: 0.4, v: 20, d: 35, btl: 1, buff: "healthy" },
  jerky: { n: "Вяленое мясо", ic: "🥓", c: "food", w: 0.3, v: 35, f: 28 },
  coffee: { n: "Кофе из армейского пайка", ic: "☕", c: "drink", w: 0.2, v: 30, d: 15, buff: "alert" },
  // модули оружия
  scope: { n: "Прицел", ic: "🔭", c: "mod", w: 0.3, v: 150, mod: { gun: 1, m: { gunAcc: 0.08 } }, info: "Огнестрел: точность +8%" },
  silencer: { n: "Глушитель", ic: "🔇", c: "mod", w: 0.4, v: 180, mod: { gun: 1, m: { gunNoise: -0.5 } }, info: "Огнестрел: шум выстрела −50%" },
  bottlesil: { n: "Глушитель из бутылки", ic: "🍾", c: "mod", w: 0.2, v: 20, mod: { gun: 1, m: { gunNoise: -0.25 } }, info: "Огнестрел: шум −25%. Самоделка." },
  stock: { n: "Приклад", ic: "🪵", c: "mod", w: 0.6, v: 90, mod: { gun: 1, m: { gunAcc: 0.04, ammoSave: 0.1 } }, info: "Огнестрел: точность +4%, отдача меньше" },
  extmag: { n: "Расширенный магазин", ic: "📦", c: "mod", w: 0.3, v: 120, mod: { gun: 1, m: { ammoSave: 0.15 } }, info: "Огнестрел: 15% патрон не тратится" },
  spikes: { n: "Шипы и гвозди", ic: "📍", c: "mod", w: 0.3, v: 15, mod: { melee: 1, m: { meleeDmg: 0.15 } }, info: "Ближний бой: урон +15%" },
  grip: { n: "Обмотка рукояти", ic: "🧵", c: "mod", w: 0.1, v: 10, mod: { melee: 1, m: { meleeAcc: 0.04, dur: -0.3 } }, info: "Ближний бой: точнее, оружие служит дольше" },
  // новое снаряжение и ресурсы
  scuba: { n: "Акваланг", ic: "🤿", c: "key", w: 6, v: 400, info: "Нужен, чтобы нырнуть в затопленный отсек сухогруза." },
  k_prison: { n: "Ключ от оружейки тюрьмы", ic: "🔑", c: "key", w: 0, v: 40 },
  code1: { n: "Шифровка «Пионер»", ic: "📄", c: "quest", w: 0, v: 0 },
  code2: { n: "Шифровка «Штольня»", ic: "📄", c: "quest", w: 0, v: 0 },
  code3: { n: "Шифровка «Северная»", ic: "📄", c: "quest", w: 0, v: 0 },
  wolfcloak: { n: "Плащ Вожака", ic: "🐺", c: "wear", w: 2, v: 500, slot: "body", warm: 4, arm: 3 },
  vest2: { n: "Тяжёлый бронежилет", ic: "🦺", c: "wear", w: 9, v: 800, slot: "vest", arm: 7 },
  staff: { n: "Посох Пророка", ic: "🔱", c: "melee", w: 1.6, v: 900, dmg: [18, 25], dur: 200, noise: 3, reach: 1 },
  marked: { n: "Карта Меченого", ic: "🗺️", c: "val", w: 0.05, v: 600, info: "Тайники сталкеров по всему острову. Дорого продаётся." },
  parcel: { n: "Посылка", ic: "📦", c: "quest", w: 1, v: 0 },
  bp_mods: { n: "Чертёж: модули оружия", ic: "📐", c: "bp", w: 0.05, v: 120, bp: "mods" }
});
const addLoot = (ct, list) => {
  if (CONT[ct]) CONT[ct].loot.push(...list);
};
addLoot("milcrate", [["scope", 1], ["stock", 1], ["extmag", 1], ["coffee", 2]]);
addLoot("armory", [["silencer", 1], ["scope", 1], ["extmag", 1]]);
addLoot("toolbox", [["grip", 1], ["bp_mods", 1]]);
addLoot("stash", [["scuba", 1], ["scope", 1]]);
addLoot("locker", [["coffee", 1]]);
CONT.minecart = { n: "Вагонетка", ic: "🛒", t: 18, roll: [1, 3], loot: [["scrap", 5], ["elec", 2], ["battery", 2], ["carpart", 2], ["fuel", 2], ["tools", 1], ["wire", 3], ["crowbar", 1]] };
CONT.cabin = { n: "Капитанский сейф", ic: "🧳", t: 15, roll: [2, 3], loot: [["cash", 5], ["watch", 2], ["ring", 2], ["pm", 1], ["a9", 2], ["scope", 1], ["vodka", 2]] };
CONT.cargo = { n: "Затопленный контейнер", ic: "📦", t: 25, roll: [2, 4], loot: [["ration", 3], ["medkit", 2], ["vest", 1], ["ak", 1], ["a545", 3], ["drop", 1], ["silencer", 1], ["bag3", 1], ["elec", 3]] };
Object.assign(ENEMY, {
  armored: { n: "Бронированный заражённый", ic: "🛡️", spr: "soldier", hp: 60, dmg: [8, 12], sp: 1, acc: 0.55, arm: 5, inj: ["lacer", "bite", "bruise"], loot: "locker", xp: 12 },
  acid: { n: "Кислотник", ic: "🤢", spr: "swamper", hp: 30, dmg: [6, 10], sp: 1, acc: 0.6, inj: ["burn", "scratch"], noVirus: 1, xp: 9, acid: 1 },
  hunterN: { n: "Ночной охотник", ic: "🦇", spr: "runner", hp: 45, dmg: [10, 16], sp: 2, acc: 0.65, inj: ["lacer", "bite"], xp: 15, night: 1 },
  crawler: { n: "Ползун", ic: "🕷️", spr: "zombie", hp: 20, dmg: [4, 7], sp: 1, acc: 0.6, inj: ["scratch", "bite"], xp: 5 },
  warden: { n: "Надзиратель", ic: "⛓️", spr: "guard", hp: 170, dmg: [13, 20], sp: 1, acc: 0.6, arm: 5, inj: ["frac", "lacer", "bruise"], xp: 70, boss: 1, drop: [["vest2", 1], ["code3", 1]] },
  // главари группировок
  wolfboss: { n: "Вожак Серый", ic: "🐺", spr: "raider", hp: 130, dmg: [12, 18], sp: 1, acc: 0.65, arm: 3, human: 1, inj: ["bullet", "lacer"], xp: 50, boss: 1, noVirus: 1, gear: [["sawn", 1]], drop: [["wolfcloak", 1], ["cash", 6]] },
  stalkerboss: { n: "Меченый", ic: "☢️", spr: "raider", hp: 140, dmg: [12, 19], sp: 1, acc: 0.7, arm: 4, human: 1, inj: ["bullet", "lacer"], xp: 55, boss: 1, noVirus: 1, gear: [["ak", 1]], drop: [["marked", 1], ["detector", 1], ["drop", 1]] },
  deserterboss: { n: "Полковник", ic: "🎖️", spr: "soldier", hp: 160, dmg: [13, 20], sp: 1, acc: 0.7, arm: 5, human: 1, inj: ["bullet", "lacer"], xp: 60, boss: 1, noVirus: 1, gear: [["ak", 1]], drop: [["vest2", 1], ["bp_c4", 1], ["c4", 2]] },
  cultboss: { n: "Пророк Синего света", ic: "🔵", spr: "sci", hp: 170, dmg: [14, 22], sp: 1, acc: 0.65, arm: 3, human: 1, inj: ["burn", "lacer"], xp: 65, boss: 1, noVirus: 1, drop: [["staff", 1], ["serum", 2], ["crystal", 1]] }
});
const _enemyHitC = enemyHit;
enemyHit = function(e, ranged, near) {
  const D = ENEMY[e.id];
  if (D.acid && !ranged && G.eq.vest && ch(0.3)) {
    const v = G.eq.vest;
    v.acidN = (v.acidN || 0) + 1;
    cLog("🧪 Кислота разъедает ".concat(IT(v.id).n, "!"), "bad");
    if (v.acidN >= 6) {
      cLog("💥 ".concat(IT(v.id).n, " развалился от кислоты."), "bad");
      G.eq.vest = null;
    }
  }
  return _enemyHitC.apply(this, arguments);
};
const _armorC = armor;
armor = function() {
  let a = _armorC();
  if (G.eq.vest && G.eq.vest.acidN) a = Math.max(0, a - Math.floor(G.eq.vest.acidN / 2));
  return a;
};
Object.assign(LOCS, {
  wreck: {
    n: "Сухогруз «Пионер»",
    ic: "🚢",
    x: 5,
    y: 43,
    dg: 2,
    d: "Ржавый сухогруз сел на мель у западного берега. Часть трюма под водой.",
    links: { beach: 50 },
    fish: 1,
    water: "sea",
    rooms: [
      { n: "Палуба", cont: ["shore", "body"], en: [["drowned", 1, 2]] },
      { n: "Трюм", cont: ["milcrate", "backpack"], en: [["drowned", 1, 2], ["crawler", 0, 1]], dark: 1 },
      { n: "Затопленный отсек", cont: ["cargo", "cargo"], en: [["drowned", 1, 1]], lock: "scuba", dark: 1 },
      { n: "Капитанская каюта", cont: ["cabin", "desk"], en: [["runner", 0, 1]], fixed: { item: "code1", note: "n_wreck" } }
    ]
  },
  mine: {
    n: "Старая шахта",
    ic: "⛏️",
    x: 24,
    y: 40,
    dg: 2,
    zone: 1,
    d: "Заброшенная шахта в холмах. Темно, сыро, где-то капает. Говорят, шахтёры докопались до чего-то синего.",
    links: { forest: 50, lighthouse: 55 },
    rooms: [
      { n: "Вход в штольню", cont: ["toolbox", "body"], en: [["zombie", 1, 2]] },
      { n: "Штрек", cont: ["minecart", "minecart"], en: [["crawler", 1, 3]], dark: 1 },
      { n: "Забой", cont: ["minecart", "stash"], en: [["crawler", 1, 2], ["acid", 0, 1]], anom: 2, dark: 1, fixed: { item: "code2", note: "n_mine" } },
      { n: "Затопленный горизонт", cont: ["backpack", "body"], en: [["drowned", 1, 2]], dark: 1 }
    ]
  },
  prison: {
    n: "Тюрьма «Северная»",
    ic: "⛓️",
    x: 74,
    y: 40,
    dg: 3,
    d: "Колония строгого режима. Охрана ушла, заключённые остались — и обратились.",
    links: { post: 50, swamp: 60, farm: 75 },
    rooms: [
      { n: "КПП тюрьмы", cont: ["desk", "locker"], en: [["armored", 1, 1], ["zombie", 1, 2]] },
      { n: "Блок А", cont: ["locker", "locker", "body"], en: [["zombie", 2, 3], ["armored", 0, 1]], fixed: { item: "k_prison" } },
      { n: "Оружейка", cont: ["armory", "milcrate"], lock: "k_prison", en: [["armored", 1, 1]] },
      { n: "Кабинет начальника", cont: ["safe", "desk"], en: [["warden", 1, 1]], dark: 1, fixed: { note: "n_prison" } }
    ]
  }
});
LOCS.beach.links.wreck = 50;
LOCS.forest.links.mine = 50;
LOCS.lighthouse.links.mine = 55;
LOCS.post.links.prison = 50;
LOCS.swamp.links.prison = 60;
LOCS.farm.links.prison = 75;
LOCS.swamp.rooms[1].en.push(["acid", 0, 1]);
LOCS.post.rooms[1].en.push(["armored", 0, 1]);
LOCS.nii.rooms[0].en.push(["armored", 0, 1]);
Object.assign(NOTES, {
  n_wreck: { t: "Судовой журнал «Пионера»", x: "«Груз: оборудование для НИИ “Остров-7”. Получатель — в/ч … Капитан приказал не открывать контейнер №3. Он светится по ночам.»" },
  n_mine: { t: "Записка штейгера", x: "«На сорок втором метре порода синяя. Инженер из НИИ забрал образцы и велел завалить забой. Ребята, что спускались туда, по ночам говорят во сне на чужом языке.»" },
  n_prison: { t: "Рапорт начальника колонии", x: "«Заключённых использовали для испытаний сыворотки. Партия №4 не сработала. Прошу эвакуировать личный состав. Ответа нет.»" },
  n_c3: { t: "Перехват: «Северный»", x: "«…говорит спасательное судно “Северный”. Слышим ваш маяк. Чтобы войти в пролив, нужен код опознавания из трёх частей. Части у вас на острове: “Пионер”, “Штольня”, “Северная”…»" }
});
Object.assign(STRUCT, {
  gen: { n: "Генератор", ic: "⚡", lv: [{ n: "Нет" }, { n: "Бензиновый генератор", c: { scrap: 6, elec: 3, wire: 4, carpart: 1 } }] },
  fridge: { n: "Холодильник", ic: "🧊", need: "gen", lv: [{ n: "Нет" }, { n: "Холодильник", c: { scrap: 4, elec: 2, wire: 1 } }] },
  lights: { n: "Прожекторы", ic: "💡", need: "gen", def: [0, 15], lv: [{ n: "Нет" }, { n: "Прожекторы на крыше", c: { elec: 2, wire: 3, battery: 2, scrap: 2 } }] },
  stove: { n: "Кухонная плита", ic: "🍳", lv: [{ n: "Нет" }, { n: "Плита из бочки", c: { scrap: 5, planks: 2, wire: 1 } }] }
});
STRUCT.radio.lv.push({ n: "Мощный передатчик", c: { elec: 4, battery: 4, wire: 4, cshard: 2 }, ch3: 1 });
RECIPES.push(
  { id: "ukha", n: "Уха (тепло 8 ч)", need: { fish: 2, water: 1 }, out: { ukha: 1, bottle: 1 }, st: "stove", t: 40 },
  { id: "stew", n: "Рагу (сила 6 ч)", need: { meat: 1, veg: 1, water: 1 }, out: { stew: 1, bottle: 1 }, st: "stove", t: 45 },
  { id: "stew2", n: "Рагу с грибами (сила 6 ч)", need: { meat: 1, mushroom: 2, water: 1 }, out: { stew: 1, bottle: 1 }, st: "stove", t: 45 },
  { id: "pie", n: "Ягодный пирог (спокойствие 8 ч)", need: { berries: 3, crackers: 1 }, out: { pie: 1 }, st: "stove", t: 50 },
  { id: "tea", n: "Травяной чай (здоровье 8 ч)", need: { herbs: 2, water: 1 }, out: { tea: 1 }, st: "fire", t: 15 },
  { id: "jerky", n: "Вяленое мясо (не портится)", need: { meat: 2, wood: 1 }, out: { jerky: 2 }, st: "smoke", t: 60 },
  { id: "spikes", n: "Шипы для оружия", need: { nails: 10, wire: 1 }, out: { spikes: 1 }, st: "bench", t: 20 },
  { id: "grip", n: "Обмотка рукояти", need: { rag: 2, tape: 1 }, out: { grip: 1 }, t: 10 },
  { id: "bottlesil", n: "Глушитель из бутылки", need: { bottle: 1, tape: 2, rag: 1 }, out: { bottlesil: 1 }, st: "bench", bp: "mods", t: 20 },
  { id: "stockc", n: "Самодельный приклад", need: { planks: 2, tape: 2, nails: 4 }, out: { stock: 1 }, st: "bench2", bp: "mods", t: 40 }
);
const _stationOk = stationOk;
stationOk = function(st) {
  if (st === "stove") return atBase() && G.w.struct.stove > 0;
  return _stationOk(st);
};
STATION_N.stove = "кухонная плита";
const _canBuild = canBuild;
canBuild = function(id) {
  const S = STRUCT[id];
  if (S && S.need && !G.w.struct[S.need]) return "need";
  const nx = S && S.lv[(G.w.struct[id] || 0) + 1];
  if (nx && nx.ch3 && !G.w.flags.ch3) return "ch3";
  return _canBuild(id);
};
const powered = () => !!(G.w.struct.gen && (G.w.power || 0) > 0);
function genRefuel() {
  if (!G.w.struct.gen) return;
  const src = cnt(G.inv, "fuel") ? G.inv : cnt(G.stash, "fuel") ? G.stash : null;
  if (!src) return UI.toast("Нужна канистра бензина.");
  take(src, "fuel", 1);
  G.w.power = (G.w.power || 0) + 36;
  advance(5);
  SND("build");
  UI.log("⚡ Генератор заправлен: хватит на ~".concat(Math.round(G.w.power), " ч."), "good");
  UI.render();
}
function powerTick(st) {
  if (!powered() || !worldAuth()) return;
  const h = st / H;
  G.w.power = Math.max(0, G.w.power - h * (1 + (G.w.struct.fridge ? 0.2 : 0) + (G.w.struct.lights && isNight() ? 0.3 : 0)));
  if (G.w.struct.fridge) {
    for (const e of G.stash) if (IT(e.id).sp) e.born = (e.born || 0) + st * 0.8;
  }
  if (G.w.power <= 0) UI.log("⚡ Генератор заглох — кончился бензин.", "warn");
}
const _defenseC = defense;
defense = function() {
  return _defenseC() + (G.w.struct.lights && powered() ? 15 : 0);
};
const BUFFS = {
  warm: { n: "Согрет", ic: "🔥", h: 8, m: { cold: -0.6 } },
  strong: { n: "Сытая сила", ic: "💪", h: 6, m: { meleeDmg: 0.12, carry: 3 } },
  calm: { n: "Спокойствие", ic: "😌", h: 8, m: { stress: -0.5 } },
  healthy: { n: "Бодрость", ic: "🌿", h: 8, m: { ill: -0.5, heal: 0.2 } },
  alert: { n: "Бодрячок", ic: "☕", h: 6, m: { fatigue: -0.4, gunAcc: 0.03 } }
};
function addBuff(id) {
  const B = BUFFS[id];
  if (!B) return;
  G.ch.buffs = (G.ch.buffs || []).filter((b) => b.id !== id);
  G.ch.buffs.push({ id, until: G.time + B.h * H });
  UI.log("".concat(B.ic, " ").concat(B.n, " на ").concat(B.h, " ч."), "good");
}
const activeBuffs = () => (G && G.ch && G.ch.buffs || []).filter((b) => b.until > G.time && BUFFS[b.id]);
const _useItemC = useItem;
useItem = function(id) {
  const it = IT(id);
  const before = cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0);
  const r = _useItemC.apply(this, arguments);
  if (it && it.buff && cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0) < before) addBuff(it.buff);
  return r;
};
function weaponMods(w) {
  return w && w.mods || [];
}
function canMod(w, modId) {
  const it = IT(w.id), M = IT(modId).mod;
  if (!M) return false;
  if (M.gun && it.c !== "gun") return false;
  if (M.melee && it.c !== "melee") return false;
  return weaponMods(w).length < 2 && !weaponMods(w).includes(modId);
}
function installMod(modId) {
  const w = G.eq.weapon;
  if (!w || !canMod(w, modId) || !cnt(G.inv, modId)) return UI.toast("Этот модуль сюда не подходит (максимум 2 модуля).");
  take(G.inv, modId, 1);
  w.mods = [...weaponMods(w), modId];
  advance(10);
  xp("craft", 2);
  SND("craft");
  UI.log("🔧 На ".concat(IT(w.id).n, " установлен модуль: ").concat(IT(modId).ic, " ").concat(IT(modId).n, "."), "good");
  UI.render();
}
const _extraModC = extraMod;
extraMod = function(k) {
  let v = _extraModC(k);
  for (const b of activeBuffs()) if (BUFFS[b.id].m[k]) v += BUFFS[b.id].m[k];
  for (const id of weaponMods(G && G.eq && G.eq.weapon)) {
    const M = IT(id).mod;
    if (M && M.m[k]) v += M.m[k];
  }
  if (k === "stress" && atBase() && powered()) v -= 0.2;
  return v;
};
const CONTRACT_ITEMS = {
  semen: [["fish", 4], ["wood", 6], ["berries", 6], ["mushroom", 5], ["meat", 3], ["herbs", 4], ["planks", 4]],
  serg: [["a9", 15], ["scrap", 5], ["tape", 2], ["bandage", 3], ["knife", 1], ["bat", 1], ["canned", 3]],
  levin: [["herbs", 6], ["elec", 2], ["battery", 3], ["alcohol", 1], ["antisep", 1], ["bolts", 10]]
};
const CONTRACT_KILLS = { semen: ["zombie", "dog", "drowned"], serg: ["raider", "soldier", "bandit", "runner"], levin: ["sci", "pdog", "acid", "crawler"] };
function genContracts() {
  const out = {};
  for (const tr of ["semen", "serg", "levin"]) {
    const list = [];
    const [id, n] = pick(CONTRACT_ITEMS[tr]);
    list.push({ k: tr + day() + "a", type: "items", id, n, pay: Math.round(IT(id).v * n * 1.4 + 15) });
    if (ch(0.7)) {
      const en = pick(CONTRACT_KILLS[tr]);
      const n2 = R(3, 6);
      list.push({ k: tr + day() + "b", type: "kill", en, n: n2, pay: n2 * (ENEMY[en].xp + 6) });
    } else {
      const loc = pick(Object.keys(LOCS).filter((l) => l !== "base" && !LOCS[l].ch2 && LOCS[l].dg >= 1));
      list.push({ k: tr + day() + "c", type: "visit", loc, pay: 30 + LOCS[loc].dg * 25 });
    }
    out[tr] = list;
  }
  G.w.contracts = { day: day(), list: out, taken: {}, base: {} };
}
function contracts() {
  if (!G.w.contracts || G.w.contracts.day !== day()) {
    if (worldAuth()) genContracts();
    else return { list: {}, taken: {}, base: {} };
  }
  return G.w.contracts;
}
function contractTake(tr, c) {
  const C = contracts();
  C.taken[c.k] = "active";
  if (c.type === "kill") C.base[c.k] = (G.w.killsBy || {})[c.en] || 0;
  if (c.type === "visit") C.base[c.k] = 0;
  UI.log("📋 Взят заказ: ".concat(contractText(c)), "good");
  UI.render();
}
function contractProgress(c) {
  const C = contracts();
  if (c.type === "items") return Math.min(cnt(G.inv, c.id), c.n);
  if (c.type === "kill") return Math.min(((G.w.killsBy || {})[c.en] || 0) - (C.base[c.k] || 0), c.n);
  if (c.type === "visit") return C.base[c.k] ? 1 : 0;
  return 0;
}
const contractGoal = (c) => c.type === "visit" ? 1 : c.n;
function contractText(c) {
  return c.type === "items" ? "принести ".concat(IT(c.id).ic, " ").concat(IT(c.id).n, " ×").concat(c.n) : c.type === "kill" ? "упокоить ".concat(ENEMY[c.en].ic, " ").concat(ENEMY[c.en].n, " ×").concat(c.n) : "разведать ".concat(LOCS[c.loc].ic, " ").concat(LOCS[c.loc].n, " и вернуться");
}
function contractDone(tr, c) {
  const C = contracts();
  if (contractProgress(c) < contractGoal(c)) return;
  if (c.type === "items") take(G.inv, c.id, c.n);
  C.taken[c.k] = "done";
  G.money += c.pay;
  G.w.contractsDone = (G.w.contractsDone || 0) + 1;
  if (G.w.contractsDone % 3 === 0 && tr in G.w.rep) {
    G.w.rep[tr]++;
    UI.log("⭐ Репутация у ".concat(TRADERS[tr].n, " выросла."), "good");
  }
  if (ch(0.35)) {
    const bonus = pick(["bandage", "canned", "a9", "tape", "coffee", "grip"]);
    invAdd(G.inv, bonus, IT(bonus).c === "ammo" ? 8 : 1);
    UI.log("🎁 Сверху дали: ".concat(IT(bonus).ic, " ").concat(IT(bonus).n, "."), "good");
  }
  weekProgress("contracts", 1);
  SND("quest");
  FEED("📋 выполнил заказ ".concat(TRADERS[tr].n));
  UI.log("📋 Заказ выполнен: +".concat(c.pay, "₽."), "good");
  save();
  UI.render();
}
const _onKillC = onKill;
onKill = function(e) {
  G.w.killsBy = G.w.killsBy || {};
  G.w.killsBy[e.id] = (G.w.killsBy[e.id] || 0) + 1;
  weekProgress("kills", 1);
  if (ENEMY[e.id].boss) weekProgress("bosses", 1);
  return _onKillC.apply(this, arguments);
};
const WEEKLY = [
  { id: "kills", n: "Чистка острова", d: "Упокой 120 врагов", goal: 120, ic: "🔪" },
  { id: "hordes", n: "Кровавая неделя", d: "Переживи 2 Кровавые ночи", goal: 2, ic: "🌕" },
  { id: "raids", n: "Гроза лагерей", d: "Разграбь 3 лагеря или базы", goal: 3, ic: "💣" },
  { id: "fish", n: "Большой улов", d: "Поймай 40 рыб", goal: 40, ic: "🐟" },
  { id: "contracts", n: "Работяга", d: "Выполни 10 заказов торговцев", goal: 10, ic: "📋" },
  { id: "arts", n: "Охота за артефактами", d: "Достань 6 артефактов или горстей осколков", goal: 6, ic: "✨" },
  { id: "bosses", n: "Охотник на главарей", d: "Победи 2 босса", goal: 2, ic: "👑" }
];
const weekNo = () => Math.floor((Date.now() / 864e5 + 3) / 7);
const weekly = () => WEEKLY[weekNo() % WEEKLY.length];
function weekState() {
  let s0;
  try {
    s0 = JSON.parse(localStorage.getItem("moti3_week")) || {};
  } catch (e) {
    s0 = {};
  }
  if (s0.wk !== weekNo()) s0 = { wk: weekNo(), prog: 0, done: false };
  return s0;
}
function weekProgress(kind, n) {
  if (!G || weekly().id !== kind) return;
  const s0 = weekState();
  s0.prog += n;
  if (!s0.done && s0.prog >= weekly().goal) {
    s0.done = true;
    setTimeout(() => {
      invAdd(G.inv, pick(["serum", "medkit", "c4", "scope", "bag3"]), 1);
      G.money += 300;
      UI.event({ title: "🏆 Событие недели выполнено!", cls: "good", text: "".concat(weekly().ic, " ").concat(weekly().n, ": ").concat(weekly().d, ".\n\nНаграда: 300₽ и ценный ящик в рюкзаке."), choices: [{ t: "Отлично" }] });
      save();
    }, 0);
  }
  try {
    localStorage.setItem("moti3_week", JSON.stringify(s0));
  } catch (e) {
  }
  weekSubmit();
}
let weekT = 0;
function weekSubmit(force) {
  if (!window.FB || !FB.init || !force && Date.now() - weekT < 6e4) return;
  weekT = Date.now();
  FB.init().then(() => firebase.database().ref("d/week/".concat(weekNo(), "_").concat(FB.uid)).set({ name: G.ch.name, prog: weekState().prog, wk: weekNo(), at: Date.now() })).catch(() => {
  });
}
const WK = { list: null, busy: false };
function weekLoad() {
  if (!window.FB || !FB.init || WK.busy) return;
  WK.busy = true;
  FB.init().then(() => firebase.database().ref("d/week").get()).then((s) => {
    const o = [];
    s.forEach((c) => {
      const v = c.val();
      if (v && v.wk === weekNo()) o.push(v);
    });
    WK.list = o.sort((a, b) => b.prog - a.prog).slice(0, 10);
  }).catch(() => {
    WK.list = [];
  }).finally(() => {
    WK.busy = false;
    if (UI._st.tab === "jour") UI.render();
  });
}
const _doFishC = doFish;
doFish = function() {
  const b = cnt(G.inv, "fish");
  const r = _doFishC.apply(this, arguments);
  const d = cnt(G.inv, "fish") - b;
  if (d > 0) weekProgress("fish", d);
  return r;
};
const _grabArtC = grabArtifact;
grabArtifact = function() {
  const had = roomSt(G.room) && roomSt(G.room).art;
  const r = _grabArtC.apply(this, arguments);
  if (had && !(G.room != null && roomSt(G.room).art)) weekProgress("arts", 1);
  return r;
};
const FACTION_BOSS = { wolves: "wolfboss", stalkers: "stalkerboss", deserters: "deserterboss", cult: "cultboss" };
function bossRaid(k) {
  const F0 = FACTIONS[k], c = camps()[k], B = FACTION_BOSS[k];
  if (!B || c.dead) return;
  setAct("👑 идёт за главарём: ".concat(F0.n));
  G.room = null;
  advance(F0.mins);
  if (G.dead) return;
  const en = [mkEnemy(B), mkEnemy(F0.en), mkEnemy(F0.en)];
  en.forEach((e) => e.dist = 1);
  UI.log("👑 ".concat(ENEMY[B].ic, " ").concat(ENEMY[B].n, " встречает тебя лично."), "bad");
  startCombat(en, { road: true, onEnd: (r) => {
    advance(F0.mins);
    if (G.dead) return;
    G.loc = "base";
    G.traveling = false;
    if (r === "win") {
      c.dead = true;
      c.grudge = 0;
      raidStats().won++;
      FEED("👑 победил главаря ".concat(F0.n));
      UI.event({ title: "👑 ".concat(F0.n, " больше нет"), cls: "good", text: "".concat(ENEMY[B].n, " повержен. Без главаря группировка разбежалась — больше они не придут мстить. Трофеи главаря — у тебя в рюкзаке."), choices: [{ t: "Вернуться на базу" }] });
    } else UI.event({ title: "🏚️ Отступил", cls: "bad", text: "Главарь оказался не по зубам. Подготовься лучше.", choices: [{ t: "OK" }] });
    save();
    UI.go("loc");
  } });
}
const _raidDailyC = raidDaily;
raidDaily = function() {
  const c = camps();
  for (const k in c) if (c[k].dead) c[k].grudge = 0;
  return _raidDailyC.apply(this, arguments);
};
const _raidAfterC = raidAfter;
raidAfter = function(k, r, back) {
  if (r === "win") weekProgress("raids", 1);
  return _raidAfterC.apply(this, arguments);
};
Object.assign(QUESTS, {
  c3_radio: { g: "main", n: "Мощный передатчик", d: "Слабая рация не добивает до материка. Улучши радиостанцию на базе до мощного передатчика (электроника, батарейки, проволока, осколки кристалла).", type: "flag", flag: "radio2", rew: {}, next: "c3_codes" },
  c3_codes: { g: "main", n: "Код опознавания", d: "Судно «Северный» войдёт в пролив только по коду из трёх шифровок: на сухогрузе «Пионер» (каюта), в старой шахте (забой) и в тюрьме «Северная» (у Надзирателя).", type: "items", need: { code1: 1, code2: 1, code3: 1 }, rew: { xp: { surv: 20 } }, next: "c3_signal" },
  c3_signal: { g: "main", n: "Сигнал", d: "Передай код с базы (База → «📡 Передать код»). Потом продержись до прихода судна.", type: "flag", flag: "c3_sent", rew: {}, next: "c3_hold" },
  c3_hold: { g: "main", n: "Последняя ночь", d: "Судно придёт на рассвете. Остров не хочет тебя отпускать — продержись на базе.", type: "flag", flag: "c3_held", rew: { money: 1e3 } }
});
const ch3Ready = () => !G.w.flags.ch3 && (G.w.ending === "silence" || !!(G.w.ch2 && G.w.ch2.end));
function startCh3() {
  if (G.w.flags.ch3) return;
  G.w.flags.ch3 = true;
  G.w.quests.c3_radio = "active";
  addNote("n_c3");
  FEED("📡 начал Главу 3 «Большая земля»");
  UI.event({ title: "📡 Глава 3 · Большая земля", cls: "good", text: "Сквозь треск рации пробивается голос: спасательное судно «Северный» ищет выживших. Чтобы оно вошло в пролив, нужен код опознавания — три шифровки, спрятанные на острове.\n\nНовые места на карте: 🚢 сухогруз «Пионер» (у пляжа), ⛏️ старая шахта (за лесом), ⛓️ тюрьма «Северная» (у блокпоста).", choices: [{ t: "Начать" }] });
  save();
  UI.render();
}
function sendCode() {
  if (!(G.w.struct.radio >= 2) || G.w.flags.c3_sent || !atBase()) return;
  if (!(allCnt("code1") && allCnt("code2") && allCnt("code3")) && G.w.quests.c3_codes !== "done") return UI.toast("Нужны все три шифровки.");
  G.w.flags.c3_sent = true;
  G.w.c3At = day() * DAY + 5 * H;
  checkQuests();
  SND("radio");
  UI.event({ title: "📡 Код передан", cls: "good", text: "«Принято. Идём к вам. Будем у пристани на рассвете». Связь обрывается — и в ту же секунду с острова поднимается вой. Ночь будет тяжёлой: всё, что живёт на острове, идёт к твоей базе.\n\nОставайся на базе до рассвета.", choices: [{ t: "Держать оборону" }] });
  save();
  UI.render();
}
function ch3Tick() {
  if (!G.w.flags.c3_sent || G.w.flags.c3_held || G.w.c3Fight || G.time < (G.w.c3At || 1e15) - 6 * H) return;
  if (!worldAuth() && !atBase()) return;
  G.w.c3Fight = true;
  G.interrupt = true;
  setTimeout(ch3Siege, 60);
}
function ch3Siege() {
  if (!G || G.dead || G.w.flags.c3_held) return;
  const md = document.getElementById("modal");
  if (G.combat || G.traveling || md && md.children.length) return setTimeout(ch3Siege, 1500);
  if (atBase()) {
    const en = spawnList([["armored", 2, 2], ["hunterN", 1, 2], ["zombie", 3, 3]]);
    en.forEach((e, i) => e.dist = i < 3 ? 1 : 2);
    SND("horde");
    UI.log("🌑 Они пришли — всё, что живёт на острове.", "bad");
    startCombat(en, { road: true, onEnd: (r) => {
      if (r === "win") return ch3Dawn();
      G.w.c3Fight = false;
      G.w.c3At = G.time + DAY;
      save();
      UI.event({ title: "🌑 Ночь не кончилась", cls: "bad", text: "Тебе пришлось отступить. Судно не подойдёт к берегу, пока у базы враги. Передатчик снова ловит «Северный»: они придут следующим рассветом.", choices: [{ t: "Попробовать снова" }] });
    } });
  } else {
    G.w.c3Fight = false;
    G.w.c3At += DAY;
    save();
    UI.event({ title: "🚢 «Северный» ушёл", cls: "bad", text: "Тебя не было на базе. Судно ждало у пристани и ушло. Обещали вернуться завтра на рассвете — будь на базе к 23:00.", choices: [{ t: "Понял" }] });
  }
}
function ch3Dawn() {
  G.w.flags.c3_held = true;
  checkQuests();
  save();
  UI.event({ title: "🚢 Рассвет", cls: "good", text: "Из тумана выходит серый борт с красной полосой. С палубы машут. Семёныч стоит на пристани и не двигается.\n\n«Ну? Плывёшь? Или остаёшься — остров теперь без хозяина не может».", choices: [
    { t: "🚢 Уплыть на Большую землю", fn: () => ending3("leave") },
    { t: "🏝️ Остаться хранителем острова", fn: () => ending3("stay") }
  ] });
}
function ending3(choice) {
  G.w.flags.ch3_end = choice;
  G.w.c3Fight = false;
  const c = G.ch;
  FEED(choice === "leave" ? "🚢 уплыл на Большую землю" : "🏝️ остался хранителем острова");
  save();
  const txt = choice === "leave" ? "Остров уменьшается за кормой, пока не становится тёмной полоской на горизонте. На материке тебя ждут вопросы, карантин и чужая жизнь. Но иногда по ночам ты всё ещё слышишь, как гудит Аппарат.\n\nКонец истории." : "Ты машешь «Северному» вслед. Кто-то должен следить за аномалиями, кормить кота и встречать тех, кого выбросит море. Семёныч молча ставит чайник.\n\nОстров твой.";
  UI.event({ title: choice === "leave" ? "🚢 Большая земля" : "🏝️ Хранитель", cls: "good", text: txt + "\n\n".concat(c.name, " · дней на острове: ").concat(Math.floor((G.time - c.born) / DAY), " · врагов: ").concat(c.kills, "\n\nСпасибо, что прошёл «Mystery of the Island» до конца! Мир остаётся с тобой."), choices: [{ t: "Продолжить играть" }] });
}
const _tickC = tick;
tick = function(st, o) {
  _tickC.apply(this, arguments);
  if (G && !G.dead) {
    powerTick(st);
    ch3Tick();
  }
};
const _extNewDayC = extNewDay;
extNewDay = function() {
  _extNewDayC.apply(this, arguments);
  if (worldAuth()) contracts();
  if (ch3Ready() && worldAuth()) startCh3();
};
const _buildC = build;
build = function(id) {
  const lv = G.w.struct[id] || 0;
  const r = _buildC.apply(this, arguments);
  if (id === "radio" && (G.w.struct.radio || 0) >= 2 && lv < 2) {
    G.w.flags.radio2 = true;
    checkQuests();
  }
  return r;
};
const _extMigrateC = extMigrate;
extMigrate = function() {
  _extMigrateC.apply(this, arguments);
  for (const k of ["gen", "fridge", "lights", "stove"]) if (G.w.struct[k] == null) G.w.struct[k] = 0;
  if (G.w.power == null) G.w.power = 0;
  if (ch3Ready() && worldAuth()) setTimeout(() => {
    if (G && ch3Ready()) startCh3();
  }, 1500);
};
const _mkEnemyC = mkEnemy;
const _spawnListC = spawnList;
spawnList = function(spec) {
  const out = _spawnListC.apply(this, arguments);
  if (G && isNight() && !LOCS[G.loc].base && ch(0.1) && spec.some(([id]) => !ENEMY[id].boss && !ENEMY[id].human)) out.push(_mkEnemyC("hunterN"));
  return out;
};
const _hordeTickC = hordeTick;
hordeTick = function() {
  const d = day(), had = !!G.w.hordeDone[d];
  const r = _hordeTickC.apply(this, arguments);
  if (!had && G.w.hordeDone[d] && !G.dead) weekProgress("hordes", 1);
  return r;
};
const cesc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const CUI = {
  top() {
    const b = activeBuffs();
    if (!b.length && !(atBase() && powered())) return "";
    return '<div class="moods">'.concat(b.map((x) => '<span class="mood l0" title="ещё '.concat(Math.ceil((x.until - G.time) / H), ' ч">').concat(BUFFS[x.id].ic, " ").concat(BUFFS[x.id].n, "</span>")).join("")).concat(atBase() && powered() ? '<span class="mood l0">⚡ свет ('.concat(Math.round(G.w.power), " ч)</span>") : "", "</div>");
  },
  modBtn(e) {
    const w = G.eq.weapon;
    const ok = w && canMod(w, e.id);
    return UI.btn(ok ? "🔧 На ".concat(IT(w.id).n) : "🔧 Установить", () => installMod(e.id), "sm", !ok);
  },
  basePanel() {
    const b = UI.btn, s = G.w.struct;
    let h = "";
    if (s.gen) {
      h += '<div class="sec"><h2>⚡ Электричество</h2><p class="muted" style="font-size:13px">'.concat(powered() ? "Генератор гудит: топлива на ~".concat(Math.round(G.w.power), " ч.") : "Генератор молчит — нужен бензин.", " Свет на базе снимает стресс").concat(s.fridge ? ", холодильник бережёт еду на складе" : "").concat(s.lights ? ", прожекторы дают +15 к обороне" : "", '.</p><div class="acts">').concat(b("⛽ Заправить (+36 ч, есть ".concat(allCnt("fuel"), ")"), genRefuel, "sm", !allCnt("fuel")), "</div></div>");
    }
    if (G.w.flags.ch3 && !G.w.flags.c3_held) {
      const have = ["code1", "code2", "code3"].filter((x) => allCnt(x)).length;
      h += '<div class="sec"><h2>📡 Большая земля</h2><p class="muted" style="font-size:13px">'.concat(G.w.flags.c3_sent ? "Код передан. «Северный» будет на рассвете — продержись на базе с 23:00." : "Шифровки: ".concat(have, "/3 · передатчик: ").concat(s.radio >= 2 ? "мощный" : "слабый — улучши радиостанцию"), "</p>").concat(!G.w.flags.c3_sent ? '<div class="acts">'.concat(b("📡 Передать код", sendCode, "pri sm", !(s.radio >= 2 && (have === 3 || G.w.quests.c3_codes === "done"))), "</div>") : "", "</div>");
    }
    return h;
  },
  contracts(tid) {
    if (!CONTRACT_ITEMS[tid]) return "";
    const C = contracts(), list = C.list[tid] || [], b = UI.btn;
    let h = '<div class="sec"><h2>📋 Заказы на сегодня</h2><p class="muted" style="font-size:13px">Обновляются каждый день. Каждые 3 выполненных заказа — +1 к репутации.</p><div class="list">';
    if (!list.length) h += '<p class="muted">Заказов пока нет — загляни завтра.</p>';
    for (const c of list) {
      const stt = C.taken[c.k], pr = stt === "active" ? contractProgress(c) : 0, goal = contractGoal(c);
      h += '<div class="row '.concat(stt === "done" ? "dim" : "", '"><span class="ic">').concat(stt === "done" ? "✅" : "📋", '</span><div class="grow"><span class="t">').concat(cesc(contractText(c)), '</span><span class="s">💰 ').concat(c.pay, "₽").concat(stt === "active" ? " · прогресс ".concat(pr, "/").concat(goal) : "", "</span></div>").concat(!stt ? b("Взять", () => contractTake(tid, c), "sm") : stt === "active" ? b("Сдать", () => contractDone(tid, c), "sm pri", pr < goal) : "", "</div>");
    }
    return h + "</div></div>";
  },
  jour() {
    const W0 = weekly(), s0 = weekState(), b = UI.btn;
    if (!WK.list && !WK.busy && window.FB && FB.init) weekLoad();
    let h = '<div class="sec"><div class="sechead"><h2>🏆 Событие недели</h2>'.concat(window.FB && FB.init ? b(WK.busy ? "…" : "↻", () => {
      weekSubmit(true);
      setTimeout(weekLoad, 800);
    }, "sm") : "", "</div>");
    h += '<div class="row '.concat(s0.done ? "dim" : "", '"><span class="ic">').concat(W0.ic, '</span><div class="grow"><span class="t">').concat(W0.n, '</span><span class="s">').concat(W0.d, " · прогресс ").concat(Math.min(s0.prog, W0.goal), "/").concat(W0.goal).concat(s0.done ? " · ✅ награда получена" : " · награда: 300₽ и ценный ящик", "</span></div></div>");
    if (WK.list && WK.list.length) h += '<div class="list" style="gap:2px">'.concat(WK.list.map((p, i) => '<div class="lg" style="font-size:13px">'.concat(["🥇", "🥈", "🥉"][i] || i + 1 + ".", " ").concat(cesc(p.name), " — ").concat(p.prog, "</div>")).join(""), "</div>");
    h += "</div>";
    if (ch3Ready()) h += '<div class="sec"><h2>📡 Глава 3 «Большая земля»</h2><p class="muted">Рация ловит чужой голос. Может, это шанс уплыть с острова.</p><div class="acts">'.concat(b("Начать Главу 3", startCh3, "pri"), "</div></div>");
    return h;
  }
};
window.CUI = CUI;
const sameItem = (list, e) => {
  if (!e || !list) return null;
  if (list.indexOf(e) >= 0) return e;
  const k = JSON.stringify(Object.assign({}, e, { n: 0 }));
  return list.find((x) => JSON.stringify(Object.assign({}, x, { n: 0 })) === k) || list.find((x) => x.id === e.id && !x.dur && !e.dur);
};
const _toStashC = toStash, _fromStashC = fromStash;
toStash = function(e, n) {
  const x = sameItem(G.inv, e);
  if (!x) return UI.toast("Этой вещи уже нет в рюкзаке.");
  _toStashC(x, n ? Math.min(n, x.n) : 0);
  save();
  UI.render();
};
fromStash = function(e, n) {
  const x = sameItem(G.stash, e);
  if (!x) {
    UI.toast("Этой вещи уже нет на складе — её забрали.");
    return UI.render();
  }
  _fromStashC(x, n ? Math.min(n, x.n) : 0);
  save();
  UI.render();
};
const GROUND_LIFE = 3 * DAY;
drop = function(e, n) {
  const x = sameItem(G.inv, e);
  if (!x) return;
  const i = G.inv.indexOf(x), q = Math.min(n || x.n, x.n);
  const copy = Object.assign({}, x, { n: q, at: G.time });
  if (G.room != null) roomSt(G.room).ground.push(copy);
  else if (!G.traveling) {
    const L0 = G.w.locs[G.loc];
    (L0.ground = L0.ground || []).push(copy);
  }
  x.n -= q;
  if (x.n <= 0) G.inv.splice(i, 1);
  UI.log("⬇️ Оставил на земле: ".concat(IT(x.id).ic, " ").concat(IT(x.id).n).concat(q > 1 ? " ×" + q : "", ". Пролежит ~3 дня."));
  save();
  UI.render();
};
function takeLocGround(k) {
  const L0 = G.w.locs[G.loc], g = L0.ground || [];
  const e = g[k];
  if (!e) return;
  const c = Object.assign({}, e);
  delete c.at;
  G.inv.push(c);
  g.splice(k, 1);
  SND("pickup");
  save();
  UI.render();
}
function takeAllLocGround() {
  const L0 = G.w.locs[G.loc];
  for (const e of L0.ground || []) {
    const c = Object.assign({}, e);
    delete c.at;
    G.inv.push(c);
  }
  L0.ground = [];
  SND("pickup");
  save();
  UI.render();
}
function groundDecay() {
  let gone = 0;
  const f = (list) => (list || []).filter((e) => {
    if (e.at == null) e.at = G.time;
    if (G.time - e.at < GROUND_LIFE) return true;
    gone++;
    return false;
  });
  for (const id in G.w.locs) {
    const L0 = G.w.locs[id];
    if (L0.ground) L0.ground = f(L0.ground);
    (L0.rooms || []).forEach((r) => {
      if (r.ground) r.ground = f(r.ground);
    });
  }
  return gone;
}
const _takeGroundC = takeGround;
takeGround = function(k) {
  const s = roomSt(G.room), e = s.ground[k];
  if (e) delete e.at;
  return _takeGroundC.apply(this, arguments);
};
const _takeAllGroundC = takeAllGround;
takeAllGround = function() {
  roomSt(G.room).ground.forEach((e) => delete e.at);
  return _takeAllGroundC.apply(this, arguments);
};
const NEVER_AUTO = ["seawater", "vodka"];
function foodState(e) {
  const it = IT(e.id);
  const spoiled = it.sp && F().spoil && freshness(e) >= 1;
  return { raw: !!it.raw, spoiled, bad: !!it.raw || spoiled };
}
function eatPool(kind) {
  const pool = atBase() ? G.inv.concat(G.stash) : G.inv.slice();
  return pool.filter((e) => {
    const it = IT(e.id);
    if (it.smoke || NEVER_AUTO.includes(e.id) || it.salt) return false;
    return kind === "drink" ? it.c === "drink" && (it.d || 0) > 0 : it.c === "food" && (it.f || 0) > 0;
  });
}
const eatOrder = (a, b) => {
  const fa = IT(a.id).sp && F().spoil ? freshness(a) : -1, fb = IT(b.id).sp && F().spoil ? freshness(b) : -1;
  return fb - fa || IT(a.id).v - IT(b.id).v;
};
function consumeEntry(e) {
  const inInv = G.inv.indexOf(e) >= 0, list = inInv ? G.inv : G.stash;
  if (!inInv && G.inv.some((x) => x.id === e.id)) {
    const i2 = list.indexOf(e);
    list.splice(i2, 1);
    const one = Object.assign({}, e, { n: 1 });
    if (e.n > 1) list.splice(i2, 0, Object.assign({}, e, { n: e.n - 1 }));
    G.inv.unshift(one);
    return useItem(e.id);
  }
  const i = list.indexOf(e);
  if (i > 0) {
    list.splice(i, 1);
    list.unshift(e);
  }
  return useItem(e.id);
}
function autoEat(allowBad) {
  const c = G.ch, eaten = [];
  const gain = (e, kind) => Math.max(0, kind === "drink" ? IT(e.id).d || 0 : IT(e.id).f || 0);
  const urgent = (e) => IT(e.id).sp && F().spoil && freshness(e) >= 0.7 && freshness(e) < 1;
  function pickFor(kind) {
    const need = 100 - (kind === "drink" ? c.drink : c.food);
    const ok = eatPool(kind).filter((e) => (allowBad || !foodState(e).bad) && gain(e, kind) > 0 && (urgent(e) || gain(e, kind) <= Math.max(need + 8, need * 2)));
    ok.sort((a, b) => urgent(b) - urgent(a) || eatOrder(a, b) || gain(b, kind) - gain(a, kind));
    return ok[0] || null;
  }
  for (let k = 0; k < 40 && !G.dead; k++) {
    const order = c.drink <= c.food ? ["drink", "food"] : ["food", "drink"];
    let e = null, kind = null;
    for (const kd of order) {
      if ((kd === "drink" ? c.drink : c.food) >= 92) continue;
      e = pickFor(kd);
      if (e) {
        kind = kd;
        break;
      }
    }
    if (!e) break;
    const it = IT(e.id), before = c.food + c.drink;
    consumeEntry(e);
    eaten.push(it.ic);
    if (c.food + c.drink <= before - 0.5 && !it.raw) break;
  }
  const left = [], fitsNeed = (e, kd) => {
    const nd = 100 - (kd === "drink" ? c.drink : c.food);
    return gain(e, kd) > 0 && gain(e, kd) <= Math.max(nd + 8, nd * 2);
  };
  if (c.food < 92) left.push("food");
  if (c.drink < 92) left.push("drink");
  const goodBig = left.some((kd) => eatPool(kd).some((e) => !foodState(e).bad && !fitsNeed(e, kd)));
  const badLeft = left.flatMap((kd) => eatPool(kd).filter((e) => foodState(e).bad && fitsNeed(e, kd)));
  const hasGoodFit = left.some((kd) => eatPool(kd).some((e) => !foodState(e).bad && fitsNeed(e, kd)));
  if (eaten.length) UI.log("🍽️ Подкрепился: ".concat(eaten.join(" "), ". Сытость ").concat(Math.round(c.food), ", вода ").concat(Math.round(c.drink), "."), "good");
  if (!allowBad && left.length && badLeft.length && !hasGoodFit && !goodBig) {
    const names = [...new Set(badLeft.map((e) => "".concat(IT(e.id).ic, " ").concat(IT(e.id).n).concat(foodState(e).spoiled ? " (испорчено)" : IT(e.id).c === "drink" ? " (грязная)" : " (сырое)")))].slice(0, 5).join(", ");
    UI.event({ title: "🍽️ Нормальная еда кончилась", cls: "bad", text: "".concat(eaten.length ? "Всё нормальное съедено. " : "", "Осталось только рискованное: ").concat(names, ".\n\nСырое и испорченное может вызвать отравление или заражение. Есть всё равно?"), choices: [{ t: "⚠️ Всё равно съесть", fn: () => autoEat(true) }, { t: "Не надо" }] });
  } else if (goodBig && left.length) UI.toast("".concat(eaten.length ? "Почти сыт. " : "", "Оставшаяся ").concat(left.includes("food") ? "еда" : "вода", " слишком сытная — бережём на потом."));
  else if (!eaten.length) UI.toast(left.length ? "Нечего ".concat(left.length > 1 ? "есть и пить" : left[0] === "food" ? "есть" : "пить", ".") : "Ты и так сыт и напоен.");
  save();
  UI.render();
}
const _extNewDayG = extNewDay;
extNewDay = function() {
  _extNewDayG.apply(this, arguments);
  if (worldAuth()) groundDecay();
};
CUI.ground = function() {
  if (G.room != null || G.traveling) return "";
  const g = G.w.locs[G.loc] && G.w.locs[G.loc].ground || [];
  if (!g.length) return "";
  const b = UI.btn;
  let h = '<div class="sec"><div class="sechead"><h2>⬇️ На земле</h2>'.concat(g.length > 1 ? b("Забрать всё", takeAllLocGround, "sm") : "", '</div><div class="list">');
  g.forEach((e, k) => {
    const left = Math.max(1, Math.ceil((GROUND_LIFE - (G.time - (e.at || G.time))) / H));
    h += '<div class="row">'.concat(ART.tile(e.id), '<div class="grow"><span class="t">').concat(cesc(IT(e.id).n)).concat(e.n > 1 ? " ×" + e.n : "", '</span><span class="s">растащат через ~').concat(left >= 24 ? Math.round(left / 24) + " дн." : left + " ч", "</span></div>").concat(b("Взять", () => takeLocGround(k), "sm pri"), "</div>");
  });
  return h + "</div></div>";
};
const _cuiTop = CUI.top;
CUI.top = function() {
  const c = G.ch;
  const btnE = (c.food < 85 || c.drink < 85) && !G.combat ? '<div class="acts" style="margin-top:4px">'.concat(UI.btn("🍽️ Поесть и попить досыта", () => autoEat(false), "sm"), "</div>") : "";
  return _cuiTop() + btnE;
};
function stackable(e) {
  const it = IT(e.id);
  return !(e.dur != null && it.dur) && !(e.uses != null && it.uses) && !["melee", "gun", "wear", "art"].includes(it.c) && !(e.mods && e.mods.length);
}
function normList(list) {
  if (!Array.isArray(list)) return list;
  const out = [], idx = {};
  for (const e of list) {
    if (!e || !e.id || !ITEMS[e.id]) {
      if (e) out.push(e);
      continue;
    }
    delete e.at;
    delete e._giving;
    if (!stackable(e)) {
      out.push(e);
      continue;
    }
    const it = IT(e.id), perish = it.sp && F().spoil;
    const k = e.id + (perish ? "@" + Math.floor((e.born || 0) / H) : "");
    if (idx[k] != null) {
      const t = out[idx[k]];
      t.n = (t.n || 1) + (e.n || 1);
      if (perish) t.born = Math.min(t.born || 0, e.born || 0);
    } else {
      if (!perish) delete e.born;
      idx[k] = out.length;
      out.push(e);
    }
  }
  list.length = 0;
  out.forEach((x) => list.push(x));
  return list;
}
const _saveN = window.save;
window.save = function() {
  try {
    if (typeof G !== "undefined" && G && !G.dead) {
      normList(G.inv);
      if (!G.coop) normList(G.stash);
    }
  } catch (e) {
  }
  return _saveN.apply(this, arguments);
};
const SIDE = { l: "", r: "" };
const hm = (t) => "".concat(String(Math.floor(t % DAY / H)).padStart(2, "0"), ":").concat(String(Math.floor(t % H)).padStart(2, "0"));
function sideWarnings() {
  const w = [], c = G.ch;
  if (emissionSoon()) {
    const L0 = emLocal();
    const left = Math.max(0, Math.round(L0.ack == null ? Math.max(G.em.next - G.time, emGrace()) : emDue() - G.time));
    w.push('<div class="alert">🔴 Выброс через ~'.concat(left, " мин").concat(inShelter() ? " · ты в укрытии" : " · беги в укрытие!", "</div>"));
  }
  if (isBloodNight()) w.push('<div class="alert">🌕 Кровавая ночь!</div>');
  else if (day() % BNP() === 0) w.push('<div class="ln bad">🌕 Сегодня в 22:00 Кровавая ночь — будь на базе</div>');
  if (G.w.raidIncoming) w.push('<div class="ln bad">⚔️ Налёт на базу ≈23:00 ('.concat(cesc(FACTIONS[G.w.raidIncoming.camp].n), ")</div>"));
  if (G.w.flags.c3_sent && !G.w.flags.c3_held) w.push('<div class="ln warn">🚢 Ночь осады: будь на базе с 23:00</div>');
  try {
    for (const m of moodles()) if (m.l >= 2) w.push('<div class="ln '.concat(m.l >= 3 ? "bad" : "warn", '">').concat(m.ic, " ").concat(cesc(m.n)).concat(m.d ? " — " + cesc(m.d) : "", "</div>"));
  } catch (e) {
  }
  if (isNight() && !inShelter() && !G.traveling) w.push('<div class="ln warn">🌙 Ночь под открытым небом — опасно</div>');
  return w;
}
function sideLeft() {
  const w = sideWarnings();
  let h = (typeof meCard === "function" && uiWide() ? meCard() : "") + '<div class="card"><h3>⚠️ Важно</h3>'.concat(w.length ? w.join("") : '<div class="ln mono">Всё спокойно</div>', "</div>");
  const lg = (G.log || []).slice(-60).reverse();
  h += '<div class="card"><h3>📜 Последнее</h3>'.concat(lg.map((x) => '<div class="ln '.concat(x.c || "", '"><span class="mono">').concat(x.k || "", "</span> ").concat(cesc(x.t), "</div>")).join("") || '<div class="ln mono">пусто</div>', "</div>");
  return h;
}
function sideRight() {
  let h = "";
  if (G.coop && window.COOP) {
    const ps = COOP.others();
    h += '<div class="card"><h3>🤝 Отряд</h3>'.concat(ps.length ? ps.map((p) => {
      var _a, _b, _c;
      return '<div class="tm"><div><b>'.concat(cesc(p.name || "?"), "</b> ").concat(!p.online ? "💤" : p.alive === false ? "☠️" : p.combat ? "⚔️" : "", '<br><span class="mono">').concat(p.loc && LOCS[p.loc] ? LOCS[p.loc].ic + " " + cesc(LOCS[p.loc].n) : "").concat(p.room ? " · " + cesc(p.room) : "", '</span><br><span class="mono">').concat(cesc(p.act || ""), '</span></div><div class="mono" style="text-align:right;white-space:nowrap">❤️').concat((_a = p.hp) != null ? _a : "?", "<br>🍗").concat((_b = p.food) != null ? _b : "?", " 💧").concat((_c = p.drink) != null ? _c : "?", "</div></div>");
    }).join("") : '<div class="ln mono">друзей пока нет</div>', "</div>");
  }
  const act = Object.entries(G.w.quests || {}).filter(([k, v]) => v === "active" && QUESTS[k]).slice(0, 6);
  if (act.length) h += '<div class="card"><h3>📌 Задания</h3>'.concat(act.map(([k]) => {
    let pr = "";
    try {
      pr = String(questProgress(k) || "");
      if (/^[\s–—-]*$/.test(pr)) pr = "";
    } catch (e) {
    }
    return '<div class="ln">'.concat(QUESTS[k].g === "main" ? "⭐" : (TRADERS[QUESTS[k].g] || {}).ic || "•", " ").concat(cesc(QUESTS[k].n)).concat(pr ? ' <span class="mono">'.concat(cesc(pr), "</span>") : "", "</div>");
  }).join(""), "</div>");
  const C = G.w.contracts;
  if (C && C.day === day()) {
    const live = [];
    for (const tr in C.list) for (const c of C.list[tr]) if (C.taken[c.k] === "active") live.push('<div class="ln">📋 '.concat(cesc(contractText(c)), ' <span class="mono">').concat(contractProgress(c), "/").concat(contractGoal(c), "</span></div>"));
    if (live.length) h += '<div class="card"><h3>📋 Заказы</h3>'.concat(live.join(""), "</div>");
  }
  const info = [];
  if (G.w.struct.radio && G.em.next - G.time < 30 * DAY) info.push("📻 Выброс: день ".concat(Math.floor(G.em.next / DAY) + 1, ", ").concat(hm(G.em.next)));
  const nb = day() % BNP() === 0 ? day() : day() + (BNP() - day() % BNP());
  info.push("🌕 Кровавая ночь: день ".concat(nb));
  if (G.w.struct.gen) info.push("⚡ Генератор: ".concat(Math.round(G.w.power || 0), " ч топлива"));
  const bf = activeBuffs();
  if (bf.length) info.push(bf.map((b) => "".concat(BUFFS[b.id].ic, " ").concat(BUFFS[b.id].n, " ").concat(Math.ceil((b.until - G.time) / H), " ч")).join(" · "));
  h += '<div class="card"><h3>🧭 Сводка</h3>'.concat(info.map((x) => '<div class="ln">'.concat(x, "</div>")).join(""), "</div>");
  return h;
}
function sideRender() {
  if (!uiWide() || SLAY.drag) return;
  const L0 = document.getElementById("sideL"), R0 = document.getElementById("sideR");
  if (!L0 || !R0) return;
  let l = "", r = "";
  try {
    if (typeof G !== "undefined" && G && G.ch && !G.dead) {
      l = sideLeft();
      r = sideRight();
    }
  } catch (e) {
    l = "";
    r = "";
  }
  const key = l + "" + r + "" + JSON.stringify(UIP.lay || {});
  if (key === SIDE.l) return;
  SIDE.l = key;
  const [hl, hr] = sideLayout(l, r);
  sideBox(L0, "l").innerHTML = noEmo(hl);
  sideBox(R0, "r").innerHTML = noEmo(hr);
  sideWidth();
}
if (typeof document !== "undefined" && typeof setInterval === "function") {
  setInterval(sideRender, 1e3);
  window.addEventListener("resize", sideRender);
}
function fullRest() {
  if (!atBase()) return UI.toast("Полный отдых — только на базе.");
  if (G.combat) return;
  const c = G.ch, t0 = G.time, e0 = c.energy;
  if (c.food < 92 || c.drink < 92) autoEat(false);
  if (G.dead || G.combat) return;
  if (c.energy < 99) sleepHere(12, true);
  if (G.dead || G.combat) return;
  if (c.food < 92 || c.drink < 92) autoEat(false);
  const hrs = Math.round((G.time - t0) / 6) / 10;
  UI.log("🛌 Отдохнул".concat(hrs ? " (".concat(hrs, " ч)") : "", ": выносливость ").concat(Math.round(e0), " → ").concat(Math.round(c.energy), ", сытость ").concat(Math.round(c.food), ", вода ").concat(Math.round(c.drink), "."), "good");
  save();
  UI.render();
}
const _cuiBase = CUI.basePanel;
CUI.basePanel = function() {
  const c = G.ch, need = c.energy < 99 || c.food < 92 || c.drink < 92;
  return '<div class="sec"><div class="acts">'.concat(UI.btn("🛌 Полностью отдохнуть", fullRest, "pri", !need), '</div><p class="muted" style="font-size:12.5px;margin:4px 0 0">Поесть и попить досыта (экономно), выспаться до полной выносливости и снова подкрепиться.').concat(G.coop ? " Общее время пойдёт вперёд и у друга." : "", "</p></div>") + _cuiBase.apply(this, arguments);
};
function stLog(act, id, n) {
  if (!n) return;
  const e = { who: G.ch.name, act, id, n, d: day(), k: clock(), at: Date.now() };
  if (G.coop && window.COOP && COOP.logStash) COOP.logStash(e);
  else {
    G.w.stashLog = (G.w.stashLog || []).concat([e]).slice(-60);
  }
}
const stashLogList = () => (G.coop && window.COOP && COOP.stashLog ? COOP.stashLog : G.w.stashLog) || [];
const cntAll = (list, id) => list.filter((x) => x.id === id).reduce((a, x) => a + (x.n || 1), 0);
const _toStashL = toStash, _fromStashL = fromStash;
toStash = function(e, n) {
  const id = e && e.id, b = id ? cntAll(G.stash, id) : 0;
  const r = _toStashL.apply(this, arguments);
  if (id) stLog("+", id, cntAll(G.stash, id) - b);
  return r;
};
fromStash = function(e, n) {
  const id = e && e.id, b = id ? cntAll(G.stash, id) : 0;
  const r = _fromStashL.apply(this, arguments);
  if (id) stLog("−", id, b - cntAll(G.stash, id));
  return r;
};
const _stashAllC = stashAllMats;
stashAllMats = function() {
  const before = {};
  for (const e of G.stash) before[e.id] = (before[e.id] || 0) + e.n;
  const L0 = stLog;
  let moved = [];
  stLog = (a, id, n) => {
    if (n) moved.push("".concat(IT(id).ic).concat(n));
  };
  try {
    _stashAllC.apply(this, arguments);
  } finally {
    stLog = L0;
  }
  if (moved.length) {
    const e = { who: G.ch.name, act: "+", id: null, txt: moved.join(" "), n: moved.length, d: day(), k: clock(), at: Date.now() };
    if (G.coop && window.COOP && COOP.logStash) COOP.logStash(e);
    else G.w.stashLog = (G.w.stashLog || []).concat([e]).slice(-60);
  }
  save();
  UI.render();
};
const BAK = { list: null, busy: false, msg: "" };
function soloBackup() {
  try {
    localStorage.setItem("moti3_bak".concat(SAVE_SLOT, "_").concat(day() % 3), JSON.stringify({ day: day(), at: Date.now(), g: JSON.stringify(G) }));
  } catch (e) {
  }
}
function soloBackups() {
  const out = [];
  for (let i = 0; i < 3; i++) {
    try {
      const v = JSON.parse(localStorage.getItem("moti3_bak".concat(SAVE_SLOT, "_").concat(i)) || "null");
      if (v) out.push({ slot: i, day: v.day, at: v.at });
    } catch (e) {
    }
  }
  return out.sort((a, b) => b.day - a.day);
}
function soloRestore(slot) {
  try {
    const v = JSON.parse(localStorage.getItem("moti3_bak".concat(SAVE_SLOT, "_").concat(slot)));
    const g = JSON.parse(v.g);
    if (g && g.v === 3) {
      G = g;
      migrate();
      save();
      UI.toast("🗂️ Откат к началу дня ".concat(v.day));
      UI.go("loc");
    }
  } catch (e) {
    UI.toast("Копия повреждена.");
  }
}
const _extNewDayB = extNewDay;
extNewDay = function() {
  _extNewDayB.apply(this, arguments);
  if (G.coop && window.COOP) {
    if (worldAuth()) COOP.backup(day());
  } else soloBackup();
};
const MARKS = [["💰", "Лут"], ["☠️", "Опасно"], ["👑", "Босс"], ["🏃", "Иди сюда"], ["🏕️", "Лагерь"], ["❓", "Проверить"]];
function addMark(loc, ic, txt) {
  G.w.marks = (G.w.marks || []).filter((m) => !(m.loc === loc && m.ic === ic)).concat([{ id: Date.now() % 1e9, loc, ic, txt, by: G.ch.name, t: G.time }]).slice(-30);
  save();
  UI.render();
}
function delMark(id) {
  G.w.marks = (G.w.marks || []).filter((m) => m.id !== id);
  save();
  UI.render();
}
const liveMarks = () => (G.w.marks || []).filter((m) => G.time - m.t < 3 * DAY);
CUI.markNode = function(id, l) {
  const ms = liveMarks().filter((m) => m.loc === id);
  return ms.length ? '<text x="'.concat(l.x + 4.6, '" y="').concat(l.y - 3, '" style="font-size:3.4px">').concat(ms.map((m) => m.ic).join(""), "</text>") : "";
};
CUI.markCard = function(loc) {
  const ms = liveMarks().filter((m) => m.loc === loc), b = UI.btn;
  return '<div class="sec"><h3>📍 Метки</h3>'.concat(ms.map((m) => '<div class="row"><span class="ic">'.concat(m.ic, '</span><div class="grow"><span class="t">').concat(cesc(m.txt), '</span><span class="s">').concat(cesc(m.by), " · ").concat(Math.max(1, Math.round((G.time - m.t) / H)), " ч назад</span></div>").concat(b("✕", () => delMark(m.id), "sm"), "</div>")).join(""), '<div class="acts">').concat(MARKS.map(([ic, t]) => b("".concat(ic, " ").concat(t), () => addMark(loc, ic, t), "sm")).join(""), "</div></div>");
};
function addTodo() {
  const el = document.getElementById("todoin");
  const t = el && el.value.trim().slice(0, 80);
  if (!t) return;
  G.w.todo = (G.w.todo || []).concat([{ id: Date.now() % 1e9, t, by: G.ch.name, who: null, done: false }]).slice(-25);
  el.value = "";
  save();
  UI.render();
}
function todoSet(id, f) {
  G.w.todo = (G.w.todo || []).map((x) => x.id === id ? Object.assign({}, x, f(x)) : x);
  save();
  UI.render();
}
function todoDel(id) {
  G.w.todo = (G.w.todo || []).filter((x) => x.id !== id);
  save();
  UI.render();
}
function todoHtml() {
  const b = UI.btn, list = G.w.todo || [];
  return '<div class="sec"><h2>📝 '.concat(G.coop ? "Дела отряда" : "Мои дела", '</h2><div class="list">').concat(list.map((x) => '<div class="row '.concat(x.done ? "dim" : "", '"><span class="ic">').concat(x.done ? "✅" : x.who ? "🙋" : "▫️", '</span><div class="grow"><span class="t">').concat(x.done ? "<s>" + cesc(x.t) + "</s>" : cesc(x.t), '</span><span class="s">').concat(cesc(x.by)).concat(x.who ? " · взял " + cesc(x.who) : "", "</span></div>").concat(!x.done && !x.who && G.coop ? b("Беру", () => todoSet(x.id, () => ({ who: G.ch.name })), "sm") : "").concat(b(x.done ? "↺" : "✓", () => todoSet(x.id, (y) => ({ done: !y.done })), "sm")).concat(b("✕", () => todoDel(x.id), "sm"), "</div>")).join("") || '<p class="muted">Пусто. Например: «10 гвоздей на стены», «сходить в НИИ вдвоём».</p>', '</div><div class="acts"><input id="todoin" type="text" maxlength="80" placeholder="Новое дело…" style="flex:1;min-width:150px">').concat(b("Добавить", addTodo, "sm pri"), "</div></div>");
}
function stashLogHtml() {
  const l = stashLogList().slice(-25).reverse();
  return '<div class="sec"><h2>🧾 Журнал склада</h2>'.concat(l.length ? '<div class="list" style="gap:2px">'.concat(l.map((x) => '<div class="lg" style="font-size:13px"><span class="mono muted">Д'.concat(x.d, " ").concat(x.k, "</span> <b>").concat(cesc(x.who), "</b> ").concat(x.act === "+" ? '<span class="good">положил</span>' : '<span class="bad">взял</span>', " ").concat(x.id ? "".concat(IT(x.id).ic, " ").concat(cesc(IT(x.id).n)).concat(x.n > 1 ? " ×" + x.n : "") : cesc(x.txt || ""), "</div>")).join(""), "</div>") : '<p class="muted">Пока пусто.</p>', "</div>");
}
function backupsHtml() {
  const b = UI.btn, coop = G.coop && window.COOP;
  if (coop && !BAK.list && !BAK.busy) {
    BAK.busy = true;
    COOP.listBackups().then((l) => {
      BAK.list = l;
    }).finally(() => {
      BAK.busy = false;
      UI.render();
    });
  }
  const list = coop ? BAK.list || [] : soloBackups(), canRestore = !coop || COOP.host === COOP.uid;
  return '<div class="sec"><div class="sechead"><h2>🗂️ Резервные копии</h2>'.concat(coop ? b("↻", () => {
    BAK.list = null;
    UI.render();
  }, "sm") : "", '</div><p class="muted" style="font-size:13px">Мир сохраняется сам каждое утро (').concat(coop ? "5 последних дней, общий мир — откатывает только хозяин" : "3 последних дня", ").").concat(coop ? " Время не откатывается, только база, склад, сюжет и локации." : "", '</p><div class="list">').concat(list.map((x) => '<div class="row"><span class="ic">🗂️</span><div class="grow"><span class="t">Начало дня '.concat(x.day, '</span><span class="s">').concat(new Date(x.at).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })).concat(x.by ? " · " + cesc(x.by) : "", "</span></div>").concat(canRestore ? b("Откатить", () => UI.event({ title: "🗂️ Откатить к дню ".concat(x.day, "?"), cls: "bad", text: coop ? "База, склад, сюжет и локации общего мира вернутся к этой копии — у всех игроков. Рюкзаки игроков не меняются." : "Всё, что было после этой копии, пропадёт.", choices: [{ t: "🗂️ Откатить", fn: () => coop ? COOP.restore(x.slot).then((err) => UI.toast(err || "Мир откатан.")) : soloRestore(x.slot) }, { t: "Отмена" }] }), "sm") : "", "</div>")).join("") || '<p class="muted">'.concat(BAK.busy ? "Загружаю…" : "Копий пока нет — первая появится утром.", "</p>"), "</div></div>");
}
const _cuiJour = CUI.jour;
CUI.jour = function() {
  return todoHtml() + _cuiJour.apply(this, arguments) + backupsHtml();
};
function openSummary() {
  let d = document.getElementById("sumsheet");
  if (!d) {
    d = document.createElement("div");
    d.id = "sumsheet";
    document.body.appendChild(d);
  }
  const draw = () => {
    if (!document.getElementById("sumsheet")) return;
    d.innerHTML = '<div class="sumbox"><div class="sechead"><h2>🧭 Сводка</h2><button class="btn sm" onclick="closeSummary()">✕</button></div>'.concat(sideLeft()).concat(sideRight(), "</div>");
  };
  draw();
  d.onclick = (ev) => {
    if (ev.target === d) closeSummary();
  };
  d._t = setInterval(draw, 1500);
}
function closeSummary() {
  const d = document.getElementById("sumsheet");
  if (d) {
    clearInterval(d._t);
    d.remove();
  }
}
window.closeSummary = closeSummary;
window.openSummary = openSummary;
const _cuiTop2 = CUI.top;
CUI.top = function() {
  let h = _cuiTop2.apply(this, arguments);
  if (uiWide()) return h;
  const sb = UI.btn("🧭 Сводка", openSummary, "sm");
  return /<\/div>$/.test(h) && h.includes("досыта") ? h.replace(/<\/div>$/, sb + "</div>") : h + '<div class="acts" style="margin-top:4px">'.concat(sb, "</div>");
};
CUI.stashLog = () => stashLogHtml();
Object.assign(ITEMS, {
  snare: { n: "Силок", ic: "🪤", c: "tool", w: 0.3, v: 12, info: "Поставь в лесу, на ферме или болоте — через 8 ч проверь." },
  balm: { n: "Согревающая мазь", ic: "🫙", c: "med", w: 0.1, v: 25, info: "Снимает обморожение и согревает на 8 ч." },
  iv: { n: "Самодельная капельница", ic: "💉", c: "med", w: 0.4, v: 60, info: "Восстанавливает все части тела и сбивает болезнь." }
});
RECIPES.push(
  { id: "snare", n: "Силок", need: { rope: 1, stick: 1 }, out: { snare: 1 }, t: 15 },
  { id: "balm", n: "Согревающая мазь", need: { herbs: 2, rag: 1, vodka: 1 }, out: { balm: 1, bottle: 1 }, st: "fire", t: 25 },
  { id: "iv", n: "Самодельная капельница", need: { water: 2, antibio: 1, tape: 1 }, out: { iv: 1, bottle: 2 }, st: "bench", t: 30 }
);
STRUCT.rowboat = { n: "Вёсельная лодка", ic: "🚣", lv: [{ n: "Нет" }, { n: "Вёсельная лодка", c: { planks: 8, nails: 16, rope: 2, tape: 2 } }] };
const COAST = ["base", "beach", "wreck", "lighthouse", "village"];
function boatMins(to) {
  const r = route(G.loc, to);
  return r ? Math.max(20, Math.round(r.mins * 0.55)) : null;
}
function canBoat(to) {
  return G.w.struct.rowboat && COAST.includes(G.loc) && COAST.includes(to) && to !== G.loc && !G.traveling && !G.combat && LOCS[to] && !LOCS[to].ch2;
}
function boatTo(to) {
  if (!canBoat(to)) return;
  if (weather().id === "storm") return UI.toast("⛈️ В грозу в море не выйти.");
  const mins = boatMins(to);
  SND("travel");
  setAct("🚣 плывёт: ".concat(LOCS[to].ic, " ").concat(LOCS[to].n));
  G.room = null;
  G.traveling = true;
  G.travelTo = to;
  advance(mins);
  if (G.dead) return;
  G.traveling = false;
  G.loc = to;
  G.w.locs[to].seen = true;
  setAct("осматривается");
  if (ch(0.1 * F().enemies)) {
    UI.log("🧟‍♂️ Из воды у берега поднимается утопленник!", "bad");
    startCombat(spawnList([["drowned", 1, 1]]), { road: true, onEnd: () => UI.render() });
  }
  UI.log("🚣 Ты доплыл на лодке: ".concat(LOCS[to].ic, " ").concat(LOCS[to].n, " (").concat(mins, " мин)."));
  save();
  UI.go("loc");
}
const SNARE_LOCS = ["forest", "farm", "swamp", "beach"];
const snaresHere = () => (G.w.snares || []).filter((s) => s.loc === G.loc);
function setSnare() {
  if (!SNARE_LOCS.includes(G.loc) || !cnt(G.inv, "snare")) return;
  if (snaresHere().length >= 3) return UI.toast("Здесь уже 3 силка.");
  take(G.inv, "snare", 1);
  advance(10);
  G.w.snares = (G.w.snares || []).concat([{ id: Date.now() % 1e9, loc: G.loc, at: G.time, by: G.ch.name }]);
  xp("surv", 1);
  UI.log("🪤 Силок поставлен. Проверь через 8 часов.");
  save();
  UI.render();
}
function checkSnare(id) {
  const s = (G.w.snares || []).find((x) => x.id === id);
  if (!s) return;
  advance(5);
  if (G.time - s.at < 8 * H) {
    UI.toast("Рано — ещё ~".concat(Math.ceil((s.at + 8 * H - G.time) / H), " ч."));
    return;
  }
  const luck = 0.5 + skill("surv") * 0.04 + (season() === 0 ? 0.1 : season() === 1 ? -0.2 : 0);
  if (ch(luck)) {
    const n = R(1, 2);
    invAdd(G.inv, "meat", n);
    UI.log("🪤 В силке добыча: 🥩 Сырое мясо ×".concat(n, "."), "good");
    xp("surv", 3);
    if (ch(0.15)) {
      invAdd(G.inv, "rag", 1);
    }
  } else UI.log("🪤 Силок пустой.", "dim");
  if (ch(0.8)) {
    s.at = G.time;
    UI.log("🪤 Силок снова насторожен.");
  } else {
    G.w.snares = G.w.snares.filter((x) => x.id !== id);
    UI.log("🪤 Силок порвался.", "warn");
  }
  save();
  UI.render();
}
function pickSnare(id) {
  G.w.snares = (G.w.snares || []).filter((x) => x.id !== id);
  invAdd(G.inv, "snare", 1);
  save();
  UI.render();
}
const nextBloodDay = () => {
  const d = day();
  return d % BNP() === 0 ? d : d + (BNP() - d % BNP());
};
const PREP = [
  { id: "spikes", n: "Вбить колья перед стенами", ic: "🪵", def: 10, c: { planks: 2, nails: 10 } },
  { id: "torch", n: "Факелы по периметру", ic: "🔥", def: 8, c: { wood: 3, rag: 2 } },
  { id: "cans", n: "Растяжки с банками", ic: "🥫", def: 7, c: { wire: 2, scrap: 2 } }
];
const prepNow = () => {
  const p = G.w.prep;
  return p && p.day === nextBloodDay() ? p : null;
};
function doPrep(id) {
  const P = PREP.find((x) => x.id === id);
  if (!P || !atBase()) return;
  if (!hasAll(P.c)) return UI.toast("Не хватает материалов.");
  if (day() < nextBloodDay() - 1) return UI.toast("Готовиться имеет смысл за день до Кровавой ночи.");
  for (const [k, v] of Object.entries(P.c)) allTake(k, v);
  const p = prepNow() || { day: nextBloodDay(), done: {} };
  p.done[id] = G.ch.name;
  G.w.prep = p;
  advance(40);
  xp("craft", 3);
  UI.log("".concat(P.ic, " ").concat(P.n, ": +").concat(P.def, " к обороне на эту Кровавую ночь."), "good");
  FEED("".concat(P.ic, " готовит базу к Кровавой ночи"));
  save();
  UI.render();
}
const _defenseP = defense;
defense = function() {
  const p = prepNow();
  return _defenseP() + (p ? PREP.filter((x) => p.done[x.id]).reduce((a, x) => a + x.def, 0) : 0);
};
function frostTick(st) {
  const c = G.ch;
  c.frost = c.frost || 0;
  const warm = activeBuffs().some((b) => b.id === "warm");
  const exposed = season() === 1 && !inShelter() && !campHere() && !warm;
  if (exposed) c.frost = Math.min(100, c.frost + st / H * (isNight() ? 6 : 3) * Math.max(0.2, 1 - warmth() / 10) * mul("cold", 0.2));
  else c.frost = Math.max(0, c.frost - st / H * (inShelter() || campHere() ? 15 : 4));
  if (c.frost >= 60 && F().parts && ch(st / H * 0.25)) {
    const p = pick(["lleg", "rleg", "larm", "rarm"]);
    hurtPart(p, R(3, 6), false, "обморожение");
    UI.log("🥶 Обморожение: ".concat(PARTS[p].n, " немеет."), "bad");
    checkDeath();
  }
}
const _moodlesF = moodles;
moodles = function() {
  const m = _moodlesF.apply(this, arguments);
  const f = G.ch.frost || 0;
  if (f >= 25) m.push({ ic: "🥶", n: "Обморожение", l: f >= 80 ? 3 : f >= 50 ? 2 : 1, d: "Иди в укрытие или к огню, выпей горячего, намажься согревающей мазью." });
  return m;
};
const _useItemM = useItem;
useItem = function(id) {
  if (id === "balm" || id === "iv") {
    const e = G.inv.find((x) => x.id === id) || atBase() && G.stash.find((x) => x.id === id);
    if (!e) return;
    take(G.inv.includes(e) ? G.inv : G.stash, id, 1);
    advance(id === "iv" ? 30 : 5);
    xp("med", 3);
    if (id === "balm") {
      G.ch.frost = Math.max(0, (G.ch.frost || 0) - 60);
      addBuff("warm");
      UI.log("🫙 Мазь согревает руки и ноги.", "good");
    } else {
      for (const p in PARTS) G.ch.parts[p] = Math.min(PARTS[p].max, G.ch.parts[p] + PARTS[p].max * 0.3);
      if (G.ch.ill) G.ch.ill = Math.max(0, G.ch.ill - 40);
      G.ch.drink = Math.min(100, G.ch.drink + 20);
      UI.log("💉 Капельница: силы возвращаются.", "good");
    }
    save();
    UI.render();
    return;
  }
  return _useItemM.apply(this, arguments);
};
EVTS.plane = { n: "Крушение самолёта", ic: "✈️", dur: 36, locs: ["forest", "farm", "swamp", "meteo", "post"] };
function addPlane() {
  const ev = { id: "plane" + G.time, type: "plane", until: G.time + 36 * H, loc: pick(EVTS.plane.locs) };
  G.w.events = (G.w.events || []).concat([ev]);
  SND("heli");
  UI.event({ title: "✈️ Крушение самолёта", cls: "bad", text: "Над островом с рёвом прошёл горящий самолёт и рухнул в локации ".concat(LOCS[ev.loc].ic, " ").concat(LOCS[ev.loc].n, ". Там может быть ценный груз — но на дым сбегутся все твари округи. Обломки остынут через 1,5 суток."), choices: [{ t: "Понял" }] });
}
const _dailyEventP = dailyEvent;
dailyEvent = function(force) {
  const r = _dailyEventP.apply(this, arguments);
  if (!force && day() >= 4 && ch(0.12) && !activeEvents().some((e) => e.type === "plane")) addPlane();
  return r;
};
function openPlane(ev) {
  if (!ev.fought) {
    ev.fought = true;
    UI.log("✈️ У обломков кто-то шевелится!", "bad");
    startCombat(spawnList([["soldier", 1, 2], ["runner", 1, 2]]), { road: true, onEnd: (r) => {
      if (r === "win") lootPlane(ev);
      else UI.render();
    } });
    return;
  }
  lootPlane(ev);
}
function lootPlane(ev) {
  advance(30);
  if (G.dead) return;
  const got = { medkit: 2, ration: 3, a545: R(15, 25) };
  for (const id of [pick(["vest", "vest2", "bag3"]), pick(["scope", "silencer", "extmag", "stock"]), pick(["antibio", "serum", "iv"])]) got[id] = (got[id] || 0) + 1;
  if (ch(0.35)) got.ak = 1;
  for (const [k, v] of Object.entries(got)) invAdd(G.inv, k, v);
  ev.done = true;
  xp("search", 6);
  FEED("✈️ вскрыл обломки самолёта (".concat(L().n, ")"));
  SND("pickup");
  UI.event({ title: "✈️ Груз самолёта", cls: "good", text: "Среди обломков: " + Object.entries(got).map(([k, v]) => "".concat(IT(k).ic, " ").concat(IT(k).n).concat(v > 1 ? " ×" + v : "")).join(", "), choices: [{ t: "Отлично" }] });
}
const MASTERY = [10, 30, 70];
const masteryOf = (id) => {
  const k = (G.ch.wm || {})[id] || 0;
  return MASTERY.filter((t) => k >= t).length;
};
const _onKillM = onKill;
onKill = function(e) {
  const w = G.eq.weapon;
  if (w) {
    G.ch.wm = G.ch.wm || {};
    const before = masteryOf(w.id);
    G.ch.wm[w.id] = (G.ch.wm[w.id] || 0) + 1;
    const after = masteryOf(w.id);
    if (after > before) setTimeout(() => UI.log("⭐ Мастерство: ".concat(IT(w.id).n, " — уровень ").concat(after, "/3!"), "good"), 0);
  }
  return _onKillM.apply(this, arguments);
};
const _extraModW = extraMod;
extraMod = function(k) {
  let v = _extraModW(k);
  const w = G && G.eq && G.eq.weapon;
  if (!w) return v;
  const lv = masteryOf(w.id);
  if (!lv) return v;
  const gun = IT(w.id).c === "gun";
  if (!gun && k === "meleeDmg") v += 0.06 * lv;
  if (!gun && k === "meleeAcc") v += 0.02 * lv;
  if (gun && k === "gunAcc") v += 0.025 * lv;
  if (gun && k === "ammoSave") v += 0.03 * lv;
  return v;
};
const _cuiGround = CUI.ground;
CUI.ground = function() {
  let h = _cuiGround.apply(this, arguments);
  const b = UI.btn;
  if (G.room != null || G.traveling) return h;
  for (const ev of eventsAt(G.loc).filter((e) => e.type === "plane")) h += '<div class="row evt"><span class="ic">✈️</span><div class="grow"><span class="t">Обломки самолёта</span><span class="s">остынут через ~'.concat(Math.ceil((ev.until - G.time) / H), " ч · ").concat(ev.fought ? "охрана перебита" : "вокруг бродят твари", "</span></div>").concat(b(ev.fought ? "Обыскать" : "Пробиться к грузу", () => openPlane(ev), "sm pri"), "</div>");
  if (SNARE_LOCS.includes(G.loc)) {
    const sn = snaresHere();
    h += '<div class="sec"><div class="sechead"><h2>🪤 Силки</h2>'.concat(b("Поставить (".concat(cnt(G.inv, "snare"), ")"), setSnare, "sm", !cnt(G.inv, "snare") || sn.length >= 3), "</div>").concat(sn.map((s) => {
      const ready = G.time - s.at >= 8 * H;
      return '<div class="row"><span class="ic">🪤</span><div class="grow"><span class="t">Силок · '.concat(cesc(s.by), '</span><span class="s">').concat(ready ? "✅ можно проверять" : "через ~".concat(Math.ceil((s.at + 8 * H - G.time) / H), " ч"), "</span></div>").concat(b("Проверить", () => checkSnare(s.id), "sm" + (ready ? " pri" : ""), !ready)).concat(b("Снять", () => pickSnare(s.id), "sm"), "</div>");
    }).join("") || '<p class="muted" style="font-size:13px">Сделай силок (верёвка + палка) и поставь здесь.</p>', "</div>");
  }
  return h;
};
const _markCardB = CUI.markCard;
CUI.markCard = function(loc) {
  let h = "";
  if (canBoat(loc)) h += '<div class="acts">'.concat(UI.btn("🚣 На лодке — ".concat(boatMins(loc), " мин"), () => boatTo(loc), "pri"), "</div>");
  else if (G.w.struct.rowboat && COAST.includes(loc) && loc !== G.loc && !COAST.includes(G.loc)) h += '<p class="muted" style="font-size:13px">🚣 Лодка ходит только между прибрежными местами: база, пляж, деревня, маяк, сухогруз.</p>';
  return h + _markCardB.apply(this, arguments);
};
CUI.itemExtra = function(e) {
  const it = IT(e.id), out = [];
  if (["melee", "gun"].includes(it.c)) {
    const k = (G.ch.wm || {})[e.id] || 0, lv = masteryOf(e.id), nx = MASTERY[lv];
    out.push("⭐ мастерство ".concat(lv, "/3").concat(nx ? " (".concat(k, "/").concat(nx, ")") : ""));
  }
  return out;
};
CUI.quickCraft = function(e) {
  const rs = RECIPES.filter((r) => r.need[e.id] && !recipeState(r)).slice(0, 3);
  return rs.map((r) => {
    const o = Object.keys(r.out)[0];
    return UI.btn("🔨 ".concat(IT(o).ic, " ").concat(IT(o).n), () => craft(r), "sm");
  }).join("");
};
const _cuiBaseP = CUI.basePanel;
CUI.basePanel = function() {
  let h = _cuiBaseP.apply(this, arguments);
  const nb = nextBloodDay();
  if (day() >= nb - 1) {
    const p = prepNow();
    h += '<div class="sec"><h2>🛡️ Подготовка к Кровавой ночи (день '.concat(nb, ')</h2><p class="muted" style="font-size:13px">Действует только на эту ночь. Сейчас оборона ').concat(defense(), '.</p><div class="list">').concat(PREP.map((P) => '<div class="row '.concat(p && p.done[P.id] ? "dim" : "", '"><span class="ic">').concat(P.ic, '</span><div class="grow"><span class="t">').concat(P.n, " · +").concat(P.def, '</span><span class="s">').concat(p && p.done[P.id] ? "✅ сделал ".concat(cesc(p.done[P.id])) : Object.entries(P.c).map(([k, v]) => "".concat(IT(k).ic).concat(allCnt(k), "/").concat(v)).join(" "), "</span></div>").concat(p && p.done[P.id] ? "" : UI.btn("Сделать", () => doPrep(P.id), "sm", !hasAll(P.c)), "</div>")).join(""), "</div></div>");
  }
  return h;
};
function statsHtml() {
  const c = G.ch, kb = Object.entries(G.w.killsBy || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const built = Object.entries(G.w.struct).filter(([k, v]) => v > 0 && STRUCT[k]).length;
  const rs = G.w.raidStats || {};
  const rows = [["📅 Дней на острове", Math.floor((G.time - c.born) / DAY) + 1], ["☠️ Врагов упокоено", c.kills], ["💀 Смертей в этом мире", (G.w.deaths || []).length], ["🏗️ Построек", built], ["📋 Заказов выполнено", G.w.contractsDone || 0], ["⚔️ Рейдов выиграно", rs.won || 0], ["🌕 Кровавых ночей", Object.keys(G.w.hordeDone || {}).length], ["🏆 Достижений", typeof achCount === "function" ? achCount() : 0]];
  return '<div class="sec"><h2>📊 Статистика забега</h2><div class="list" style="gap:2px">'.concat(rows.map(([n, v]) => '<div class="row" style="padding:6px 10px"><div class="grow"><span class="t" style="font-weight:400">'.concat(n, '</span></div><b class="mono">').concat(v, "</b></div>")).join(""), "</div>").concat(kb.length ? '<p class="muted" style="font-size:13px;margin-top:6px">Чаще всего: '.concat(kb.map(([id, n]) => "".concat(ENEMY[id] ? ENEMY[id].ic : "").concat(n)).join(" · "), "</p>") : "").concat((G.w.deaths || []).length ? '<p class="muted" style="font-size:13px">Погибшие: '.concat(G.w.deaths.slice(-5).map((d) => "".concat(cesc(d.name), " (").concat(d.days, " дн., ").concat(cesc(d.cause), ")")).join(", "), "</p>") : "", "</div>");
}
const _cuiJour2 = CUI.jour;
CUI.jour = function() {
  return _cuiJour2.apply(this, arguments) + statsHtml();
};
const _tickF = tick;
tick = function(st, o) {
  _tickF.apply(this, arguments);
  if (G && !G.dead) frostTick(st);
};
const _extMigrateF = extMigrate;
extMigrate = function() {
  _extMigrateF.apply(this, arguments);
  if (G.w.struct.rowboat == null) G.w.struct.rowboat = 0;
};
const DOWN_MS = 10 * 60 * 1e3;
function downedHook(cause) {
  if (G.noDown) return false;
  if (G.downed) return true;
  if (F().death !== "perma" || !G.coop || !window.COOP || /вирус/.test(String(cause))) return false;
  const ally = COOP.others().some((p) => p.online && p.alive !== false && !p.downed);
  if (!ally) return false;
  G.downed = { cause, until: Date.now() + DOWN_MS, loc: G.traveling ? G.travelTo || G.loc : G.loc };
  G.combat = null;
  G.interrupt = true;
  G.room = null;
  G.traveling = false;
  G.loc = G.downed.loc;
  for (const p in PARTS) G.ch.parts[p] = Math.max(1, Math.min(G.ch.parts[p], 3));
  G.ch.bleed = 0;
  G.ch.inj.forEach((j) => j.bleed = 0);
  if (G.ch.rad >= 150) G.ch.rad = 140;
  G.ch.food = Math.max(G.ch.food, 5);
  G.ch.drink = Math.max(G.ch.drink, 5);
  SND("hurt");
  try {
    UI.closeCombat && UI.closeCombat("fled", null);
  } catch (e) {
  }
  FEED("🆘 тяжело ранен (".concat(cause, ") — нужна помощь: ").concat(LOCS[G.loc].ic, " ").concat(LOCS[G.loc].n, "!"));
  save();
  try {
    COOP.pushNow();
  } catch (e) {
  }
  downedShow();
  return true;
}
function reviveMe(by) {
  if (!G.downed) return;
  G.downed = null;
  for (const p in PARTS) G.ch.parts[p] = Math.max(G.ch.parts[p], Math.round(PARTS[p].max * 0.35));
  G.ch.stress = Math.min(100, (G.ch.stress || 0) + 20);
  downedHide();
  UI.log("🩹 ".concat(by, " поднял тебя на ноги!"), "good");
  FEED("🩹 снова на ногах благодаря ".concat(by));
  save();
  UI.render();
}
function giveUp() {
  if (!G.downed) return;
  const c = G.downed.cause;
  G.downed = null;
  downedHide();
  G.noDown = true;
  die(c);
  G.noDown = false;
}
function downedShow() {
  if (typeof document === "undefined") return;
  let d = document.getElementById("downed");
  if (!d) {
    d = document.createElement("div");
    d.id = "downed";
    document.body.appendChild(d);
  }
  const left = Math.max(0, Math.ceil((G.downed.until - Date.now()) / 1e3));
  d.innerHTML = '<div class="dbox"><div style="font-size:42px">🆘</div><h2>Ты тяжело ранен</h2><p>'.concat(cesc(G.downed.cause), ". Ты лежишь без сил: ").concat(LOCS[G.downed.loc].ic, " ").concat(cesc(LOCS[G.downed.loc].n), '.</p><p>Друг может прийти и поднять тебя (нужен бинт или аптечка).</p><div class="dtime">').concat(Math.floor(left / 60), ":").concat(String(left % 60).padStart(2, "0"), '</div><button class="btn" onclick="giveUp()">💀 Сдаться</button></div>');
}
function downedHide() {
  const d = typeof document !== "undefined" && document.getElementById("downed");
  if (d) d.remove();
}
window.giveUp = giveUp;
if (typeof setInterval === "function" && typeof document !== "undefined") setInterval(() => {
  if (typeof G === "undefined" || !G || !G.downed) return downedHide();
  if (Date.now() > G.downed.until) {
    const c = G.downed.cause;
    G.downed = null;
    downedHide();
    G.noDown = true;
    die(c);
    G.noDown = false;
    return;
  }
  downedShow();
}, 1e3);
async function reviveAlly(p) {
  const med = ["medkit", "bandage", "dband"].find((id) => cnt(G.inv, id));
  if (!med) return UI.toast("Нужен бинт или аптечка.");
  take(G.inv, med, 1);
  advance(10);
  if (await COOP.sendRevive(p.id)) {
    UI.log("🩹 Ты поднял ".concat(p.name, "!"), "good");
    FEED("🩹 поднял ".concat(p.name));
    xp("med", 5);
  }
  save();
  UI.render();
}
ITEMS.coin = { n: "Рубли в кассе", ic: "💰", c: "money", w: 0, v: 0 };
function bankAmt() {
  return cntAll(G.stash, "coin");
}
function bankPut(n) {
  n = Math.min(n, G.money);
  if (n <= 0) return;
  G.money -= n;
  invAdd(G.inv, "coin", n);
  toStash(G.inv.find((e) => e.id === "coin"));
  UI.log("💰 В кассу: ".concat(n, "₽."));
  save();
  UI.render();
}
function bankTake(n) {
  const e = G.stash.find((x) => x.id === "coin");
  if (!e) return;
  n = Math.min(n, bankAmt());
  fromStash(e, n);
  UI.log("💰 Из кассы: ".concat(n, "₽."));
  save();
  UI.render();
}
const _saveCoin = window.save;
window.save = function() {
  try {
    if (typeof G !== "undefined" && G && G.inv) {
      const c = G.inv.filter((e) => e.id === "coin");
      if (c.length) {
        G.money += c.reduce((a, e) => a + e.n, 0);
        G.inv = G.inv.filter((e) => e.id !== "coin");
      }
    }
  } catch (e) {
  }
  return _saveCoin.apply(this, arguments);
};
const KITS = [["sortie", "🎒 Вылазка"], ["raid", "⚔️ Рейд"], ["night", "🌙 Ночёвка"]];
function kitSave(k) {
  const m = {};
  for (const e of G.inv) if (e.id !== "coin") m[e.id] = (m[e.id] || 0) + e.n;
  G.ch.kits = Object.assign({}, G.ch.kits, { [k]: m });
  UI.toast("Шаблон сохранён: " + Object.keys(m).length + " видов вещей.");
  save();
  UI.render();
}
function kitLoad(k) {
  const m = (G.ch.kits || {})[k];
  if (!m || !atBase()) return;
  const got = [], miss = [];
  for (const [id, n] of Object.entries(m)) {
    let need = n - cntAll(G.inv, id);
    while (need > 0) {
      const e = G.stash.find((x) => x.id === id);
      if (!e) break;
      const q = Math.min(need, e.n);
      fromStash(e, q);
      need -= q;
    }
    if (need > 0) miss.push("".concat(IT(id).ic).concat(need));
    else if (n > 0) got.push(IT(id).ic);
  }
  UI.log("🎒 Собрал «".concat(KITS.find((x) => x[0] === k)[1], "»").concat(miss.length ? " — не хватает: ".concat(miss.join(" ")) : "", "."), miss.length ? "warn" : "good");
  save();
  UI.render();
}
CUI.kits = function() {
  if (!atBase()) return "";
  const b = UI.btn, ks = G.ch.kits || {};
  return '<div class="sec"><h3>🎽 Шаблоны снаряжения</h3><div class="acts">'.concat(KITS.map(([k, n]) => ks[k] ? b("".concat(n, ": собрать"), () => kitLoad(k), "sm pri") : "").join(""), '</div><div class="acts">').concat(KITS.map(([k, n]) => b("💾 ".concat(n), () => kitSave(k), "sm")).join(""), '</div><p class="muted" style="font-size:12.5px">💾 запоминает, что сейчас в рюкзаке. «Собрать» добирает недостающее со склада.</p></div>');
};
function goMark(id) {
  const m = (G.w.marks || []).find((x) => x.id === id);
  if (!m) return;
  if (m.loc === G.loc) return UI.toast("Ты уже здесь.");
  closeSummary();
  if (G.room != null) leaveRoom();
  travel(m.loc);
  save();
  UI.render();
}
window.goMark = goMark;
const CUST_KEYS = [["needs", "🍗 Голод и жажда"], ["enemies", "🧟 Сила врагов"], ["count", "👥 Число врагов"], ["horde", "🌕 Натиск орды"]];
const CUST_VALS = [0.5, 0.75, 1, 1.25, 1.5];
let custCache = { k: "", f: null };
function customF(f) {
  const c = G.custom, key = JSON.stringify(c) + (f.__m || G.mode);
  if (custCache.k === key) return custCache.f;
  const o = Object.assign({}, f);
  for (const [k] of CUST_KEYS) if (c[k] && typeof o[k] === "number") o[k] = o[k] * c[k];
  custCache = { k: key, f: o };
  return o;
}
function setCustom(k, v) {
  G.custom = Object.assign({ needs: 1, enemies: 1, count: 1, horde: 1 }, G.custom, { [k]: v });
  if (Object.values(G.custom).every((x) => x === 1)) delete G.custom;
  save();
  UI.render();
}
function customHtml() {
  const c = G.custom || {}, b = UI.btn;
  return '<div class="sec"><h2>🎚️ Своя сложность</h2><p class="muted" style="font-size:13px">Поверх режима «'.concat(MODES[G.mode].n, "». ").concat(G.coop ? "В кооперативе голод и враги — у каждого свои, натиск орды задаёт ведущий мира." : "", "</p>").concat(CUST_KEYS.map(([k, n]) => '<div class="row" style="flex-wrap:wrap"><div class="grow"><span class="t">'.concat(n, '</span></div><div class="toggle">').concat(CUST_VALS.map((v) => '<button class="'.concat((c[k] || 1) === v ? "on" : "", '" onclick="').concat("", "setCustom('").concat(k, "',").concat(v, ')">×').concat(v, "</button>")).join(""), "</div></div>")).join(""), "</div>");
}
window.setCustom = setCustom;
function diaryAdd(t) {
  if (typeof G === "undefined" || !G || !G.ch) return;
  G.ch.diary = (G.ch.diary || []).concat([{ d: day(), k: clock(), t: String(t).slice(0, 140) }]).slice(-200);
}
function diaryHtml() {
  const l = (G.ch.diary || []).slice(-30).reverse();
  return '<div class="sec"><h2>📔 Дневник '.concat(cesc(G.ch.name), "</h2>").concat(l.length ? '<div class="list" style="gap:2px">'.concat(l.map((x) => '<div class="lg" style="font-size:13px"><span class="mono muted">День '.concat(x.d, ", ").concat(x.k, "</span> — ").concat(cesc(x.t), "</div>")).join(""), "</div>") : '<p class="muted">Здесь появятся яркие моменты твоего выживания.</p>', "</div>");
}
const _cuiJour3 = CUI.jour;
CUI.jour = function() {
  return diaryHtml() + _cuiJour3.apply(this, arguments) + customHtml();
};
function fx(cls, ms) {
  const a = document.getElementById("app");
  if (!a) return;
  a.classList.remove(cls);
  void a.offsetWidth;
  a.classList.add(cls);
  setTimeout(() => a.classList.remove(cls), ms);
}
if (typeof document !== "undefined") window.addEventListener("load", () => {
  if (!window.SFX || SFX._fx) return;
  const p = SFX.play;
  SFX.play = function(n) {
    try {
      if (n === "hurt") fx("shake", 350);
      if (n === "death") fx("flashred", 900);
      if (n === "zap" || n === "siren") fx("flashred", 600);
      if (n === "level" || n === "quest") fx("flashgood", 600);
    } catch (e) {
    }
    return p.apply(this, arguments);
  };
  SFX._fx = 1;
});
const _cuiGround2 = CUI.ground;
CUI.ground = function() {
  let h = "";
  const b = UI.btn;
  if (G.coop && window.COOP && G.room == null && !G.traveling) for (const p of COOP.others().filter((p2) => p2.downed && p2.online && p2.loc === G.loc)) h += '<div class="row hot"><span class="ic">🆘</span><div class="grow"><span class="t">'.concat(cesc(p.name), ' тяжело ранен!</span><span class="s">Подними его, пока не поздно (бинт или аптечка, 10 мин)</span></div>').concat(b("🩹 Поднять", () => reviveAlly(p), "sm pri"), "</div>");
  return h + _cuiGround2.apply(this, arguments);
};
const _sideRightM = sideRight;
sideRight = function() {
  let h = _sideRightM.apply(this, arguments);
  const ms = liveMarks();
  if (ms.length) h = '<div class="card"><h3>📍 Метки</h3>'.concat(ms.map((m) => '<div class="tm"><div>'.concat(m.ic, " ").concat(cesc(m.txt), " · ").concat(LOCS[m.loc].ic, " ").concat(cesc(LOCS[m.loc].n), '<br><span class="mono">').concat(cesc(m.by), "</span></div>").concat(m.loc !== G.loc ? '<button class="btn sm" onclick="goMark('.concat(m.id, ')">🏃</button>') : '<span class="mono">ты здесь</span>', "</div>")).join(""), "</div>") + h;
  if (G.coop && window.COOP) {
    const dn = COOP.others().filter((p) => p.downed && p.online);
    if (dn.length) h = '<div class="card">'.concat(dn.map((p) => '<div class="alert">🆘 '.concat(cesc(p.name), " ранен: ").concat(LOCS[p.loc] ? LOCS[p.loc].ic + " " + cesc(LOCS[p.loc].n) : "", "</div>")).join(""), "</div>") + h;
  }
  return h;
};
const _cuiBaseK = CUI.basePanel;
CUI.basePanel = function() {
  const b = UI.btn, n = bankAmt();
  return '<div class="sec"><h2>💰 Касса '.concat(G.coop ? "отряда" : "базы", ': <span class="mono">').concat(n, '₽</span></h2><div class="acts">').concat(b("+50₽", () => bankPut(50), "sm", G.money < 50)).concat(b("+всё", () => bankPut(G.money), "sm", G.money <= 0)).concat(b("−50₽", () => bankTake(50), "sm", n < 50)).concat(b("−всё", () => bankTake(n), "sm", n <= 0), "</div></div>") + _cuiBaseK.apply(this, arguments);
};
const DAILY_CH = [
  { id: "melee", n: "Тихая работа", d: "Упокой 6 врагов без огнестрела", goal: 6, ic: "🔪" },
  { id: "night", n: "Ночной охотник", d: "Упокой 5 врагов ночью", goal: 5, ic: "🌙" },
  { id: "search", n: "Барахольщик", d: "Обыщи 12 ящиков, шкафов и тел", goal: 12, ic: "🔍" },
  { id: "cook", n: "Повар", d: "Приготовь 3 блюда или порции еды", goal: 3, ic: "🍳" },
  { id: "fish", n: "Рыбный день", d: "Поймай 6 рыб", goal: 6, ic: "🎣" },
  { id: "travel", n: "Бродяга", d: "Побывай в 5 разных местах", goal: 5, ic: "🧭" }
];
const dayKey = () => Math.floor((Date.now() + 3 * 36e5) / 864e5);
const dailyCh = () => DAILY_CH[dayKey() % DAILY_CH.length];
function dailyState() {
  let s0;
  try {
    s0 = JSON.parse(localStorage.getItem("moti3_daily")) || {};
  } catch (e) {
    s0 = {};
  }
  if (s0.k !== dayKey()) s0 = { k: dayKey(), prog: 0, done: false, locs: [] };
  return s0;
}
function dailyProg(kind, n, extra) {
  if (typeof G === "undefined" || !G || dailyCh().id !== kind) return;
  const s0 = dailyState();
  if (s0.done) return;
  if (kind === "travel") {
    if (s0.locs.includes(extra)) return;
    s0.locs.push(extra);
    s0.prog = s0.locs.length;
  } else s0.prog += n;
  if (s0.prog >= dailyCh().goal) {
    s0.done = true;
    const rew = pick(["medkit", "antibio", "scope", "coffee", "tea", "balm", "c4"]);
    invAdd(G.inv, rew, 1);
    G.money += 120;
    setTimeout(() => {
      SND("quest");
      UI.event({ title: "".concat(dailyCh().ic, " Испытание дня выполнено!"), cls: "good", text: "".concat(dailyCh().n, ": ").concat(dailyCh().d, ".\n\nНаграда: 120₽ и ").concat(IT(rew).ic, " ").concat(IT(rew).n, "."), choices: [{ t: "Отлично" }] });
    }, 0);
    diaryAdd("".concat(dailyCh().ic, " выполнил испытание дня «").concat(dailyCh().n, "»"));
  }
  try {
    localStorage.setItem("moti3_daily", JSON.stringify(s0));
  } catch (e) {
  }
}
const _onKillD = onKill;
onKill = function(e) {
  const w = G.eq.weapon;
  if (!w || IT(w.id).c !== "gun") dailyProg("melee", 1);
  if (isNight()) dailyProg("night", 1);
  return _onKillD.apply(this, arguments);
};
const _searchContD = searchCont;
searchCont = function(k) {
  const s = G.room != null && roomSt(G.room), was = s && s.cont && s.cont[k];
  const r = _searchContD.apply(this, arguments);
  const now = s && s.cont && s.cont[k];
  if (now && now !== was) dailyProg("search", 1);
  return r;
};
const _craftD = craft;
craft = function(r) {
  const ok = !recipeState(r);
  const res = _craftD.apply(this, arguments);
  if (ok && r && r.out && Object.keys(r.out).some((id) => IT(id).c === "food" || IT(id).c === "drink" && id !== "water")) dailyProg("cook", 1);
  return res;
};
const _doFishD = doFish;
doFish = function() {
  const b = cnt(G.inv, "fish");
  const r = _doFishD.apply(this, arguments);
  const d = cnt(G.inv, "fish") - b;
  if (d > 0) dailyProg("fish", d);
  return r;
};
const _travelD = travel;
travel = function(to) {
  const r = _travelD.apply(this, arguments);
  if (!G.dead && G.loc === to) dailyProg("travel", 1, to);
  return r;
};
function dailyHtml() {
  const c = dailyCh(), s0 = dailyState();
  return '<div class="row '.concat(s0.done ? "dim" : "", '"><span class="ic">').concat(c.ic, '</span><div class="grow"><span class="t">Испытание дня: ').concat(c.n, '</span><span class="s">').concat(c.d, " · ").concat(Math.min(s0.prog, c.goal), "/").concat(c.goal).concat(s0.done ? " · ✅ награда получена" : " · награда 120₽ и вещь", "</span></div></div>");
}
const _cuiJour4 = CUI.jour;
CUI.jour = function() {
  return '<div class="sec"><h2>🎯 Испытания</h2>'.concat(dailyHtml(), "</div>") + _cuiJour4.apply(this, arguments);
};
Object.assign(ITEMS, {
  wolfpelt: { n: "Шкура Белого волка", ic: "🤍", c: "wear", w: 2, v: 450, slot: "body", warm: 6, arm: 2 },
  tusk: { n: "Бивневый кинжал", ic: "🦷", c: "melee", w: 0.5, v: 400, dmg: [11, 17], dur: 140, noise: 1 },
  pearl: { n: "Чёрная жемчужина", ic: "⚫", c: "val", w: 0.05, v: 700, info: "Нашли в горле Короля утопленников. Очень дорого стоит." }
});
Object.assign(ENEMY, {
  whitewolf: { n: "Белый волк", ic: "🐺", spr: "dog", hp: 110, dmg: [11, 17], sp: 2, acc: 0.7, inj: ["bite", "lacer"], noVirus: 1, xp: 45, boss: 1, drop: [["wolfpelt", 1], ["meat", 3]] },
  kingdrowned: { n: "Король утопленников", ic: "👑", spr: "drowned", hp: 170, dmg: [12, 19], sp: 1, acc: 0.6, arm: 3, inj: ["bite", "bruise", "lacer"], xp: 55, boss: 1, drop: [["pearl", 1], ["scuba", 1]] },
  boar: { n: "Кабан-мутант", ic: "🐗", spr: "pdog", hp: 140, dmg: [13, 20], sp: 2, acc: 0.6, arm: 2, inj: ["lacer", "frac", "bruise"], noVirus: 1, xp: 50, boss: 1, drop: [["tusk", 1], ["meat", 5]] }
});
const LEGENDS = { whitewolf: ["forest", "meteo"], kingdrowned: ["beach", "wreck"], boar: ["farm", "swamp"] };
EVTS.legend = { n: "Легендарный зверь", ic: "🐾", dur: 48 };
function addLegend() {
  const id = pick(Object.keys(LEGENDS).filter((k) => !G.w.flags[k + "_dead"]));
  if (!id) return;
  const ev = { id: "legend" + G.time, type: "legend", beast: id, until: G.time + 48 * H, loc: pick(LEGENDS[id]) };
  G.w.events = (G.w.events || []).concat([ev]);
  UI.event({ title: "🐾 ".concat(ENEMY[id].ic, " ").concat(ENEMY[id].n), text: "Выжившие рассказывают: в локации ".concat(LOCS[ev.loc].ic, " ").concat(LOCS[ev.loc].n, " видели ").concat(ENEMY[id].n, ". Говорят, тот, кто его одолеет, получит редкий трофей. Через двое суток зверь уйдёт."), choices: [{ t: "Интересно" }] });
}
const _dailyEventL = dailyEvent;
dailyEvent = function(force) {
  const r = _dailyEventL.apply(this, arguments);
  if (!force && day() >= 5 && ch(0.1) && !activeEvents().some((e) => e.type === "legend")) addLegend();
  return r;
};
function huntLegend(ev) {
  setAct("🐾 выслеживает: ".concat(ENEMY[ev.beast].n));
  advance(30);
  if (G.dead) return;
  const e = mkEnemy(ev.beast);
  e.dist = 2;
  SND("roar");
  startCombat([e], { road: true, onEnd: (r) => {
    if (r === "win") {
      ev.done = true;
      FEED("🐾 одолел легендарного зверя: ".concat(ENEMY[ev.beast].n));
      UI.event({ title: "🏆 Легенда повержена", cls: "good", text: "".concat(ENEMY[ev.beast].n, " больше не бродит по острову. Трофей — у тебя в рюкзаке."), choices: [{ t: "Отлично" }] });
    }
    save();
    UI.render();
  } });
}
const _cuiGround3 = CUI.ground;
CUI.ground = function() {
  let h = _cuiGround3.apply(this, arguments);
  if (G.room != null || G.traveling) return h;
  for (const ev of eventsAt(G.loc).filter((e) => e.type === "legend")) h += '<div class="row evt"><span class="ic">'.concat(ENEMY[ev.beast].ic, '</span><div class="grow"><span class="t">Следы: ').concat(ENEMY[ev.beast].n, '</span><span class="s">Легендарный зверь · уйдёт через ~').concat(Math.ceil((ev.until - G.time) / H), " ч</span></div>").concat(UI.btn("Выследить", () => huntLegend(ev), "sm pri"), "</div>");
  return h;
};
const MUTS = {
  nighteye: { n: "Ночное зрение", ic: "👁️", good: 1, m: { nightEye: 1 }, d: "Видишь в темноте" },
  thick: { n: "Толстая кожа", ic: "🦏", good: 1, m: { injChance: -0.15 }, d: "Реже получаешь травмы" },
  gills: { n: "Сухой метаболизм", ic: "🐫", good: 1, m: { thirst: -0.2 }, d: "Меньше хочется пить" },
  regen: { n: "Регенерация", ic: "🧬", good: 1, m: { heal: 0.25 }, d: "Раны заживают быстрее" },
  glow: { n: "Свечение кожи", ic: "✨", good: 0, m: { stealth: -1 }, d: "Тебя легче заметить" },
  twitch: { n: "Нервный тик", ic: "🫨", good: 0, m: { meleeAcc: -0.04 }, d: "Чуть хуже попадаешь" }
};
function mutCheck() {
  const c = G.ch;
  c.muts = c.muts || [];
  if (c.rad < 100 || c.muts.length >= 3 || !ch(0.3)) return;
  const pool = Object.keys(MUTS).filter((k2) => !c.muts.includes(k2));
  if (!pool.length) return;
  const k = ch(0.6) ? pick(pool.filter((x) => MUTS[x].good).concat(pool)) : pick(pool);
  c.muts.push(k);
  const M = MUTS[k];
  diaryAdd("🧬 мутация: ".concat(M.n));
  UI.event({ title: "🧬 Мутация: ".concat(M.ic, " ").concat(M.n), cls: M.good ? "good" : "bad", text: "Радиация изменила тебя. ".concat(M.d, ".").concat(M.good ? "" : "\n\nЭто навсегда… если не найдёшь сыворотку Левина."), choices: [{ t: "Понятно" }] });
}
const _useItemMut = useItem;
useItem = function(id) {
  if (id === "serum" && (G.ch.muts || []).some((k) => !MUTS[k].good)) {
    const r = _useItemMut.apply(this, arguments);
    G.ch.muts = G.ch.muts.filter((k) => MUTS[k].good);
    UI.log("💉 Сыворотка подавила вредные мутации.", "good");
    return r;
  }
  return _useItemMut.apply(this, arguments);
};
const _extraModMut = extraMod;
extraMod = function(k) {
  let v = _extraModMut(k);
  for (const id of G && G.ch && G.ch.muts || []) {
    const M = MUTS[id];
    if (M && M.m[k]) v += M.m[k];
  }
  return v;
};
const _extNewDayMut = extNewDay;
extNewDay = function() {
  _extNewDayMut.apply(this, arguments);
  mutCheck();
};
const _charPanelM = EXTUI.charPanel;
EXTUI.charPanel = function() {
  const ms = G.ch.muts || [];
  return (ms.length ? '<div class="sec"><h2>🧬 Мутации</h2><div class="list">'.concat(ms.map((k) => '<div class="row"><span class="ic">'.concat(MUTS[k].ic, '</span><div class="grow"><span class="t">').concat(MUTS[k].n, '</span><span class="s ').concat(MUTS[k].good ? "good" : "bad", '">').concat(MUTS[k].d, "</span></div></div>")).join(""), "</div></div>") : "") + _charPanelM.apply(this, arguments);
};
const _sideLeftD = sideLeft;
sideLeft = function() {
  const c = dailyCh(), s0 = dailyState();
  return _sideLeftD.apply(this, arguments) + '<div class="card"><h3>🎯 Испытание дня</h3><div class="ln '.concat(s0.done ? "good" : "", '">').concat(c.ic, " ").concat(c.n, ": ").concat(c.d, " — ").concat(Math.min(s0.prog, c.goal), "/").concat(c.goal).concat(s0.done ? " ✅" : "", "</div></div>");
};
Object.assign(ITEMS, {
  deepstone: { n: "Камень Глубин", ic: "💠", c: "art", w: 0.4, v: 900, art: { heal: 3, rad: 1 }, d: "Тёплый, пульсирует. Раны на глазах затягиваются." },
  labkey: { n: "Пропуск уровня «Б»", ic: "🪪", c: "key", w: 0, v: 60 }
});
Object.assign(ENEMY, {
  abyss: { n: "Обитатель Глубин", ic: "🦑", spr: "swamper", hp: 230, dmg: [15, 24], sp: 1, acc: 0.65, arm: 5, inj: ["lacer", "frac", "burn"], noVirus: 1, xp: 90, boss: 1, drop: [["deepstone", 1], ["serum", 2], ["crystal", 2]] }
});
CONT.vault = { n: "Сейф лаборатории", ic: "🧰", t: 20, roll: [2, 4], loot: [["serum", 2], ["antibio", 2], ["medkit", 2], ["scope", 1], ["silencer", 1], ["vest2", 1], ["c4", 1], ["crystal", 1], ["cash", 4], ["iv", 1]] };
LOCS.depths = {
  n: "Нижние уровни НИИ",
  ic: "🕳️",
  x: 94,
  y: 27,
  dg: 3,
  zone: 3,
  d: "Под НИИ — шесть ярусов лабораторий. Чем глубже, тем страшнее и богаче. Твари возвращаются через двое суток.",
  links: { nii: 15 },
  rooms: [
    { n: "Ярус −1: склад", cont: ["milcrate", "labdesk"], en: [["sci", 2, 3], ["armored", 0, 1]], dark: 1 },
    { n: "Ярус −2: виварий", cont: ["labdesk", "body"], en: [["pdog", 2, 2], ["crawler", 1, 2]], dark: 1 },
    { n: "Ярус −3: изолятор", cont: ["locker", "labdesk"], en: [["armored", 1, 2], ["acid", 1, 1]], dark: 1, fixed: { item: "labkey" } },
    { n: "Ярус −4: архив", cont: ["vault", "desk"], lock: "labkey", en: [["hunterN", 1, 2], ["sci", 1, 2]], dark: 1 },
    { n: "Ярус −5: реактор", cont: ["labdesk", "vault"], en: [["swamper", 1, 1], ["crys", 1, 2]], anom: 3, dark: 1 },
    { n: "Ярус −6: колыбель", cont: ["vault", "vault"], en: [["abyss", 1, 1]], dark: 1 }
  ]
};
LOCS.nii.links.depths = 15;
const _canTravelD = canTravel;
canTravel = function(to) {
  if (to === "depths" && !G.w.flags.guard_dead) return "🕳️ Шахта лифта под НИИ завалена. Сначала одолей Стража Аппарата.";
  return _canTravelD.apply(this, arguments);
};
const _extMigrateDp = extMigrate;
extMigrate = function() {
  _extMigrateDp.apply(this, arguments);
  if (!G.w.locs.depths) G.w.locs.depths = { seen: false, rooms: LOCS.depths.rooms.map(() => ({ cont: {}, en: [], enAt: -1e9, an: null, art: null, ground: [], aware: true, fixed: false })), kills: 0 };
};
const _onKillAbyss = onKill;
onKill = function(e) {
  const r = _onKillAbyss.apply(this, arguments);
  if (e.id === "abyss") {
    diaryAdd("🦑 одолел Обитателя Глубин на дне НИИ");
    setTimeout(() => UI.event({ title: "🦑 Колыбель затихла", cls: "good", text: "Обитатель Глубин повержен. В его логове — Камень Глубин и сейфы с лучшим лутом острова. Через двое суток здесь снова заведётся что-то страшное.", choices: [{ t: "Отлично" }] }), 0);
  }
  return r;
};
Object.assign(STRUCT, {
  clinic: { n: "Лазарет", ic: "🏥", npc: 1, lv: [{ n: "Нет" }, { n: "Лазарет", c: { planks: 6, rag: 6, alcohol: 1, bandage: 2 } }] },
  forge: { n: "Кузница", ic: "⚒️", npc: 2, lv: [{ n: "Нет" }, { n: "Кузница", c: { scrap: 10, wood: 6, tools: 1, wire: 2 } }] },
  shop: { n: "Лавка поселения", ic: "🛒", npc: 2, lv: [{ n: "Нет" }, { n: "Лавка", c: { planks: 8, nails: 12, cash: 2 } }] },
  tower: { n: "Сторожевая вышка", ic: "🗼", npc: 3, def: [0, 12], lv: [{ n: "Нет" }, { n: "Сторожевая вышка", c: { planks: 10, nails: 16, rope: 2 } }] }
});
TRADERS.settle = {
  n: "Лавка поселения",
  ic: "🛒",
  d: "Жильцы торгуют тем, что добыли и сделали сами. Каждый день — немного разный товар.",
  stock: [["bandage", 0], ["water", 0], ["canned", 0], ["nails", 0], ["planks", 0], ["rope", 0], ["tape", 0], ["a9", 0], ["a12", 0], ["crackers", 0], ["herbs", 0], ["fuel", 0]],
  buys: ["food", "drink", "med", "melee", "mat", "val", "tool"],
  quests: []
};
const _canBuildS = canBuild;
canBuild = function(id) {
  const S = STRUCT[id];
  if (S && S.npc && npcs().length < S.npc && !(G.w.struct[id] > 0)) return "npc";
  return _canBuildS.apply(this, arguments);
};
const _defenseT = defense;
defense = function() {
  return _defenseT() + (G.w.struct.tower ? 12 : 0);
};
function clinicRest() {
  if (!atBase() || !G.w.struct.clinic) return;
  advance(120);
  if (G.dead) return;
  for (const p in PARTS) G.ch.parts[p] = Math.min(PARTS[p].max, G.ch.parts[p] + PARTS[p].max * 0.35);
  G.ch.bleed = 0;
  G.ch.inj.forEach((j) => {
    j.bleed = 0;
    j.inf = Math.max(0, (j.inf || 0) - 40);
    j.band = true;
    j.dis = true;
  });
  if (G.ch.ill) for (const k in G.ch.ill) G.ch.ill[k] = Math.max(0, G.ch.ill[k] - 30);
  UI.log("🏥 Жильцы перевязали и подлечили тебя (2 ч).", "good");
  save();
  UI.render();
}
function forgeRepair() {
  const w = G.eq.weapon, it = w && IT(w.id);
  if (!atBase() || !G.w.struct.forge || !w || !it.dur) return;
  if (allCnt("scrap") < 3) return UI.toast("Нужно 3 металлолома.");
  allTake("scrap", 3);
  advance(40);
  w.dur = it.dur;
  SND("craft");
  UI.log("⚒️ Кузнец выправил ".concat(it.n, " — как новое."), "good");
  save();
  UI.render();
}
function openShop() {
  if (!G.w.struct.shop) return;
  UI._st.tab = "loc";
  UI._st.trader = "settle";
  UI._st.ttab = "buy";
  setTimeout(() => UI.render(), 0);
}
const _cuiBaseS = CUI.basePanel;
CUI.basePanel = function() {
  const s = G.w.struct, n = npcs().length, b = UI.btn, acts = [];
  if (s.clinic) acts.push(b("🏥 Лазарет: подлечиться (2 ч)", clinicRest, "sm"));
  if (s.forge) acts.push(b("⚒️ Кузница: починить оружие (3 ⚙️)", forgeRepair, "sm", !(G.eq.weapon && IT(G.eq.weapon.id).dur) || allCnt("scrap") < 3));
  if (s.shop) acts.push(b("🛒 Лавка поселения", openShop, "sm"));
  const locked = ["clinic", "forge", "shop", "tower"].filter((k) => !s[k]).map((k) => "".concat(STRUCT[k].ic, " ").concat(STRUCT[k].n, " — ").concat(n >= STRUCT[k].npc ? "можно строить" : "нужно жильцов: ".concat(STRUCT[k].npc)));
  return '<div class="sec"><h2>🏘️ Поселение · жильцов '.concat(n, "</h2>").concat(acts.length ? '<div class="acts">'.concat(acts.join(""), "</div>") : "").concat(locked.length ? '<p class="muted" style="font-size:12.5px">'.concat(locked.join(" · "), "</p>") : "", "</div>") + _cuiBaseS.apply(this, arguments);
};
const _extMigrateS = extMigrate;
extMigrate = function() {
  _extMigrateS.apply(this, arguments);
  for (const k of ["clinic", "forge", "shop", "tower"]) if (G.w.struct[k] == null) G.w.struct[k] = 0;
  if (G.w.rep && G.w.rep.settle == null) G.w.rep.settle = 0;
};
Object.assign(ENEMY, {
  major: { n: "Майор Крайнов", ic: "🎖️", spr: "soldier", hp: 190, dmg: [14, 22], sp: 1, acc: 0.72, arm: 6, human: 1, inj: ["bullet", "lacer"], xp: 80, boss: 1, noVirus: 1, gear: [["ak", 1]], drop: [["vest2", 1], ["c4", 2], ["bp_c4", 1], ["cash", 8]] }
});
Object.assign(QUESTS, {
  c4_people: { g: "main", n: "Беженцы", d: "К острову пристают лодки с беженцами с материка. Дай им кров: нужно 3 жильца на базе (постройте нары, приглашайте выживших).", type: "flag", flag: "c4_npcs", rew: { money: 200 }, next: "c4_tower" },
  c4_tower: { g: "main", n: "Глаза поселения", d: "Построй сторожевую вышку (База → Стройка) — с материка идут не только беженцы.", type: "flag", flag: "c4_towerb", rew: { xp: { craft: 10 } }, next: "c4_major" },
  c4_major: { g: "main", n: "Майор Крайнов", d: "У блокпоста высадился отряд военных. Их командир хочет забрать остров и Аппарат себе. Атакуй лагерь (База → Обзор).", type: "flag", flag: "major_dead", rew: { money: 400 }, next: "c4_siege" },
  c4_siege: { g: "main", n: "Вторая волна", d: "Без командира военные бросили остров — но на шум сбежались все твари округи. Прими последний бой у базы ночью (База → Обзор).", type: "flag", flag: "c4_held", rew: { money: 1e3 } }
});
const ch4Ready = () => G.w.flags.ch3_end === "stay" && !G.w.flags.ch4;
function startCh4() {
  if (!ch4Ready()) return;
  G.w.flags.ch4 = true;
  G.w.quests.c4_people = "active";
  diaryAdd("📜 началась Глава 4 «Хранитель»");
  FEED("📜 начал Главу 4 «Хранитель»");
  UI.event({ title: "📜 Глава 4 · Хранитель", cls: "good", text: "«Северный» ушёл без тебя, но о маяке узнали на материке. К берегу одна за другой пристают лодки: беженцы, раненые, дети. За ними — те, кому нужен не приют, а Аппарат.\n\nОстров теперь твой. Защити его.", choices: [{ t: "Начать" }] });
  save();
  UI.render();
}
function ch4Check() {
  if (!G.w.flags.ch4) return;
  if (!G.w.flags.c4_npcs && npcs().length >= 3) G.w.flags.c4_npcs = true;
  if (!G.w.flags.c4_towerb && G.w.struct.tower > 0) G.w.flags.c4_towerb = true;
  checkQuests();
}
function attackMajor() {
  if (G.w.quests.c4_major !== "active") return;
  setAct("⚔️ штурмует лагерь военных");
  advance(60);
  if (G.dead) return;
  const en = [mkEnemy("major"), mkEnemy("soldier"), mkEnemy("soldier"), mkEnemy("raider")];
  en.forEach((e, i) => e.dist = i ? 1 : 2);
  UI.log("🎖️ «Сдай остров, и останешься жив», — кричит Майор.", "bad");
  startCombat(en, { road: true, onEnd: (r) => {
    advance(60);
    G.loc = "base";
    G.traveling = false;
    if (r === "win") {
      checkQuests();
      diaryAdd("🎖️ одолел Майора Крайнова");
      UI.event({ title: "🎖️ Лагерь разбит", cls: "good", text: "Майор Крайнов повержен, солдаты бросают оружие и уходят к своим лодкам. Но грохот боя разбудил весь остров…", choices: [{ t: "Вернуться на базу" }] });
    } else UI.event({ title: "🏚️ Отступление", cls: "bad", text: "Лагерь военных оказался крепче. Соберись и попробуй снова.", choices: [{ t: "OK" }] });
    save();
    UI.go("loc");
  } });
}
function finalSiege() {
  if (G.w.quests.c4_siege !== "active" || !atBase()) return;
  if (!isNight()) return UI.toast("Твари придут ночью — возвращайся после 21:00.");
  SND("horde");
  const en = spawnList([["armored", 2, 2], ["hunterN", 2, 2], ["swamper", 1, 1], ["runner", 2, 2]]);
  en.forEach((e, i) => e.dist = i < 3 ? 1 : 2);
  startCombat(en, { road: true, onEnd: (r) => {
    if (r === "win") {
      G.w.flags.c4_held = true;
      checkQuests();
      ending4();
    } else UI.event({ title: "🌑 Отбились не до конца", cls: "bad", text: "Пришлось укрыться в сарае до утра. Следующей ночью они вернутся — будь готов.", choices: [{ t: "OK" }] });
    save();
    UI.render();
  } });
}
function ending4() {
  diaryAdd("🏝️ остров стал домом — конец Главы 4");
  FEED("🏝️ завершил Главу 4 «Хранитель»");
  UI.event({ title: "🏝️ Хранитель острова", cls: "good", text: "Утро тихое. Над лодочной станцией поднимается дым десятка печей, на вышке дежурит ".concat(npcs()[0] ? npcs()[0].name : "жилец", ", дети кормят кота. Аппарат молчит.\n\nТы пришёл сюда, выброшенный морем. Теперь это твой дом, и у него есть хранитель.\n\nСпасибо, что прошёл «Mystery of the Island» до самого конца! Мир остаётся с тобой."), choices: [{ t: "Продолжить" }] });
}
const _extNewDayC4 = extNewDay;
extNewDay = function() {
  _extNewDayC4.apply(this, arguments);
  if (worldAuth() && ch4Ready() && day() >= 2) startCh4();
  ch4Check();
};
const _buildC4 = build;
build = function(id) {
  const r = _buildC4.apply(this, arguments);
  ch4Check();
  return r;
};
const _cuiBaseC4 = CUI.basePanel;
CUI.basePanel = function() {
  let h = "";
  const b = UI.btn, q = G.w.quests;
  if (q.c4_major === "active") h += '<div class="sec"><h2>🎖️ Лагерь военных</h2><p class="muted" style="font-size:13px">Майор Крайнов и его солдаты у блокпоста. Бой тяжёлый — возьми друга, патроны и аптечки.</p><div class="acts">'.concat(b("⚔️ Атаковать лагерь (1 ч пути)", attackMajor, "pri"), "</div></div>");
  if (q.c4_siege === "active") h += '<div class="sec"><h2>🌑 Вторая волна</h2><p class="muted" style="font-size:13px">Твари придут ночью. Подготовь оборону и встречай их у стен.</p><div class="acts">'.concat(b("🛡️ Принять бой", finalSiege, "pri", !isNight()), "</div></div>");
  return h + _cuiBaseC4.apply(this, arguments);
};
const _cuiJourC4 = CUI.jour;
CUI.jour = function() {
  return (ch4Ready() ? '<div class="sec"><h2>📜 Глава 4 «Хранитель»</h2><p class="muted">Ты остался на острове. Теперь его нужно защитить.</p><div class="acts">'.concat(UI.btn("Начать Главу 4", startCh4, "pri"), "</div></div>") : "") + _cuiJourC4.apply(this, arguments);
};
const GUIDE = [
  ["🔴 Выброс", "Предупреждение приходит минимум за час (с радио — за 3 ч, и вверху виден точный прогноз). Пока ты не нажал «Понял», волна до тебя не дойдёт; потом есть время добежать до укрытия — жми «🏃 Бежать в укрытие» на красной плашке. Укрытия: база, деревня, маяк, метеостанция."],
  ["🌕 Кровавая ночь", "Каждый 7-й день в 22:00 (в «Последнем выжившем» — каждый 3-й). За день до неё на базе: колья, факелы, растяжки — временная оборона. Вышка, прожекторы, стены и друг на базе тоже помогают."],
  ["🍽️ Еда и отдых", "«Поесть досыта» ест экономно: скоропорт и дешёвое первым, без перебора; сырое и испорченное — только с вопросом. На базе «🛌 Полностью отдохнуть» = поесть + выспаться + поесть. Плита и костёр дают блюда с бонусами (уха — тепло, рагу — сила, чай — здоровье)."],
  ["🥶 Зима", "Обморожение копится на улице, особенно ночью: тёплая одежда, костёр, уха и согревающая мазь (очаг: травы, тряпка, водка). Капельница на верстаке лечит всё."],
  ["📦 Склад и вещи", "Вещи → «Рюкзак / Склад / Крафт». На складе прямо в строке «⬇️ На склад» и «1». Шаблоны снаряжения «Вылазка/Рейд/Ночёвка» собирают рюкзак одной кнопкой. Выброшенное лежит на земле 3 дня. Журнал склада — кто что брал."],
  ["🔧 Оружие", "Модули (прицел, глушитель, приклад, магазин, шипы, обмотка) — до 2 на ствол: открой модуль в рюкзаке. Мастерство растёт по убийствам (10/30/70). Кузница поселения чинит полностью."],
  ["🚣 Лодка и силки", "Вёсельная лодка (База → Стройка) возит между базой, пляжем, деревней, маяком и сухогрузом почти вдвое быстрее; в грозу нельзя. Силки (верёвка + палка) — в лесу, на ферме, болоте, пляже; проверять через 8 ч."],
  ["🏘️ Поселение", "Зови выживших (нары на базе). 1 жилец — лазарет, 2 — кузница и лавка, 3 — сторожевая вышка. Касса отряда — на складе, деньги не теряются."],
  ["🤝 Вдвоём", "Метки на карте (💰 ☠️ 👑 🏃), дела отряда, общий склад и касса. На хардкоре упавшего друга можно поднять (бинт/аптечка, 10 минут). Хозяин мира может выгнать игрока и откатить мир к утренней копии. Телефон ↔ ПК — «🔗 Играть на другом устройстве»."],
  ["⚔️ Рейды и главари", "Лагеря группировок — База → Рейды. После двух налётов можно бросить вызов главарю: после победы группировка исчезает."],
  ["🗺️ Места и боссы", "Сухогруз (нужен акваланг для затопленного отсека), старая шахта, тюрьма с Надзирателем. После Стража Аппарата открываются Нижние уровни НИИ: 6 ярусов и Обитатель Глубин. Иногда падает самолёт и появляются легендарные звери."],
  ["📜 Главы", "1 — Аппарат в НИИ. 2 «Мастер» — если забрал ядро. 3 «Большая земля» — радио, три шифровки (сухогруз, шахта, тюрьма) и ночь осады. 4 «Хранитель» — если остался на острове."],
  ["🎯 Испытания", "Испытание дня (реальный день), событие недели, заказы торговцев на каждый день, достижения. Своя сложность — внизу Журнала."]
];
const _cuiJourG = CUI.jour;
CUI.jour = function() {
  const open = UI._st.guideOpen;
  const g = '<div class="sec"><div class="sechead"><h2>📖 Справочник</h2>'.concat(UI.btn(open ? "Свернуть" : "Открыть", () => {
    UI._st.guideOpen = !open;
  }, "sm"), "</div>").concat(open ? '<div class="list">'.concat(GUIDE.map(([t, d]) => '<div class="row"><div class="grow"><span class="t">'.concat(t, '</span><span class="s" style="white-space:normal">').concat(d, "</span></div></div>")).join(""), "</div>") : '<p class="muted" style="font-size:13px">Как всё устроено: выброс, Кровавая ночь, еда, зима, склад, оружие, лодка, поселение, игра вдвоём, главы.</p>', "</div>");
  return _cuiJourG.apply(this, arguments) + g;
};
const together = () => !!(G && G.coop && window.COOP && COOP.here && !G.traveling && COOP.here().length);
const _extraModT = extraMod;
extraMod = function(k) {
  let v = _extraModT(k);
  if ((k === "carry" || k === "meleeAcc" || k === "gunAcc" || k === "stress") && together()) v += k === "carry" ? 4 : k === "stress" ? -0.25 : 0.05;
  return v;
};
const _cuiTopT = CUI.top;
CUI.top = function() {
  const h = _cuiTopT.apply(this, arguments);
  if (!together()) return h;
  const names = COOP.here().map((p) => cesc(p.name)).join(", ");
  return '<div class="moods"><span class="mood l0 chip together" title="+4 кг, +5% точности, меньше стресса">🤝 вместе с '.concat(names, "</span></div>") + h;
};
const _markNodeC = CUI.markNode;
CUI.markNode = function(id, l) {
  const h = _markNodeC.apply(this, arguments);
  return (G.w.corpses || []).some((c) => c.loc === id) ? h + '<text x="'.concat(l.x - 7.6, '" y="').concat(l.y + 1.4, '" style="font-size:3.6px">🪦</text>') : h;
};
function themePref() {
  try {
    return localStorage.getItem("moti3_theme") || "auto";
  } catch (e) {
    return "auto";
  }
}
function setTheme(v) {
  try {
    if (v === "auto") localStorage.removeItem("moti3_theme");
    else localStorage.setItem("moti3_theme", v);
  } catch (e) {
  }
  if (window.__tgTheme) window.__tgTheme();
  else {
    if (v === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = v;
  }
  UI.render();
}
window.setTheme = setTheme;
if (typeof document !== "undefined") {
  const tp = themePref();
  if (tp !== "auto") document.documentElement.dataset.theme = tp;
}
const _cuiJourT = CUI.jour;
CUI.jour = function() {
  const t = themePref();
  return _cuiJourT.apply(this, arguments) + '<div class="sec"><h2>🌓 Тема</h2><div class="toggle">'.concat([["auto", "Авто"], ["dark", "Тёмная"], ["light", "Светлая"]].map(([k, n]) => '<button class="'.concat(t === k ? "on" : "", '" onclick="setTheme(\'').concat(k, "')\">").concat(n, "</button>")).join(""), "</div></div>");
};
const UIP = (() => {
  let p = {};
  try {
    p = JSON.parse(localStorage.getItem("moti3_ui") || "{}");
  } catch (e) {
  }
  return Object.assign({ emoji: true, dens: "normal", log: 2, sides: true, art: "big", swipe: true, zoom: "auto" }, p);
})();
function wideFits() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth, h = window.innerHeight;
  return w >= 1130 || w >= 640 && w > h * 1.25;
}
function uiZoom() {
  const v = UIP.zoom;
  if (v && v !== "auto") return +v || 1;
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth, h = window.innerHeight;
  if (wideFits() && UIP.sides !== false && w < 1130) return h < 380 ? 0.72 : h < 520 ? 0.8 : 0.9;
  return 1;
}
function uiWide() {
  return wideFits() && UIP.sides !== false;
}
const uiCompact = () => uiWide() && window.innerWidth < 1130;
function uiApply() {
  if (typeof document === "undefined") return;
  const r = document.documentElement.classList;
  r.toggle("wide", uiWide());
  r.toggle("cmp", uiCompact());
  const z = uiZoom();
  document.documentElement.style.zoom = z === 1 ? "" : String(z);
  r.toggle("noemoji", UIP.emoji === false);
  r.toggle("dens-simple", UIP.dens === "simple");
  r.toggle("dens-detailed", UIP.dens === "detailed");
  r.toggle("nolog", UIP.log === 0);
  r.toggle("art-small", UIP.art === "small");
  r.toggle("art-off", UIP.art === "off");
}
function setUi(k, v) {
  UIP[k] = v;
  try {
    localStorage.setItem("moti3_ui", JSON.stringify(UIP));
  } catch (e) {
  }
  uiApply();
  SIDE.l = SIDE.r = "";
  try {
    sideRender();
  } catch (e) {
  }
  UI.render();
}
window.setUi = setUi;
if (typeof window !== "undefined" && typeof document !== "undefined") {
  uiApply();
  window.addEventListener("resize", uiApply);
}
const EMO_RE = /(?:[☀-➿⬀-⯿⌀-⏿■-◿〰〽]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])(?:️|‍|\uD83C[\uDFFB-\uDFFF]|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF]|[☀-➿]))*/g;
const EMO_KEEP = { "▲": 1, "▼": 1, "▾": 1, "▸": 1, "◂": 1, "▴": 1, "✕": 1, "✓": 1, "✔": 1, "★": 1, "☆": 1, "⋯": 1 };
function noEmo(html) {
  if (UIP.emoji !== false || !html) return html;
  return String(html).split(/(<svg[\s\S]*?<\/svg>)/).map((part, i) => i % 2 ? part : part.replace(EMO_RE, (m) => EMO_KEEP[m] ? m : "").replace(/[️‍]/g, "")).join("");
}
window.noEmo = noEmo;
window.sideDo = function(k, arg) {
  try {
    if (G.combat && k !== "snd" && k !== "sum") return;
    if (k === "fix") quickFix(arg);
    else if (k === "eat") autoEat(false);
    else if (k === "snd") SFX.toggle();
    else if (k === "tab") {
      UI._st.tab = arg;
      UI._st.open = null;
      if (arg !== "loc") UI._st.trader = null;
    }
  } catch (e) {
  }
  SIDE.l = "";
  UI.render();
  sideRender();
};
function meCard() {
  const c = G.ch, w = weather(), hp = healthPct(), toBN = BNP() - (day() - 1) % BNP() - 1;
  const bar = (v, cls) => '<div class="mbar '.concat(cls || "", '"><i style="width:').concat(Math.max(0, Math.min(100, v)), '%" class="').concat(v < 25 ? "bad" : v < 50 ? "warn" : "", '"></i></div>');
  const vit = (ic, n, v) => '<div class="mv"><span>'.concat(ic, " ").concat(n, "</span><b>").concat(Math.round(v), "</b>").concat(bar(v), "</div>");
  const FIX = { "Голод": "eat", "Жажда": "drink", "Кровотечение": "bleed", "Боль": "pain", "Усталость": "sleep" };
  let md = "";
  try {
    md = moodles().map((x) => FIX[x.n] ? '<button class="mood l'.concat(x.l, ' fix" title="').concat(cesc(x.d || ""), "\" onclick=\"sideDo('fix','").concat(FIX[x.n], "')\">").concat(x.ic, " ").concat(cesc(x.n), " ›</button>") : '<span class="mood l'.concat(x.l, '" title="').concat(cesc(x.d || ""), '">').concat(x.ic, " ").concat(cesc(x.n), "</span>")).join("");
  } catch (e) {
  }
  let tog = "";
  try {
    if (together()) tog = '<span class="mood l0 chip together">🤝 вместе сильнее</span>';
  } catch (e) {
  }
  const eat = (c.food < 85 || c.drink < 85) && !G.combat ? '<button class="btn sm" onclick="sideDo(\'eat\')">🍽️ Поесть и попить досыта</button>' : "";
  const on = G.coop && window.COOP ? COOP.others().filter((p) => p.online).length + 1 : 0;
  return '<div class="card me">\n    <div class="mehead"><span class="clock">'.concat(clock(), "</span><div><b>День ").concat(day(), '</b><div class="mono">').concat(w.ic, " ").concat(cesc(w.n), " · ").concat(SEASONS[season()].ic, " ").concat(SEASONS[season()].n, '</div></div><button class="sndbtn" onclick="sideDo(\'snd\')">').concat(SFX.on ? "🔊" : "🔇", '<i class="nel">').concat(SFX.on ? "звук" : "тихо", '</i></button></div>\n    <div class="merow"><span>💰 <b>').concat(G.money, "₽</b></span><span>").concat(toBN === 0 ? '🌕 <b class="bad">сегодня Кровавая ночь</b>' : '🌕<i class="nel">Кровавая ночь</i> через '.concat(toBN, " дн."), "</span>").concat(on ? "<span>🤝 ".concat(on, " в игре").concat(COOP.unread ? " · 💬".concat(COOP.unread) : "", "</span>") : "", '</div>\n    <div class="mvits">').concat(vit("❤️", "Здоровье", hp)).concat(vit("🍗", "Сытость", c.food)).concat(vit("💧", "Вода", c.drink)).concat(vit("⚡", "Силы", c.energy), "</div>\n    ").concat(md || tog ? '<div class="moods">'.concat(tog).concat(md, "</div>") : "").concat(eat ? '<div class="acts">'.concat(eat, "</div>") : "", "\n  </div>");
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  let wasWide = uiWide();
  window.addEventListener("resize", () => {
    const w = uiWide();
    if (w !== wasWide) {
      wasWide = w;
      SIDE.l = SIDE.r = "";
      try {
        UI.render();
      } catch (e) {
      }
    }
  });
}
function uiSettingsHtml() {
  const opt = (k, list) => '<div class="toggle">'.concat(list.map(([v, n]) => '<button class="'.concat(UIP[k] === v ? "on" : "", "\" onclick='setUi(").concat(JSON.stringify(k), ", ").concat(JSON.stringify(v), ")'>").concat(n, "</button>")).join(""), "</div>");
  const row = (t, d, ctl) => '<div class="setrow"><div><b>'.concat(t, "</b>").concat(d ? '<div class="s muted">'.concat(d, "</div>") : "", "</div>").concat(ctl, "</div>");
  const wideOk = wideFits();
  return '<div class="sec"><h2>🖥️ Интерфейс</h2><div class="setlist">\n    '.concat(row("Подробность", "Простой — меньше пояснений и мелкого текста. Подробный — всё сразу.", opt("dens", [["simple", "Простой"], ["normal", "Обычный"], ["detailed", "Подробный"]])), "\n    ").concat(row("Эмодзи", "Убирает значки из текста и кнопок — меньше пестроты.", opt("emoji", [[true, "Показывать"], [false, "Скрыть"]])), "\n    ").concat(row("Лог действий на экранах", "Последние события над экраном. На широком экране они всегда в левой панели.", opt("log", [[0, "Скрыть"], [2, "2 строки"], [4, "4 строки"]])), "\n    ").concat(row("Масштаб", "Размер всего интерфейса. «Авто» уменьшает его, когда телефон повёрнут боком.", opt("zoom", [["auto", "Авто"], ["0.7", "70%"], ["0.8", "80%"], ["0.9", "90%"], ["1", "100%"], ["1.1", "110%"]])), "\n    ").concat(row("Свайпы", "Провёл пальцем влево или вправо по экрану — соседний раздел (Карта ↔ Место ↔ Вещи ↔ Тело ↔ База ↔ Журнал).", opt("swipe", [[true, "Вкл"], [false, "Выкл"]])), "\n    ").concat(row("Картинки мест", "Маленькие или скрытые — больше места для дела, особенно на телефоне.", opt("art", [["big", "Большие"], ["small", "Маленькие"], ["off", "Скрыть"]])), "\n    ").concat(row("Боковые панели", wideOk ? "Часы, полоски, предупреждения и отряд — по бокам, центр свободнее." : "Работают на широком экране (ПК или телефон боком).", opt("sides", [[true, "Вкл"], [false, "Выкл"]])), "\n    ").concat(sideSettingsHtml(), "\n    ").concat(typeof G !== "undefined" && G ? row("Испорченная еда", "Сама уходит в компост (удобрение для огорода) и приманку (рыбалка, силки). Иначе — кнопкой у предмета.", '<div class="toggle"><button class="'.concat(G.w.autoRot !== false ? "on" : "", '" onclick="setAutoRot(true)">Авто</button><button class="').concat(G.w.autoRot === false ? "on" : "", '" onclick="setAutoRot(false)">Вручную</button></div>')) : "", "\n  </div></div>");
}
if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
  const strip = (root) => {
    if (UIP.emoji !== false || !root) return;
    if (root.nodeType === 3) {
      const v = root.nodeValue, n = noEmo(v);
      if (n !== v) root.nodeValue = n;
      return;
    }
    if (root.nodeType !== 1 || root.closest && root.closest("svg")) return;
    const w = document.createTreeWalker(root, 4, null, false);
    let t;
    while (t = w.nextNode()) {
      if (t.parentNode && t.parentNode.closest && t.parentNode.closest("svg")) continue;
      const v = t.nodeValue, n = noEmo(v);
      if (n !== v) t.nodeValue = n;
    }
  };
  const start = () => {
    const mo = new MutationObserver((ms) => {
      if (UIP.emoji !== false) return;
      for (const m of ms) for (const n of m.addedNodes) if (!(n.id === "main" || n.parentNode && n.parentNode.id === "main")) strip(n);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
}
const SLAY = { drag: null };
function layGet() {
  const L2 = UIP.lay || (UIP.lay = {});
  L2.L = L2.L || [];
  L2.R = L2.R || [];
  L2.col = L2.col || {};
  L2.hid = L2.hid || {};
  L2.h = L2.h || {};
  return L2;
}
function laySave() {
  try {
    localStorage.setItem("moti3_ui", JSON.stringify(UIP));
  } catch (e) {
  }
  SIDE.l = SIDE.r = "";
  sideRender();
}
function cardId(el) {
  if (el.classList.contains("me")) return "me";
  const h = el.querySelector("h3");
  let t = h ? h.textContent : "";
  t = t.replace(EMO_RE, "").replace(/[️‍]/g, "").replace(/[·:].*$/, "").trim().toLowerCase();
  return t || "card";
}
function cardName(id) {
  return id === "me" ? "Персонаж" : id.charAt(0).toUpperCase() + id.slice(1);
}
function sideLayout(lHtml, rHtml) {
  const L2 = layGet(), all = {}, origin = {};
  const take2 = (html, side) => {
    const box = document.createElement("div");
    box.innerHTML = html;
    [...box.children].forEach((el) => {
      if (!el.classList.contains("card")) return;
      let id = cardId(el);
      while (all[id]) id += "+";
      all[id] = el;
      origin[id] = side;
    });
  };
  take2(lHtml, "L");
  take2(rHtml, "R");
  const placed = {}, cols = { L: [], R: [] };
  for (const sd of ["L", "R"]) for (const id of L2[sd]) if (all[id] && !placed[id]) {
    cols[sd].push(id);
    placed[id] = 1;
  }
  for (const id in all) if (!placed[id]) cols[origin[id]].push(id);
  const out = (sd) => cols[sd].filter((id) => !L2.hid[id]).map((id) => {
    const el = all[id], col = !!L2.col[id], j = JSON.stringify(id), q = j.replace(/"/g, "&quot;");
    let h = el.querySelector("h3");
    if (!h) {
      h = document.createElement("h3");
      h.textContent = cardName(id);
      el.insertBefore(h, el.firstChild);
    }
    el.setAttribute("data-cid", id);
    el.setAttribute("draggable", "true");
    el.setAttribute("ondragstart", "sideDrag(event, ".concat(j, ")"));
    el.setAttribute("ondragend", "sideDragEnd()");
    el.setAttribute("ondragover", "sideOver(event)");
    el.setAttribute("ondrop", "sideDrop(event, ".concat(j, ")"));
    if (col) el.classList.add("col");
    else if (L2.h[id]) {
      el.classList.add("sized");
      el.setAttribute("style", "height:".concat(L2.h[id], "px"));
    }
    {
      const bd = document.createElement("div");
      bd.className = "cbody";
      [...el.childNodes].forEach((ch2) => {
        if (ch2 !== h) bd.appendChild(ch2);
      });
      el.appendChild(bd);
    }
    if (!col) {
      const g = document.createElement("span");
      g.className = "cres";
      g.title = "Потяни — изменить высоту (двойной клик — как было)";
      g.setAttribute("onpointerdown", "sideRes(event, ".concat(j, ")"));
      g.setAttribute("ondblclick", "sideResReset(".concat(j, ")"));
      el.appendChild(g);
    }
    const ctl = document.createElement("span");
    ctl.className = "cctl";
    ctl.innerHTML = '<span class="grip" title="Перетащи, чтобы переставить">⠿</span><button title="'.concat(col ? "Развернуть" : "Свернуть", '" onclick="sideCol(').concat(q, ')">').concat(col ? "▸" : "▾", '</button><button title="Скрыть (вернуть — в Журнал → Настройки)" onclick="sideHide(').concat(q, ')">✕</button>');
    h.classList.add("chead");
    h.appendChild(ctl);
    h.setAttribute("ondblclick", "sideCol(".concat(j, ")"));
    return el.outerHTML;
  }).join("") + '<div class="sdrop" ondragover="sideOver(event)" ondrop="sideDrop(event, null, \''.concat(sd, "')\"></div>");
  return [out("L"), out("R")];
}
function sideBox(P, w) {
  let b = P.querySelector(".sidein");
  if (!b) {
    P.innerHTML = '<div class="sidein"></div><div class="sgrip" title="Потяни, чтобы изменить ширину" onpointerdown="sideGrip(event, \''.concat(w, "')\"></div>");
    b = P.querySelector(".sidein");
  }
  return b;
}
function sideWidth() {
  const L2 = layGet(), max = uiCompact() ? Math.max(170, window.innerWidth / uiZoom() * 0.36) : Math.max(200, (window.innerWidth - 720) / 2 - 24), r = document.documentElement.style;
  const mn = uiCompact() ? 160 : 200;
  if (L2.wl) r.setProperty("--swl", Math.min(max, Math.max(mn, L2.wl)) + "px");
  else r.removeProperty("--swl");
  if (L2.wr) r.setProperty("--swr", Math.min(max, Math.max(mn, L2.wr)) + "px");
  else r.removeProperty("--swr");
}
window.sideCol = (id) => {
  const L2 = layGet();
  L2.col[id] = !L2.col[id];
  if (!L2.col[id]) delete L2.col[id];
  laySave();
};
window.sideHide = (id) => {
  const L2 = layGet();
  L2.hid[id] = 1;
  laySave();
  UI.toast("Карточка скрыта. Вернуть — Журнал → Настройки.");
};
window.sideShow = (id) => {
  const L2 = layGet();
  delete L2.hid[id];
  laySave();
  UI.render();
};
window.sideReset = () => {
  UIP.lay = {};
  laySave();
  UI.render();
};
window.sideDrag = (ev, id) => {
  if (SLAY.rs) {
    ev.preventDefault();
    return;
  }
  SLAY.drag = id;
  try {
    ev.dataTransfer.setData("text/plain", id);
    ev.dataTransfer.effectAllowed = "move";
  } catch (e) {
  }
  setTimeout(() => {
    const el = document.querySelector('[data-cid="'.concat(typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id.replace(/"/g, ""), '"]'));
    if (el) el.classList.add("dragging");
  }, 0);
};
window.sideDragEnd = () => {
  SLAY.drag = null;
  document.querySelectorAll(".side .dragging, .side .over").forEach((x) => x.classList.remove("dragging", "over"));
  SIDE.l = "";
  sideRender();
};
window.sideOver = (ev) => {
  if (!SLAY.drag) return;
  ev.preventDefault();
  document.querySelectorAll(".side .over").forEach((x) => x.classList.remove("over"));
  const t = ev.currentTarget;
  if (t) t.classList.add("over");
};
window.sideDrop = (ev, target, sideHint) => {
  ev.preventDefault();
  ev.stopPropagation();
  const id = SLAY.drag;
  SLAY.drag = null;
  if (!id || id === target) return sideDragEnd();
  const L2 = layGet(), cur = { L: [...document.querySelectorAll("#sideL [data-cid]")].map((x) => x.getAttribute("data-cid")), R: [...document.querySelectorAll("#sideR [data-cid]")].map((x) => x.getAttribute("data-cid")) };
  for (const sd2 of ["L", "R"]) cur[sd2] = cur[sd2].filter((x) => x !== id);
  let sd = sideHint, pos = -1;
  if (target) {
    sd = cur.L.includes(target) ? "L" : "R";
    pos = cur[sd].indexOf(target);
    const el = ev.currentTarget, r = el.getBoundingClientRect();
    if (ev.clientY > r.top + r.height / 2) pos++;
  }
  if (pos < 0) cur[sd].push(id);
  else cur[sd].splice(pos, 0, id);
  for (const s2 of ["L", "R"]) for (const h of L2[s2]) if (L2.hid[h] && !cur.L.includes(h) && !cur.R.includes(h)) cur[s2].push(h);
  L2.L = cur.L;
  L2.R = cur.R;
  sideDragEnd();
  laySave();
};
window.sideGrip = (ev, w) => {
  ev.preventDefault();
  const L2 = layGet(), P = document.getElementById(w === "l" ? "sideL" : "sideR"), x0 = ev.clientX, w0 = P.getBoundingClientRect().width;
  const inv = uiCompact() ? -1 : 1;
  const zz = parseFloat(document.documentElement.style.zoom) || 1;
  const mv = (e) => {
    const d = (w === "l" ? x0 - e.clientX : e.clientX - x0) * inv;
    L2[w === "l" ? "wl" : "wr"] = Math.round((w0 + d) / zz);
    sideWidth();
  };
  const up = () => {
    window.removeEventListener("pointermove", mv);
    window.removeEventListener("pointerup", up);
    try {
      localStorage.setItem("moti3_ui", JSON.stringify(UIP));
    } catch (e) {
    }
  };
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
};
function sideSettingsHtml() {
  const L2 = layGet(), hid = Object.keys(L2.hid);
  return '<div class="setrow"><div><b>Карточки по бокам</b><div class="s muted">Тащи карточку за шапку — переставить или перенести на другую сторону. ▾ — свернуть, ✕ — скрыть. Уголок внизу карточки — высота (двойной клик — как было). Край панели — ширина.</div></div>\n    '.concat(hid.length ? '<div class="acts">'.concat(hid.map((id) => '<button class="btn sm" onclick=\'sideShow('.concat(JSON.stringify(id), ")'>Вернуть: ").concat(cesc(cardName(id)), "</button>")).join(""), "</div>") : "", '\n    <div class="acts"><button class="btn sm" onclick="sideReset()">Сбросить раскладку</button></div></div>');
}
function autoSmokeTick(o) {
  const c = G.ch, lim = c.autoSmoke | 0;
  if (!lim || G.combat || o && o.sleep || G.dead) return;
  if (G.time - (c.lastSmoke || 0) < 90) return;
  const withdraw = hasTrait("smoker") && G.time - (c.lastSmoke || 0) > 12 * H;
  if (c.stress < lim && !withdraw) return;
  const has = G.inv.find((e) => IT(e.id).smoke) || atBase() && G.stash.find((e) => IT(e.id).smoke);
  if (!has) return;
  useItem(has.id, true);
  if (typeof sideRender === "function") {
    SIDE.l = "";
  }
}
const _tickSm = tick;
tick = function(st, o) {
  _tickSm.apply(this, arguments);
  try {
    if (G && !G.dead) {
      autoSmokeTick(o);
      workTick(st);
    }
  } catch (e) {
    console.warn(e);
  }
};
window.setAutoSmoke = (v) => {
  G.ch.autoSmoke = v;
  save();
  UI.render();
};
function virusCard() {
  const c = G.ch;
  if (!F().virus || !c.virus) return "";
  const left = Math.max(0, Math.round((96 * H - (G.time - c.virus)) / H)), have = G.inv.find((e) => e.id === "serum") || atBase() && G.stash.find((e) => e.id === "serum");
  return '<div class="viruscard '.concat(left <= 24 ? "crit" : "", '"><div><b>🦠 Ты заражён вирусом</b> — через ~').concat(left, " ч обратишься (").concat(Math.floor(left / 24), " сут. ").concat(left % 24, ' ч).</div><div class="s">Заражение было от укуса. Лечится только сывороткой: у Левина, у кочевого торговца или в лабораториях.</div>').concat(have ? '<div class="acts">'.concat(UI.btn("🧪 Вколоть сыворотку", () => useItem("serum"), "pri sm"), "</div>") : "", "</div>");
}
const _extChar = EXTUI.charPanel;
EXTUI.charPanel = function() {
  const v = G.ch.autoSmoke | 0, n = G.inv.filter((e) => IT(e.id).smoke).reduce((a, e) => a + e.n, 0);
  return '<div class="sec"><h2>🚬 Автокурение</h2><div class="toggle">'.concat([[0, "Выкл"], [40, "Стресс 40+"], [60, "60+"], [80, "80+"]].map(([k, t]) => '<button class="'.concat(v === k ? "on" : "", '" onclick="setAutoSmoke(').concat(k, ')">').concat(t, "</button>")).join(""), '</div><p class="muted" style="font-size:13px">Закурит сам, когда стресс дойдёт до порога').concat(hasTrait("smoker") ? " или начнётся ломка" : "", ". Не в бою и не во сне. Сигарет в рюкзаке: ").concat(n).concat(atBase() ? ", на складе: " + G.stash.filter((e) => IT(e.id).smoke).reduce((a, e) => a + e.n, 0) : "", ".</p></div>") + _extChar.apply(this, arguments);
};
window.virusCard = virusCard;
NPC_ROLES.cook = { n: "Повар", ic: "🍳", d: "готовит еду со склада по заказам: жарит, коптит, варит" };
NPC_ROLES.crafter.d = "выполняет заказы: доски, вещи, постройки; латает стены";
const WORKERS = { cook: 1, crafter: 1 };
STATION_N.stove = "плита";
function baseSt(st) {
  const s = G.w.struct;
  if (!st) return true;
  if (st === "fire") return s.fire > 0;
  if (st === "smoke") return s.smoke > 0;
  if (st === "distill") return s.distill > 0 && s.fire > 0;
  if (st === "bench") return s.bench > 0;
  if (st === "bench2") return s.bench > 1;
  if (st === "stove") return s.stove > 0;
  return false;
}
const isCookR = (r) => Object.keys(r.out).some((k) => ["food", "drink"].includes(IT(k).c) && k !== "bottle");
function wRecipes(role, all) {
  return RECIPES.filter((r) => (role === "cook" ? isCookR(r) : !isCookR(r)) && !(r.ch2 && !CH2()) && !(r.bp && !G.w.bp[r.bp]) && (all || baseSt(r.st)));
}
const recById = (id) => RECIPES.find((r) => r.id === id);
const mainOut = (r) => Object.keys(r.out).find((k) => k !== "bottle") || Object.keys(r.out)[0];
const scnt = (id) => cnt(G.stash, id);
function planStep(id, qty, role, depth, miss, seen) {
  if (scnt(id) >= qty) return "ok";
  if (depth > 4 || seen[id]) {
    if (miss) miss[id] = Math.max(miss[id] || 0, qty - scnt(id));
    return null;
  }
  const rs = wRecipes(role).filter((r) => r.out[id]).sort((a, b) => (b.st ? 1 : 0) - (a.st ? 1 : 0));
  const s2 = Object.assign({}, seen, { [id]: 1 });
  for (let i = 0; i < rs.length; i++) {
    const r = rs[i], m = i === 0 ? miss : null;
    let ready = true, sub = null;
    for (const [k, v] of Object.entries(r.need)) {
      const res = planStep(k, v, role, depth + 1, m, s2);
      if (res === "ok") continue;
      ready = false;
      if (res && !sub) sub = res;
    }
    if (ready) return r;
    if (sub) return sub;
  }
  if (!rs.length && miss) miss[id] = Math.max(miss[id] || 0, qty - scnt(id));
  return null;
}
function planNeeds(need, role, miss) {
  for (const [k, v] of Object.entries(need)) {
    const r = planStep(k, v, role, 1, miss, {});
    if (r !== "ok") return r;
  }
  return "ok";
}
function orderDone(o) {
  if (o.t === "s") return (G.w.struct[o.id] || 0) >= o.lv || !STRUCT[o.id];
  if (o.mode === "n") return (o.made || 0) >= o.n;
  return false;
}
function orderLabel(o) {
  if (o.t === "auto") return "Готовить всё сырое со склада";
  if (o.t === "s") {
    const S = STRUCT[o.id];
    return S ? "".concat(S.ic, " Построить: ").concat(S.lv[o.lv] ? S.lv[o.lv].n : S.n) : "?";
  }
  const r = recById(o.id);
  if (!r) return "?";
  const it = IT(mainOut(r));
  return "".concat(it.ic, " ").concat(r.n) + (o.mode === "inf" ? " · постоянно" : o.mode === "n" ? " · ".concat(o.made || 0, " из ").concat(o.n) : " · держать ".concat(o.n, " (есть ").concat(scnt(mainOut(r)), ")"));
}
function orderStep(o, role) {
  const miss = {};
  if (o.t === "auto") {
    for (const e of G.stash) {
      const it = IT(e.id);
      if (!it.raw || !it.cook || it.sp && freshness(e) >= 1) continue;
      const r2 = wRecipes("cook").find((r3) => r3.out[it.cook] && r3.need[e.id] && Object.keys(r3.need).length === 1 && scnt(e.id) >= r3.need[e.id]);
      if (r2) return { r: r2, own: true };
    }
    return { wait: "нет сырого на складе" };
  }
  if (o.t === "s") {
    const S = STRUCT[o.id], lv = G.w.struct[o.id] || 0, nx = S && S.lv[lv + 1];
    if (!nx) return { wait: "уже построено" };
    if (S.bp && !G.w.bp[S.bp]) return { wait: "нет чертежа" };
    const cost = buildCost(nx.c), p2 = planNeeds(cost, role, miss);
    if (p2 === "ok") return { b: o.id, cost, lv };
    if (p2) return { r: p2 };
    return { wait: missText(miss) };
  }
  const r = recById(o.id);
  if (!r) return { wait: "—" };
  if (!baseSt(r.st)) return { wait: "нужна станция: " + (STATION_N[r.st] || r.st) };
  if (o.mode === "stock" && scnt(mainOut(r)) >= o.n) return { wait: "запас полный", idle: 1 };
  const p = planNeeds(r.need, role, miss);
  if (p === "ok") return { r, own: true };
  if (p) return { r: p };
  return { wait: missText(miss) };
}
const missText = (miss) => {
  const e = Object.entries(miss);
  return e.length ? "ждёт: " + e.map(([k, v]) => "".concat(IT(k).ic).concat(IT(k).n, " ×").concat(v)).join(", ") : "нет материалов";
};
function workerStep(n) {
  const q = n.q || [];
  let firstWait = null;
  for (const o of q) {
    if (orderDone(o)) continue;
    const s = orderStep(o, n.role);
    if (s.r || s.b) return Object.assign(s, { o });
    if (!firstWait && !s.idle) firstWait = s.wait;
  }
  return { wait: q.filter((o) => !orderDone(o)).length ? firstWait || "всё сделано" : "нет заказов" };
}
function workDo(n, s) {
  const add = (k, v) => {
    n.today = n.today || {};
    n.today[k] = (n.today[k] || 0) + v;
  };
  if (s.b) {
    for (const [k, v] of Object.entries(s.cost)) take(G.stash, k, v);
    const S = STRUCT[s.b], nx = S.lv[s.lv + 1];
    G.w.struct[s.b] = s.lv + 1;
    if (s.b === "walls") G.w.wallHp = 100;
    UI.log("🏗️ ".concat(n.name, " построил: ").concat(S.ic, " ").concat(nx.n, "."), "good");
    FEED("🏗️ ".concat(n.name, " построил: ").concat(S.ic, " ").concat(nx.n));
    if (s.b === "radio") {
      G.w.flags.radio_built = true;
    }
    return;
  }
  const r = s.r;
  for (const [k, v] of Object.entries(r.need)) take(G.stash, k, v);
  for (const [k, v] of Object.entries(r.out)) {
    invAdd(G.stash, k, v);
    if (k !== "bottle") add(k, v);
  }
  if (s.own && s.o && s.o.mode === "n") s.o.made = (s.o.made || 0) + 1;
}
const stepCost = (s) => s.b ? 60 + s.lv * 30 : Math.max(5, s.r.t || 20);
function workTick(st) {
  if (!worldAuth() || !G.w.npcs || !G.w.npcs.length) return;
  let changed = false;
  for (const n of G.w.npcs) {
    if (n.exp) continue;
    if (n.role === "crafter" && npcRepairTick(n, st)) {
      changed = true;
      continue;
    }
    if (!WORKERS[n.role]) continue;
    if (n.role === "cook" && !n.q) n.q = [{ t: "auto" }];
    if (!n.q || !n.q.length) continue;
    if (n.shift === "off" || n.car) continue;
    const rate = (n.morale < 30 ? 0.25 : 0.5) * skMul(n, ROLE_SK[n.role]) * workMul(n);
    n.wt = Math.min(240, (n.wt || 0) + st * rate);
    for (let k = 0; k < 6; k++) {
      const s = workerStep(n);
      if (!(s.r || s.b)) {
        n.now = s.wait;
        break;
      }
      const c = stepCost(s);
      n.now = s.b ? "строит: ".concat(STRUCT[s.b].n) : "делает: ".concat(s.r.n);
      if (n.wt < c) break;
      n.wt -= c;
      workDo(n, s);
      changed = true;
      npcXp(n, ROLE_SK[n.role], 0.25);
    }
    n.q = n.q.filter((o) => !orderDone(o));
  }
  if (changed && G.coop && window.COOP) COOP.sync();
}
const _npcDailyW = npcDaily;
npcDaily = function() {
  const old = {};
  for (const n of npcs()) if (n.role === "crafter" && n.q && n.q.length) {
    old[n.id] = cnt(G.stash, "wood");
  }
  const saved = [];
  for (const n of npcs()) if (n.role === "crafter" && n.q && n.q.length) {
    saved.push(n);
    n.role = "_crafter";
  }
  _npcDailyW.apply(this, arguments);
  for (const n of saved) {
    n.role = "crafter";
    if (G.w.struct.walls && G.w.wallHp < 100) G.w.wallHp = Math.min(100, G.w.wallHp + 10);
  }
  const out = [];
  for (const n of npcs()) {
    if (n.today && Object.keys(n.today).length) out.push("".concat(NPC_ROLES[n.role] ? NPC_ROLES[n.role].ic : "", " ").concat(n.name, ": ").concat(Object.entries(n.today).map(([k, v]) => IT(k).ic + "×" + v).join(" ")));
    n.yday = n.today || {};
    n.today = {};
  }
  if (out.length) UI.log("🏭 Работа поселения за день: " + out.join(" · "), "sys");
};
const npcBy = (id) => npcs().find((x) => x.id === id);
function wEdit(fn) {
  fn();
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
window.wMove = (id, i, d) => wEdit(() => {
  const n = npcBy(id);
  if (!n || !n.q) return;
  const j = i + d;
  if (j < 0 || j >= n.q.length) return;
  const t = n.q[i];
  n.q[i] = n.q[j];
  n.q[j] = t;
});
window.wDel = (id, i) => wEdit(() => {
  const n = npcBy(id);
  if (n && n.q) n.q.splice(i, 1);
});
function wAdd(id, o) {
  wEdit(() => {
    const n = npcBy(id);
    if (!n) return;
    n.q = n.q || [];
    n.q.push(o);
  });
  UI.toast("Заказ добавлен в очередь");
}
function roleMenu(id) {
  const n = npcBy(id);
  if (!n) return;
  UI.event({ title: "".concat(n.name, ": занятие"), text: "Чем ему заниматься на базе?", choices: Object.entries(NPC_ROLES).map(([k, R0]) => ({ t: "".concat(R0.ic, " ").concat(R0.n).concat(n.role === k ? " (сейчас)" : "", " — ").concat(R0.d), fn: () => wEdit(() => {
    n.role = k;
    if (k === "cook" && !n.q) n.q = [{ t: "auto" }];
  }) })).concat([{ t: "Отмена" }]) });
}
window.wRole = roleMenu;
function modeMenu(id, r) {
  const out = IT(mainOut(r));
  UI.event({ title: "".concat(out.ic, " ").concat(r.n), text: "Сколько делать? Материалы: ".concat(Object.entries(r.need).map(([k, v]) => "".concat(IT(k).ic).concat(IT(k).n, " ×").concat(v)).join(", "), ".").concat(r.st ? " Нужна станция: ".concat(STATION_N[r.st] || r.st).concat(baseSt(r.st) ? " ✓" : " — ещё не построена", ".") : ""), choices: [
    { t: "♾️ Постоянно — пока есть материалы", fn: () => wAdd(id, { t: "r", id: r.id, mode: "inf" }) },
    ...[1, 5, 10].map((k) => ({ t: "🔢 Сделать ×".concat(k), fn: () => wAdd(id, { t: "r", id: r.id, mode: "n", n: k, made: 0 }) })),
    ...[5, 10, 20].map((k) => ({ t: "📦 Держать на складе ".concat(k, " шт."), fn: () => wAdd(id, { t: "r", id: r.id, mode: "stock", n: k }) })),
    { t: "Отмена" }
  ] });
}
function orderMenu(id) {
  const n = npcBy(id);
  if (!n) return;
  const rs = wRecipes(n.role, true);
  const ch2 = rs.map((r) => ({ t: "".concat(IT(mainOut(r)).ic, " ").concat(r.n).concat(baseSt(r.st) ? "" : " (нужна: ".concat(STATION_N[r.st] || r.st, ")")), fn: () => setTimeout(() => modeMenu(id, r), 0) }));
  if (n.role === "cook" && !(n.q || []).some((o) => o.t === "auto")) ch2.unshift({ t: "♻️ Готовить всё сырое со склада (чтобы не портилось)", fn: () => wAdd(id, { t: "auto" }) });
  if (n.role === "crafter") ch2.unshift({ t: "🏗️ Постройку…", fn: () => setTimeout(() => structMenu(id), 0) });
  UI.event({ title: "".concat(NPC_ROLES[n.role].ic, " Заказ для: ").concat(n.name), text: n.role === "cook" ? "Что готовить? Берёт со склада, кладёт на склад." : "Что делать? Если не хватает материала, который можно сделать (доски из дров и т.п.), он сначала сделает его.", choices: ch2.concat([{ t: "Отмена" }]) });
}
function structMenu(id) {
  const ch2 = [];
  for (const k in STRUCT) {
    const S = STRUCT[k], lv = G.w.struct[k] || 0, nx = S.lv[lv + 1];
    if (!nx || S.ch2 && !CH2() || S.bp && !G.w.bp[S.bp]) continue;
    ch2.push({ t: "".concat(S.ic, " ").concat(nx.n, " — ").concat(Object.entries(buildCost(nx.c)).map(([i, v]) => "".concat(IT(i).ic).concat(v)).join(" ")), fn: () => wAdd(id, { t: "s", id: k, lv: lv + 1 }) });
  }
  UI.event({ title: "🏗️ Что построить?", text: "Мастер соберёт материалы со склада (и сделает недостающие доски и т.п.), потом построит.", choices: ch2.concat([{ t: "Отмена" }]) });
}
window.wOrder = orderMenu;
function orderStructBtn(k) {
  const m = npcs().find((n) => n.role === "crafter");
  if (!m) return "";
  const lv = G.w.struct[k] || 0, S = STRUCT[k];
  if (!S.lv[lv + 1] || S.bp && !G.w.bp[S.bp]) return "";
  if ((m.q || []).some((o) => o.t === "s" && o.id === k)) return '<span class="chip">заказано мастеру</span>';
  return UI.btn("🔨 Заказать мастеру", () => wAdd(m.id, { t: "s", id: k, lv: lv + 1 }), "sm");
}
CUI.orderStruct = orderStructBtn;
function workPanel() {
  const list = npcs(), b = UI.btn;
  if (!list.length) return EXTUI.basePanel();
  let h = '<div class="sec"><h2>🏘️ Жильцы '.concat(list.length, "/").concat(bunkCap(), '</h2><p class="muted" style="font-size:13px">Жильцы едят и пьют со склада раз в день. Повар и мастер работают по очереди заказов: сверху — важнее. Берут со склада, кладут на склад. Работают примерно полдня в сутки').concat(G.coop ? "; в кооперативе — пока ведущий в игре" : "", '.</p><div class="list">');
  for (const n of list) {
    const R0 = NPC_ROLES[n.role] || { ic: "👤", n: n.role }, wk = WORKERS[n.role];
    const q = n.q || [];
    let body = "";
    if (wk) {
      const today = n.today && Object.keys(n.today).length ? Object.entries(n.today).map(([k, v]) => "".concat(IT(k).ic).concat(IT(k).n, " ×").concat(v)).join(", ") : "";
      const ws = workerStep(n), nowT = ws.r || ws.b ? ws.b ? "строит: ".concat(STRUCT[ws.b].n) : "делает: ".concat(ws.r.n) : ws.wait;
      body += '<div class="wnow '.concat(ws.r || ws.b ? "" : "warn", '">').concat(esc2(nowT), "</div>");
      if (today) body += '<div class="s muted">Сегодня: '.concat(today, "</div>");
      body += q.length ? '<div class="wq">'.concat(q.map((o, i) => {
        const s = orderStep(o, n.role);
        const ok = s.r || s.b;
        return '<div class="wqi"><span class="wn">'.concat(i + 1, '</span><div class="grow"><span>').concat(orderLabel(o), '</span><span class="s ').concat(ok ? "good" : s.idle ? "muted" : "warn", '">').concat(ok ? s.own || s.b ? "в работе" : "сначала: " + s.r.n : esc2(s.wait), '</span></div><span class="wbtn"><button onclick="wMove(\'').concat(n.id, "',").concat(i, ',-1)" ').concat(i ? "" : "disabled", ' title="Выше">▲</button><button onclick="wMove(\'').concat(n.id, "',").concat(i, ',1)" ').concat(i < q.length - 1 ? "" : "disabled", ' title="Ниже">▼</button><button onclick="wDel(\'').concat(n.id, "',").concat(i, ')" title="Убрать">✕</button></span></div>');
      }).join(""), "</div>") : "";
      body += '<div class="acts">'.concat(b("➕ Заказ", () => orderMenu(n.id), "sm pri")).concat(b("Сменить занятие", () => roleMenu(n.id), "sm"), "</div>");
    } else body += '<div class="s muted">'.concat(R0.d, '</div><div class="acts">').concat(b("Сменить занятие", () => roleMenu(n.id), "sm"), "</div>");
    if (n.exp) body = npcExpHtml(n);
    h += '<div class="row wrow"><span class="ic">'.concat(R0.ic, '</span><div class="grow"><div class="sechead"><span class="t">').concat(esc2(n.name), " · ").concat(R0.n, '</span><span class="mono muted" style="font-size:12px">').concat(n.hp != null && n.hp < 100 ? "❤️ ".concat(Math.round(n.hp), " · ") : "", "настроение ").concat(Math.round(n.morale), "</span></div>").concat(uiBar(n.morale, 100)).concat(body).concat(npcGearHtml(n), '<div class="acts" style="justify-content:flex-end">').concat(b("Выгнать", () => dismissNpc(n.id), "sm"), "</div></div></div>");
  }
  return h + "</div></div>";
}
const esc2 = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
CUI.work = workPanel;
window.sideRes = (ev, id) => {
  ev.preventDefault();
  ev.stopPropagation();
  const now = Date.now();
  if (SLAY.lastRes && SLAY.lastRes.id === id && now - SLAY.lastRes.t < 400) {
    SLAY.lastRes = null;
    return sideResReset(id);
  }
  SLAY.lastRes = { id, t: now };
  const card = ev.target.closest(".card");
  if (!card) return;
  const L2 = layGet(), y0 = ev.clientY, h0 = card.getBoundingClientRect().height;
  SLAY.rs = id;
  SLAY.drag = "__rs";
  card.setAttribute("draggable", "false");
  card.classList.add("sized", "resizing");
  const zz = parseFloat(document.documentElement.style.zoom) || 1;
  const mv = (e) => {
    const h = Math.max(48, Math.round((h0 + e.clientY - y0) / zz));
    card.style.height = h + "px";
    L2.h[id] = h;
  };
  let moved = false;
  const mv0 = mv;
  const up = () => {
    window.removeEventListener("pointermove", mv1);
    window.removeEventListener("pointerup", up);
    SLAY.rs = null;
    SLAY.drag = null;
    if (moved) laySave();
    else {
      card.setAttribute("draggable", "true");
      card.classList.remove("resizing");
      if (!L2.h[id]) card.classList.remove("sized");
    }
  };
  const mv1 = (e) => {
    moved = true;
    mv0(e);
  };
  window.addEventListener("pointermove", mv1);
  window.addEventListener("pointerup", up);
};
window.sideResReset = (id) => {
  const L2 = layGet();
  delete L2.h[id];
  laySave();
};
const SWIPE_TABS = ["map", "loc", "inv", "char", "base", "jour"];
if (typeof document !== "undefined") (() => {
  let s = null;
  const blocked = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentNode) {
      if (n.nodeType !== 1) continue;
      if (n.id === "main") return false;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.id === "modal" || n.classList.contains("side")) return true;
      if (n.scrollWidth > n.clientWidth + 4) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
    }
    return false;
  };
  document.addEventListener("touchstart", (e) => {
    s = null;
    if (UIP.swipe === false || e.touches.length !== 1 || typeof G === "undefined" || !G || G.dead) return;
    const t = e.touches[0];
    if (t.clientX < 24 || t.clientX > window.innerWidth - 24) return;
    const mo = document.getElementById("modal");
    if (mo && mo.innerHTML.trim()) return;
    if (!e.target.closest || !e.target.closest("#main") || blocked(e.target)) return;
    s = { x: t.clientX, y: t.clientY, at: Date.now() };
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (!s) return;
    const t = e.changedTouches[0], dx = t.clientX - s.x, dy = t.clientY - s.y, dt = Date.now() - s.at;
    s = null;
    if (dt > 700 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2) return;
    if (G.combat || G.traveling) return;
    const st = UI._st, i = SWIPE_TABS.indexOf(st.tab === "room" ? "loc" : st.tab);
    if (i < 0) return;
    const j = i + (dx < 0 ? 1 : -1);
    if (j < 0 || j >= SWIPE_TABS.length) return;
    const mn = document.getElementById("main");
    if (mn) {
      mn.classList.remove("swl", "swr");
      void mn.offsetWidth;
      mn.classList.add(dx < 0 ? "swl" : "swr");
      setTimeout(() => mn.classList.remove("swl", "swr"), 260);
    }
    st.open = null;
    if (SWIPE_TABS[j] !== "loc") st.trader = null;
    UI.go(SWIPE_TABS[j]);
    try {
      if (window.TGA && TGA.tg && TGA.tg.HapticFeedback) TGA.tg.HapticFeedback.selectionChanged();
    } catch (x) {
    }
  }, { passive: true });
})();
if (typeof window !== "undefined" && window.__BUILD && typeof fetch === "function") (() => {
  const check = () => {
    if (typeof G !== "undefined" && G && (G.combat || G.traveling)) return;
    fetch("version.json?t=" + Date.now(), { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((j) => {
      if (!j || !j.v || j.v === window.__BUILD) return;
      let last = 0;
      try {
        last = +sessionStorage.getItem("moti3_upd") || 0;
      } catch (e) {
      }
      if (last === j.v) return;
      try {
        sessionStorage.setItem("moti3_upd", String(j.v));
      } catch (e) {
      }
      try {
        if (typeof G !== "undefined" && G) save();
      } catch (e) {
      }
      const u = location.href.replace(/([?&])upd=\d+&?/, "$1").replace(/[?&]$/, "");
      location.replace(u + (u.indexOf("?") < 0 ? "?" : "&") + "upd=" + j.v + location.hash);
    }).catch(() => {
    });
  };
  setTimeout(check, 4e3);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) check();
  });
})();
const SALVAGE = {
  stick: { wood: 1 },
  knife: { scrap: 1 },
  crowbar: { scrap: 2 },
  bat: { wood: 2 },
  axe: { scrap: 1, wood: 1 },
  machete: { scrap: 2 },
  spear: { stick: 1, scrap: 1 },
  nailbat: { planks: 1, nails: 4 },
  cblade: { cshard: 2, scrap: 1 },
  staff: { cshard: 3, wood: 2 },
  tusk: { scrap: 2, rag: 1 },
  pm: { scrap: 2, wire: 1 },
  sawn: { scrap: 3, wood: 1 },
  ak: { scrap: 4, wire: 1 },
  jacket: { rag: 3 },
  parka: { rag: 4 },
  mjacket: { rag: 4, wire: 1 },
  wolfpelt: { rag: 4 },
  vest: { scrap: 3, rag: 2 },
  vest2: { scrap: 4, rag: 3 },
  cvest: { cshard: 3, scrap: 2 },
  gasmask: { rag: 1, scrap: 1 },
  bag1: { rag: 2 },
  bag2: { rag: 3, rope: 1 },
  bag3: { rag: 4, rope: 1, wire: 1 },
  flash: { battery: 1, scrap: 1 },
  rod: { stick: 1, wire: 1 },
  detector: { elec: 3, battery: 2 },
  tools: { scrap: 3 },
  snare: { rope: 1 },
  picks: { wire: 1 },
  scope: { elec: 1, scrap: 1 },
  silencer: { scrap: 2 },
  stock: { planks: 1 },
  extmag: { scrap: 2 },
  spikes: { nails: 5 },
  grip: { rag: 1 },
  bottlesil: { tape: 1 }
};
const SALV_CATS = { melee: 1, gun: 1, wear: 1, mod: 1, tool: 1 };
function salvageBase(id) {
  if (SALVAGE[id]) return SALVAGE[id];
  const it = IT(id);
  if (!it || !SALV_CATS[it.c] || id === "bottle" || id === "lighter" || id === "bolts") return null;
  const r = RECIPES.find((x) => x.out[id]);
  if (r) {
    const o = {};
    for (const [k, v] of Object.entries(r.need)) {
      const n2 = Math.floor(v / 2);
      if (n2 > 0 && IT(k).c !== "quest") o[k] = n2;
    }
    if (Object.keys(o).length) return o;
  }
  const n = Math.max(1, Math.min(5, Math.round((it.v || 10) / 60)));
  return it.c === "wear" ? { rag: Math.max(1, n), scrap: it.arm > 2 ? 1 : 0 } : { scrap: n };
}
function salvageYield(e) {
  const base = salvageBase(e.id);
  if (!base) return null;
  const it = IT(e.id), out = {};
  const wear = e.dur != null && it.dur ? e.dur / it.dur : 1;
  for (const [k, v] of Object.entries(base)) {
    const n = Math.max(0, Math.round(v * (wear < 0.3 ? 0.5 : wear < 0.6 ? 0.75 : 1)));
    if (n) out[k] = n;
  }
  if (!Object.keys(out).length) {
    const [k] = Object.keys(base);
    if (k) out[k] = 1;
  }
  for (const m of e.mods || []) out[m] = (out[m] || 0) + 1;
  return out;
}
const salvTxt = (y) => Object.entries(y).map(([k, v]) => "".concat(IT(k).ic, " ").concat(IT(k).n, " ×").concat(v)).join(", ");
const salvRare = (id) => (IT(id).v || 0) >= 350;
function salvage(e, where, all) {
  const list = where === "stash" ? G.stash : G.inv;
  if (!list.includes(e)) return UI.toast("Предмета уже нет.");
  if (where === "stash" && !atBase()) return UI.toast("Склад — только на базе.");
  if (G.combat) return;
  const ents = all ? list.filter((x) => x.id === e.id) : [e];
  const tot = {};
  let n = 0;
  for (const x of ents) {
    const y = salvageYield(x);
    if (!y) continue;
    const k0 = all ? x.n || 1 : 1;
    n += k0;
    for (let i = 0; i < k0; i++) for (const [k, v] of Object.entries(y)) tot[k] = (tot[k] || 0) + v;
  }
  if (!n) return;
  for (const x of ents) {
    if (!all && (x.n || 1) > 1) x.n -= 1;
    else list.splice(list.indexOf(x), 1);
  }
  const bonus = skill("craft") >= 3 && ch(0.4), [first] = Object.keys(tot);
  if (bonus && first) tot[first]++;
  for (const [k, v] of Object.entries(tot)) invAdd(list, k, v);
  xp("craft", Math.min(10, n));
  advance(10 * n);
  SND("craft");
  UI.log("🔧 Разобрал: ".concat(IT(e.id).ic, " ").concat(IT(e.id).n).concat(n > 1 ? " ×" + n : "", " → ").concat(salvTxt(tot)).concat(bonus ? " (руки помнят — +1)" : "", "."), "good");
  if (where === "stash" && typeof stLog === "function") try {
    stLog("-", e.id, n);
  } catch (x) {
  }
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
const salvCount = (e, where) => (where === "stash" ? G.stash : G.inv).filter((x) => x.id === e.id).reduce((a, x) => a + (x.n || 1), 0);
function salvageAsk(e, where, all) {
  const list = where === "stash" ? G.stash : G.inv, ents = all ? list.filter((x) => x.id === e.id) : [e];
  const tot = {};
  let n = 0;
  for (const x of ents) {
    const y = salvageYield(x);
    if (!y) continue;
    const k0 = all ? x.n || 1 : 1;
    n += k0;
    for (let i = 0; i < k0; i++) for (const [k, v] of Object.entries(y)) tot[k] = (tot[k] || 0) + v;
  }
  if (!n) return;
  const mods = ents.some((x) => x.mods && x.mods.length);
  UI.event({
    title: "🔧 Разобрать: ".concat(IT(e.id).n).concat(n > 1 ? " ×" + n : ""),
    cls: salvRare(e.id) ? "bad" : "",
    text: "Получишь: ".concat(salvTxt(tot), ".\nЗаймёт ").concat(10 * n, " мин.").concat(mods ? "\nУстановленные модули вернутся целыми." : "").concat(salvRare(e.id) ? "\n\n⚠️ Это ценная вещь — назад её не собрать." : ""),
    choices: [{ t: "🔧 Разобрать", fn: () => salvage(e, where, all) }, { t: "Отмена" }]
  });
}
CUI.salvageBtn = (e, where) => {
  if (!salvageBase(e.id)) return "";
  if (where === "stash" && !atBase()) return "";
  const c = salvCount(e, where);
  return UI.btn("🔧 Разобрать", () => salvageAsk(e, where, false), "sm") + (c > 1 ? UI.btn("🔧 Разобрать все такие ×".concat(c), () => salvageAsk(e, where, true), "sm") : "");
};
Object.assign(ITEMS, {
  compost: { n: "Компост", ic: "🟤", c: "mat", w: 0.3, v: 2, info: "Удобрение: пока на складе есть компост, огород раз в день даёт лишний урожай." },
  bait: { n: "Тухлая приманка", ic: "🪱", c: "mat", w: 0.1, v: 3, info: "С приманкой в рюкзаке рыбалка удачнее, а силок с приманкой ловит чаще." }
});
const BAIT_SRC = { meat: 1, fish: 1, cmeat: 1, cfish: 1, smoked: 1, jerky: 1, ukha: 1, stew: 1 };
const isRot = (e) => {
  const it = IT(e.id);
  return it && it.sp && (it.c === "food" || it.c === "drink") && F().spoil && freshness(e) >= 1;
};
const rotOut = (id) => BAIT_SRC[id] ? "bait" : "compost";
function recycleRot(list, quiet) {
  const got = {};
  let n = 0;
  for (const e of list.slice()) {
    if (!isRot(e)) continue;
    const k = e.n || 1, o = rotOut(e.id);
    got[o] = (got[o] || 0) + k;
    n += k;
    list.splice(list.indexOf(e), 1);
  }
  for (const [k, v] of Object.entries(got)) invAdd(list, k, v);
  if (n && !quiet) UI.log("♻️ Испорченное переработано (".concat(n, " шт.): ").concat(Object.entries(got).map(([k, v]) => "".concat(IT(k).ic, " ").concat(IT(k).n, " ×").concat(v)).join(", "), "."), "sys");
  return n;
}
function recycleRotUi(where) {
  const list = where === "stash" ? G.stash : G.inv;
  if (where === "stash" && !atBase()) return;
  const n = recycleRot(list);
  if (!n) return UI.toast("Испорченного нет.");
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
const _salvBtnR = CUI.salvageBtn;
CUI.salvageBtn = (e, where) => {
  const h = _salvBtnR(e, where);
  if (!isRot(e) || where === "stash" && !atBase()) return h;
  const list = where === "stash" ? G.stash : G.inv, all = list.filter(isRot).reduce((a, x) => a + (x.n || 1), 0);
  return h + UI.btn("♻️ ".concat(rotOut(e.id) === "bait" ? "В приманку" : "В компост"), () => {
    const o = rotOut(e.id), k = e.n || 1;
    list.splice(list.indexOf(e), 1);
    invAdd(list, o, k);
    UI.log("♻️ ".concat(IT(e.id).n, " ×").concat(k, " → ").concat(IT(o).ic, " ").concat(IT(o).n, " ×").concat(k, "."));
    if (G.coop && window.COOP) COOP.sync();
    save();
    UI.render();
  }, "sm") + (all > (e.n || 1) ? UI.btn("♻️ Всё испорченное (".concat(all, ")"), () => recycleRotUi(where), "sm") : "");
};
window.setAutoRot = (v) => {
  G.w.autoRot = v;
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
};
let rotHour = -1;
function rotTick() {
  const hr = Math.floor(G.time / H);
  if (hr === rotHour) return;
  rotHour = hr;
  if (G.w.autoRot === false) return;
  let n = 0;
  if (worldAuth()) n += recycleRot(G.stash, true);
  n += recycleRot(G.inv, true);
  if (n) UI.log("♻️ Испорченная еда (".concat(n, " шт.) ушла в компост и приманку."), "dim");
  if (worldAuth() && G.w.struct.garden && G.w.compDay !== day() && season() !== 1 && cnt(G.stash, "compost") && hour() >= 8) {
    G.w.compDay = day();
    take(G.stash, "compost", 1);
    invAdd(G.stash, "veg", 1);
    const h2 = ch(0.35);
    if (h2) invAdd(G.stash, "herbs", 1);
    UI.log("🌱 Компост пошёл в огород: лишний урожай — 🥕 овощи".concat(h2 ? " и 🌿 травы" : "", "."), "good");
  }
}
const _tickRot = tick;
tick = function(st, o) {
  _tickRot.apply(this, arguments);
  try {
    if (G && !G.dead && !G.combat) rotTick();
  } catch (e) {
    console.warn(e);
  }
};
const _doFishB = doFish;
doFish = function() {
  const has = cnt(G.inv, "bait") && cnt(G.inv, "rod"), b = cnt(G.inv, "fish");
  const r = _doFishB.apply(this, arguments);
  if (has && !G.dead) {
    take(G.inv, "bait", 1);
    const d = cnt(G.inv, "fish") - b;
    if (d > 0 || ch(0.55)) {
      invAdd(G.inv, "fish", 1);
      UI.log("🪱 На приманку клюнуло лучше: +1 рыба.", "good");
    } else UI.log("🪱 Приманку объели, но без толку.", "dim");
    UI.render();
  }
  return r;
};
const _setSnareB = setSnare;
setSnare = function() {
  const before = (G.w.snares || []).length, r = _setSnareB.apply(this, arguments);
  const sn = G.w.snares || [];
  if (sn.length > before && cnt(G.inv, "bait")) {
    take(G.inv, "bait", 1);
    sn[sn.length - 1].bait = true;
    UI.log("🪱 Положил приманку в силок — шанс выше.");
    save();
    UI.render();
  }
  return r;
};
const _checkSnareB = checkSnare;
checkSnare = function(id) {
  const s = (G.w.snares || []).find((x) => x.id === id), bait = s && s.bait && G.time - s.at >= 8 * H, m0 = cnt(G.inv, "meat");
  const r = _checkSnareB.apply(this, arguments);
  if (bait) {
    const s2 = (G.w.snares || []).find((x) => x.id === id);
    if (s2) s2.bait = false;
    if (cnt(G.inv, "meat") === m0 && ch(0.6)) {
      invAdd(G.inv, "meat", 1);
      UI.log("🪱 Приманка сработала: 🥩 мясо ×1.", "good");
    }
    save();
    UI.render();
  }
  return r;
};
const NSLOT = { w: { n: "Оружие / инструмент", ok: (it) => ["melee", "gun"].includes(it.c) || it.id === "rod" }, a: { n: "Броня / одежда", ok: (it) => it.c === "wear" && (it.slot === "vest" || it.slot === "body") }, b: { n: "Рюкзак", ok: (it) => it.c === "wear" && it.slot === "bag" } };
const neq = (n) => n.eq = n.eq || {};
const nW = (n) => neq(n).w && IT(neq(n).w.id), nA = (n) => neq(n).a && IT(neq(n).a.id);
const durOf = (e) => e && e.dur != null && IT(e.id).dur ? e.dur / IT(e.id).dur : null;
function wearNpc(n, k, amt) {
  const e = neq(n)[k];
  if (!e || e.dur == null) return;
  e.dur = Math.max(0, e.dur - amt);
  if (e.dur <= 0) {
    UI.log("💥 У ".concat(n.name, " сломалось: ").concat(IT(e.id).n, "."), "warn");
    delete n.eq[k];
  }
}
function giveNpc(id, k) {
  const n = npcBy(id);
  if (!n || !atBase()) return UI.toast("Выдать можно только на базе.");
  const items = G.stash.filter((e) => NSLOT[k].ok(Object.assign({ id: e.id }, IT(e.id))) && !IT(e.id).quest);
  if (!items.length) return UI.toast("На складе нет подходящих вещей.");
  UI.event({ title: "🎽 ".concat(n.name, ": ").concat(NSLOT[k].n), text: "Что выдать со склада?", choices: items.slice(0, 20).map((e) => {
    const it = IT(e.id), d = durOf(e);
    return { t: "".concat(it.ic, " ").concat(it.n).concat(it.dmg ? " · урон ".concat(it.dmg[0], "–").concat(it.dmg[1]) : "").concat(it.arm ? " · броня ".concat(it.arm) : "").concat(d != null ? " · ".concat(Math.round(d * 100), "%") : ""), fn: () => wEdit(() => {
      const one = Object.assign({}, e, { n: 1 });
      if ((e.n || 1) > 1) e.n -= 1;
      else G.stash.splice(G.stash.indexOf(e), 1);
      if (neq(n)[k]) G.stash.push(neq(n)[k]);
      n.eq[k] = one;
      UI.log("🎽 ".concat(n.name, " получил: ").concat(it.ic, " ").concat(it.n, "."));
    }) };
  }).concat([{ t: "Отмена" }]) });
}
function takeNpc(id, k) {
  const n = npcBy(id);
  if (!n || !neq(n)[k]) return;
  if (!atBase()) return UI.toast("Забрать можно только на базе.");
  wEdit(() => {
    G.stash.push(n.eq[k]);
    delete n.eq[k];
  });
}
window.giveNpc = giveNpc;
window.takeNpc = takeNpc;
function npcGearHtml(n) {
  if (n.exp) return "";
  const b = UI.btn, e = neq(n);
  return '<div class="ngear">'.concat(Object.entries(NSLOT).map(([k, S]) => {
    const x = e[k], d = durOf(x);
    return '<div class="ngs '.concat(d != null && d < 0.3 ? "low" : "", '"><span class="s muted">').concat(S.n, "</span><span>").concat(x ? "".concat(IT(x.id).ic, " ").concat(esc2(IT(x.id).n)).concat(d != null ? ' <span class="mono '.concat(d < 0.3 ? "bad" : "muted", '">').concat(Math.round(d * 100), "%</span>") : "") : '<span class="muted">—</span>', '</span><span class="acts">').concat(b(x ? "Сменить" : "Выдать", () => giveNpc(n.id, k), "sm")).concat(x ? b("Забрать", () => takeNpc(n.id, k), "sm") : "", "</span></div>");
  }).join(""), '\n    <div class="acts">').concat(b("🧭 Вылазка…", () => expMenu(n.id), "sm", n.hp != null && n.hp < 60)).concat(n.hp != null && n.hp < 60 ? '<span class="s warn">ранен — отлёживается</span>' : "", "</div></div>");
}
function npcRepairTick(m, st) {
  const need = npcs().filter((x2) => !x2.exp).map((x2) => [x2, neq(x2).w]).find(([, e2]) => e2 && durOf(e2) != null && durOf(e2) < 0.4);
  if (!need) return false;
  const [x, e] = need, it = IT(e.id), useTape = cnt(G.stash, "tape") > 0, useScrap = !useTape && cnt(G.stash, "scrap") >= 2;
  if (!useTape && !useScrap) {
    m.now = "ждёт: скотч или металлолом — починить ".concat(it.n, " (").concat(x.name, ")");
    return false;
  }
  m.wt = Math.min(240, (m.wt || 0) + st * 0.5);
  m.now = "чинит: ".concat(it.n, " (").concat(x.name, ")");
  if (m.wt < 20) return true;
  m.wt -= 20;
  if (useTape) take(G.stash, "tape", 1);
  else take(G.stash, "scrap", 2);
  e.dur = Math.min(it.dur, e.dur + it.dur * (useTape ? 0.25 : 0.4));
  m.today = m.today || {};
  m.today[e.id] = m.today[e.id] || 0;
  UI.log("🔧 ".concat(m.name, " подлатал ").concat(it.n, " для ").concat(x.name, " (").concat(Math.round(durOf(e) * 100), "%)."), "dim");
  return true;
}
const _npcDailyG = npcDaily;
npcDaily = function() {
  npcs().forEach(npcInit);
  const roles = /* @__PURE__ */ new Map();
  npcs().forEach((n) => {
    roles.set(n, n.role);
    n.role = "_" + n.role;
  });
  _npcDailyG.apply(this, arguments);
  npcs().forEach((n) => {
    if (roles.has(n)) n.role = roles.get(n);
  });
  const out = [], med = npcs().find((n) => n.role === "medic" && !n.exp && n.shift !== "off"), win = season() === 1;
  const jolly = npcs().filter((n) => hasNT(n, "jolly") && !n.exp).length, grump = npcs().filter((n) => hasNT(n, "grump") && !n.exp).length;
  for (const n of npcs()) {
    if (jolly || grump) n.morale = Math.max(0, Math.min(100, n.morale + jolly * 3 - grump * 2 + (hasNT(n, "jolly") ? -3 : 0) + (hasNT(n, "grump") ? 2 : 0)));
    if (hasNT(n, "glutton")) {
      const f = NPC_FOOD();
      if (f) take(G.stash, f.id, 1);
      else n.morale -= 8;
    }
    if (n.hp != null && n.hp < 100) n.hp = Math.min(100, n.hp + (med ? 30 : 15) * (n.shift === "off" ? 2 : 1));
    if (n.shift === "off") {
      n.morale = Math.min(100, n.morale + 10);
      continue;
    }
    if (n.exp || n.car) continue;
    npcReqDaily(n);
    const w = nW(n), r = n.role, key = ROLE_SK[r], m = skMul(n, key) * workMul(n);
    const rnd = (x) => {
      const f = Math.floor(x);
      return f + (Math.random() < x - f ? 1 : 0);
    };
    if (r === "fisher") {
      const k = rnd((win ? 1 : R(1, 3)) * m + (w && w.id === "rod" ? R(1, 2) : 0));
      if (k) {
        invAdd(G.stash, "fish", k);
        out.push("🎣 ".concat(n.name, ": рыба ×").concat(k));
      }
    }
    if (r === "forager") {
      const got = [];
      for (let k = rnd((win ? 1 : R(2, 3)) * m); k > 0; k--) {
        const id = wpick(win ? [["wood", 3], ["stick", 1]] : [["berries", 3], ["mushroom", 3], ["herbs", 2], ["wood", 3]]);
        invAdd(G.stash, id, 1);
        got.push(IT(id).ic);
      }
      if (w && w.chop) {
        const k = rnd(R(2, 3) * m);
        invAdd(G.stash, "wood", k);
        wearNpc(n, "w", 3);
        got.push("🪵×" + k);
      } else if (w && w.c === "melee" && !win) {
        const id = pick(["herbs", "berries", "mushroom"]);
        invAdd(G.stash, id, 1);
        wearNpc(n, "w", 1);
        got.push(IT(id).ic);
      }
      if (got.length) out.push("🧺 ".concat(n.name, ": ").concat(got.join("")));
    }
    if (r === "hunter") {
      if (w && w.c === "gun" && cnt(G.stash, w.ammo)) {
        take(G.stash, w.ammo, Math.min(cnt(G.stash, w.ammo), R(1, 2)));
        if (ch(Math.min(0.95, 0.75 * m))) {
          const k = rnd(R(2, 3) * m);
          invAdd(G.stash, "meat", k);
          out.push("🏹 ".concat(n.name, ": мясо ×").concat(k));
        }
      } else if (ch(Math.min(0.9, (w && w.c === "melee" ? 0.6 : 0.45) * m))) {
        const k = Math.max(1, rnd(2 * m));
        invAdd(G.stash, "meat", k);
        if (w) wearNpc(n, "w", 3);
        out.push("🏹 ".concat(n.name, ": мясо ×").concat(k));
      }
    }
    if (r === "crafter") {
      if (!(n.q && n.q.length) && cnt(G.stash, "wood") >= 2) {
        const k = Math.min(Math.floor(cnt(G.stash, "wood") / 2), Math.max(1, rnd(m)));
        take(G.stash, "wood", k * 2);
        invAdd(G.stash, "planks", k);
        out.push("🔨 ".concat(n.name, ": доски ×").concat(k));
      }
      if (G.w.struct.walls && G.w.wallHp < 100) G.w.wallHp = Math.min(100, G.w.wallHp + Math.round(10 * m));
    }
    if (r === "medic") {
      for (let k = Math.max(1, rnd(m)); k > 0 && cnt(G.stash, "dband"); k--) {
        take(G.stash, "dband", 1);
        invAdd(G.stash, "bandage", 1);
        out.push("⛑️ ".concat(n.name, ": стерильный бинт"));
      }
    }
    if (key) npcXp(n, key, 1);
  }
  if (out.length) UI.log("🏘️ База: " + out.join(" · "), "sys");
};
const _defenseG = defense;
defense = function() {
  let d = _defenseG.apply(this, arguments);
  for (const n of npcs()) if (n.role === "guard" && !n.exp && !n.car) {
    if (n.shift === "off") {
      d -= 12;
      continue;
    }
    const w = nW(n), a = nA(n);
    let g = Math.round(skLv(n, "fight") * 1.5);
    if (w && w.dmg) g += Math.round((w.dmg[0] + w.dmg[1]) / 4) + (w.c === "gun" && cnt(G.stash, w.ammo) ? 4 : 0);
    if (a && a.arm) g += a.arm * 2;
    if (hasNT(n, "brave")) g += 3;
    if (hasNT(n, "coward")) g -= 3;
    if (n.shift === "night" && (hour() >= 20 || hour() < 6)) g += Math.round((g + 12) * 0.5);
    d += g;
  }
  return d;
};
const TACT = {
  careful: { n: "🐢 Осторожно", loot: 0.4, risk: 0.35, retreat: 70, rooms: [1, 1], die: false, d: "мало лута, почти без риска, уходит при первых ранах" },
  normal: { n: "🚶 Обычно", loot: 0.6, risk: 0.7, retreat: 45, rooms: [1, 2], die: false, d: "обычно; при серьёзных ранах отступает" },
  bold: { n: "🔥 Смело", loot: 0.7, risk: 1.2, retreat: 20, rooms: [2, 4], die: true, d: "много лута, но может погибнуть" }
};
function npcPower(n, ammo) {
  const w = nW(n), a = nA(n);
  let p = 1 + (n.role === "guard" ? 0.6 : n.role === "hunter" ? 0.3 : 0) + skLv(n, "fight") * 0.15 + (hasNT(n, "brave") ? 0.3 : 0);
  if (w && w.dmg) p += (w.dmg[0] + w.dmg[1]) / 2 / (w.c === "gun" ? ammo ? 7 : 30 : 10);
  if (a && a.arm) p += a.arm * 0.25;
  return p;
}
function expTargets() {
  return Object.keys(LOCS).filter((id) => id !== "base" && G.w.locs[id] && G.w.locs[id].seen && !(LOCS[id].ch2 && !CH2()) && LOCS[id].rooms && LOCS[id].rooms.length && route("base", id));
}
function expSim(n, loc, tac, rnd, ammo) {
  const L2 = LOCS[loc], T0 = TACT[tac], P = npcPower(n, ammo > 0), thr = (L2.dg || 0) * 1.5 + 0.5, sc = skLv(n, "scout");
  const T = Object.assign({}, T0, { loot: T0.loot * (0.8 + sc * 0.06) * (hasNT(n, "lucky") ? 1.15 : 1) * (hasNT(n, "brave") ? 1.2 : 1) * (hasNT(n, "coward") ? 0.8 : 1), risk: T0.risk * (hasNT(n, "coward") ? 0.8 : 1), retreat: T0.retreat + (hasNT(n, "coward") ? 20 : 0) - (hasNT(n, "brave") ? 15 : 0) });
  const rr = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  let hp = n.hp == null ? 100 : n.hp, fights = 0, used = 0;
  const loot = [];
  const rooms = L2.rooms.filter((r) => !r.lock && !r.final && (r.cont || []).length);
  const nRooms = Math.min(rooms.length, rr(T.rooms[0], T.rooms[1]));
  const order = rooms.slice().sort(() => rnd() - 0.5).slice(0, nRooms);
  let searched = 0, retreated = false;
  for (const r of order) {
    const hasEn = (r.en || []).some((e) => e[2] > 0);
    if (hasEn && rnd() < Math.min(0.9, 0.25 + (L2.dg || 0) * 0.15) * Math.max(0.5, 1.1 - sc * 0.05)) {
      fights++;
      if (ammo > used) used += rr(1, 3);
      const dmg = Math.max(0, (6 + rnd() * 14) * thr * 2 / npcPowerAmmo(n, ammo - used) * T.risk);
      hp -= dmg;
      if (hp <= 0) {
        if (T.die) return { dead: true, loot: [], fights, used, searched };
        hp = 5;
        retreated = true;
        break;
      }
      if (hp < T.retreat) {
        retreated = true;
      }
    }
    for (const ct of r.cont) {
      const C = CONT[ct];
      if (!C) continue;
      let k = Math.floor(rr(C.roll[0], C.roll[1]) * T.loot + rnd() * 0.7);
      for (let i = 0; i < k; i++) {
        let tot = C.loot.reduce((a, x2) => a + x2[1], 0), x = rnd() * tot;
        for (const [id, wt] of C.loot) {
          x -= wt;
          if (x <= 0) {
            loot.push(id);
            break;
          }
        }
      }
    }
    searched++;
    if (retreated) break;
  }
  return { dead: false, hp: Math.max(5, Math.round(hp)), loot, fights, used: Math.min(used, ammo), searched, retreated };
}
const npcPowerAmmo = (n, a) => npcPower(n, a > 0);
function expRisk(n, loc, tac) {
  const w = nW(n), ammo = w && w.c === "gun" ? Math.min(12, cnt(G.stash, w.ammo)) : 0;
  let dead = 0, hurt = 0, items = 0;
  const N = 300;
  for (let i = 0; i < N; i++) {
    const r = expSim(n, loc, tac, Math.random, ammo);
    if (r.dead) dead++;
    else {
      if (r.hp < 60) hurt++;
      items += r.loot.length;
    }
  }
  return { dead: dead / N, hurt: hurt / N, items: items / Math.max(1, N - dead) };
}
function expMenu(id) {
  const n = npcBy(id);
  if (!n) return;
  if (!atBase()) return UI.toast("Отправить на вылазку можно только с базы.");
  const ts = expTargets();
  if (!ts.length) return UI.toast("Сначала разведай места на карте.");
  UI.event({ title: "🧭 ".concat(n.name, ": куда идти?"), text: "Сила: ".concat(npcPower(n, true).toFixed(1), " (оружие, броня, занятие). Чем опаснее место, тем больше риск."), choices: ts.map((l) => ({ t: "".concat(LOCS[l].ic, " ").concat(LOCS[l].n, " · ").concat(["безопасно", "низкая", "средняя", "высокая"][LOCS[l].dg || 0] || "высокая", " опасность · ~").concat(Math.round(route("base", l).mins * 2 / 60 + 2), " ч"), fn: () => setTimeout(() => tactMenu(id, l), 0) })).concat([{ t: "Отмена" }]) });
}
function tactMenu(id, loc) {
  const n = npcBy(id);
  if (!n) return;
  const ch0 = Object.entries(TACT).map(([k, T]) => {
    const r = expRisk(n, loc, k);
    return { t: "".concat(T.n, " — ~").concat(r.items.toFixed(1), " вещей · ранен ").concat(Math.round(r.hurt * 100), "%").concat(r.dead ? " · гибель ".concat(Math.max(1, Math.round(r.dead * 100)), "%") : ""), fn: () => expGo(id, loc, k) };
  });
  UI.event({ title: "🧭 ".concat(LOCS[loc].ic, " ").concat(LOCS[loc].n), text: Object.values(TACT).map((T) => "".concat(T.n, ": ").concat(T.d)).join("\n") + "\n\nЦифры — прикидка по 300 пробным вылазкам.", choices: ch0.concat([{ t: "Отмена" }]) });
}
function expGo(id, loc, tac) {
  const n = npcBy(id);
  if (!n || n.exp) return;
  const w = nW(n);
  let ammo = 0;
  if (w && w.c === "gun") {
    ammo = Math.min(12, cnt(G.stash, w.ammo));
    if (ammo) take(G.stash, w.ammo, ammo);
  }
  const mins = route("base", loc).mins * 2 + 120;
  wEdit(() => {
    n.exp = { loc, tac, at: G.time, until: G.time + mins, ammo };
  });
  UI.log("🧭 ".concat(n.name, " ушёл на вылазку: ").concat(LOCS[loc].ic, " ").concat(LOCS[loc].n, " (").concat(TACT[tac].n, "). Вернётся через ~").concat(Math.round(mins / 60), " ч."), "good");
}
window.expMenu = expMenu;
function expTick() {
  if (!worldAuth()) return;
  for (const n of npcs().slice()) {
    const x = n.exp;
    if (!x || G.time < x.until) continue;
    const r = expSim(n, x.loc, x.tac, Math.random, x.ammo || 0), w = nW(n);
    delete n.exp;
    if (r.dead) {
      npcs().splice(npcs().indexOf(n), 1);
      UI.log("⚰️ ".concat(n.name, " не вернулся с вылазки (").concat(LOCS[x.loc].n, "). Снаряжение потеряно."), "bad");
      FEED("⚰️ житель ".concat(n.name, " погиб на вылазке"));
      try {
        SND("death");
      } catch (e) {
      }
      continue;
    }
    n.hp = r.hp;
    npcXp(n, "scout", 1.5);
    if (r.fights) npcXp(n, "fight", r.fights);
    if (w && w.c === "gun" && x.ammo) {
      const left = Math.max(0, x.ammo - r.used);
      if (left) invAdd(G.stash, w.ammo, left);
    }
    if (w && w.c === "melee") wearNpc(n, "w", r.fights * R(3, 8));
    const got = {};
    for (const id of r.loot) {
      invAdd(G.stash, id, IT(id).c === "ammo" ? R(3, 8) : 1);
      got[id] = (got[id] || 0) + 1;
    }
    const txt = Object.entries(got).map(([k, v]) => "".concat(IT(k).ic).concat(v > 1 ? "×" + v : "")).join(" ") || "ничего";
    UI.log("🧭 ".concat(n.name, " вернулся с вылазки (").concat(LOCS[x.loc].n, "): ").concat(txt, ".").concat(r.fights ? " Стычек: ".concat(r.fights, ".") : "").concat(r.retreated ? " Пришлось отступить." : "").concat(n.hp < 60 ? " Ранен — несколько дней отлёживается." : ""), n.hp < 60 ? "warn" : "good");
    try {
      SND("notify");
    } catch (e) {
    }
  }
}
function npcExpHtml(n) {
  const x = n.exp, left = Math.max(0, x.until - G.time);
  return '<div class="wnow">🧭 На вылазке: '.concat(LOCS[x.loc].ic, " ").concat(LOCS[x.loc].n, " · ").concat(TACT[x.tac].n, '</div><div class="s muted">Вернётся через ~').concat(left >= 60 ? Math.round(left / 6) / 10 + " ч" : left + " мин").concat(x.ammo ? " · взял патронов: ".concat(x.ammo) : "", "</div>");
}
const _tickExp = tick;
tick = function(st, o) {
  _tickExp.apply(this, arguments);
  try {
    if (G && !G.dead) expTick();
  } catch (e) {
    console.warn(e);
  }
};
const _sideWarnN = sideWarnings;
sideWarnings = function() {
  const w = _sideWarnN.apply(this, arguments);
  for (const n of npcs()) {
    const e = neq(n).w, d = durOf(e);
    if (d != null && d < 0.25 && !cnt(G.stash, "tape") && cnt(G.stash, "scrap") < 2) w.push('<div class="ln warn">🔧 '.concat(cesc(n.name), ": ").concat(cesc(IT(e.id).n), " ").concat(Math.round(d * 100), "% — нечем чинить (скотч/металлолом)</div>"));
  }
  for (const n of npcs()) if (n.exp) {
    const left = n.exp.until - G.time;
    if (left < 60) w.push('<div class="ln">🧭 '.concat(cesc(n.name), " скоро вернётся с вылазки</div>"));
  }
  return w;
};
Object.assign(ITEMS, {
  bow: { n: "Самодельный лук", ic: "🏹", c: "gun", w: 1, v: 60, dmg: [9, 15], ammo: "arrow", noise: 3, acc: 0.68, quiet: 1 },
  cbow: { n: "Арбалет", ic: "🎯", c: "gun", w: 3, v: 260, dmg: [16, 25], ammo: "xbolt", noise: 4, acc: 0.8, quiet: 1 },
  arrow: { n: "Стрелы", ic: "🪶", c: "ammo", w: 0.03, v: 2 },
  xbolt: { n: "Арбалетные болты", ic: "🔸", c: "ammo", w: 0.05, v: 4 },
  pipe: { n: "Стальная труба", ic: "🔧", c: "melee", w: 1.5, v: 15, dmg: [7, 11], dur: 120, noise: 6, push: 1 },
  hammer: { n: "Молоток", ic: "🔨", c: "melee", w: 0.8, v: 15, dmg: [6, 10], dur: 90, noise: 5 },
  knuckles: { n: "Кастет", ic: "🥊", c: "melee", w: 0.3, v: 25, dmg: [6, 9], dur: 220, noise: 2 },
  fireaxe: { n: "Пожарный топор", ic: "🪓", c: "melee", w: 2.4, v: 90, dmg: [14, 21], dur: 120, noise: 7, chop: 1, pry: 1 }
});
RECIPES.push(
  { id: "bow", n: "Самодельный лук", need: { stick: 2, rope: 1 }, out: { bow: 1 }, t: 40 },
  { id: "arrow", n: "Стрелы (×6)", need: { stick: 1, scrap: 1 }, out: { arrow: 6 }, t: 20 },
  { id: "cbow", n: "Арбалет", need: { planks: 2, wire: 2, rope: 1, scrap: 2 }, out: { cbow: 1 }, st: "bench", t: 60 },
  { id: "xbolt", n: "Арбалетные болты (×6)", need: { scrap: 1, wood: 1 }, out: { xbolt: 6 }, st: "bench", t: 20 },
  { id: "knuckles", n: "Кастет", need: { scrap: 2 }, out: { knuckles: 1 }, st: "bench", t: 25 }
);
const addLoot2 = (ct, list) => {
  if (CONT[ct]) CONT[ct].loot.push(...list);
};
addLoot2("shed", [["pipe", 2], ["hammer", 2], ["fireaxe", 1]]);
addLoot2("toolbox", [["hammer", 3], ["pipe", 1]]);
addLoot2("tent", [["bow", 1], ["arrow", 2]]);
addLoot2("milcrate", [["xbolt", 1]]);
addLoot2("armory", [["cbow", 1], ["xbolt", 2]]);
Object.assign(SALVAGE, { pipe: { scrap: 2 }, hammer: { scrap: 1, wood: 1 }, knuckles: { scrap: 1 }, fireaxe: { scrap: 2, wood: 1 }, bow: { stick: 1, rope: 1 }, cbow: { wire: 1, scrap: 1, planks: 1 } });
const _pShootA = pShoot;
pShoot = function(i) {
  const w = curWeapon(), cb = G.combat, a0 = w && w.quiet ? cnt(G.inv, w.ammo) : 0;
  const r = _pShootA.apply(this, arguments);
  if (w && w.quiet && cb) {
    const used = a0 - cnt(G.inv, w.ammo);
    if (used > 0) {
      cb._ammo = cb._ammo || {};
      cb._ammo[w.ammo] = (cb._ammo[w.ammo] || 0) + used;
    }
  }
  return r;
};
const _endCombatA = endCombat;
endCombat = function(res) {
  const cb = G.combat, r = _endCombatA.apply(this, arguments);
  if (cb && cb._ammo && res === "win") {
    const got = [];
    for (const [id, n] of Object.entries(cb._ammo)) {
      const k = Math.round(n * (0.4 + Math.random() * 0.3));
      if (k) {
        invAdd(G.inv, id, k);
        got.push("".concat(IT(id).ic, " ").concat(IT(id).n, " ×").concat(k));
      }
    }
    if (got.length) UI.log("🏹 Подобрал после боя: ".concat(got.join(", "), "."), "dim");
  }
  return r;
};
const ITEM_DESC = {
  ak: "Автомат Калашникова. Мощный и точный, но громкий — на выстрелы сбегаются.",
  pm: "Пистолет Макарова. Лёгкий и надёжный, урон средний.",
  sawn: "Обрез двустволки. Бьёт дробью по двум целям вблизи, очень громкий.",
  bow: "Тихое оружие: почти не шумит. Часть стрел можно подобрать после боя.",
  cbow: "Тихий и мощный. Часть болтов можно подобрать после боя.",
  stick: "Лучше, чем ничего. Быстро ломается.",
  knife: "Тихий, но слабый. Годится и для разделки.",
  crowbar: "Открывает запертые двери и ящики.",
  axe: "Хорошее оружие и инструмент: рубит дрова.",
  fireaxe: "Тяжёлый: рубит дрова и вскрывает двери.",
  machete: "Быстрое и тихое лезвие.",
  bat: "Отталкивает врага.",
  pipe: "Крепкая, почти не ломается, отталкивает.",
  knuckles: "Тихий и почти вечный, но урон небольшой.",
  gasmask: "Защищает от радиации и газа в аномалиях.",
  vest: "Сильно снижает урон, но тяжёлый.",
  bag1: "Маленький рюкзак.",
  bag2: "Средний рюкзак.",
  bag3: "Большой военный рюкзак.",
  bandage: "Останавливает кровотечение. Чистый — без риска заражения.",
  dband: "Останавливает кровь, но грязный: рана может воспалиться. Прокипяти на огне.",
  antibio: "Лечит воспаление ран и лихорадку.",
  painkill: "Снимает боль на время.",
  medkit: "Перевязка и обработка сразу.",
  antirad: "Выводит радиацию.",
  serum: "Единственное лекарство от вируса после укуса.",
  rod: "Нужна для рыбалки.",
  flash: "Свет в тёмных помещениях — больше находок ночью.",
  lighter: "Разжечь костёр.",
  picks: "Вскрыть замок без шума.",
  detector: "Находит артефакты в аномалиях.",
  tools: "Нужен для мастерской и ремонта."
};
const MED_TXT = { band: "останавливает кровотечение", disinf: "обрабатывает рану от заражения", antibio: "лечит инфекцию и лихорадку", pain: "снимает боль", splint: "фиксирует перелом", kit: "перевязка и обработка сразу", antirad: "выводит радиацию", cold: "лечит простуду", serum: "лечит вирус" };
function itemDesc(e) {
  const it = IT(e.id), p = [];
  const base = ITEM_DESC[e.id] || it.d || "";
  if (base && it.c !== "art") p.push(base);
  if (it.c === "gun") {
    const A = IT(it.ammo), inv = cnt(G.inv, it.ammo), st = cnt(G.stash, it.ammo);
    p.push("<b>Патроны: ".concat(A.ic, " ").concat(A.n, "</b> — в рюкзаке ").concat(inv).concat(atBase() || G.coop ? ", на складе ".concat(st) : "", "."));
    p.push("Урон ".concat(it.dmg[0], "–").concat(it.dmg[1], ", точность ~").concat(Math.round(it.acc * 100), "%, шум: ").concat(it.noise >= 30 ? "очень громко" : it.noise >= 10 ? "громко" : "тихо", ".").concat(it.spread ? " Задевает до ".concat(it.spread, " врагов рядом.") : ""));
  }
  if (it.c === "ammo") {
    const guns = Object.keys(ITEMS).filter((k) => ITEMS[k].ammo === e.id).map((k) => "".concat(ITEMS[k].ic, " ").concat(ITEMS[k].n));
    if (guns.length) p.push("<b>Подходит к:</b> ".concat(guns.join(", "), "."));
  }
  if (it.c === "melee") p.push("Урон ".concat(it.dmg[0], "–").concat(it.dmg[1]).concat(it.dur ? ", прочность ".concat(it.dur) : "", ", шум: ").concat(it.noise >= 6 ? "заметный" : "тихо", ".").concat(it.chop ? " Рубит дрова." : "").concat(it.pry ? " Вскрывает двери." : "").concat(it.push ? " Отталкивает." : "").concat(it.reach ? " Бьёт издалека." : ""));
  if (it.c === "wear") {
    const sl = { body: "одежда", vest: "бронежилет", bag: "рюкзак", mask: "маска" }[it.slot] || it.slot;
    p.push("Слот: ".concat(sl, ".").concat(it.arm ? " Броня +".concat(it.arm, ".") : "").concat(it.warm ? " Тепло +".concat(it.warm, ".") : "").concat(it.cap ? " Вместимость +".concat(it.cap, " кг.") : "").concat(it.radp ? " Радиация −".concat(Math.round(it.radp * 100), "%.") : ""));
  }
  if (it.c === "med" && MED_TXT[it.med]) p.push("Действие: ".concat(MED_TXT[it.med], ".").concat(it.uses ? " Хватает на ".concat(it.uses, " раз(а).") : ""));
  if ((it.c === "food" || it.c === "drink") && (it.f || it.d)) p.push("".concat(it.f ? "Сытость +".concat(it.f, ". ") : "").concat(it.d ? "Вода +".concat(it.d, ". ") : "").concat(it.sp ? "Портится примерно за ".concat(Math.round(it.sp / 24 * 10) / 10, " сут.") : "Не портится.").concat(it.raw ? " Сырое — лучше приготовить." : "").concat(it.salt ? " Солёная — пить нельзя." : ""));
  if (it.c === "mod" && it.mod) p.push("Модуль для ".concat(it.mod.gun ? "огнестрела" : "холодного оружия", ". Ставится кнопкой у предмета."));
  if (["mat", "tool", "ammo"].includes(it.c) || it.c === "food") {
    const uses = RECIPES.filter((r) => r.need[e.id]).map((r) => r.n);
    const sts = Object.values(STRUCT).filter((S) => S.lv && S.lv.some((l) => l.c && l.c[e.id])).map((S) => S.n);
    const all = uses.concat(sts.map((s) => "постройка: " + s));
    if (all.length) p.push("<b>Нужно для:</b> ".concat(all.slice(0, 6).join(", ")).concat(all.length > 6 ? " и ещё ".concat(all.length - 6) : "", "."));
  }
  if (typeof salvageBase === "function" && salvageBase(e.id)) p.push("Можно разобрать на материалы.");
  return p.join("<br>");
}
CUI.itemDesc = itemDesc;
const NSK = { gather: ["🧺", "Собирательство"], fish: ["🎣", "Рыбалка"], hunt: ["🏹", "Охота"], craft: ["🔨", "Ремесло"], cook: ["🍳", "Готовка"], med: ["⛑️", "Медицина"], fight: ["⚔️", "Бой"], scout: ["🧭", "Разведка"] };
const ROLE_SK = { forager: "gather", fisher: "fish", hunter: "hunt", crafter: "craft", cook: "cook", medic: "med", guard: "fight" };
const NTRAITS = {
  hard: { n: "Трудяга", ic: "💪", d: "работает на 20% лучше", bad: "lazy" },
  lazy: { n: "Лентяй", ic: "🥱", d: "работает на 20% хуже", bad: "hard" },
  brave: { n: "Храбрец", ic: "🦁", d: "на вылазках лезет дальше: больше лута, позже отступает; сильнее в обороне", bad: "coward" },
  coward: { n: "Трус", ic: "🐭", d: "на вылазках осторожнее: меньше риска и лута; слабее в обороне", bad: "brave" },
  glutton: { n: "Обжора", ic: "🍖", d: "ест вдвое больше" },
  jolly: { n: "Весельчак", ic: "😄", d: "поднимает настроение всем на базе", bad: "grump" },
  grump: { n: "Ворчун", ic: "😒", d: "портит настроение остальным", bad: "jolly" },
  lucky: { n: "Везунчик", ic: "🍀", d: "находит на вылазках больше" },
  handy: { n: "Мастер на все руки", ic: "🛠️", d: "все навыки немного выше" }
};
const hasNT = (n, t) => !!(n.tr && n.tr.includes(t));
function npcInit(n) {
  if (n.sk) return n;
  const ks = Object.keys(NSK), sk = {};
  ks.forEach((k) => {
    sk[k] = R(2, 4) + Math.random();
  });
  const talent = ROLE_SK[n.role] && ch(0.6) ? ROLE_SK[n.role] : pick(ks);
  sk[talent] = R(6, 8) + Math.random();
  const weak = pick(ks.filter((k) => k !== talent));
  sk[weak] = Math.random() * 1.2;
  const tr = [];
  const all = Object.keys(NTRAITS);
  const t1 = pick(all);
  tr.push(t1);
  if (ch(0.5)) {
    const t2 = pick(all.filter((t) => t !== t1 && NTRAITS[t1].bad !== t && NTRAITS[t].bad !== t1));
    if (t2) tr.push(t2);
  }
  if (tr.includes("handy")) ks.forEach((k) => {
    sk[k] = Math.min(10, sk[k] + 1);
  });
  n.sk = sk;
  n.tr = tr;
  n.shift = n.shift || "day";
  return n;
}
const skLv = (n, k) => k && n.sk ? n.sk[k] || 0 : 3;
const skMul = (n, k) => k ? 0.6 + skLv(n, k) * 0.12 : 1;
const workMul = (n) => (hasNT(n, "hard") ? 1.2 : 1) * (hasNT(n, "lazy") ? 0.8 : 1);
function npcXp(n, k, amt) {
  if (!k || !n.sk) return;
  const lv = n.sk[k] || 0, before = Math.floor(lv);
  n.sk[k] = Math.min(10, lv + 0.12 * amt * Math.max(0.15, 1 - lv / 11));
  if (Math.floor(n.sk[k]) > before) UI.log("📈 ".concat(n.name, ": ").concat(NSK[k][0], " ").concat(NSK[k][1], " — уровень ").concat(Math.floor(n.sk[k]), "!"), "good");
}
const _newNpcS = newNpc;
newNpc = function() {
  return npcInit(_newNpcS.apply(this, arguments));
};
function skBest(n) {
  return Object.entries(n.sk || {}).sort((a, b) => b[1] - a[1]);
}
function npcSkillsHtml(n) {
  npcInit(n);
  const role = ROLE_SK[n.role];
  return '<details class="nsk"><summary>📊 Навыки и характер'.concat(n.tr.length ? ": " + n.tr.map((t) => NTRAITS[t].ic + " " + NTRAITS[t].n).join(", ") : "", "</summary>\n    ").concat(n.tr.map((t) => '<div class="s muted">'.concat(NTRAITS[t].ic, " ").concat(NTRAITS[t].n, " — ").concat(NTRAITS[t].d, "</div>")).join(""), '\n    <div class="nskg">').concat(Object.entries(NSK).map(([k, [ic, nm]]) => {
    const v = n.sk[k] || 0, lv = Math.floor(v), pc = Math.floor((v - lv) * 100);
    return '<div class="nski '.concat(k === role ? "cur" : "", '"><span>').concat(ic, " ").concat(nm, '</span><b class="mono">').concat(lv, '</b><span class="mono muted">').concat(lv >= 10 ? "макс" : pc + "%", '</span><div class="mbar"><i style="width:').concat(v * 10, '%" class="').concat(v < 2 ? "bad" : v < 4 ? "warn" : "", '"></i></div></div>');
  }).join(""), '</div>\n    <div class="s muted">Навык профессии растёт от работы, бой и разведка — от вылазок. Множитель результата: ×').concat(skMul(n, role).toFixed(2)).concat(workMul(n) !== 1 ? " · характер ×".concat(workMul(n)) : "", ".</div></details>");
}
const _roleMenuS = roleMenu;
roleMenu = function(id) {
  const n = npcBy(id);
  if (!n) return;
  npcInit(n);
  UI.event({ title: "".concat(n.name, ": занятие"), text: "Лучшие навыки: ".concat(skBest(n).slice(0, 3).map(([k, v]) => "".concat(NSK[k][0], " ").concat(NSK[k][1], " ").concat(Math.floor(v))).join(", "), "."), choices: Object.entries(NPC_ROLES).map(([k, R0]) => {
    const sk = ROLE_SK[k], v = sk ? Math.floor(skLv(n, sk)) : null;
    return { t: "".concat(R0.ic, " ").concat(R0.n).concat(v != null ? " — навык ".concat(v).concat(v >= 6 ? " 👍" : v <= 1 ? " 👎" : "") : "").concat(n.role === k ? " (сейчас)" : ""), fn: () => wEdit(() => {
      n.role = k;
      if (k === "cook" && !n.q) n.q = [{ t: "auto" }];
    }) };
  }).concat([{ t: "Отмена" }]) });
};
window.wRole = roleMenu;
const SHIFTS = { day: "☀️ День", night: "🌙 Ночная смена", off: "🛌 Выходной" };
window.npcShift = (id, v) => wEdit(() => {
  const n = npcBy(id);
  if (n) n.shift = v;
});
const REQ_ITEMS = ["cigs", "coffee", "canned", "choco", "vodka", "painkill", "tea", "soda", "bandage", "smoked"];
function npcReqDaily(n) {
  if (n.req && G.time > n.req.until) {
    n.morale = Math.max(0, n.morale - 10);
    UI.log("😞 ".concat(n.name, " так и не дождался: ").concat(IT(n.req.id).n, ". Обиделся."), "warn");
    delete n.req;
    return;
  }
  if (!n.req && ch(0.12)) {
    const ids = REQ_ITEMS.filter((id2) => ITEMS[id2]);
    const id = pick(ids);
    n.req = { id, until: G.time + 3 * DAY };
    UI.log("🙏 ".concat(n.name, " просит: ").concat(IT(id).ic, " ").concat(IT(id).n, " (3 дня)."), "sys");
  }
}
window.npcGiveReq = (id) => {
  const n = npcBy(id);
  if (!n || !n.req) return;
  if (!atBase()) return UI.toast("Отдать можно на базе.");
  const it = n.req.id;
  const src = cnt(G.stash, it) ? G.stash : cnt(G.inv, it) ? G.inv : null;
  if (!src) return UI.toast("Нет такой вещи ни на складе, ни в рюкзаке.");
  wEdit(() => {
    take(src, it, 1);
    delete n.req;
    n.morale = Math.min(100, n.morale + 25);
    const k = ROLE_SK[n.role];
    if (k) npcXp(n, k, 3);
    UI.log("🤝 ".concat(n.name, " рад: ").concat(IT(it).n, ". Настроение выросло, работает с душой."), "good");
  });
};
let medHour = -1;
function medicTick() {
  if (!atBase() || G.combat || G.dead) return;
  const hr = Math.floor(G.time / H);
  if (hr === medHour) return;
  medHour = hr;
  const m = npcs().find((n) => n.role === "medic" && !n.exp && !n.car && n.shift !== "off");
  if (!m) return;
  const c = G.ch;
  if (!F().parts) return;
  const j = c.inj.find((x) => x.bleed > 0 && !x.band && x.t !== "frac" && x.t !== "bruise");
  if (j) {
    const id = cnt(G.stash, "bandage") ? "bandage" : cnt(G.stash, "dband") ? "dband" : null;
    if (id) {
      useItem(id, true, j);
      UI.log("⛑️ ".concat(m.name, " перевязал тебе рану (").concat(INJ[j.t].n, ")."), "good");
      npcXp(m, "med", 1);
      return;
    }
  }
  const inf = c.inj.find((x) => x.inf >= 40);
  if (inf && cnt(G.stash, "antibio") && !(c.antibioUntil > G.time)) {
    useItem("antibio", true);
    UI.log("⛑️ ".concat(m.name, " дал тебе антибиотики: воспаление пройдёт."), "good");
    npcXp(m, "med", 1.5);
  }
}
const _hordeTickS = hordeTick;
hordeTick = function(o) {
  const d = day(), was = !!(G.w.hordeDone && G.w.hordeDone[d]);
  if (!was && d % BNP() === 0 && hour() >= 22 && worldAuth()) {
    const gs = npcs().filter((n) => n.role === "guard" && !n.exp && !n.car && n.shift !== "off"), shots = [];
    for (const n of gs) {
      const w = nW(n);
      if (w && w.c === "gun") {
        const k = Math.min(cnt(G.stash, w.ammo), R(4, 10));
        if (k) {
          take(G.stash, w.ammo, k);
          shots.push("".concat(n.name, " (").concat(w.n, ", ").concat(k, " выстр.)"));
          npcXp(n, "fight", 2);
        }
      } else if (w) {
        wearNpc(n, "w", 6);
        npcXp(n, "fight", 1.5);
      }
    }
    if (shots.length) UI.log("🌙 Стража отстреливалась: ".concat(shots.join(", "), "."), "good");
  }
  return _hordeTickS.apply(this, arguments);
};
const CAR_TR = () => Object.entries(TRADERS).filter(([k]) => {
  const l = Object.keys(LOCS).find((id) => LOCS[id].trader === k);
  return l && G.w.locs[l] && G.w.locs[l].seen && route("base", l);
}).map(([k]) => k);
const trLoc = (k) => Object.keys(LOCS).find((id) => LOCS[id].trader === k);
function carItems(tr) {
  return G.stash.filter((e) => sellPrice(tr, e.id) > 0 && !["quest", "key", "money"].includes(IT(e.id).c)).sort((a, b) => sellPrice(tr, b.id) * (b.n || 1) - sellPrice(tr, a.id) * (a.n || 1));
}
function carValue(tr, sel, n) {
  let s = 0;
  for (const e of G.stash) if (sel[e.id]) s += sellPrice(tr, e.id) * Math.min(e.n || 1, sel[e.id] === true ? e.n || 1 : sel[e.id]);
  return Math.round(s * (0.85 + skLv(n, "scout") * 0.03));
}
function caravanMenu(id) {
  const n = npcBy(id);
  if (!n) return;
  if (!atBase()) return UI.toast("Караван отправляется с базы.");
  const trs = CAR_TR();
  if (!trs.length) return UI.toast("Сначала найди торговцев (деревня, маяк, метеостанция).");
  UI.event({ title: "🐪 ".concat(n.name, ": к кому идти?"), text: "Он унесёт отмеченные вещи и вернётся с деньгами в кассу. Чем лучше разведка, тем лучше цена.", choices: trs.map((k) => ({ t: "".concat(TRADERS[k].ic, " ").concat(TRADERS[k].n, " — ").concat(LOCS[trLoc(k)].n, ", ~").concat(Math.round(route("base", trLoc(k)).mins * 2 / 60 + 1), " ч"), fn: () => {
    UI._st.car = { npc: id, tr: k, sel: {} };
    UI._st.bsub = "people";
    setTimeout(() => UI.render(), 0);
  } })).concat([{ t: "Отмена" }]) });
}
window.caravanMenu = caravanMenu;
function caravanPanel() {
  const c = UI._st.car;
  if (!c) return "";
  const n = npcBy(c.npc);
  if (!n || n.exp || n.car) {
    UI._st.car = null;
    return "";
  }
  const items = carItems(c.tr), b = UI.btn, total = carValue(c.tr, c.sel, n), cap = 15 + (neq(n).b ? IT(neq(n).b.id).cap || 0 : 0);
  const wsel = G.stash.filter((e) => c.sel[e.id]).reduce((a, e) => a + (IT(e.id).w || 0) * (e.n || 1), 0);
  return '<div class="sec carp"><div class="sechead"><h2>🐪 Караван: '.concat(esc2(n.name), " → ").concat(TRADERS[c.tr].ic, " ").concat(TRADERS[c.tr].n, "</h2>").concat(b("✕", () => {
    UI._st.car = null;
  }, "sm"), '</div>\n    <p class="muted" style="font-size:13px">Отметь, что продать. Унесёт до ').concat(cap, ' кг (рюкзак жителя добавляет).</p>\n    <div class="list">').concat(items.map((e) => {
    const it = IT(e.id), on = !!c.sel[e.id];
    return '<div class="row '.concat(on ? "on" : "", '" style="cursor:pointer" onclick="').concat(UI.btn ? "" : "", "carToggle('").concat(e.id, '\')"><span class="ic">').concat(it.ic, '</span><div class="grow"><span class="t">').concat(esc2(it.n)).concat(e.n > 1 ? " ×" + e.n : "", '</span><span class="s">').concat(sellPrice(c.tr, e.id), "₽/шт · ").concat((it.w * (e.n || 1)).toFixed(1), ' кг</span></div><span class="chk">').concat(on ? "✓" : "", "</span></div>");
  }).join("") || '<p class="muted">Этот торговец ничего из склада не купит.</p>', '</div>\n    <div class="acts"><span class="mono ').concat(wsel > cap ? "bad" : "", '">').concat(wsel.toFixed(1), "/").concat(cap, " кг · ~").concat(total, "₽</span>").concat(b("🐪 Отправить", () => caravanGo(), "pri", !total || wsel > cap), "</div></div>");
}
window.carToggle = (id) => {
  const c = UI._st.car;
  if (!c) return;
  c.sel[id] = !c.sel[id];
  if (!c.sel[id]) delete c.sel[id];
  UI.render();
};
function caravanGo() {
  const c = UI._st.car;
  const n = npcBy(c && c.npc);
  if (!n) return;
  const take0 = [];
  for (const e of G.stash.slice()) if (c.sel[e.id]) {
    take0.push(Object.assign({}, e));
    G.stash.splice(G.stash.indexOf(e), 1);
  }
  const mins = route("base", trLoc(c.tr)).mins * 2 + 60;
  wEdit(() => {
    n.car = { tr: c.tr, items: take0, until: G.time + mins, at: G.time };
  });
  UI._st.car = null;
  UI.log("🐪 ".concat(n.name, " ушёл с караваном к ").concat(TRADERS[c.tr].n, ". Вернётся через ~").concat(Math.round(mins / 60), " ч."), "good");
  UI.render();
}
function caravanTick() {
  if (!worldAuth()) return;
  for (const n of npcs()) {
    const x = n.car;
    if (!x || G.time < x.until) continue;
    delete n.car;
    let sum = 0;
    for (const e of x.items) sum += sellPrice(x.tr, e.id) * (e.n || 1);
    sum = Math.round(sum * (0.85 + skLv(n, "scout") * 0.03));
    const dg = (LOCS[trLoc(x.tr)] || {}).dg || 1;
    if (ch(0.04 * dg) && skLv(n, "fight") < 4 && !(nW(n) && nW(n).dmg)) {
      const lost = Math.round(sum / 2);
      sum -= lost;
      UI.log("⚠️ На ".concat(n.name, " напали по дороге: отобрали ").concat(lost, "₽."), "warn");
      n.hp = Math.max(30, (n.hp == null ? 100 : n.hp) - 30);
    }
    if (sum > 0) invAdd(G.stash, "coin", sum);
    npcXp(n, "scout", 1.5);
    n.morale = Math.min(100, n.morale + 5);
    UI.log("🐪 ".concat(n.name, " вернулся от ").concat(TRADERS[x.tr].n, ": +").concat(sum, "₽ в кассу."), "good");
    try {
      SND("notify");
    } catch (e) {
    }
  }
}
const _tickNS = tick;
tick = function(st, o) {
  _tickNS.apply(this, arguments);
  try {
    if (G && !G.dead) {
      caravanTick();
      medicTick();
    }
  } catch (e) {
    console.warn(e);
  }
};
const _gearHtmlS = npcGearHtml;
npcGearHtml = function(n) {
  npcInit(n);
  if (n.car) return '<div class="wnow">🐪 С караваном у '.concat(TRADERS[n.car.tr].ic, " ").concat(TRADERS[n.car.tr].n, " · вернётся через ~").concat(Math.max(1, Math.round((n.car.until - G.time) / 60)), " ч</div>").concat(npcSkillsHtml(n));
  if (n.exp) return npcSkillsHtml(n);
  const req = n.req ? '<div class="nreq">🙏 Просит: '.concat(IT(n.req.id).ic, " ").concat(IT(n.req.id).n, " · ещё ").concat(Math.max(0, Math.ceil((n.req.until - G.time) / H)), " ч ").concat(UI.btn("Отдать", () => npcGiveReq(n.id), "sm", !(cnt(G.stash, n.req.id) || cnt(G.inv, n.req.id))), "</div>") : "";
  const sh = '<div class="toggle nshift">'.concat(Object.entries(SHIFTS).map(([k, t]) => '<button class="'.concat((n.shift || "day") === k ? "on" : "", '" onclick="npcShift(\'').concat(n.id, "','").concat(k, "')\">").concat(t, "</button>")).join(""), "</div>");
  return req + npcSkillsHtml(n) + sh + _gearHtmlS(n) + '<div class="acts">'.concat(UI.btn("🐪 Караван к торговцу…", () => caravanMenu(n.id), "sm", n.shift === "off"), "</div>");
};
const _workPanelS = CUI.work;
CUI.work = function() {
  return caravanPanel() + _workPanelS.apply(this, arguments);
};
addLoot2("toolbox", [["wire", 3]]);
if (CONT.minecart) CONT.minecart.loot.push(["wire", 2]);
RECIPES.push(
  { id: "wire_e", n: "Выдрать проволоку из электроники", need: { elec: 1 }, out: { wire: 2 }, t: 15 },
  { id: "wire_c", n: "Разобрать автозапчасти на проволоку", need: { carpart: 1 }, out: { wire: 2, scrap: 1 }, st: "bench", t: 25 }
);
if (TRADERS.semen) TRADERS.semen.stock.push(["wire", 0]);
if (TRADERS.serg) TRADERS.serg.stock.push(["wire", 0]);
Object.assign(ITEMS, {
  molotov: { n: "Коктейль Молотова", ic: "🍾", c: "raid", w: 0.6, v: 35, info: "В бою: поджигает всех вплотную и рядом. Горят ещё 2 хода." },
  smokeb: { n: "Дымовая шашка", ic: "💨", c: "raid", w: 0.3, v: 25, info: "В бою: 2 хода враги часто промахиваются, сбежать легче." },
  flashb: { n: "Светошумовая граната", ic: "💥", c: "raid", w: 0.3, v: 60, info: "В бою: оглушает всех врагов на 2 хода (боссов — на 1)." },
  noisem: { n: "Шумелка", ic: "⏰", c: "raid", w: 0.3, v: 20, info: "В бою: те, кто ещё не подошёл вплотную, уходят на звук." },
  egg: { n: "Яйца", ic: "🥚", c: "food", w: 0.1, v: 6, f: 8, raw: 0.3, cook: "omelet", sp: 96 },
  omelet: { n: "Яичница", ic: "🍳", c: "food", w: 0.2, v: 14, f: 26, sp: 36 },
  milk: { n: "Козье молоко", ic: "🥛", c: "drink", w: 0.5, v: 10, f: 6, d: 18, sp: 30 },
  honey: { n: "Мёд", ic: "🍯", c: "food", w: 0.3, v: 30, f: 10, stress: -6, info: "Не портится. Успокаивает." },
  hen: { n: "Курица (живая)", ic: "🐔", c: "mat", w: 2, v: 60, info: "Для курятника на базе (2 штуки)." },
  goat: { n: "Коза", ic: "🐐", c: "mat", w: 8, v: 150, info: "Для загона на базе." },
  bees: { n: "Рой в ловушке", ic: "🐝", c: "mat", w: 2, v: 90, info: "Для улья на базе." },
  tmap: { n: "Карта тайника", ic: "🗺️", c: "tool", w: 0.05, v: 40, info: "Изучи — и на острове появится метка тайника." }
});
RECIPES.push(
  { id: "molotov", n: "Коктейль Молотова", need: { bottle: 1, rag: 1, fuel: 1 }, out: { molotov: 2 }, t: 15 },
  { id: "molotov2", n: "Коктейль Молотова (на водке)", need: { vodka: 1, rag: 1 }, out: { molotov: 1, bottle: 0 }, t: 10 },
  { id: "smokeb", n: "Дымовая шашка", need: { rag: 2, herbs: 2, tape: 1 }, out: { smokeb: 1 }, t: 20 },
  { id: "noisem", n: "Шумелка", need: { watch: 1, scrap: 1 }, out: { noisem: 2 }, st: "bench", t: 20 },
  { id: "omelet", n: "Пожарить яичницу", need: { egg: 2 }, out: { omelet: 1 }, st: "fire", t: 10 }
);
RECIPES.find((r) => r.id === "molotov2").out = { molotov: 1 };
addLoot2("milcrate", [["flashb", 1], ["smokeb", 1]]);
addLoot2("armory", [["flashb", 1]]);
if (TRADERS.semen) TRADERS.semen.stock.push(["hen", 1], ["goat", 2]);
Object.assign(SALVAGE, { noisem: { scrap: 1 } });
const THROWS = ["molotov", "smokeb", "flashb", "noisem", "bomb"];
function throwIt(id) {
  const cb = G.combat;
  if (!cb || !cnt(G.inv, id) || id === "bomb") return;
  take(G.inv, id, 1);
  G.ch.st = G.ch.st || {};
  G.ch.st.thrown = (G.ch.st.thrown || 0) + 1;
  const alive = cb.en.filter((e) => e.hp > 0);
  if (id === "molotov") {
    noise(10);
    SND("fire");
    let n = 0;
    for (const e of alive) if (e.dist <= 1) {
      const D = ENEMY[e.id];
      const d = Math.max(2, Math.round(R(10, 18) * (D.boss ? 0.5 : 1) - (D.arm || 0) * 0.5));
      e.hp -= d;
      e.burn = 2;
      n++;
    }
    cLog(n ? "🍾 Бутылка разбилась — огонь охватил ".concat(n, " врагов!") : "🍾 Бутылка разбилась вдалеке — никого не задело.", n ? "good" : "dim");
  }
  if (id === "smokeb") {
    cb.smoke = 2;
    cLog("💨 Всё затянуло дымом: враги бьют вслепую, уйти будет проще.", "good");
  }
  if (id === "flashb") {
    noise(15);
    SND("shotgun");
    for (const e of alive) e.stun = Math.max(e.stun || 0, ENEMY[e.id].boss ? 1 : 2);
    cLog("💥 Вспышка и грохот — враги оглушены!", "good");
  }
  if (id === "noisem") {
    let n = 0;
    for (const e of alive) if (e.dist >= 1 && !ENEMY[e.id].boss && !ENEMY[e.id].human && ch(0.75)) {
      e.hp = 0;
      e.dead = true;
      e.gone = true;
      n++;
    }
    cLog(n ? "⏰ Шумелка затрезвонила — ".concat(n, " ушли на звук.") : "⏰ Шумелка звенит, но им не до неё.", n ? "good" : "dim");
  }
  endPlayerTurn();
}
window.throwIt = throwIt;
function wrapCombatUi() {
  if (typeof UI === "undefined" || !UI.combat || UI.combat._thr) return;
  const _uiCombatT = UI.combat;
  UI.combat = function() {
    const r = _uiCombatT.apply(this, arguments);
    try {
      const sh = document.querySelector("#modal .sheet.combat");
      if (sh && G.combat) {
        const have = THROWS.filter((id) => id !== "bomb" && cnt(G.inv, id));
        if (have.length) {
          const d = document.createElement("div");
          d.className = "acts throws";
          d.innerHTML = '<span class="mono muted" style="font-size:12px">Бросить:</span>' + have.map((id) => '<button class="btn sm" onclick="throwIt(\''.concat(id, '\')" title="').concat((IT(id).info || "").replace(/"/g, ""), '">').concat(IT(id).ic, " ").concat(IT(id).n, " ×").concat(cnt(G.inv, id), "</button>")).join("");
          const L2 = sh.querySelector(".list");
          if (L2) L2.after(d);
        }
      }
    } catch (e) {
    }
    return r;
  };
  UI.combat._thr = 1;
}
if (typeof window !== "undefined" && window.addEventListener) window.addEventListener("load", wrapCombatUi);
const _enemyTurnT = enemyTurn;
enemyTurn = function() {
  const cb = G.combat;
  if (cb) {
    for (const e of cb.en) if (e.hp > 0 && e.burn > 0) {
      const d = R(4, 7);
      e.hp -= d;
      e.burn--;
      cLog("🔥 ".concat(ENEMY[e.id].n, " горит: −").concat(d), "good");
      if (e.hp <= 0 && !e.dead) {
        e.dead = true;
        onKill(e);
      }
    }
    if (cb.en.every((e) => e.hp <= 0)) return endCombat("win");
    for (const e of cb.en.slice()) if (e.hp > 0 && e.id === "screamer" && (e.calls || 0) < 2 && !e.stun && ch(0.35)) {
      e.calls = (e.calls || 0) + 1;
      const z = mkEnemy(ch(0.5) ? "zombie" : "runner");
      z.dist = 2;
      cb.en.push(z);
      noise(8);
      cLog("😱 Крикун визжит — на крик идёт ".concat(ENEMY[z.id].n, "!"), "bad");
    }
  }
  const r = _enemyTurnT.apply(this, arguments);
  if (G.combat && G.combat.smoke > 0) G.combat.smoke--;
  return r;
};
const _enemyHitT = enemyHit;
enemyHit = function(e, ranged, near) {
  if (G.combat && G.combat.smoke > 0 && ch(0.5)) {
    cLog("💨 ".concat(ENEMY[e.id].n, " бьёт вслепую и промахивается."), "dim");
    return;
  }
  return _enemyHitT.apply(this, arguments);
};
const _fleeChanceT = fleeChance;
fleeChance = function() {
  let p = _fleeChanceT.apply(this, arguments);
  const c = G.ch;
  if (G.combat && G.combat.smoke > 0) p += 0.35;
  if (c.inj.some((j) => j.t === "disl" && (j.part === "lleg" || j.part === "rleg"))) p -= 0.15;
  return clamp(p, 0.05, 0.95);
};
Object.assign(ENEMY, {
  screamer: { n: "Крикун", ic: "😱", spr: "zombie", hp: 20, dmg: [3, 6], sp: 1, acc: 0.5, inj: ["scratch", "bite"], loot: "body", xp: 8, note: "Сам слабый, но визжит и зовёт других. Убей первым — или оглуши." },
  bloater: { n: "Толстяк", ic: "🤮", spr: "swamper", hp: 55, dmg: [5, 9], sp: 1, acc: 0.5, inj: ["bruise", "bite"], loot: "body", xp: 10, note: "Если убить его вплотную — лопнет и обожжёт кислотой. Стреляй издалека или оттолкни." },
  sniper: { n: "Снайпер-мародёр", ic: "🎯", spr: "raider", hp: 34, dmg: [7, 11], sp: 1, acc: 0.62, arm: 1, human: 1, inj: ["bullet", "bruise"], loot: "locker", xp: 14, noVirus: 1, gear: [["ak", 2], ["pm", 1]], note: "Начинает издалека и стреляет, пока ты подходишь. Огнестрел, лук или дым." },
  rats: { n: "Рой крыс", ic: "🐀", spr: "dog", hp: 26, dmg: [2, 4], sp: 2, acc: 0.8, inj: ["bite", "scratch"], noVirus: 1, xp: 6, note: "Почти всегда попадают, но бьют слабо. Огонь разгоняет их лучше всего." }
});
const _mkEnemyT = mkEnemy;
mkEnemy = function(id) {
  const e = _mkEnemyT.apply(this, arguments);
  if (id === "sniper") e.dist = 2;
  return e;
};
const _onKillT = onKill;
onKill = function(e) {
  if (e.gone) return;
  const r = _onKillT.apply(this, arguments);
  G.best = G.best || {};
  const b = G.best[e.id] = G.best[e.id] || { s: 1, k: 0 };
  b.k++;
  if (e.id === "bloater" && e.dist === 0 && G.combat) {
    const d = R(6, 11);
    const msg = hitPlayer(d, ch(0.5) ? "burn" : "bruise", null, "Толстяк");
    cLog("🤮 Толстяк лопнул — кислота обжигает: −".concat(d), "bad");
    if (msg) cLog(msg, "bad");
  }
  return r;
};
const _startCombatT = startCombat;
startCombat = function(en) {
  wrapCombatUi();
  G.best = G.best || {};
  for (const e of en || []) {
    const b = G.best[e.id] = G.best[e.id] || { s: 0, k: 0 };
    b.s = 1;
  }
  return _startCombatT.apply(this, arguments);
};
const _spawnListT = spawnList;
spawnList = function(spec) {
  const out = _spawnListT.apply(this, arguments);
  try {
    if (out.length && G.room != null && !G.combat && !LOCS[G.loc].base && ch(0.05 * modeK())) {
      const dg = LOCS[G.loc].dg || 1;
      const id = wpick(dg >= 2 ? [["screamer", 3], ["bloater", 2], ["sniper", 1], ["rats", 2]].map((x) => x) : [["screamer", 2], ["rats", 2], ["bloater", 1]]);
      out.push(mkEnemy(id));
    }
  } catch (e) {
  }
  return out;
};
const modeK = () => (MODES[G.mode].f.enemies || 1) >= 1.1 ? 1 : 0.5;
const _roadEventT = roadEvent;
roadEvent = function(to, done) {
  if (!ch(0.25)) return _roadEventT.apply(this, arguments);
  const evs = [
    [() => {
      const hasB = G.inv.find((e) => IT(e.id).med === "band");
      UI.event({ title: "🧳 Раненый торговец", text: "У обочины сидит мужик с огромным рюкзаком. Нога в крови.\n«Друг, перевяжи — в долгу не останусь».", choices: [
        { t: hasB ? "🩹 Перевязать" : "🩹 Перевязать (нечем)", fn: () => {
          if (!hasB) {
            UI.log("Нечем перевязать. Торговец выругался и захромал прочь.");
            return done();
          }
          take(G.inv, hasB.id, 1);
          advance(10);
          const T = pick(Object.values(TRADERS));
          const it = pick(T.stock.filter((x) => x[1] <= 2).map((x) => x[0]).filter((id) => ITEMS[id] && IT(id).c !== "bp"));
          invAdd(G.inv, it, IT(it).c === "ammo" ? R(8, 15) : 1);
          G.money += R(30, 80);
          UI.log("🤝 Торговец отблагодарил: ".concat(IT(it).ic, " ").concat(IT(it).n, " и немного денег."), "good");
          done();
        } },
        { t: "🚶 Пройти мимо", fn: done }
      ] });
    }, 3],
    [() => {
      const en = [mkEnemy("sniper"), mkEnemy("raider")];
      const p = Math.max(0.1, stealthChance() - 0.1);
      UI.event({ title: "🎯 Засада", cls: "bad", text: "Пуля выбивает щепки из дерева у твоей головы. Где-то на холме — снайпер, а из кустов выходит его напарник.", choices: [
        { t: "🌿 Уйти перебежками (".concat(Math.round(p * 100), "%)"), fn: () => {
          if (ch(p)) {
            UI.log("🐾 Ты ушёл от засады.", "good");
            advance(20);
            done();
          } else {
            UI.log("Не вышло — бой!", "bad");
            startCombat(en, { onEnd: done, road: true });
          }
        } },
        { t: "⚔️ Принять бой", fn: () => startCombat(en, { onEnd: done, road: true }) }
      ] });
    }, 1],
    [() => UI.event({ title: "🚚 Брошенный грузовик", text: "Посреди дороги стоит грузовик с распахнутыми дверями. Кузов накрыт брезентом.", choices: [
      { t: "🔍 Обыскать (30 мин)", fn: () => {
        advance(30);
        if (G.dead) return;
        if (ch(0.25)) {
          UI.log("Под брезентом кто-то шевелится!", "bad");
          return startCombat(spawnList([["zombie", 1, 2], ["bloater", 0, 1]]), { onEnd: () => {
            truckLoot();
            done();
          }, road: true });
        }
        truckLoot();
        done();
      } },
      { t: "🚶 Не рисковать", fn: done }
    ] }), 3],
    [() => UI.event({ title: "🐕 Пёс зовёт за собой", text: "Худой пёс лает, отбегает и оглядывается — будто зовёт куда-то.", choices: [
      { t: "🐾 Пойти за ним (40 мин)", fn: () => {
        advance(40);
        if (G.dead) return;
        if (ch(0.2)) {
          UI.log("Пёс привёл прямо к стае!", "bad");
          return startCombat(spawnList([["pdog", 1, 2]]), { onEnd: done, road: true });
        }
        const C = CONT.stash || CONT.backpack, got = [];
        for (let k = R(2, 4); k > 0; k--) {
          const id = wpick(C.loot);
          if (IT(id).c === "key" || IT(id).c === "bp") continue;
          invAdd(G.inv, id, IT(id).c === "ammo" ? R(4, 10) : 1);
          got.push(IT(id).ic + " " + IT(id).n);
        }
        UI.event({ title: "🐕 Тайник!", cls: "good", text: "Пёс привёл к старому схрону под корнями: ".concat(got.join(", ") || "пусто", "."), choices: [{ t: "Погладить пса и идти дальше", fn: done }] });
      } },
      { t: "🚶 Идти своей дорогой", fn: done }
    ] }), 2],
    [() => {
      const has = G.inv.find((e) => ["canned", "ration", "smoked", "jerky"].includes(e.id));
      UI.event({ title: "🧙 Отшельник", text: "Старик в лохмотьях греется у костерка. «Еды не найдётся? Травами отплачу».", choices: [
        { t: has ? "🥫 Отдать: ".concat(IT(has.id).n) : "🥫 Отдать еду (нет)", fn: () => {
          if (!has) return done();
          take(G.inv, has.id, 1);
          const gifts = [["herbs", 3], ["antisep", 1], ["coldpill", 1], ["painkill", 1], ["tmap", 1]];
          const [id, n] = pick(gifts);
          invAdd(G.inv, id, n);
          UI.log("🧙 Отшельник дал: ".concat(IT(id).ic, " ").concat(IT(id).n).concat(n > 1 ? " ×" + n : "", "."), "good");
          done();
        } },
        { t: "🚶 Пройти мимо", fn: done }
      ] });
    }, 2]
  ];
  wpick(evs)();
};
function truckLoot() {
  const got = [];
  for (let i = 0; i < 2; i++) for (let k = R(1, 3); k > 0; k--) {
    const id = wpick(CONT.car.loot);
    invAdd(G.inv, id, IT(id).c === "ammo" ? R(3, 8) : id === "wire" ? R(1, 3) : 1);
    got.push(IT(id).ic);
  }
  UI.log("🚚 В грузовике: ".concat(got.join(" ") || "ничего", "."), got.length ? "good" : "dim");
}
function bestiaryHtml() {
  const B = G.best || {}, ids = Object.keys(ENEMY), seen = ids.filter((id) => B[id]);
  const row = (id) => {
    const D = ENEMY[id], b = B[id];
    const drop2 = [D.loot && CONT[D.loot] ? "обыск: ".concat(CONT[D.loot].n.toLowerCase()) : "", D.drop ? D.drop.map(([k]) => IT(k).ic + IT(k).n).join(", ") : "", D.gear ? "может быть вооружён" : ""].filter(Boolean).join(" · ");
    const flags = [D.boss ? "👑 босс" : "", D.human ? "человек" : "", D.sp >= 2 ? "быстрый" : D.sp === 0 ? "держит дистанцию" : "", D.arm ? "броня ".concat(D.arm) : "", D.acid ? "кислота портит броню" : "", D.cloak ? "прячется" : "", D.noVirus ? "" : "укус может заразить"].filter(Boolean).join(", ");
    return '<div class="row"><span class="ic">'.concat(D.ic, '</span><div class="grow"><span class="t">').concat(D.n, ' <span class="mono muted">убито: ').concat(b.k, '</span></span><span class="s">❤️ ').concat(D.hp, " · урон ").concat(D.dmg[0], "–").concat(D.dmg[1], " · меткость ").concat(Math.round(D.acc * 100), "%").concat(flags ? " · " + flags : "", "</span>").concat(D.note ? '<span class="s">💡 '.concat(D.note, "</span>") : "").concat(drop2 ? '<span class="s">🎁 '.concat(drop2, "</span>") : "", "</div></div>");
  };
  return '<div class="sec"><div class="sechead"><h2>📖 Бестиарий</h2><span class="mono">'.concat(seen.length, "/").concat(ids.length, '</span></div><div class="list">').concat(seen.map(row).join("") || '<p class="muted">Пока никого. Записи появляются после первой встречи.</p>', "</div>").concat(seen.length < ids.length ? '<p class="muted" style="font-size:13px">Ещё не встречено: '.concat(ids.length - seen.length, ".</p>") : "", "</div>");
}
Object.assign(ENEMY.zombie, { note: "Медленный и слабый поодиночке. Опасен толпой — не дай окружить." });
Object.assign(ENEMY.runner, { note: "Быстро сокращает дистанцию. Встречай ударом, не убегай." });
Object.assign(ENEMY.dog, { note: "Ходит стаями. Мясо или рыба могут приручить." });
Object.assign(ENEMY.raider, { note: "Может быть с огнестрелом. Иногда можно договориться." });
Object.assign(ENEMY.swamper, { note: "Прячется в тумане болота. Бьёт сильно — держи аптечку." });
Object.assign(ENEMY.pdog, { note: "Быстрый мутант аномальных зон." });
if (ENEMY.acid) ENEMY.acid.note = "Кислота разъедает бронежилет — снимай его или бей издалека.";
if (ENEMY.armored) ENEMY.armored.note = "Толстая броня: огнестрел и тяжёлое оружие.";
Object.assign(STRUCT, {
  coop: { n: "Курятник", ic: "🐔", lv: [{ n: "Нет" }, { n: "Курятник", c: { planks: 6, nails: 10, hen: 2 } }] },
  goatpen: { n: "Загон для козы", ic: "🐐", lv: [{ n: "Нет" }, { n: "Загон с козой", c: { planks: 8, rope: 2, goat: 1 } }] },
  hive: { n: "Улей", ic: "🐝", lv: [{ n: "Нет" }, { n: "Улей с пчёлами", c: { planks: 4, nails: 6, bees: 1 } }] }
});
function animalsDaily() {
  const s = G.w.struct, win = season() === 1, out = [];
  if (s.coop) {
    const feed = ["compost", "berries", "veg", "seeds", "mushroom"].find((id) => cnt(G.stash, id));
    if (feed) {
      take(G.stash, feed, 1);
      const k = R(1, 3) - (win ? 1 : 0);
      if (k > 0) {
        invAdd(G.stash, "egg", k);
        out.push("🥚×".concat(k));
      }
    } else out.push("🐔 куры голодные (компост, ягоды, овощи, семена)");
  }
  if (s.goatpen) {
    if (win) {
      const feed = ["veg", "berries", "herbs"].find((id) => cnt(G.stash, id));
      if (feed) take(G.stash, feed, 1);
      else {
        out.push("🐐 козе нечего есть зимой");
      }
    }
    const k = R(1, 2);
    invAdd(G.stash, "milk", k);
    out.push("🥛×".concat(k));
  }
  if (s.hive && !win && day() % 2 === 0) {
    invAdd(G.stash, "honey", 1);
    out.push("🍯×1");
    if (s.garden) G.w.prod.garden += 3;
  }
  if (out.length) UI.log("🏡 Хозяйство: " + out.join(" · "), "sys");
}
const _hordeTickA = hordeTick;
hordeTick = function(o) {
  const d = day(), was = !!(G.w.hordeDone && G.w.hordeDone[d]);
  const r = _hordeTickA.apply(this, arguments);
  if (!was && G.w.hordeDone && G.w.hordeDone[d] && worldAuth()) {
    const power = Math.round((25 + d * 2.5) * F().horde), an = ["coop", "goatpen", "hive"].filter((k) => G.w.struct[k]);
    if (an.length && defense() < power && ch(0.5)) {
      const k = pick(an);
      G.w.struct[k] = 0;
      UI.log("🩸 Орда добралась до хозяйства: ".concat(STRUCT[k].n, " разорён."), "bad");
    }
  }
  return r;
};
let animDayDone = -1;
function dailyMisc() {
  const d = day();
  if (G.w.animDay === d || animDayDone === d) return;
  if (hour() < 7) return;
  animDayDone = d;
  if (!worldAuth()) return;
  G.w.animDay = d;
  animalsDaily();
}
INJ.disl = { n: "Вывих", bleed: 0, heal: 30 };
INJ.conc = { n: "Сотрясение", bleed: 0, heal: 16 };
const _hitPlayerT = hitPlayer;
hitPlayer = function(dmg, inj, part, why) {
  const n0 = G.ch.inj.length, r = _hitPlayerT.apply(this, arguments);
  const j = G.ch.inj.length > n0 ? G.ch.inj[G.ch.inj.length - 1] : null;
  if (j && j.t === "bruise" && F().parts) {
    if (j.part === "head" && ch(0.2)) {
      j.t = "conc";
      UI.log("💫 Удар по голове — сотрясение. Мутит, руки не слушаются.", "warn");
    } else if (j.part !== "head" && j.part !== "torso" && ch(0.08)) {
      j.t = "disl";
      UI.log("🦴 Вывих: ".concat(PARTS[j.part].n, ". Нужно вправить."), "warn");
    }
  }
  return r;
};
window.reduceDisl = (j) => {
  if (!G.ch.inj.includes(j)) return;
  const pk = G.inv.find((e) => IT(e.id).med === "pain"), p = pk ? 0.85 : 0.6;
  if (pk) take(G.inv, pk.id, 1);
  advance(5);
  if (ch(p)) {
    G.ch.inj.splice(G.ch.inj.indexOf(j), 1);
    UI.log("🦴 Хрусь — сустав встал на место".concat(pk ? " (с обезболивающим было терпимо)" : "", "."), "good");
  } else {
    G.ch.parts[j.part] = Math.max(1, G.ch.parts[j.part] - 3);
    G.ch.stress = clamp(G.ch.stress + 10, 0, 100);
    UI.log("🦴 Не вышло — только больнее. Попробуй ещё раз или найди медика.", "warn");
  }
  UI.render();
};
const _accModsT = accMods;
accMods = function() {
  let a = _accModsT.apply(this, arguments);
  const c = G.ch;
  if (c.inj.some((j) => j.t === "conc")) a -= 0.12;
  if (c.inj.some((j) => j.t === "disl" && (j.part === "larm" || j.part === "rarm"))) a -= 0.1;
  if (c.addict && G.time - (c.pkAt || 0) > 12 * H) a -= 0.05;
  return a;
};
const _useItemT = useItem;
useItem = function(id, quick, target) {
  const c = G.ch, it = IT(id), had = cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0);
  const r = _useItemT.apply(this, arguments);
  const used = cnt(G.inv, id) + (atBase() ? cnt(G.stash, id) : 0) < had;
  if (used) {
    c.st = c.st || {};
    if (it.c === "food" || it.c === "drink") c.st.ate = (c.st.ate || 0) + 1;
    if (it.c === "med") c.st.healed = (c.st.healed || 0) + 1;
    if (it.med === "pain") {
      c.pkLog = (c.pkLog || []).filter((t) => G.time - t < 48 * H).concat([G.time]);
      c.pkAt = G.time;
      if (!c.addict && c.pkLog.length >= 4) {
        c.addict = G.time;
        UI.log("💊 Слишком часто глушишь боль таблетками — тянет ещё. Без них будет ломка.", "warn");
      }
    }
    if (id === "tmap") {
    }
  }
  return r;
};
let addictHour = -1;
function addictTick() {
  const c = G.ch;
  if (!c.addict) return;
  const hr = Math.floor(G.time / H);
  if (hr === addictHour) return;
  addictHour = hr;
  const since = G.time - (c.pkAt || 0);
  if (since > 96 * H) {
    delete c.addict;
    c.pkLog = [];
    UI.log("💊 Ломка отпустила. Тяга к таблеткам прошла.", "good");
    return;
  }
  if (since > 12 * H) c.stress = clamp(c.stress + 2, 0, 100);
}
const _moodlesT = moodles;
moodles = function() {
  const m = _moodlesT.apply(this, arguments), c = G.ch, add = (ic, n, l, d) => m.push({ ic, n, l, d });
  if (c.inj.some((j) => j.t === "conc")) add("💫", "Сотрясение", 2, "Хуже целишься. Пройдёт за сутки, сон ускоряет.");
  if (c.inj.some((j) => j.t === "disl")) add("🦴", "Вывих", 2, "Вправь на вкладке «Тело» (с обезболивающим проще) или у медика на базе.");
  if (c.addict && G.time - (c.pkAt || 0) > 12 * H) add("💊", "Ломка", 2, "Тянет к обезболивающим: растёт стресс. Перетерпи ~4 суток.");
  return m;
};
const _medicTickT = medicTick;
medicTick = function() {
  const hr0 = medHour;
  _medicTickT.apply(this, arguments);
  if (!atBase()) return;
  const m = npcs().find((n) => n.role === "medic" && !n.exp && !n.car && n.shift !== "off");
  const j = m && G.ch.inj.find((x) => x.t === "disl");
  if (j && ch(0.9)) {
    G.ch.inj.splice(G.ch.inj.indexOf(j), 1);
    UI.log("⛑️ ".concat(m.name, " вправил тебе вывих."), "good");
  }
};
function readMap(where) {
  const list = where === "stash" ? G.stash : G.inv;
  if (!take(list, "tmap", 1) && !cnt(list, "tmap")) {
  }
  const locs = Object.keys(LOCS).filter((id) => id !== "base" && !LOCS[id].ch2 && LOCS[id].rooms && !LOCS[id].trader);
  const loc = pick(locs);
  G.w.caches = (G.w.caches || []).concat([{ loc, id: Date.now() % 1e9 }]);
  const hints = ["под приметным камнем", "у старого дерева с зарубкой", "в нише под крыльцом", "за ржавой бочкой", "под половицей"];
  UI.event({ title: "🗺️ Карта тайника", text: "На обороте — грубо нарисованная схема: ".concat(LOCS[loc].ic, " ").concat(LOCS[loc].n, ", ").concat(pick(hints), ".\n\nМетка появится в этом месте: «Копать тайник»."), choices: [{ t: "Понятно" }] });
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
const _salvBtnM = CUI.salvageBtn;
CUI.salvageBtn = (e, where) => {
  let h = _salvBtnM(e, where);
  if (e.id === "tmap" && (where === "inv" || atBase())) h = UI.btn("🗺️ Изучить карту", () => readMap(where), "pri sm") + h;
  return h;
};
function digCache(id) {
  const cs = G.w.caches || [], c = cs.find((x) => x.id === id && x.loc === G.loc);
  if (!c) return;
  advance(40);
  if (G.dead) return;
  G.w.caches = cs.filter((x) => x !== c);
  const got = [];
  const pool = [CONT.stash, CONT.safe, CONT.milcrate].filter(Boolean);
  for (let k = R(3, 5); k > 0; k--) {
    const C = pick(pool), id2 = wpick(C.loot);
    if (IT(id2).c === "key" || IT(id2).c === "bp") continue;
    invAdd(G.inv, id2, IT(id2).c === "ammo" ? R(6, 14) : 1);
    got.push(IT(id2).ic + " " + IT(id2).n);
  }
  const m = R(50, 150);
  G.money += m;
  G.ch.st = G.ch.st || {};
  G.ch.st.caches = (G.ch.st.caches || 0) + 1;
  UI.event({ title: "🗺️ Тайник найден!", cls: "good", text: "Под землёй — обмотанный плёнкой ящик: ".concat(got.join(", "), " и ").concat(m, "₽."), choices: [{ t: "Отлично" }] });
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
window.digCache = digCache;
const _locRowsM = EXTUI.locRows;
EXTUI.locRows = function() {
  let h = _locRowsM.apply(this, arguments);
  for (const c of (G.w.caches || []).filter((x) => x.loc === G.loc)) h += '<div class="row evt"><span class="ic">🗺️</span><div class="grow"><span class="t">Тайник по карте</span><span class="s">где-то здесь, по схеме · 40 мин</span></div><button class="btn sm pri" onclick="digCache('.concat(c.id, ')">⛏️ Копать</button></div>');
  return h;
};
const _craftT = craft;
craft = function(r) {
  const before = JSON.stringify(G.inv.length) + cnt(G.inv, Object.keys(r.out)[0]);
  const res = _craftT.apply(this, arguments);
  if (before !== JSON.stringify(G.inv.length) + cnt(G.inv, Object.keys(r.out)[0])) {
    G.ch.st = G.ch.st || {};
    G.ch.st.crafted = (G.ch.st.crafted || 0) + 1;
  }
  return res;
};
const _searchContT = searchCont;
searchCont = function(k) {
  const r = _searchContT.apply(this, arguments);
  G.ch.st = G.ch.st || {};
  G.ch.st.searched = (G.ch.st.searched || 0) + 1;
  return r;
};
const _goToT = goTo;
goTo = function(dest) {
  G.ch.st = G.ch.st || {};
  G.ch.st.trips = (G.ch.st.trips || 0) + 1;
  return _goToT.apply(this, arguments);
};
function chronicle() {
  const c = G.ch, st = c.st || {}, days = Math.floor((G.time - (c.born || 0)) / DAY), B = G.best || {};
  const fav = Object.entries(B).sort((a, b) => b[1].k - a[1].k)[0];
  const bosses = Object.keys(ENEMY).filter((id) => ENEMY[id].boss && B[id] && B[id].k).map((id) => ENEMY[id].n);
  return {
    name: c.name,
    mode: MODES[G.mode].n,
    days,
    kills: c.kills || 0,
    cause: G.lastHurt || "",
    at: Date.now(),
    crafted: st.crafted || 0,
    searched: st.searched || 0,
    trips: st.trips || 0,
    ate: st.ate || 0,
    caches: st.caches || 0,
    thrown: st.thrown || 0,
    fav: fav ? "".concat(ENEMY[fav[0]].ic, " ").concat(ENEMY[fav[0]].n, " (").concat(fav[1].k, ")") : "",
    bosses,
    best: Object.keys(B).length,
    prof: (PROFS[c.prof] || {}).n || ""
  };
}
const chronText = (x) => "".concat(x.name).concat(x.prof ? ", " + x.prof : "", " · ").concat(x.mode, "\nПрожил ").concat(x.days, " дн. Убито: ").concat(x.kills).concat(x.fav ? " (чаще всего — ".concat(x.fav, ")") : "", ".\n").concat(x.bosses.length ? "Повержены: ".concat(x.bosses.join(", "), ".\n") : "", "Обысков: ").concat(x.searched, ", походов: ").concat(x.trips, ", сделано вещей: ").concat(x.crafted, ", съедено: ").concat(x.ate, ".").concat(x.caches ? " Тайников найдено: ".concat(x.caches, ".") : "", "\nВ бестиарии: ").concat(x.best, " видов.").concat(x.cause ? "\nПричина гибели: ".concat(x.cause, ".") : "");
const _dieT = die;
die = function(cause) {
  const was = G.dead, r = _dieT.apply(this, arguments);
  if (!was && G.dead) {
    try {
      const x = chronicle();
      x.cause = cause || x.cause;
      let L2 = [];
      try {
        L2 = JSON.parse(localStorage.getItem("moti3_chron") || "[]");
      } catch (e) {
      }
      L2.unshift(x);
      localStorage.setItem("moti3_chron", JSON.stringify(L2.slice(0, 15)));
      UI.log("📜 История этого выжившего записана в Журнал → Итоги → Летопись.", "sys");
    } catch (e) {
    }
  }
  return r;
};
function chronHtml() {
  let L2 = [];
  try {
    L2 = JSON.parse(localStorage.getItem("moti3_chron") || "[]");
  } catch (e) {
  }
  const cur = chronicle();
  return '<div class="sec"><h2>📜 Летопись</h2><div class="note" style="white-space:pre-line"><b>Сейчас:</b> '.concat(esc2(chronText(Object.assign({}, cur, { cause: "" }))), "</div>").concat(L2.length ? '<div class="list">'.concat(L2.map((x) => '<div class="note" style="white-space:pre-line;opacity:.9">'.concat(new Date(x.at).toLocaleDateString("ru-RU"), " — ").concat(esc2(chronText(x)), "</div>")).join(""), "</div>") : '<p class="muted" style="font-size:13px">Здесь будут истории погибших выживших.</p>', "</div>");
}
ACH.push(
  { id: "bestiary10", ic: "📖", n: "Натуралист", d: "Встретить 10 видов врагов", ok: () => Object.keys(G.best || {}).length >= 10 },
  { id: "thrower", ic: "🍾", n: "Метатель", d: "Бросить 10 гранат, бутылок или шашек", ok: () => ((G.ch.st || {}).thrown || 0) >= 10 },
  { id: "farmer", ic: "🐐", n: "Фермер", d: "Курятник, загон и улей на базе", ok: () => G.w.struct.coop && G.w.struct.goatpen && G.w.struct.hive },
  { id: "treasure", ic: "🗺️", n: "Кладоискатель", d: "Найти 3 тайника по картам", ok: () => ((G.ch.st || {}).caches || 0) >= 3 },
  { id: "explorer2", ic: "🧭", n: "Белые пятна", d: "Побывать в аэродроме, психбольнице, затопленной деревне и на радиовышке", ok: () => ["airfield", "asylum", "flooded", "radiotower"].every((id) => G.w.locs[id] && G.w.locs[id].visited) }
);
const _cuiJourZ = CUI.jour;
CUI.jour = function() {
  return _cuiJourZ.apply(this, arguments) + bestiaryHtml() + chronHtml();
};
Object.assign(LOCS, {
  airfield: {
    n: "Аэродром",
    ic: "🛩️",
    x: 60,
    y: 9,
    dg: 2,
    d: "Заросшая взлётка, ангары и сбитый транспортник. Мародёры устроили тут наблюдательный пункт.",
    links: { meteo: 60, nii: 70, swamp: 70 },
    rooms: [
      { n: "Взлётная полоса", cont: ["car", "body"], en: [["zombie", 1, 2], ["sniper", 0, 1]] },
      { n: "Ангар", cont: ["toolbox", "shed", "car"], en: [["raider", 1, 2]] },
      { n: "Обломки транспортника", cont: ["cargo", "milcrate"], en: [["soldier", 1, 2], ["screamer", 0, 1]], fixed: { note: "n_air" } },
      { n: "Диспетчерская вышка", cont: ["desk", "locker"], en: [["sniper", 1, 1]], dark: 1 }
    ]
  },
  asylum: {
    n: "Психбольница «Тихая»",
    ic: "🏥",
    x: 54,
    y: 47,
    dg: 3,
    d: "Больница за высоким забором. Из окон доносится смех — или визг.",
    links: { forest: 55, farm: 60, swamp: 55 },
    rooms: [
      { n: "Приёмный покой", cont: ["desk", "medcab"], en: [["zombie", 1, 2], ["screamer", 0, 1]] },
      { n: "Палаты", cont: ["night", "night", "body"], en: [["screamer", 1, 2], ["zombie", 1, 2]], dark: 1 },
      { n: "Процедурная", cont: ["medcab", "labdesk"], en: [["bloater", 1, 1], ["sci", 0, 1]] },
      { n: "Подвал", cont: ["stash", "labdesk"], en: [["rats", 1, 2], ["bloater", 0, 1]], dark: 1, fixed: { note: "n_asylum" } }
    ]
  },
  flooded: {
    n: "Затопленная деревня",
    ic: "🏚️",
    x: 22,
    y: 88,
    dg: 2,
    d: "Деревню смыло весенним штормом. Из воды торчат крыши, на чердаках — чужие запасы.",
    links: { base: 50, village: 45 },
    fish: 1,
    water: "sea",
    rooms: [
      { n: "Улица по колено в воде", cont: ["shore", "body"], en: [["drowned", 1, 3]] },
      { n: "Чердак старосты", cont: ["wardrobe", "stash"], en: [["rats", 1, 1]], dark: 1 },
      { n: "Лавка", cont: ["shelf", "kassa", "fridge"], en: [["drowned", 1, 2], ["bloater", 0, 1]] },
      { n: "Часовня", cont: ["desk", "night"], en: [["screamer", 0, 1]], fixed: { note: "n_flooded" } }
    ]
  },
  radiotower: {
    n: "Радиовышка на горе",
    ic: "🗻",
    x: 27,
    y: 9,
    dg: 2,
    d: "Ретранслятор на вершине. Ветер, обрыв и аппаратура, которой хватит на десяток радиостанций.",
    links: { meteo: 50, lighthouse: 65, mine: 70 },
    rooms: [
      { n: "Тропа к вершине", cont: ["bushes", "body"], en: [["pdog", 0, 1], ["runner", 0, 1]] },
      { n: "Будка связистов", cont: ["desk", "locker", "toolbox"], en: [["sniper", 0, 1], ["zombie", 1, 1]] },
      { n: "Аппаратная", cont: ["toolbox", "labdesk"], en: [["rats", 1, 2]], dark: 1, fixed: { item: "rpart", note: "n_tower" } }
    ]
  }
});
LOCS.meteo.links.airfield = 60;
LOCS.nii.links.airfield = 70;
LOCS.swamp.links.airfield = 70;
LOCS.forest.links.asylum = 55;
LOCS.farm.links.asylum = 60;
LOCS.swamp.links.asylum = 55;
LOCS.base.links.flooded = 50;
LOCS.village.links.flooded = 45;
LOCS.meteo.links.radiotower = 50;
LOCS.lighthouse.links.radiotower = 65;
LOCS.mine.links.radiotower = 70;
if (!ITEMS.rpart) delete LOCS.radiotower.rooms[2].fixed.item;
Object.assign(NOTES, {
  n_air: { t: "Бортовой журнал", x: "«Груз — ящики с маркировкой НИИ. Над островом приборы сошли с ума, стрелки крутятся. Идём на вынужденную…» Дальше запись обрывается." },
  n_asylum: { t: "Записка санитара", x: "«Пациенты из 4-й палаты кричат по ночам одно и то же: “Синий свет поёт”. Главврач велел увеличить дозу. Не помогает. Они кричат громче, когда заражённые рядом»." },
  n_flooded: { t: "Листок из часовни", x: "«Вода пришла ночью. Кто успел — уплыл к лодочной станции. Отец Николай остался звонить в колокол, чтобы мы не заблудились в шторм»." },
  n_tower: { t: "Журнал связиста", x: "«Ретранслятор ловит материк. Слышу военную частоту: “Остров-7 закрыт, связи нет, приказ — никого не выпускать”. Значит, нас не ищут. Нас стерегут»." }
});
const _travelVisit = tick;
tick = function(st, o) {
  _travelVisit.apply(this, arguments);
  try {
    if (G && !G.dead) {
      if (G.w.locs[G.loc] && !G.traveling) G.w.locs[G.loc].visited = true;
      addictTick();
      dailyMisc();
    }
  } catch (e) {
    console.warn(e);
  }
};
function nextGoal() {
  const c = G.ch, f = F();
  if (G.dead) return null;
  if (typeof bleeding === "function" && bleeding()) return { ic: "🩸", t: "Перевяжи рану", d: "Ты истекаешь кровью — Тело → «Перевязать»." };
  if (f.virus && c.virus) return { ic: "🦠", t: "Найди сыворотку", d: "Вирус: Левин на метеостанции, кочевой торговец или лаборатории." };
  if (c.food < 25 || c.drink < 25) return { ic: "🍽️", t: c.drink < c.food ? "Попей" : "Поешь", d: "Кнопка «Поесть и попить досыта» наверху." };
  if (emissionSoon() && !inShelter()) return { ic: "☢️", t: "Выброс — в укрытие!", d: "Ближайшее: " + ((nearestShelter() || {}).loc ? LOCS[nearestShelter().loc].n : "база") };
  const nb = nextBloodDay(), bnToday = nb === day();
  if (bnToday && !atBase() && hour() >= 14) return { ic: "🌕", t: "Возвращайся на базу", d: "Сегодня в 22:00 Кровавая ночь." };
  if (isNight() && !inShelter() && !G.traveling) {
    const sh = nearestShelter();
    return { ic: "🌙", t: "Ночью — в укрытие", d: sh ? "Ближайшее: ".concat(LOCS[sh.loc].n, " (~").concat(sh.mins, " мин)") : "Найди укрытие." };
  }
  if (c.energy < 20) return { ic: "😴", t: "Выспись", d: "Силы на исходе — в укрытии «Спать»." };
  if (nb - day() <= 1) {
    const pw = Math.round((25 + nb * 2.5) * f.horde), df = defense();
    if (df < pw) return { ic: "🧱", t: "Укрепи базу", d: "Оборона ".concat(df, ", натиск ≈ ").concat(pw, ". База → Стройка, подготовка к ночи, охрана.") };
  }
  const mq = Object.entries(G.w.quests || {}).find(([k, v]) => v === "active" && QUESTS[k] && QUESTS[k].g === "main");
  if (mq) return { ic: "⭐", t: QUESTS[mq[0]].n, d: QUESTS[mq[0]].d };
  if ((G.w.caches || []).length) {
    const x = G.w.caches[0];
    return { ic: "🗺️", t: "Откопай тайник", d: "".concat(LOCS[x.loc].ic, " ").concat(LOCS[x.loc].n) };
  }
  const un = Object.keys(LOCS).filter((id) => !G.w.locs[id] || !G.w.locs[id].visited).filter((id) => !LOCS[id].ch2 && route(G.loc, id)).sort((a, b) => route(G.loc, a).mins - route(G.loc, b).mins)[0];
  if (un) return { ic: "🧭", t: "Разведай новое место", d: "".concat(LOCS[un].ic, " ").concat(LOCS[un].n, " (~").concat(route(G.loc, un).mins, " мин)") };
  return { ic: "🏘️", t: "Развивай поселение", d: "Контракты торговцев, жители, хозяйство, боссы группировок." };
}
const goalHtml = (cls) => {
  const g = nextGoal();
  return g ? '<div class="'.concat(cls, '"><span class="ic">').concat(g.ic, '</span><div class="grow"><b>Что дальше: ').concat(esc2(g.t), '</b><span class="s">').concat(esc2(g.d), "</span></div></div>") : "";
};
const _sideRightG = sideRight;
sideRight = function() {
  const g = nextGoal();
  return (g ? '<div class="card"><h3>🎯 Что дальше</h3><div class="ln"><b>'.concat(g.ic, " ").concat(esc2(g.t), '</b></div><div class="ln mono" style="white-space:normal">').concat(esc2(g.d), "</div></div>") : "") + _sideRightG.apply(this, arguments);
};
window.setGoalTips = (v) => {
  UIP.goal = v;
  try {
    localStorage.setItem("moti3_ui", JSON.stringify(UIP));
  } catch (e) {
  }
  UI.render();
};
const _locRowsG = EXTUI.locRows;
EXTUI.locRows = function() {
  const h = _locRowsG.apply(this, arguments);
  return (!uiWide() && UIP.goal !== false ? goalHtml("goalcard") : "") + h;
};
const BONUS = {
  car: [["wire", 3], ["molotov", 1], ["pipe", 1], ["fireaxe", 1]],
  shed: [["wire", 3], ["bees", 1], ["hen", 1]],
  wardrobe: [["wire", 2]],
  locker: [["wire", 2], ["tmap", 1]],
  milcrate: [["wire", 2]],
  backpack: [["arrow", 2], ["knuckles", 1], ["tmap", 1]],
  body: [["tmap", 1], ["arrow", 1]],
  desk: [["tmap", 2]],
  bushes: [["bees", 1]],
  toolbox: [["wire", 2]]
};
const _searchContB = searchCont;
searchCont = function(k) {
  const d = G.room != null ? roomDef(G.room) : null, ct = d && d.cont ? d.cont[k] : null, ready = d && contReady(G.room, k);
  const r = _searchContB.apply(this, arguments);
  if (ready && ct && BONUS[ct] && !G.dead && !G.combat && ch(0.22)) {
    const id = wpick(BONUS[ct]);
    const n = id === "wire" ? R(1, 3) : id === "arrow" ? R(3, 6) : 1;
    invAdd(G.inv, id, n);
    UI.log("✨ Ещё нашлось: ".concat(IT(id).ic, " ").concat(IT(id).n).concat(n > 1 ? " ×" + n : "", "."), "good");
  }
  return r;
};
const DYN = { k: "", f: null, src: null };
let DYNM = { t: -1, g: null, m: null };
function dynMods() {
  if (typeof G === "undefined" || !G || !G.ch || !G.w) return null;
  if (DYNM.g === G && DYNM.t === G.time) return DYNM.m;
  const m = dynMods0();
  DYNM = { t: G.time, g: G, m };
  return m;
}
function dynMods0() {
  const d = Math.floor(G.time / DAY) + 1;
  let cnt0 = 1, en = 1, needs = 1, horde = 1;
  if (d <= 2) {
    cnt0 = 0.75;
    en = 0.85;
    needs = 0.85;
  } else if (d <= 5) {
    cnt0 = 0.9;
    en = 0.95;
    needs = 0.93;
  } else if (d >= 15) {
    const k = Math.min(0.15, (d - 14) * 0.01);
    cnt0 = 1 + k;
    en = 1 + k * 0.8;
  }
  let n = 1;
  try {
    if (G.coop && window.COOP && COOP.others) n = 1 + COOP.others().filter((p) => p.online && p.alive !== false).length;
  } catch (e) {
  }
  if (n > 1) {
    cnt0 *= 1 + 0.3 * (n - 1);
    en *= 1 + 0.1 * (n - 1);
    horde *= 1 + 0.35 * (n - 1);
  }
  let mercy = 0;
  try {
    const c = G.ch;
    const hp = c.parts && PARTS ? Object.keys(PARTS).reduce((a, p) => a + (c.parts[p] || 0), 0) / Object.keys(PARTS).reduce((a, p) => a + PARTS[p].max, 0) : (c.hp || 100) / 100;
    if (hp < 0.35 || c.food < 12 || c.drink < 12) mercy = 1;
  } catch (e) {
  }
  if (mercy) {
    cnt0 *= 0.75;
    en *= 0.9;
  }
  if ((MODES[G.mode].f.enemies || 1) < 1.1) {
    cnt0 *= 0.9;
    en *= 0.95;
  }
  return { d: Math.min(d, 40), n, mercy, cnt0, en, needs, horde };
}
function dynF(f) {
  const m = dynMods();
  if (!m) return f;
  const key = "".concat(m.d, "|").concat(m.n, "|").concat(m.mercy);
  if (DYN.src === f && DYN.k === key) return DYN.f;
  const o = Object.assign({}, f);
  o.count = (f.count || 1) * m.cnt0;
  o.enemies = (f.enemies || 1) * m.en;
  o.needs = (f.needs || 1) * m.needs;
  o.horde = (f.horde || 1) * m.horde;
  DYN.src = f;
  DYN.k = key;
  DYN.f = o;
  return o;
}
MODES.nightmare = {
  n: "Кошмар",
  ic: "👁️",
  tag: "Остров видит тебя.",
  rules: ["Всё из «Хардкора», одна жизнь", "Особые твари: Простынщик, Сросшиеся, Висельник, Плакальщица, Долговязый", "Нет подсказок и «Что дальше»", "Выброс почти без предупреждения, враги сильнее и их больше"],
  f: Object.assign({}, MODES.hardcore.f, { death: "perma", hints: 0, emWarn: 20, horde: 1.5, needs: 1.2, enemies: 1.2, count: 1.15, noise: 1.4, nightmare: true })
};
const _autoEatN = autoEat;
autoEat = function() {
  if (F().noAuto) return UI.toast("👁️ В Кошмаре — только руками: открой рюкзак.");
  return _autoEatN.apply(this, arguments);
};
const _nextGoalN = nextGoal;
nextGoal = function() {
  if (F().nightmare) return null;
  return _nextGoalN.apply(this, arguments);
};
Object.assign(ENEMY, {
  sheet: { n: "Простынщик", ic: "👻", spr: "sci", hp: 40, dmg: [9, 14], sp: 2, acc: 0.65, inj: ["lacer", "scratch"], noVirus: 1, xp: 14, note: "Фигура под простынёй. Её не видно, пока она не окажется вплотную." },
  fused: { n: "Сросшиеся", ic: "🫂", spr: "swamper", hp: 70, dmg: [9, 14], sp: 1, acc: 0.55, inj: ["bite", "lacer", "bruise"], xp: 18, note: "Два тела в одном. Убьёшь — распадутся на двух ползунов." },
  hanged: { n: "Висельник", ic: "🪢", spr: "zombie", hp: 35, dmg: [12, 18], sp: 1, acc: 0.7, inj: ["bruise", "lacer"], xp: 14, note: "Висит под потолком в тёмных помещениях и бьёт первым, ещё до твоего хода. Фонарик и осторожность." },
  weeper: { n: "Плакальщица", ic: "😢", spr: "sci", hp: 90, dmg: [18, 26], sp: 0, acc: 0.8, inj: ["lacer", "frac"], noVirus: 1, xp: 30, note: "Плачет в углу и не трогает тебя. Не стреляй и не бей её — разъярится и бросится. Тихо уйди." },
  longarm: { n: "Долговязый", ic: "🦒", spr: "soldier", hp: 55, dmg: [10, 15], sp: 1, acc: 0.6, inj: ["lacer", "bruise"], xp: 16, note: "Длинные руки достают на шаг дальше обычного. Не стой «рядом» — либо вплотную, либо далеко." },
  blind: { n: "Слепой", ic: "🙈", spr: "armored", hp: 70, dmg: [12, 18], sp: 1, acc: 0.35, arm: 2, inj: ["lacer", "bruise", "frac"], xp: 16, note: "Ничего не видит и почти всегда мажет — пока ты не выстрелишь или не нашумишь." },
  spitter: { n: "Плевальщик", ic: "🤢", spr: "swamper", hp: 32, dmg: [5, 8], sp: 1, acc: 0.6, inj: ["burn", "scratch"], noVirus: 1, xp: 10, note: "Плюётся кислотой издалека. Сократи дистанцию или застрели." }
});
ENEMY.blind.spr = "soldier";
const NM_POOL = [["sheet", 3], ["fused", 2], ["hanged", 2], ["weeper", 1], ["longarm", 2]];
const _spawnListN = spawnList;
spawnList = function(spec) {
  const out = _spawnListN.apply(this, arguments);
  try {
    if (out.length && G.room != null && !G.combat && !LOCS[G.loc].base) {
      const d = roomDef(G.room), dg = LOCS[G.loc].dg || 1;
      if (F().nightmare && ch(isNight() ? 0.35 : 0.22)) {
        let id = wpick(NM_POOL);
        if (id === "hanged" && !d.dark) id = "sheet";
        out.push(mkEnemy(id));
      } else if (ch((0.04 + (dg >= 3 ? 0.02 : 0)) * modeK())) out.push(mkEnemy(LOCS[G.loc].zone || G.loc === "swamp" ? "spitter" : dg >= 2 ? "blind" : "spitter"));
    }
  } catch (e) {
  }
  return out;
};
const _mkEnemyN = mkEnemy;
mkEnemy = function(id) {
  const e = _mkEnemyN.apply(this, arguments);
  if (id === "sheet") e.dist = 0;
  if (id === "weeper") e.dist = 2;
  return e;
};
const _startCombatN = startCombat;
startCombat = function(en, opts) {
  const r = _startCombatN.apply(this, arguments);
  try {
    const cb = G.combat;
    if (cb) {
      for (const e of cb.en) if (e.id === "hanged" && !e.dropped && e.hp > 0) {
        e.dropped = true;
        e.dist = 0;
        cLog("🪢 Сверху падает Висельник!", "bad");
        enemyHit(e, false, 1);
        checkDeath();
        if (G.dead) return r;
      }
    }
    if (cb && cb.en.some((e) => e.id === "hanged")) UI.combat();
  } catch (e) {
  }
  return r;
};
function combatLoud() {
  const cb = G.combat;
  if (!cb) return;
  cb.loud = true;
  for (const e of cb.en) if (e.id === "weeper" && e.hp > 0 && !e.rage) {
    e.rage = true;
    cLog("😢 Плач обрывается. Плакальщица поднимает голову…", "bad");
  }
}
const _pShootN = pShoot;
pShoot = function() {
  const w = curWeapon();
  if (G.combat && w && w.c === "gun" && !w.quiet) combatLoud();
  return _pShootN.apply(this, arguments);
};
const _pAttackN = pAttack;
pAttack = function(i) {
  const cb = G.combat, e = cb && cb.en[i];
  if (e && e.id === "weeper" && !e.rage) {
    e.rage = true;
    cLog("😢 Ты задел её. Плакальщица кричит!", "bad");
  }
  return _pAttackN.apply(this, arguments);
};
const _throwItN = throwIt;
window.throwIt = throwIt = function(id) {
  if (id === "molotov" || id === "flashb") combatLoud();
  return _throwItN.apply(this, arguments);
};
const _enemyHitN = enemyHit;
enemyHit = function(e, ranged, near) {
  if (e.id === "weeper" && !e.rage) return;
  if (e.id === "blind" && !(G.combat && G.combat.loud) && ch(0.55)) {
    cLog("🙈 Слепой машет руками мимо — он тебя не видит.", "dim");
    return;
  }
  return _enemyHitN.apply(this, arguments);
};
const _enemyTurnN = enemyTurn;
enemyTurn = function() {
  const cb = G.combat;
  if (cb) {
    const alive = cb.en.filter((e) => e.hp > 0);
    if (alive.length && alive.every((e) => e.id === "weeper" && !e.rage)) {
      for (const e of alive) {
        e.hp = 0;
        e.dead = true;
        e.gone = true;
      }
      cLog("😢 Плакальщица так и не подняла головы. Ты тихо уходишь.", "good");
      return endCombat("win");
    }
    for (const e of alive) {
      if (e.stun > 0) continue;
      if (e.id === "weeper" && e.rage && e.dist > 0) {
        e.dist = 0;
        cLog("😢 Плакальщица бросается на тебя!", "bad");
      }
      if (e.id === "longarm" && e.dist === 1) {
        enemyHit(e, false, 1);
        checkDeath();
        if (G.dead) return UI.closeCombat("dead");
      }
      if (e.id === "spitter" && e.dist > 0 && ch(0.5)) {
        if (ch(0.6)) {
          const d = R(4, 7);
          cLog("🤢 Плевальщик плюётся кислотой: −".concat(d), "bad");
          const m = hitPlayer(d, "burn", null, "Плевальщик");
          if (m) cLog(m, "bad");
          checkDeath();
          if (G.dead) return UI.closeCombat("dead");
        } else cLog("🤢 Плевок пролетает мимо.", "dim");
      }
    }
  }
  return _enemyTurnN.apply(this, arguments);
};
const _onKillN = onKill;
onKill = function(e) {
  const r = _onKillN.apply(this, arguments);
  if (e.id === "fused" && !e.gone && G.combat) {
    for (let k = 0; k < 2; k++) {
      const c = mkEnemy("crawler");
      c.dist = 0;
      c.hp = c.max = Math.ceil(c.hp * 0.8);
      G.combat.en.push(c);
    }
    cLog("🫂 Сросшиеся разрываются — на тебя ползут двое!", "bad");
  }
  return r;
};
function dynHtml() {
  const m = dynMods();
  if (!m) return "";
  const pc = (x) => (x >= 1 ? "+" : "") + Math.round((x - 1) * 100) + "%";
  return '<div class="sec"><h2>📈 Сложность сейчас</h2><p class="muted" style="font-size:13px">Режим «'.concat(MODES[G.mode].n, "». День ").concat(m.d).concat(m.d <= 5 ? " — остров ещё присматривается" : m.d >= 15 ? " — остров злеет" : "").concat(m.n > 1 ? ", в отряде ".concat(m.n, " — врагов больше") : "").concat(m.mercy ? ". Ты едва живой — остров даёт передышку" : "", '.</p>\n    <div class="acts"><span class="chip">врагов ').concat(pc(m.cnt0), '</span><span class="chip">сила врагов ').concat(pc(m.en), '</span><span class="chip">голод и жажда ').concat(pc(m.needs), "</span>").concat(m.horde !== 1 ? '<span class="chip">орда '.concat(pc(m.horde), "</span>") : "", "</div></div>");
}
const _cuiJourD = CUI.jour;
CUI.jour = function() {
  return _cuiJourD.apply(this, arguments) + dynHtml();
};
const WMODS = {
  hungry: { n: "Голодный остров", ic: "🍽️", d: "Голод и жажда на 30% быстрее", k: 1.2 },
  nights: { n: "Злые ночи", ic: "🌕", d: "Орда в Кровавую ночь на 50% сильнее", k: 1.25 },
  notrade: { n: "Без торговцев", ic: "🚫", d: "Торговцы не продают и не покупают (задания и контракты остаются)", k: 1.3 },
  glass: { n: "Стеклянные кости", ic: "🦴", d: "Переломы и вывихи случаются чаще", k: 1.15 },
  crowds: { n: "Толпы", ic: "🧟", d: "Врагов на 40% больше, но каждый на 15% слабее", k: 1.15 },
  rust: { n: "Ржавое железо", ic: "🔧", d: "Оружие изнашивается вдвое быстрее", k: 1.15 },
  nomap: { n: "Без карты", ic: "🗺️", d: "Неизведанные места скрыты туманом на карте", k: 1.1 },
  bounty: { n: "Щедрый остров", ic: "🎁", d: "В каждом обыске иногда находится ещё одна вещь (облегчение)", k: 0.85 }
};
const wm = (k) => !!(typeof G !== "undefined" && G && G.w && G.w.flags && G.w.flags.mods && G.w.flags.mods[k]);
const wmScore = () => {
  const m = G && G.w && G.w.flags && G.w.flags.mods || {};
  return Object.keys(m).filter((k) => m[k] && WMODS[k]).reduce((a, k) => a * WMODS[k].k, 1);
};
const _dynFW = dynF;
dynF = function(f) {
  const o = _dynFW(f);
  const m = G && G.w && G.w.flags && G.w.flags.mods || null;
  if (!m) return o;
  const key = JSON.stringify(m);
  if (o.__wm === key) return o;
  const r = Object.assign({}, o, { __wm: key });
  if (m.hungry) r.needs = (r.needs || 1) * 1.3;
  if (m.nights) r.horde = (r.horde || 1) * 1.5;
  if (m.crowds) {
    r.count = (r.count || 1) * 1.4;
    r.enemies = (r.enemies || 1) * 0.85;
  }
  if (m.nomap) r.fog = true;
  DYN.f = r;
  return r;
};
CUI.startMods = (sel, m, draw) => {
  sel.mods = sel.mods || {};
  const sc = Object.keys(sel.mods).filter((k) => sel.mods[k]).reduce((a, k) => a * WMODS[k].k, 1);
  const cmp = '<details class="mcmp"><summary>📊 Сравнить режимы</summary><table><tr><th></th>'.concat(Object.values(MODES).map((M) => "<th>".concat(M.ic, "</th>")).join(""), "</tr>\n    ").concat([["Части тела и раны", (f) => f.parts], ["Болезни", (f) => f.illness], ["Радиация", (f) => f.rad], ["Еда портится", (f) => f.spoil], ["Холод", (f) => f.cold], ["Вирус от укусов", (f) => f.virus], ["Смерть навсегда", (f) => f.death === "perma"], ["Подсказки на карте", (f) => f.hints > 0], ["Сила врагов", (f) => "×" + (f.enemies || 1)], ["Число врагов", (f) => "×" + (f.count || 1)], ["Орда", (f) => "×" + (f.horde || 1)], ["Предупреждение о Выбросе", (f) => (f.emWarn || 120) + " мин"]].map(([n, fn]) => "<tr><td>".concat(n, "</td>").concat(Object.values(MODES).map((M) => {
    const v = fn(M.f);
    return "<td>".concat(v === true ? "✓" : v === false || v == null || v === 0 ? "—" : v, "</td>");
  }).join(""), "</tr>")).join(""), "</table></details>");
  return cmp + '<h2>Модификаторы мира <span class="mono muted" style="font-size:12px">'.concat(Object.keys(sel.mods).some((k) => sel.mods[k]) ? "счёт ×".concat(sc.toFixed(2)) : "необязательно", '</span></h2><div class="wmods">').concat(Object.entries(WMODS).map(([k, M]) => '<button class="wmod '.concat(sel.mods[k] ? "on" : "", '" onclick="').concat(m(() => {
    sel.mods[k] = !sel.mods[k];
    draw();
  }), '"><b>').concat(M.ic, " ").concat(M.n, "</b><span>").concat(M.d, "</span><i>×").concat(M.k, "</i></button>")).join(""), "</div>");
};
const _buyW = buy;
buy = function() {
  if (wm("notrade")) return UI.toast("🚫 На этом острове никто не торгует.");
  return _buyW.apply(this, arguments);
};
const _sellW = sell;
sell = function() {
  if (wm("notrade")) return UI.toast("🚫 На этом острове никто не торгует.");
  return _sellW.apply(this, arguments);
};
const _hitPlayerW = hitPlayer;
hitPlayer = function(dmg, inj, part, why) {
  const n0 = G.ch.inj.length, r = _hitPlayerW.apply(this, arguments);
  if (wm("glass") && G.ch.inj.length > n0 && F().parts) {
    const j = G.ch.inj[G.ch.inj.length - 1];
    if ((j.t === "bruise" || j.t === "lacer") && j.part !== "torso" && ch(0.18)) {
      j.t = j.part === "head" ? "conc" : ch(0.5) ? "frac" : "disl";
      UI.log("🦴 Кости как стекло: ".concat(INJ[j.t].n, " (").concat(PARTS[j.part].n, ")."), "bad");
    }
  }
  return r;
};
const _damageWeaponW = damageWeapon;
damageWeapon = function(n) {
  return _damageWeaponW.call(this, wm("rust") ? n * 2 : n);
};
const _searchContW = searchCont;
searchCont = function(k) {
  const d = G.room != null ? roomDef(G.room) : null, ct = d && d.cont ? d.cont[k] : null, ready = d && contReady(G.room, k);
  const r = _searchContW.apply(this, arguments);
  if (wm("bounty") && ready && ct && CONT[ct] && !G.dead && !G.combat && ch(0.35)) {
    const id = wpick(CONT[ct].loot);
    if (IT(id).c !== "key" && IT(id).c !== "bp") {
      invAdd(G.inv, id, IT(id).c === "ammo" ? R(3, 8) : 1);
      UI.log("🎁 Остров щедр: ещё ".concat(IT(id).ic, " ").concat(IT(id).n, "."), "good");
    }
  }
  return r;
};
if (typeof window !== "undefined" && window.addEventListener) window.addEventListener("load", () => {
  if (!(window.FB && FB.lb && FB.lb.submit) || FB.lb._wm) return;
  FB.lb._wm = 1;
  const _lbSub = FB.lb.submit;
  FB.lb.submit = function(e) {
    try {
      const m = G.w.flags.mods || {};
      const ks = Object.keys(m).filter((k) => m[k]);
      if (ks.length) e = Object.assign({}, e, { mods: ks.map((k) => WMODS[k].ic).join(""), mult: +wmScore().toFixed(2) });
      if (G.w.flags.modeChanged) e = Object.assign({}, e, { changed: 1 });
    } catch (x) {
    }
    return _lbSub.call(this, e);
  };
});
const _enemyTurnS = enemyTurn;
enemyTurn = function() {
  const cb = G.combat;
  if (cb) {
    for (const e of cb.en) {
      if (e.hp <= 0 || e.stun > 0) continue;
      const D = ENEMY[e.id];
      if (D.human && !D.boss && e.hp < e.max * 0.3 && !e.triedFlee) {
        e.triedFlee = true;
        if (ch(0.4)) {
          e.hp = 0;
          e.dead = true;
          e.gone = true;
          cLog("🏃 ".concat(D.n, " зажимает рану и убегает."), "dim");
        }
      }
      if ((e.id === "dog" || e.id === "pdog" || e.id === "rats") && e.burn > 0 && ch(0.5)) {
        e.hp = 0;
        e.dead = true;
        e.gone = true;
        cLog("🔥 ".concat(D.n, " в ужасе бежит от огня."), "good");
      }
    }
    if (cb.en.every((e) => e.hp <= 0)) return endCombat("win");
    if (cb.loud && !cb.reinf && !cb.opts.road && G.room != null && ch(0.2)) {
      cb.reinf = true;
      const id = isNight() ? "runner" : "zombie";
      const z = mkEnemy(id);
      z.dist = 2;
      cb.en.push(z);
      cLog("👂 На шум из соседнего помещения идёт ".concat(ENEMY[id].n, "."), "bad");
    }
  }
  return _enemyTurnS.apply(this, arguments);
};
const _pShootS = pShoot;
pShoot = function(i) {
  const cb = G.combat, e = cb && cb.en[i], D = e && ENEMY[e.id], w = curWeapon();
  if (G.combat && w && w.c === "gun" && !w.quiet) G.combat.loud = true;
  if (e && D && D.human && e.dist >= 1 && e.gear && IT(e.gear).c === "gun" && ch(0.2) && w && w.c === "gun" && cnt(G.inv, w.ammo)) {
    take(G.inv, w.ammo, 1);
    SND("shot");
    cLog("🧱 ".concat(D.n, " пригнулся за укрытием — пуля ушла в стену."), "dim");
    return endPlayerTurn();
  }
  return _pShootS.apply(this, arguments);
};
function setMode(k) {
  if (!G || G.coop) return UI.toast("В кооперативе сложность меняет только создатель мира — в одиночной игре.");
  const cur = G.mode, perma = ["hardcore", "last", "nightmare"];
  if (perma.includes(k) && !perma.includes(cur)) return UI.toast("Включить смертельный режим посреди игры нельзя — начни новый мир.");
  G.mode = k;
  if (perma.includes(cur) && !perma.includes(k)) G.w.flags.modeChanged = true;
  UI.log("🎚️ Сложность изменена: ".concat(MODES[k].ic, " ").concat(MODES[k].n, "."), "sys");
  save();
  UI.render();
}
window.setModeW = setMode;
function modeHtml() {
  const perma = ["hardcore", "last", "nightmare"], cur = G.mode;
  const opts = Object.entries(MODES).filter(([k]) => k === cur || !perma.includes(k));
  const m = G.w.flags.mods || {}, ks = Object.keys(m).filter((k) => m[k] && WMODS[k]);
  return '<div class="sec"><h2>🎚️ Режим и модификаторы</h2><div class="toggle">'.concat(opts.map(([k, M]) => '<button class="'.concat(cur === k ? "on" : "", '" onclick="setModeW(\'').concat(k, "')\">").concat(M.ic, " ").concat(M.n, "</button>")).join(""), '</div>\n    <p class="muted" style="font-size:13px">').concat(G.coop ? "В кооперативе режим общий для мира и здесь не меняется." : "Можно облегчить или усложнить игру в любой момент. Смертельные режимы (Хардкор, Последний выживший, Кошмар) включаются только при создании мира; если уйти с них — в таблице выживших будет пометка.", "</p>\n    ").concat(ks.length ? '<div class="acts">'.concat(ks.map((k) => '<span class="chip">'.concat(WMODS[k].ic, " ").concat(WMODS[k].n, "</span>")).join(""), '<span class="chip">счёт ×').concat(wmScore().toFixed(2), "</span></div>") : '<p class="muted" style="font-size:13px">Модификаторы мира выбираются при создании нового мира.</p>', "</div>");
}
const _cuiJourM = CUI.jour;
CUI.jour = function() {
  return _cuiJourM.apply(this, arguments) + modeHtml();
};
const _doFishW = doFish;
doFish = function() {
  if (G.weather && G.weather.id === "storm") return UI.toast("⛈️ В грозу у воды делать нечего — молнии бьют в воду.");
  return _doFishW.apply(this, arguments);
};
const _roadEventW = roadEvent;
roadEvent = function(to, done) {
  if (G.weather && G.weather.id === "fog" && ch(0.3)) {
    UI.log("🌫️ В тумане ты прошёл мимо чего-то — оно тебя не заметило.", "dim");
    return done();
  }
  return _roadEventW.apply(this, arguments);
};
const BOT_NAMES = ["Артём", "Вика", "Глеб", "Даша", "Егор", "Женя", "Кирилл", "Лена", "Миша", "Ника", "Олег", "Полина", "Рома", "Соня", "Тимур", "Ульяна", "Фёдор", "Яна"];
const BKEEP = { water: 4, canned: 2, ration: 2, cfish: 2, cmeat: 2, smoked: 3, jerky: 3, omelet: 2, crackers: 2, bandage: 3, dband: 3, medkit: 1, antibio: 1, painkill: 1, lighter: 1, bottle: 3, wood: 2 };
const bot = () => G.w.bot && G.w.bot.on ? G.w.bot : null;
function botNew(name) {
  const B = {
    on: true,
    alive: true,
    name: name || pick(BOT_NAMES),
    hp: 100,
    food: 80,
    drink: 80,
    energy: 90,
    bleed: 0,
    loc: "base",
    trav: null,
    task: null,
    mode: "auto",
    style: "normal",
    inv: [],
    eq: { w: { id: "knife", n: 1, dur: 45 }, a: null, b: { id: "bag1", n: 1 } },
    sk: { fight: 1, search: 1, surv: 1, craft: 1 },
    kills: 0,
    trips: 0,
    found: 0,
    built: 0,
    log: [],
    born: G.time,
    gen: (G.w.bot && G.w.bot.gen || 0) + 1,
    emN: G.em ? G.em.next : 0,
    seen: {}
  };
  for (const [k, v] of [["water", 2], ["canned", 1], ["bandage", 1], ["lighter", 1], ["bottle", 1]]) invAdd(B.inv, k, v);
  return B;
}
const bW = (B) => B.inv.reduce((a, e) => a + (IT(e.id).w || 0) * (e.n || 1), 0) + (B.eq.w ? IT(B.eq.w.id).w : 0) + (B.eq.a ? IT(B.eq.a.id).w : 0);
const bCap = (B) => 14 + (B.eq.b ? IT(B.eq.b.id).cap || 0 : 0) + Math.floor(B.sk.surv);
const bArm = (B) => B.eq.a ? IT(B.eq.a.id).arm || 0 : 0;
const bWeapon = (B) => B.eq.w ? IT(B.eq.w.id) : null;
const bGun = (B) => {
  const w = bWeapon(B);
  return w && w.c === "gun" && cnt(B.inv, w.ammo) > 0;
};
function bPower(B) {
  const w = bWeapon(B);
  let p = 1 + B.sk.fight * 0.15 + bArm(B) * 0.25;
  if (w && w.dmg) p += (w.dmg[0] + w.dmg[1]) / 2 / (bGun(B) ? 7 : w.c === "gun" ? 40 : 10);
  return p;
}
function bLog(B, t, loud, c) {
  B.log = (B.log || []).concat([{ d: day(), k: clock(), t }]).slice(-60);
  if (loud) UI.log("🤖 ".concat(B.name, ": ").concat(t), c || "sys");
}
const bShelter = (loc) => !!(LOCS[loc] && LOCS[loc].shelter);
function bSkill(B, k, a) {
  const v = B.sk[k] || 0, b = Math.floor(v);
  B.sk[k] = Math.min(10, v + a * 0.1 * Math.max(0.15, 1 - v / 11));
  if (Math.floor(B.sk[k]) > b) bLog(B, "навык «".concat({ fight: "бой", search: "обыск", surv: "выживание", craft: "ремесло" }[k], "» — уровень ").concat(Math.floor(B.sk[k])), true, "good");
}
function bUse(B, id) {
  const it = IT(id);
  take(B.inv, id, 1);
  if (it.f) B.food = Math.min(100, B.food + it.f);
  if (it.d) B.drink = Math.min(100, B.drink + it.d);
  if (it.btl) invAdd(B.inv, "bottle", 1);
}
function bSelfCare(B) {
  for (let g = 0; g < 4 && B.drink < 60; g++) {
    const e = bestOf(B.inv.filter((x) => {
      const it = IT(x.id);
      return it.c === "drink" && (it.d || 0) > 0 && !it.salt && !it.raw && x.id !== "vodka" && !(it.sp && F().spoil && freshness(x) >= 1);
    }), (x) => IT(x.id).d || 0);
    if (!e) break;
    bUse(B, e.id);
  }
  if (B.drink < 15 && cnt(B.inv, "dwater")) {
    bUse(B, "dwater");
    if (ch(0.4)) {
      B.hp -= 8;
      bLog(B, "выпил грязную воду — скрутило живот");
    }
  }
  for (let g = 0; g < 4 && B.food < 55; g++) {
    const e = bestOf(B.inv.filter((x) => {
      const it = IT(x.id);
      return it.c === "food" && (it.f || 0) > 0 && !it.raw && !it.smoke && !(it.sp && F().spoil && freshness(x) >= 1);
    }), (x) => (IT(x.id).sp ? 50 + freshness(x) * 50 : 0) - (IT(x.id).v || 0) / 10);
    if (!e) break;
    bUse(B, e.id);
  }
  if (B.food < 12) {
    const e = B.inv.find((x) => IT(x.id).c === "food" && (IT(x.id).f || 0) > 0 && !IT(x.id).smoke);
    if (e) {
      bUse(B, e.id);
      if (IT(e.id).raw && ch(0.35)) B.hp -= 6;
    }
  }
  if (B.bleed > 0) {
    const atB = LOCS[B.loc].base && !B.trav, src = ["bandage", "dband", "medkit"].map((x) => cnt(B.inv, x) ? [B.inv, x] : atB && cnt(G.stash, x) ? [G.stash, x] : null).find(Boolean);
    if (src) {
      take(src[0], src[1], 1);
      B.bleed = 0;
      if (src[1] === "medkit") B.hp = Math.min(100, B.hp + 25);
    } else if (cnt(B.inv, "rag") || atB && cnt(G.stash, "rag")) {
      take(cnt(B.inv, "rag") ? B.inv : G.stash, "rag", 1);
      B.bleed = 0;
      bLog(B, "перевязал рану тряпкой");
    }
  }
  if (B.hp < 45 && cnt(B.inv, "medkit")) {
    take(B.inv, "medkit", 1);
    B.hp = Math.min(100, B.hp + 30);
    bLog(B, "воспользовался аптечкой");
  }
}
function bFight(B, en, retreatAt) {
  let rounds = 0;
  const w = bWeapon(B), arm = bArm(B);
  let shots = 0;
  const alive = () => en.filter((e) => e.hp > 0);
  for (const e of en) if (e.dist == null) e.dist = 1;
  while (alive().length && rounds++ < 40 && B.hp > 0) {
    const t = alive().sort((a, b) => a.hp - b.hp)[0], D = ENEMY[t.id];
    const gun = bGun(B);
    if (gun) {
      take(B.inv, w.ammo, 1);
      shots++;
    }
    const acc = gun ? (w.acc || 0.7) + B.sk.fight * 0.03 : 0.7 + B.sk.fight * 0.04;
    if (ch(acc)) {
      const dmg = w && w.dmg ? R(w.dmg[0], w.dmg[1]) * (gun ? 1 : 1 + B.sk.fight * 0.06) : R(3, 6);
      t.hp -= Math.max(1, Math.round(dmg - (D.arm || 0) * (gun ? 0.5 : 1)));
      if (t.hp <= 0) {
        B.kills++;
        bSkill(B, "fight", D.boss ? 6 : 1.2);
        if (G.best) {
          G.best[t.id] = G.best[t.id] || { s: 1, k: 0 };
        }
        if (D.loot && CONT[D.loot] && ch(0.5)) {
          const id = wpick(CONT[D.loot].loot);
          if (IT(id).c !== "key" && IT(id).c !== "bp") invAdd(B.inv, id, IT(id).c === "ammo" ? R(2, 6) : 1);
        }
        if (D.drop) for (const [id, n] of D.drop) invAdd(B.inv, id, n);
      }
    }
    if (B.eq.w && B.eq.w.dur != null && !gun) {
      B.eq.w.dur -= ch(0.5) ? 1 : 0;
      if (B.eq.w.dur <= 0) {
        bLog(B, "сломалось оружие: ".concat(w.n), true, "warn");
        B.eq.w = null;
      }
    }
    for (const e of alive()) {
      const E = ENEMY[e.id];
      if (e.id === "weeper" && !e.rage) {
        if (gun && !w.quiet) e.rage = true;
        else continue;
      }
      if (e.dist > 0) {
        e.dist = Math.max(0, e.dist - Math.max(1, E.sp));
        if (!(E.human && e.gear && IT(e.gear).c === "gun")) continue;
      }
      if (ch(E.acc - arm * 0.03)) {
        const d = Math.max(1, Math.round(R(E.dmg[0], E.dmg[1]) * (E.boss ? 1 : F().enemies) - arm));
        B.hp -= d * 0.9;
        if (ch(0.3)) B.bleed = 1;
      }
    }
    if (B.hp < retreatAt && alive().length) {
      if (ch(0.6 + B.sk.surv * 0.03)) return { fled: true, shots };
    }
  }
  return { fled: false, won: !alive().length, shots };
}
const bReady = (loc, i, k) => {
  const s = G.w.locs[loc].rooms[i], d = LOCS[loc].rooms[i], last = s.cont[k];
  if (last == null) return true;
  if (d.once || LOCS[loc].base) return false;
  return G.time - last > 72 * H;
};
function bRoomValue(loc, i) {
  const d = LOCS[loc].rooms[i], s = G.w.locs[loc].rooms[i];
  if (!d || d.final || d.trader || d.lock && !s.open) return 0;
  return (d.cont || []).filter((_, k) => bReady(loc, i, k)).length;
}
function bSearchRoom(B, i) {
  const loc = B.loc, d = LOCS[loc].rooms[i], s = G.w.locs[loc].rooms[i];
  if (d.en && G.time - s.enAt > 48 * H) {
    s.en = (typeof _spawnListT === "function" ? _spawnListT : spawnList)(d.en);
    s.enAt = G.time;
  }
  const foes = (s.en || []).filter((e) => e.hp > 0);
  let mins = 6;
  if (foes.length) {
    const ret = B.style === "careful" ? 60 : B.style === "bold" ? 30 : 45;
    const r = bFight(B, foes, ret);
    mins += 10 + foes.length * 4;
    s.en = s.en.filter((e) => e.hp > 0);
    if (B.hp <= 0) return { mins, dead: true };
    if (r.fled || !r.won) {
      bLog(B, "отступил из «".concat(d.n, "» (").concat(LOCS[loc].n, ")"));
      return { mins, fled: true };
    }
  }
  const got = [];
  (d.cont || []).forEach((ct, k) => {
    if (!bReady(loc, i, k)) return;
    const C = CONT[ct];
    if (!C) return;
    s.cont[k] = G.time;
    mins += Math.round((C.t || 10) * (1 - B.sk.search * 0.04));
    let n = Math.round((R(C.roll[0], C.roll[1]) + (d.dark && isNight() ? -1 : 0)) * (0.5 + B.sk.search * 0.03));
    for (let j = 0; j < n; j++) {
      const id = wpick(C.loot), it = IT(id);
      if (!it || it.c === "quest") continue;
      if (it.c === "key" && (cnt(G.stash, id) || cnt(G.inv, id))) continue;
      const amt = it.c === "ammo" ? R(3, 10) : id === "nails" ? R(4, 12) : id === "wire" ? R(1, 3) : 1;
      invAdd(B.inv, id, amt);
      got.push(it.ic);
    }
  });
  bSkill(B, "search", 1);
  B.found += got.length;
  if (got.length) bLog(B, "".concat(LOCS[loc].ic, " ").concat(d.n, ": ").concat(got.join("")));
  return { mins, got };
}
function bUnload(B) {
  const kept = {};
  let moved = 0;
  for (const e of B.inv.slice()) {
    const it = IT(e.id), keep = BKEEP[e.id] || (bWeapon(B) && bWeapon(B).ammo === e.id ? 40 : 0);
    const have = kept[e.id] || 0, n = e.n || 1;
    if (have + n <= keep) {
      kept[e.id] = have + n;
      continue;
    }
    const give = n - Math.max(0, keep - have);
    kept[e.id] = Math.max(have, keep);
    const copy = Object.assign({}, e, { n: give });
    if (give >= n) B.inv.splice(B.inv.indexOf(e), 1);
    else e.n -= give;
    G.stash.push(copy);
    moved += give;
  }
  if (moved) {
    G.stash = sMerge(G.stash);
    if (typeof stLog === "function") try {
      stLog("+", "bot", moved);
    } catch (x) {
    }
  }
  return moved;
}
const sMerge = (list) => {
  const out = [];
  for (const e of list) {
    const s = out.find((x) => x.id === e.id && x.dur == null && e.dur == null && !x.mods && !e.mods && x.born === e.born);
    if (s) s.n += e.n || 1;
    else out.push(e);
  }
  return out;
};
function bResupply(B) {
  const want = { water: 3, bandage: 2, lighter: 1, bottle: 2 };
  const okFood = (e) => {
    const it = IT(e.id);
    return it.c === "food" && !it.raw && !it.smoke && (it.f || 0) >= 5 && !(it.sp && F().spoil && freshness(e) >= 1);
  };
  let need = Math.max(0, 3 - B.inv.filter(okFood).reduce((a, e) => a + e.n, 0));
  const cands = G.stash.filter(okFood).sort((a, b) => (IT(a.id).sp ? 0 : 1) - (IT(b.id).sp ? 0 : 1) || (IT(b.id).f || 0) - (IT(a.id).f || 0));
  for (const e of cands) {
    if (!need) break;
    const n = Math.min(need, e.n || 1);
    take(G.stash, e.id, n);
    invAdd(B.inv, e.id, n);
    need -= n;
  }
  for (const [id, n0] of Object.entries(want)) {
    const n = Math.min(n0 - cnt(B.inv, id), cnt(G.stash, id));
    if (n > 0) {
      take(G.stash, id, n);
      invAdd(B.inv, id, n);
    }
  }
  if (!cnt(B.inv, "bandage") && !cnt(B.inv, "dband") && cnt(G.stash, "dband")) {
    take(G.stash, "dband", 1);
    invAdd(B.inv, "dband", 1);
  }
  const w = bWeapon(B);
  if (w && w.c === "gun") {
    const n = Math.min(30 - cnt(B.inv, w.ammo), cnt(G.stash, w.ammo));
    if (n > 0) {
      take(G.stash, w.ammo, n);
      invAdd(B.inv, w.ammo, n);
    }
  }
}
function bGear(B) {
  const score = (e) => {
    const it = IT(e.id);
    if (it.c === "melee") return (it.dmg[0] + it.dmg[1]) / 2 * (e.dur != null && it.dur ? Math.min(1, 0.4 + e.dur / it.dur) : 1);
    if (it.c === "gun") return cnt(G.stash, it.ammo) + cnt(B.inv, it.ammo) >= 8 ? (it.dmg[0] + it.dmg[1]) / 2 * it.acc + 3 : -1;
    return -1;
  };
  const pool = G.stash.concat(B.inv);
  const cur = B.eq.w ? score(B.eq.w) : 0, best = bestOf(pool.filter((e) => ["melee", "gun"].includes(IT(e.id).c) && !(G.eq.weapon === e)), score);
  if (best && score(best) > cur + 1) {
    const src = G.stash.includes(best) ? G.stash : B.inv;
    const one = Object.assign({}, best, { n: 1 });
    if ((best.n || 1) > 1) best.n--;
    else src.splice(src.indexOf(best), 1);
    if (B.eq.w) G.stash.push(B.eq.w);
    B.eq.w = one;
    bLog(B, "взял оружие: ".concat(IT(one.id).n));
  }
  const arm = (e) => IT(e.id).c === "wear" && (IT(e.id).slot === "vest" || IT(e.id).slot === "body") ? IT(e.id).arm || 0 : -1;
  const ba = bestOf(G.stash.filter((e) => arm(e) > 0), arm);
  if (ba && arm(ba) > bArm(B)) {
    const one = Object.assign({}, ba, { n: 1 });
    if ((ba.n || 1) > 1) ba.n--;
    else G.stash.splice(G.stash.indexOf(ba), 1);
    if (B.eq.a) G.stash.push(B.eq.a);
    B.eq.a = one;
    bLog(B, "надел: ".concat(IT(one.id).n));
  }
  const cap = (e) => IT(e.id).c === "wear" && IT(e.id).slot === "bag" ? IT(e.id).cap || 0 : -1;
  const bb = bestOf(G.stash.filter((e) => cap(e) > 0), cap);
  if (bb && cap(bb) > (B.eq.b ? IT(B.eq.b.id).cap || 0 : 0)) {
    const one = Object.assign({}, bb, { n: 1 });
    if ((bb.n || 1) > 1) bb.n--;
    else G.stash.splice(G.stash.indexOf(bb), 1);
    if (B.eq.b) G.stash.push(B.eq.b);
    B.eq.b = one;
  }
  if (B.eq.w && B.eq.w.dur != null && IT(B.eq.w.id).dur && B.eq.w.dur / IT(B.eq.w.id).dur < 0.35 && cnt(G.stash, "tape")) {
    take(G.stash, "tape", 1);
    B.eq.w.dur = Math.min(IT(B.eq.w.id).dur, B.eq.w.dur + 25);
    bLog(B, "подлатал оружие скотчем");
  }
}
const BOT_CRAFT = ["water", "desal", "cfish", "cmeat", "cmush", "bandage", "dband", "planks", "omelet", "smoked", "jerky"];
function bCraft(B) {
  let mins = 0;
  for (const id of BOT_CRAFT) {
    const r = RECIPES.find((x) => x.id === id);
    if (!r || !baseSt(r.st) || r.bp && !G.w.bp[r.bp]) continue;
    if (id === "planks" && cnt(G.stash, "planks") >= 12) continue;
    if (id === "dband" && cnt(G.stash, "dband") + cnt(G.stash, "bandage") >= 6) continue;
    for (let k = 0; k < 4; k++) {
      if (!Object.entries(r.need).every(([i, n]) => cnt(G.stash, i) >= n)) break;
      for (const [i, n] of Object.entries(r.need)) take(G.stash, i, n);
      for (const [i, n] of Object.entries(r.out)) invAdd(G.stash, i, n);
      mins += Math.round(r.t * (1 - B.sk.craft * 0.05));
      bSkill(B, "craft", 0.5);
      if (mins > 120) return mins;
    }
  }
  return mins;
}
const BOT_BUILD = ["fire", "bed", "rain", "bench", "walls", "distill", "smoke", "traps", "garden", "stove", "bunks", "walls", "traps"];
function bBuild(B) {
  for (const id of BOT_BUILD) {
    const S = STRUCT[id];
    if (!S) continue;
    const lv = G.w.struct[id] || 0, nx = S.lv[lv + 1];
    if (!nx || S.bp && !G.w.bp[S.bp] || S.ch2 && !CH2() || S.need && !G.w.struct[S.need] || S.npc && npcs().length < S.npc) continue;
    const cost = buildCost(nx.c || {});
    if (!Object.entries(cost).every(([k, v]) => cnt(G.stash, k) >= v)) continue;
    for (const [k, v] of Object.entries(cost)) take(G.stash, k, v);
    G.w.struct[id] = lv + 1;
    if (id === "walls") G.w.wallHp = 100;
    B.built++;
    bSkill(B, "craft", 3);
    bLog(B, "построил: ".concat(S.ic, " ").concat(nx.n), true, "good");
    FEED("🤖 ".concat(B.name, " построил ").concat(S.ic, " ").concat(nx.n));
    return 60 + lv * 30;
  }
  if (G.w.struct.walls && G.w.wallHp < 80 && cnt(G.stash, "planks") >= 1 && cnt(G.stash, "nails") >= 2) {
    take(G.stash, "planks", 1);
    take(G.stash, "nails", 2);
    G.w.wallHp = Math.min(100, G.w.wallHp + 25);
    bLog(B, "подлатал стены");
    return 40;
  }
  return 0;
}
function bTarget(B) {
  const P = bPower(B), hrs = hour(), left = (hrs < 6 ? 6 - hrs : 21 - hrs) * 60;
  let best = null, bs = -1e9;
  for (const id of Object.keys(LOCS)) {
    const L2 = LOCS[id];
    if (id === B.loc || L2.base || !L2.rooms || !L2.rooms.length || L2.ch2 && !CH2()) continue;
    const r = route(B.loc, id);
    if (!r) continue;
    const back = route(id, "base"), shelterBack = bShelter(id) ? 0 : back ? back.mins : 999;
    if (r.mins + 60 + Math.min(shelterBack, 120) > left) continue;
    const val = L2.rooms.reduce((a, _, i) => a + bRoomValue(id, i), 0);
    if (!val) continue;
    const dg = L2.dg || 0, need = dg <= 1 ? 0 : dg === 2 ? 2.2 : 3.2;
    if (P < need * (B.style === "bold" ? 0.8 : B.style === "careful" ? 1.2 : 1)) continue;
    const sc = val * 3 - r.mins / 25 - dg * (B.style === "careful" ? 3 : 1.5) + (B.seen[id] ? 0 : 4) + (L2.water && L2.water !== "sea" ? 1 : 0);
    if (sc > bs) {
      bs = sc;
      best = id;
    }
  }
  return best;
}
const bNearestShelter = (from) => {
  let best = null;
  for (const k of SHELTERS()) {
    const r = route(from, k);
    if (r && (!best || r.mins < best.mins)) best = { loc: k, mins: r.mins };
  }
  return best;
};
const bWaterLoc = (from) => {
  let best = null;
  for (const k of Object.keys(LOCS)) {
    const L2 = LOCS[k];
    if (!L2.water || L2.water === "sea" || L2.ch2 && !CH2()) continue;
    const r = route(from, k);
    if (r && (!best || r.mins < best.mins)) best = { loc: k, mins: r.mins };
  }
  return best;
};
function bGo(B, to, why) {
  if (to === B.loc) return false;
  const r = route(B.loc, to);
  if (!r) return false;
  if (G.em && !bShelter(to) && G.em.next > G.time && G.em.next < G.time + r.mins + 90) return false;
  B.trav = { from: B.loc, to, at: G.time };
  B.task = { t: "travel", until: G.time + Math.round(r.mins * (bW(B) > bCap(B) ? 1.4 : 1)), why };
  return true;
}
function bSet(B, t, mins, extra) {
  B.task = Object.assign({ t, until: G.time + Math.max(5, Math.round(mins)) }, extra || {});
}
function bDecide(B) {
  bSelfCare(B);
  const d = day(), h = hour(), bn = d % BNP() === 0, atB = LOCS[B.loc].base, shelter = bShelter(B.loc);
  const emSoon = G.em && G.em.next - G.time < 200 && G.em.next > G.time;
  if (B.mode === "rest") {
    if (!atB) return bGo(B, "base", "отдыхать") || bSet(B, "wait", 60);
    return bSet(B, "sleep", 120);
  }
  if (B.mode === "follow") {
    if (!G.traveling && G.loc !== B.loc) {
      const r = route(B.loc, G.loc);
      if (r) {
        B.trav = { from: B.loc, to: G.loc, at: G.time };
        B.task = { t: "travel", until: G.time + Math.round(r.mins * 0.6), why: "догоняет тебя" };
        return;
      }
    }
    return bSet(B, "guard", 30);
  }
  if (emSoon && !shelter) {
    const s = bNearestShelter(B.loc);
    if (s && bGo(B, s.loc, "прячется от Выброса")) return;
  }
  if (emSoon && shelter) return bSet(B, "wait", 60, { why: "пережидает Выброс" });
  if (bn && h >= 14 && !atB) {
    if (bGo(B, "base", "спешит на базу к Кровавой ночи")) return;
  }
  if (bn && h >= 20 && atB) return bSet(B, "guard", 60, { why: "держит оборону в Кровавую ночь" });
  if (isNight() && !shelter) {
    const s = bNearestShelter(B.loc);
    if (s && bGo(B, s.loc, "ищет укрытие на ночь")) return;
  }
  if (isNight() && shelter) {
    if (atB && B.mode === "auto") {
      const m = bCraft(B) + bBuild(B);
      if (m && B.energy > 40) return bSet(B, "work", m, { why: "мастерит на базе" });
    }
    return bSet(B, "sleep", Math.max(60, (h >= 21 ? 24 - h + 6 : 6 - h) * 60), { why: "спит" });
  }
  if ((B.hp < 40 || B.bleed) && !atB) {
    if (bGo(B, "base", "ранен — возвращается")) return;
  }
  if (B.hp < 65 && atB && B.mode !== "follow") return bSet(B, "sleep", 120, { why: "отлёживается" });
  if (B.energy < 25) {
    if (shelter) return bSet(B, "sleep", 240, { why: "отсыпается" });
    const s = bNearestShelter(B.loc);
    if (s && bGo(B, s.loc, "идёт отдохнуть")) return;
  }
  const drinks = B.inv.filter((e) => IT(e.id).c === "drink" && !IT(e.id).raw && !IT(e.id).salt).reduce((a, e) => a + e.n, 0);
  const foods = B.inv.filter((e) => IT(e.id).c === "food" && !IT(e.id).raw && (IT(e.id).f || 0) > 5).reduce((a, e) => a + e.n, 0);
  const L2 = LOCS[B.loc];
  const fresh = L2.water && L2.water !== "sea";
  if (fresh && B.drink < 75) {
    const gulp = 100 - B.drink;
    B.drink = 100;
    bSkill(B, "surv", 0.3);
    if (ch(0.2 - B.sk.surv * 0.015)) {
      B.hp -= 5;
      bLog(B, "напился сырой воды — немного мутит");
    }
    return bSet(B, "work", 10 + gulp / 10, { why: "пьёт из источника" });
  }
  if (!fresh && drinks < 1 && B.drink < 45 && !cnt(B.inv, "dwater")) {
    const w = bWaterLoc(B.loc), rb = route(B.loc, "base"), stashW = cnt(G.stash, "water") + cnt(G.stash, "dwater") * (baseSt("fire") ? 1 : 0);
    if (w && (atB ? !stashW : !rb || w.mins < rb.mins + 20 || !stashW)) {
      if (bGo(B, w.loc, "хочет пить — идёт к воде")) return;
    }
  }
  if (B.food < 40 && foods < 1 && L2.forage && !atB) {
    let n = 0;
    for (let k = R(2, 4) + Math.floor(B.sk.surv / 3); k > 0; k--) {
      const id = wpick([["berries", 4], ["mushroom", 3], ["herbs", 1], ["wood", 2]]);
      invAdd(B.inv, id, 1);
      n++;
    }
    bSkill(B, "surv", 0.6);
    return bSet(B, "work", 45, { why: "собирает ягоды и грибы" });
  }
  if (drinks < 2 && fresh && cnt(B.inv, "bottle")) {
    const n = cnt(B.inv, "bottle");
    take(B.inv, "bottle", n);
    invAdd(B.inv, "dwater", n);
    bLog(B, "набрал воды (".concat(n, ")"));
  }
  if (cnt(B.inv, "dwater") && (atB ? baseSt("fire") : cnt(B.inv, "lighter") && cnt(B.inv, "wood") >= 2)) {
    const n = cnt(B.inv, "dwater");
    if (!atB) take(B.inv, "wood", 2);
    take(B.inv, "dwater", n);
    invAdd(B.inv, "water", n);
    bSkill(B, "surv", 0.5);
    return bSet(B, "work", 15 + n * 5, { why: "кипятит воду" });
  }
  if (!atB && (drinks < 1 || foods < 1 || bW(B) > bCap(B) * 0.85 || B.hp < 60)) {
    if (drinks < 1 && !cnt(B.inv, "dwater")) {
      const w = bWaterLoc(B.loc), rb = route(B.loc, "base");
      if (w && rb && w.mins + 30 < rb.mins && cnt(B.inv, "bottle")) {
        if (bGo(B, w.loc, "идёт за водой")) return;
      }
    }
    if (bGo(B, "base", bW(B) > bCap(B) * 0.85 ? "несёт добычу на базу" : "возвращается пополнить запасы")) return;
  }
  if (atB) {
    const moved = bUnload(B);
    bGear(B);
    bResupply(B);
    bSelfCare(B);
    let m = moved ? 10 : 0;
    if (G.w.struct.distill && cnt(G.stash, "bottle") && cnt(G.stash, "water") < 6) {
      const n = Math.min(4, cnt(G.stash, "bottle"));
      take(G.stash, "bottle", n);
      invAdd(G.stash, "seawater", n);
      m += 10;
    }
    if (!G.w.struct.fire && cnt(G.stash, "wood") < 3 || G.w.struct.fire && cnt(G.stash, "wood") < 2 && cnt(G.stash, "dwater") + cnt(G.stash, "meat") + cnt(G.stash, "fish") > 0) {
      invAdd(G.stash, "wood", R(2, 4));
      bSkill(B, "surv", 0.4);
      return bSet(B, "work", 50, { why: "собирает хворост у базы" });
    }
    const cm = bCraft(B);
    const bm = bBuild(B);
    m += cm + bm;
    if (m) return bSet(B, "work", m, { why: bm ? "строит" : cm ? "мастерит" : "разбирает добычу" });
    const foods2 = B.inv.filter((e) => IT(e.id).c === "food" && !IT(e.id).raw && (IT(e.id).f || 0) >= 5).reduce((a, e) => a + e.n, 0);
    if (foods2 < 1 && B.food < 60) {
      if (L2.fish && baseSt("fire")) {
        const rod = cnt(B.inv, "rod") || cnt(G.stash, "rod");
        let n = 0;
        for (let k = 0; k < 3; k++) if (ch((rod ? 0.55 : 0.3) + B.sk.surv * 0.03)) n++;
        if (n) invAdd(G.stash, "fish", n);
        bSkill(B, "surv", 0.5);
        bLog(B, n ? "наловил рыбы: ".concat(n) : "рыба не клюёт");
        return bSet(B, "work", 90, { why: "рыбачит у базы" });
      }
      let fz = null;
      for (const k of Object.keys(LOCS)) {
        if (!LOCS[k].forage || LOCS[k].ch2 && !CH2()) continue;
        const r = route(B.loc, k);
        if (r && (!fz || r.mins < fz.mins)) fz = { loc: k, mins: r.mins };
      }
      if (fz && bGo(B, fz.loc, "голоден — идёт за ягодами и грибами")) return;
    }
    const drinks2 = B.inv.filter((e) => IT(e.id).c === "drink" && !IT(e.id).raw && !IT(e.id).salt).reduce((a, e) => a + e.n, 0);
    if (drinks2 < 1) {
      const w = bWaterLoc(B.loc);
      if (w && cnt(B.inv, "bottle") && bGo(B, w.loc, "идёт за водой")) return;
    }
    if (B.mode === "base") return bSet(B, "guard", 60, { why: "сторожит базу" });
  }
  if (B.mode === "base") {
    if (bGo(B, "base", "возвращается на базу")) return;
  }
  if (!bn || h < 10) {
    const here = L2.rooms ? L2.rooms.map((_, i) => i).filter((i) => bRoomValue(B.loc, i) > 0) : [];
    if (here.length && !L2.base) {
      const i = here[0];
      return bSet(B, "search", 1, { room: i, why: "обыскивает «".concat(L2.rooms[i].n, "»") });
    }
    const tg = bTarget(B);
    if (tg && bGo(B, tg, "идёт: ".concat(LOCS[tg].ic, " ").concat(LOCS[tg].n))) return;
  }
  if (L2.fish && cnt(B.inv, "rod")) {
    if (ch(0.5)) invAdd(B.inv, "fish", R(1, 2));
    return bSet(B, "work", 60, { why: "рыбачит" });
  }
  if (L2.forage && !atB) {
    for (let k = R(1, 2); k > 0; k--) invAdd(B.inv, wpick([["berries", 3], ["mushroom", 3], ["herbs", 2], ["wood", 3]]), 1);
    bSkill(B, "surv", 0.5);
    return bSet(B, "work", 40, { why: "собирает в округе" });
  }
  if (!atB) {
    if (bGo(B, "base", "возвращается на базу")) return;
  }
  return bSet(B, "guard", 60, { why: "сторожит базу" });
}
function bFinish(B) {
  const t = B.task;
  B.task = null;
  if (!t) return;
  if (t.t === "travel" && B.trav) {
    const to = B.trav.to;
    B.loc = to;
    B.trav = null;
    B.seen[to] = 1;
    B.trips++;
    if (!LOCS[to].base && ch(0.12 + (LOCS[to].dg || 0) * 0.03)) {
      const en = (typeof _spawnListT === "function" ? _spawnListT : spawnList)([["zombie", 1, 2]]);
      const r = bFight(B, en, 40);
      bLog(B, "по дороге напали заражённые".concat(r.won ? " — отбился" : ""));
    }
    if (B.mode !== "follow") bLog(B, "пришёл: ".concat(LOCS[to].ic, " ").concat(LOCS[to].n));
    if (LOCS[to].base && B.found) {
      const n = B.inv.filter((e) => !BKEEP[e.id]).reduce((a, e) => a + e.n, 0);
      if (n) bLog(B, "вернулся на базу с добычей (".concat(n, " шт.)"), true, "good");
    }
  }
  if (t.t === "search") {
    const r = bSearchRoom(B, t.room);
    if (r.dead) return;
    B.task = { t: "busy", until: G.time + r.mins, why: t.why };
  }
}
function bDie(B, cause) {
  B.alive = false;
  const loc = B.trav ? B.trav.to : B.loc;
  const items = B.inv.splice(0);
  for (const k of ["w", "a", "b"]) if (B.eq[k]) items.push(B.eq[k]);
  if (items.length) G.w.corpses.push({ loc, items, name: B.name, at: G.time });
  B.respawn = G.time + DAY;
  B.task = null;
  B.trav = null;
  bLog(B, "погиб (".concat(cause, ") — ").concat(LOCS[loc].n, ". Его вещи остались на теле."), true, "bad");
  FEED("⚰️ ИИ-выживший ".concat(B.name, " погиб"));
  try {
    SND("death");
  } catch (e) {
  }
}
function botTick(st) {
  if (!worldAuth()) return;
  const B = bot();
  if (!B) return;
  if (!B.alive) {
    if (G.time >= (B.respawn || 0)) {
      const nb = botNew();
      nb.gen = (B.gen || 1) + 1;
      nb.style = B.style;
      nb.log = (B.log || []).slice(-10);
      G.w.bot = nb;
      bLog(nb, "новый выживший пришёл на остров и обосновался на базе", true, "good");
    }
    return;
  }
  const t = st / 60, sleeping = B.task && B.task.t === "sleep", nr = F().needs;
  B.food = Math.max(0, B.food - 2.6 * t * nr);
  B.drink = Math.max(0, B.drink - 3.4 * t * nr * (season() === 3 ? 1.2 : 1));
  B.energy = sleeping ? Math.min(100, B.energy + (LOCS[B.loc].base && G.w.struct.bed ? 13 : 9) * t) : Math.max(0, B.energy - 3.2 * t);
  if (B.bleed) {
    B.hp -= 3 * t;
    if (ch(0.3 * t)) B.bleed = 0;
  }
  if (B.food <= 0) B.hp -= 2 * t;
  if (B.drink <= 0) B.hp -= 5 * t;
  if (B.food > 25 && B.drink > 25 && !B.bleed) B.hp = Math.min(100, B.hp + (sleeping ? 6 : 1.5) * t);
  if (G.em && B.emN && G.em.next !== B.emN) {
    if (B.emN <= G.time && !bShelter(B.loc) && G.em.next > B.emN) {
      B.hp -= 55;
      bLog(B, "попал под Выброс!", true, "bad");
    }
    B.emN = G.em.next;
  } else if (G.em && !B.emN) B.emN = G.em.next;
  if (B.hp <= 0) return bDie(B, B.drink <= 0 ? "жажда" : B.food <= 0 ? "голод" : "раны");
  let guard = 0;
  while (guard++ < 12 && B.alive) {
    if (B.task && G.time < B.task.until) break;
    if (B.task && B.task.t === "busy") B.task = null;
    if (B.task) {
      bFinish(B);
      if (B.hp <= 0) return bDie(B, "бой");
      if (B.task) continue;
    }
    bDecide(B);
    if (B.hp <= 0) return bDie(B, "бой");
  }
  if (B.task && B.task.t === "sleep" && !isNight() && B.energy >= 95 && B.hp >= 60) B.task.until = G.time;
}
const _tickBot = tick;
tick = function(st, o) {
  _tickBot.apply(this, arguments);
  try {
    if (G && !G.dead) botTick(st);
  } catch (e) {
    console.warn("bot", e);
  }
};
const _defenseBot = defense;
defense = function() {
  const d = _defenseBot.apply(this, arguments), B = bot();
  return d + (B && B.alive && LOCS[B.loc].base && !B.trav ? 12 + Math.round(bPower(B) * 4) : 0);
};
const _petTurnBot = petTurn;
petTurn = function(cb) {
  let acted = _petTurnBot.apply(this, arguments);
  const B = bot();
  if (B && B.alive && !B.trav && B.loc === G.loc && !G.traveling && cb && !cb.opts.road || B && B.alive && B.mode === "follow" && cb) {
    const w = bWeapon(B), gun = bGun(B), tg = cb.en.filter((e2) => e2.hp > 0 && (gun || e2.dist <= 1));
    if (!tg.length) return acted;
    const e = tg.sort((a, b) => a.hp - b.hp)[0], D = ENEMY[e.id];
    if (gun) take(B.inv, w.ammo, 1);
    if (ch(0.68 + B.sk.fight * 0.03)) {
      const d = Math.max(1, Math.round((w && w.dmg ? R(w.dmg[0], w.dmg[1]) : R(3, 6)) * (1 + B.sk.fight * 0.05) - (D.arm || 0) * 0.6));
      e.hp -= d;
      cLog("🤖 ".concat(B.name, " ").concat(gun ? "стреляет в" : "бьёт", " ").concat(D.ic, " ").concat(D.n, ": −").concat(d), "good");
      if (e.hp <= 0) {
        B.kills++;
        bSkill(B, "fight", 1);
      }
    } else cLog("🤖 ".concat(B.name, " промахивается по ").concat(D.n, "."), "dim");
    acted = true;
  }
  return acted;
};
const _enemyHitBot = enemyHit;
enemyHit = function(e, ranged, near) {
  const B = bot();
  if (B && B.alive && !B.trav && B.loc === G.loc && !G.traveling && ch(0.28)) {
    const D = ENEMY[e.id];
    if (!ch(D.acc - bArm(B) * 0.03)) {
      cLog("".concat(D.ic, " ").concat(D.n, " промахивается по ").concat(B.name, "."), "dim");
      return;
    }
    const d = Math.max(1, Math.round(R(D.dmg[0], D.dmg[1]) * F().enemies - bArm(B)));
    B.hp -= d;
    cLog("💢 ".concat(D.ic, " ").concat(D.n, " бьёт ").concat(B.name, ": −").concat(d), "bad");
    if (B.hp <= 0) {
      bDie(B, D.n);
      cLog("⚰️ ".concat(B.name, " погиб."), "bad");
    }
    return;
  }
  return _enemyHitBot.apply(this, arguments);
};
const bTaskText = (B) => {
  if (!B.alive) return "погиб · новый придёт через ~".concat(Math.max(1, Math.round((B.respawn - G.time) / H)), " ч");
  const t = B.task;
  if (!t) return "думает";
  if (t.t === "travel" && B.trav) return "в пути: ".concat(LOCS[B.trav.from].n, " → ").concat(LOCS[B.trav.to].n, " (~").concat(Math.max(1, t.until - G.time), " мин)").concat(t.why ? " · " + t.why : "");
  return t.why || { sleep: "спит", work: "работает", guard: "на посту", wait: "ждёт", search: "обыскивает", busy: "занят" }[t.t] || t.t;
};
function botCmd(v) {
  const B = bot();
  if (!B) return;
  B.mode = v;
  B.cmdAt = Date.now();
  if (B.task && B.task.t !== "travel") B.task.until = G.time;
  bLog(B, { auto: "живёт сам", base: "держится базы", rest: "отдыхает", follow: "идёт с тобой" }[v]);
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
}
window.botCmd = botCmd;
window.botStyle = (v) => {
  const B = bot();
  if (!B) return;
  B.style = v;
  B.cmdAt = Date.now();
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
};
window.botCreate = () => {
  if (!worldAuth()) return UI.toast("Позвать ИИ-выжившего может хозяин мира.");
  const nm = (document.getElementById("botname") || {}).value;
  G.w.bot = botNew((nm || "").trim().slice(0, 20) || null);
  bLog(G.w.bot, "обосновался на базе. Будет выживать сам.", true, "good");
  if (G.coop && window.COOP) COOP.sync();
  save();
  UI.render();
};
window.botOff = () => {
  if (!worldAuth()) return UI.toast("Отпустить ИИ-выжившего может хозяин мира.");
  const B = G.w.bot;
  if (!B) return;
  if (B.alive) {
    for (const e of B.inv) G.stash.push(e);
    for (const k of ["w", "a", "b"]) if (B.eq[k]) G.stash.push(B.eq[k]);
  }
  G.w.bot = null;
  UI.log("🤖 ИИ-выживший ушёл с острова. Его вещи оставлены на складе.");
  save();
  UI.render();
};
function botTrade(dir) {
  const B = bot();
  if (!B || B.loc !== G.loc || B.trav) return;
  if (!worldAuth()) return UI.toast("Обмениваться с ИИ-выжившим может только хозяин мира.");
  const src = dir === "give" ? G.inv : B.inv, dst = dir === "give" ? B.inv : G.inv;
  if (!src.length) return UI.toast("Нечего передать.");
  UI.event({ title: dir === "give" ? "🎁 Отдать ".concat(B.name) : "🤲 Взять у ".concat(B.name), text: "Выбери вещь (передаётся вся пачка).", choices: src.slice(0, 24).map((e) => ({ t: "".concat(IT(e.id).ic, " ").concat(IT(e.id).n).concat(e.n > 1 ? " ×" + e.n : ""), fn: () => {
    const i = src.indexOf(e);
    if (i < 0) return;
    src.splice(i, 1);
    dst.push(e);
    save();
    UI.render();
  } })).concat([{ t: "Готово" }]) });
}
window.botTrade = botTrade;
function botPanel() {
  const B = G.w.bot;
  if (!B || !B.on) return '<div class="sec"><h2>🤖 ИИ-выживший</h2><p class="muted" style="font-size:13px">Второй выживший, который живёт сам: исследует остров, обыскивает постройки, носит добычу на склад, крафтит и строит, защищает базу в Кровавую ночь. Вы можете встречаться, меняться вещами и драться вместе.</p><div class="acts"><input id="botname" maxlength="20" placeholder="Имя (необязательно)" style="flex:1;min-width:120px"><button class="btn pri" onclick="botCreate()">🤖 Позвать на остров</button></div></div>';
  const w = B.eq.w ? IT(B.eq.w.id) : null, a = B.eq.a ? IT(B.eq.a.id) : null, bar0 = (v, cls) => '<div class="mbar"><i style="width:'.concat(Math.max(0, Math.min(100, v)), '%" class="').concat(v < 25 ? "bad" : v < 50 ? "warn" : "", '"></i></div>');
  const inv = B.inv.slice(0, 18).map((e) => "".concat(IT(e.id).ic).concat(e.n > 1 ? "×" + e.n : "")).join(" ");
  return '<div class="sec botp"><div class="sechead"><h2>🤖 '.concat(esc2(B.name)).concat(B.gen > 1 ? ' <span class="mono muted" style="font-size:12px">№'.concat(B.gen, "</span>") : "", '</h2><span class="mono muted">').concat(B.alive ? "".concat(LOCS[B.trav ? B.trav.to : B.loc].ic, " ").concat(LOCS[B.trav ? B.trav.to : B.loc].n) : "⚰️", '</span></div>\n    <div class="wnow">').concat(esc2(bTaskText(B)), "</div>\n    ").concat(B.alive ? '<div class="botv"><span>❤️ '.concat(Math.round(B.hp), "</span>").concat(bar0(B.hp), "<span>🍗 ").concat(Math.round(B.food), "</span>").concat(bar0(B.food), "<span>💧 ").concat(Math.round(B.drink), "</span>").concat(bar0(B.drink), "<span>⚡ ").concat(Math.round(B.energy), "</span>").concat(bar0(B.energy), '</div>\n    <div class="s muted">Оружие: ').concat(w ? w.ic + " " + w.n : "кулаки").concat(a ? " · броня: ".concat(a.ic, " ").concat(a.n) : "", " · сила ").concat(bPower(B).toFixed(1), " · навыки: бой ").concat(Math.floor(B.sk.fight), ", обыск ").concat(Math.floor(B.sk.search), ", выживание ").concat(Math.floor(B.sk.surv), ", ремесло ").concat(Math.floor(B.sk.craft), '</div>\n    <div class="s muted">Рюкзак (').concat(bW(B).toFixed(1), "/").concat(bCap(B), " кг): ").concat(inv || "пусто", '</div>\n    <div class="s muted">Убито: ').concat(B.kills, " · походов: ").concat(B.trips, " · найдено вещей: ").concat(B.found, " · построек: ").concat(B.built, '</div>\n    <div class="toggle nshift">').concat([["auto", "🧭 Живёт сам"], ["base", "🏚️ Держится базы"], ["rest", "🛌 Отдых"], ["follow", "👣 Со мной"]].map(([k, n]) => '<button class="'.concat(B.mode === k ? "on" : "", '" onclick="botCmd(\'').concat(k, "')\">").concat(n, "</button>")).join(""), '</div>\n    <div class="toggle nshift">').concat([["careful", "🐢 Осторожный"], ["normal", "🚶 Обычный"], ["bold", "🔥 Смелый"]].map(([k, n]) => '<button class="'.concat(B.style === k ? "on" : "", '" onclick="botStyle(\'').concat(k, "')\">").concat(n, "</button>")).join(""), "</div>\n    ").concat(B.loc === G.loc && !B.trav && !G.traveling ? '<div class="acts"><button class="btn sm" onclick="botTrade(\'give\')">🎁 Отдать вещь</button><button class="btn sm" onclick="botTrade(\'take\')">🤲 Взять вещь</button></div>' : "") : "", '\n    <details class="nsk"><summary>📜 Журнал выжившего</summary>').concat((B.log || []).slice(-15).reverse().map((x) => '<div class="lg" style="font-size:12.5px"><span class="mono muted">Д'.concat(x.d, " ").concat(x.k, "</span> ").concat(esc2(x.t), "</div>")).join(""), '</details>\n    <div class="acts" style="justify-content:flex-end"><button class="btn sm" onclick="botOff()">Отпустить</button></div></div>');
}
CUI.botPanel = botPanel;
const _workPanelBot = CUI.work;
CUI.work = function() {
  return (G.w.bot && G.w.bot.on ? botPanel() : "") + _workPanelBot.apply(this, arguments);
};
const _sideRightBot = sideRight;
sideRight = function() {
  const B = bot();
  const h = _sideRightBot.apply(this, arguments);
  if (!B) return h;
  return '<div class="card"><h3>🤖 '.concat(cesc(B.name), '</h3><div class="ln">').concat(B.alive ? "".concat(LOCS[B.trav ? B.trav.to : B.loc].ic, " ").concat(cesc(LOCS[B.trav ? B.trav.to : B.loc].n)) : "⚰️ погиб", '</div><div class="ln mono" style="white-space:normal">').concat(cesc(bTaskText(B)), "</div>").concat(B.alive ? '<div class="ln mono">❤️ '.concat(Math.round(B.hp), " · 🍗 ").concat(Math.round(B.food), " · 💧 ").concat(Math.round(B.drink), " · ⚡ ").concat(Math.round(B.energy), "</div>") : "", "</div>") + h;
};
const _locRowsBot = EXTUI.locRows;
EXTUI.locRows = function() {
  const h = _locRowsBot.apply(this, arguments), B = bot();
  if (!B || !B.alive || B.loc !== G.loc || B.trav || G.room != null) return h;
  return h + '<div class="row"><span class="ic">🤖</span><div class="grow"><span class="t">'.concat(esc2(B.name), ' здесь</span><span class="s">').concat(esc2(bTaskText(B)), " · ❤️ ").concat(Math.round(B.hp), ' · поможет в бою</span></div><div class="acts"><button class="btn sm" onclick="botTrade(\'give\')">🎁</button><button class="btn sm" onclick="botTrade(\'take\')">🤲</button><button class="btn sm" onclick="botCmd(\'').concat(B.mode === "follow" ? "auto" : "follow", "')\">").concat(B.mode === "follow" ? "Отпустить" : "👣 Со мной", "</button></div></div>");
};
