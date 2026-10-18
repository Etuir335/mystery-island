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
  let h = '<div class="card"><h3>⚠️ Важно</h3>'.concat(w.length ? w.join("") : '<div class="ln mono">Всё спокойно</div>', "</div>");
  const lg = (G.log || []).slice(-24).reverse();
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
  if (!(window.innerWidth >= 1130)) return;
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
  if (l !== SIDE.l) {
    L0.innerHTML = l;
    SIDE.l = l;
  }
  if (r !== SIDE.r) {
    R0.innerHTML = r;
    SIDE.r = r;
  }
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
const _cuiTop2 = CUI.top;
CUI.top = function() {
  let h = _cuiTop2.apply(this, arguments);
  if (window.innerWidth >= 1130) return h;
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
