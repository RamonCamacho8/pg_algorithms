const BACKGROUND_COLOR = 'white'

const CELL_SIZE = 24
const QUANTITY = 30
const CANVAS_SIZE = QUANTITY * CELL_SIZE



const baseTiles = [
  {
    baseName: 'empty',
    render: [[0,0,0],[0,0,0],[0,0,0]],
    rotations: []
  },
  {
    baseName: 'cross',
    render: [[0,1,0],[1,1,1],[0,1,0]],
    rotations: []
  },
  { 
    baseName: 'line',
    render: [[0,1,0],[0,1,0],[0,1,0]],
    rotations: [90]
  },
  { 
    baseName: 'elbow',
    render: [[0,0,0],[0,1,1],[0,1,0]],
    rotations: [90, 180, 270]
  },
  {
    baseName: 'tee',
    render: [[0,1,0],[1,1,1],[0,0,0]],
    rotations: [90, 180, 270]
  },
  {
    baseName: 'end',
    render: [[0,1,0],[0,1,0],[0,0,0]],
    rotations: [90, 180, 270]
  }
]





const applyRotations = (tile) => {
  
  const results = [];
  const { baseName, render, rotations } = tile;

  // Agregamos la base sin rotación
  results.push({
    baseName: baseName,
    name: `${baseName}_0`,
    render: render
  });

  // Función que rota una matriz 90° en el sentido de las agujas del reloj
  function rotar90(matriz) {
    const n = matriz.length;
    const nueva = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        nueva[j][n - 1 - i] = matriz[i][j];
      }
    }
    return nueva;
  }

  // Para cada ángulo de rotación, aplicamos el número de rotaciones de 90° que corresponda
  rotations.forEach(angulo => {
    let pasos = angulo / 90;
    let matrizRotada = render;
    for (let i = 0; i < pasos; i++) {
      matrizRotada = rotar90(matrizRotada);
    }
    results.push({
      baseName: baseName,
      name: `${baseName}_${angulo}`,
      render: matrizRotada
    });
  });

  return results;

}

const generatedTiles = baseTiles.map(applyRotations).flat()


const drawGrid = (canvasSize, cellSize) => {

  stroke('black')
  strokeWeight(2)

  for (let i = cellSize; i <= canvasSize - cellSize; i += cellSize) {
    line(i, 0, i, canvasSize)
    line(0, i, canvasSize, i)
  }
  
}

const drawBorder = () => {

  stroke('red')
  strokeWeight(4)

  line(0, 0, CANVAS_SIZE, 0)
  line(0, 0, 0, CANVAS_SIZE)
  line(CANVAS_SIZE, 0, CANVAS_SIZE, CANVAS_SIZE)
  line(0, CANVAS_SIZE, CANVAS_SIZE, CANVAS_SIZE)

}


class Tile {

  constructor(tileData) {

    this.tileData = tileData

  }

  display(col, row, cellSize){
    
    const x = col * cellSize
    const y = row * cellSize

    stroke('white')
    strokeWeight(0)

    const render = this.tileData.render
    const subpix = {
      height: cellSize / render.length,
      width: cellSize / render[0].length
    }

    const availableColors = [color(0,25,25), color(0,255,255)]

    render.forEach((row, i) => {
      row.forEach( (column, j) => {

        fill(availableColors[column])
        rect(x + j * subpix.width, y + i * subpix.height, subpix.width, subpix.height)
        
      })});
  }

}


class Cell {

  constructor(col, row, size) {
    this.col = col
    this.row = row
    this.size = size
    this.tile = null
  }

  setTile(tile) {
    this.tile = tile
  }

  display() {
    if (this.tile) {
      this.tile.display(this.col, this.row, this.size)
    }
  }

  contains(x, y) {
    return (
      x >= this.col * this.size && 
      x < (this.col + 1) * this.size && 
      y >= this.row * this.size && 
      y < (this.row + 1) * this.size
    );
  }

}


const cells = []

for (let i = 0; i < QUANTITY; i++) {
  for (let j = 0; j < QUANTITY; j++) {
    
    const randomIndex = Math.floor(Math.random() * baseTiles.length)
    const tile = new Tile(generatedTiles[randomIndex])
    const cell = new Cell(i, j, CELL_SIZE)
    
    cell.setTile(tile)
    cells.push(cell)

  }
}

function setup() {

  createCanvas(CANVAS_SIZE, CANVAS_SIZE)
  background(BACKGROUND_COLOR)
  drawGrid(CANVAS_SIZE, CELL_SIZE)
  drawBorder()

  cells.forEach(cell => cell.display())

}

function draw() {


  //CAp frame rate
  frameRate(10)

  // Check if mouse is over any cell
  let hoveredCell = null;
  for (let cell of cells) {
    if (cell.contains(mouseX, mouseY) && cell.tile) {
      hoveredCell = cell;
      break;
    }
  }
  
  // If a cell is being hovered, display its tile information
  if (hoveredCell) {
    // Redraw everything to clear previous tooltips
    background(BACKGROUND_COLOR);
    drawGrid(CANVAS_SIZE, CELL_SIZE);
    drawBorder();
    cells.forEach(cell => cell.display());
    
    // Display tooltip for the hovered cell
    displayTileInfo(hoveredCell.tile);
  }
}

function displayTileInfo(tile) {
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(mouseX + 10, mouseY - 40, 150, 30, 5);
  
  fill(255);
  textSize(12);
  textAlign(LEFT, CENTER);

  const content = `Base Name: ${tile.tileData.baseName} \nName: ${tile.tileData.name} `;
  text(content, mouseX + 15, mouseY - 25);
  pop();
}
