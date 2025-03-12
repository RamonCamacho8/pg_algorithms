import p5 from "p5";
import { renderImage } from "./utils/utils";


export default class Tile {

    img: p5.Image;
    index: number;
    neighborsIndices: number[][];

    static UP = 0;
    static RIGHT = 1;
    static DOWN = 2;
    static LEFT = 3;

    constructor(img: p5.Image,index : number) {
        
        this.img = img;
        this.index = index;
        this.neighborsIndices = [];
        this.neighborsIndices[Tile.UP] = [];
        this.neighborsIndices[Tile.RIGHT] = [];
        this.neighborsIndices[Tile.DOWN] = [];
        this.neighborsIndices[Tile.LEFT] = [];
    }

    displayNeighbors = (p5 : p5, direction : number, canvas_size : number, tilesReference : Tile[]) : void => {
        //Display self in the first column and row and display neighbors in the second column and the corresponding row from 0 to the number of neighbors in that direction
        
        p5.push();
        p5.noFill();
        p5.stroke('blue');

        const localSize = canvas_size / 4;
        
        renderImage(p5, this.img, 0, 0, localSize);

        p5.pop();
        console.log(this.neighborsIndices[direction].length)
        this.neighborsIndices[direction].forEach((neighbor, index) => {
            p5.push();
            p5.noFill();
            p5.stroke('red');
            renderImage(p5, tilesReference[neighbor].img, localSize, index * localSize, localSize);
            p5.pop();
        })
    }

    createNeighbors = (tiles : Tile[]) : void => {
        for (let i = 0; i < tiles.length; i++) {
            
            
            if (tiles[i].index === this.index) continue;

            //console.log("Checking tile with index: ", tiles[i].index)

            if(this.overlapping(tiles[i], Tile.UP)) {
                this.neighborsIndices[Tile.UP].push(tiles[i].index);
            }
            if(this.overlapping(tiles[i], Tile.RIGHT)) {
                this.neighborsIndices[Tile.RIGHT].push(tiles[i].index);
            }
            if(this.overlapping(tiles[i], Tile.DOWN)) {
                this.neighborsIndices[Tile.DOWN].push(tiles[i].index);
            }
            if(this.overlapping(tiles[i], Tile.LEFT)) {
                this.neighborsIndices[Tile.LEFT].push(tiles[i].index);
            }
        }
    }

    static calculateNeighbors = (tiles : Tile[]) : void => {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].createNeighbors(tiles);
        }
    }

    

    overlapping = (other : Tile, direction : number) : Boolean => {
        
        const overlappingWeight = 2;
        //console.log("Checking overlapping with tile: ", other.index, " in direction: ", direction)
        if(direction === Tile.RIGHT) {
            const size = this.img.width;
            const startIndex = size - overlappingWeight;
            for (let y = 0; y < size; y++) {
                for (let x = startIndex; x < size; x++) {

                    const index = (x + y * size) * 4;
                    const r = this.img.pixels[index];
                    const g = this.img.pixels[index + 1];
                    const b = this.img.pixels[index + 2];

                    const otherIndex = (x - startIndex + y * size) * 4;
                    const otherR = other.img.pixels[otherIndex];
                    const otherG = other.img.pixels[otherIndex + 1];
                    const otherB = other.img.pixels[otherIndex + 2];

                    if(r !== otherR || g !== otherG || b !== otherB) {
                        /* console.log("Pixel mismatch:", x + y * size, x - startIndex + y * size)
                        console.log(`r: ${r} g: ${g} b: ${b} otherR: ${otherR} otherG: ${otherG} otherB: ${otherB}`)
                        console.log("Not overlapping") */
                        return false;
                    }
                }
            }
            return true;
        }
        else if(direction === Tile.LEFT) {
            const size = this.img.width;
            const startIndex = 0;
            for (let y = 0; y < size; y++) {
                for (let x = startIndex; x < overlappingWeight; x++) {

                    const index = (x + y * size) * 4;
                    const r = this.img.pixels[index];
                    const g = this.img.pixels[index + 1];
                    const b = this.img.pixels[index + 2];

                    const otherIndex = (size - overlappingWeight + x + y * size) * 4;
                    const otherR = other.img.pixels[otherIndex];
                    const otherG = other.img.pixels[otherIndex + 1];
                    const otherB = other.img.pixels[otherIndex + 2];

                    if(r !== otherR || g !== otherG || b !== otherB) {
                        return false;
                    }
                }
            }
            return true;
        }
        else if(direction === Tile.UP) {
            const size = this.img.width;
            const startIndex = 0;
            for (let x = 0; x < size; x++) {
                for (let y = startIndex; y < overlappingWeight; y++) {

                    const index = (x + y * size) * 4;
                    const r = this.img.pixels[index];
                    const g = this.img.pixels[index + 1];
                    const b = this.img.pixels[index + 2];

                    const otherIndex = (x + (size - overlappingWeight + y) * size) * 4;
                    const otherR = other.img.pixels[otherIndex];
                    const otherG = other.img.pixels[otherIndex + 1];
                    const otherB = other.img.pixels[otherIndex + 2];

                    if(r !== otherR || g !== otherG || b !== otherB) {
                        return false;
                    }
                }
            }
            return true;
        }
        else if(direction === Tile.DOWN) {
            const size = this.img.width;
            const startIndex = size - overlappingWeight;
            for (let x = 0; x < size; x++) {
                for (let y = startIndex; y < size; y++) {
                        
                        const index = (x + y * size) * 4;
                        const r = this.img.pixels[index];
                        const g = this.img.pixels[index + 1];
                        const b = this.img.pixels[index + 2];
    
                        const otherIndex = (x + (y - startIndex) * size) * 4;
                        const otherR = other.img.pixels[otherIndex];
                        const otherG = other.img.pixels[otherIndex + 1];
                        const otherB = other.img.pixels[otherIndex + 2];
    
                        if(r !== otherR || g !== otherG || b !== otherB) {
                            return false;
                        }
                    }
                }
            return true;
        }

        return false;

    }

    static getTileByItsIndex = (tiles : Tile[], index : number) : Tile | null => {
        
        for (let i = 0; i < tiles.length; i++) {
            if(tiles[i].index === index) {
                return tiles[i];
            }
        }

        return null;
        
    }

    


}