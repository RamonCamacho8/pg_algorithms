import P5 from "p5";
import "./styles.scss";


const drawingCanvas = (p5: P5) => {

    let img;

    // Display the image.
    function handleImage(img) {
        p5.image(img, 0, 0);
    }

    function handleError(event) {
        console.error('Oops!', event);
      }

    p5.preload = () => {
        img = p5.loadImage('./assets/test_1.jpg', handleImage, handleError);
    }
    p5.setup = () => {
        p5.createCanvas(400, 400)
        p5.background(0)

    }
    p5.draw = () => {}
}

new P5(drawingCanvas)