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
