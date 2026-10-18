// Telegram Mini App слой: тема, кнопка «Назад», вибрация, имя игрока, облачные сохранения.
// Подключается после coop.js и до ui.js; ui.js в конце ждёт TGA.before() (облачный сейв), потом запускает игру.
const TGA = (() => {
  const tg = window.Telegram && Telegram.WebApp;
  if (!tg || !tg.initData) return null; // открыто не в Телеграме — обычный режим
  const ver = v => { try { return tg.isVersionAtLeast(v); } catch (e) { return false; } };
  tg.ready(); tg.expand();
  if (ver('7.7')) try { tg.disableVerticalSwipes(); } catch (e) {}

  // --- тема: светлая/тёмная как в Телеграме ---
  function theme() {
    document.documentElement.dataset.theme = tg.colorScheme === 'dark' ? 'dark' : 'light';
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || (tg.colorScheme === 'dark' ? '#12181a' : '#e4dfcf');
    try { if (ver('6.1')) { tg.setHeaderColor(bg); tg.setBackgroundColor(bg); } if (ver('7.10')) tg.setBottomBarColor(bg); } catch (e) {}
  }
  theme(); tg.onEvent('themeChanged', theme);

  const user = (tg.initDataUnsafe && tg.initDataUnsafe.user) || {};
  const startParam = (tg.initDataUnsafe && tg.initDataUnsafe.start_param) || '';

  // --- облачные сохранения (CloudStorage: до 4096 символов на ключ) ---
  const CS = ver('6.9') ? tg.CloudStorage : null;
  const csGet = keys => new Promise(res => { try { CS.getItems(keys, (err, v) => res(err ? null : v)); } catch (e) { res(null); } });
  const csSet = (k, v) => new Promise(res => { try { CS.setItem(k, v, (err, ok) => res(!err && ok)); } catch (e) { res(false); } });
  const CH = 3800, TS_KEY = 'moti3_ts';
  const localTs = () => { try { return +localStorage.getItem(TS_KEY) || 0; } catch (e) { return 0; } };
  const setLocalTs = t => { try { localStorage.setItem(TS_KEY, String(t)); } catch (e) {} };
  let meta = null, upT = null, uploading = false, again = false;

  async function upload() {
    if (!CS) return;
    if (uploading) { again = true; return; }
    uploading = true;
    try {
      let raw = null; try { raw = localStorage.getItem(SAVE_KEY); } catch (e) {}
      const ts = localTs() || Date.now();
      const gen = meta && meta.g === 0 ? 1 : 0; // пишем в «другой» слот, потом переключаем указатель — сейв не порвётся
      const n = raw ? Math.ceil(raw.length / CH) : 0;
      let ok = true;
      for (let i = 0; i < n && ok; i++) ok = await csSet(`s${gen}_${i}`, raw.slice(i * CH, (i + 1) * CH));
      if (ok) { const m = { g: gen, n, ts }; if (await csSet('m', JSON.stringify(m))) meta = m; }
    } finally { uploading = false; if (again) { again = false; upload(); } }
  }
  const schedule = (ms = 4000) => { clearTimeout(upT); upT = setTimeout(upload, ms); };

  async function before() {
    if (user.first_name) try { UI._name(String(user.first_name).slice(0, 24)); } catch (e) {}
    if (!CS) return;
    const got = await Promise.race([csGet(['m']), new Promise(r => setTimeout(() => r(null), 4000))]);
    try { meta = got && got.m ? JSON.parse(got.m) : null; } catch (e) { meta = null; }
    if (!meta || !(meta.ts > localTs())) { if (localTs() > ((meta && meta.ts) || 0)) schedule(500); return; }
    if (!meta.n) { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} setLocalTs(meta.ts); return; }
    const keys = Array.from({ length: meta.n }, (_, i) => `s${meta.g}_${i}`);
    const parts = {};
    for (let i = 0; i < keys.length; i += 50) { const v = await csGet(keys.slice(i, i + 50)); if (!v) return; Object.assign(parts, v); }
    const raw = keys.map(k => parts[k] || '').join('');
    try { const s = JSON.parse(raw); if (s && s.v === 3) { localStorage.setItem(SAVE_KEY, raw); setLocalTs(meta.ts); } } catch (e) {}
  }

  // перехватываем сохранение/сброс игры
  const _save = window.save, _wipe = window.wipe;
  window.save = function () { _save.apply(this, arguments); setLocalTs(Date.now()); schedule(); };
  window.wipe = function () { _wipe.apply(this, arguments); setLocalTs(Date.now()); schedule(300); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(upT); upload(); } });

  // --- вибрация вместо/вместе со звуком ---
  const HAP = { hit: ['impact', 'medium'], shot: ['impact', 'heavy'], shotgun: ['impact', 'heavy'], hurt: ['notif', 'warning'], roar: ['impact', 'heavy'],
    death: ['notif', 'error'], quest: ['notif', 'success'], level: ['notif', 'success'], build: ['impact', 'light'], craft: ['impact', 'light'],
    pickup: ['impact', 'light'], zap: ['notif', 'warning'], siren: ['notif', 'warning'], horde: ['notif', 'warning'], notify: ['notif', 'success'], click: ['sel'] };
  function haptic(name) {
    const h = HAP[name]; if (!h || !tg.HapticFeedback || !ver('6.1')) return;
    try { if (h[0] === 'impact') tg.HapticFeedback.impactOccurred(h[1]); else if (h[0] === 'notif') tg.HapticFeedback.notificationOccurred(h[1]); else tg.HapticFeedback.selectionChanged(); } catch (e) {}
  }
  function hookSfx() { if (typeof SFX === 'undefined' || !SFX || SFX._tg) return; const p = SFX.play; SFX.play = function (n) { haptic(n); return p.apply(this, arguments); }; SFX._tg = 1; }
  hookSfx();

  // --- системная кнопка «Назад» ---
  function backTarget() {
    const md = document.getElementById('modal');
    if (typeof G === 'undefined' || !G || G.dead || G.combat || (md && md.children.length)) return null;
    const st = UI._st;
    if (st.trader) return () => { st.trader = null; UI.render(); };
    if (st.tab === 'loc' && G.room != null && typeof leaveRoom === 'function') return () => { leaveRoom(); save(); UI.render(); };
    if (st.tab !== 'loc') return () => UI.go('loc');
    return null;
  }
  let backFn = null;
  function syncBack() {
    if (!ver('6.1')) return;
    backFn = backTarget();
    try { backFn ? tg.BackButton.show() : tg.BackButton.hide(); } catch (e) {}
  }
  if (ver('6.1')) tg.BackButton.onClick(() => { const f = backTarget(); if (f) { haptic('click'); f(); } syncBack(); });
  const mo = new MutationObserver(() => { clearTimeout(mo.t); mo.t = setTimeout(syncBack, 30); });
  window.addEventListener('DOMContentLoaded', () => { ['main', 'modal'].forEach(id => { const el = document.getElementById(id); if (el) mo.observe(el, { childList: true }); }); syncBack(); });
  if (document.readyState !== 'loading') ['main', 'modal'].forEach(id => { const el = document.getElementById(id); if (el) mo.observe(el, { childList: true }); });

  return { before, tg, user, startParam, haptic, upload, ver };
})();
window.TGA = TGA;
