import { RGBcolor } from '../types';
import P5 from 'p5';
import Tile from '../Tile';
import Cell from '../Cell';

export const drawColorData = (colorData: RGBcolor[][], col: number, row: number, size: number, p5 : P5) => {

    p5.push();
    p5.noStroke();

    const [x, y] = [col * size, row * size]
    const [rows, columns] = [colorData.length, colorData[0].length]
    const [h, w] = [size / rows, size / columns]

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const c = colorData[i][j]
          p5.fill(p5.color(c.r, c.g, c.b))
          p5.rect(x + j * w, y + i * h, w, h)
        }
      }

    p5.pop();
}

export const displayGrid = (gridCols : number, gridRows: number, size : number, p5: P5) => {
    
    p5.push();
    p5.stroke('white');
    p5.strokeWeight(4);
    p5.noFill();

    for (let i = 0; i < gridCols; i++) {
        for (let j = 0; j < gridRows; j++) {
            p5.rect(i * size, j * size, size, size);
        }
    }

    p5.pop();
}


export const displayTilesInGrid = (tiles: Tile[], gridCols : number, gridRows: number, size : number, p5: P5) => {
    

    p5.push();
    
    const cells : Cell[] = []

    for (let i = 0; i < tiles.length; i++) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const cell = new Cell(col, row, size, [tiles[i]], p5);
        cells.push(cell);
    }

    cells.forEach(cell => {
        cell.display();
    })

    displayGrid(gridCols, gridRows, size, p5);
    
    
    p5.pop();

}

