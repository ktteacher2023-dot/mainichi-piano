/* まいにちピアノ：ネットが とぎれても、まえに ひらいた 画面で つづけられるように
   ・ページは さきに ネットから とる（あたらしい 版が すぐ とどく）。つながらない ときだけ、まえに とった ものを だす
   ・教室の データ（Supabase）や LINE は ここでは あつかわない */
const C = 'mp2-pages-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if(r.method !== 'GET') return;
  const u = new URL(r.url);
  if(u.origin !== location.origin) return;
  const page = r.mode === 'navigate' || /\.(png|webmanifest)$/.test(u.pathname);
  if(!page) return;
  e.respondWith(fetch(r).then(res => {
    if(res && res.ok){ const cp = res.clone(); caches.open(C).then(c => c.put(r.mode === 'navigate' ? u.origin + u.pathname : r, cp)).catch(() => {}); }
    return res;
  }).catch(() => caches.match(r.mode === 'navigate' ? u.origin + u.pathname : r).then(x => x || caches.match(r, { ignoreSearch: true }))));
});
