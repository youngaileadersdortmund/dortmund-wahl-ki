import { Party } from '../type/party';

export async function loadParties() {
    const basePath = '/images';
    // Explicitly declare party folders
    const folders = ['cdu', 'fdp', 'gruene', 'linke', 'spd'];
    const parties = [];
    
    // Import all image and text files statically
    const allImageImports = import.meta.glob('/public/images/*/image/*', { as: 'url' });
    const allTextImports = import.meta.glob('/public/images/*/text/*', { as: 'raw' });

    for (const folder of folders) {
        const metadata = await fetch(`${basePath}/${folder}/metafile.json`).then(res => res.json());

        // Filter image imports for this folder
        const images = [];
        for (const path in allImageImports) {
            if (path.includes(`/images/${folder}/image/`)) {
                const imgUrl = await allImageImports[path]();
                images.push(imgUrl);
            }
        }

        // Filter text imports for this folder
        const texts = [];
        for (const path in allTextImports) {
            if (path.includes(`/images/${folder}/text/`)) {
                const textContent = await allTextImports[path]();
                texts.push(textContent);
            }
        }

        const party = new Party(folder, metadata, images, texts);
        parties.push(party);
    }

    return parties;
}
