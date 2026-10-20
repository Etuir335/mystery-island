"use strict";
function extraMod(k) {
  let v = 0;
  const p = G && G.pet;
  if (p && p.hp > 0) {
    if (p.type === "dog") {
      if (k === "carry") v += 6;
      if (k === "ambush") v -= 0.3;
      if (k === "noise") v += 0.1;
    }
    if (p.type === "cat") {
      if (k === "stress") v -= 0.3;
      if (k === "loot") v += 0.05;
    }
  }
  if (typeof seasonMod === "function") v += seasonMod(k);
  return v;
}
const PET_FOOD = ["meat", "cmeat", "fish", "cfish", "smoked", "canned", "ration"];
const DOG_NAMES = ["Шарик", "Бобик", "Рекс", "Джек", "Граф", "Тузик", "Буран", "Лорд", "Найда", "Дымка"];
function petFood() {
  return PET_FOOD.find((id) => cnt(G.inv, id)) || atBase() && PET_FOOD.find((id) => cnt(G.stash, id));
}
function tameDog(i) {
  const cb = G.combat, e = cb.en[i];
  if (!e || e.id !== "dog" || e.hp <= 0) return;
  const food = PET_FOOD.find((id) => cnt(G.inv, id) && ["meat", "cmeat", "fish", "cfish", "smoked"].includes(id));
  if (!food) {
    cLog("Нечем приманить — нужно мясо или рыба.", "dim");
    return UI.combat();
  }
  take(G.inv, food, 1);
  const p = 0.3 + skill("surv") * 0.05 + (e.hp < e.max * 0.5 ? 0.15 : 0) - (G.pet ? 1 : 0);
  if (G.pet) {
    cLog("У тебя уже есть питомец — второй не пойдёт за тобой.", "dim");
    return endPlayerTurn();
  }
  if (ch(p)) {
    e.hp = 0;
    e.dead = true;
    e.tamed = true;
    G.pet = { type: "dog", name: pick(DOG_NAMES), hp: 40, max: 40, loyal: 60, fedAt: G.time, kills: 0 };
    cLog("🐕 Пёс схватил ".concat(IT(food).n.toLowerCase(), " и… завилял хвостом. Теперь его зовут ").concat(G.pet.name, "!"), "good");
    SND("bark");
    xp("surv", 6);
    FEED("🐕 приручил пса по кличке ".concat(G.pet.name));
    if (cb.en.every((x) => x.hp <= 0)) return endCombat("win");
    return endPlayerTurn();
  }
  cLog("🍖 Пёс схватил ".concat(IT(food).n.toLowerCase(), ", но всё ещё скалится."), "dim");
  endPlayerTurn();
}
function petTurn(cb) {
  const p = G.pet;
  if (!p || p.type !== "dog" || p.hp <= 0 || cb.opts.raidDef === false) return false;
  const tg = cb.en.filter((e2) => e2.hp > 0 && e2.dist <= 1);
  if (!tg.length) return false;
  const e = pick(tg), D = ENEMY[e.id];
  if (ch(0.7)) {
    const d = Math.max(1, Math.round(R(4, 8) * (1 + p.loyal / 200) - (D.arm || 0) * 0.5));
    e.hp -= d;
    cb.log.push({ t: "🐕 ".concat(p.name, " вцепился в ").concat(D.ic, " ").concat(D.n, ": −").concat(d), c: "good" });
    if (e.hp <= 0) p.kills++;
    if (ch(0.25)) e.stun = Math.max(e.stun, 1);
  } else cb.log.push({ t: "🐕 ".concat(p.name, " рычит и кружит вокруг ").concat(D.n, "."), c: "dim" });
  return true;
}
function petHit(e, dmg) {
  const p = G.pet;
  if (!p || p.type !== "dog" || p.hp <= 0 || !ch(0.18)) return false;
  const D = ENEMY[e.id];
  p.hp -= dmg;
  cLog("💢 ".concat(D.ic, " ").concat(D.n, " бьёт пса ").concat(p.name, ": −").concat(dmg), "bad");
  if (p.hp <= 0) {
    cLog("💔 ".concat(p.name, " погиб, защищая тебя."), "bad");
    G.ch.stress = clamp(G.ch.stress + 25, 0, 100);
    FEED("💔 потерял пса ".concat(p.name));
    G.pet = null;
  }
  return true;
}
function feedPet(id) {
  const p = G.pet;
  if (!p) return;
  id = id || petFood();
  if (!id) return UI.toast("Нет подходящей еды: мясо, рыба, тушёнка.");
  allTake(id, 1);
  p.fedAt = G.time;
  p.loyal = Math.min(100, p.loyal + 15);
  p.hp = Math.min(p.max, p.hp + 8);
  UI.log("".concat(p.type === "dog" ? "🐕" : "🐈", " ").concat(p.name, " съел ").concat(IT(id).n.toLowerCase(), ". Доволен."), "good");
  UI.render();
}
function releasePet() {
  if (!G.pet) return;
  UI.log("".concat(G.pet.type === "dog" ? "🐕" : "🐈", " ").concat(G.pet.name, " ушёл своей дорогой."));
  G.pet = null;
  UI.render();
}
function takeCat() {
  if (G.pet) return UI.toast("У тебя уже есть питомец.");
  if ((G.w.catLove || 0) < 4) return UI.toast("Кот тебе пока не доверяет. Гладь его почаще.");
  G.pet = { type: "cat", name: "Кот", hp: 20, max: 20, loyal: 70, fedAt: G.time, kills: 0 };
  G.w.catAway = true;
  UI.log("🐈 Кот запрыгнул тебе на рюкзак. Похоже, он идёт с тобой.", "good");
  FEED("🐈 взял кота с базы в поход");
  UI.render();
}
function catHome() {
  if (!G.pet || G.pet.type !== "cat") return;
  if (!atBase()) return UI.toast("Кота можно отпустить только на базе.");
  G.pet = null;
  G.w.catAway = false;
  UI.log("🐈 Кот спрыгнул и пошёл досыпать на своё место.");
  UI.render();
}
function petDaily() {
  const p = G.pet;
  if (!p) return;
  p.hp = Math.min(p.max, p.hp + 10);
  if (G.time - p.fedAt > 30 * H) {
    const id = petFood();
    if (id) {
      allTake(id, 1);
      p.fedAt = G.time;
      UI.log("".concat(p.type === "dog" ? "🐕" : "🐈", " ").concat(p.name, " поел (").concat(IT(id).n.toLowerCase(), " из запасов)."), "dim");
    } else {
      p.loyal -= 25;
      UI.log("".concat(p.type === "dog" ? "🐕" : "🐈", " ").concat(p.name, " голоден и смотрит с укором. Покорми его!"), "warn");
    }
  }
  if (p.loyal <= 0) {
    UI.event({ title: "".concat(p.type === "dog" ? "🐕" : "🐈", " ").concat(p.name, " ушёл"), cls: "bad", text: "Голодный зверь не стал ждать и ушёл искать еду сам.", choices: [{ t: "Эх…" }] });
    if (p.type === "cat") G.w.catAway = false;
    G.pet = null;
  }
}
const CAR_STAGES = [
  { n: "Колёса и ходовая", c: { carpart: 3, scrap: 4 } },
  { n: "Аккумулятор и проводка", c: { battery: 2, wire: 2, elec: 1 } }
];
const CAR_TANK = 12;
function car() {
  if (!G.w.car) G.w.car = { loc: "gas", stage: 0, fuel: 0, hp: 100 };
  return G.w.car;
}
const carReady = () => car().stage >= CAR_STAGES.length;
function carCost(st) {
  const c = Object.assign({}, CAR_STAGES[st].c);
  if (mod("car") > 0 && c.carpart) c.carpart = Math.max(1, c.carpart - 1);
  return c;
}
function carRepair() {
  const c = car();
  if (carReady() || c.loc !== G.loc || G.traveling) return;
  if (!cnt(G.inv, "tools") && !(atBase() && cnt(G.stash, "tools"))) return UI.toast("Нужен набор инструментов.");
  const need = carCost(c.stage);
  if (!hasAll(need)) return UI.toast("Не хватает деталей.");
  for (const [k, v] of Object.entries(need)) allTake(k, v);
  advance(90);
  if (G.dead) return;
  noise(20);
  xp("craft", 8);
  SND("build");
  UI.log("🔧 Машина: ".concat(CAR_STAGES[c.stage].n, " — готово."), "good");
  c.stage++;
  if (carReady()) {
    FEED("🚗 починил машину");
    UI.event({ title: "🚗 Машина на ходу!", cls: "good", text: "Мотор чихнул и завёлся. Осталось залить бензин (канистры ищи в багажниках и на заправке).\n\nМашина ездит только по дорогам: база, деревня, заправка, ферма, лес, блокпост, маяк, метеостанция. Втрое быстрее пешком, но шумно.", choices: [{ t: "Поехали!" }] });
  }
  UI.render();
}
function carRefuel() {
  const c = car();
  if (!cnt(G.inv, "fuel")) return UI.toast("Нужна канистра бензина.");
  if (c.fuel >= CAR_TANK) return UI.toast("Бак полон.");
  take(G.inv, "fuel", 1);
  c.fuel = Math.min(CAR_TANK, c.fuel + 4);
  advance(5);
  UI.log("⛽ Залил канистру. В баке ".concat(c.fuel, "/").concat(CAR_TANK, "."), "good");
  UI.render();
}
const roadOk = (a, b) => LOCS[a] && LOCS[b] && LOCS[a].road && LOCS[b].road;
function driveCost(to) {
  const m = LOCS[G.loc].links[to] || 999;
  return Math.max(1, Math.ceil(m / 35));
}
function canDrive(to) {
  const c = G.w.car;
  if (!c || !carReady() || c.loc !== G.loc || G.traveling) return "no";
  if (!roadOk(G.loc, to) || LOCS[G.loc].links[to] == null) return "Туда нет дороги.";
  if (c.fuel < driveCost(to)) return "Мало бензина (нужно ".concat(driveCost(to), ").");
  const e = canTravel(to);
  return e || "";
}
function drive(to) {
  const err = canDrive(to);
  if (err) return UI.toast(err === "no" ? "Машины здесь нет." : err);
  const c = car();
  c.fuel -= driveCost(to);
  travel(to, { car: true });
  if (!G.dead && G.loc === to) {
    c.loc = to;
    noise(30);
  }
}
const EXTUI = {
  // строки на экране локации
  locRows() {
    const b = UI.btn;
    let h = "";
    const c = G.w.car;
    if (c && c.loc === G.loc && !G.traveling) {
      if (!carReady()) {
        const st = CAR_STAGES[c.stage], need = carCost(c.stage);
        const parts = Object.entries(need).map(([k, v]) => '<span class="'.concat(allCnt(k) >= v ? "" : "bad", '">').concat(IT(k).ic).concat(IT(k).n, " ").concat(allCnt(k), "/").concat(v, "</span>")).join(", ");
        h += '<div class="row"><span class="ic">🚗</span><div class="grow"><span class="t">Брошенная машина · ремонт '.concat(c.stage, "/").concat(CAR_STAGES.length, '</span><span class="s">→ ').concat(st.n, ": ").concat(parts, " · нужен 🧰 набор инструментов</span></div>").concat(b("🔧 Чинить (1,5 ч)", carRepair, "sm", !hasAll(need)), "</div>");
      } else h += '<div class="row"><span class="ic">🚗</span><div class="grow"><span class="t">Твоя машина</span><span class="s">⛽ '.concat(c.fuel, "/").concat(CAR_TANK, " · ездит по дорогам (карта → выбери место)</span></div>").concat(b("⛽ Залить канистру", carRefuel, "sm", !cnt(G.inv, "fuel") || c.fuel >= CAR_TANK), "</div>");
    }
    const p = G.pet;
    if (p) h += '<div class="row"><span class="ic">'.concat(p.type === "dog" ? "🐕" : "🐈", '</span><div class="grow"><span class="t">').concat(xesc(p.name), ' рядом</span><span class="s">❤️ ').concat(Math.round(p.hp), "/").concat(p.max, " · 💛 верность ").concat(Math.round(p.loyal)).concat(G.time - p.fedAt > 24 * H ? " · голоден" : "", "</span></div>").concat(b("🍖 Покормить", () => feedPet(), "sm", !petFood()), "</div>");
    return h;
  },
  // кнопка поездки на карте
  mapDrive(sel) {
    const e = canDrive(sel);
    if (e === "no") return "";
    const mins = Math.max(10, Math.round(travelTime(sel) * 0.35));
    return UI.btn("🚗 Ехать — ".concat(mins, " мин (⛽−").concat(driveCost(sel), ")"), () => {
      st_sel_clear();
      drive(sel);
    }, "", !!e) + (e ? '<p class="muted">'.concat(xesc(e), "</p>") : "");
  },
  // доп. действия в бою против конкретного врага
  combatActs(i, e) {
    if (e.id === "dog" && !G.pet && PET_FOOD.slice(0, 5).some((id) => cnt(G.inv, id))) return UI.mbtn("🍖 Приманить", () => tameDog(i), "sm");
    return "";
  },
  // панель на экране персонажа
  charPanel() {
    const p = G.pet, b = UI.btn;
    if (!p) return '<div class="sec"><h2>🐾 Компаньон</h2><p class="muted">Одичавшего пса можно приманить в бою мясом или рыбой — шанс выше, если он ранен. Кот с базы пойдёт с тобой, если часто его гладить.</p></div>';
    return '<div class="sec"><h2>'.concat(p.type === "dog" ? "🐕" : "🐈", " ").concat(xesc(p.name), '</h2><div class="list"><div class="row"><div class="grow"><span class="t">Здоровье ').concat(Math.round(p.hp), "/").concat(p.max, "</span>").concat(uiBar(p.hp, p.max), '<span class="t">Верность ').concat(Math.round(p.loyal), "/100</span>").concat(uiBar(p.loyal, 100), '<span class="s">').concat(p.type === "dog" ? "Кусает врагов рядом, несёт +6 кг, чует засады (−30%). Ест раз в сутки." : "Снимает стресс (−30%), иногда находит мелочь. Ест раз в сутки.").concat(p.kills ? " · загрыз врагов: ".concat(p.kills) : "", '</span></div></div></div>\n      <div class="acts">').concat(b("🍖 Покормить", () => feedPet(), "", !petFood())).concat(p.type === "cat" ? b("🏚️ Оставить на базе", catHome, "", !atBase()) : b("Отпустить", releasePet), "</div></div>");
  }
};
const xesc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (ch2) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch2]);
const uiBar = (v, m) => '<div class="bar '.concat(v / m < 0.3 ? "low" : v / m < 0.6 ? "mid" : "", '"><i style="width:').concat(Math.max(0, Math.min(100, v / m * 100)), '%"></i></div>');
function st_sel_clear() {
  if (UI._st) UI._st.sel = null;
}
(() => {
  const _newDay = newDay;
  newDay = function() {
    _newDay.apply(this, arguments);
    try {
      petDaily();
      if (typeof extNewDay === "function") extNewDay();
    } catch (e) {
      console.warn(e);
    }
  };
  const _migrate = migrate;
  migrate = function() {
    _migrate.apply(this, arguments);
    car();
    if (typeof extMigrate === "function") extMigrate();
  };
})();
const NPC_ROLES = {
  fisher: { n: "Рыбак", ic: "🎣", d: "каждый день приносит рыбу" },
  guard: { n: "Охранник", ic: "🛡️", d: "+12 к обороне базы" },
  crafter: { n: "Мастер", ic: "🔨", d: "пилит доски из дров и латает стены" },
  medic: { n: "Медик", ic: "⛑️", d: "раны заживают быстрее, пока ты спишь на базе; кипятит повязки" },
  forager: { n: "Собиратель", ic: "🧺", d: "приносит ягоды, грибы, травы и дрова" },
  hunter: { n: "Охотник", ic: "🏹", d: "иногда приносит мясо" }
};
const NPC_NAMES = ["Лёха", "Марина", "Дед Иван", "Света", "Костя", "Нина", "Юра", "Оксана", "Гоша", "Таня", "Вадим", "Люба", "Петрович", "Аня", "Слава", "Зоя"];
const bunkCap = () => [0, 2, 4][G.w.struct.bunks || 0] || 0;
const npcs = () => G.w.npcs = G.w.npcs || [];
function newNpc(role) {
  return { id: "n" + G.time + R(0, 999), name: pick(NPC_NAMES.filter((n) => !npcs().some((x) => x.name === n))) || "Выживший", role: role || pick(Object.keys(NPC_ROLES)), morale: 70, days: 0 };
}
function inviteNpc(n, src) {
  if (npcs().length >= bunkCap()) {
    UI.toast(bunkCap() ? "На базе нет свободных нар." : "Сначала построй нары на базе (Постройки).");
    return false;
  }
  npcs().push(n);
  FEED("🏘️ позвал на базу: ".concat(n.name, " (").concat(NPC_ROLES[n.role].n, ")"));
  UI.log("🏘️ ".concat(n.name, " (").concat(NPC_ROLES[n.role].ic, " ").concat(NPC_ROLES[n.role].n, ") идёт на твою базу").concat(src ? " — " + src : "", "."), "good");
  return true;
}
function dismissNpc(id) {
  const i = npcs().findIndex((x) => x.id === id);
  if (i < 0) return;
  UI.log("👋 ".concat(npcs()[i].name, " собрал вещи и ушёл."));
  npcs().splice(i, 1);
  UI.render();
}
const NPC_FOOD = (n) => G.stash.find((e) => IT(e.id).c === "food" && (IT(e.id).f || 0) >= 8 && !IT(e.id).smoke && freshness(e) < 1);
const NPC_DRINK = () => G.stash.find((e) => IT(e.id).c === "drink" && (IT(e.id).d || 0) > 10 && !IT(e.id).salt);
function npcDaily() {
  const list = npcs();
  if (!list.length) return;
  const out = [];
  for (const n of list.slice()) {
    n.days++;
    const f = NPC_FOOD(), d = NPC_DRINK();
    if (f) take(G.stash, f.id, 1);
    if (d) {
      take(G.stash, d.id, 1);
      if (IT(d.id).btl) invAdd(G.stash, "bottle", 1);
    }
    if (f && d) n.morale = Math.min(100, n.morale + 5);
    else {
      n.morale -= f || d ? 15 : 30;
      out.push("😟 ".concat(n.name, " голодает"));
    }
    if (n.morale <= 0) {
      list.splice(list.indexOf(n), 1);
      out.push("🚪 ".concat(n.name, " ушёл с базы — не было еды"));
      continue;
    }
    const r = n.role, win = season() === 1;
    if (r === "fisher") {
      const k = win ? 1 : R(1, 3);
      invAdd(G.stash, "fish", k);
      out.push("🎣 ".concat(n.name, ": рыба ×").concat(k));
    }
    if (r === "forager") {
      const got = [];
      for (let k = win ? 1 : R(2, 3); k > 0; k--) {
        const id = wpick(win ? [["wood", 3], ["stick", 1]] : [["berries", 3], ["mushroom", 3], ["herbs", 2], ["wood", 3]]);
        invAdd(G.stash, id, 1);
        got.push(IT(id).ic);
      }
      out.push("🧺 ".concat(n.name, ": ").concat(got.join("")));
    }
    if (r === "hunter" && ch(0.45)) {
      invAdd(G.stash, "meat", 2);
      out.push("🏹 ".concat(n.name, ": мясо ×2"));
    }
    if (r === "crafter") {
      if (cnt(G.stash, "wood") >= 2) {
        take(G.stash, "wood", 2);
        invAdd(G.stash, "planks", 1);
        out.push("🔨 ".concat(n.name, ": доска"));
      }
      if (G.w.struct.walls && G.w.wallHp < 100) G.w.wallHp = Math.min(100, G.w.wallHp + 10);
    }
    if (r === "medic" && cnt(G.stash, "dband")) {
      take(G.stash, "dband", 1);
      invAdd(G.stash, "bandage", 1);
      out.push("⛑️ ".concat(n.name, ": стерильный бинт"));
    }
  }
  if (out.length) UI.log("🏘️ База: " + out.join(" · "), "sys");
}
const npcDef = () => npcs().reduce((a, n) => a + (n.role === "guard" ? 12 : 3), 0);
function npcOffer(role, src) {
  const n = newNpc(role);
  return { t: "🏘️ Позвать на базу (".concat(NPC_ROLES[n.role].ic, " ").concat(NPC_ROLES[n.role].n, ")"), fn: () => inviteNpc(n, src) };
}
const SEASONS = [
  { n: "Осень", ic: "🍂", d: "Грибная пора: в лесу больше находок, охота удачнее." },
  { n: "Зима", ic: "❄️", d: "Снег и мороз: больше ешь, дороги медленнее, в лесу пусто, огород не растёт. Море у берега замерзает." },
  { n: "Весна", ic: "🌱", d: "Дожди и ручьи: огород растёт быстрее." },
  { n: "Лето", ic: "☀️", d: "Много еды в лесу и на огороде, но сильнее хочется пить." }
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
  return WEATHER.map((x) => {
    let w = x.w;
    if (x.id === "snow") w = s === 1 ? 4 : 0;
    if (s === 1 && (x.id === "rain" || x.id === "storm")) w = 0;
    if (s === 2 && x.id === "rain") w += 2;
    if (s === 3 && x.id === "clear") w += 3;
    if (s === 0 && x.id === "fog") w += 1;
    return [x.id, w];
  }).filter(([, w]) => w > 0);
}
const iceRoute = () => season() === 1 && seasonDay() >= 3;
function seasonNewDay() {
  if (seasonDay() !== 1 || day() === 1) return;
  const S = SEASONS[season()];
  setTimeout(() => hint("season"), 0);
  UI.event({ title: "".concat(S.ic, " Наступила ").concat(S.n.toLowerCase()), text: S.d + (season() === 1 && CH2() ? "\n\nЧерез пару дней пролив замёрзнет — до Острова-8 можно будет дойти пешком по льду." : ""), choices: [{ t: "Ясно" }] });
}
function extNewDay() {
  if (day() === 2 && !G.coop) setTimeout(() => hint("coop"), 0);
  if (worldAuth()) {
    npcDaily();
    if (typeof raidDaily === "function") raidDaily();
  }
  seasonNewDay();
  if (typeof achCheck === "function") achCheck();
}
function extMigrate() {
  npcs();
  if (G.w.struct.bunks == null) G.w.struct.bunks = 0;
}
EXTUI.basePanel = function() {
  const b = UI.btn, list = npcs(), cap = bunkCap();
  let h = '<div class="sec"><div class="sechead"><h2>🏘️ Жильцы '.concat(list.length, "/").concat(cap, "</h2></div>");
  if (!cap) h += '<p class="muted">Построй нары (Постройки), чтобы приютить выживших. Их можно встретить в пути — незнакомцы и раненые иногда готовы пойти к тебе.</p>';
  else if (!list.length) h += '<p class="muted">Пока никого. Позови незнакомца в пути или помоги раненому — и у тебя появятся помощники. Жильцы едят и пьют из общего склада раз в день.</p>';
  h += '<div class="list">'.concat(list.map((n) => {
    const R0 = NPC_ROLES[n.role];
    return '<div class="row"><span class="ic">'.concat(R0.ic, '</span><div class="grow"><span class="t">').concat(xesc(n.name), " · ").concat(R0.n, '</span><span class="s">').concat(R0.d, "</span>").concat(uiBar(n.morale, 100), '<span class="s">настроение ').concat(Math.round(n.morale), " · живёт ").concat(n.days, " дн.</span></div>").concat(b("Выгнать", () => dismissNpc(n.id), "sm"), "</div>");
  }).join(""), "</div></div>");
  return h;
};
const ACH_KEY = "moti3_ach";
const aliveDays = () => Math.floor((G.time - G.ch.born) / DAY);
const ACH = [
  { id: "night1", ic: "🌙", n: "Первая ночь", d: "Прожить сутки", ok: () => aliveDays() >= 1 },
  { id: "week", ic: "📅", n: "Неделя на острове", d: "Прожить 7 дней одним персонажем", ok: () => aliveDays() >= 7 },
  { id: "month", ic: "🗓️", n: "Старожил", d: "Прожить 30 дней одним персонажем", ok: () => aliveDays() >= 30 },
  { id: "hc30", ic: "☠️", n: "Железный", d: "Прожить 30 дней на Хардкоре", ok: () => G.mode === "hardcore" && aliveDays() >= 30 },
  { id: "camp", ic: "🔥", n: "Обжился", d: "Костёр и спальное место на базе", ok: () => G.w.struct.fire && G.w.struct.bed },
  { id: "radio", ic: "📻", n: "Голос в эфире", d: "Собрать радиостанцию", ok: () => G.w.flags.radio_built },
  { id: "fort", ic: "🏰", n: "Крепость", d: "Стальные стены на базе", ok: () => G.w.struct.walls >= 3 },
  { id: "horde", ic: "🌕", n: "Пережил Кровавую ночь", d: "Отбиться от орды", ok: () => Object.keys(G.w.hordeDone || {}).length >= 1 },
  { id: "kills50", ic: "🔪", n: "Чистильщик", d: "Убить 50 врагов одним персонажем", ok: () => G.ch.kills >= 50 },
  { id: "kills200", ic: "⚔️", n: "Легенда острова", d: "Убить 200 врагов одним персонажем", ok: () => G.ch.kills >= 200 },
  { id: "notes", ic: "📜", n: "Летописец", d: "Найти все записки", ok: () => G.w.notes.length >= Object.keys(NOTES).length },
  { id: "art", ic: "✨", n: "Сталкер", d: "Достать артефакт", ok: () => [...G.inv, ...G.eq.art.filter(Boolean)].some((e) => IT(e.id).c === "art") },
  { id: "crown", ic: "👑", n: "Корона Аппарата", d: "Добыть Золотую корону", ok: () => [...G.inv, ...G.stash, ...G.eq.art.filter(Boolean)].some((e) => e.id === "crown") },
  { id: "silence", ic: "🔇", n: "Тишина", d: "Разбить ядро Аппарата", ok: () => G.w.ending === "silence" },
  { id: "master", ic: "🔮", n: "Мастер", d: "Забрать ядро Аппарата", ok: () => G.w.ending === "master" },
  { id: "heart", ic: "💠", n: "Сердце острова", d: "Пройти Главу 2", ok: () => G.w.ch2 && G.w.ch2.end },
  { id: "reef", ic: "⛵", n: "Через пролив", d: "Добраться до Острова-8", ok: () => G.w.flags.reef_seen },
  { id: "dog", ic: "🐕", n: "Лучший друг", d: "Приручить пса", ok: () => G.pet && G.pet.type === "dog" },
  { id: "cat", ic: "🐈", n: "Кошатник", d: "Взять кота в поход", ok: () => G.pet && G.pet.type === "cat" },
  { id: "car", ic: "🚗", n: "Колёса", d: "Починить машину", ok: () => G.w.car && G.w.car.stage >= 2 },
  { id: "npc4", ic: "🏘️", n: "Община", d: "4 жильца на базе", ok: () => npcs().length >= 4 },
  { id: "rich", ic: "💰", n: "Богач", d: "Скопить 1000₽", ok: () => G.money >= 1e3 },
  { id: "coop", ic: "🤝", n: "Вместе веселее", d: "Играть в общем мире с другом", ok: () => !!G.coop },
  { id: "trust", ic: "🤝", n: "Свой человек", d: "Выполнить все задания одного торговца", ok: () => ["semen", "serg", "levin"].some((t) => TRADERS[t].quests.filter((q) => !QUESTS[q].ch2).every((q) => G.w.quests[q] === "done")) },
  { id: "winter", ic: "❄️", n: "Пережил зиму", d: "Встретить весну одним персонажем, пережив всю зиму", ok: () => season() === 2 && G.ch.born <= (Math.floor((day() - 1) / SEASON_LEN) * SEASON_LEN - SEASON_LEN) * DAY },
  { id: "perks4", ic: "⭐", n: "Мастер своего дела", d: "Взять 4 перка", ok: () => (G.ch.perks || []).length >= 4 },
  { id: "raid", ic: "💣", n: "Налётчик", d: "Успешно разграбить чужую базу", ok: () => (G.w.raidStats || {}).won >= 1 },
  { id: "raid5", ic: "🏴‍☠️", n: "Гроза острова", d: "Разграбить 5 баз", ok: () => (G.w.raidStats || {}).won >= 5 },
  { id: "defend", ic: "🛡️", n: "Неприступная", d: "Отбить рейд на свою базу", ok: () => (G.w.raidStats || {}).defended >= 1 }
];
function achGet() {
  try {
    return JSON.parse(localStorage.getItem(ACH_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function achSet(o) {
  try {
    localStorage.setItem(ACH_KEY, JSON.stringify(o));
  } catch (e) {
  }
}
let achLast = 0;
function achCheck(force) {
  if (!G || !G.ch || !force && Date.now() - achLast < 3e3) return;
  achLast = Date.now();
  const got = achGet();
  let fresh = [];
  for (const a of ACH) {
    if (got[a.id]) continue;
    let ok = false;
    try {
      ok = !!a.ok();
    } catch (e) {
    }
    if (ok) {
      got[a.id] = Date.now();
      fresh.push(a);
    }
  }
  if (!fresh.length) return;
  achSet(got);
  for (const a of fresh) {
    UI.toast("🏅 Достижение: ".concat(a.ic, " ").concat(a.n));
    UI.log("🏅 Достижение получено: ".concat(a.ic, " ").concat(a.n, " — ").concat(a.d, "."), "good");
    FEED("🏅 получил достижение «".concat(a.n, "»"));
  }
  SND("quest");
  if (window.TGA && TGA.saveAch) TGA.saveAch();
}
EXTUI.achPanel = function() {
  const got = achGet(), n = ACH.filter((a) => got[a.id]).length;
  return '<div class="sec"><div class="sechead"><h2>🏅 Достижения</h2><span class="mono">'.concat(n, "/").concat(ACH.length, '</span></div><div class="traits">').concat(ACH.map((a) => '<div class="trait '.concat(got[a.id] ? "on" : "", '" style="').concat(got[a.id] ? "" : "opacity:.55", '"><span class="tn"><span>').concat(got[a.id] ? a.ic : "🔒", " ").concat(a.n, '</span></span><span class="muted">').concat(a.d, "</span></div>")).join(""), "</div></div>");
};
const achCount = () => {
  const g = achGet();
  return ACH.filter((a) => g[a.id]).length;
};
const FACTIONS = {
  wolves: {
    n: "«Волки»",
    ic: "🐺",
    tier: 1,
    mins: 70,
    en: "bandit",
    cnt: [2, 3],
    d: "Банда мародёров в старом гараже у дороги. Злые, но небогатые.",
    loot: [["canned", 4], ["water", 4], ["a9", 3], ["cigs", 3], ["vodka", 2], ["cash", 3], ["bandage", 2], ["pm", 1], ["bat", 1], ["tape", 2]],
    hint: "еда, патроны, деньги"
  },
  fishers: {
    n: "Рыбаки Северной бухты",
    ic: "🎣",
    tier: 1,
    mins: 90,
    en: "fisherman",
    cnt: [1, 2],
    peaceful: 1,
    d: "Мирная артель за частоколом. Грабить их — подло, но у них полно еды.",
    loot: [["smoked", 5], ["fish", 4], ["water", 4], ["rod", 1], ["rope", 3], ["rag", 3], ["seeds", 2], ["canned", 2]],
    hint: "еда и снасти"
  },
  stalkers: {
    n: "Сталкеры Ржавого",
    ic: "☢️",
    tier: 2,
    mins: 110,
    en: "stalkerE",
    cnt: [2, 3],
    d: "Лагерь сталкеров у болота. Детекторы, антирад и артефакты.",
    reveal: "swamp",
    loot: [["antirad", 3], ["bolts", 3], ["medkit", 1], ["detector", 1], ["gasmask", 1], ["medusa", 1], ["drop", 1], ["a545", 2], ["vodka", 2]],
    hint: "артефакты и медицина"
  },
  deserters: {
    n: "Дезертиры",
    ic: "🪖",
    tier: 2,
    mins: 120,
    en: "deserter",
    cnt: [2, 3],
    d: "Бывшие солдаты гарнизона засели в бункере. Оружие и патроны.",
    reveal: "radio",
    loot: [["a545", 4], ["a9", 3], ["a12", 3], ["ration", 3], ["medkit", 1], ["vest", 1], ["ak", 1], ["sawn", 1], ["bp_c4", 1], ["bomb", 1]],
    hint: "оружие и патроны"
  },
  cult: {
    n: "Сектанты Синего света",
    ic: "🔵",
    tier: 3,
    mins: 140,
    en: "cultist",
    cnt: [3, 4],
    d: "Фанатики, молящиеся Аппарату. Говорят, хранят кристаллы и сыворотку.",
    reveal: "nii",
    loot: [["crystal", 1], ["fireball", 1], ["serum", 1], ["antibio", 2], ["cshard", 3], ["ring", 2], ["watch", 2], ["elec", 2], ["bp_c4", 1]],
    hint: "артефакты, сыворотка, ценности"
  }
};
const WALL_N = ["", "частокол", "каменная стена", "стальные ворота"];
const WALL_BOMBS = [0, 1, 2, 4];
const camps = () => {
  if (!G.w.camps) {
    G.w.camps = {};
    for (const k in FACTIONS) G.w.camps[k] = { known: k === "wolves" || k === "fishers", wall: FACTIONS[k].tier, grudge: 0, raided: 0, readyAt: 0, scouted: false };
  }
  return G.w.camps;
};
const raidStats = () => G.w.raidStats = G.w.raidStats || { won: 0, lost: 0, defended: 0, fell: 0 };
const SHIELD_DAYS = { tourist: 1e9, survivor: 14, hardcore: 10 };
function shieldLeft() {
  if (G.mode === "tourist" && !G.w.pvpOn) return Infinity;
  const d = (G.mode === "tourist" ? 14 : SHIELD_DAYS[G.mode]) - day() + 1;
  return Math.max(0, d);
}
const wantedNow = () => (G.wantedUntil || 0) > Date.now();
function revealCamps() {
  const c = camps();
  let fresh = [];
  for (const k in FACTIONS) {
    const F0 = FACTIONS[k];
    if (c[k].known) continue;
    if (F0.reveal === "radio" && G.w.flags.radio_built || F0.reveal === "swamp" && G.w.locs.swamp.seen || F0.reveal === "nii" && G.w.locs.nii.seen) {
      c[k].known = true;
      fresh.push(F0);
    }
  }
  if (fresh.length) UI.log("🗺️ Ты узнал о лагере: " + fresh.map((f) => f.ic + " " + f.n).join(", ") + " (База → Рейды).", "good");
}
function myPower() {
  const w = curWeapon();
  const wd = w && w.dmg ? (w.dmg[0] + w.dmg[1]) / 2 : 4;
  return Math.round(wd * 2 + armor() * 3 + (skill("melee") + skill("shoot")) * 3 + (G.pet && G.pet.type === "dog" ? 8 : 0) + healthPct() / 5);
}
const bombPower = () => cnt(G.inv, "bomb") + cnt(G.inv, "c4") * 3;
function useBombs(n) {
  let left = n;
  while (left >= 3 && cnt(G.inv, "c4")) {
    take(G.inv, "c4", 1);
    left -= 3;
  }
  while (left > 0 && cnt(G.inv, "bomb")) {
    take(G.inv, "bomb", 1);
    left--;
  }
  while (left > 0 && cnt(G.inv, "c4")) {
    take(G.inv, "c4", 1);
    left -= 3;
  }
}
function raidLoot(k, rich) {
  const F0 = FACTIONS[k], out = [];
  for (let i = R(3, 4) + F0.tier + (rich ? 2 : 0); i > 0; i--) {
    const id = wpick(F0.loot);
    if (!ITEMS[id]) continue;
    if (IT(id).c === "bp" && G.w.bp[IT(id).bp]) continue;
    invAdd(out, id, IT(id).c === "ammo" ? R(6, 14) : ["cash", "canned", "fish", "smoked", "water"].includes(id) ? R(1, 3) : 1);
  }
  out.push({ id: "cash", n: R(1, 2) * F0.tier });
  return out;
}
function grabLoot(list, ctx) {
  const got = [], left = [];
  const sorted = list.slice().sort((a, b) => IT(b.id).v / Math.max(0.05, IT(b.id).w) - IT(a.id).v / Math.max(0.05, IT(a.id).w));
  for (const e of sorted) {
    let n = e.n;
    while (n > 0 && curW() + IT(e.id).w <= capW() * 1.15) {
      invAdd(G.inv, e.id, 1);
      n--;
    }
    if (e.n - n > 0) got.push("".concat(IT(e.id).ic).concat(IT(e.id).n).concat(e.n - n > 1 ? "×" + (e.n - n) : ""));
    if (n > 0) left.push({ id: e.id, n });
  }
  return { got, left };
}
function raidMenu(k) {
  const F0 = FACTIONS[k], c = camps()[k], wall = c.wall, need = WALL_BOMBS[wall];
  if (G.time < c.readyAt) return UI.toast("".concat(F0.n, " ещё не оправились после налёта — там пусто (≈").concat(Math.ceil((c.readyAt - G.time) / DAY), " дн.)."));
  const crowbar = G.eq.weapon && IT(G.eq.weapon.id).pry || cnt(G.inv, "crowbar");
  const intel = c.scouted ? "Разведка: охрана ".concat(F0.cnt[0] + (c.raided ? 1 : 0), "–").concat(F0.cnt[1] + (c.raided ? 1 : 0), ", ").concat(WALL_N[wall], ", добыча: ").concat(F0.hint, ".") : "Разведки не было: состав охраны неизвестен.";
  const ch1 = [];
  ch1.push({ t: "🔭 Разведать (".concat(Math.round(F0.mins / 60 * 2 * 10) / 10, " ч туда-обратно)"), fn: () => raidGo(k, "scout") });
  ch1.push({ t: "💣 Взорвать ".concat(WALL_N[wall], " (нужно ").concat(need, " заряд(а), есть ").concat(bombPower(), ")"), fn: () => raidGo(k, "bomb") });
  if (wall === 1) ch1.push({ t: "🪛 Вскрыть монтировкой (тихо, 2 ч".concat(crowbar ? "" : " — нет монтировки", ")"), fn: () => raidGo(k, "pry") });
  ch1.push({ t: "🌙 Пробраться ночью (".concat(isNight() ? "шанс ≈".concat(Math.round(raidSneakChance(k) * 100), "%") : "только ночью", ")"), fn: () => raidGo(k, "sneak") });
  if (typeof FACTION_BOSS !== "undefined" && FACTION_BOSS[k] && c.raided >= 2 && !c.dead) ch1.push({ t: "👑 Бросить вызов главарю: ".concat(ENEMY[FACTION_BOSS[k]].ic, " ").concat(ENEMY[FACTION_BOSS[k]].n), fn: () => bossRaid(k) });
  ch1.push({ t: "Отмена" });
  UI.event({ title: "⚔️ Рейд: ".concat(F0.ic, " ").concat(F0.n), text: "".concat(F0.d, "\n\n🧱 Защита: ").concat(WALL_N[wall]).concat(c.raided ? " · уже грабили: ".concat(c.raided) : "", "\n😠 Злость на тебя: ").concat(Math.round(c.grudge), "/100\n").concat(intel, "\n🚶 Дорога: ~").concat(F0.mins, " мин в одну сторону.\n\nТвоя сила: ").concat(myPower(), " · заряды: ").concat(bombPower()).concat(F0.peaceful ? "\n\n⚠️ Это мирные люди. Совесть тебя не похвалит." : ""), choices: ch1 });
}
function raidSneakChance(k) {
  const c = camps()[k];
  return clamp(stealthChance() - 0.15 * c.wall - (c.raided ? 0.1 : 0) + (G.weather.id === "fog" || G.weather.id === "storm" ? 0.12 : 0), 0.05, 0.85);
}
function raidGo(k, how) {
  const F0 = FACTIONS[k], c = camps()[k], need = WALL_BOMBS[c.wall];
  if (G.dead || G.combat) return;
  if (how === "bomb" && bombPower() < need) return UI.toast("Не хватает взрывчатки: нужно ".concat(need, "."));
  if (how === "pry" && !(G.eq.weapon && IT(G.eq.weapon.id).pry || cnt(G.inv, "crowbar"))) return UI.toast("Нужна монтировка.");
  if (how === "sneak" && !isNight()) return UI.toast("Пробраться можно только ночью (с 21:00 до 6:00).");
  setAct("⚔️ идёт в рейд: ".concat(F0.n));
  G.room = null;
  advance(F0.mins);
  if (G.dead) return;
  const n0 = R(F0.cnt[0], F0.cnt[1]) + (c.raided ? 1 : 0);
  const mk = (n) => {
    const out = [];
    for (let i = 0; i < n; i++) out.push(mkEnemy(F0.en));
    return out;
  };
  const back = (msg, cls) => {
    advance(F0.mins);
    if (G.dead) return;
    G.loc = "base";
    G.traveling = false;
    if (msg) UI.event({ title: "🏚️ Ты вернулся на базу", cls, text: msg, choices: [{ t: "OK" }] });
    save();
    UI.go("loc");
  };
  if (how === "scout") {
    c.scouted = true;
    xp("stealth", 3);
    if (ch(0.25 - skill("stealth") * 0.03)) {
      UI.log("👀 Часовой заметил тебя!", "bad");
      startCombat(mk(Math.min(2, n0)), { road: true, onEnd: (r) => back(r === "win" ? "Отбился от часовых. Охрана теперь начеку, но схему лагеря ты запомнил." : "Еле унёс ноги, но схему лагеря запомнил.") });
      return;
    }
    return back("Ты пролежал в кустах час и всё рассмотрел: охрана ".concat(n0, ", ").concat(WALL_N[c.wall], ", добыча: ").concat(F0.hint, "."));
  }
  let en = mk(n0), note = "";
  if (how === "bomb") {
    useBombs(need);
    noise(60);
    SND("shotgun");
    en.push(mkEnemy(F0.en));
    note = "💥 Взрыв! ".concat(WALL_N[c.wall], " рухнула. Вся охрана бежит к пролому.");
    xp("craft", 4);
  }
  if (how === "pry") {
    advance(120);
    if (G.dead) return;
    if (ch(clamp(stealthChance() - 0.1, 0.1, 0.8))) {
      en = en.slice(0, Math.max(1, Math.ceil(en.length / 2)));
      note = "🪛 Доски частокола тихо поддались. Часть охраны спит.";
      xp("stealth", 4);
    } else note = "🪛 Скрип досок разбудил лагерь!";
  }
  if (how === "sneak") {
    if (ch(raidSneakChance(k))) {
      en = en.slice(0, 1);
      en[0].hp = Math.ceil(en[0].hp * 0.5);
      note = "🌙 Ты перелез через ограду. Не спит только один часовой — и тот клюёт носом.";
      xp("stealth", 6);
    } else {
      note = "🔦 Луч фонаря ударил в лицо. Тревога!";
      en.forEach((e) => e.dist = 2);
    }
  }
  UI.log(note, note.includes("Тревога") || note.includes("разбудил") ? "bad" : "good");
  startCombat(en, { road: true, raid: k, onEnd: (r) => raidAfter(k, r, back) });
}
function raidAfter(k, r, back) {
  const F0 = FACTIONS[k], c = camps()[k], st0 = raidStats();
  if (G.dead) return;
  if (r !== "win") {
    st0.lost++;
    c.grudge = Math.min(100, c.grudge + 20);
    return back(r === "talk" ? "Вы разошлись миром. В этот раз без добычи." : "Рейд сорвался — пришлось бежать без добычи.", "bad");
  }
  const loot = raidLoot(k, c.raided === 0), res = grabLoot(loot);
  st0.won++;
  c.raided++;
  c.readyAt = G.time + 5 * DAY;
  c.grudge = Math.min(100, c.grudge + (F0.peaceful ? 60 : 40));
  c.scouted = false;
  if (c.raided % 2 === 0 && c.wall < 3) c.wall++;
  if (F0.peaceful) G.ch.stress = clamp(G.ch.stress + 20, 0, 100);
  FEED("💣 разграбил лагерь ".concat(F0.ic, " ").concat(F0.n));
  SND("quest");
  xp("surv", 6);
  back("💰 Лагерь ".concat(F0.ic, " ").concat(F0.n, " разграблен!\n\nЗабрал: ").concat(res.got.join(", ") || "ничего — рюкзак полон", ".").concat(res.left.length ? "\nНе унёс: ".concat(res.left.map((e) => IT(e.id).ic + IT(e.id).n).join(", "), ".") : "", "\n\n😠 ").concat(F0.n, " этого не забудут.").concat(shieldLeft() > 0 ? " Пока действует щит новичка (".concat(shieldLeft() === Infinity ? "на Туристе — всегда" : shieldLeft() + " дн.", "), мстить не придут.") : " Жди ответного налёта.").concat(c.wall > FACTIONS[k].tier && c.raided % 2 === 0 ? "\n🧱 Они укрепляются: теперь у них ".concat(WALL_N[c.wall], ".") : ""), "good");
}
function raidDaily() {
  revealCamps();
  const c = camps();
  for (const k2 in c) c[k2].grudge = Math.max(0, c[k2].grudge - 4);
  if (G.w.raidIncoming || shieldLeft() > 0) return;
  const angry = Object.keys(c).filter((k2) => c[k2].grudge >= 50 && !c[k2].dead);
  if (!angry.length || !ch(0.35)) return;
  const k = pick(angry), F0 = FACTIONS[k];
  G.w.raidIncoming = { camp: k, at: Math.max((day() - 1) * DAY + 23 * H, G.time + 3 * H) };
  UI.event({ title: "⚠️ ".concat(F0.ic, " ").concat(F0.n, " идут мстить"), cls: "bad", text: "".concat(G.w.struct.radio ? "📻 Рация поймала их переговоры" : "🔥 С их стороны весь день поднимается дым и слышен стук", " — сегодня ночью (≈23:00) они нападут на твою базу.\n\nОборона базы: ").concat(defense(), " (стены, ловушки, охранники, пёс). Если будешь на базе — встретишь их лично. Если нет — база отобьётся сама или потеряет часть склада."), choices: [{ t: "Готовиться" }] });
}
function raidTick() {
  const inc = G.w.raidIncoming;
  if (!inc || G.time < inc.at || G.combat || G.dead) return;
  if (!worldAuth()) return;
  G.w.raidIncoming = null;
  G.interrupt = true;
  const k = inc.camp, F0 = FACTIONS[k], c = camps()[k], st0 = raidStats();
  const power = 20 + F0.tier * 22 + c.raided * 6 + R(0, 15), def = defense();
  if (atBase()) {
    let n = Math.max(1, R(F0.cnt[0], F0.cnt[1]) + 1 - Math.floor(def / 20));
    UI.log("⚔️ ".concat(F0.ic, " ").concat(F0.n, " у ворот! Оборона сдержала часть нападавших."), "bad");
    const en = [];
    for (let i = 0; i < n; i++) en.push(mkEnemy(F0.en));
    startCombat(en, { road: true, onEnd: (r) => {
      if (r === "win") {
        st0.defended++;
        c.grudge = Math.max(0, c.grudge - 40);
        FEED("🛡️ отбил налёт ".concat(F0.n));
        UI.event({ title: "🛡️ Налёт отбит", cls: "good", text: "".concat(F0.n, " бежали, бросив оружие. Злость их поутихла."), choices: [{ t: "Так им и надо" }] });
      } else raidBaseLoss(k, power - def);
      save();
      UI.render();
    } });
    return;
  }
  if (def >= power) {
    st0.defended++;
    c.grudge = Math.max(0, c.grudge - 30);
    G.w.wallHp = Math.max(1, G.w.wallHp - 20);
    FEED("🛡️ база отбила налёт ".concat(F0.n));
    UI.event({ title: "🛡️ База отбилась", cls: "good", text: "Ночью ".concat(F0.ic, " ").concat(F0.n, " пытались взять твою базу, но укрепления").concat(npcs().some((n) => n.role === "guard") ? " и охрана" : "", " выдержали."), choices: [{ t: "Отлично" }] });
  } else raidBaseLoss(k, power - def);
}
function raidBaseLoss(k, over) {
  const F0 = FACTIONS[k], c = camps()[k], st0 = raidStats();
  st0.fell++;
  c.grudge = 0;
  const lost = [];
  const pool = G.stash.filter((e) => !["quest", "bp", "key"].includes(IT(e.id).c));
  let value = pool.reduce((a, e) => a + IT(e.id).v * e.n, 0) * clamp(0.12 + over / 200, 0.12, 0.25);
  while (value > 0 && pool.length) {
    const e = pick(pool);
    const q = Math.max(1, Math.ceil(e.n / 3));
    take(G.stash, e.id, q);
    value -= IT(e.id).v * q;
    lost.push("".concat(IT(e.id).ic).concat(IT(e.id).n, "×").concat(q));
    pool.splice(pool.indexOf(e), 1);
  }
  const w = wallsHit(25);
  npcs().forEach((n) => n.morale -= 20);
  FEED("🔥 базу разграбили ".concat(F0.n));
  UI.event({ title: "🔥 ".concat(F0.ic, " ").concat(F0.n, " разграбили базу"), cls: "bad", text: "Утащили: ".concat(lost.join(", ") || "почти ничего — склад был пуст", ".").concat(w ? "\n" + w : "", "\n\nОтомстив, они на время успокоились."), choices: [{ t: "Эх…" }] });
}
const PVP = {
  last: 0,
  list: null,
  busy: false,
  async publish(force) {
    if (!window.FB || !FB.init || !G || !G.ch || !force && Date.now() - this.last < 3e5) return;
    this.last = Date.now();
    try {
      await FB.init();
      const db = firebase.database();
      const items = G.stash.filter((e) => !["quest", "bp", "key"].includes(IT(e.id).c)).sort((a, b) => IT(b.id).v * b.n - IT(a.id).v * a.n).slice(0, 24).map((e) => ({ id: e.id, n: e.n }));
      const snap = {
        name: G.ch.name,
        mode: G.mode,
        day: day(),
        def: defense(),
        walls: G.w.struct.walls,
        traps: G.w.struct.traps,
        guards: npcs().filter((n) => n.role === "guard").length,
        dog: !!(G.pet && G.pet.type === "dog"),
        items,
        shield: shieldLeft() > 0,
        wantedUntil: G.wantedUntil || 0,
        coop: G.coop ? G.coop.code : null,
        at: Date.now()
      };
      const ref = db.ref("d/bases/" + FB.uid);
      const old = (await ref.child("lastRaidAt").get()).val();
      await ref.set(Object.assign(snap, { lastRaidAt: old || 0 }));
    } catch (e) {
    }
  },
  async load() {
    if (!window.FB || this.busy) return;
    this.busy = true;
    try {
      await FB.init();
      const s = await firebase.database().ref("d/bases").get();
      const out = [];
      s.forEach((ch2) => {
        const v = ch2.val();
        if (!v || ch2.key === FB.uid) return;
        if (G.coop && v.coop === G.coop.code) return;
        if (Date.now() - (v.at || 0) > 14 * 864e5) return;
        out.push(Object.assign({ uid: ch2.key }, v));
      });
      this.list = out.sort((a, b) => b.day - a.day);
    } catch (e) {
      this.list = [];
    }
    this.busy = false;
    if (UI._st.tab === "base") UI.render();
  },
  canRaid(b) {
    if (Date.now() - (b.lastRaidAt || 0) < 864e5) return "Эту базу уже грабили за последние сутки.";
    const rev = (G.revenge || {})[b.uid] > Date.now();
    if (b.shield && !(b.wantedUntil > Date.now()) && !rev) return "Под щитом новичка.";
    return "";
  },
  menu(b) {
    const err = this.canRaid(b);
    if (err) return UI.toast(err);
    const need = WALL_BOMBS[b.walls || 0];
    const defn = Math.max(1, (b.guards || 0) + 1 + Math.floor((b.traps || 0) / 1));
    UI.event({
      title: "⚔️ База игрока ".concat(b.name),
      cls: "bad",
      text: "".concat(MODES[b.mode] ? MODES[b.mode].ic + " " + MODES[b.mode].n : "", " · день ").concat(b.day, "\n🧱 ").concat(WALL_N[b.walls || 0] || "без стен", " · 🪤 ловушки ").concat(b.traps || 0, " · 🛡️ охранников ").concat(b.guards || 0).concat(b.dog ? " · 🐕 пёс" : "", "\n📦 На складе: ").concat((b.items || []).slice(0, 8).map((e) => IT(e.id) ? IT(e.id).ic : "").join(" "), "…\n\nНужно зарядов: ").concat(need, " (есть ").concat(bombPower(), "). Защитников ≈").concat(defn, ".\nМожно унести не больше 25% ценности склада.\n\n⚠️ Ты получишь метку «В розыске» на 3 дня: твою базу смогут рейдить другие игроки даже под щитом."),
      choices: [{ t: "💣 Начать рейд", fn: () => this.go(b) }, { t: "Отмена" }]
    });
  },
  go(b) {
    const need = WALL_BOMBS[b.walls || 0];
    if (bombPower() < need) return UI.toast("Не хватает взрывчатки: нужно ".concat(need, "."));
    useBombs(need);
    setAct("⚔️ рейдит базу игрока ".concat(b.name));
    advance(120);
    if (G.dead) return;
    G.wantedUntil = Date.now() + 3 * 864e5;
    if (b.traps) {
      hitPlayer(R(4, 8) * b.traps, "lacer", null, "ловушки");
      UI.log("🪤 Ловушки на подходе к базе ".concat(b.name, "!"), "bad");
    }
    const en = [];
    for (let i = 0; i < Math.max(1, b.guards || 0) + (b.walls >= 2 ? 1 : 0); i++) en.push(mkEnemy("baseguard"));
    if (b.dog) en.push(mkEnemy("dog"));
    startCombat(en, { road: true, onEnd: (r) => this.after(b, r) });
  },
  async after(b, r) {
    const st0 = raidStats();
    const home = (txt, cls) => {
      advance(120);
      if (G.dead) return;
      G.loc = "base";
      G.traveling = false;
      UI.event({ title: "🏚️ Ты вернулся на базу", cls, text: txt, choices: [{ t: "OK" }] });
      save();
      this.publish(true);
      UI.go("loc");
    };
    if (r !== "win" || G.dead) {
      st0.lost++;
      return home("Рейд провалился — защитники отбились.", "bad");
    }
    const total = (b.items || []).reduce((a, e) => a + (IT(e.id) ? IT(e.id).v * e.n : 0), 0);
    let budget = total * 0.25;
    const pool = (b.items || []).filter((e) => IT(e.id)).map((e) => ({ id: e.id, n: e.n })), take0 = [];
    while (budget > 0 && pool.length) {
      const e = pick(pool);
      const q = Math.max(1, Math.min(e.n, Math.ceil(budget / IT(e.id).v)));
      take0.push({ id: e.id, n: q });
      budget -= IT(e.id).v * q;
      pool.splice(pool.indexOf(e), 1);
    }
    const res = grabLoot(take0);
    st0.won++;
    FEED("💣 разграбил базу игрока ".concat(b.name));
    try {
      const db = firebase.database();
      await db.ref("d/raids/" + b.uid).push({ from: G.ch.name, uid: FB.uid, items: take0, at: Date.now() });
      await db.ref("d/bases/" + b.uid + "/lastRaidAt").set(Date.now());
    } catch (e) {
    }
    home("💰 База игрока ".concat(b.name, " разграблена!\n\nЗабрал: ").concat(res.got.join(", ") || "ничего — рюкзак полон", ".\n\n🎯 Ты «В розыске» 3 дня — жди ответку."), "good");
  },
  // применяем рейды, которые прошли по нашей базе, пока нас не было
  async inbox() {
    if (!window.FB || !G || !G.ch) return;
    try {
      await FB.init();
      const ref = firebase.database().ref("d/raids/" + FB.uid);
      const s = await ref.get();
      if (!s.exists()) return;
      const reps = [];
      s.forEach((ch2) => {
        reps.push(ch2.val());
      });
      await ref.remove();
      for (const rp of reps) {
        const lost = [];
        for (const e of rp.items || []) {
          const q = Math.min(e.n, cnt(G.stash, e.id));
          if (q > 0) {
            take(G.stash, e.id, q);
            lost.push("".concat(IT(e.id).ic).concat(IT(e.id).n, "×").concat(q));
          }
        }
        raidStats().fell++;
        G.revenge = G.revenge || {};
        G.revenge[rp.uid] = Date.now() + 3 * 864e5;
        UI.event({ title: "🔥 Твою базу разграбил игрок ".concat(rp.from), cls: "bad", text: "Пока тебя не было, ".concat(rp.from, " взорвал(а) вход и вынес(ла) со склада: ").concat(lost.join(", ") || "почти ничего", ".\n\n🎯 3 дня ты можешь отомстить: его база доступна для рейда даже под щитом (База → Рейды)."), choices: [{ t: "Ну держись" }] });
      }
      save();
      this.publish(true);
    } catch (e) {
    }
  }
};
EXTUI.raidPanel = function() {
  const b = UI.btn, c = camps();
  revealCamps();
  const sh = shieldLeft();
  let h = '<div class="sec"><div class="sechead"><h2>⚔️ Рейды</h2>'.concat(wantedNow() ? '<span class="chip bad">🎯 в розыске</span>' : sh > 0 ? '<span class="chip good">🛡️ щит '.concat(sh === Infinity ? "∞" : sh + " дн.", "</span>") : '<span class="chip warn">щита нет</span>', "</div>");
  h += '<p class="muted" style="font-size:13px">Грабь лагеря группировок: разведай, вскрой стену взрывчаткой (верстак: бомба из скотча, металлолома и патронов 12 кал.), монтировкой или пробирайся ночью. Обиженные группировки приходят мстить — но не раньше, чем кончится щит новичка'.concat(G.mode === "tourist" ? " (на Туристе ответных налётов нет, пока ты сам не включишь их)" : "", ".</p>");
  if (G.mode === "tourist") h += '<div class="acts">'.concat(b(G.w.pvpOn ? "🛡️ Выключить налёты на мою базу" : "⚔️ Включить налёты на мою базу", () => {
    G.w.pvpOn = !G.w.pvpOn;
    UI.render();
  }, "sm"), "</div>");
  if (G.w.raidIncoming) {
    const F0 = FACTIONS[G.w.raidIncoming.camp];
    h += '<div class="row hot"><span class="ic">⚠️</span><div class="grow"><span class="t">'.concat(F0.ic, " ").concat(F0.n, ' нападут сегодня ≈23:00</span><span class="s">оборона базы: ').concat(defense(), "</span></div></div>");
  }
  h += '<div class="list">';
  for (const k in FACTIONS) {
    const F0 = FACTIONS[k], s = c[k];
    if (!s.known) {
      h += '<div class="row dim"><span class="ic">❓</span><div class="grow"><span class="t">Неизвестный лагерь</span><span class="s">'.concat({ radio: "узнаешь, когда соберёшь радио", swamp: "узнаешь, побывав на болоте", nii: "узнаешь, добравшись до НИИ" }[F0.reveal] || "", "</span></div></div>");
      continue;
    }
    if (s.dead) {
      h += '<div class="row dim"><span class="ic">'.concat(F0.ic, '</span><div class="grow"><span class="t">').concat(F0.n, '</span><span class="s">👑 главарь повержен — группировка разбежалась</span></div></div>');
      continue;
    }
    const cool = G.time < s.readyAt;
    h += '<div class="row '.concat(s.grudge >= 50 ? "hot" : "", '"><span class="ic">').concat(F0.ic, '</span><div class="grow"><span class="t">').concat(F0.n, " ").concat("⭐".repeat(F0.tier), '</span><span class="s">🧱 ').concat(WALL_N[s.wall], " · добыча: ").concat(F0.hint, " · 😠 ").concat(Math.round(s.grudge)).concat(cool ? " · пусто ещё ".concat(Math.ceil((s.readyAt - G.time) / DAY), " дн.") : "").concat(s.scouted ? " · 🔭 разведано" : "", "</span></div>").concat(b("Рейд", () => raidMenu(k), "sm", cool), "</div>");
  }
  h += "</div>";
  if (window.FB && FB.init) {
    if (!PVP.list && !PVP.busy) PVP.load();
    h += '<div class="sechead"><h3>🏴 Базы других игроков</h3>'.concat(b(PVP.busy ? "…" : "↻", () => PVP.load(), "sm"), "</div>");
    h += '<div class="list">'.concat(PVP.list ? PVP.list.map((p) => {
      const err = PVP.canRaid(p);
      return '<div class="row '.concat(err ? "dim" : "", '"><span class="ic">').concat(p.wantedUntil > Date.now() ? "🎯" : (G.revenge || {})[p.uid] > Date.now() ? "😡" : "🏚️", '</span><div class="grow"><span class="t">').concat(xesc(p.name), " · день ").concat(p.day, '</span><span class="s">🧱 ').concat(WALL_N[p.walls || 0] || "без стен", " · 🛡️ ").concat(p.guards || 0).concat(p.dog ? " · 🐕" : "", " · ").concat(err || "можно рейдить", "</span></div>").concat(b("Рейд", () => PVP.menu(p), "sm", !!err), "</div>");
    }).join("") || '<p class="muted">Других баз пока нет.</p>' : '<p class="muted">Загружаю…</p>', "</div>");
  }
  return h + "</div>";
};
const HINT_KEY = "moti3_hints";
const HINTS = {
  wound: { t: "🩹 Раны и заражение", x: "Любую рану (кроме ушиба и перелома) нужно перевязать — иначе кровит. Грязная повязка из тряпки лучше, чем ничего, но рана может воспалиться.\n\nЧтобы не было заражения крови: обработай рану антисептиком, спиртом или травяным отваром (травы + вода у огня). Если уже воспалилось — антибиотики." },
  thirst: { t: "💧 Где взять воду", x: "Чистую воду дают торговцы и ящики. Грязную можно набрать в колодце деревни или в ручье в лесу и прокипятить на костре или очаге. Морскую — только через опреснитель на базе.\n\nНосит воду бутылка: пустые не выбрасывай." },
  night: { t: "🌙 Ночь", x: "Ночью дороги медленнее и опаснее, а враги злее. Лучше переночевать в укрытии: база, деревня, маяк, метеостанция. Не спится — нажми «⏳ Переждать»." },
  perks: { t: "⭐ Перки", x: "На 2-м и 4-м уровне каждого навыка выбираешь один из двух перков — это развилка пути. Выбор навсегда для этого персонажа, перки видны во вкладке «Тело»." },
  dog: { t: "🐕 Одичавший пёс", x: "Псов можно не только убивать: если в рюкзаке есть мясо или рыба, в бою появится кнопка «🍖 Приманить». Раненый пёс доверяется охотнее. Прирученный кусает врагов, носит вещи и чует засады." },
  car: { t: "🚗 Брошенная машина", x: "Машину на заправке можно починить: нужны набор инструментов, автозапчасти (багажники, ящики с инструментами), металлолом, батарейки и проводка. Бензин — в канистрах. Ездит втрое быстрее, но только по дорогам и громко." },
  npc: { t: "🏘️ Жильцы", x: "Построй нары — и встречные незнакомцы и спасённые раненые смогут поселиться на базе. Каждый приносит пользу по своей роли, но ест и пьёт из склада раз в день. Голодные уходят." },
  season: { t: "📅 Сезоны", x: "Каждые 10 дней сменяется сезон: осень → зима → весна → лето. Зимой больше ешь, в лесу пусто, огород не растёт, но пролив замерзает. Готовь запасы заранее." },
  raids: { t: "⚔️ Рейды", x: "В «Базе» есть вкладка рейдов: лагеря группировок можно разведать и разграбить. Стены вскрывают бомбой (верстак), монтировкой или тихо ночью. Обиженные приходят мстить — но не раньше, чем кончится щит новичка." },
  coop: { t: "🤝 Кооператив", x: "Позови друга: Журнал → Кооператив → «Создать общий мир» → «Пригласить друга». База, склад, время и задания станут общими, а персонажи и рюкзаки — у каждого свои." }
};
function hintsState() {
  try {
    return JSON.parse(localStorage.getItem(HINT_KEY)) || { seen: {}, off: false };
  } catch (e) {
    return { seen: {}, off: false };
  }
}
function hint(id) {
  const st0 = hintsState();
  if (st0.off || st0.seen[id] || !HINTS[id] || !G || G.dead) return;
  st0.seen[id] = Date.now();
  try {
    localStorage.setItem(HINT_KEY, JSON.stringify(st0));
  } catch (e) {
  }
  UI.event({ title: "💡 " + HINTS[id].t, text: HINTS[id].x, choices: [{ t: "Понятно" }, { t: "Больше не показывать подсказки", fn: () => {
    const s1 = hintsState();
    s1.off = true;
    try {
      localStorage.setItem(HINT_KEY, JSON.stringify(s1));
    } catch (e) {
    }
  } }] });
}
function hintsToggle() {
  const s1 = hintsState();
  s1.off = !s1.off;
  if (!s1.off) s1.seen = {};
  try {
    localStorage.setItem(HINT_KEY, JSON.stringify(s1));
  } catch (e) {
  }
  UI.toast(s1.off ? "Подсказки выключены" : "Подсказки включены и сброшены");
  UI.render();
}
