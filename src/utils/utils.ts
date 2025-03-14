import P5 from "p5";
import Tile from "../Tile";

export const renderImage = (
    p5: P5,
    img: P5.Image,
    posX: number,
    posY: number,
    canvas_size: number
) => {

    // Assuming is a square image, size in pixels.
    const imgSize = img.width;
    const squareSize = canvas_size / imgSize;

    p5.push();
    p5.noStroke();

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


export const renderCell = (p5: P5,
    img: P5.Image,
    posX: number,
    posY: number,
    canvas_size: number) => {

    // Assuming is a square image, size in pixels.
    const imgSize = img.width;

    let i = Math.floor(imgSize / 2);
    let j = Math.floor(imgSize / 2);

    p5.push();
    p5.stroke(0);
    p5.noStroke();


    const index = (i + j * imgSize) * 4;
    const r = img.pixels[index];
    const g = img.pixels[index + 1];
    const b = img.pixels[index + 2];
    const a = img.pixels[index + 3];
    p5.fill(r, g, b, a);
    p5.square(posX, posY, canvas_size);
    p5.pop()

}


export const renderImages = (p5: P5, tiles: P5.Image[], canvas_size: number, originalImageSize: number = 9) => {

    const imgSize = originalImageSize;
    const squareSize = canvas_size / imgSize;
    const tilesNumber = tiles.length;

    p5.push();
    p5.noFill();
    p5.stroke('blue');


    for (let i = 0; i < tilesNumber; i++) {
        const x = i % imgSize;
        const y = Math.floor(i / imgSize);
        renderImage(p5, tiles[i], x * squareSize, y * squareSize, squareSize);
        p5.square(x * squareSize, y * squareSize, squareSize);
    }

    p5.pop();

};

export const extractTiles = (
    p5: P5,
    sourceImage: P5.Image,
    tileSize: number
) => {

    const imgSize = sourceImage.width;
    let tiles: Tile[] = [];



    for (let j = 0; j < imgSize; j++) {
        for (let i = 0; i < imgSize; i++) {
            // We create a image to save our data.
            const tileImage = p5.createImage(tileSize, tileSize);
            tileImage.loadPixels();

            const x0 = i;
            const y0 = j;

            for (let y2 = 0; y2 < tileSize; y2++) {
                for (let x2 = 0; x2 < tileSize; x2++) {

                    // When x0 = 0 and y2 = 0 then dx = 0 but when x0 = 8 and x2 = 2, then dx = 1 so it wraps around
                    const dx = (x2 + x0) % imgSize
                    const dy = (y2 + y0) % imgSize

                    const pixel = getPixel(sourceImage, dx, dy);
                    const index = (x2 + y2 * tileSize) * 4;
                    tileImage.pixels[index] = pixel.r;
                    tileImage.pixels[index + 1] = pixel.g;
                    tileImage.pixels[index + 2] = pixel.b;
                    tileImage.pixels[index + 3] = pixel.a;

                }
            }

            tileImage.updatePixels();
            tiles.push(new Tile(tileImage, i + j * imgSize));
        }
    }

    return tiles;
};

export const removeDuplicateTiles = (tiles: Tile[]): Tile[] => {
    
    const uniqueTiles: Tile[] = [];
    const seenSignatures = new Set<string>();

    for (let tile of tiles) {
        // Creamos una firma a partir del array de píxeles.
        // Esto asume que "tile.img.pixels" es un array de números representando RGBA.
        const signature = tile.img.pixels.join(',');

        // Si no hemos encontrado ya esta firma, se agrega el tile.
        if (!seenSignatures.has(signature)) {
            seenSignatures.add(signature);
            uniqueTiles.push(tile);
        }
    }

    for (let i = 0; i < uniqueTiles.length; i++) {
        uniqueTiles[i].index = i;
    }

    return uniqueTiles;
};


const getPixel = (img: P5.Image, x: number, y: number) => {

    const index = (x + y * img.width) * 4;
    return {
        r: img.pixels[index],
        g: img.pixels[index + 1],
        b: img.pixels[index + 2],
        a: img.pixels[index + 3],
    };
}

/**
 * Devuelve un color calculado a partir de un degradado basado en la entropía,
 * mapeando la cantidad de opciones (hasta un máximo de 81) a un color entre dos tonos.
 */
export const getEntropyGradientColor = (p5: P5, options: number[], maxOptions: number = 81): P5.Color => {
    // Se calcula un factor entre 0 y 1 basado en la cantidad de opciones.
    const fraction = Math.min(options.length / maxOptions, 1);
    // Definimos dos colores base: para baja entropía (menos opciones) y alta entropía (más opciones).
    const lowEntropyColor = p5.color("darkgreen");    // Gris oscuro
    const highEntropyColor = p5.color("yellow"); // Gris claro
    // Se interpola entre ambos colores según el factor calculado.
    return p5.lerpColor(lowEntropyColor, highEntropyColor, fraction);
};

/**
 * Función auxiliar para obtener el color promedio de una imagen.
 */
const getAverageColor = (p5: P5, img: P5.Image): P5.Color => {
    img.loadPixels();
    let sumR = 0, sumG = 0, sumB = 0;
    const numPixels = img.width * img.height;
    for (let i = 0; i < img.pixels.length; i += 4) {
        sumR += img.pixels[i];
        sumG += img.pixels[i + 1];
        sumB += img.pixels[i + 2];
    }
    const avgR = sumR / numPixels;
    const avgG = sumG / numPixels;
    const avgB = sumB / numPixels;
    return p5.color(avgR, avgG, avgB);
};

/**
 * Devuelve un color calculado a través de la superposición (mezcla) de todas las opciones únicas.
 * Se obtiene, para cada opción, el color promedio del tile correspondiente y se promedian los colores.
 */
export const getOverlayColor = (p5: P5, tiles: Tile[], options: number[]): P5.Color => {
    // Se obtienen solo las opciones únicas para evitar repetir cálculos.
    const uniqueOptions = Array.from(new Set(options));
    let sumR = 0, sumG = 0, sumB = 0;
    let count = 0;

    uniqueOptions.forEach(option => {
        const tile = Tile.getTileByItsIndex(tiles, option);
        if (tile) {
            const avgColor = getAverageColor(p5, tile.img);
            sumR += p5.red(avgColor);
            sumG += p5.green(avgColor);
            sumB += p5.blue(avgColor);
            count++;
        }
    });

    if (count === 0) {
        return p5.color(0);
    }

    // Se calcula el promedio final de cada componente.
    const finalR = sumR / count;
    const finalG = sumG / count;
    const finalB = sumB / count;

    return p5.color(finalR, finalG, finalB);
};

