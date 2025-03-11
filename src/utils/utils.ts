import P5 from "p5";

export const renderImage = (p5: P5, img: P5.Image, posX : number, posY : number, canvas_size : number) => {
    
    img.loadPixels();
    
    // Assuming is a square image, size in pixels.
    const img_size = img.width;
    const square_size = canvas_size / img_size;

    p5.push();

    for (let y = 0; y < img_size; y++) {
        for (let x = 0; x < img_size; x++) {
            const index = (x + y * img_size) * 4;
            const r = img.pixels[index];
            const g = img.pixels[index + 1];
            const b = img.pixels[index + 2];
            const a = img.pixels[index + 3];
            p5.fill(r, g, b, a);
            p5.square(x * square_size + posX, y * square_size + posY, square_size);
        }
    }

    p5.pop();

}
