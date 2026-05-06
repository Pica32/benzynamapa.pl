self.onmessage = function (e) {
  try {
    const data = e.data.data;
    if (!data || !Array.isArray(data.stations)) {
      self.postMessage({ ok: false });
      return;
    }
    const stations = data.stations.map(function (s) {
      const p = s.p;
      return Object.assign({}, s, {
        price: p ? {
          station_id: s.id,
          pb95: p.n95 != null ? p.n95 : null,
          pb98: p.n98 != null ? p.n98 : null,
          on: p.on != null ? p.on : null,
          lpg: p.lpg != null ? p.lpg : null,
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
