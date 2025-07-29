import { Party } from '../type/party';

export async function loadParties() {
  const basePath = import.meta.env.VITE_ASSETS_BASE;
  const assetYear = import.meta.env.VITE_ASSETS_YEAR;
  const baseModel = import.meta.env.VITE_ASSETS_MODEL;
  const baseImage = import.meta.env.VITE_ASSETS_IMAGE;

  if (!basePath) {
    throw new Error('Missing ASSETS_BASE environment variable.');
  }

  const folders = ['cdu', 'fdp', 'gruene', 'linke', 'spd'];

  const parties = [];

  for (const folder of folders) {
    const visualImpactUrl = `${basePath}/${folder}/prompts/visual_impact_points.txt`;
    const imageUrls = [1, 2, 3].map(num => `${basePath}/${assetYear}/${folder}/${baseImage}/${baseModel}/0_${num}.png`);

    const [metadata, visualImpactText] = await Promise.all([
      fetch(visualImpactUrl).then(res => res.text()),
    ]);

    parties.push(new Party(folder, metadata, imageUrls, visualImpactText));
  }

  return parties;
}
