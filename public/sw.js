const C="nemo-v2";self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(["/","/manifest.json","/icon.svg"]))));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
