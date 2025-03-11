import './style.css'
import P5 from 'p5'
import { renderImage, extractTiles, renderTiles } from './utils/utils';


const drawingCanvas = (p5 : P5) => {
    let img: P5.Image;
    const CANVAS_SIZE  = 200;

    p5.preload = () => {
      img = p5.loadImage('/assets/test_1.png');
    }

  
    p5.setup = () => {

        const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
        canvas.parent('drawing-canvas')

        p5.background(0)
        p5.image(img, 0, 0)

        renderImage(p5, img, 0, 0, CANVAS_SIZE)
    }
    p5.draw = () => {}
}

new P5(drawingCanvas)


const displayTilesCanvas = (p5 : P5) => {

  const CANVAS_SIZE = 200;

  let img : P5.Image;
  let tiles : P5.Image[];

  p5.preload = () => {
    img = p5.loadImage('/assets/test_1.png');
  }

  p5.setup = () => {
    const canvas = p5.createCanvas(CANVAS_SIZE, CANVAS_SIZE)
    canvas.parent('tiles-canvas')
    p5.background(0)
    tiles = extractTiles(p5, img, 3)
    console.log('tiles', tiles)
    renderImage(p5, tiles[3], 0, 0, CANVAS_SIZE)
  }

  p5.draw = () => {}

}

new P5(displayTilesCanvas)



