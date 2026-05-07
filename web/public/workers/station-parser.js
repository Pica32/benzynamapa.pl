/**
 * Web Worker: parsuje map_data.json mimo main thread.
 * Formát komprimovaných dat: p.n95→pb95, p.n98→pb98, p.on→on, p.lpg→lpg
 * Ceny v PLN (zł), zdroj: cenapaliw.pl nebo 'estimate'
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
          station_id: s.id,
          pb95: p.n95 != null ? p.n95 : null,
          pb98: p.n98 != null ? p.n98 : null,
          on:   p.on  != null ? p.on  : null,
          lpg:  p.lpg != null ? p.lpg : null,
          source: p.src || '',
          reported_at: p.at || '',
        } : null,
      });
    });
    self.postMessage({ ok: true, stations: stations });
  } catch (err) {
    self.postMessage({ ok: false });
  }
};
