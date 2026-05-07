/**
 * Web Worker: parsuje komprimovaný map_data.json mimo main thread.
 *
 * Formát p pole:
 *   src: 'r' = cenapaliw.pl (reálná cena), 'e' = estimate (odhad)
 *   n95, on, lpg, n98 — ceny v PLN, null hodnoty jsou vynechány
 *   at — ISO timestamp jen u reálných cen (src='r')
 */
self.onmessage = function (e) {
  try {
    var data = e.data.data;
    if (!data || !Array.isArray(data.stations)) {
      self.postMessage({ ok: false });
      return;
    }
    var stations = data.stations.map(function (s) {
      var p = s.p;
      return Object.assign({}, s, {
        price: p ? {
          station_id:  s.id,
          pb95:        p.n95  != null ? p.n95  : null,
          pb98:        p.n98  != null ? p.n98  : null,
          on:          p.on   != null ? p.on   : null,
          lpg:         p.lpg  != null ? p.lpg  : null,
          // src: 'r' → 'cenapaliw.pl', 'e' → 'estimate'
          source:      p.src === 'r' ? 'cenapaliw.pl' : 'estimate',
          reported_at: p.at || '',
        } : null,
      });
    });
    self.postMessage({ ok: true, stations: stations });
  } catch (err) {
    self.postMessage({ ok: false });
  }
};
