import P5 from "p5";
import "./styles.scss";
import { createColorData, loadTileDataset, applyTransformations } from "./utils/utils";
import { displayGrid, displayTilesInGrid } from "./utils/drawUtils";
import Tile from "./Tile";
import Cell from "./Cell";



let tileDataSet = loadTileDataset();
tileDataSet.tiles = tileDataSet.tiles.filter(tileData => tileData.include)
tileDataSet.tiles.forEach(tileData => tileData.colorData = createColorData(tileData.bitmap, tileDataSet.palette))

tileDataSet.tiles = tileDataSet.tiles.flatMap(tileData => applyTransformations(tileData))
console.log(tileDataSet.tiles);
const tiles = Tile.createTiles(tileDataSet.tiles);


const displayTilesSketch = (p5: P5) => {

    const CANVAS_WIDTH = 400;
    const GRID_COLS = 4;
    const GRID_ROWS = Math.ceil(tiles.length / GRID_COLS);
    const SIZE = CANVAS_WIDTH / GRID_COLS;
    const CANVAS_HEIGHT = GRID_ROWS * SIZE;

    const createCells = () => {
        const cells = []
        for (let i = 0; i < tiles.length; i++) {
            const col = i % GRID_COLS;
            const row = Math.floor(i / GRID_COLS);
            const cell = new Cell(col, row, SIZE, [tiles[i]], p5);
            cells.push(cell);
        }
        return cells;
    }

    const displayCells = (cells: Cell[]) => {
        cells.forEach(cell => {
            cell.display();
        })
    }

    const isMouseHovering = (cells: Cell[]) => {
        let hoveredCell = null;
        for (let cell of cells) {
            if (cell.contains(p5.mouseX, p5.mouseY) && cell.state) {
                hoveredCell = cell;
                break;
            }
        }

        return hoveredCell
    }

    function displayCellState(cell: Cell) {

        p5.push()
        p5.fill(0, 0, 0, 200);
        p5.noStroke();
        p5.rect(p5.mouseX + 10, p5.mouseY - 40, 150, 90, 5);
        p5.fill(255);
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.CENTER);


        if (cell.state.length === 1) {
            const tile = cell.state[0];

            const text1 = `State: ${tile.tileData.flipInfo.wasFlipped}`
            p5.text(text1, p5.mouseX + 15, p5.mouseY - 25);
            const text2 = `Down: ${tile.tileData.socketData.sockets.down}`
            p5.text(text2, p5.mouseX + 15, p5.mouseY - 10);
            const type = `Type: ${tile.tileData.type}`
            p5.text(type, p5.mouseX + 15, p5.mouseY + 10);
            const name = `Name: ${tile.tileData.name}`
            p5.text(name, p5.mouseX + 15, p5.mouseY + 25);
        }
        else {
            const content = `Posible states ${cell.state.length}`
            p5.text(content, p5.mouseX + 15, p5.mouseY - 25);

        }
        p5.pop();

    }

    const cells = createCells();

    p5.setup = () => {

        const canvas = p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.parent("app");
        p5.frameRate(20);
        p5.background("black");


        displayCells(cells);
        displayGrid(GRID_COLS, GRID_ROWS, SIZE, p5);

    };

    p5.draw = () => {



        p5.background("black");
        displayCells(cells);
        displayGrid(GRID_COLS, GRID_ROWS, SIZE, p5);

        let hoveredCell = isMouseHovering(cells);
        if (hoveredCell) {
            displayCellState(hoveredCell);
        }


    };
};


new P5(displayTilesSketch);


const boardSketch = (p5: P5) => {

    const GRID_SIZE = 40;
    const CELLS_SIZE = 20;
    const BOARD_SIZE = GRID_SIZE * CELLS_SIZE;

    const createCells = () : Cell[] => {
        const cells = []
        for (let i = 0; i < CELLS_SIZE * CELLS_SIZE; i++) {
            const col = i % CELLS_SIZE;
            const row = Math.floor(i / CELLS_SIZE);
            const cell = new Cell(col, row, GRID_SIZE, tiles, p5);
            cells.push(cell);
        }
        return cells;
    }

    const cells = createCells();

    p5.setup = () => {
        const canvas = p5.createCanvas(BOARD_SIZE, BOARD_SIZE);
        canvas.parent("app");
        p5.frameRate(20);
        p5.background("black");
        cells.forEach(cell => cell.display())
        displayGrid(CELLS_SIZE, CELLS_SIZE, GRID_SIZE, p5);
    }

    p5.draw = () => {
        const selectedCell : Cell = Cell.selectCell(cells)
        if (!selectedCell) {
            p5.noLoop()
            return
        }

        selectedCell.collapse()
        const neighbors = selectedCell.updateNeighbors(cells)

        try {
            neighbors.forEach(neighbor => neighbor.display())
          }
          catch {
            console.log(neighbors)
        }

        selectedCell.display()

    }
}

new P5(boardSketch);
