"""Vyčistí history_pl.json — nahradí outliery interpolací ze sousedních validních dnů.

Why: Před P5.1 (commit b8d2c6a) scraper nemýl median+sanity check. Některé scrape runs
zapsaly nesmyslné hodnoty (PB95 9.15 zł, LPG 6.38 zł, PB98 9.99 zł, ON 8.40 zł).
Tyhle hodnoty teď kreslí divné skoky v /historia-cen/ grafech.

Strategie: realistic ranges pro PL trh (květen 2026):
- PB95: 5.5 - 7.0
- PB98: 6.3 - 7.6
- ON: 5.8 - 7.4
- LPG: 2.5 - 4.0

Outliery nahradím lineární interpolací mezi nejbližšími validními sousedními dny.
"""
import json
import os
import shutil
from datetime import datetime

HERE = os.path.dirname(__file__)
HIST_FILE = os.path.join(HERE, 'history_pl.json')
HIST_90D = os.path.join(HERE, '..', 'web', 'public', 'data', 'history_90d.json')

RANGES = {
    'pb95': (5.5, 7.0),
    'pb98': (6.3, 7.6),
    'on':   (5.8, 7.4),
    'lpg':  (2.5, 4.0),
}


def is_valid(fuel: str, val) -> bool:
    if val is None:
        return False
    lo, hi = RANGES[fuel]
    return lo <= val <= hi


def interpolate_outliers(history: list, fuel: str) -> list:
    """Pro každý den s outlier hodnotou nahraď lineární interpolací mezi nejbližšími valid sousedy."""
    n = len(history)
    # Indexy valid dnů pro tento fuel
    valid_idx = [i for i, e in enumerate(history) if is_valid(fuel, e.get(fuel))]
    if len(valid_idx) < 2:
        return history  # málo dat, nelze interpolovat

    for i in range(n):
        if is_valid(fuel, history[i].get(fuel)):
            continue
        # najdi nejbližší valid před a po
        prev_valid = max((j for j in valid_idx if j < i), default=None)
        next_valid = min((j for j in valid_idx if j > i), default=None)

        if prev_valid is None and next_valid is None:
            continue
        elif prev_valid is None:
            new_val = history[next_valid][fuel]
        elif next_valid is None:
            new_val = history[prev_valid][fuel]
        else:
            # lineární interpolace
            p_val = history[prev_valid][fuel]
            n_val = history[next_valid][fuel]
            ratio = (i - prev_valid) / (next_valid - prev_valid)
            new_val = p_val + (n_val - p_val) * ratio

        old = history[i].get(fuel)
        history[i][fuel] = round(new_val, 2)
        print(f"  {history[i]['date']} {fuel}: {old} -> {history[i][fuel]} zl")
    return history


def main():
    with open(HIST_FILE, encoding='utf-8') as f:
        data = json.load(f)
    history = data.get('history', [])
    print(f"History: {len(history)} dní od {history[0]['date']} do {history[-1]['date']}")
    print()

    # Backup
    backup = HIST_FILE + f".backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    shutil.copy(HIST_FILE, backup)
    print(f"Backup: {backup}")
    print()

    for fuel in ('pb95', 'pb98', 'on', 'lpg'):
        print(f"--- {fuel.upper()} ---")
        history = interpolate_outliers(history, fuel)
    print()

    out = {'history': history}
    with open(HIST_FILE, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"Zapsáno: {HIST_FILE}")

    # Také aktualizovat history_90d.json (public data)
    if os.path.exists(HIST_90D):
        with open(HIST_90D, 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False)
        print(f"Zapsáno: {HIST_90D}")


if __name__ == '__main__':
    main()
