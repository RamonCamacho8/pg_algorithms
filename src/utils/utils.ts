import P5 from "p5";
import Tile from "../Tile";

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
    p5.stroke(0);

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

    img.loadPixels();

    

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

export const getUniqueRGBValues = (img : P5.Image) : number[][] => {
    // Ensure pixel data is ready
    img.loadPixels();
  
    const { width, height, pixels } = img;
    const uniqueColors = new Set<String>();
  
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate index in the pixel array
        const index = 4 * (y * width + x);
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        
        // Add "r,g,b" to the Set to keep only unique triplets
        uniqueColors.add(`${r},${g},${b}`);
      }
    }
  
    // Convert each "r,g,b" string back to an array [r, g, b]
    return Array.from(uniqueColors).map((colorString) => {
      return colorString.split(',').map(Number);
    });
};

const colorDistance = (c1 : number[], c2 : number[]) => {
    const dr = c1[0] - c2[0];
    const dg = c1[1] - c2[1];
    const db = c1[2] - c2[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
};

// Algoritmo de k-means muy básico para agrupar los colores.
const kMeans = (colors : number[][], k : number, maxIter = 2) => {
  if (colors.length < k) return colors;

  // Inicializa los centroides con k colores aleatorios de la lista.
  let shuffled = colors.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  let centroids = shuffled.slice(0, k);

  for (let iter = 0; iter < maxIter; iter++) {
    // Creamos k grupos vacíos.
    const clusters: number[][][] = new Array(k).fill(0).map((): number[][] => []);

    // Asignamos cada color al centroide más cercano.
    colors.forEach((color) => {
      let minDist = Infinity;
      let index = 0;
      centroids.forEach((centroid, i) => {
        const d = colorDistance(color, centroid);
        if (d < minDist) {
          minDist = d;
          index = i;
        }
      });
      clusters[index].push(color);
    });

    // Calculamos el promedio de cada clúster para obtener nuevos centroides.
    const newCentroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      let sumR = 0,
        sumG = 0,
        sumB = 0;
      cluster.forEach((color) => {
        sumR += color[0];
        sumG += color[1];
        sumB += color[2];
      });
      return [
        Math.round(sumR / cluster.length),
        Math.round(sumG / cluster.length),
        Math.round(sumB / cluster.length),
      ];
    });

    // Si los centroides no cambian, terminamos.
    let converged = true;
    for (let i = 0; i < k; i++) {
      if (colorDistance(centroids[i], newCentroids[i]) > 0) {
        converged = false;
        break;
      }
    }
    centroids = newCentroids;
    if (converged) break;
  }
  return centroids;
};

// Función principal: normaliza los colores de la imagen a k colores.
export const normalizeImageColor = (img : P5.Image, k = 3) => {
  // Obtiene todos los colores únicos.
  const unique = getUniqueRGBValues(img);
  console.log("Valores únicos antes de Normalización: ", unique);

  // Si la imagen tiene menos colores únicos que k, no hace nada.
  if (unique.length <= k) {
    console.warn("La imagen tiene menos colores únicos que el valor de k.");
    return;
  }

  // Agrupa los colores en k clústeres y obtiene los centroides.
  const centroids = kMeans(unique, k, 2);

  // Carga los píxeles de la imagen.
  img.loadPixels();
  const { width, height, pixels } = img;

  // Recorre cada píxel y asigna el color del centroide más cercano.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = 4 * (y * width + x);
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];

      let minDist = Infinity;
      let chosenColor = centroids[0];
      //console.log(centroids)
      centroids.forEach((centroid) => {
        const d = colorDistance([r, g, b], centroid);
        if (d < minDist) {
          minDist = d;
          chosenColor = centroid;
        }
      });

      pixels[index] = chosenColor[0];
      pixels[index + 1] = chosenColor[1];
      pixels[index + 2] = chosenColor[2];

      //Usar image.set(x, y, color) para cambiar el color de un pixel y probar si funciona mejor.
    }
  }
  img.updatePixels();
  console.log("Valores únicos después de Normalización: ", getUniqueRGBValues(img));
};


  

export const renderImages = (p5: P5, tiles: P5.Image[], canvas_size: number) => {

    const imgSize = 9;
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

    sourceImage.loadPixels();
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

const getPixel = (img: P5.Image, x: number, y: number) => {

    const index = (x + y * img.width) * 4;
    return {
        r: img.pixels[index],
        g: img.pixels[index + 1],
        b: img.pixels[index + 2],
        a: img.pixels[index + 3],
    };
}

export const averageImage = (images: P5.Image[], p5: P5): P5.Image => {

    const imageSize = images[0].width;
    const img = p5.createImage(imageSize, imageSize);
    img.loadPixels();



    // Asegurarse de que cada imagen tenga cargados sus píxeles
    images.forEach(image => image.loadPixels());

    // Iterar sobre cada píxel (cada píxel consta de 4 valores: R, G, B y A)
    for (let i = 0; i < img.pixels.length; i += 4) {
        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;

        // Sumar los valores de cada imagen para el píxel actual
        for (let j = 0; j < images.length; j++) {
            sumR += images[j].pixels[i];
            sumG += images[j].pixels[i + 1];
            sumB += images[j].pixels[i + 2];
            sumA += images[j].pixels[i + 3];
        }

        // Calcular el promedio de cada componente y asignarlo al píxel resultante
        const numImages = images.length;
        img.pixels[i] = sumR / numImages;
        img.pixels[i + 1] = sumG / numImages;
        img.pixels[i + 2] = sumB / numImages;
        img.pixels[i + 3] = sumA / numImages;
    }

    img.updatePixels();
    return img;

}


export const createCellsGrid = () => {

}
