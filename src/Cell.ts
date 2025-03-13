import Tile from "./Tile"
import P5 from "p5";
import { renderImage, renderCell } from "./utils/utils";

export default class Cell {

    index : number;
    x: number;
    y: number;
    size: number;
    options: number[];
    collapsed: boolean = false;
    checked : boolean = false;

    constructor(x: number, y: number, size: number, tiles: Tile[], index : number) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.size = size;
        this.options = tiles.map(tile => tile.index)

    }

    displayError = (p5: P5, tiles : Tile[]) => {
        if (!this.collapsed) {
            // Display the number of options
            p5.fill(
                255,
                0,
                0
            )
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.fill(0)
            p5.textSize(20)
            p5.text(this.options.length, this.x * this.size + this.size / 2 - 10, this.y * this.size + this.size / 2  + 5)
        }
        else {
            const collapsedTile = tiles[this.options[0]]
            renderCell(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
        }
    }

    displayActual = (p5: P5, tiles : Tile[]) => {
        if (!this.collapsed) {
            // Display the number of options
            p5.fill(
                128,
                128,
                0
            )
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.fill(0)
            p5.textSize(20)
            p5.text(this.options.length, this.x * this.size + this.size / 2 - 10, this.y * this.size + this.size / 2  + 5)
        }
        else {
            const collapsedTile = tiles[this.options[0]]
            renderCell(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
        }
    }

    display = (p5: P5, tiles : Tile[]) => {
        if (!this.collapsed) {
            // Display the number of options
            p5.fill(255)
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.fill(0)
            p5.textSize(20)
            p5.text(this.options.length, this.x * this.size + this.size / 2 - 10, this.y * this.size + this.size / 2  + 5)
        }
        else {
            const collapsedTile = tiles[this.options[0]]
            renderCell(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
        }
    }

    displaySelected = (p5: P5, tiles : Tile[]) => {
        if (!this.collapsed) {
            // Display the number of options
            p5.fill(128,
                0,
                0
            )
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.fill(
                255,
                0,
                0
            )
            p5.textSize(20)
            p5.text(this.options.length, this.x * this.size + this.size / 2 - 10, this.y * this.size + this.size / 2  + 5)
        }
        else {
            const collapsedTile = tiles[this.options[0]]
            renderCell(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
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
        return this.options.length
    }

    updateState = (newState: number[]) => {
        this.options = newState
    }

    collapse = () => {
        const randomIndex = Math.floor(Math.random() * this.options.length)
        const collapsedTile = this.options[randomIndex]
        this.updateState([collapsedTile])
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
            const tile = tiles[this.options[0]]
            const validTiles = tile.neighborsIndices[direction].filter(neighborTile => neighborTile !== tile.index)
            neighbor.updateState(validTiles)
        })

    }

    static reduceEntropy = (cell : Cell, grid : Cell[][], tiles : Tile[], depth : number = 1, p5 : P5) : number[] => {
        
        const updatedNeigborsIndices : number[] = []
        cell.displayActual(p5, tiles)

        cell.getNeighbors(grid).forEach((neighbor, direction) => {
            
            neighbor.displaySelected(p5, tiles)

            let validOptions : number[] = []
            if (!neighbor) return
            if (neighbor.collapsed) return
            if (neighbor.checked) return
            
            if (cell.options.length === 0) {
                console.log(cell)
                console.log('No valid options for cell')
                cell.displayError(p5, tiles)
                throw new Error('No valid options for cell ')
            }

            for(let option of cell.options) {
                const tile = Tile.getTileByItsIndex(tiles, option)
                if (!tile) return
                validOptions = validOptions.concat(...tile.neighborsIndices[direction])
                if (validOptions.length === 0) {
                    console.log(cell)
                    console.log('No valid options for neighbor')
                    cell.displayError(p5, tiles)
                    throw new Error('No valid options for neighbor')
                }
            }

            const newValidOptions = neighbor.options.filter(option => validOptions.includes(option))
            if (newValidOptions.length === 0) {
                console.log(neighbor.options, validOptions)
                console.log(cell)
                console.log('No valid options for neighbor')
                cell.displayError(p5, tiles)
                throw new Error('No valid options for neighbor')
            }
            neighbor.updateState(newValidOptions)
            neighbor.checked = true

            updatedNeigborsIndices.push(neighbor.index)

            if (depth > 0) {
                const updatedNeighbors = Cell.reduceEntropy(neighbor, grid, tiles, depth - 1, p5)
                updatedNeigborsIndices.push(...updatedNeighbors)
            }
        })
        console.log(updatedNeigborsIndices)
        updatedNeigborsIndices.forEach(index => { 
            const cell = Cell.getCellByIndex(grid, index)
            if (cell) cell.checked = false
         })
        cell.display(p5, tiles)
        return updatedNeigborsIndices
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

    static getCellByIndex = (grid: Cell[][], index: number) => {
        return grid.flat().find(cell => cell.index === index)
    }

}