import P5 from "p5";

export const renderImage = (
    p5: P5,
    img: P5.Image,
    posX: number,
    posY: number,
    canvas_size: number
) => {
    img.loadPixels();

    // Assuming is a square image, size in pixels.
    const imgSize = img.width;
    const squareSize = canvas_size / imgSize;

    p5.push();

    for (let y = 0; y < imgSize; y++) {
        for (let x = 0; x < imgSize; x++) {
            const index = (x + y * imgSize) * 4;
            const r = img.pixels[index];
            const g = img.pixels[index + 1];
            const b = img.pixels[index + 2];
            const a = img.pixels[index + 3];
            p5.fill(r, g, b, a);
            p5.square(x * squareSize + posX, y * squareSize + posY, squareSize);
        }
    }

    p5.pop();
};

export const renderTiles = (p5 : P5, tiles : P5.Image[], canvas_size : number) => {

    const imgSize = tiles[0].width;
    const squareSize = canvas_size / imgSize;
    console.log('squareSize', squareSize);
    const tilesNumber = tiles.length;

    for (let i = 0; i < tilesNumber; i++) {
        const x = i % imgSize;
        const y = Math.floor(i / imgSize);
        p5.image(tiles[i], x * squareSize, y * squareSize, squareSize, squareSize);
    }


};

export const extractTiles = (
    p5: P5,
    sourceImage: P5.Image,
    tileSize: number
) => {
    sourceImage.loadPixels();

    const imgSize = sourceImage.width;
    let tiles : P5.Image[] = [];
   

    for (let i = 0; i < imgSize; i++) {
        for (let j = 0; j < imgSize; j++) {
            const tileImage = p5.createImage(tileSize, tileSize);
            tileImage.copy(sourceImage, i, j, tileSize, tileSize, 0, 0, tileSize, tileSize);
            tiles.push(tileImage);
        }
    }

    return tiles;
};
