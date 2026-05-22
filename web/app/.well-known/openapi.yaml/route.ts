/**
 * OpenAPI 3.0 specifikace pro BenzynaMAPA API.
 *
 * Konsumováno:
 * - OpenAI Custom GPT (Actions)
 * - ChatGPT plugin
 * - Swagger UI
 * - Postman, Insomnia
 */
export const dynamic = 'force-static';

export function GET() {
  const yaml = `openapi: 3.0.3
info:
  title: BenzynaMAPA API
  description: |
    Aktualne ceny paliw w Polsce. Benzyna 95, Pb98, diesel, LPG.
    8 600+ stacji, aktualizacja 3× dziennie. Licencja ODbL.
  version: "1.0.0"
  contact:
    email: kontakt@benzynamapa.pl
    url: https://benzynamapa.pl/api-docs/
  license:
    name: ODbL (Open Database License)
    url: https://opendatacommons.org/licenses/odbl/1-0/
servers:
  - url: https://benzynamapa.pl
    description: Production
paths:
  /data/stats_latest.json:
    get:
      operationId: getStats
      summary: Aktualne średnie krajowe ceny paliw
      description: Pobiera średnie ceny benzyny 95, 98, diesla i LPG w całej Polsce + trend 7-dniowy.
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  last_updated:
                    type: string
                    format: date-time
                  averages:
                    type: object
                    properties:
                      pb95: { type: number, description: "Benzyna 95 w zł/l" }
                      pb98: { type: number, description: "Benzyna 98 w zł/l" }
                      on:   { type: number, description: "Diesel (ON) w zł/l" }
                      lpg:  { type: number, description: "LPG Autogaz w zł/l" }
                  cheapest_today:
                    type: object
                    description: Najtańsze stacje per paliwo dziś
                  trend_7d:
                    type: object
                    description: Zmiana ceny w zł/l za ostatnie 7 dni
                  total_stations:
                    type: integer
  /data/prices_latest.json:
    get:
      operationId: getPrices
      summary: Wszystkie aktualne ceny per stacja
      responses:
        '200':
          description: OK (large file ~2 MB)
          content:
            application/json:
              schema:
                type: object
                properties:
                  prices:
                    type: array
                    items:
                      type: object
                      properties:
                        station_id: { type: string }
                        pb95: { type: number, nullable: true }
                        on:   { type: number, nullable: true }
                        lpg:  { type: number, nullable: true }
  /data/stations_latest.json:
    get:
      operationId: getStations
      summary: Pełna baza stacji paliw (GPS, adres, sieć, usługi)
      responses:
        '200':
          description: OK (large file ~5 MB)
  /data/history_90d.json:
    get:
      operationId: getHistory
      summary: 90-dniowa historia średnich krajowych
      responses:
        '200':
          description: OK
externalDocs:
  description: Pełna dokumentacja API
  url: https://benzynamapa.pl/api-docs/
`;
  return new Response(yaml, {
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
