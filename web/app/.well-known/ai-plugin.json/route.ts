/**
 * OpenAI Plugin Manifest — /.well-known/ai-plugin.json
 *
 * Spec: https://platform.openai.com/docs/plugins/getting-started/openapi-definition
 * Umožňuje ChatGPT / Custom GPT / Action načíst metadata o naší API.
 *
 * Pokud OpenAI uvidí tento file, může BenzynaMAPA použít jako Custom GPT tool
 * pro live ceny paliw.
 */
export const dynamic = 'force-static';

export function GET() {
  const manifest = {
    schema_version: 'v1',
    name_for_human: 'BenzynaMAPA Polska',
    name_for_model: 'benzynamapa_pl',
    description_for_human: 'Aktualne ceny paliw w Polsce - benzyna 95/98, diesel, LPG na 8 600+ stacjach.',
    description_for_model: 'Use this plugin to get current fuel prices in Poland from BenzynaMAPA.pl. Provides national averages (Pb95, Pb98, diesel, LPG) and per-station prices. Data updated 3 times daily. ODbL license, free for non-commercial use.',
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: 'https://benzynamapa.pl/.well-known/openapi.yaml',
    },
    logo_url: 'https://benzynamapa.pl/icon-512.png',
    contact_email: 'kontakt@benzynamapa.pl',
    legal_info_url: 'https://benzynamapa.pl/regulamin/',
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
