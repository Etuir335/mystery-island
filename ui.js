"use strict";
const UI = /* @__PURE__ */ (() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let ACT = [], MACT = [];
  const a = (fn) => {
    ACT.push(fn);
    return "UI.run(".concat(ACT.length - 1, ")");
  };
  const m = (fn) => {
    MACT.push(fn);
    return "UI.mrun(".concat(MACT.length - 1, ")");
  };
  const st = { tab: "loc", sel: null, open: null, trader: null, ttab: "buy", confirmNew: false, showRules: false };
  let queue = [], cur = null, full = null, toastT = null;
  function run(i) {
    const f = ACT[i];
    if (!f) return;
    if (G && G.dead) {
      deathScreen(G.w.deaths[G.w.deaths.length - 1] || {});
      return;
    }
    f();
    if (G && !G.dead) save();
    render();
  }
  function mrun(i) {
    const f = MACT[i];
    if (!f) return;
    f();
    if (G && !G.dead) save();
  }
  function log(t, c = "") {
    if (!G) return;
    G.log.push({ t, c, d: day(), k: clock() });
    if (G.log.length > 250) G.log.splice(0, G.log.length - 250);
  }
  function toast(t) {
    const el = $("toast");
    el.textContent = t;
    el.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => el.hidden = true, 2400);
  }
  const bar = (v, max = 100, inv) => {
    const p = clamp(v / max * 100, 0, 100);
    const q = inv ? 100 - p : p;
    return '<div class="bar '.concat(q < 25 ? "low" : q < 50 ? "mid" : "", '"><i style="width:').concat(p, '%"></i></div>');
  };
  const btn = (t, fn, cls = "", dis) => '<button class="btn '.concat(cls, '" ').concat(dis ? "disabled" : 'onclick="'.concat(a(fn), '"'), ">").concat(t, "</button>");
  const mbtn = (t, fn, cls = "", dis) => '<button class="btn '.concat(cls, '" ').concat(dis ? "disabled" : 'onclick="'.concat(m(fn), '"'), ">").concat(t, "</button>");
  const itName = (id, n) => "".concat(IT(id).ic, " ").concat(esc(IT(id).n)).concat(n > 1 ? " ×" + n : "");
  const DANGER = ["безопасно", "низкая", "средняя", "высокая"];
  const dangerChip = (d) => '<span class="chip '.concat(d >= 3 ? "bad" : d >= 2 ? "warn" : d ? "" : "good", '">опасность: ').concat(DANGER[d], "</span>");
  function renderTop() {
    const c = G.ch, w = weather(), f = F();
    const toBN = BNP() - (day() - 1) % BNP() - 1;
    const hp = healthPct();
    let ban = "";
    if (emissionSoon()) {
      const L0 = emLocal(), left = Math.max(0, Math.round(L0.ack == null ? Math.max(G.em.next - G.time, emGrace()) : emDue() - G.time));
      const sh = !inShelter() && !G.traveling ? nearestShelter() : null, late = sh && sh.mins > left;
      ban += '<div class="banner embig"><b>🔴 ВЫБРОС '.concat(left > 0 ? "через ~".concat(left >= 90 ? Math.round(left / 6) / 10 + " ч" : left + " мин") : "вот-вот", "!</b> ") + (inShelter() ? "✅ Ты в укрытии — переждёшь." : G.traveling ? "🏃 Ты в пути." : sh ? "Укрытие: ".concat(LOCS[sh.loc].ic, " ").concat(LOCS[sh.loc].n, " — ").concat(sh.mins, " мин").concat(late ? " ⚠️ можешь не успеть!" : "", ' <button class="btn sm pri" onclick="').concat(a(() => {
        if (G.room != null) leaveRoom();
        travel(sh.loc);
      }), '">🏃 Бежать в укрытие</button>') : "Беги в укрытие!") + "</div>";
    } else if (G.w.struct.radio && G.em.next - G.time < 30 * DAY) {
      const t = G.em.next;
      ban += '<div class="banner" style="background:var(--panel2);color:var(--ink)">📻 Прогноз Выброса: день '.concat(Math.floor(t / DAY) + 1, ", ").concat(String(Math.floor(t % DAY / H)).padStart(2, "0"), ":").concat(String(Math.floor(t % H)).padStart(2, "0"), "</div>");
    }
    if (fogEvent()) ban += '<div class="banner" style="background:var(--zone)">🌫️ Туман с тварями: врагов больше обычного.</div>';
    if (isBloodNight()) ban += '<div class="banner">🌕 Кровавая ночь! Заражённые повсюду.</div>';
    const FIX = { "Голод": "eat", "Жажда": "drink", "Кровотечение": "bleed", "Боль": "pain", "Усталость": "sleep" };
    const md = moodles().map((x) => FIX[x.n] ? '<button class="mood l'.concat(x.l, ' fix" title="').concat(esc(x.d), '" onclick="').concat(a(() => quickFix(FIX[x.n])), '">').concat(x.ic, " ").concat(x.n, " ›</button>") : '<span class="mood l'.concat(x.l, '" title="').concat(esc(x.d), '">').concat(x.ic, " ").concat(x.n, "</span>")).join("");
    if (!inShelter() && !G.traveling && (hour() >= 18 && hour() < 21)) {
      const sh = nearestShelter();
      if (sh) ban += '<div class="banner" style="background:var(--warn)">🌇 Скоро ночь. Ближайшее укрытие: '.concat(LOCS[sh.loc].ic, " ").concat(LOCS[sh.loc].n, " (~").concat(sh.mins, " мин)</div>");
    }
    if (typeof uiWide === "function" && uiWide()) {
      $("top").innerHTML = (typeof noEmo === "function" ? noEmo : ((x) => x))(ban);
      $("top").classList.toggle("empty", !ban);
      return;
    }
    $("top").classList.remove("empty");
    const sq = G.coop ? squadStrip() : "";
    $("top").innerHTML = (typeof noEmo === "function" ? noEmo : ((x) => x))('\n      <div class="toprow"><span class="clock">'.concat(clock(), "</span><b>День ").concat(day(), "</b><span>").concat(w.ic, " ").concat(w.n, '</span><span class="opt">').concat(SEASONS[season()].ic, " ").concat(SEASONS[season()].n, '</span><span class="opt">').concat(isNight() ? "🌙 ночь" : "☀️ день", "</span><span>").concat(toBN === 0 ? "🌕 сегодня Кровавая ночь" : '🌕<i class="nel">Кровавая ночь</i> через '.concat(toBN, " дн."), '</span><button class="sndbtn" onclick="').concat(a(() => {
      SFX.toggle();
    }), '" aria-label="Звук">').concat(SFX.on ? "🔊" : "🔇", '<i class="nel">').concat(SFX.on ? "звук" : "без звука", "</i></button><span>💰 ").concat(G.money, "₽</span>").concat(G.coop ? '<span class="'.concat(COOP.status === "online" ? "good" : "warn", '">🤝 ').concat(COOP.others().filter((p) => p.online).length + 1, " в игре").concat(COOP.unread ? " · 💬".concat(COOP.unread) : "", "</span>") : "", '</div>\n      <div class="vitals">\n        <div class="vit">❤️<i class="nel">Здоровье</i> ').concat(hp, "%").concat(bar(hp), '</div><div class="vit">🍗<i class="nel">Еда</i> ').concat(Math.round(c.food)).concat(bar(c.food), '</div>\n        <div class="vit">💧<i class="nel">Вода</i> ').concat(Math.round(c.drink)).concat(bar(c.drink), '</div><div class="vit">⚡<i class="nel">Силы</i> ').concat(Math.round(c.energy)).concat(bar(c.energy), "</div>\n      </div>\n      ").concat(md ? '<div class="moods">'.concat(md, "</div>") : "").concat(typeof CUI !== "undefined" ? CUI.top() : "").concat(sq).concat(ban));
  }
  function stIcon(p) {
    return !p.online ? "💤" : p.alive === false ? "☠️" : p.combat ? "⚔️" : (p.act || "").startsWith("😴") ? "😴" : p.from ? "🚶" : "📍";
  }
  function squadStrip() {
    const ps = COOP.others();
    if (!ps.length) return "";
    return '<div class="squad">'.concat(ps.map((p) => {
      var _a;
      return '<button class="sq '.concat(p.online ? "" : "off", " ").concat(p.combat ? "fight" : "", '" onclick="').concat(a(() => friendSheet(p)), '"><b>').concat(esc(p.name || "Выживший"), "</b> ").concat(stIcon(p), " ").concat(LOCS[p.loc] ? LOCS[p.loc].ic : "", ' <span class="').concat(p.hp < 35 ? "bad" : "", '">❤️').concat((_a = p.hp) != null ? _a : "?", "</span>").concat(p.bleed ? "🩸" : "", "</button>");
    }).join(""), "</div>");
  }
  function friendSheet(p) {
    var _a, _b, _c, _d, _e;
    const L0 = LOCS[p.loc], r = L0 && p.loc !== G.loc ? route(G.loc, p.loc) : null;
    const lines = [
      "".concat(L0 ? L0.ic + " " + L0.n : "—").concat(p.room ? " · " + p.room : "").concat(p.from && LOCS[p.from] ? " (идёт из: ".concat(LOCS[p.from].n, ")") : ""),
      "Сейчас: ".concat(p.act || "—"),
      "❤️ ".concat((_a = p.hp) != null ? _a : "?", "%  🍗 ").concat((_b = p.food) != null ? _b : "?", "  💧 ").concat((_c = p.drink) != null ? _c : "?", "  ⚡ ").concat((_d = p.energy) != null ? _d : "?").concat(p.bleed ? "  🩸 кровотечение!" : ""),
      "Оружие: ".concat(p.wn || "—"),
      p.online ? "В игре · у него день ".concat((_e = p.day) != null ? _e : "?", ", ").concat(p.clock || "") : "Не в игре · был ".concat(ago(p.at))
    ];
    const ch2 = [];
    if (r && r.path.length) ch2.push({ t: "🧭 Идти к нему (~".concat(r.mins, " мин)"), fn: () => goTo(p.loc) });
    if (p.loc === G.loc && p.online) ch2.push({ t: "🎁 Передать вещь", fn: () => giveMenu(p) });
    ch2.push({ t: "📣 Позвать к себе", fn: () => COOP.ping("Иди сюда!") });
    ch2.push({ t: "Закрыть" });
    event({ title: "👤 ".concat(p.name || "Выживший"), text: lines.join("\n"), choices: ch2 });
  }
  function renderTabs() {
    const tabs = [["map", "🗺️", "Карта"], ["loc", "📍", "Место"], ["inv", "🎒", "Вещи"], ["char", "🧍", "Тело"], ["base", "🏚️", "База"], ["jour", "📓", "Журнал"]];
    $("tabs").innerHTML = tabs.map(([k, ic, n]) => '<button class="'.concat(st.tab === k ? "on" : "", '" onclick="').concat(a(() => {
      st.tab = k;
      st.open = null;
      if (k !== "loc") st.trader = null;
    }), '"><span>').concat(ic, "</span>").concat(n, "</button>")).join("");
  }
  function logLast(n = 4) {
    if (typeof UIP !== "undefined") {
      if (!UIP.log) return "";
      n = Math.min(n, UIP.log);
    }
    const L2 = G.log.slice(-n);
    return L2.length ? '<div id="loglast">'.concat(L2.map((x) => '<div class="lg '.concat(x.c, '">').concat(esc(x.t), "</div>")).join(""), "</div>") : "";
  }
  const ISLAND = "M22,7 C40,1 70,3 90,9 C99,19 97,38 93,52 C98,68 93,88 80,95 C60,100 34,97 20,91 C8,85 4,70 6,56 C2,40 5,19 22,7 Z";
  function renderMap() {
    const f = F();
    const sel2 = st.sel || G.loc;
    const near = LOCS[G.loc].links;
    const seen = (id) => !f.fog || G.w.locs[id].seen || near[id] != null || id === G.loc;
    const drawn = /* @__PURE__ */ new Set();
    let lines = "";
    const vis = (id) => !LOCS[id].ch2 || CH2();
    for (const id in LOCS) for (const to in LOCS[id].links) {
      if (!vis(id) || !vis(to)) continue;
      const k = [id, to].sort().join();
      if (drawn.has(k)) continue;
      drawn.add(k);
      const A = LOCS[id], B = LOCS[to];
      const nr = id === G.loc || to === G.loc;
      lines += '<line class="link '.concat(nr ? "near" : "", " ").concat(LOCS[id].boat || LOCS[to].boat ? "sea" : "", '" x1="').concat(A.x, '" y1="').concat(A.y, '" x2="').concat(B.x, '" y2="').concat(B.y, '"/>');
    }
    let nodes = "";
    for (const id in LOCS) {
      if (!vis(id)) continue;
      const l2 = LOCS[id], s2 = seen(id);
      const evs = eventsAt(id);
      if (evs.length && s2) nodes += '<text x="'.concat(l2.x - 6.5, '" y="').concat(l2.y - 2.6, '" style="font-size:3.6px">').concat(EVTS[evs[0].type].ic, "</text>");
      const fr = G.coop ? COOP.others().filter((p) => p.online && p.loc === id) : [];
      fr.forEach((p, k) => {
        nodes += '<text class="fname" x="'.concat(l2.x, '" y="').concat(l2.y - 5.2 - k * 3.2, '">👤').concat(esc((p.name || "").slice(0, 10)), " ").concat(stIcon(p), "</text>");
      });
      if (typeof CUI !== "undefined" && CUI.markNode && s2) nodes += CUI.markNode(id, l2);
      nodes += '<g class="node '.concat(id === G.loc ? "cur" : "", " ").concat(id === sel2 ? "sel" : "", " ").concat(l2.zone ? "zn" : "", '" onclick="').concat(a(() => {
        st.sel = id;
      }), '"><circle cx="').concat(l2.x, '" cy="').concat(l2.y, '" r="3.6"/><text class="emo" x="').concat(l2.x, '" y="').concat(l2.y + 1.4, '">').concat(s2 ? l2.ic : "?", '</text><text x="').concat(l2.x, '" y="').concat(l2.boat ? l2.y - 5 : l2.y + 7.2, '">').concat(s2 ? esc(l2.n) : "???", "</text></g>");
    }
    let grid = "";
    for (let i = 10; i < 100; i += 10) grid += '<line class="grid" x1="'.concat(i, '" y1="0" x2="').concat(i, '" y2="100"/><line class="grid" x1="0" y1="').concat(i, '" x2="100" y2="').concat(i, '"/>');
    const l = LOCS[sel2], s = seen(sel2), ls = G.w.locs[sel2];
    let card = '<div class="sec"><div class="sechead"><h2>'.concat(s ? l.ic + " " + esc(l.n) : "❓ Неизведанное место", "</h2>").concat(sel2 === G.loc ? '<span class="chip good">ты здесь</span>' : "", "</div>");
    if (s) {
      card += '<p class="muted">'.concat(esc(l.d), '</p><div class="acts">');
      if (f.hints >= 1 || ls.seen) card += dangerChip(l.dg);
      if (l.zone && (f.hints >= 1 || ls.seen)) card += '<span class="chip zone">☢ зона '.concat(l.zone, "</span>");
      if (l.shelter) card += '<span class="chip good">укрытие от Выброса</span>';
      if (l.trader) card += '<span class="chip">'.concat(TRADERS[l.trader].ic, " ").concat(TRADERS[l.trader].n, "</span>");
      if (f.hints >= 2) card += '<span class="chip">комнат: '.concat(l.rooms.length, "</span>");
      if (l.lock) card += '<span class="chip '.concat(cnt(G.inv, l.lock) ? "good" : "bad", '">🔒 ').concat(IT(l.lock).n, "</span>");
      if (G.w.corpses.some((x) => x.loc === sel2)) card += '<span class="chip warn">🪦 твоё тело</span>';
      eventsAt(sel2).forEach((ev) => card += '<span class="chip warn">'.concat(EVTS[ev.type].ic, " ").concat(EVTS[ev.type].n, "</span>"));
      card += "</div>";
    } else card += '<p class="muted">Ты ещё не бывал в этой части острова.</p>';
    if (sel2 === G.loc) card += btn("📍 Осмотреться", () => {
      st.tab = "loc";
    }, "pri");
    else if (near[sel2] != null) {
      const err = canTravel(sel2);
      card += '<div class="acts">'.concat(btn("🚶 Идти — ".concat(travelTime(sel2), " мин").concat(isNight() ? " (ночью опаснее)" : ""), () => {
        st.sel = null;
        travel(sel2);
      }, "pri", !!err)).concat(EXTUI.mapDrive(sel2), "</div>").concat(err ? '<p class="bad">'.concat(esc(err), "</p>") : "");
    } else {
      const r = route(G.loc, sel2);
      card += r ? '<p class="muted">Маршрут: '.concat(r.path.map((k) => seen(k) ? LOCS[k].n : "???").join(" → "), " · ~").concat(r.mins, ' мин</p><div class="acts">').concat(btn("🧭 Проложить маршрут", () => {
        st.sel = null;
        goTo(sel2);
      }, "pri", !!canTravel(r.path[0])), "</div>") : '<p class="muted">Сюда пока не пройти.</p>';
    }
    if (sel2 !== G.loc && (G.ch.food < 25 || G.ch.drink < 25)) card += '<p class="warn">⚠️ Мало еды или воды — поешь перед дорогой.</p>';
    card += "</div>";
    return "".concat(tutCard()).concat(logLast(3), '<div class="mapwrap"><svg viewBox="0 0 100 100" role="img" aria-label="Карта острова"><image href="').concat(ART.mapBg(ISLAND, CH2()), '" x="0" y="0" width="100" height="100" preserveAspectRatio="none" style="image-rendering:pixelated"/>').concat(lines).concat(nodes, "</svg></div>").concat(card).concat(typeof CUI !== "undefined" && CUI.markCard && seen(sel2) ? CUI.markCard(sel2) : "");
  }
  function renderLoc() {
    if (st.trader) return renderTrader(st.trader);
    if (G.room != null) return renderRoom();
    const l = L(), ls = G.w.locs[G.loc], f = F();
    const rt = G.route && G.route.length ? '<div class="row evt"><span class="ic">🧭</span><div class="grow"><span class="t">Маршрут: '.concat(LOCS[G.routeDest] ? LOCS[G.routeDest].n : "", '</span><span class="s">дальше → ').concat(LOCS[G.route[0]].ic, " ").concat(LOCS[G.route[0]].n, " (~").concat(travelTime(G.route[0]), " мин) · осталось переходов: ").concat(G.route.length, '</span></div><div class="acts">').concat(btn("Продолжить", continueRoute, "pri sm")).concat(btn("✕", cancelRoute, "sm"), "</div></div>") : "";
    let h = "".concat(ART.sceneTag({ loc: G.loc, key: G.loc, alt: l.n, camp: campHere() })).concat(rt).concat(tutCard()).concat(logLast(), '<div class="sec"><div class="eyebrow">').concat(l.zone ? "☢ аномальная зона ".concat(l.zone, " · ") : "").concat(l.shelter ? "укрытие · " : "", "опасность: ").concat(DANGER[l.dg], "</div><h1>").concat(l.ic, " ").concat(esc(l.n), '</h1><p class="muted">').concat(esc(l.d), "</p></div>");
    h += '<div class="sechead"><div class="toggle"><button class="'.concat(!G.sneak ? "on" : "", '" onclick="').concat(a(() => G.sneak = false), '">🚶 Обычно</button><button class="').concat(G.sneak ? "on" : "", '" onclick="').concat(a(() => G.sneak = true), '">🐾 Крадучись</button></div><span class="mono muted">🔊 шум ').concat(Math.round(G.noise), "</span></div>");
    const acts = [], res = [];
    if (l.base) acts.push(btn("🏚️ Открыть базу", () => {
      st.tab = "base";
    }, "pri"));
    if (l.water) {
      const b = cnt(G.inv, "bottle");
      const noD = l.water === "sea" && !(l.base && G.w.struct.distill);
      res.push(btn("".concat({ sea: "🌊 Набрать морской воды", well: "🪣 Вода из колодца", stream: "💧 Вода из ручья" }[l.water], " (🍶").concat(b, ")").concat(noD ? " — нужен опреснитель" : ""), collectWater, "", !b || noD));
    }
    if (l.fish) res.push(btn("🎣 Рыбачить (1 ч)", doFish, "", !cnt(G.inv, "rod")));
    if (l.forage) res.push(btn("🌿 Собирать (40 мин)", doForage));
    if (l.hunt) res.push(btn("🦌 Охотиться (1.5 ч)", doHunt));
    if (l.forage) res.push(btn("🪓 Рубить дрова", doChop, "", !(G.eq.weapon && IT(G.eq.weapon.id).chop)));
    if (l.shelter && !l.base) acts.push(btn("😴 Переночевать", () => sleepHere()));
    if (l.shelter) acts.push(btn("⏳ Переждать 1 ч", () => waitHere(1)));
    if (!l.base) acts.push(campHere() ? btn("🔥 Костёр (".concat(G.campfire.until - G.time, " мин) — готовить"), () => {
      st.tab = "inv";
      st.scrollCraft = true;
    }) : btn("🔥 Развести костёр", makeCamp, "", !cnt(G.inv, "lighter") || cnt(G.inv, "wood") < 2));
    acts.push(btn("🔨 Крафт", () => {
      st.tab = "inv";
      st.scrollCraft = true;
    }));
    if (res.length) h += '<div class="grp"><div class="grph">Ресурсы</div><div class="acts">'.concat(res.join(""), "</div></div>");
    if (acts.length) h += '<div class="grp"><div class="grph">Лагерь</div><div class="acts">'.concat(acts.join(""), "</div></div>");
    const here0 = h.length;
    h += EXTUI.locRows();
    if (typeof CUI !== "undefined" && CUI.ground) h += CUI.ground();
    for (const ev of eventsAt(G.loc)) {
      const E = EVTS[ev.type], left = Math.ceil((ev.until - G.time) / H);
      if (ev.type === "drop") h += '<div class="row evt"><span class="ic">'.concat(E.ic, '</span><div class="grow"><span class="t">Контейнер гуманитарки</span><span class="s">ещё ~').concat(left, " ч").concat(ev.checked ? "" : " · возможно, рядом мародёры", "</span></div>").concat(btn("Вскрыть (20 мин)", () => openDrop(ev), "pri sm"), "</div>");
      if (ev.type === "nomad") h += '<div class="row evt"><span class="ic">'.concat(E.ic, '</span><div class="grow"><span class="t">Кочевой торговец</span><span class="s">редкие товары · уйдёт через ~').concat(left, " ч</span></div>").concat(btn("Торговать", () => {
        st.trader = "nomad";
        st.ttab = "buy";
      }, "pri sm"), "</div>");
      if (ev.type === "camp") {
        const n = ev.en.filter((e) => e.hp > 0).length;
        h += '<div class="row evt hot"><span class="ic">'.concat(E.ic, '</span><div class="grow"><span class="t">Лагерь мародёров</span><span class="s">').concat(ev.cleared ? "зачищен — можно обыскать" : "часовых: ".concat(n, " · ещё ~").concat(left, " ч"), '</span></div><div class="acts">').concat(ev.cleared ? btn("Обыскать", () => campLoot(ev), "pri sm") : btn("⚔️ Напасть", () => campAttack(ev), "bad sm") + (ev.stolen ? "" : btn("🐾 Украсть (".concat(Math.round(stealthChance() * 80), "%)"), () => campSteal(ev), "sm")), "</div></div>");
      }
    }
    if (G.coop) Object.values(COOP.fights).filter((f2) => f2 && !f2.ended && f2.owner && f2.owner !== COOP.uid && f2.loc === G.loc && Date.now() - (f2.at || 0) < 18e4).forEach((f2) => {
      h += '<div class="row hot"><span class="ic">⚔️</span><div class="grow"><span class="t">'.concat(esc(f2.name), " в бою").concat(f2.room ? " · " + esc(f2.room) : "", '</span><span class="s">врагов: ').concat((f2.en || []).filter((e) => e.hp > 0).length, " · ход ").concat(f2.turn).concat((f2.allies || []).length ? " · уже помогают" : "", "</span></div>").concat(btn("⚔️ Вступить в бой", () => COOP.joinFight(f2.owner), "pri sm", !!G.combat), "</div>");
    });
    if (G.coop) COOP.here().forEach((p) => {
      h += '<div class="row"><span class="ic">👤</span><div class="grow"><span class="t">'.concat(esc(p.name), ' рядом</span><span class="s">❤️ ').concat(p.hp, "% · поможет в бою (").concat(esc(p.wn || "оружие"), ")</span></div>").concat(btn("🎁 Передать", () => giveMenu(p), "sm"), "</div>");
    });
    G.w.corpses.forEach((c, i) => {
      if (c.loc === G.loc) h += '<div class="row hot"><span class="ic">🪦</span><div class="grow"><span class="t">Тело: '.concat(esc(c.name), '</span><span class="s">').concat(c.items.length, " вещей</span></div>").concat(btn("Забрать всё", () => lootCorpse(i), "pri sm"), "</div>");
    });
    if (h.length > here0) h = h.slice(0, here0) + '<div class="grp"><div class="grph">Здесь сейчас</div>' + h.slice(here0) + "</div>";
    h += '<div class="sec"><h2>Помещения</h2><div class="list">';
    l.rooms.forEach((r, i) => {
      const s = ls.rooms[i];
      const chips = [];
      if (r.trader) chips.push('<span class="chip good">'.concat(TRADERS[r.trader].ic, " торговец</span>"));
      if (r.safe && !r.trader) chips.push('<span class="chip good">безопасно</span>');
      if (r.lock && !s.open) chips.push('<span class="chip bad">🔒 '.concat(r.lock === "pry" ? "заперто" : IT(r.lock).n, "</span>"));
      const alive = s.en.filter((e) => e.hp > 0).length;
      if (alive && s.enAt > -1e8) chips.push('<span class="chip bad">враги: '.concat(alive, "</span>"));
      if (r.anom) chips.push('<span class="chip zone">☢ аномалии'.concat(s.an ? " ".concat(s.an.filter((x) => x.found).length, "/").concat(s.an.length) : "", "</span>"));
      if (r.cont && r.cont.length) {
        const done = r.cont.filter((_, k) => s.cont[k] != null && !contReadyAt(i, k)).length;
        chips.push('<span class="chip">обыскано '.concat(done, "/").concat(r.cont.length, "</span>"));
      }
      if (r.final) chips.push('<span class="chip zone">???</span>');
      h += '<div class="row '.concat(alive ? "hot" : "", '"><div class="grow"><span class="t">').concat(esc(r.n), '</span><span class="acts">').concat(chips.join(""), "</span></div>").concat(btn("Войти", () => enterRoom(i), "sm"), "</div>");
    });
    h += "</div></div>";
    return h;
  }
  function tutCard() {
    const t = tutState();
    if (!t) return "";
    const dots = TUT.map((s, i) => '<i class="'.concat(G.tut.done[s.id] ? "on" : s === t.cur ? "cur" : "", '"></i>')).join("");
    return '<div class="tut"><div class="sechead"><span class="eyebrow">🎓 Первый день · выполнено '.concat(t.n, " из ").concat(TUT.length, "</span>").concat(btn("Скрыть", () => {
      G.tut.on = false;
    }, "sm"), '</div><div class="tutt">').concat(esc(t.cur.t), '</div><div class="muted" style="font-size:13px">').concat(esc(t.cur.h), '</div><div class="dots">').concat(dots, "</div></div>");
  }
  function contReadyAt(i, k) {
    const s = roomSt(i), d = roomDef(i);
    if (s.cont[k] == null) return true;
    if (d.once || LOCS[G.loc].base) return false;
    return G.time - s.cont[k] > 72 * H;
  }
  function renderRoom() {
    const i = G.room, d = roomDef(i), s = roomSt(i);
    let h = "".concat(ART.sceneTag({ loc: G.loc, room: d.n, key: G.loc + ":" + i, alt: d.n })).concat(logLast(), '<div class="sechead"><h1>').concat(esc(d.n), "</h1>").concat(btn("↩ Выйти", leaveRoom, "sm"), "</div>");
    if (d.trader) h += '<div class="row"><span class="ic">'.concat(TRADERS[d.trader].ic, '</span><div class="grow"><span class="t">').concat(TRADERS[d.trader].n, '</span><span class="s">').concat(esc(TRADERS[d.trader].d), "</span></div>").concat(btn("Говорить", () => {
      st.trader = d.trader;
      st.ttab = "quest";
    }, "pri sm"), "</div>");
    const alive = s.en.filter((e) => e.hp > 0);
    if (alive.length) {
      h += '<div class="sec"><h2 class="bad">Враги</h2><p class="muted">'.concat(s.aware ? "Они знают, что ты здесь." : "🐾 Тебя не заметили. Каждое действие может выдать тебя — тише, если крадёшься.", '</p><div class="list">');
      s.en.forEach((e, k) => {
        if (e.hp <= 0) return;
        const D = ENEMY[e.id];
        h += '<div class="row hot">'.concat(ART.enemyImg(e.id), '<div class="grow"><span class="t">').concat(D.n).concat(e.gear ? " (".concat(IT(e.gear).n, ")") : "", '</span><span class="s">❤️ ').concat(Math.max(0, Math.round(e.hp)), "/").concat(e.max, "</span></div>").concat(!s.aware ? btn("🗡️ Из засады", () => sneakAttack(k), "pri sm") : "", "</div>");
      });
      h += '</div><div class="acts">'.concat(btn("⚔️ Напасть открыто", () => {
        s.aware = true;
        startCombat(s.en, { room: i });
      }, "bad"), "</div></div>");
    }
    if (s.an) {
      const found = s.an.filter((x) => x.found);
      h += '<div class="sec"><h2 class="zone">☢ Аномалии</h2><p class="muted">'.concat(found.length ? "Обнаружены: " + found.map((x) => ANOM[x.t].ic + " " + ANOM[x.t].n).join(", ") + ". " : "").concat(s.an.length - found.length ? "Ещё скрыто: ".concat(s.an.length - found.length, ". Любое действие здесь может завести тебя в аномалию.") : "Все аномалии найдены — путь безопасен.", "</p>");
      if (s.art) h += '<p class="good">✨ '.concat(cnt(G.inv, "detector") ? "Детектор пищит: ".concat(IT(s.art).ic, " ").concat(IT(s.art).n) : "Между аномалиями что-то мерцает — артефакт!", "</p>");
      h += '<div class="acts">'.concat(btn("🔩 Бросить болт (".concat(cnt(G.inv, "bolts"), ")"), throwBolt, "", !cnt(G.inv, "bolts") || found.length === s.an.length)).concat(s.art ? btn("✨ Достать артефакт".concat(s.an.length - found.length ? " (риск ".concat(Math.round((1 - Math.pow(0.65, s.an.length - found.length)) * 100), "%)") : ""), grabArtifact, "pri") : "", "</div></div>");
    }
    if (d.cont && d.cont.length) {
      const readyN = d.cont.filter((_, k) => contReadyAt(i, k)).length;
      h += '<div class="sec"><div class="sechead"><h2>Обыскать</h2>'.concat(readyN >= 2 ? btn("🔍 Обыскать всё (".concat(readyN, ")"), searchAll, "sm pri") : "", '</div><div class="list">');
      d.cont.forEach((ct, k) => {
        const C = CONT[ct], ready = contReadyAt(i, k), was = s.cont[k] != null;
        const sub = ready ? "~".concat(searchTime(ct, d), " мин").concat(was ? " · снова, но меньше" : "").concat(d.dark && isNight() && !cnt(G.inv, "flash") ? " · темно, нужен фонарик" : "") : d.once || L().base ? "пусто" : "обыскано · пополнится через ".concat(Math.ceil((72 * H - (G.time - s.cont[k])) / H), " ч");
        h += '<div class="row '.concat(ready ? "" : "dim", '"><span class="ic">').concat(C.ic, '</span><div class="grow"><span class="t">').concat(C.n, '</span><span class="s">').concat(sub, "</span></div>").concat(btn("Обыскать", () => searchCont(k), "sm", !ready), "</div>");
      });
      h += "</div></div>";
    }
    if (s.ground.length) {
      h += '<div class="sec"><div class="sechead"><h2>На земле</h2>'.concat(btn("Забрать всё", takeAllGround, "sm pri"), '</div><div class="list">');
      s.ground.forEach((e, k) => {
        h += '<div class="row">'.concat(ART.tile(e.id), '<div class="grow"><span class="t">').concat(esc(IT(e.id).n)).concat(e.n > 1 ? " ×" + e.n : "", '</span><span class="s">').concat((IT(e.id).w * e.n).toFixed(1), " кг</span></div>").concat(btn("Взять", () => takeGround(k), "sm"), "</div>");
      });
      h += "</div></div>";
    }
    if (d.final && !alive.length) h += renderApparatus();
    if (d.final2 && !alive.length) h += renderSpire();
    if (!alive.length && !s.an && !(d.cont && d.cont.length) && !d.trader && !d.final && !d.final2) h += '<p class="muted">Здесь пусто.</p>';
    return h;
  }
  function renderSpire() {
    if (G.w.ch2 && G.w.ch2.end) return '<div class="note">💠 '.concat(G.w.ch2.end === "seal" ? "Шпиль погас. Сердце острова спит, и ядро спит вместе с ним." : "Шпиль светит ровно и спокойно — он узнаёт тебя. Ты Мастер острова.", "</div>");
    if (!G.w.flags.keeper_dead) return "";
    return '<div class="sec"><h2 class="zone">💠 Сердце острова</h2><p>Хранитель рассыпался осколками. В центре Шпиля, в коконе из кристаллов, бьётся Сердце — огромный синий камень. Ядро в двигателе твоей лодки отзывается ему через весь остров.</p>\n      <div class="choices">'.concat(btn("🌙 Вернуть ядро к Сердцу. Пусть остров уснёт — навсегда.", () => ending2("seal"), "pri")).concat(btn("💠 Забрать Сердце. Остров будет слушаться тебя.", () => ending2("rule"))).concat(btn("↩ Уйти и подумать", () => leaveRoom()), "</div></div>");
  }
  function renderApparatus() {
    if (G.w.ending) return '<div class="note">🔮 Аппарат '.concat(G.w.ending === "silence" ? "молчит. Остров затих." : "мёртв без ядра — но ядро тихо гудит в твоём рюкзаке.", "</div>");
    return '<div class="sec"><h2 class="zone">🔮 Аппарат</h2><p>Посреди зала — машина размером с дом. По кабелям течёт синий свет. В центре пульсирует ядро. От него по коже бегут мурашки, и ты понимаешь: Выбросы рождаются здесь.</p>\n      <div class="choices">'.concat(btn("⏹️ Вынуть ядро и разбить. Пусть остров затихнет.", () => apparatus("off"), "pri")).concat(btn("🔮 Забрать ядро себе. Посмотрим, на что оно способно.", () => apparatus("take"))).concat(btn("↩ Уйти и подумать", leaveRoom), "</div></div>");
  }
  function lockMenu(i) {
    const d = roomDef(i), opts = [];
    if (d.lock !== "pry" && cnt(G.inv, d.lock)) opts.push({ t: "🔑 Открыть ключом (".concat(IT(d.lock).n, ")"), fn: () => openLock(i, "key") });
    if (d.lock === "pry") {
      if (G.eq.weapon && IT(G.eq.weapon.id).pry || cnt(G.inv, "crowbar")) opts.push({ t: "🪛 Вскрыть монтировкой (громко)", fn: () => openLock(i, "pry") });
      if (cnt(G.inv, "picks")) opts.push({ t: "🗝️ Вскрыть отмычками (тихо, может не выйти)", fn: () => openLock(i, "picks") });
    }
    opts.push({ t: "Уйти" });
    event({ title: "🔒 ".concat(d.n), text: d.lock === "pry" ? "Дверь заперта. Нужна монтировка или отмычки." : "Заперто. Нужен ключ: ".concat(IT(d.lock).ic, " ").concat(IT(d.lock).n, "."), choices: opts });
  }
  function renderTrader(tid) {
    const T = TRADERS[tid];
    const rep = G.w.rep[tid] || 0;
    let h = '<div class="sechead"><h1>'.concat(T.ic, " ").concat(T.n, "</h1>").concat(btn("↩ Назад", () => {
      st.trader = null;
    }, "sm"), '</div><p class="muted">').concat(esc(T.d), '</p><div class="toprow"><span>⭐ репутация <b>').concat(rep, "</b></span><span>💰 <b>").concat(G.money, "₽</b></span></div>");
    const noQ = tid === "nomad" || tid === "settle";
    if (noQ && st.ttab === "quest") st.ttab = "buy";
    h += '<div class="toggle">'.concat((noQ ? [["buy", "Купить"], ["sell", "Продать"]] : [["quest", "Задания"], ["buy", "Купить"], ["sell", "Продать"]]).map(([k, n]) => '<button class="'.concat(st.ttab === k ? "on" : "", '" onclick="').concat(a(() => st.ttab = k), '">').concat(n, "</button>")).join(""), "</div>");
    if (st.ttab === "buy") {
      h += '<div class="list">' + T.stock.map(([id, tier]) => {
        const p = buyPrice(tid, id), lock = rep < tier;
        const n = IT(id).c === "ammo" || id === "bolts" ? 10 : 1;
        return '<div class="row '.concat(lock ? "dim" : "", '">').concat(ART.tile(id), '<div class="grow"><span class="t">').concat(esc(IT(id).n)).concat(n > 1 ? " ×" + n : "", '</span><span class="s">').concat(lock ? "🔒 нужна репутация ".concat(tier) : "".concat(IT(id).w, " кг"), "</span></div>").concat(btn("".concat(p, "₽"), () => buy(tid, id), "sm", lock || G.money < p), "</div>");
      }).join("") + "</div>";
    } else if (st.ttab === "sell") {
      const items = G.inv.filter((e) => sellPrice(tid, e.id) > 0);
      h += items.length ? '<div class="list">' + items.map((e) => {
        const p = sellPrice(tid, e.id);
        return '<div class="row">'.concat(ART.tile(e.id), '<div class="grow"><span class="t">').concat(esc(IT(e.id).n)).concat(e.n > 1 ? " ×" + e.n : "", '</span><span class="s">').concat(p, '₽ за шт.</span></div><div class="acts">').concat(btn("+".concat(p, "₽"), () => sell(tid, e, false), "sm")).concat(e.n > 1 ? btn("все +".concat(p * e.n, "₽"), () => sell(tid, e, true), "sm") : "", "</div></div>");
      }).join("") + "</div>" : '<p class="muted">Ему нечего у тебя купить.</p>';
    } else {
      const qs = T.quests.filter((q) => !QUESTS[q].ch2 || CH2());
      const nextQ = qs.find((q) => G.w.quests[q] !== "done");
      qs.filter((q) => G.w.quests[q] === "done").forEach((q) => h += '<div class="row dim"><span class="ic">✅</span><div class="grow"><span class="t">'.concat(QUESTS[q].n, "</span></div></div>"));
      if (!nextQ) h += '<p class="muted">«Больше просить не о чем. Спасибо тебе.»</p>';
      else {
        const Q = QUESTS[nextQ], act = G.w.quests[nextQ] === "active";
        h += '<div class="row"><span class="ic">📜</span><div class="grow"><span class="t">'.concat(Q.n, '</span><span class="s">«').concat(esc(Q.d), "»</span>").concat(act ? '<span class="s">Прогресс: '.concat(questProgress(nextQ), "</span>") : "", '<span class="s">Награда: ').concat([Q.rew.money ? Q.rew.money + "₽" : "", ...Object.entries(Q.rew.items || {}).map(([k, v]) => itName(k, v))].filter(Boolean).join(", "), "</span></div>").concat(act ? btn("Сдать", () => turnIn(nextQ), "pri sm", !questDone(nextQ)) : btn("Взять", () => acceptQuest(nextQ), "pri sm"), "</div>");
      }
    }
    if (st.ttab === "quest" && typeof CUI !== "undefined") h += CUI.contracts(tid);
    return h;
  }
  const CAT_ORDER = ["money", "gun", "melee", "mod", "ammo", "med", "food", "drink", "wear", "art", "tool", "key", "quest", "bp", "mat", "val"];
  const CAT_N = { money: "Касса", mod: "Модули оружия", gun: "Оружие", melee: "Оружие", ammo: "Патроны", med: "Медицина", food: "Еда", drink: "Питьё", wear: "Снаряжение", art: "Артефакты", tool: "Инструменты", key: "Ключи", quest: "Сюжетное", bp: "Чертежи", mat: "Материалы", val: "Ценности" };
  function itemSub(e) {
    const it = IT(e.id), p = [];
    p.push("".concat((it.w * e.n).toFixed(it.w * e.n < 1 ? 2 : 1), " кг"));
    if (e.dur != null && it.dur) p.push("прочность ".concat(Math.round(e.dur / it.dur * 100), "%"));
    if (e.uses != null && it.uses) p.push("ещё ".concat(e.uses, " раз"));
    if (it.sp && F().spoil) {
      const fr = freshness(e);
      p.push(fr >= 1 ? '<span class="bad">испорчено</span>' : fr >= 0.7 ? '<span class="warn">скоро испортится</span>' : "свежее");
    }
    if (it.f || it.d) p.push("".concat(it.f ? "🍗+" + it.f : "", " ").concat(it.d ? "💧+" + it.d : "").trim());
    if (it.raw) p.push('<span class="warn">лучше приготовить</span>');
    if (it.dmg) p.push("урон ".concat(it.dmg[0], "–").concat(it.dmg[1]));
    if (it.c === "gun") p.push("".concat(IT(it.ammo).ic, " ").concat(IT(it.ammo).n, ": ").concat(cnt(G.inv, it.ammo)));
    if (it.arm) p.push("броня +".concat(it.arm));
    if (it.warm) p.push("тепло +".concat(it.warm));
    if (it.cap) p.push("+".concat(it.cap, " кг"));
    if (it.d && it.c === "art") p.push(esc(it.d));
    if (it.info) p.push(esc(it.info));
    if (typeof CUI !== "undefined" && CUI.itemExtra) p.push(...CUI.itemExtra(e));
    if (e.mods && e.mods.length) p.push("🔧 " + e.mods.map((m2) => IT(m2).ic + IT(m2).n).join(", "));
    return p.join(" · ");
  }
  function itemActs(e, where) {
    const it = IT(e.id), out = [];
    if (where === "inv") {
      if (it.c === "food" || it.c === "drink") out.push(btn(it.c === "drink" ? "Выпить" : it.smoke ? "Закурить" : "Съесть", () => useItem(e.id), "pri sm"));
      if (it.c === "med") out.push(btn("Использовать", () => useItem(e.id), "pri sm"));
      if (it.c === "bp") out.push(btn("Изучить", () => useItem(e.id), "pri sm"));
      if (["melee", "gun", "wear", "art"].includes(it.c)) out.push(btn("Надеть", () => equip(e), "pri sm"));
      if (it.c === "mod" && typeof CUI !== "undefined") out.push(CUI.modBtn(e));
      if (typeof CUI !== "undefined" && CUI.quickCraft) out.push(CUI.quickCraft(e));
      if (atBase()) out.push(btn(e.n > 1 ? "На склад все" : "На склад", () => toStash(e)), e.n > 1 ? btn("На склад 1", () => toStash(e, 1), "sm") : "");
      if (IT(e.id).btl) out.push(btn("🫗 Вылить", () => pourOut(e.id), "sm"));
      if (e.n > 1) out.push(btn(G.room != null ? "Бросить 1" : "Выбросить 1", () => {
        drop(e, 1);
      }, "sm"));
      out.push(btn(G.room != null ? e.n > 1 ? "Бросить все" : "Бросить" : e.n > 1 ? "Выбросить все" : "Выбросить", () => {
        drop(e);
      }, "sm"));
    } else out.push(btn(e.n > 1 ? "Взять все" : "Взять", () => fromStash(e), "pri sm"), e.n > 1 ? btn("Взять 1", () => fromStash(e, 1), "sm") : "", it.c === "food" || it.c === "drink" || it.c === "med" ? btn("Использовать", () => useItem(e.id), "sm") : "");
    if (typeof CUI !== "undefined" && CUI.salvageBtn) out.push(CUI.salvageBtn(e, where));
    return out.join("");
  }
  function itemList(list, where) {
    const so = st.isort || "cat", W = (e) => (IT(e.id).w || 0) * (e.n || 1), V = (e) => (IT(e.id).v || 0) * (e.n || 1);
    const byName = (x, y) => IT(x.id).n.localeCompare(IT(y.id).n);
    const sorted = list.slice().sort(so === "w" ? (x, y) => W(y) - W(x) || byName(x, y) : so === "v" ? (x, y) => V(y) - V(x) || byName(x, y) : so === "n" ? byName : (x, y) => CAT_ORDER.indexOf(IT(x.id).c) - CAT_ORDER.indexOf(IT(y.id).c) || byName(x, y));
    const fold = st.fold || (st.fold = {}), grp = {};
    if (so === "cat") sorted.forEach((e) => {
      const c = CAT_N[IT(e.id).c];
      grp[c] = grp[c] || { n: 0, w: 0 };
      grp[c].n++;
      grp[c].w += W(e);
    });
    let h = "", lastCat = "";
    sorted.forEach((e) => {
      const it = IT(e.id), key = where + list.indexOf(e);
      if (so === "cat" && CAT_N[it.c] !== lastCat) {
        lastCat = CAT_N[it.c];
        const fk = where + ":" + lastCat;
        h += '<div class="eyebrow fold '.concat(fold[fk] ? "closed" : "", '" onclick="').concat(a(() => {
          fold[fk] = !fold[fk];
        }), '">').concat(lastCat, '<span class="n">').concat(grp[lastCat].n, " · ").concat(grp[lastCat].w.toFixed(1), " кг</span></div>");
      }
      if (so === "cat" && fold[where + ":" + lastCat]) return;
      const open = st.open === key;
      h += '<div class="row" style="flex-wrap:wrap">'.concat(ART.tile(e.id), '<div class="grow" onclick="').concat(a(() => st.open = open ? null : key), '" style="cursor:pointer"><span class="t">').concat(esc(it.n)).concat(e.n > 1 ? " ×" + e.n : "", '</span><span class="s">').concat(itemSub(e), "</span></div>").concat(st.xfer && atBase() && !open ? where === "stash" ? btn("⬆️ Взять", () => fromStash(e), "sm pri") + (e.n > 1 ? btn("1", () => fromStash(e, 1), "sm") : "") : btn("⬇️ На склад", () => toStash(e), "sm pri") + (e.n > 1 ? btn("1", () => toStash(e, 1), "sm") : "") : "").concat(open ? "".concat(typeof CUI !== "undefined" && CUI.itemDesc ? '<div class="idesc">'.concat(CUI.itemDesc(e), "</div>") : "", '<div class="acts" style="width:100%">').concat(itemActs(e, where), "</div>") : '<button class="btn sm" onclick="'.concat(a(() => st.open = key), '">⋯</button>'), "</div>");
    });
    return h || '<p class="muted">Пусто.</p>';
  }
  const canMake = (r) => Math.min(30, ...Object.entries(r.need).map(([k, v]) => Math.floor(allCnt(k) / v)));
  function subBar(key, items, def) {
    const cur2 = st[key] || def;
    return '<div class="toggle subtabs">'.concat(items.map(([k, n, dis]) => '<button class="'.concat(cur2 === k ? "on" : "", '" ').concat(dis ? "disabled" : "", ' onclick="').concat(a(() => {
      st[key] = k;
      st.lastTab = null;
    }), '">').concat(n, "</button>")).join(""), "</div>");
  }
  function quickBar() {
    const w = curW(), cap = capW(), c = G.ch, b = [];
    b.push('<span class="mono '.concat(w > cap ? "bad" : "muted", '">⚖️ ').concat(w.toFixed(1), "/").concat(cap, " кг</span>"));
    if (atBase()) b.push(btn("📦 Сложить материалы", stashAllMats, "sm"));
    return '<div class="quick">'.concat(b.join(""), "</div>");
  }
  function workshop() {
    const rs = RECIPES.map((r) => ({ r, w: recipeState(r) })).filter((x) => x.w !== "bp").sort((x, y) => (x.w ? 1 : 0) - (y.w ? 1 : 0));
    return '<div class="sec"><h2>Мастерская</h2><div class="list">'.concat(rs.map(({ r, w }) => '<div class="row '.concat(w ? "dim" : "", '"><div class="grow"><span class="t">').concat(esc(r.n), '</span><span class="s">').concat(Object.entries(r.need).map(([k, v]) => "".concat(IT(k).ic).concat(IT(k).n, " ").concat(allCnt(k), "/").concat(v)).join(", ")).concat(r.st ? " · нужен ".concat(STATION_N[r.st]) : "", " · ").concat(r.t, ' мин</span></div><div class="acts">').concat(btn("Сделать", () => craft(r), "sm", !!w)).concat(!w && canMake(r) > 1 ? btn("×".concat(canMake(r)), () => craftMax(r), "sm") : "", "</div></div>")).join(""), '</div><p class="muted" style="font-size:13px">Чертежи из лута открывают новые постройки и рецепты. Изучи чертёж в рюкзаке.</p></div>');
  }
  const INV_FL = { all: ["Всё", null], food: ["Еда", ["food", "drink"]], med: ["Медицина", ["med"]], war: ["Оружие", ["melee", "gun", "ammo", "wear", "mod"]], mat: ["Прочее", ["mat", "tool", "bp", "key", "quest", "val", "art"]] };
  function filtered(list, key) {
    const f = INV_FL[st[key] || "all"] || INV_FL.all;
    const q = String(st[key + "q"] || "").trim().toLowerCase();
    let shown = f[1] ? list.filter((e) => f[1].includes(IT(e.id).c)) : list;
    if (q) shown = shown.filter((e) => IT(e.id).n.toLowerCase().includes(q));
    return (list.length > 6 ? '<input type="search" id="q_'.concat(key, '" placeholder="🔎 найти…" value="').concat(esc(st[key + "q"] || ""), '" oninput="UI._st[\'').concat(key, 'q\']=this.value; UI.render()" style="width:100%;margin-bottom:6px">') : "") + '<div class="toggle filt">'.concat(Object.entries(INV_FL).map(([k, v]) => '<button class="'.concat((st[key] || "all") === k ? "on" : "", '" onclick="').concat(a(() => st[key] = k), '">').concat(v[0], "</button>")).join(""), "</div>") + (list.length > 3 ? '<div class="sortrow"><span class="mono muted">Сортировка:</span>'.concat([["cat", "по типу"], ["w", "по весу"], ["v", "по цене"], ["n", "по имени"]].map(([k, n]) => '<button class="lnk '.concat((st.isort || "cat") === k ? "on" : "", '" onclick="').concat(a(() => {
      st.isort = k;
    }), '">').concat(n, "</button>")).join("")).concat((st.isort || "cat") === "cat" ? '<button class="lnk" onclick="'.concat(a(() => {
      const f2 = st.fold || (st.fold = {});
      const w = list === G.stash ? "stash" : "inv";
      const cats = [...new Set(shown.map((e) => CAT_N[IT(e.id).c]))];
      const all = cats.every((c) => f2[w + ":" + c]);
      cats.forEach((c) => {
        f2[w + ":" + c] = !all;
      });
    }), '">свернуть/развернуть всё</button>') : "", "</div>") : "") + (shown.length ? "" : '<p class="muted">Пусто.</p>') + '<div class="list">'.concat(itemList(shown, list === G.stash ? "stash" : "inv"), "</div>");
  }
  function stashDual() {
    const side = st.sside || "stash";
    st.xfer = true;
    setTimeout(() => {
      st.xfer = false;
    }, 0);
    return (typeof CUI !== "undefined" && CUI.kits ? CUI.kits() : "") + '<div class="toggle filt">'.concat([["stash", "📦 На складе (".concat(G.stash.length, ")")], ["bag", "🎒 В рюкзаке (".concat(G.inv.length, ")")]].map(([k, n]) => '<button class="'.concat(side === k ? "on" : "", '" onclick="').concat(a(() => st.sside = k), '">').concat(n, "</button>")).join(""), "</div>") + (side === "stash" ? '<div class="sec"><p class="muted" style="font-size:13px">«Взять» / «Взять 1» — в рюкзак.</p>'.concat(filtered(G.stash, "stf"), "</div>") : '<div class="sec"><p class="muted" style="font-size:13px">«На склад» / «На склад 1» — положить.</p>'.concat(filtered(G.inv, "invf"), "</div>"));
  }
  function handCraft() {
    const fire = campHere() || atBase() && G.w.struct.fire > 0;
    const rs = RECIPES.filter((r) => (!r.st || r.st === "fire" && fire) && (!r.bp || G.w.bp[r.bp]) && (!r.ch2 || CH2()));
    const rows = rs.map((r) => {
      const w = recipeState(r);
      return '<div class="row '.concat(w ? "dim" : "", '"><div class="grow"><span class="t">').concat(esc(r.n), '</span><span class="s">').concat(Object.entries(r.need).map(([k, v]) => "".concat(IT(k).ic).concat(IT(k).n, " ").concat(allCnt(k), "/").concat(v)).join(", ")).concat(r.st ? " · на огне" : "", " · ").concat(r.t, ' мин</span></div><div class="acts">').concat(btn("Сделать", () => craft(r), "sm", !!w)).concat(!w && canMake(r) > 1 ? btn("×".concat(canMake(r)), () => craftMax(r), "sm") : "", "</div></div>");
    }).join("");
    const camp = campHere() ? '<span class="chip good">🔥 костёр: ещё '.concat(G.campfire.until - G.time, " мин</span>") : !L().base ? btn("🔥 Развести костёр (2 дров)", makeCamp, "sm", !cnt(G.inv, "lighter") || cnt(G.inv, "wood") < 2) : "";
    return '<div class="sec" id="craftsec"><div class="sechead"><h2>Крафт в руках</h2>'.concat(camp, '</div><p class="muted" style="font-size:13px">Простые вещи можно делать где угодно. ').concat(fire ? "Огонь рядом — можно жарить и кипятить." : "Чтобы жарить и кипятить вне базы, разведи костёр.", ' Сложное — на верстаке базы.</p><div class="list">').concat(rows, "</div></div>");
  }
  const EQS = [
    ["mask", "Маска", "😷", null],
    ["body", "Одежда", "🧥", null],
    ["vest", "Бронежилет", "🦺", null],
    ["weapon", "Оружие", "🗡️", null],
    ["bag", "Рюкзак", "🎒", null],
    ["art0", "Артефакт 1", "💠", 0],
    ["art1", "Артефакт 2", "💠", 1]
  ];
  const eqGet = (k) => k === "art0" ? G.eq.art[0] : k === "art1" ? G.eq.art[1] : G.eq[k];
  const durPct = (e) => e && e.dur != null && IT(e.id).dur ? Math.max(0, Math.round(e.dur / IT(e.id).dur * 100)) : null;
  function eqSlot(k, n, ic) {
    const e = eqGet(k), d = durPct(e), sel2 = (st.eqSel || "weapon") === k;
    const cls = d != null && d <= 15 ? "crit" : d != null && d <= 35 ? "low" : "";
    return '<button class="eqs '.concat(sel2 ? "sel" : "", " ").concat(cls, " ").concat(e ? "" : "empty", " s-").concat(k, '" onclick="').concat(a(() => {
      st.eqSel = k;
    }), '" title="').concat(n, '">\n      <span class="eqi">').concat(e ? ART.tile(e.id) : '<span class="ph">'.concat(ic, "</span>"), '</span>\n      <span class="eqn">').concat(e ? esc(IT(e.id).n) : n, "</span>\n      ").concat(d != null ? '<span class="dur"><i style="width:'.concat(d, '%"></i></span>') : "").concat(cls ? '<span class="dw">!</span>' : "", "</button>");
  }
  function paperDoll() {
    const sel2 = st.eqSel || "weapon", S = EQS.find((x) => x[0] === sel2) || EQS[3], e = eqGet(sel2), d = durPct(e);
    const warn = EQS.map(([k]) => [k, eqGet(k), durPct(eqGet(k))]).filter(([, e2, d2]) => e2 && d2 != null && d2 <= 35);
    const fig = '<svg class="fig" viewBox="0 0 100 210" aria-hidden="true"><circle cx="50" cy="22" r="15"/><path d="M28 44 Q50 36 72 44 L80 110 Q76 114 72 110 L68 70 L66 120 L70 200 Q62 206 56 200 L50 130 L44 200 Q38 206 30 200 L34 120 L32 70 L28 110 Q24 114 20 110 Z"/></svg>';
    const sl = (id) => eqSlot(...EQS.find((x) => x[0] === id));
    let det = "";
    if (e) {
      const it = IT(e.id), acts = [btn("Снять", () => unequip(S[3] != null ? "art" : sel2, S[3] != null ? S[3] : void 0), "sm")];
      if (sel2 === "weapon" && e.dur != null) acts.push(btn("🩶 Подлатать скотчем", repairWeapon, "sm", !allCnt("tape")));
      det = '<div class="eqdet"><div class="sechead"><span class="t"><b>'.concat(esc(it.n), '</b></span><span class="mono muted">').concat(S[1], "</span></div>\n        ").concat(d != null ? '<div class="durbig '.concat(d <= 15 ? "crit" : d <= 35 ? "low" : "", '"><span>Прочность ').concat(d, '%</span><span class="dur"><i style="width:').concat(d, '%"></i></span></div>') : "", '\n        <div class="s muted">').concat(itemSub(e), '</div><div class="acts">').concat(acts.join(""), "</div></div>");
    } else det = '<div class="eqdet"><span class="muted">'.concat(S[1], ": пусто. Надеть можно из рюкзака — кнопка «Надеть».</span></div>");
    return '<div class="sec"><h2>Снаряжение</h2>\n      '.concat(warn.length ? '<div class="eqwarn">⚠️ Скоро сломается: '.concat(warn.map(([k, e2, d2]) => "<b>".concat(esc(IT(e2.id).n), "</b> ").concat(d2, "%")).join(", "), ". Почини заранее — в бою будет поздно.</div>") : "", '\n      <div class="doll"><div class="dcol">').concat(sl("mask")).concat(sl("body")).concat(sl("vest"), '</div><div class="dmid">').concat(fig, '</div><div class="dcol">').concat(sl("weapon")).concat(sl("bag")).concat(sl("art0")).concat(sl("art1"), "</div></div>\n      ").concat(det, "</div>");
  }
  function renderInv() {
    const w = curW(), cap = capW();
    const slot = (name, e, s, idx) => '<div class="row"><div class="grow"><span class="s">'.concat(name, '</span><span class="t">').concat(e ? "".concat(IT(e.id).ic, " ").concat(esc(IT(e.id).n)) : '<span class="muted">—</span>', "</span>").concat(e ? '<span class="s">'.concat(itemSub(e), "</span>") : "", "</div>").concat(e ? btn("Снять", () => unequip(s, idx), "sm") : "", "</div>");
    if (st.scrollCraft) {
      st.scrollCraft = false;
      st.isub = "craft";
    }
    let sub = st.isub || "bag";
    if (sub === "stash" && !atBase()) sub = st.isub = "bag";
    let h = "".concat(tutCard()).concat(logLast(2), '<div class="sticky">').concat(subBar("isub", [["bag", "🎒 Рюкзак"], ["stash", "📦 Склад", !atBase()], ["craft", "🔨 Крафт"]], "bag")).concat(quickBar(), "</div>");
    if (w > cap) h += '<p class="bad">Перегруз: ходишь медленнее'.concat(w > cap * 1.5 ? ", а с таким весом вообще не уйти" : "", ".</p>");
    if (sub === "bag") {
      h += paperDoll();
      h += '<div class="sec"><h2>Рюкзак</h2>'.concat(filtered(G.inv, "invf"), "</div>");
    } else if (sub === "stash") {
      h += stashDual();
    } else {
      h += handCraft();
      if (atBase()) h += workshop();
      else h += '<p class="muted">Верстак, коптильня и плита — на базе (вкладка «База → Мастерская»).</p>';
    }
    return h;
  }
  function renderChar() {
    const c = G.ch, f = F();
    let h = "".concat(logLast(2), '<div class="sec"><div class="eyebrow">').concat(MODES[G.mode].ic, " ").concat(MODES[G.mode].n).concat(G.w.gen > 1 ? " · выживший №".concat(G.w.gen) : "", "</div><h1>").concat(esc(c.name), '</h1><div class="acts"><span class="chip good">').concat((PROFS[c.prof] || PROFS.unemployed).ic, " ").concat((PROFS[c.prof] || PROFS.unemployed).n, "</span>").concat(c.traits.filter((t) => TRAITS[t]).map((t) => '<span class="chip" title="'.concat(esc(TRAITS[t].d), '">').concat(TRAITS[t].ic, " ").concat(TRAITS[t].n, "</span>")).join("") || '<span class="muted">без черт</span>', "</div>").concat((c.perks || []).length ? '<div class="acts">'.concat(c.perks.map((id) => PERK_BY[id] ? '<span class="chip warn" title="'.concat(esc(PERK_BY[id].d), '">⭐ ').concat(PERK_BY[id].ic, " ").concat(PERK_BY[id].n, "</span>") : "").join(""), "</div>") : "", '<p class="muted mono">Жив ').concat(Math.floor((G.time - c.born) / DAY), " дн. · убито ").concat(c.kills, " · ").concat(G.w.deaths.length ? "смертей: ".concat(G.w.deaths.length) : "ни разу не умирал", "</p></div>");
    if (typeof virusCard === "function") h += virusCard();
    if (f.parts) {
      const kinds = [["bandage", "dband"], ["antisep", "alcohol"], ["splint"]];
      const have = (k) => kinds[k].find((id) => cnt(G.inv, id));
      const injRow = (j) => {
        const tags = [j.bleed > 0 && !j.band ? '<span class="chip bad">🩸 кровит</span>' : "", j.band ? '<span class="chip '.concat(j.dirty ? "warn" : "good", '">перевязано').concat(j.dirty ? " (грязно)" : "", "</span>") : "", j.dis ? '<span class="chip good">обработано</span>' : "", j.inf >= 15 ? '<span class="chip '.concat(j.inf >= 60 ? "bad" : "warn", '">воспаление ').concat(Math.round(j.inf), "%</span>") : "", j.t === "frac" ? '<span class="chip '.concat(j.splint ? "good" : "bad", '">').concat(j.splint ? "в шине" : "нужна шина", "</span>") : ""].join("");
        const b = [];
        if (!j.band && j.t !== "frac" && j.t !== "bruise") {
          const id = have(0);
          b.push(btn("🩹 Перевязать", () => useItem(id, false, j), "sm", !id));
        }
        if (!j.dis && f.infection && j.t !== "frac" && j.t !== "bruise") {
          const id = have(1);
          b.push(btn("🧴 Обработать", () => useItem(id, false, j), "sm", !id));
        }
        if (j.t === "disl" && typeof reduceDisl === "function") b.push(btn("🦴 Вправить", () => reduceDisl(j), "sm"));
        if (j.t === "frac" && !j.splint) {
          const id = have(2);
          b.push(btn("🦯 Шина", () => useItem(id, false, j), "sm", !id));
        }
        return '<div class="row" style="flex-wrap:wrap;background:var(--panel2)"><div class="grow"><span class="t">'.concat(INJ[j.t].n, '</span><span class="acts">').concat(tags, '<span class="chip">заживает ').concat(Math.min(99, Math.round(j.prog / INJ[j.t].heal * 100)), '%</span></span></div><div class="acts">').concat(b.join(""), "</div></div>");
      };
      const fr = (p) => c.parts[p] / PARTS[p].max, injOf = (p) => c.inj.filter((j) => j.part === p);
      const col = (p) => {
        const r = fr(p), I = injOf(p);
        if (I.some((j) => j.bleed > 0 && !j.band) || r < 0.4) return "bad";
        if (r < 0.8 || I.length) return "warn";
        return "ok";
      };
      const SHP = { head: '<circle cx="60" cy="24" r="17"/>', torso: '<rect x="40" y="45" width="40" height="72" rx="9"/>', larm: '<rect x="20" y="47" width="16" height="70" rx="8"/>', rarm: '<rect x="84" y="47" width="16" height="70" rx="8"/>', lleg: '<rect x="41" y="121" width="18" height="100" rx="8"/>', rleg: '<rect x="61" y="121" width="18" height="100" rx="8"/>' };
      const CTR = { head: [60, 24], torso: [60, 80], larm: [28, 82], rarm: [92, 82], lleg: [50, 170], rleg: [70, 170] };
      if (st.part && !PARTS[st.part]) st.part = null;
      const selP = st.part || Object.keys(PARTS).find((p) => injOf(p).length) || null;
      const svg = '<svg class="anat" viewBox="0 0 120 230">'.concat(Object.keys(PARTS).map((p) => {
        const I = injOf(p), [x, y] = CTR[p];
        return '<g class="bp '.concat(col(p), " ").concat(selP === p ? "sel" : "", '" onclick="').concat(a(() => {
          st.part = p;
        }), '">').concat(SHP[p]).concat(I.length ? '<circle class="mk" cx="'.concat(x, '" cy="').concat(y, '" r="7"/><text x="').concat(x, '" y="').concat(y + 3.5, '">').concat(I.length, "</text>") : "", "</g>");
      }).join(""), "</svg>");
      const chipsP = Object.keys(PARTS).map((p) => '<button class="pchip '.concat(col(p), " ").concat(selP === p ? "on" : "", '" onclick="').concat(a(() => {
        st.part = p;
      }), '">').concat(PARTS[p].n, " <b>").concat(Math.round(fr(p) * 100), "%</b>").concat(injOf(p).length ? " · ".concat(injOf(p).length) : "", "</button>")).join("");
      let det = "";
      if (selP) {
        const I = injOf(selP);
        det = '<div class="eqdet"><div class="sechead"><b>'.concat(PARTS[selP].n, '</b><span class="mono muted">').concat(Math.round(c.parts[selP]), "/").concat(PARTS[selP].max, "</span></div>").concat(bar(c.parts[selP], PARTS[selP].max)).concat(I.length ? '<div class="list">'.concat(I.map(injRow).join(""), "</div>") : '<span class="muted">Ран нет.</span>', "</div>");
      } else det = '<div class="eqdet"><span class="good">Ран нет — всё цело.</span></div>';
      h += '<div class="sec"><h2>Здоровье '.concat(healthPct(), '%</h2><div class="anatwrap">').concat(svg, '<div class="pchips">').concat(chipsP, "</div></div>").concat(det, "</div>");
    } else h += '<div class="sec"><h2>Здоровье '.concat(Math.round(c.hp), "%</h2>").concat(bar(c.hp)).concat(c.bleed ? '<div class="acts"><span class="chip bad">🩸 кровотечение</span>'.concat(btn("🩹 Перевязать", () => useItem(cnt(G.inv, "bandage") ? "bandage" : "dband"), "sm", !cnt(G.inv, "bandage") && !cnt(G.inv, "dband")), "</div>") : "", "</div>");
    const stats = [["🍗 Сытость", c.food], ["💧 Вода", c.drink], ["⚡ Силы", c.energy], ["😰 Стресс", c.stress, 1]];
    if (f.rad) stats.push(["☢️ Радиация", c.rad / 2, 1, Math.round(c.rad)]);
    if (f.cold) stats.push(["🥶 Холод", c.cold, 1]);
    stats.push(["💦 Сырость", c.wet, 1]);
    h += '<div class="sec"><h2>Состояние</h2><div class="grid2">'.concat(stats.map(([n, v, inv, shown]) => '<div class="vit" style="font-size:12.5px">'.concat(n, ' <span class="mono">').concat(shown != null ? shown : Math.round(v), "</span>").concat(bar(v, 100, inv), "</div>")).join(""), "</div>");
    const md = moodles();
    if (md.length) h += '<div class="list">'.concat(md.map((x) => '<div class="row"><span class="ic">'.concat(x.ic, '</span><div class="grow"><span class="t">').concat(x.n, '</span><span class="s">').concat(esc(x.d), "</span></div></div>")).join(""), "</div>");
    h += "</div>";
    h += '<div class="sec"><h2>Навыки</h2><div class="grid2">'.concat(Object.keys(SKILLS).map((k) => {
      const lv = skill(k), raw = SKILL_XP.findIndex((x, i) => i > 0 && c.xp[k] < x);
      const lo = SKILL_XP[Math.max(0, (raw < 0 ? SKILL_XP.length : raw) - 1)], hi = raw < 0 ? lo : SKILL_XP[raw];
      const pc = raw < 0 ? 100 : Math.max(0, Math.min(99, Math.floor((c.xp[k] - lo) / Math.max(1, hi - lo) * 100)));
      return '<div class="vit" style="font-size:12.5px">'.concat(SKILLS[k].ic, " ").concat(SKILLS[k].n, ' <b class="mono">ур. ').concat(lv, '</b> <span class="mono muted">').concat(raw < 0 ? "макс." : pc + "% до " + (lv + 1), "</span>").concat(bar(raw < 0 ? 1 : c.xp[k] - lo, raw < 0 ? 1 : hi - lo), "</div>");
    }).join(""), '</div><p class="muted" style="font-size:13px">Навыки растут от дела: дерёшься — растёт ближний бой, обыскиваешь — поиск.</p></div>');
    h += '<div class="sec"><div class="sechead"><h2>Правила сложности</h2>'.concat(btn(st.showRules ? "Скрыть" : "Показать", () => st.showRules = !st.showRules, "sm"), "</div>").concat(st.showRules ? '<ul class="muted" style="margin:0;padding-left:18px">'.concat(MODES[G.mode].rules.map((r) => "<li>".concat(esc(r), "</li>")).join(""), "</ul>") : "", "</div>");
    h += EXTUI.charPanel();
    return h;
  }
  function renderBase() {
    const s = G.w.struct;
    if (!atBase()) return "".concat(logLast(2), '<h1>🏚️ База</h1><div class="note">Ты не на базе. Лодочная станция — ').concat(LOCS.base.links[G.loc] ? "".concat(LOCS.base.links[G.loc], " мин отсюда") : "далеко отсюда", ".<br>Укрепления: ").concat(STRUCT.walls.lv[s.walls].n).concat(s.walls ? " (".concat(G.w.wallHp, "%)") : "", " · защита ").concat(defense(), "</div>");
    const d = day(), nextBN = d % BNP() === 0 && hour() < 22 ? d : d + (BNP() - d % BNP());
    const power = Math.round((25 + nextBN * 2.5) * F().horde);
    let h = "".concat(ART.sceneTag({ loc: "base", key: "base", alt: "Лодочная станция", camp: false })).concat(tutCard()).concat(logLast(3), '<div class="sec"><h1>🏚️ Лодочная станция</h1><p class="muted">Защита <b class="mono">').concat(defense(), "</b> · следующая Кровавая ночь — день ").concat(nextBN, ', натиск ≈ <b class="mono">').concat(power, "</b> за ночь (3 волны).").concat(s.walls ? " Укрепления: ".concat(G.w.wallHp, "%.") : "", "</p></div>");
    const bsub = st.bsub || "main";
    h = '<div class="sticky">'.concat(subBar("bsub", [["main", "🏚️ Обзор"], ["build", "🏗️ Стройка"], ["craft", "🔨 Крафт"], ["stash", "📦 Склад"], ["people", "🏘️ Люди"], ["raid", "⚔️ Рейды"]], "main")).concat(quickBar(), "</div>") + (bsub === "main" ? h : logLast(2));
    if (bsub === "main") {
      h += '<div class="grid2">'.concat(btn("😴 Спать до утра".concat(s.bed ? " (кровать)" : ""), () => sleepHere())).concat(btn("😴 Вздремнуть 2 ч", () => sleepHere(2))).concat(btn("🐈 Погладить кота", petCat)).concat((G.w.catLove || 0) >= 4 && !G.pet && !G.w.catAway ? btn("🐈 Взять кота с собой", takeCat) : "").concat(btn("🔨 Подлатать стены (2 доски, 4 гвоздя)", repairWalls, "", !s.walls)).concat(s.radio ? btn("📻 Слушать эфир", radioMsg) : "", "</div>");
      if (typeof CUI !== "undefined") h += CUI.basePanel();
    } else if (bsub === "people") {
      h += typeof CUI !== "undefined" && CUI.work ? CUI.work() : EXTUI.basePanel();
    } else if (bsub === "raid") h += EXTUI.raidPanel();
    else if (bsub === "craft") h += workshop();
    else if (bsub === "stash") h += stashDual() + (typeof CUI !== "undefined" && CUI.stashLog ? CUI.stashLog() : "");
    else if (bsub === "build") {
      h += '<div class="sec"><h2>Постройки</h2><div class="list">';
      for (const id in STRUCT) {
        if (STRUCT[id].ch2 && !CH2()) continue;
        const S = STRUCT[id], lv = s[id] || 0, nx = S.lv[lv + 1], why = canBuild(id);
        const need = nx && nx.c ? Object.entries(buildCost(nx.c)).map(([k, v]) => '<span class="'.concat(allCnt(k) >= v ? "" : "bad", '">').concat(IT(k).ic).concat(IT(k).n, " ").concat(allCnt(k), "/").concat(v, "</span>")).join(", ") : "";
        h += '<div class="row '.concat(why === "bp" ? "dim" : "", '"><span class="ic">').concat(S.ic, '</span><div class="grow"><span class="t">').concat(S.n, ": ").concat(lv ? S.lv[lv].n : '<span class="muted">нет</span>', "</span>").concat(nx ? '<span class="s">'.concat(why === "bp" ? "📐 нужен чертёж" : why === "need" ? "⚡ сначала: ".concat(STRUCT[S.need].n) : why === "npc" ? "🏘️ нужно жильцов: ".concat(S.npc) : why === "ch3" ? "📡 откроется в Главе 3" : "→ ".concat(nx.n, ": ").concat(need), "</span>") : '<span class="s">максимум</span>', "</div>").concat(nx && why !== "bp" ? '<div class="acts" style="flex-direction:column;align-items:flex-end">'.concat(btn(lv ? "Улучшить" : "Построить", () => build(id), "sm pri", !!why)).concat(why === "res" && typeof CUI !== "undefined" && CUI.orderStruct ? CUI.orderStruct(id) : "", "</div>") : "", "</div>");
      }
      h += "</div></div>";
    }
    return h;
  }
  function renderJour() {
    const q = Object.entries(G.w.quests);
    const act = q.filter(([, v]) => v === "active"), done = q.filter(([, v]) => v === "done");
    const giver = (g) => g === "main" ? "⭐ Главное" : TRADERS[g].ic + " " + TRADERS[g].n;
    let h = '<div class="sec"><h2>Задания</h2><div class="list">'.concat(act.map(([id]) => '<div class="row"><div class="grow"><span class="s">'.concat(giver(QUESTS[id].g), '</span><span class="t">').concat(QUESTS[id].n, '</span><span class="s">').concat(esc(QUESTS[id].d), '</span><span class="s">Прогресс: ').concat(questProgress(id), "</span></div></div>")).join("") || '<p class="muted">Нет активных заданий. Поговори с жителями острова.</p>', "</div>").concat(done.length ? '<p class="muted">Выполнено: '.concat(done.map(([id]) => QUESTS[id].n).join(", "), "</p>") : "", "</div>");
    if (G.w.ending === "master" && !G.w.ch2) h += '<div class="sec"><h2>🔮 Глава 2 «Мастер»</h2><p class="muted">Ты забрал ядро Аппарата. Остров ждёт своего Мастера: сильнее враги, чаще Выбросы, кристаллы, лодка и путь к синему шпилю за проливом.</p><div class="acts">'.concat(btn("Начать Главу 2", startCh2, "pri"), "</div></div>");
    if (typeof CUI !== "undefined") h += CUI.jour();
    h += coopPanel();
    if (typeof CUI !== "undefined" && CUI.botPanel) h += CUI.botPanel();
    h += lbPanel();
    h += '<div class="sec"><h2>Записки ('.concat(G.w.notes.length, "/").concat(Object.keys(NOTES).length, ')</h2><div class="list">').concat(G.w.notes.slice().reverse().map((id) => '<div class="note"><b>'.concat(esc(NOTES[id].t), "</b><br>").concat(esc(NOTES[id].x), "</div>")).join(""), "</div></div>");
    h += '<div class="sec"><h2>События</h2><div class="list" style="gap:2px">'.concat(G.log.slice(-60).reverse().map((x) => '<div class="lg '.concat(x.c, '" style="font-size:13px"><span class="mono muted">Д').concat(x.d, " ").concat(x.k, "</span> ").concat(esc(x.t), "</div>")).join(""), "</div></div>");
    h += '<div class="sec"><h2>💾 Сохранения · слот '.concat(SAVE_SLOT, '</h2><div class="acts">').concat(btn("🔄 Другой слот", () => {
      save();
      startScreen();
    }, "sm")).concat(btn("📤 Экспорт", exportScreen, "sm")).concat(window.SYNC ? btn("🔗 Играть на другом устройстве", syncScreen, "sm") : "").concat(btn("📥 Импорт", importScreen, "sm"), "</div></div>");
    h += '<div class="sec"><h2>Подсказки</h2><div class="acts">'.concat(btn(hintsState().off ? "💡 Включить подсказки" : "💡 Выключить подсказки", hintsToggle, "sm"), "</div></div>");
    h += '<div class="sec"><h2>Звук</h2><div class="acts">'.concat(btn(SFX.on ? "🔊 Звук включён" : "🔇 Звук выключен", () => SFX.toggle(), "sm")).concat(btn(SFX.music ? "🎵 Музыка: да" : "🎵 Музыка: нет", () => SFX.toggleMusic(), "sm"), '</div><label class="muted" style="display:flex;gap:8px;align-items:center;font-size:13px">Громкость <input type="range" id="vol" min="0" max="100" value="').concat(Math.round(SFX.vol * 100), '" oninput="SFX.setVol(this.value/100)" style="flex:1"></label></div>');
    h += '<div class="sec"><h2>Игра</h2>'.concat(st.confirmNew ? '<p class="bad">Прогресс этой игры удалится. Точно?</p><div class="acts">'.concat(btn("Да, начать заново", () => {
      wipe();
      G = null;
      st.confirmNew = false;
      startScreen();
    }, "bad")).concat(btn("Отмена", () => st.confirmNew = false), "</div>") : btn("Новая игра", () => st.confirmNew = true), '<p class="muted" style="font-size:13px">Игра сохраняется сама после каждого действия — в этом браузере.</p></div>');
    h += EXTUI.achPanel();
    if (typeof uiSettingsHtml === "function") h = uiSettingsHtml() + h;
    return jourTabs(h, act.length);
  }
  const JT = [["quests", "📌 Задания"], ["diary", "📔 Дневник"], ["squad", "🤝 Отряд"], ["ach", "🏅 Итоги"], ["set", "⚙️ Настройки"]];
  function jourCat(t) {
    t = t.toLowerCase();
    if (/дневник|записки|^\W*события|справочник/.test(t)) return "diary";
    if (/кооператив|таблица|выживших|отряд|🤖/.test(t)) return "squad";
    if (/достижения|статистика|бестиарий|летопись/.test(t)) return "ach";
    if (/интерфейс|тема|звук|подсказки|своя сложность|сложность сейчас|режим и модификаторы|сохранения|резервные|^\W*игра$/.test(t)) return "set";
    return "quests";
  }
  function jourTabs(h, nAct) {
    const cur2 = st.jsub || "quests";
    if (typeof document === "undefined") return h;
    const box = document.createElement("div");
    box.innerHTML = h;
    const out = { quests: [], diary: [], squad: [], ach: [], set: [] };
    [...box.children].forEach((el) => {
      const hd = el.querySelector("h2,h1");
      const c = jourCat(hd ? hd.textContent.trim() : "");
      out[c].push(el.outerHTML);
    });
    const items = JT.filter(([k]) => k !== "squad" || out.squad.length).map(([k, n]) => [k, k === "quests" && nAct ? "".concat(n, " · ").concat(nAct) : n]);
    const sel2 = out[cur2] && (cur2 !== "squad" || out.squad.length) ? cur2 : "quests";
    return '<div class="sticky">'.concat(subBar("jsub", items, "quests"), "</div>") + (out[sel2].join("") || '<p class="muted">Пусто.</p>');
  }
  const ST_N = { off: "выключен", connecting: "подключение…", online: "в сети", offline: "нет связи — изменения не синхронизируются", readonly: "только чтение — нет прав на запись" };
  function ago(at) {
    const m2 = Math.round((Date.now() - (at || 0)) / 6e4);
    return m2 < 1 ? "только что" : m2 < 60 ? "".concat(m2, " мин назад") : m2 < 1440 ? "".concat(Math.round(m2 / 60), " ч назад") : "".concat(Math.round(m2 / 1440), " дн. назад");
  }
  const FBM = () => !!(window.claude && window.claude._fb);
  function inviteLink(code) {
    return (window.TG_APP_LINK || "") + "?startapp=" + code;
  }
  function invite() {
    if (!G || !G.coop) return;
    const link = inviteLink(G.coop.code), text = "🏝 Заходи ко мне на остров! Выживаем вместе в Mystery of the Island.";
    try {
      if (window.TGA && TGA.ver("6.1")) {
        TGA.tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent(text));
        return;
      }
    } catch (e) {
    }
    try {
      navigator.clipboard.writeText(link).then(() => toast("Ссылка скопирована — отправь её другу"), () => toast(link));
    } catch (e) {
      toast(link);
    }
  }
  const lbs = { list: null, at: 0, busy: false, err: "" };
  const MODE_IC = { tourist: "🏖️", survivor: "🎒", hardcore: "☠️" };
  function lbLoad(force) {
    if (!window.FB || !FB.lb || lbs.busy || !force && Date.now() - lbs.at < 6e4) return;
    lbs.busy = true;
    lbSubmit(true).then(() => FB.lb.top(20)).then((l) => {
      lbs.list = l;
      lbs.err = "";
    }, () => {
      lbs.err = "Нет связи с сервером.";
    }).finally(() => {
      lbs.busy = false;
      lbs.at = Date.now();
      if (st.tab === "jour") render();
    });
  }
  function lbPanel() {
    if (!window.FB || !FB.lb) return "";
    lbLoad();
    const me = FB.uid;
    const rows = (lbs.list || []).map((e, i) => '<div class="row '.concat(e.id === me ? "evt" : "", '"><span class="ic mono">').concat(i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1, '</span><div class="grow"><span class="t">').concat(esc(e.name || "Выживший")).concat(e.id === me ? " (ты)" : "").concat(e.alive ? "" : " ☠️", '</span><span class="s">').concat(MODE_IC[e.mode] || "", " ").concat(MODES[e.mode] ? MODES[e.mode].n : "").concat(e.coop ? " · 🤝" : "", " · убито: ").concat(e.kills || 0).concat(e.ach ? " · 🏅".concat(e.ach) : "", '</span></div><b class="mono">').concat(e.days, " дн.</b></div>")).join("");
    return '<div class="sec"><div class="sechead"><h2>🏆 Таблица выживших</h2>'.concat(btn(lbs.busy ? "…" : "↻", () => lbLoad(true), "sm"), '</div>\n      <p class="muted" style="font-size:13px">Сколько дней прожил персонаж. У каждого игрока в таблице — лучший забег; живой забег обновляется по ходу игры.</p>\n      <div class="list">').concat(lbs.list ? rows || '<p class="muted">Пока никого — будь первым.</p>' : '<p class="muted">'.concat(lbs.err || "Загружаю…", "</p>"), "</div></div>");
  }
  function coopPanel() {
    if (window.TGA && !window.claude) return '<div class="sec"><h2>🤝 Кооператив</h2><p class="muted">В Telegram-версии кооператив появится в следующем обновлении: друг будет заходить в твой мир по ссылке-приглашению.</p></div>';
    if (!G.coop) return '<div class="sec"><h2>🤝 Кооператив</h2><p class="muted">Позови друга в свой мир. База, склад, постройки, задания и время станут общими; персонаж и рюкзак у каждого свои. Если вы в одной локации, друг помогает в бою.</p>\n      '.concat(FBM() ? '<ol class="muted" style="margin:0;padding-left:20px;font-size:14px;display:grid;gap:2px"><li>Нажми «Создать общий мир».</li><li>Нажми «Пригласить друга» и отправь ему ссылку в Телеграме.</li><li>Друг открывает ссылку — и сразу попадает в твой мир.</li></ol>' : '<ol class="muted" style="margin:0;padding-left:20px;font-size:14px;display:grid;gap:2px"><li>Нажми «Создать общий мир» — получишь код.</li><li>«Поделиться» вверху страницы → пригласи друга по email с правом <b>редактора</b>.</li><li>Друг открывает страницу → «Присоединиться к другу» → вводит код.</li></ol>', '\n      <div class="acts">').concat(btn(st.coopBusy ? "Создаю…" : "🌍 Создать общий мир", async () => {
      if (st.coopBusy) return;
      st.coopBusy = true;
      render();
      const err = await COOP.create();
      st.coopBusy = false;
      if (err) toast(err);
      render();
    }, "pri", st.coopBusy), "</div></div>");
    COOP.readAll();
    const ps = COOP.others();
    let h = '<div class="sec"><div class="sechead"><h2>🤝 Кооператив</h2><span class="chip '.concat(COOP.status === "online" ? "good" : "warn", '">').concat(ST_N[COOP.status] || COOP.status, '</span></div>\n      <div class="row"><div class="grow"><span class="s">Код мира — отправь другу</span><span class="t mono" style="font-size:22px;letter-spacing:.2em;user-select:all">').concat(esc(G.coop.code), "</span></div>").concat(btn("Копировать", () => {
      try {
        navigator.clipboard.writeText(G.coop.code).then(() => toast("Код скопирован"), () => toast("Выдели код и скопируй вручную"));
      } catch (e) {
        toast("Выдели код и скопируй вручную");
      }
    }, "sm"), "</div>\n      ").concat(FBM() ? '<div class="acts">'.concat(btn("📨 Пригласить друга", invite, "pri"), '</div><p class="muted" style="font-size:13px">Друг откроет ссылку в Телеграме и сразу окажется в этом мире.</p>') : '<p class="muted" style="font-size:13px">Друг должен быть приглашён к этой странице как редактор («Поделиться» → по email).</p>', '\n      <div class="list">').concat(ps.length ? ps.map((p) => {
      var _a;
      return '<div class="row '.concat(p.online ? "" : "dim", '"><span class="ic">').concat(stIcon(p), '</span><div class="grow"><span class="t">').concat(esc(p.name || "Выживший")).concat(p.id === COOP.host ? " 👑" : "").concat(p.alive === false ? " ☠️" : "", '</span><span class="s">').concat(LOCS[p.loc] ? LOCS[p.loc].ic + " " + LOCS[p.loc].n : "—").concat(p.room ? " · " + esc(p.room) : "", " · ❤️ ").concat((_a = p.hp) != null ? _a : "?", '%</span><span class="s">').concat(esc(p.act || ""), " · ").concat(p.online ? "в игре" : "был " + ago(p.at), "</span></div>").concat(COOP.host && COOP.host === COOP.uid ? btn("🚫", () => event({ title: "🚫 Выгнать: ".concat(p.name || "Выживший", "?"), cls: "bad", text: "Персонаж исчезнет из мира, а игрок не сможет зайти сюда снова (пока ты его не вернёшь). Общая база и склад останутся.", choices: [{ t: "🚫 Выгнать", fn: () => COOP.kick(p.id) }, { t: "Отмена" }] }), "sm") : "").concat(btn("›", () => friendSheet(p), "sm"), "</div>");
    }).join("") : '<p class="muted">Пока в мире только ты.</p>', "</div>").concat(COOP.host && COOP.host === COOP.uid && Object.keys(COOP.kicked || {}).length ? '<div class="acts"><span class="muted" style="font-size:13px">Исключено: '.concat(Object.keys(COOP.kicked).length, "</span>").concat(btn("Вернуть всех", () => Object.keys(COOP.kicked).forEach((id) => COOP.unkick(id)), "sm"), "</div>") : "", "\n      ").concat((() => {
      const L0 = COOP.leader(), nm = (id) => id === COOP.uid ? "ты" : (COOP.others().find((p) => p.id === id) || {}).name || "?";
      return '<p class="muted" style="font-size:13px">👑 Хозяин мира: '.concat(esc(COOP.host ? nm(COOP.host) : "—"), " · 🎲 мировые события (гуманитарка, налёты, жильцы, огород) сейчас ведёт: <b>").concat(esc(nm(L0)), "</b>. Если хозяин не в сети, мир ведёт друг — ничего не замирает.</p>");
    })(), '\n      <h3>Сигналы</h3><div class="acts">').concat(["Нужна помощь!", "Иди сюда!", "Иду к тебе", "Встречаемся на базе"].map((t) => btn("📣 " + t, () => COOP.ping(t), "sm")).join(""), '</div>\n      <h3>Лента отряда</h3><div class="clog" style="max-height:180px">').concat(COOP.feedList.slice(-15).reverse().map((x) => '<div class="lg"><b>'.concat(esc(x.n), "</b> ").concat(esc(x.t), ' <span class="muted mono" style="font-size:11px">').concat(ago(x.at), "</span></div>")).join("") || '<div class="lg dim">Пока тихо.</div>', '</div>\n      <h3>Чат</h3><div class="clog" style="max-height:220px">').concat(COOP.chat.slice(-20).map((x) => '<div class="lg"><b>'.concat(esc(x.n), ":</b> ").concat(esc(x.t), ' <span class="muted mono" style="font-size:11px">').concat(ago(x.at), "</span></div>")).join("") || '<div class="lg dim">Сообщений нет.</div>', '</div>\n      <div style="display:flex;gap:6px"><input type="text" id="chatin" maxlength="240" placeholder="Написать другу…" onkeydown="if(event.key===\'Enter\'){UI._chat()}"><button class="btn pri" onclick="UI._chat()">➤</button></div>\n      <div class="acts">').concat(st.confirmLeave ? '<span class="bad">Выйти из общего мира? Твоя копия мира останется у тебя как одиночная игра.</span>'.concat(btn("Да, выйти", () => {
      COOP.leave();
      st.confirmLeave = false;
    }, "bad sm")).concat(btn("Отмена", () => st.confirmLeave = false, "sm")) : btn("Выйти из общего мира", () => st.confirmLeave = true, "sm"), "</div></div>");
    return h;
  }
  async function sendChat() {
    const el = $("chatin");
    if (!el) return;
    const t = el.value;
    el.value = "";
    await COOP.send(t);
    render();
  }
  function giveMenu(p) {
    const items = G.inv.filter((e) => IT(e.id).c !== "quest" || e.id === "rpart");
    if (!items.length) return toast("Рюкзак пуст.");
    event({ title: "🎁 Передать: ".concat(p.name), text: "Что отдать?", choices: items.slice(0, 20).map((e) => ({ t: "".concat(IT(e.id).ic, " ").concat(IT(e.id).n).concat(e.n > 1 ? " ×" + e.n : ""), fn: () => e.n > 1 ? setTimeout(() => event({ title: "🎁 ".concat(IT(e.id).ic, " ").concat(IT(e.id).n, " ×").concat(e.n), text: "Сколько отдать: ".concat(p.name, "?"), choices: [{ t: "1 шт.", fn: () => COOP.give(p.id, e, 1) }].concat(e.n >= 4 ? [{ t: "Половину (".concat(Math.floor(e.n / 2), ")"), fn: () => COOP.give(p.id, e, Math.floor(e.n / 2)) }] : []).concat([{ t: "Все (".concat(e.n, ")"), fn: () => COOP.give(p.id, e) }, { t: "Отмена" }]) }), 0) : COOP.give(p.id, e) })).concat([{ t: "Отмена" }]) });
  }
  function render() {
    if (!G || full) return;
    ACT = [];
    renderTop();
    renderTabs();
    const scr = { map: renderMap, loc: renderLoc, inv: renderInv, char: renderChar, base: renderBase, jour: renderJour }[st.tab]();
    const mn = $("main");
    const changed = st.lastTab !== st.tab;
    const keep = changed ? 0 : mn.scrollTop;
    st.lastTab = st.tab;
    const ae = document.activeElement, keepId = ae && ae.id && ae.tagName === "INPUT" ? ae.id : null, keepVal = keepId ? ae.value : null, chatVal = $("chatin") ? $("chatin").value : "";
    mn.innerHTML = (typeof noEmo === "function" ? noEmo : ((x) => x))(scr);
    mn.scrollTop = keep;
    if (changed) {
      mn.classList.remove("fadein");
      void mn.offsetWidth;
      mn.classList.add("fadein");
    }
    if ($("chatin") && chatVal) $("chatin").value = chatVal;
    if (keepId && $(keepId)) {
      const el = $(keepId);
      el.value = keepVal;
      el.focus();
      try {
        el.setSelectionRange(keepVal.length, keepVal.length);
      } catch (e) {
      }
    }
    ART.paintAll($("main"));
    if (window.SFX) SFX.refresh();
    if (typeof sideRender === "function") {
      try {
        sideRender();
      } catch (e) {
      }
    }
    if (st.scrollCraft) {
      st.scrollCraft = false;
      const c = $("craftsec");
      if (c) c.scrollIntoView();
    }
  }
  function go(tab) {
    if (tab === "room" || tab === "loc") {
      st.tab = "loc";
      if (tab === "loc") st.trader = null;
    } else st.tab = tab;
    render();
  }
  let allyOpen = false;
  function event(e) {
    queue.push(e);
    if (!cur && !G.combat && !full && !allyOpen) showNext();
  }
  function showNext() {
    if (G && G.combat) return;
    cur = queue.shift();
    if (!cur) {
      $("modal").innerHTML = "";
      return;
    }
    if (cur.horde) return hordeSheet(cur);
    MACT = [];
    const ch2 = (cur.choices && cur.choices.length ? cur.choices : [{ t: "OK" }]).map((c) => '<button class="btn '.concat(c.cls || "", '" onclick="').concat(m(() => {
      const was = cur;
      cur = null;
      $("modal").innerHTML = "";
      if (c.fn) c.fn();
      if (G && !G.dead) save();
      if (!full) {
        showNext();
        render();
      }
    }), '">').concat(esc(c.t), "</button>")).join("");
    $("modal").innerHTML = (typeof noEmo === "function" ? noEmo : ((x) => x))('<div class="overlay"><div class="sheet '.concat(cur.cls || "", ' anim" role="dialog" aria-modal="true"><h2>').concat(esc(cur.title), '</h2><div class="txt">').concat(esc(cur.text || ""), '</div><div class="choices">').concat(ch2, "</div></div></div>"));
  }
  function combat() {
    const cb = G.combat;
    if (!cb) {
      closeCombat("none");
      return;
    }
    MACT = [];
    const ms = meleeStats(), w = curWeapon(), gun = w && w.c === "gun";
    const DIST = ["вплотную", "рядом", "далеко"];
    const alive = cb.en.filter((e) => e.hp > 0);
    const enemies = cb.en.map((e, i) => {
      const D = ENEMY[e.id];
      if (e.hp <= 0) return '<div class="enemy dead">'.concat(ART.enemyImg(e.id), "<div>").concat(D.n, " ☠️</div><span></span></div>");
      const acts = [];
      if (e.dist <= (ms.reach ? 1 : 0)) acts.push(mbtn("⚔️ ".concat(esc(ms.n)), () => pAttack(i), "pri sm"));
      if (gun) acts.push(mbtn("🔫 (".concat(cnt(G.inv, w.ammo), ")"), () => pShoot(i), "sm", !cnt(G.inv, w.ammo)));
      if (e.dist === 0 && !D.boss) acts.push(mbtn("🦶", () => pPush(i), "sm"));
      const ex = EXTUI.combatActs(i, e);
      if (ex) acts.push(ex);
      return '<div class="enemy">'.concat(ART.enemyImg(e.id, e.stun ? "stun" : ""), '<div><div class="t">').concat(D.n).concat(e.gear ? ' <span class="muted">('.concat(IT(e.gear).n, ")</span>") : "").concat(e.stun ? " 💫" : "", "</div>").concat(bar(e.hp, e.max), '<span class="dist">').concat(DIST[Math.min(2, e.dist)], '</span></div><div class="acts">').concat(acts.join(""), "</div></div>");
    }).join("");
    const meds = ["bandage", "dband", "medkit", "painkill", "antisep", "splint"].filter((id) => cnt(G.inv, id));
    const human = alive.some((e) => ENEMY[e.id].human);
    const lg = cb.log.slice(-8).map((x) => '<div class="lg '.concat(x.c || "", '">').concat(esc(x.t), "</div>")).join("");
    const fresh = !$("modal").querySelector(".combat");
    $("modal").innerHTML = '<div class="overlay"><div class="sheet bad combat '.concat(fresh ? "anim" : "", '" role="dialog" aria-modal="true">\n      <div class="sechead"><h2>⚔️ Бой · ход ').concat(cb.turn, '</h2><span class="mono muted">❤️ ').concat(healthPct(), "% · ⚡").concat(Math.round(G.ch.energy)).concat(bleeding() ? " · 🩸" : "", '</span></div>\n      <div class="list">').concat(enemies, "</div>\n      ").concat(lg ? '<div class="clog" id="clog">'.concat(lg, "</div>") : "", '\n      <div class="acts">').concat(alive.every((e) => e.dist > (ms.reach ? 1 : 0)) ? mbtn("⏳ Ждать, пока подойдут", () => {
      G.combat.log.push({ t: "⏳ Ты ждёшь, сжимая оружие…", c: "dim" });
      endPlayerTurn();
    }) : "").concat(mbtn("🏃 Бежать (".concat(Math.round(fleeChance() * 100), "%)"), pFlee)).concat(human ? mbtn("🤝 Договориться", pTalk) : "").concat(G.coop && COOP.status === "online" && !G.combat.called ? mbtn("📣 Позвать на помощь", () => {
      G.combat.called = true;
      COOP.ping("Нужна помощь! Я в бою.");
      combat();
    }) : "").concat(meds.map((id) => mbtn("".concat(IT(id).ic, " ").concat(IT(id).n), () => pUse(id), "sm")).join(""), '</div>\n      <p class="muted" style="font-size:12.5px">Бить можно только тех, кто вплотную').concat(ms.reach ? " (копьём — и тех, кто рядом)" : "", ". 🦶 — оттолкнуть и оглушить. Выстрелы шумят и привлекают других.</p>\n    </div></div>");
    const cl = $("clog");
    if (cl) cl.scrollTop = 1e9;
    renderTop();
  }
  function allyStrike(f, owner, i, gun) {
    const e = f.en[i];
    if (!e || e.hp <= 0) return;
    const D = ENEMY[e.id], ms = meleeStats(), w = curWeapon();
    let dmg = 0, txt = "", stun = 0;
    if (gun) {
      if (!w || w.c !== "gun" || !cnt(G.inv, w.ammo)) return toast("Нет патронов.");
      if (!ch(mod("ammoSave"))) take(G.inv, w.ammo, 1);
      SND(w.spread ? "shotgun" : "shot");
      noise(w.noise * mul("gunNoise", 0.2));
      xp("shoot", 3);
      if (ch(w.acc + skill("shoot") * 0.05 - e.dist * 0.08 + accMods() + mod("gunAcc"))) {
        dmg = Math.max(1, Math.round(R(w.dmg[0], w.dmg[1]) * (1 + skill("shoot") * 0.06) - (D.arm || 0) * 0.5));
        stun = ch(0.3) ? 1 : 0;
        txt = "🔫 попадает в ".concat(D.n, ": −").concat(dmg);
      } else txt = "🔫 мимо ".concat(D.n);
    } else {
      if (e.dist > (ms.reach ? 1 : 0)) return toast("Слишком далеко для удара.");
      if (ch(0.72 + skill("melee") * 0.04 + accMods() + mod("meleeAcc"))) {
        let d = R(ms.dmg[0], ms.dmg[1]) * (1 + skill("melee") * 0.08) * mul("meleeDmg", 0.3);
        if (ch(0.08 + skill("melee") * 0.02 + mod("crit"))) d *= 1.6;
        dmg = Math.max(1, Math.round(d - (D.arm || 0)));
        txt = "⚔️ бьёт ".concat(D.n, " (").concat(ms.n, "): −").concat(dmg);
        damageWeapon(R(1, 3));
        xp("melee", 2);
        SND("hit");
      } else {
        txt = "⚔️ промах по ".concat(D.n);
        SND("miss");
      }
    }
    st.allySent = owner + ":" + f.turn;
    COOP.allyAct(owner, { i, dmg, stun, txt });
    allyFight(f, owner);
    save();
  }
  function allyFight(f, owner) {
    if (G.combat || full) return;
    allyOpen = true;
    MACT = [];
    const ms = meleeStats(), w = curWeapon(), gun = w && w.c === "gun";
    const DIST = ["вплотную", "рядом", "далеко"], sent = st.allySent === owner + ":" + f.turn;
    const enemies = (f.en || []).map((e, i) => {
      const D = ENEMY[e.id] || ENEMY.zombie;
      if (e.hp <= 0) return '<div class="enemy dead">'.concat(ART.enemyImg(e.id), "<div>").concat(D.n, " ☠️</div><span></span></div>");
      const acts = [];
      if (!sent) {
        if (e.dist <= (ms.reach ? 1 : 0)) acts.push(mbtn("⚔️ ".concat(esc(ms.n)), () => allyStrike(f, owner, i), "pri sm"));
        if (gun) acts.push(mbtn("🔫 (".concat(cnt(G.inv, w.ammo), ")"), () => allyStrike(f, owner, i, true), "sm", !cnt(G.inv, w.ammo)));
      }
      return '<div class="enemy">'.concat(ART.enemyImg(e.id, e.stun ? "stun" : ""), '<div><div class="t">').concat(D.n).concat(e.stun ? " 💫" : "", "</div>").concat(bar(e.hp, e.max), '<span class="dist">').concat(DIST[Math.min(2, e.dist)], '</span></div><div class="acts">').concat(acts.join(""), "</div></div>");
    }).join("");
    const lg = (f.log || []).slice(-8).map((x) => '<div class="lg '.concat(x.c || "", '">').concat(esc(x.t), "</div>")).join("");
    const band = ["bandage", "dband"].find((id) => cnt(G.inv, id));
    $("modal").innerHTML = '<div class="overlay"><div class="sheet combat" role="dialog" aria-modal="true">\n      <div class="sechead"><h2>🤝 Бой '.concat(esc(f.name), " · ход ").concat(f.turn, '</h2><span class="mono muted">❤️ ').concat(healthPct(), "%").concat(bleeding() ? " · 🩸" : "", '</span></div>\n      <div class="list">').concat(enemies, "</div>").concat(lg ? '<div class="clog" id="clog">'.concat(lg, "</div>") : "", '\n      <p class="muted" style="font-size:12.5px">').concat(sent ? "⏳ Твой ход отправлен — он сработает, когда ходит ".concat(esc(f.name), ".") : "Твой удар сработает в начале хода врагов. Враги могут бить и тебя.", '</p>\n      <div class="acts">').concat(band && bleeding() ? mbtn("🩹 Перевязаться", () => {
      useItem(band, true);
      allyFight(f, owner);
    }) : "").concat(mbtn("🏃 Выйти из боя", () => COOP.leaveFight()), "</div></div></div>");
    const cl = $("clog");
    if (cl) cl.scrollTop = 1e9;
    renderTop();
  }
  function allyFightEnd(res) {
    if (!allyOpen) return;
    allyOpen = false;
    st.allySent = null;
    $("modal").innerHTML = "";
    if (res === "win") {
      xp("melee", 3);
      log("⚔️ Бой выигран вместе с другом!", "good");
      toast("⚔️ Победа!");
    } else if (res === "left") log("🏃 Ты вышел из боя друга.");
    else if (res) log("⚔️ Бой друга закончился.");
    setAct("осматривается");
    save();
    showNext();
    render();
  }
  function closeCombat(res, cb) {
    if (full) return;
    $("modal").innerHTML = "";
    if (cb && cb.log.length) {
      const k = cb.log.filter((x) => x.t.startsWith("☠️")).length;
      log(res === "win" ? "⚔️ Бой выигран".concat(k ? ", повержено: ".concat(k) : "", ".") : res === "fled" ? "🏃 Ты сбежал из боя." : res === "talk" ? "🤝 Разошлись миром." : "⚔️ Бой окончен.", res === "win" || res === "talk" ? "good" : "warn");
    }
    cur = null;
    if (full) return;
    showNext();
    render();
  }
  function horde(power) {
    event({ horde: power, wave: 0, txt: [] });
  }
  function hordeSheet(h) {
    MACT = [];
    const w = curWeapon(), gun = w && w.c === "gun" && cnt(G.inv, w.ammo);
    const wp = h.power / 3 * RF(0.85, 1.2);
    let body;
    if (h.wave < 3 && !G.dead) {
      body = '<div class="txt">'.concat(h.wave === 0 ? "Из темноты накатывает рёв. Орда идёт на базу. Натиск ≈ ".concat(h.power, ", твоя защита ").concat(defense(), ".\n\n") : "").concat(esc(h.txt.join("\n\n")), "</div><h3>Волна ").concat(h.wave + 1, ' из 3. Что делаешь?</h3>\n      <div class="choices">').concat(mbtn("🔫 Стрелять с крыши".concat(gun ? " (".concat(cnt(G.inv, w.ammo), " патр.)") : " — нет огнестрела/патронов"), () => step("shoot"), "pri", !gun)).concat(mbtn("⚔️ Держать проход (".concat(esc(meleeStats().n), ") — рискованно"), () => step("melee"))).concat(mbtn("🕳️ Спрятаться в подвале — стены примут удар", () => step("hide")), "</div>");
    } else body = '<div class="txt">'.concat(esc(h.txt.join("\n\n")), '\n\n🌅 Небо светлеет. Орда откатывается в лес.</div><div class="choices">').concat(mbtn("Пережил", () => {
      cur = null;
      $("modal").innerHTML = "";
      save();
      showNext();
      render();
    }, "pri"), "</div>");
    function step(c) {
      const deaths = G.w.deaths.length;
      const r = hordeWave(c, wp);
      h.txt.push("— Волна ".concat(h.wave + 1, " —\n") + r);
      h.wave++;
      if (G.w.deaths.length === deaths) advance(80);
      if (G.dead) return;
      if (G.w.deaths.length !== deaths) {
        cur = null;
        $("modal").innerHTML = "";
        save();
        showNext();
        render();
        return;
      }
      hordeSheet(h);
      renderTop();
    }
    $("modal").innerHTML = '<div class="overlay"><div class="sheet bad" role="dialog" aria-modal="true"><h2>🌕 Кровавая ночь</h2>'.concat(body, "</div></div>");
  }
  function showFull(html) {
    const old = $("modal").querySelector(".full"), oldT = old && (old.querySelector(".title") || {}).textContent, sc = old ? [old.scrollTop, (old.querySelector(".inner") || {}).scrollTop || 0, window.scrollY || 0] : null;
    full = true;
    MACT = [];
    const h = html();
    $("modal").innerHTML = '<div class="full"><div class="inner">'.concat(h, "</div></div>");
    ART.paintAll($("modal"));
    const nw = $("modal").querySelector(".full");
    if (sc && nw && (nw.querySelector(".title") || {}).textContent === oldT) {
      nw.scrollTop = sc[0];
      const inr = nw.querySelector(".inner");
      if (inr) inr.scrollTop = sc[1];
      if (sc[2]) window.scrollTo(0, sc[2]);
    }
  }
  function closeFull() {
    full = null;
    $("modal").innerHTML = "";
    showNext();
    render();
  }
  const sel = { mode: "survivor", traits: [], name: "", prof: "unemployed" };
  function cpts(o) {
    const P = PROFS[o.prof] || PROFS.unemployed;
    return P.pts - o.traits.reduce((a2, t) => a2 + TRAITS[t].cost, 0);
  }
  function toggleTrait(o, k) {
    if (o.traits.includes(k)) o.traits = o.traits.filter((x) => x !== k);
    else {
      const g = TRAITS[k].g;
      o.traits = o.traits.filter((x) => !g || TRAITS[x].g !== g).concat(k);
    }
  }
  function randBuild(o) {
    const sh = (a2) => {
      a2 = a2.slice();
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    };
    const pk = Object.keys(PROFS);
    o.prof = pk[Math.floor(Math.random() * pk.length)];
    o.traits = [];
    const fits = (k) => {
      const g = TRAITS[k].g;
      return !o.traits.includes(k) && !(g && o.traits.some((x) => TRAITS[x].g === g));
    };
    const neg = sh(Object.keys(TRAITS).filter((k) => TRAITS[k].cost < 0)), pos = sh(Object.keys(TRAITS).filter((k) => TRAITS[k].cost > 0));
    const nNeg = Math.floor(Math.random() * 3);
    for (const k of neg) {
      if (o.traits.length >= nNeg) break;
      if (fits(k)) o.traits.push(k);
    }
    let nPos = 1 + Math.floor(Math.random() * 3);
    for (const k of pos) {
      if (!nPos) break;
      if (fits(k) && cpts(o) - TRAITS[k].cost >= 0) {
        o.traits.push(k);
        nPos--;
      }
    }
    if (cpts(o) < 0) o.traits = [];
  }
  function charBuilder(o, draw) {
    o.prof = o.prof || "unemployed";
    const P = PROFS[o.prof], left = cpts(o);
    const skl = (sk) => Object.entries(sk || {}).map(([k, v]) => "".concat(SKILLS[k].ic).concat(v > 0 ? "+" : "").concat(v)).join(" ");
    const tbtn = ([k, T2]) => '<button class="trait '.concat(o.traits.includes(k) ? "on" : "", '" onclick="').concat(m(() => {
      toggleTrait(o, k);
      draw();
    }), '"><span class="tn"><span>').concat(T2.ic, " ").concat(T2.n, '</span><span class="mono ').concat(T2.cost > 0 ? "warn" : "good", '">').concat(T2.cost > 0 ? "−" + T2.cost : "+" + -T2.cost, '</span></span><span class="muted">').concat(esc(T2.d)).concat(T2.sk ? " · " + skl(T2.sk) : "", "</span></button>");
    let h = '<div class="acts" style="justify-content:center;margin:6px 0"><button class="btn" onclick="'.concat(m(() => {
      randBuild(o);
      draw();
    }), '">🎲 Случайный билд</button></div><h2>Профессия</h2><div class="traits">').concat(Object.entries(PROFS).map(([k, Q]) => '<button class="trait '.concat(o.prof === k ? "on" : "", '" onclick="').concat(m(() => {
      o.prof = k;
      draw();
    }), '"><span class="tn"><span>').concat(Q.ic, " ").concat(Q.n, '</span><span class="mono ').concat(Q.pts >= 4 ? "good" : Q.pts < 0 ? "bad" : "", '">').concat(Q.pts, ' оч.</span></span><span class="muted">').concat(esc(Q.d)).concat(Q.sk ? " · " + skl(Q.sk) : "", "</span></button>")).join(""), "</div>");
    h += '<div class="sechead"><h2>Черты</h2><span class="mono '.concat(left < 0 ? "bad" : "good", '">очки: ').concat(left, '</span></div><p class="muted" style="font-size:13px">').concat(P.ic, " ").concat(P.n, " даёт ").concat(P.pts, " оч. Плюсы стоят очков, минусы их дают. Итог не может быть меньше нуля. Похожие черты взаимоисключают друг друга.</p>");
    const T = Object.entries(TRAITS);
    h += '<h3>Плюсы</h3><div class="traits">'.concat(T.filter(([, x]) => x.cost > 0).map(tbtn).join(""), '</div><h3>Минусы</h3><div class="traits">').concat(T.filter(([, x]) => x.cost < 0).map(tbtn).join(""), "</div>");
    return h;
  }
  function slotPicker(draw) {
    return '<h2>Сохранения</h2><div class="traits">'.concat([1, 2, 3].map((n) => {
      const i = slotInfo(n);
      return '<button class="trait '.concat(n === SAVE_SLOT ? "on" : "", '" onclick="').concat(m(async () => {
        if (n === SAVE_SLOT) return;
        setSlot(n);
        if (window.TGA && TGA.syncSlot) {
          toast("Загружаю слот…");
          await TGA.syncSlot();
        }
        draw();
      }), '"><span class="tn"><span>💾 Слот ').concat(n, '</span><span class="mono">').concat(n === SAVE_SLOT ? "выбран" : "", '</span></span><span class="muted">').concat(i ? "".concat(esc(i.name || "?"), " · ").concat(MODES[i.mode] ? MODES[i.mode].ic + " " + MODES[i.mode].n : "", " · день ").concat(i.day).concat(i.coop ? " · 🤝 общий мир" : "").concat(i.dead ? " · ☠️" : "") : "пусто — новая игра", "</span></button>");
    }).join(""), "</div>");
  }
  function exportScreen() {
    let raw = "";
    try {
      raw = localStorage.getItem(SAVE_KEY) || "";
    } catch (e) {
    }
    showFull(() => '<div class="title"><small>РЕЗЕРВНАЯ КОПИЯ · СЛОТ '.concat(SAVE_SLOT, '</small>Экспорт</div><p class="muted">Это весь твой мир одним текстом. Скопируй и сохрани (например, отправь себе в «Избранное» в Телеграме) или скачай файлом.</p>\n      <textarea id="expd" readonly style="width:100%;height:160px;font-family:var(--f-mono);font-size:11px">').concat(esc(raw), '</textarea>\n      <div class="acts">').concat(mbtn("📋 Скопировать", () => {
      const t = $("expd");
      t.select();
      try {
        navigator.clipboard.writeText(raw).then(() => toast("Скопировано"), () => {
          document.execCommand("copy");
          toast("Скопировано");
        });
      } catch (e) {
        document.execCommand("copy");
        toast("Скопировано");
      }
    }, "pri")).concat(mbtn("💾 Скачать файл", () => {
      const fname = "mystery-island-slot".concat(SAVE_SLOT, "-day").concat(day(), ".json");
      if (tgDownload(raw, fname)) return;
      try {
        const a0 = document.createElement("a");
        a0.href = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
        a0.download = "mystery-island-slot".concat(SAVE_SLOT, "-day").concat(day(), ".json");
        document.body.appendChild(a0);
        a0.click();
        a0.remove();
      } catch (e) {
        toast("Скачивание недоступно — скопируй текст");
      }
    })).concat(mbtn("Закрыть", closeFull), "</div>"));
  }
  function syncScreen() {
    if (!window.SYNC) return toast("Синхронизация недоступна в этой версии.");
    const draw = (code, msg) => showFull(() => '<div class="title"><small>ТЕЛЕФОН ↔ ПК</small>Код персонажа</div>\n      <p class="muted">Открой игру на другом устройстве — в Телеграме или в браузере: <b>'.concat(esc(location.origin + location.pathname), '</b> → «🔗 Войти по коду» и введи код. Дальше прогресс сам переносится туда, где ты играл последним.</p>\n      <div style="font:600 32px/1.2 var(--f-mono);letter-spacing:3px;text-align:center;padding:14px;border:2px dashed var(--line);border-radius:10px;user-select:all">').concat(code ? esc(SYNC.fmt(code)) : "…", "</div>\n      ").concat(msg ? '<p class="muted">'.concat(esc(msg), "</p>") : "", '\n      <p class="muted" style="font-size:13px">⚠️ Не играй одновременно на двух устройствах — сохранится то, что было позже. Никому не давай код: по нему можно открыть твоего персонажа.</p>\n      <div class="acts">').concat(mbtn("Готово", closeFull, "pri")).concat(code ? mbtn("Отвязать код", () => {
      SYNC.unlink();
      closeFull();
      toast("Код отвязан.");
    }) : "", "</div>"));
    draw(G.syncCode, G.syncCode ? "" : "Создаю код…");
    SYNC.link().then((c) => draw(c, "Сохранение отправлено на сервер."), () => draw(G.syncCode, "Нет связи с сервером — попробуй ещё раз позже."));
  }
  function enterCodeScreen(back) {
    if (!window.SYNC) return toast("Синхронизация недоступна в этой версии.");
    showFull(() => '<div class="title"><small>СЛОТ '.concat(SAVE_SLOT, '</small>Войти по коду</div>\n      <p class="muted">Код персонажа берётся на другом устройстве: Журнал → «🔗 Играть на другом устройстве».</p>\n      <input type="text" id="scode" maxlength="9" placeholder="K7QX-M2PA" style="font:600 22px var(--f-mono);letter-spacing:2px;text-transform:uppercase">\n      ').concat(slotInfo(SAVE_SLOT) ? '<p class="bad">Мир в этом слоте заменится персонажем с кода.</p>' : "", '\n      <p id="smsg" class="muted"></p>\n      <div class="acts">').concat(mbtn("🔗 Войти", () => {
      const m2 = $("smsg");
      m2.textContent = "Загружаю…";
      SYNC.enter($("scode").value).then((v) => {
        closeFull();
        if (G.coop && window.COOP) COOP.init();
        toast("Загружен ".concat(v.name || "персонаж", ", день ").concat(v.day || "?", "."));
      }, (e) => {
        m2.textContent = e.message || "Ошибка связи.";
      });
    }, "pri")).concat(mbtn("Назад", () => startScreen()), "</div>"));
  }
  function importScreen() {
    const doImport = (txt) => {
      try {
        let s0 = JSON.parse(String(txt || "").trim());
        for (let k = 0; k < 3 && typeof s0 === "string"; k++) s0 = JSON.parse(s0);
        if (s0 && typeof s0.raw === "string") s0 = JSON.parse(s0.raw);
        if (!s0 || s0.v !== 3 || !s0.ch || !s0.w) return toast("Это не сохранение игры.");
        localStorage.setItem(SAVE_KEY, JSON.stringify(s0));
        if (load()) {
          save();
          closeFull();
          toast("Мир загружен в слот ".concat(SAVE_SLOT));
          render();
          if (G.coop) COOP.init();
        }
      } catch (e) {
        toast("Не получилось прочитать сохранение.");
      }
    };
    showFull(() => '<div class="title"><small>СЛОТ '.concat(SAVE_SLOT, '</small>Импорт</div><p class="bad">Текущий мир в этом слоте будет заменён.</p><p class="muted">Вставь текст резервной копии или выбери файл.</p>\n      <textarea id="impd" style="width:100%;height:140px;font-family:var(--f-mono);font-size:11px" placeholder=\'{"v":3,…}\'></textarea>\n      <input type="file" id="impf" accept=".json,application/json,text/plain">\n      <div class="acts">').concat(mbtn("📥 Загрузить", () => {
      const f = $("impf");
      if (f && f.files && f.files[0]) {
        const rd = new FileReader();
        rd.onload = () => doImport(rd.result);
        rd.readAsText(f.files[0]);
      } else doImport($("impd").value);
    }, "pri")).concat(mbtn("Отмена", closeFull), "</div>"));
  }
  function tgDownload(raw, fname) {
    const W = window.Telegram && Telegram.WebApp;
    let ok = false;
    try {
      ok = !!(W && W.downloadFile && W.isVersionAtLeast && W.isVersionAtLeast("8.0") && W.platform && W.platform !== "unknown" && window.FB && FB.init);
    } catch (e) {
    }
    if (!ok) return false;
    toast("Готовлю файл…");
    (async () => {
      try {
        await FB.init();
        const id = "X" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase(), path = "d/sync/" + id + "/_";
        const r = firebase.database().ref(path);
        await r.set(raw);
        const tok = await firebase.auth().currentUser.getIdToken();
        const url = firebase.database().app.options.databaseURL.replace(/\/$/, "") + "/" + path + ".json?auth=" + encodeURIComponent(tok);
        W.downloadFile({ url, file_name: fname }, (accepted) => {
          setTimeout(() => r.remove().catch(() => {
          }), accepted ? 12e4 : 1e3);
        });
      } catch (e) {
        toast("Не получилось скачать — скопируй текст и отправь себе в «Избранное».");
      }
    })();
    return true;
  }
  function startScreen(cont) {
    const pts = () => cpts(sel);
    const draw = () => showFull(() => {
      let h = "".concat(ART.sceneTag({ loc: cont ? "base" : "lighthouse", key: "title", title: true, alt: "Остров на закате" }), '<div class="title"><small>').concat(cont ? "ОСТРОВ ЖДЁТ НОВОГО" : "ВЫЖИВАНИЕ · С 2020 ГОДА", "</small>").concat(cont ? "Новый выживший" : "Mystery of the Island", "</div>");
      if (!cont) {
        h += '<p class="muted">Ты очнулся в лодочном сарае на острове, закрытом на карантин. Заражённые, аномалии, Выбросы и Кровавые ночи. Где-то в глубине острова — Аппарат, с которого всё началось.</p>';
        h += slotPicker(draw);
        h += '<div class="acts">'.concat(localHas() ? mbtn("▶ Продолжить игру", () => {
          if (load()) {
            if (G.dead) return deathScreen(G.w.deaths[G.w.deaths.length - 1] || {});
            closeFull();
            if (G.coop) COOP.init();
          }
        }, "pri") : "").concat(window.TGA && !window.claude ? "" : mbtn("🤝 Присоединиться к другу", joinScreen)).concat(window.SYNC ? mbtn("🔗 Войти по коду", () => enterCodeScreen()) : "", "</div>");
        h += '<h2>Сложность</h2><div class="modes">'.concat(Object.entries(MODES).map(([k, M]) => '<button class="mode '.concat(sel.mode === k ? "on" : "", '" onclick="').concat(m(() => {
          sel.mode = k;
          draw();
        }), '"><span class="sechead"><h3>').concat(M.ic, " ").concat(M.n, '</h3><span class="muted" style="font-size:12.5px">').concat(M.tag, "</span></span><ul>").concat(M.rules.map((r) => "<li>".concat(esc(r), "</li>")).join(""), "</ul></button>")).join(""), "</div>");
        if (typeof CUI !== "undefined" && CUI.startMods) h += CUI.startMods(sel, m, draw);
      } else h += '<p class="muted">Прошлый выживший погиб. Мир остался прежним: база, склад и всё построенное ждут тебя.</p>';
      h += '<h2>Имя</h2><input type="text" id="pname" maxlength="24" placeholder="Как тебя звать?" value="'.concat(esc(sel.name), '" oninput="UI._name(this.value)">');
      h += charBuilder(sel, draw);
      h += '<div class="acts">'.concat(mbtn(cont ? "Высадиться на остров" : "Начать", () => {
        const nm = (sel.name || "").trim() || "Выживший";
        if (pts() < 0) return toast("Не хватает очков: убери плюс или добавь минус.");
        if (!cont && localHas() && !sel.ow) {
          sel.ow = true;
          return toast("В слоте ".concat(SAVE_SLOT, " уже есть мир. Нажми «Начать» ещё раз, чтобы перезаписать, или выбери пустой слот."));
        }
        sel.ow = false;
        if (cont) {
          continueWorld(nm, sel.traits.slice(), sel.prof);
        } else {
          newGame(sel.mode, nm, sel.traits.slice(), sel.prof);
          if (sel.mods && Object.keys(sel.mods).length) {
            G.w.flags.mods = Object.assign({}, sel.mods);
            save();
          }
          intro();
        }
        setTimeout(checkPerks, 300);
        sel.traits = [];
        closeFull();
        st.tab = "loc";
      }, "pri"), "</div>");
      return h;
    });
    draw();
  }
  const jsel = { code: "", name: "", traits: [], err: "", busy: false, prof: "unemployed" };
  function joinScreen() {
    const pts = () => cpts(jsel);
    const draw = () => showFull(() => '<div class="title"><small>КООПЕРАТИВ</small>Присоединиться к другу</div>\n      '.concat(FBM() ? '<p class="muted">Ты войдёшь в мир друга своим персонажем: база, склад, сюжет и время — общие, рюкзак — твой.</p>'.concat(localHas() && !(G && G.coop) ? '<p class="muted">Твоя одиночная игра не пропадёт: выйти из общего мира и вернуться к ней можно в Журнале → Кооператив.</p>' : "") : '<p class="muted">Друг создаёт общий мир в своей игре (Журнал → Кооператив) и присылает код. Чтобы ты мог играть, он должен пригласить тебя к этой странице через «Поделиться» с правом редактора. Ты войдёшь в его мир своим персонажем: база, склад и сюжет общие.</p>', '\n      <h2>Код мира</h2><input type="text" id="jcode" maxlength="8" placeholder="Например, K7QX2M" value="').concat(esc(jsel.code), '" oninput="UI._j(\'code\', this.value)" style="text-transform:uppercase;font-family:var(--f-mono);letter-spacing:.15em">\n      <h2>Имя персонажа</h2><input type="text" id="jname" maxlength="24" placeholder="Как тебя звать?" value="').concat(esc(jsel.name), '" oninput="UI._j(\'name\', this.value)">\n      ').concat(charBuilder(jsel, draw), "\n      ").concat(jsel.err ? '<p class="bad">'.concat(esc(jsel.err), "</p>") : "", '\n      <div class="acts">').concat(mbtn(jsel.busy ? "Подключаюсь…" : "Войти в мир", async () => {
      if (jsel.busy) return;
      if (pts() < 0) return toast("Не хватает очков.");
      jsel.busy = true;
      jsel.err = "";
      draw();
      const err = await COOP.join(jsel.code, (jsel.name || "").trim() || "Выживший", jsel.traits.slice(), jsel.prof);
      jsel.busy = false;
      if (err) {
        jsel.err = err;
        draw();
        return;
      }
      closeFull();
      st.tab = "loc";
      if (G.w.struct.fire || day() > 2) {
        G.tut.on = false;
        save();
      }
      event({ title: "🤝 Ты в мире друга", text: "Ты высадился у Лодочной станции — это ваша общая база.\n\n🏚️ Общее: база, склад, постройки, задания, время и погода.\n🎒 Твоё: персонаж, рюкзак и деньги.\n\n👥 Вверху — панель отряда. Нажми на друга: увидишь, где он и чем занят, сможешь пойти к нему или передать вещь.\n📣 Журнал → Кооператив: сигналы вроде «Нужна помощь!», чат и лента событий отряда.\n⚔️ Если вы в одной локации — деретесь вместе.", choices: [{ t: "Понятно" }] });
      setTimeout(() => {
        try {
          const f = COOP.others().filter((p) => p.online && p.alive !== false)[0];
          if (!f || !G || f.loc === G.loc || !LOCS[f.loc]) return;
          event({ title: "👋 ".concat(f.name || "Друг", " сейчас здесь: ").concat(LOCS[f.loc].ic, " ").concat(LOCS[f.loc].n), text: "".concat(f.act ? "Занят: " + f.act + ".\n\n" : "", "Можно сразу отправиться к нему — маршрут построится сам. Или сначала осмотрись на базе и загляни в общий склад."), choices: [{ t: "🧭 Идти к другу", fn: () => goTo(f.loc) }, { t: "Сначала осмотрюсь" }] });
        } catch (e) {
        }
      }, 1800);
    }, "pri", jsel.busy)).concat(mbtn("Назад", () => startScreen()), "</div>"));
    draw();
  }
  function localHas() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      return !!(s && s.v === 3);
    } catch (e) {
      return false;
    }
  }
  function intro() {
    event({ title: "🙂 Я смотрю, ты уже очнулся?", text: "«Я тебя притащил сюда, в безопасное место. Я Семёныч, живу в деревне на юге. Тебя выбросило на берег после шторма.\n\nОстров на карантине. Мёртвые ходят. Небо иногда краснеет — тогда прячься под крышу. А раз в неделю, в полнолуние, они идут толпой. Укрепи этот сарай.\n\nНачни с простого: разведи огонь, сделай нормальную лежанку. Дрова — в лесу. Заходи ко мне в деревню, если что.»\n\nПодсказки:\n• 📍 Место — обыскивай комнаты, 🗺️ Карта — путешествуй.\n• 🐾 Крадучись — медленнее, но враги реже замечают.\n• Время идёт от каждого действия. Следи за едой, водой и сном.\n• Воду набирай в бутылки. Морскую надо опреснить, из ручья и колодца — вскипятить.", choices: [{ t: "Встать и осмотреться" }] });
  }
  function deathScreen(d) {
    showFull(() => '<div class="title"><small>КОНЕЦ ИСТОРИИ</small>☠️ '.concat(esc(d.name || ""), "</div>\n      <p>Причина смерти: <b>").concat(esc(d.cause || "—"), '</b>.</p><p class="mono">Прожил дней: ').concat(d.days || 0, " · убито врагов: ").concat(d.kills || 0, "</p>\n      ").concat(G && G.w.deaths.length > 1 ? '<div class="sec"><h2>Те, кто был до</h2><div class="list">'.concat(G.w.deaths.slice(0, -1).map((x) => '<div class="row"><div class="grow"><span class="t">'.concat(esc(x.name), '</span><span class="s">').concat(x.days, " дн. · ").concat(esc(x.cause), "</span></div></div>")).join(""), "</div></div>") : "", '\n      <p class="muted">Вещи остались на теле. Мир, база и склад — на месте.</p>\n      <div class="acts">').concat(mbtn("Новый выживший в этом мире", () => startScreen(true), "pri")).concat(mbtn("Начать мир заново", () => {
      wipe();
      G = null;
      startScreen();
    }), "</div>"));
  }
  function ending(choice, d) {
    const txt = choice === "off" ? "Ты вырываешь ядро и бьёшь его о бетон. Синий свет гаснет. Впервые за месяцы над островом обычное серое небо.\n\nЧерез три дня у пристани появляется катер с красным крестом. Семёныч машет с берега — он остаётся. «Это мой дом».\n\nКонцовка: «Тишина»." : "Ты вынимаешь ядро. Оно тёплое и бьётся, как сердце. Аппарат умирает, но остров вздрагивает — и где-то в глубине просыпается что-то большее.\n\nВыбросы станут сильнее. Аномалии — богаче. Ты держишь в руках ключ от Мастер-режима.\n\nКонцовка: «Мастер». Продолжение — во второй главе.";
    showFull(() => '<div class="title"><small>ФИНАЛ ДЕМО</small>'.concat(choice === "off" ? "Тишина" : "Мастер", '</div><p style="white-space:pre-wrap">').concat(esc(txt), '</p><p class="mono">').concat(esc(d.name), " · дней на острове: ").concat(d.days, " · врагов: ").concat(d.kills, " · записок: ").concat(G.w.notes.length, "/").concat(Object.keys(NOTES).length, '</p>\n      <div class="acts">').concat(choice === "take" ? mbtn("🔮 Глава 2 «Мастер»", () => {
      closeFull();
      startCh2();
    }, "pri") : "").concat(mbtn("Продолжить исследовать остров", closeFull, choice === "take" ? "" : "pri")).concat(mbtn("Новая игра", () => {
      wipe();
      G = null;
      startScreen();
    }), "</div>"));
  }
  function ending2Screen(choice, d) {
    const txt = choice === "seal" ? "Ты вынимаешь ядро из двигателя и вкладываешь его в Сердце. Кристаллы вокруг гаснут один за другим, как свечи. Шпиль замолкает.\n\nНа обратном пути лодка идёт на одних вёслах. Над островом впервые за месяцы — обычное небо. Выбросов больше не будет. Кристаллиды рассыпаются в пыль.\n\nСемёныч встречает тебя на пристани: «Ну что, отвоевался? Пошли, уха стынет»." : "Ты кладёшь ладонь на Сердце — и оно отрывается от кокона само, будто ждало тебя. Тяжёлое, холодное, живое.\n\nОстров вздыхает. Аномалии тянутся к тебе, кристаллиды расступаются. Выбросы не прекратятся — но теперь это твоя буря.\n\nСердце острова у тебя в рюкзаке. Мастер вернулся.";
    showFull(() => '<div class="title"><small>ФИНАЛ ГЛАВЫ 2</small>'.concat(choice === "seal" ? "Сон" : "Мастер острова", '</div><p style="white-space:pre-wrap">').concat(esc(txt), '</p><p class="mono">').concat(esc(d.name), " · дней на острове: ").concat(d.days, " · врагов: ").concat(d.kills, " · записок: ").concat(G.w.notes.length, "/").concat(Object.keys(NOTES).length, '</p>\n      <p class="muted">Спасибо, что прошёл историю «Mystery of the Island». Мир остаётся с тобой — можно играть дальше, строить базу и звать друзей.</p>\n      <div class="acts">').concat(mbtn("Продолжить", closeFull, "pri")).concat(mbtn("Новая игра", () => {
      wipe();
      G = null;
      startScreen();
    }), "</div>"));
  }
  function boot() {
    const inv = window.TGA && String(TGA.startParam || "").toUpperCase();
    if (inv && /^[A-Z0-9]{4,8}$/.test(inv) && FBM()) {
      const same = [1, 2, 3].find((n) => (slotInfo(n) || {}).coop === inv);
      if (same && same !== SAVE_SLOT) setSlot(same);
      else if (!same && slotInfo(SAVE_SLOT)) {
        const free = [1, 2, 3].find((n) => !slotInfo(n));
        if (free) setSlot(free);
      }
      const had = load();
      if (!(had && G.coop && G.coop.code === inv)) {
        jsel.code = inv;
        jsel.name = had && !G.dead ? G.ch.name : String(TGA.user && TGA.user.first_name || "").slice(0, 24);
        return joinScreen();
      }
    }
    if (load()) {
      if (G.dead) deathScreen(G.w.deaths[G.w.deaths.length - 1] || {});
      else {
        render();
        if (G.coop) COOP.init();
        setTimeout(dailyBonus, 400);
        setTimeout(checkPerks, 900);
        setTimeout(() => PVP.inbox(), 1500);
      }
    } else startScreen();
  }
  return {
    btn,
    mbtn,
    run,
    mrun,
    log,
    toast,
    render,
    go,
    event,
    combat,
    closeCombat,
    horde,
    lockMenu,
    deathScreen,
    ending,
    ending2: ending2Screen,
    boot,
    startScreen,
    allyFight,
    allyFightEnd,
    _name: (v) => {
      sel.name = v;
    },
    _st: st,
    _j: (k, v) => {
      jsel[k] = v;
    },
    _chat: sendChat
  };
})();
(() => {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    try {
      UI.boot();
    } catch (e) {
      console.error(e);
      UI.startScreen();
    }
  };
  setTimeout(go, 12e3);
  let p0;
  try {
    p0 = window.TGA ? TGA.before() : Promise.resolve();
  } catch (e) {
    p0 = Promise.resolve();
  }
  p0 = Promise.resolve(p0).catch(() => {
  }).then(() => window.SYNC ? Promise.race([SYNC.before(), new Promise((r) => setTimeout(r, 5e3))]) : null);
  Promise.resolve(p0).then(go, go);
})();
