// Кооператив вне claude.ai: Firebase Realtime Database под тем же интерфейсом, что и db артефакта
// (db.doc(path).get/set/onSnapshot, db.collection(path).onSnapshot, user.id()), чтобы coop.js не менять.
// Документ path хранится в узле d/<path>/_ как JSON-строка (так RTDB не теряет пустые массивы и null).
const FB = (() => {
  const CONFIG = window.FB_CONFIG || null; // задаётся в fbconfig.js
  if (window.claude || !CONFIG || !CONFIG.databaseURL) return null;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  let ready = null, dbx = null, uid = null;

  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
  const err = (e) => { const x = new Error(e && e.message || String(e)); x.code = /permission/i.test(String(e && (e.code || e.message))) ? 'permission_denied' : 'unavailable'; return x; };

  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!window.firebase || !firebase.database) {
        await load(SDK + 'firebase-app-compat.js');
        await Promise.all([load(SDK + 'firebase-auth-compat.js'), load(SDK + 'firebase-database-compat.js')]);
      }
      if (!firebase.apps.length) firebase.initializeApp(CONFIG);
      const auth = firebase.auth();
      if (!auth.currentUser) await auth.signInAnonymously();
      dbx = firebase.database();
      // игрок = аккаунт Телеграма (один и тот же на телефоне и ПК); вне Телеграма — анонимный id устройства
      const tu = window.TGA && TGA.user && TGA.user.id;
      uid = tu ? 'tg' + tu : 'an' + auth.currentUser.uid;
      return true;
    })();
    ready.catch(() => { ready = null; });
    return ready;
  }

  const node = p => 'd/' + p.split('/').filter(Boolean).join('/');
  const parse = v => { try { return v == null ? null : JSON.parse(v); } catch (e) { return null; } };
  const snapDoc = (id, v) => ({ id, exists: v != null, data: () => parse(v) });

  function doc(path) {
    const ref = () => dbx.ref(node(path) + '/_');
    return {
      async get() { try { const s = await ref().get(); return snapDoc(path.split('/').pop(), s.val()); } catch (e) { throw err(e); } },
      async set(obj) { try { await ref().set(JSON.stringify(obj)); } catch (e) { throw err(e); } },
      onSnapshot(cb, onE) {
        const r = ref(), h = s => cb(snapDoc(path.split('/').pop(), s.val()));
        r.on('value', h, e => onE && onE(err(e)));
        return () => r.off('value', h);
      },
    };
  }
  function collection(path) {
    return {
      onSnapshot(cb, onE) {
        const r = dbx.ref(node(path)), h = s => { const docs = []; s.forEach(ch => { docs.push(snapDoc(ch.key, ch.child('_').val())); }); cb({ docs }); };
        r.on('value', h, e => onE && onE(err(e)));
        return () => r.off('value', h);
      },
    };
  }
  const db = { doc, collection };
  const user = { id: async () => uid };
  // тот же вход, что и у артефакта: coop.js вызывает claude.use('db') / claude.use('user')
  window.claude = { use: async (what) => { await init(); return what === 'db' ? db : what === 'user' ? user : null; }, _fb: true };
  return { init, get uid() { return uid; } };
})();
window.FB = FB;
