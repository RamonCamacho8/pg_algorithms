import './style.css'
import P5 from 'p5'
import { renderImage } from './utils/utils';


const sketch = (p5 : P5) => {
    let img: P5.Image;
    const CANVAS_SIZE  = 300;

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

new P5(sketch)



