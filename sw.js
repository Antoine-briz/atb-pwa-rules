// ------- sw.js (v3) : cache robuste pour mode icône/hors-ligne -------
const CACHE_NAME = "atb-rules-v13";

// Liste des fichiers à pré-cacher, incluant les fichiers PDF
const PRECACHE = [
  "./", "./index.html", 
  "./styles.css", 
  "./app.js", 
  "./rules.js",
  "./data/rules.json", 
  "./manifest.webmanifest",
  "./icons/icon-192.png", 
  "./icons/icon-512.png",
  "./img/bandeau.png",
  "./img/proba.png",
  "./img/adaptee.png",
  "./img/duree.png",
  "./img/pneumonie.png",
  "./img/urinaire.png",
  "./img/abdo.png",
  "./img/neuro.png", 
  "./img/dermohypodermite.png",
  "./img/fabrice.png",
  '/img/sensibles.png',
  '/img/SARM.png',
  '/img/ampC.png',
  '/img/BLSE.png',
  '/img/pyo.png',
  '/img/acineto.png',
  '/img/steno.png',
  '/img/carba.png',
  '/img/erv.png',
  '/img/fond.png',
  './pdf/antibiorein.pdf',  // Fichier PDF 1
  './pdf/antibiomoda.pdf',  // Fichier PDF 2
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Normalise les URLs (enlève l'origine) pour matcher le cache relatif
function toRelative(url) {
  const u = new URL(url, self.location.href);
  // Déduplique "/" et "./"
  let p = u.pathname;
  if (!p.endsWith("/") && u.search === "" && u.hash === "" && p.indexOf(".") === -1) {
    // Ex : "/atb/" -> on laissera passer la stratégie navigate ci-dessous
  }
  if (p.startsWith(self.registration.scope)) {
    p = p.slice(self.registration.scope.length);
  }
  if (p.startsWith("/")) p = "." + p; // "/index.html" => "./index.html"
  if (p === "" || p === ".") p = "./";
  return p;
}

self.addEventListener("fetch", (event) => {
  // On ne gère que GET
  if (event.request.method !== "GET") return;

  const reqUrl = new URL(event.request.url);

  // 1) Navigation (tap sur l'icône, liens internes) -> app shell
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // 2) Cache-first pour nos fichiers de l'app
  const rel = toRelative(event.request.url);
  const important = PRECACHE.includes(rel);

  event.respondWith(
    caches.match(important ? rel : event.request).then((cached) => {
      if (cached) return cached;

      // Réseau + mise en cache si même origine
      return fetch(event.request).then((res) => {
        try {
          const url = new URL(event.request.url);
          if (url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
        } catch (_) {}
        return res;
      }).catch(() => {
        // Dernier recours : pour un import de module/JS/CSS introuvable,
        // renvoyer index.html (app shell) pour que l'app reste interactive
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
