"use strict";
const COOP = (() => {
  let db = null, user = null, uid = null, avail = null;
  let code = null, ready = false, status = "off";
  let subs = [], timer = null, pushing = false, again = false, rTimer = null;
  const fightToasted = {};
  let fights = {}, joined = null, hitSeen = 0, pending = [], actsSeen = {}, fightPushT = null, hitN = 0;
  let feedL = [], chatLoaded = false, feedLoaded = false;
  let kicked = {}, slog = [];
  let players = {}, chat = [], lastMe = "", lastMeAt = 0, lastPersonal = "", unread = 0;
  const sent = {};
  let stashBase = null, stashTx = false, stashLate = null;
  const sKey = (e) => {
    const o = Object.assign({}, e);
    delete o.n;
    return canon(o);
  };
  function sCount(list) {
    const m = /* @__PURE__ */ new Map();
    for (const e of list || []) {
      if (!e || !e.id) continue;
      const k = sKey(e);
      const c = m.get(k);
      if (c) c.n += e.n || 1;
      else m.set(k, { n: e.n || 1, e });
    }
    return m;
  }
  function sDiff(L, B) {
    const a = sCount(L), b = sCount(B), d = /* @__PURE__ */ new Map();
    for (const [k, v] of a) {
      const x = v.n - (b.get(k) ? b.get(k).n : 0);
      if (x) d.set(k, { n: x, e: v.e });
    }
    for (const [k, v] of b) if (!a.has(k)) d.set(k, { n: -v.n, e: v.e });
    return d;
  }
  function sApply(R, d) {
    const m = sCount(R);
    for (const [k, v] of d) {
      const c = m.get(k);
      if (c) c.n += v.n;
      else if (v.n > 0) m.set(k, { n: v.n, e: v.e });
    }
    const out = [];
    for (const [, v] of m) if (v.n > 0) out.push(Object.assign({}, v.e, { n: v.n }));
    return out;
  }
  const sClone = (l) => JSON.parse(JSON.stringify(l || []));
  function stashIncoming(R) {
    if (stashTx) {
      stashLate = R;
      return false;
    }
    if (stashBase && canon(R) === canon(stashBase)) return false;
    const d = stashBase ? sDiff(G.stash, stashBase) : /* @__PURE__ */ new Map();
    stashBase = sClone(R);
    G.stash = sApply(R, d);
    return true;
  }
  async function stashPush() {
    if (!db || !code) return;
    const ref = db.doc("coop/".concat(code, "/stash/all"));
    const L = sClone(G.stash), d = stashBase ? sDiff(L, stashBase) : /* @__PURE__ */ new Map();
    if (stashBase && !d.size) return;
    stashTx = true;
    try {
      let R;
      const merge = (cur) => {
        const ci = cur && Array.isArray(cur.items) ? cur.items : null;
        if (!stashBase) return { items: ci && (ci.length || !L.length) ? ci : L };
        return { items: sApply(ci || stashBase, d) };
      };
      if (ref.tx) R = await ref.tx(merge);
      else {
        const sn = await ref.get();
        R = merge(sn.exists ? sn.data() : null);
        await ref.set(R);
      }
      const items = R && R.items || [];
      const dNew = sDiff(G.stash, L);
      stashBase = sClone(items);
      G.stash = sApply(items, dNew);
    } finally {
      stashTx = false;
      if (stashLate) {
        const x = stashLate;
        stashLate = null;
        if (stashIncoming(x)) scheduleRender();
      }
    }
  }
  const ONLINE_MS = 15 * 60 * 1e3;
  const LOC_IDS = Object.keys(LOCS);
  function canon(v) {
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).filter((k) => v[k] !== void 0).sort().map((k) => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
    return JSON.stringify(v === void 0 ? null : v);
  }
  async function probe() {
    if (avail) return true;
    try {
      if (!window.claude || !window.claude.use) {
        avail = false;
        return false;
      }
      db = await window.claude.use("db");
      user = await window.claude.use("user");
      uid = user ? await user.id() : null;
      avail = !!(db && uid);
    } catch (e) {
      avail = false;
    }
    return avail;
  }
  const FBM = () => !!(window.claude && window.claude._fb);
  const NOPERM = () => FBM() ? "Сервер кооператива отказал в доступе. Попробуй перезапустить игру." : "Нет прав на запись в общий мир. Нужно: «Поделиться» → выключить доступ по ссылке и пригласить друга по email с правом редактора.";
  const NOAVAIL = () => window.TGA ? "Нет связи с сервером кооператива. Проверь интернет и попробуй ещё раз." : "Кооператив работает только на опубликованной странице claude.ai, когда ты вошёл в аккаунт.";
  function parts() {
    const w = G.w;
    const o = {
      base: { struct: w.struct, wallHp: w.wallHp, bp: w.bp, prod: w.prod, catAt: w.catAt, catLove: w.catLove || 0, catAway: !!w.catAway, car: w.car || null, power: w.power || 0, bot: w.bot || null },
      story: {
        mode: G.mode,
        flags: w.flags,
        quests: w.quests,
        qstart: w.qstart,
        rep: w.rep,
        notes: w.notes,
        counters: w.counters,
        corpses: w.corpses,
        events: w.events || [],
        ending: w.ending || null,
        deaths: w.deaths,
        gen: w.gen,
        ch2: w.ch2 || null,
        npcs: w.npcs || [],
        camps: w.camps || null,
        raidIncoming: w.raidIncoming || null,
        raidStats: w.raidStats || null,
        pvpOn: !!w.pvpOn,
        contracts: w.contracts || null,
        killsBy: w.killsBy || {},
        contractsDone: w.contractsDone || 0,
        c3At: w.c3At || 0,
        c3Fight: !!w.c3Fight,
        marks: w.marks || [],
        todo: w.todo || [],
        snares: w.snares || [],
        prep: w.prep || null
      },
      clock: { time: G.time, weather: G.weather, em: G.em, hordeDone: w.hordeDone }
    };
    for (const id of LOC_IDS) o["loc_" + id] = w.locs[id];
    return o;
  }
  const pathOf = (n) => n.startsWith("loc_") ? "coop/".concat(code, "/loc/").concat(n.slice(4)) : "coop/".concat(code, "/w/").concat(n);
  const personalPath = () => "data/users/".concat(uid, "/coop-").concat(code);
  function applyDoc(n, data, force) {
    const js = canon(data);
    if (sent[n] === js) return false;
    if (!force && sent[n] !== void 0 && canon(parts()[n]) !== sent[n]) return false;
    if (n === "base") {
      Object.assign(G.w, { struct: data.struct, wallHp: data.wallHp, bp: data.bp || {}, prod: data.prod, catAt: data.catAt, catLove: data.catLove || 0, catAway: !!data.catAway });
      if (data.car) G.w.car = data.car;
      G.w.power = data.power || 0;
      if (!COOP.isAuth || !COOP.isAuth()) G.w.bot = data.bot || null;
      else if (data.bot && G.w.bot && (data.bot.cmdAt || 0) > (G.w.bot.cmdAt || 0)) Object.assign(G.w.bot, { mode: data.bot.mode, style: data.bot.style, cmdAt: data.bot.cmdAt });
      if (stashBase === null && Array.isArray(data.stash) && data.stash.length && !G.stash.length) G.stash = data.stash;
    } else if (n === "story") {
      for (const k of ["flags", "quests", "qstart", "rep", "notes", "counters", "corpses", "deaths", "events"]) G.w[k] = data[k] || (Array.isArray(G.w[k]) ? [] : {});
      G.w.ending = data.ending || null;
      G.w.gen = data.gen || 1;
      if (data.ch2 || !G.w.ch2) G.w.ch2 = data.ch2 || null;
      G.w.npcs = data.npcs || [];
      if (data.camps) G.w.camps = data.camps;
      G.w.raidIncoming = data.raidIncoming || null;
      if (data.raidStats) G.w.raidStats = data.raidStats;
      G.w.pvpOn = !!data.pvpOn;
      if (data.contracts) G.w.contracts = data.contracts;
      G.w.killsBy = data.killsBy || {};
      G.w.contractsDone = data.contractsDone || 0;
      G.w.c3At = data.c3At || 0;
      G.w.c3Fight = !!data.c3Fight;
      G.w.marks = data.marks || [];
      G.w.todo = data.todo || [];
      G.w.snares = data.snares || [];
      G.w.prep = data.prep || null;
    } else if (n === "clock") {
      if (data.time > G.time + 1) {
        const d = data.time - G.time;
        G.time = data.time;
        if (d >= 30) {
          const txt = "⏩ Время общее: пока ты ".concat(G.ch && G.ch.energy < 90 ? "занимался своим" : "был занят", ", у друга прошло ").concat(d >= 60 ? Math.round(d / 6) / 10 + " ч" : d + " мин", " (сон, дорога или поиски).");
          UI.log(txt, "sys");
          if (d >= 120) UI.toast("⏩ +".concat(Math.round(d / 6) / 10, " ч общего времени"));
        }
      }
      if (!G.weather || data.weather && data.weather.until > G.weather.until) G.weather = data.weather;
      if (data.em && (!G.em || data.em.next > G.em.next)) G.em = data.em;
      G.w.hordeDone = Object.assign({}, G.w.hordeDone, data.hordeDone || {});
    } else {
      const id = n.slice(4);
      if (G.combat && id === G.loc) return false;
      G.w.locs[id] = data;
    }
    sent[n] = js;
    return true;
  }
  function scheduleRender() {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      if (G && !G.dead) UI.render();
    }, 150);
  }
  function onErr(e) {
    const c = e && e.code;
    if (c === "invalid_argument") {
      if (status !== "readonly") UI.event({ title: "🔒 Только чтение", cls: "bad", text: NOPERM() + "\n\nПока что ты видишь общий мир, но твои действия в него не сохраняются.", choices: [{ t: "Понятно" }] });
      status = "readonly";
    } else if (c === "quota_exceeded") {
      UI.toast("Хранилище общего мира заполнено.");
    } else if (c === "revoked" || c === "not_granted" || c === "capability_disabled") {
      status = "offline";
      ready = false;
    } else if (c === "permission_denied" || c === "unavailable") {
      status = "offline";
    }
    scheduleRender();
  }
  function sync() {
    if (!code || !ready || status === "readonly") return;
    clearTimeout(timer);
    timer = setTimeout(push, 700);
  }
  async function push() {
    if (!ready) return;
    if (pushing) {
      again = true;
      return;
    }
    pushing = true;
    try {
      const p = parts();
      for (const n in p) {
        const js = canon(p[n]);
        if (js !== sent[n]) {
          await db.doc(pathOf(n)).set(JSON.parse(js));
          sent[n] = js;
        }
      }
      await stashPush();
      await pushMe();
      await pushPersonal();
    } catch (e) {
      onErr(e);
    } finally {
      pushing = false;
      if (again) {
        again = false;
        sync();
      }
    }
  }
  function meDoc() {
    const w = G.eq.weapon && IT(G.eq.weapon.id);
    const dmg = w && w.dmg ? (w.dmg[0] + w.dmg[1]) / 2 : 4;
    const c = G.ch;
    return {
      name: c.name,
      loc: G.traveling ? G.travelTo || G.loc : G.loc,
      from: G.traveling ? G.loc : null,
      room: roomName(),
      act: G.act || "осматривается",
      combat: !!G.combat,
      hp: healthPct(),
      food: Math.round(c.food),
      drink: Math.round(c.drink),
      energy: Math.round(c.energy),
      bleed: bleeding(),
      alive: !G.dead,
      dmg,
      sk: skill("melee"),
      wn: w ? w.n : "кулаки",
      pet: G.pet && G.pet.hp > 0 ? G.pet.type : null,
      downed: !!G.downed,
      gen: G.w.gen,
      t: G.time,
      clock: clock(),
      day: day()
    };
  }
  async function pushMe(force) {
    const d = meDoc(), js = canon(d);
    if (!force && js === lastMe && Date.now() - lastMeAt < 6e4) return;
    d.at = Date.now();
    await db.doc("coop/".concat(code, "/p/").concat(uid)).set(d);
    lastMe = js;
    lastMeAt = d.at;
  }
  const personal = () => ({ ch: G.ch, inv: G.inv, eq: G.eq, money: G.money, loc: G.loc, sneak: G.sneak, campfire: G.campfire || null, dead: !!G.dead, pet: G.pet || null });
  let personalReady = false;
  async function pushPersonal() {
    if (!personalReady) return;
    const js = canon(personal());
    if (js === lastPersonal) return;
    G.pts = Date.now();
    try {
      const d = JSON.parse(js);
      d.ts = G.pts;
      await db.doc(personalPath()).set(d);
      lastPersonal = js;
    } catch (e) {
    }
  }
  const xpSum = (ch) => Object.values(ch && ch.xp || {}).reduce((a, v) => a + (+v || 0), 0);
  function remoteNewer(r) {
    if (!r || !r.ch) return false;
    const pc = progressCmp(G, r);
    if (pc) return pc < 0;
    if (r.ts && G.pts) return r.ts > G.pts;
    const a = G.ch || {}, b = r.ch;
    if ((b.born || 0) !== (a.born || 0)) return (b.born || 0) > (a.born || 0);
    const xa = xpSum(a), xb = xpSum(b), ka = a.kills || 0, kb = b.kills || 0;
    if (xb !== xa) return xb > xa;
    if (kb !== ka) return kb > ka;
    return !!r.ts && !G.pts;
  }
  async function pullPersonal(live) {
    if (!db || !code || !uid) return false;
    let r = null;
    try {
      const s = await db.doc(personalPath()).get();
      r = s.exists ? s.data() : null;
    } catch (e) {
      return false;
    }
    let took = false;
    if (r && remoteNewer(r) && !(live && (G.combat || G.dead))) {
      G.ch = r.ch;
      G.inv = r.inv || [];
      G.eq = r.eq || G.eq;
      if (r.money != null) G.money = r.money;
      if (r.loc && LOCS[r.loc]) G.loc = r.loc;
      G.sneak = !!r.sneak;
      G.campfire = r.campfire || null;
      if ("pet" in r) G.pet = r.pet;
      G.room = null;
      G.traveling = false;
      G.route = null;
      if (r.ts) G.pts = r.ts;
      if (r.dead && !G.dead) G.dead = true;
      took = true;
      try {
        migrate();
      } catch (e) {
      }
      UI.toast("🔗 Персонаж подтянут с другого устройства: рюкзак, снаряжение, здоровье");
    }
    personalReady = true;
    if (took) {
      lastPersonal = canon(personal());
      save();
      scheduleRender();
    } else {
      const rr = r ? Object.assign({}, r) : null;
      if (rr) delete rr.ts;
      lastPersonal = rr && canon(rr) === canon(personal()) && r.ts ? lastPersonal = canon(personal()) : "";
    }
    return took;
  }
  if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => {
    if (!document.hidden && ready && code) pullPersonal(true);
  });
  function unsub() {
    subs.forEach((u) => {
      try {
        u();
      } catch (e) {
      }
    });
    subs = [];
    chatLoaded = false;
    feedLoaded = false;
  }
  function subscribe() {
    unsub();
    for (const n of Object.keys(parts())) subs.push(db.doc(pathOf(n)).onSnapshot((s) => {
      if (s.exists && applyDoc(n, s.data())) scheduleRender();
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/stash/all")).onSnapshot((s) => {
      if (s.exists && s.data() && Array.isArray(s.data().items) && stashIncoming(s.data().items)) {
        save();
        scheduleRender();
      }
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/stashlog/all")).onSnapshot((s) => {
      slog = s.exists && s.data() && s.data().items || [];
      scheduleRender();
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/kicked/all")).onSnapshot((s) => {
      kicked = s.exists && s.data() && s.data().uids || {};
      for (const k in kicked) delete players[k];
      if (kicked[uid]) return kickedOut();
      scheduleRender();
    }, onErr));
    subs.push(db.collection("coop/".concat(code, "/p")).onSnapshot((qs) => {
      const o = {};
      qs.docs.forEach((d) => {
        const v = d.exists && d.data();
        if (v && typeof v === "object" && !kicked[d.id]) o[d.id] = v;
      });
      players = o;
      scheduleRender();
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/chat/log")).onSnapshot((s) => {
      const m = s.exists ? s.data().msgs || [] : [];
      const fresh = m.filter((x) => x.u !== uid && !chat.some((y) => y.at === x.at && y.u === x.u));
      if (chatLoaded && fresh.length) {
        unread += fresh.length;
        fresh.forEach((x) => {
          if (x.ping) {
            if (window.SFX) SFX.play("notify");
            UI.event({ title: "📣 ".concat(x.n), text: "".concat(x.t, "\n\n").concat(x.loc && LOCS[x.loc] ? "Где: ".concat(LOCS[x.loc].ic, " ").concat(LOCS[x.loc].n) : ""), choices: x.loc && LOCS[x.loc] && x.loc !== G.loc ? [{ t: "🧭 Идти туда", fn: () => goTo(x.loc) }, { t: "Позже" }] : [{ t: "Понял" }] });
          } else UI.log("💬 ".concat(x.n, ": ").concat(x.t), "sys");
        });
      }
      chat = m;
      chatLoaded = true;
      scheduleRender();
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/feed/log")).onSnapshot((s) => {
      const m = s.exists ? s.data().items || [] : [];
      const fresh = m.filter((x) => x.u !== uid && !feedL.some((y) => y.at === x.at && y.u === x.u));
      if (feedLoaded && fresh.length) {
        fresh.forEach((x) => {
          UI.log("📢 ".concat(x.n, " ").concat(x.t), "sys");
          UI.toast("📢 ".concat(x.n, " ").concat(x.t));
        });
        try {
          if (window.SFX) SFX.play(fresh.some((x) => /💀|погиб|⚔️/.test(x.t)) ? "hurt" : "notify");
        } catch (e) {
        }
      }
      feedL = m;
      feedLoaded = true;
      scheduleRender();
    }, onErr));
    subs.push(db.collection("coop/".concat(code, "/fight")).onSnapshot((qs) => {
      const o = {};
      qs.docs.forEach((d) => {
        if (d.exists && d.data()) o[d.id] = d.data();
      });
      fights = o;
      for (const [k, f] of Object.entries(o)) if (k !== uid && f && !f.ended && f.loc === G.loc && !G.combat && !G.traveling && Date.now() - (f.at || 0) < 6e4) {
        const key = k + ":" + (f.start || f.room || "") + ":" + Math.floor((f.at || 0) / 6e5);
        if (!fightToasted[key]) {
          fightToasted[key] = 1;
          UI.toast("⚔️ ".concat(f.name, " сражается рядом — можно помочь!"));
          if (window.SFX) try {
            SFX.play("notify");
          } catch (e) {
          }
          try {
            if (window.TGA && TGA.tg && TGA.tg.HapticFeedback) TGA.tg.HapticFeedback.notificationOccurred("warning");
          } catch (e) {
          }
        }
      }
      if (joined) {
        const f = fights[joined];
        if (!f || f.ended) {
          const res = f && f.res;
          joined = null;
          UI.allyFightEnd(res);
        } else {
          const h = (f.hits || {})[uid];
          if (h && h.n > hitSeen) {
            hitSeen = h.n;
            const dd = Math.max(1, h.dmg - armor());
            const r = hitPlayer(dd, h.inj, null, h.by);
            UI.log("💢 ".concat(h.by, " бьёт тебя: −").concat(dd).concat(r ? " " + r : ""), "bad");
            if (window.SFX) SFX.play("hurt");
            checkDeath();
            if (G.dead || healthPct() <= 0) leaveFight();
            save();
          }
          UI.allyFight(f, joined);
        }
      }
      const mine = fights[uid];
      if (mine && mine.acts) {
        for (const [a, x] of Object.entries(mine.acts)) if (x && G.combat && x.turn >= G.combat.turn - 1 && !actsSeen[a + ":" + x.k]) {
          actsSeen[a + ":" + x.k] = 1;
          pending.push(Object.assign({ from: a }, x));
        }
      }
      scheduleRender();
    }, onErr));
    subs.push(db.doc("coop/".concat(code, "/mail/").concat(uid)).onSnapshot(async (s) => {
      if (!s.exists) return;
      if (!(s.data().items || []).length) return;
      const ref = db.doc("coop/".concat(code, "/mail/").concat(uid));
      let items = [];
      try {
        if (ref.tx) await ref.tx((cur) => {
          items = cur && cur.items || [];
          return { items: [] };
        });
        else {
          items = s.data().items || [];
          await ref.set({ items: [] });
        }
      } catch (e) {
        return;
      }
      if (!items.length) return;
      for (const g of items) {
        if (g.revive) {
          if (typeof reviveMe === "function") reviveMe(g.from);
          continue;
        }
        if (g.item && ITEMS[g.item.id]) {
          G.inv.push(g.item);
          UI.log("🎁 ".concat(g.from, " передал тебе: ").concat(IT(g.item.id).ic, " ").concat(IT(g.item.id).n).concat(g.item.n > 1 ? " ×" + g.item.n : "", "."), "good");
        }
      }
      save();
      scheduleRender();
    }, onErr));
  }
  async function fetchAll() {
    stashBase = null;
    for (const n of Object.keys(parts())) {
      const s = await db.doc(pathOf(n)).get();
      if (s.exists) applyDoc(n, s.data(), true);
    }
    try {
      const s = await db.doc("coop/".concat(code, "/stash/all")).get();
      const it = s.exists && s.data() && s.data().items;
      if (Array.isArray(it) && (it.length || !G.stash.length)) {
        stashBase = sClone(it);
        G.stash = sClone(it);
      }
    } catch (e) {
    }
  }
  function genCode() {
    const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)];
    return s;
  }
  async function create() {
    if (!await probe()) return NOAVAIL();
    status = "connecting";
    UI.render();
    try {
      let c = genCode();
      for (let k = 0; k < 3; k++) {
        const s = await db.doc("coop/".concat(c)).get();
        if (!s.exists) break;
        c = genCode();
      }
      await db.doc("coop/".concat(c)).set({ created: Date.now(), host: uid, mode: G.mode, v: 1 });
      code = c;
      G.coop = { code: c, host: uid };
      for (const k in sent) delete sent[k];
      ready = true;
      status = "online";
      personalReady = true;
      lastPersonal = "";
      await push();
      await pushMe(true);
      subscribe();
      save();
      UI.log("🤝 Общий мир создан. Код: ".concat(c), "good");
      return "";
    } catch (e) {
      status = "off";
      G.coop = null;
      code = null;
      ready = false;
      return e && e.code === "invalid_argument" ? NOPERM() : "Не удалось создать мир. Попробуй ещё раз.";
    }
  }
  async function join(c, name, traits, prof) {
    if (!await probe()) return NOAVAIL();
    c = (c || "").trim().toUpperCase();
    if (!/^[A-Z0-9]{4,8}$/.test(c)) return "Код — 6 букв и цифр, например K7QX2M.";
    try {
      const meta = await db.doc("coop/".concat(c)).get();
      if (!meta.exists) return FBM() ? "Мир с таким кодом не найден. Попроси друга прислать приглашение ещё раз." : "Мир с таким кодом не найден. Проверь код и что друг поделился с тобой этой страницей.";
      const mode = meta.data().mode, host = meta.data().host || null;
      try {
        const kd = await db.doc("coop/".concat(c, "/kicked/all")).get();
        if (kd.exists && kd.data() && (kd.data().uids || {})[uid]) return "Хозяин этого мира исключил тебя. Попроси его вернуть тебя или создай свой мир.";
      } catch (e) {
      }
      try {
        await db.doc("coop/".concat(c, "/p/").concat(uid)).set({ probe: Date.now() });
      } catch (e) {
        if (e && e.code === "invalid_argument") return NOPERM();
        throw e;
      }
      code = c;
      const ps = await db.doc("data/users/".concat(uid, "/coop-").concat(c)).get();
      if (G && !G.coop && !G.dead) {
        try {
          localStorage.setItem(SOLO_KEY, JSON.stringify(G));
        } catch (e) {
        }
      }
      newGame(mode, name, traits, prof);
      G.coop = { code: c, host };
      for (const k in sent) delete sent[k];
      await fetchAll();
      if (ps.exists) {
        const p = ps.data();
        if (!p.dead) {
          Object.assign(G, { ch: p.ch, inv: p.inv || [], eq: p.eq, money: p.money || 0, loc: p.loc || "base", sneak: !!p.sneak, campfire: p.campfire || null });
          UI.log("🤝 С возвращением в общий мир, ".concat(G.ch.name, "!"), "good");
        }
      }
      G.room = null;
      G.traveling = false;
      ready = true;
      status = "online";
      personalReady = true;
      lastPersonal = "";
      subscribe();
      save();
      await push();
      await pushMe(true);
      return "";
    } catch (e) {
      code = null;
      ready = false;
      status = "off";
      return e && e.code === "invalid_argument" ? NOPERM() : "Не удалось подключиться. Попробуй ещё раз.";
    }
  }
  async function init() {
    if (!G || !G.coop) return;
    code = G.coop.code;
    status = "connecting";
    if (!await probe()) {
      status = "offline";
      scheduleRender();
      return;
    }
    try {
      if (!G.coop.host) {
        try {
          const m = await db.doc("coop/".concat(code)).get();
          if (m.exists) G.coop.host = m.data().host || null;
        } catch (e) {
        }
      }
      for (const k in sent) delete sent[k];
      await fetchAll();
      personalReady = false;
      await pullPersonal(false);
      ready = true;
      status = "online";
      subscribe();
      save();
      await pushMe(true);
      scheduleRender();
    } catch (e) {
      status = "offline";
      onErr(e);
    }
  }
  const SOLO_KEY = "moti3_solo";
  function leave() {
    stashBase = null;
    unsub();
    ready = false;
    status = "off";
    code = null;
    G.coop = null;
    players = {};
    chat = [];
    let solo = null;
    try {
      solo = JSON.parse(localStorage.getItem(SOLO_KEY));
    } catch (e) {
    }
    if (solo && solo.v === 3) {
      G = solo;
      try {
        localStorage.removeItem(SOLO_KEY);
      } catch (e) {
      }
      migrate();
      UI.log("🏝 Ты вернулся в свою одиночную игру.", "good");
    }
    save();
  }
  function kickedOut() {
    if (!code) return;
    leave();
    UI.event({ title: "🚫 Тебя исключили из мира", cls: "bad", text: "Хозяин общего мира убрал тебя из игры. Твой персонаж из этого мира больше недоступен." + (G ? "\n\nТы вернулся в свою одиночную игру." : ""), choices: [{ t: "Понятно" }] });
    UI.render();
  }
  async function kick(id) {
    if (!ready || !G.coop || G.coop.host !== uid || id === uid) return;
    const nm = (players[id] || {}).name || "игрока";
    const ref = db.doc("coop/".concat(code, "/kicked/all")), add = (cur) => ({ uids: Object.assign({}, cur && cur.uids || {}, { [id]: Date.now() }) });
    try {
      if (ref.tx) await ref.tx(add);
      else {
        const s = await ref.get();
        await ref.set(add(s.exists ? s.data() : null));
      }
      await db.doc("coop/".concat(code, "/p/").concat(id)).set(null);
      kicked[id] = Date.now();
      delete players[id];
      try {
        feed("🚫 исключил из мира: ".concat(nm));
      } catch (e) {
      }
    } catch (e) {
      onErr(e);
    }
    UI.render();
  }
  async function unkick(id) {
    if (!ready || !G.coop || G.coop.host !== uid) return;
    const ref = db.doc("coop/".concat(code, "/kicked/all")), rm = (cur) => {
      const u = Object.assign({}, cur && cur.uids || {});
      delete u[id];
      return { uids: u };
    };
    try {
      if (ref.tx) await ref.tx(rm);
      else {
        const s = await ref.get();
        await ref.set(rm(s.exists ? s.data() : null));
      }
      delete kicked[id];
    } catch (e) {
      onErr(e);
    }
    UI.render();
  }
  async function logStash(entry) {
    if (!ready || !db || !code) return;
    const ref = db.doc("coop/".concat(code, "/stashlog/all")), add = (cur) => ({ items: (cur && cur.items || []).concat([entry]).slice(-80) });
    slog = slog.concat([entry]).slice(-80);
    try {
      if (ref.tx) await ref.tx(add);
      else {
        const s = await ref.get();
        await ref.set(add(s.exists ? s.data() : null));
      }
    } catch (e) {
    }
  }
  async function backup(dayN) {
    if (!ready || !db || !code) return;
    try {
      await db.doc("coop/".concat(code, "/bak/s").concat(dayN % 5)).set({ day: dayN, at: Date.now(), by: G.ch.name, parts: JSON.parse(canon(parts())), stash: G.stash });
    } catch (e) {
    }
  }
  async function listBackups() {
    if (!ready || !db || !code) return [];
    const out = [];
    for (let i = 0; i < 5; i++) {
      try {
        const s = await db.doc("coop/".concat(code, "/bak/s").concat(i)).get();
        if (s.exists && s.data()) {
          const d = s.data();
          out.push({ slot: i, day: d.day, at: d.at, by: d.by });
        }
      } catch (e) {
      }
    }
    return out.sort((a, b) => b.day - a.day);
  }
  async function restore(slot) {
    if (!ready || !G.coop || G.coop.host !== uid) return "Откатить мир может только хозяин.";
    const s = await db.doc("coop/".concat(code, "/bak/s").concat(slot)).get();
    if (!s.exists) return "Копия не найдена.";
    const d = s.data();
    for (const n in d.parts) {
      await db.doc(pathOf(n)).set(d.parts[n]);
      applyDoc(n, d.parts[n], true);
    }
    const items = d.stash || [];
    await db.doc("coop/".concat(code, "/stash/all")).set({ items });
    stashBase = sClone(items);
    G.stash = sClone(items);
    try {
      feed("🗂️ откатил мир к копии дня ".concat(d.day));
    } catch (e) {
    }
    save();
    UI.render();
    return "";
  }
  const hasSolo = () => {
    try {
      return !!localStorage.getItem(SOLO_KEY);
    } catch (e) {
      return false;
    }
  };
  async function send(text) {
    text = (text || "").trim().slice(0, 240);
    if (!text || !ready) return;
    const ref = db.doc("coop/".concat(code, "/chat/log"));
    try {
      const s = await ref.get();
      const m = s.exists ? (s.data().msgs || []).slice(-39) : [];
      m.push({ u: uid, n: G.ch.name, t: text, at: Date.now() });
      await ref.set({ msgs: m });
    } catch (e) {
      onErr(e);
    }
  }
  async function feed(text) {
    if (!ready || status === "readonly") return;
    const ref = db.doc("coop/".concat(code, "/feed/log"));
    try {
      const s = await ref.get();
      const m = s.exists ? (s.data().items || []).slice(-49) : [];
      m.push({ u: uid, n: G.ch.name, t: text, at: Date.now() });
      await ref.set({ items: m });
      feedL = m;
    } catch (e) {
      onErr(e);
    }
  }
  async function ping(text) {
    if (!ready) return;
    const ref = db.doc("coop/".concat(code, "/chat/log"));
    try {
      const s = await ref.get();
      const m = s.exists ? (s.data().msgs || []).slice(-39) : [];
      m.push({ u: uid, n: G.ch.name, t: text, at: Date.now(), ping: 1, loc: G.loc });
      await ref.set({ msgs: m });
      chat = m;
      UI.toast("📣 Сигнал отправлен");
    } catch (e) {
      onErr(e);
    }
  }
  async function sendRevive(to) {
    if (!ready) return false;
    const ref = db.doc("coop/".concat(code, "/mail/").concat(to)), gift = { from: G.ch.name, revive: true };
    try {
      if (ref.tx) await ref.tx((cur) => ({ items: (cur && cur.items || []).concat([gift]) }));
      else {
        const s = await ref.get();
        const items = s.exists ? (s.data().items || []).slice() : [];
        items.push(gift);
        await ref.set({ items });
      }
      return true;
    } catch (e) {
      onErr(e);
      return false;
    }
  }
  async function give(to, e, n) {
    if (!ready) return;
    if (typeof sameItem === "function") {
      e = sameItem(G.inv, e);
      if (!e) return UI.toast("Этой вещи уже нет в рюкзаке.");
    }
    if (e._giving) return;
    e._giving = true;
    const q = Math.min(n || e.n, e.n), item = Object.assign({}, e, { n: q });
    delete item._giving;
    const ref = db.doc("coop/".concat(code, "/mail/").concat(to));
    try {
      const gift = { from: G.ch.name, item };
      if (ref.tx) await ref.tx((cur) => ({ items: (cur && cur.items || []).concat([gift]) }));
      else {
        const s = await ref.get();
        const items = s.exists ? (s.data().items || []).slice() : [];
        items.push(gift);
        await ref.set({ items });
      }
      delete e._giving;
      const i = G.inv.indexOf(e);
      if (i >= 0) {
        e.n -= q;
        if (e.n <= 0) G.inv.splice(i, 1);
      }
      UI.log("🎁 Ты передал: ".concat(IT(e.id).ic, " ").concat(IT(e.id).n).concat(q > 1 ? " ×" + q : "", "."));
      save();
      UI.render();
    } catch (err) {
      delete e._giving;
      onErr(err);
    }
  }
  const others = () => Object.entries(players).filter(([id, p]) => id !== uid && p && !kicked[id]).map(([id, p]) => Object.assign({ id, online: Date.now() - (p.at || 0) < ONLINE_MS }, p));
  const here = () => others().filter((p) => p.online && p.alive && p.loc === G.loc && !G.traveling);
  function allyTurn(cb) {
    if (!ready || cb.opts.road) return false;
    const joinedA = allies();
    const al = here().filter((p) => !joinedA.includes(p.id));
    if (!al.length) return false;
    let acted = false;
    for (const p of al) {
      const tg = cb.en.filter((e2) => e2.hp > 0);
      if (!tg.length) break;
      const e = tg[Math.floor(Math.random() * tg.length)], D = ENEMY[e.id];
      if (Math.random() < 0.65 + (p.sk || 0) * 0.04) {
        const d = Math.max(1, Math.round((p.dmg || 4) * (1 + (p.sk || 0) * 0.08) * (0.8 + Math.random() * 0.4) - (D.arm || 0)));
        e.hp -= d;
        cb.log.push({ t: "🤝 ".concat(p.name, " (").concat(p.wn || "оружие", ") бьёт ").concat(D.ic, " ").concat(D.n, ": −").concat(d), c: "good" });
      } else cb.log.push({ t: "🤝 ".concat(p.name, " промахивается по ").concat(D.n, "."), c: "dim" });
      acted = true;
    }
    return acted;
  }
  function leader() {
    if (!G || !G.coop || !ready || !uid) return uid;
    const on = [uid, ...others().filter((p) => p.online && p.alive !== false).map((p) => p.id)];
    const host = G.coop.host;
    if (host && on.includes(host)) return host;
    return on.sort()[0];
  }
  const isAuth = () => !G || !G.coop || !ready || leader() === uid;
  const fightRef = (owner) => db.doc("coop/".concat(code, "/fight/").concat(owner));
  function fightDoc(cur, res) {
    const cb = G.combat;
    return {
      owner: uid,
      name: G.ch.name,
      loc: G.loc,
      room: roomName(),
      turn: cb ? cb.turn : 0,
      waiting: cb && cb.waiting ? cb.waiting : 0,
      ended: !cb,
      res: res || null,
      at: Date.now(),
      en: cb ? cb.en.map((e) => ({ id: e.id, hp: Math.max(0, Math.round(e.hp)), max: e.max, dist: e.dist, stun: e.stun || 0 })) : [],
      log: cb ? cb.log.slice(-10) : [],
      allies: cur && cur.allies || [],
      acts: cur && cur.acts || {},
      hits: cur && cur.hits || {}
    };
  }
  function pushFight(res) {
    if (!ready || !code) return;
    const cur = fights[uid];
    const allies2 = cur && cur.allies || [];
    if (!G.combat && !cur) return;
    if (G.combat && !allies2.length && !here().length) return;
    clearTimeout(fightPushT);
    const go = async () => {
      try {
        const d = fightDoc(fights[uid], res);
        fights[uid] = d;
        await fightRef(uid).set(d);
        if (!G.combat) setTimeout(() => {
          if (!G.combat) fightRef(uid).set({ ended: true, res: res || "end", at: Date.now() }).catch(() => {
          });
        }, 4e3);
      } catch (e) {
        onErr(e);
      }
    };
    if (res || !G.combat) go();
    else fightPushT = setTimeout(go, 250);
  }
  async function joinFight(owner) {
    const f = fights[owner];
    if (!f || f.ended || G.combat) return;
    joined = owner;
    hitSeen = ((f.hits || {})[uid] || {}).n || 0;
    try {
      const s = await fightRef(owner).get();
      const d = s.exists ? s.data() : f;
      d.allies = [.../* @__PURE__ */ new Set([...d.allies || [], uid])];
      await fightRef(owner).set(d);
    } catch (e) {
      onErr(e);
    }
    setAct("⚔️ помогает в бою: ".concat(f.name));
    UI.allyFight(fights[owner] || f, owner);
  }
  async function allyAct(owner, act) {
    try {
      const s = await fightRef(owner).get();
      if (!s.exists) return;
      const d = s.data();
      if (d.ended) return;
      d.acts = d.acts || {};
      d.acts[uid] = Object.assign({ k: Date.now(), turn: d.turn, n: G.ch.name }, act);
      await fightRef(owner).set(d);
    } catch (e) {
      onErr(e);
    }
  }
  async function leaveFight() {
    const owner = joined;
    joined = null;
    if (!owner) return;
    try {
      const s = await fightRef(owner).get();
      if (s.exists) {
        const d = s.data();
        d.allies = (d.allies || []).filter((x) => x !== uid);
        await fightRef(owner).set(d);
      }
    } catch (e) {
    }
    UI.allyFightEnd("left");
  }
  let waitT = null;
  const needFrom = (cb) => allies().filter((a) => !pending.some((p) => p.from === a && p.turn >= cb.turn));
  function waitAllies(cb) {
    if (!ready || !needFrom(cb).length) return false;
    cb.waiting = Date.now() + 25e3;
    pushFight();
    UI.combat();
    clearInterval(waitT);
    waitT = setInterval(() => {
      const c = G.combat;
      if (!c || c !== cb || !c.waiting) {
        clearInterval(waitT);
        return;
      }
      if (!needFrom(c).length || Date.now() > c.waiting) {
        clearInterval(waitT);
        c.waiting = null;
        endPlayerTurn(true);
        if (G.combat) UI.combat();
      } else UI.combat();
    }, 500);
    return true;
  }
  function stopWaiting() {
    const c = G.combat;
    if (c && c.waiting) {
      c.waiting = null;
      clearInterval(waitT);
      endPlayerTurn(true);
      if (G.combat) UI.combat();
    }
  }
  const waitNames = (cb) => needFrom(cb).map((a) => (players[a] || {}).name || "друг");
  function consumeActs(cb) {
    if (!pending.length) return false;
    const list = pending.splice(0);
    let acted = false;
    for (const a of list) {
      const e = cb.en[a.i];
      if (!e || e.hp <= 0) {
        cb.log.push({ t: "🤝 ".concat(a.n, ": ").concat(a.txt || "промах"), c: "dim" });
        continue;
      }
      if (a.dmg > 0) {
        e.hp -= a.dmg;
        if (a.stun) e.stun = Math.max(e.stun || 0, 1);
      }
      cb.log.push({ t: "🤝 ".concat(a.n, ": ").concat(a.txt), c: a.dmg > 0 ? "good" : "dim" });
      acted = true;
    }
    return acted;
  }
  const allies = () => ((fights[uid] || {}).allies || []).filter((a) => others().some((p) => p.id === a && p.online));
  async function hitAlly(target, dmg, inj, by) {
    try {
      const s = await fightRef(uid).get();
      if (!s.exists) return;
      const d = s.data();
      d.hits = d.hits || {};
      hitN++;
      d.hits[target] = { n: Date.now() + hitN, dmg, inj, by };
      await fightRef(uid).set(d);
      fights[uid] = d;
    } catch (e) {
    }
  }
  return {
    pushFight,
    joinFight,
    allyAct,
    leaveFight,
    consumeActs,
    waitAllies,
    stopWaiting,
    waitNames,
    allies,
    hitAlly,
    get fights() {
      return fights;
    },
    get joined() {
      return joined;
    },
    leader,
    isAuth,
    get host() {
      return G && G.coop ? G.coop.host : null;
    },
    kick,
    unkick,
    get kicked() {
      return kicked;
    },
    logStash,
    get stashLog() {
      return slog;
    },
    sendRevive,
    pushNow: () => pushMe(true),
    backup,
    listBackups,
    restore,
    hasSolo,
    probe,
    create,
    join,
    init,
    sync,
    leave,
    send,
    give,
    allyTurn,
    others,
    here,
    feed,
    ping,
    get feedList() {
      return feedL;
    },
    get code() {
      return code;
    },
    get status() {
      return status;
    },
    get chat() {
      return chat;
    },
    get uid() {
      return uid;
    },
    get unread() {
      return unread;
    },
    readAll() {
      unread = 0;
    }
  };
})();
window.COOP = COOP;
