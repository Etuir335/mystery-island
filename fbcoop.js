const FB = (() => {
  const CONFIG = window.FB_CONFIG || null;
  if (window.claude || !CONFIG || !CONFIG.databaseURL) return null;
  const modern = (() => {
    try {
      new Function("let a = {}; return a?.b ?? 1");
      return !/Edge\/1[0-8]\./.test(navigator.userAgent);
    } catch (e) {
      return false;
    }
  })();
  const SDK = modern ? "https://www.gstatic.com/firebasejs/10.12.2/" : "https://www.gstatic.com/firebasejs/8.10.1/";
  const SFX_ = modern ? "-compat" : "";
  let ready = null, dbx = null, uid = null;
  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = () => rej(new Error("load " + src));
    document.head.appendChild(s);
  });
  const err = (e) => {
    const x = new Error(e && e.message || String(e));
    x.code = /permission/i.test(String(e && (e.code || e.message))) ? "permission_denied" : "unavailable";
    return x;
  };
  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!window.firebase || !firebase.database) {
        await load(SDK + "firebase-app" + SFX_ + ".js");
        await Promise.all([load(SDK + "firebase-auth" + SFX_ + ".js"), load(SDK + "firebase-database" + SFX_ + ".js")]);
      }
      if (!firebase.apps.length) firebase.initializeApp(CONFIG);
      const auth = firebase.auth();
      if (!auth.currentUser) await auth.signInAnonymously();
      dbx = firebase.database();
      const tu = window.TGA && TGA.user && TGA.user.id;
      uid = tu ? "tg" + tu : "an" + auth.currentUser.uid;
      return true;
    })();
    ready.catch(() => {
      ready = null;
    });
    return ready;
  }
  const node = (p) => "d/" + p.split("/").filter(Boolean).join("/");
  const parse = (v) => {
    try {
      return v == null ? null : JSON.parse(v);
    } catch (e) {
      return null;
    }
  };
  const snapDoc = (id, v) => ({ id, exists: v != null, data: () => parse(v) });
  function doc(path) {
    const ref = () => dbx.ref(node(path) + "/_");
    return {
      async get() {
        try {
          const s = await ref().get();
          return snapDoc(path.split("/").pop(), s.val());
        } catch (e) {
          throw err(e);
        }
      },
      async set(obj) {
        try {
          await ref().set(JSON.stringify(obj));
        } catch (e) {
          throw err(e);
        }
      },
      // атомарное изменение: fn(текущее) -> новое; повторяется сервером при гонке
      async tx(fn) {
        try {
          const r = await ref().transaction((cur) => JSON.stringify(fn(parse(cur))));
          return parse(r.snapshot.val());
        } catch (e) {
          throw err(e);
        }
      },
      onSnapshot(cb, onE) {
        const r = ref(), h = (s) => cb(snapDoc(path.split("/").pop(), s.val()));
        r.on("value", h, (e) => onE && onE(err(e)));
        return () => r.off("value", h);
      }
    };
  }
  function collection(path) {
    return {
      onSnapshot(cb, onE) {
        const r = dbx.ref(node(path)), h = (s) => {
          const docs = [];
          s.forEach((ch) => {
            docs.push(snapDoc(ch.key, ch.child("_").val()));
          });
          cb({ docs });
        };
        r.on("value", h, (e) => onE && onE(err(e)));
        return () => r.off("value", h);
      }
    };
  }
  const db = { doc, collection };
  const user = { id: async () => uid };
  window.claude = { use: async (what) => {
    await init();
    return what === "db" ? db : what === "user" ? user : null;
  }, _fb: true };
  const lb = {
    async submit(e) {
      await init();
      const r = dbx.ref("d/lb/" + uid);
      const s = await r.get();
      const cur = s.val();
      if (cur && cur.run !== e.run && (cur.days > e.days || cur.days === e.days && cur.kills >= e.kills)) return false;
      await r.set(Object.assign({}, e, { at: Date.now() }));
      return true;
    },
    async top(n = 20) {
      await init();
      const s = await dbx.ref("d/lb").get();
      const out = [];
      s.forEach((ch) => {
        const v = ch.val();
        if (v && typeof v.days === "number") out.push(Object.assign({ id: ch.key }, v));
      });
      out.sort((a, b) => b.days - a.days || b.kills - a.kills || a.at - b.at);
      return out.slice(0, n);
    }
  };
  return { init, lb, get uid() {
    return uid;
  } };
})();
window.FB = FB;
