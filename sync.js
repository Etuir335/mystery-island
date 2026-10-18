"use strict";
const SYNC = (() => {
  if (!window.FB || !FB.init) return null;
  const AL = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const newCode = () => {
    const a = new Uint32Array(8);
    (window.crypto || window.msCrypto).getRandomValues(a);
    let s = "";
    for (let i = 0; i < 8; i++) s += AL[a[i] % AL.length];
    return s;
  };
  const fmt = (c) => c ? c.slice(0, 4) + "-" + c.slice(4) : "";
  const norm = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const TSK = () => "moti3_sts" + (SAVE_SLOT > 1 ? SAVE_SLOT : "");
  const lts = () => {
    try {
      return +localStorage.getItem(TSK()) || 0;
    } catch (e) {
      return 0;
    }
  };
  const setLts = (t) => {
    try {
      localStorage.setItem(TSK(), String(t));
    } catch (e) {
    }
  };
  const to = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
  const ref = (c) => to(FB.init(), 1e4).then(() => firebase.database().ref("d/sync/" + c + "/_"));
  async function fetchRemote(c) {
    const r = await ref(c);
    const s = await to(r.once("value"), 1e4);
    const v = s.val();
    try {
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  }
  let upT = null, busy = false, again = false, dirty = false;
  async function upload() {
    if (typeof G === "undefined" || !G || !G.syncCode) return;
    if (busy) {
      again = true;
      return;
    }
    busy = true;
    try {
      if (!dirty) return;
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      dirty = false;
      const ts = lts() || Date.now(), val = JSON.stringify({ raw, ts, name: G.ch && G.ch.name, day: day() }), r = await ref(G.syncCode);
      await to(r.transaction((cur) => {
        let c = null;
        try {
          c = cur ? JSON.parse(cur) : null;
        } catch (e) {
        }
        if (c && c.ts > ts) return;
        return val;
      }), 2e4);
    } catch (e) {
      dirty = true;
    } finally {
      busy = false;
      if (again) {
        again = false;
        schedule(2e3);
      }
    }
  }
  const schedule = (ms = 4e3) => {
    clearTimeout(upT);
    upT = setTimeout(upload, ms);
  };
  const _save = window.save;
  window.save = function() {
    _save.apply(this, arguments);
    setLts(Date.now());
    dirty = true;
    if (typeof G !== "undefined" && G && G.syncCode) schedule();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(upT);
      upload();
    } else pull();
  });
  async function before() {
    let code = null;
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      code = s && s.syncCode;
    } catch (e) {
    }
    if (!code) return;
    try {
      const v = await fetchRemote(code);
      if (v && v.raw && v.ts > lts() + 1e3) {
        localStorage.setItem(SAVE_KEY, v.raw);
        setLts(v.ts);
      }
    } catch (e) {
    }
  }
  async function pull() {
    if (typeof G === "undefined" || !G || !G.syncCode || G.combat || G.dead) return;
    try {
      const v = await fetchRemote(G.syncCode);
      if (!(v && v.raw && v.ts > lts() + 1e3)) return;
      const s = JSON.parse(v.raw);
      if (!s || s.v !== 3) return;
      localStorage.setItem(SAVE_KEY, v.raw);
      setLts(v.ts);
      if (load()) {
        UI.render();
        UI.toast("🔗 Подтянут прогресс с другого устройства");
        if (G.coop && window.COOP) COOP.init();
      }
    } catch (e) {
    }
  }
  async function link() {
    if (!G.syncCode) {
      G.syncCode = newCode();
      save();
    }
    dirty = true;
    clearTimeout(upT);
    await upload();
    return G.syncCode;
  }
  function unlink() {
    delete G.syncCode;
    save();
  }
  async function enter(input) {
    const c = norm(input);
    if (c.length !== 8) throw new Error("Код — 8 символов, например K7QX-M2PA.");
    const v = await fetchRemote(c);
    if (!v || !v.raw) throw new Error("Такого кода нет. Проверь буквы и цифры.");
    const s = JSON.parse(v.raw);
    if (!s || s.v !== 3) throw new Error("Сохранение повреждено.");
    s.syncCode = c;
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    setLts(v.ts);
    if (!load()) throw new Error("Не удалось загрузить мир.");
    save();
    return v;
  }
  return { before, pull, link, unlink, enter, fmt, upload };
})();
window.SYNC = SYNC;
