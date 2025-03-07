import Tile from "./Tile";
import { drawColorData } from "./utils/drawUtils";
import { averageColorData } from "./utils/utils";
import P5 from 'p5';

export default class Cell {

    col: number;
    row: number;
    size: number;
    state: Tile[];
    collapsed: boolean;
    p5: P5;

    constructor(col: number, row: number, size: number, state: Tile[], p5: P5) {
        this.col = col;
        this.row = row;
        this.size = size;
        this.state = state;
        this.collapsed = false;
        this.p5 = p5;
    }


    display() {
        const colorDataMatrices = this.state.map(tile => tile.tileData.colorData)
        if (colorDataMatrices.length > 1) {
            const averagedColorData = averageColorData(colorDataMatrices)
            drawColorData(averagedColorData, this.col, this.row, this.size, this.p5)
        } else {
            const tile = this.state[0]
            drawColorData(tile.tileData.colorData, this.col, this.row, this.size, this.p5)
        }
    }

    entropy() {
        return this.state.length
    }

    collapse() {
        const randomIndex = Math.floor(Math.random() * this.state.length)
        const collapsedTile = this.state[randomIndex]
        this.state = [collapsedTile]
        this.collapsed = true
    }

    updateState(newState: Tile[]) {
        this.state = newState
    }

    contains(x: number, y: number) {
        return (
            x >= this.col * this.size &&
            x < (this.col + 1) * this.size &&
            y >= this.row * this.size &&
            y < (this.row + 1) * this.size
        );
    }

}