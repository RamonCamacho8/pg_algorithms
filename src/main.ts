import './style.css'
import P5 from 'p5'
import { renderImage, extractTiles, renderImages } from './utils/utils';
import Tile from './Tile';
import Cell from './Cell';

const IMAGE_SOURCE = '/assets/test_3.png'


const drawingCanvas = (p5 : P5) => {
    
  let img: P5.Image;
    const CANVAS_SIZE  = 270;

    p5.preload = () => {
      img = p5.loadImage(IMAGE_SOURCE);
    }

    p5.setup = () => {

        const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
        canvas.parent('drawing-canvas')
        p5.background(0)

        renderImage(p5, img, 0, 0, CANVAS_SIZE)
    }
    p5.draw = () => {}
}



const displayTilesCanvas = (p5 : P5) => {

  const CANVAS_SIZE = 270;

  let img : P5.Image;
  let tiles : Tile[];

  p5.preload = () => {
    img = p5.loadImage(IMAGE_SOURCE);
  }

  p5.setup = () => {

    const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
    canvas.parent('tiles-canvas')
    p5.background(0)
    
    

    tiles = extractTiles(p5, img, 3)
    Tile.calculateNeighbors(tiles)
    renderImages(p5, tiles.map(tile => tile.img), CANVAS_SIZE)

    p5.push()
    p5.noFill()
    p5.stroke('yellow')
    p5.strokeWeight(6)
    p5.square(0, 0, CANVAS_SIZE)
    p5.pop()

  }
  
  p5.draw = () => {}

}


const displayNeighborsCanvas = (p5 : P5) => {
  
    const CANVAS_SIZE = 270;
  
    let img : P5.Image;
    let tiles : Tile[];
  
    p5.preload = () => {
      img = p5.loadImage(IMAGE_SOURCE);
      
    }
  
    p5.setup = () => {
  
      const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
      canvas.parent('neighbors-canvas')
      p5.background(0)      

      tiles = extractTiles(p5, img, 3)
      
      
      const index = 2
      const filterTiles = tiles.filter(tile => tile.index === index)
      const tile = filterTiles[0]

      tile.createNeighbors(tiles)
      tile.displayNeighbors(p5, Tile.DOWN, CANVAS_SIZE, tiles)

      console.log(tile)
  
    }

    p5.draw = () => {}
}


const wfcCanvas = (p5 : P5) => {

  const GRID_SIZE = 18;
  const CANVAS_SIZE = 540;
  const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
  const grid : Cell[][] = [];

  let img : P5.Image;
  let tiles : Tile[];

  p5.preload = () => {
    img = p5.loadImage(IMAGE_SOURCE);
  }

  p5.setup = () => {
    const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
    canvas.parent('cells-canvas')
    p5.background(0)
    p5.frameRate(30)
    

    tiles = extractTiles(p5, img, 3)
    Tile.calculateNeighbors(tiles)

    for (let y = 0; y < GRID_SIZE; y++) {
      grid[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellIndex = x + y * GRID_SIZE
        grid[y][x] = new Cell(x, y, CELL_SIZE, tiles, cellIndex)
      }
    }

    grid.forEach(row => row.forEach(cell => cell.display(p5, tiles)))

  }
  
  p5.draw = () => {

    const pickedCell = Cell.pickCell(grid)
    if (!pickedCell) {p5.noLoop(); return}
    pickedCell.collapse()
    
    const updatedCells = Cell.reduceEntropy(pickedCell, grid, tiles, 2, p5)
    
    pickedCell.display(p5, tiles)




    //p5.noLoop()
  }

}


new P5(drawingCanvas)
new P5(displayTilesCanvas)
new P5(displayNeighborsCanvas)
new P5(wfcCanvas)



