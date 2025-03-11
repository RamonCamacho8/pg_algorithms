import './style.css'
import P5 from 'p5'



const sketch = (p5 : P5) => {
    let img: P5.Image;

    p5.preload = () => {
      img = p5.loadImage('/assets/test_1.jpg');
    }

  
    p5.setup = () => {
        const canvas = p5.createCanvas(400, 400)
        canvas.parent('app')
        p5.background(0)
        p5.image(img, 0, 0)
    }
    p5.draw = () => {}
}

new P5(sketch)



