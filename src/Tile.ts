import { TileData } from "./types";
import P5 from 'p5';
import { drawColorData } from './utils/drawUtils';

export default class Tile {

    tileData: TileData;

    constructor(tileData: TileData) {
        this.tileData = tileData;    
    }

    display(col : number, row : number, size : number, p5 : P5) {
        drawColorData(this.tileData.colorData, col, row, size, p5)
    }

    static createTiles(tileData: TileData[]) {
        return tileData.map(tileData => new Tile(tileData))
    }

}