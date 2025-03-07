import P5 from "p5";

// Creating the sketch itself
const sketch = (p5: P5) => {
	
	p5.setup = () => {
		// Creating and positioning the canvas
		const canvas = p5.createCanvas(200, 200);
		canvas.parent("app");

		// Configuring the canvas
		p5.background("white");
	};

	// The sketch draw method
	p5.draw = () => {
		// Drawing a circle
        p5.fill("blue");
        p5.ellipse(100 , 100, 50, 50);
	};
};

const sketch_2 = (p5: P5) => {
    
    p5.setup = () => {
        // Creating and positioning the canvas
        const canvas = p5.createCanvas(200, 200);
        canvas.parent("app");

        // Configuring the canvas
        p5.background("white");
    };

    // The sketch draw method
    p5.draw = () => {
        // Drawing a circle
        p5.fill("red");
        p5.ellipse(100 , 100, 50, 50);
    };
};

new P5(sketch);
new P5(sketch_2);
