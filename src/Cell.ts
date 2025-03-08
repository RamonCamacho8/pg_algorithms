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

    static selectCell = (cells : Cell[]) : Cell=> {

        const nonCollapsedCells = cells.filter(cell => !cell.collapsed)
      
        if (nonCollapsedCells.length === 0) {
          return null
        }
      
        let minEntropy = Number.MAX_VALUE
        let selectedCell = null
        const entropyMap = new Map()
      
      
        nonCollapsedCells.forEach(cell => {
          const entropy = cell.entropy()
          entropyMap.set(cell, entropy)
          if (entropy < minEntropy) {
            minEntropy = entropy
          }
        })
      
        const minEntropyCells = cells.filter(cell => entropyMap.get(cell) === minEntropy)
      
        if (minEntropyCells.length > 1) {
          selectedCell = cells[Math.floor(Math.random() * minEntropyCells.length)]
        }
        else {
          selectedCell = minEntropyCells[0]
        }
      
        return selectedCell
    }

    static getNeighborsOfCell = (cell : Cell, cells : Cell[]) : Map<string, Cell> => {

        const neighbors = new Map()
        const nonCollapsedCells = cells.filter(cell => !cell.collapsed)
       
        const top = nonCollapsedCells.find(c => c.col === cell.col && c.row === cell.row - 1)
        const bottom = nonCollapsedCells.find(c => c.col === cell.col && c.row === cell.row + 1)
        const left = nonCollapsedCells.find(c => c.col === cell.col - 1 && c.row === cell.row)
        const right = nonCollapsedCells.find(c => c.col === cell.col + 1 && c.row === cell.row)
      
        if (top) {
          neighbors.set('up', top)
        }
        if (bottom) {
          neighbors.set('down', bottom)
        }
        if (left) {
          neighbors.set('left', left)
        }
        if (right) {
          neighbors.set('right', right)
        }
      
        return neighbors
      }

    static updateNeighborStates = (cell : Cell, neighbors : Map<string, Cell>) => {

        neighbors.forEach((neighbor, direction) => {
      
          const neighborState = neighbor.state
      
          let newNeighborState = neighborState.filter(tile => Tile.canConnect(cell.state[0], tile, direction))
      
          if (newNeighborState.length === 0) {
            newNeighborState = [
              new Tile(cell.state[0].tileData)
            ]
          }
      
          neighbor.updateState(newNeighborState)
      
        })
      
    }

    getNeighbors = (cells : Cell[]) => {
        return Cell.getNeighborsOfCell(this, cells)
    }
    /**
     * Returns the updated neighbors
     * 
     */
    updateNeighbors = (cells : Cell[]) : Cell[] => {
        const neighbors = this.getNeighbors(cells)
        Cell.updateNeighborStates(this, neighbors)

        return Array.from(neighbors.values())
    }


    
}