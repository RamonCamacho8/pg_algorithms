import Tile from "./Tile"
import P5 from "p5";
import { renderImage } from "./utils/utils";

export default class Cell {

    index : number;
    x: number;
    y: number;
    size: number;
    state: number[];
    collapsed: boolean = false;
    checked : boolean = false;

    constructor(x: number, y: number, size: number, tiles: Tile[], index : number) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.size = size;
        this.state = tiles.map(tile => tile.index)

    }

    display = (p5: P5, tiles : Tile[]) => {
        if (!this.collapsed) {
            p5.square(this.x * this.size, this.y * this.size, this.size)
        }
        else {
            const collapsedTile = tiles[this.state[0]]
            renderImage(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
        }
    }

    displayBorder = (p5: P5) => {
        p5.push()
        p5.noFill()
        p5.stroke('blue')
        p5.square(this.x, this.y, this.size)
        p5.pop()
    }

    entropy = (): number => {
        return this.state.length
    }

    updateSate = (newState: number[]) => {
        this.state = newState
    }

    collapse = () => {
        const randomIndex = Math.floor(Math.random() * this.state.length)
        const collapsedTile = this.state[randomIndex]
        this.updateSate([collapsedTile])
        this.collapsed = true
    }

    getNeighbors = (grid: Cell[][]): Cell[] => {
        
        //const neighbors = new Map<number, Cell>()
        const neighbors : Cell [] = []

        if (this.x > 0) {
            neighbors[Tile.LEFT] = grid[this.y][this.x - 1]
        }
        if (this.x < grid[0].length - 1) {
            neighbors[Tile.RIGHT] = grid[this.y][this.x + 1]
        }
        if (this.y > 0) {
            neighbors[Tile.UP] = grid[this.y - 1][this.x]
        }
        if (this.y < grid.length - 1) {
            neighbors[Tile.DOWN] = grid[this.y + 1][this.x]
        }

        return neighbors
    }

    updateNeighbors = (neighbors: Cell[], tiles : Tile[]) => {
        
        neighbors.forEach((neighbor, direction) => {
            if (neighbor.collapsed) return
            //Create a new state based on the posible neighbors of the tile of this cell
            const tile = tiles[this.state[0]]
            const validTiles = tile.neighbors[direction].filter(neighborTile => neighborTile !== tile)
            const newState = validTiles.map(tile => tile.index)
            neighbor.updateSate(newState)
        })
        
    }


    static pickCell = (grid: Cell[][]) => {

        const nonCollapsedCells = grid.flat().filter(cell => !cell.collapsed)

        if (nonCollapsedCells.length === 0) return

        nonCollapsedCells.sort((a, b) => a.entropy() - b.entropy())
        const lowestEntropy = nonCollapsedCells[0].entropy()
        const lowestEntropyCells = nonCollapsedCells.filter(cell => cell.entropy() === lowestEntropy)
        
        if (lowestEntropyCells.length === 0) return
        if (lowestEntropyCells.length === 1) return lowestEntropyCells[0]

        return lowestEntropyCells[Math.floor(Math.random() * lowestEntropyCells.length)]
    }

}