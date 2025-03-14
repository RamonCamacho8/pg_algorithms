import Tile from "./Tile"
import P5 from "p5";
import { renderCell, getOverlayColor, getEntropyGradientColor } from "./utils/utils";

export default class Cell {

    index : number;
    x: number;
    y: number;
    size: number;
    options: number[];
    collapsed: boolean = false;
    current : boolean = false;

    constructor(x: number, y: number, size: number, tiles: Tile[], index : number) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.size = size;
        this.options = tiles.map(tile => tile.index)

    }

    display = (p5: P5, tiles : Tile[]) => {

        p5.noStroke()

        if (this.options.length === 0) {
            p5.push()
            p5.fill('blue')
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.pop()
            return
        }

        if (!this.collapsed) {
            
            
            //const cellColor = getEntropyGradientColor(p5, this.options);

            const cellColor = getOverlayColor(p5, tiles, this.options);

            p5.push();
            p5.fill(cellColor);
            p5.square(this.x * this.size, this.y * this.size, this.size);
            p5.pop();

        }
        else {
            const collapsedTile = Tile.getTileByItsIndex(tiles, this.options[0])
            if (!collapsedTile) return
            renderCell(p5, collapsedTile.img, this.x * this.size, this.y * this.size, this.size)
        }

        if (this.current) {
            p5.push()
            p5.stroke('red')
            p5.strokeWeight(2)
            p5.noFill()
            p5.square(this.x * this.size, this.y * this.size, this.size)
            p5.pop()
        }
      
    }

    entropy = (): number => {
        const counts: { [key: number]: number } = {};
        for (const option of this.options) {
            counts[option] = (counts[option] || 0) + 1;
        }
        const total = this.options.length;
        let entropy = 0;
        for (const key in counts) {
            const p = counts[key] / total;
            entropy -= p * Math.log2(p);
        }
        return entropy;
    }

    updateState = (newState: number[]) => {
        this.options = newState
    }

    collapse = () => {
        if (this.options.length === 0) return false

        const randomIndex = Math.floor(Math.random() * this.options.length)
        const collapsedTile = this.options[randomIndex]
        this.updateState([collapsedTile])
        this.collapsed = true

        return true
    }

    getNeighbors = (grid: Cell[][]): Cell[] => {
        
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

    

    static reduceEntropyIterative = (startCell: Cell, grid: Cell[][], tiles: Tile[]) : number[] => {
        const updatedNeighborsIndices: number[] = [];
        // Usamos una pila para la propagación iterativa (sugerencia 1)
        const stack: Cell[] = [startCell];
      
        while (stack.length > 0) {
          const cell = stack.pop();
          if (!cell) continue;
      
          // Suponiendo que cell.getNeighbors devuelve un array de vecinos en el orden: [top, right, bottom, left]
          const neighbors = cell.getNeighbors(grid);
          
      
          for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
            if (!neighbor || neighbor.collapsed) continue;
      
            // Utilizamos un Set para acumular las opciones válidas sin duplicados (sugerencia 5)
            const validOptionsSet = new Set<number>();
            for (let currentOption of cell.options) {
              const tile = Tile.getTileByItsIndex(tiles, currentOption);
              
              if (!tile) {
                console.log("Tile not found")
                continue;
              };

              // Se agregan las opciones permitidas para el vecino en la dirección i
              for (const allowedOption of tile.neighborsIndices[i]) {
                validOptionsSet.add(allowedOption);
              }
            }

            if (neighbor.options.length === 0) {
                console.log("No options left for cell - NEIGHBOR", neighbor.index);
            }
      
            // Se filtran las opciones actuales del vecino, conservando solo aquellas que están en el conjunto válido
            const newValidOptions = neighbor.options.filter(option => validOptionsSet.has(option));
            
            if (newValidOptions.length === 0) {
                console.log("No options left for cell", neighbor.index);
            }

            // Actualización condicional: solo se actualiza si se reduce el conjunto de opciones (sugerencia 3)
            if (newValidOptions.length < neighbor.options.length) {
              neighbor.updateState(newValidOptions);
              updatedNeighborsIndices.push(neighbor.index);
              // Se agrega el vecino a la pila para continuar propagando el efecto de la actualización.
              // No se utiliza un flag permanente para evitar bloquear actualizaciones futuras (sugerencia 4)
              stack.push(neighbor);
            }
          }
        }
      
        return updatedNeighborsIndices;
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