export class Party {
    constructor(name, metadata, images, texts) {
        this.name = name;         // string: party name (e.g., 'gruene')
        this.metadata = metadata; // object: loaded from metafile.json
        this.images = images;     // array of image URLs (relative to /public)
        this.texts = texts;       // array of text file contents
    }
}
