import { scifi_tiles, flowers } from "./data.js"
/** @typedef {import("./data.js").TileData} TileData */
/** @typedef {import("./data.js").SocketData} SocketData */
/** @typedef {import("./data.js").ColorSpecification} ColorSpecification */


const BACKGROUND_COLOR = 'green'
const FRAME_RATE = 60
const FRAMES_LIMIT = 1000
const CELL_SIZE = 15
const QUANTITY = 30
const CANVAS_SIZE = QUANTITY * CELL_SIZE

const rotateMatrix = (matrix) => {

  const n = matrix.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }
  return rotated;
}

/**
 * Rotates a matrix 90° * times.
 * @param {Array<Array<number>>} matrix
 * @param {number} times
 * @returns {Map<number, Array<Array<number>>>}
 */
const rotateMatrixByRotations = (matrix, rotations) => {

  let rotated = matrix;
  let rotatedMatrices = new Map();
  for (let i = 0; i < rotations.length; i++) {
    const angle = rotations[i];
    rotated = rotateMatrix(rotated);
    rotatedMatrices.set(angle, rotated);
  }

  return rotatedMatrices;
}


/**
 * 
 * @param {SocketData} data 
 * @param {number} times 
 * @param {Object} customMapping 
 * @returns 
 */
const rotateSockedDataByTimes = (data, rotations, customMapping) => {
  if (!data) return data;
  const rotationMapping = customMapping || {
    up: 'right',
    right: 'down',
    down: 'left',
    left: 'up'
  }
  let rotatedSocketDatas = new Map();
  let rotated = { ...data };

  for (let a = 0; a < rotations.length; a++) {
    const temp = {};
    const angle = rotations[a];
    for (const key in rotated) {
      const newKey = rotationMapping[key];
      temp[newKey] = rotated[key];
    }
    rotated = temp;
    rotatedSocketDatas.set(angle, rotated);
  }
  return rotatedSocketDatas;
}


const flipMatrix = (matrix, direction) => {
  if (direction === 'horizontal') {
    return flipMatrixHorizontally(matrix);
  }
  else if (direction === 'vertical') {
    return flipMatrixVertically(matrix);
  }
  return matrix;
}

const flipMatrixHorizontally = (matrix) => {
  return matrix.map(row => row.slice().reverse());
}

const flipMatrixVertically = (matrix) => {
  return matrix.slice().reverse();
}


const applyFlips = (tileData) => {

  


}


/**
 * 
 * @param {TileData} tileData 
 * @returns {[TileData]}
 */
const applyRotations = (tileData) => {

  const results = [];
  const { type, bitmap, rotations, sockets } = tileData;

  results.push({
    name: `${type}_0`,
    ...tileData
  })

  const rotatedBitMaps = rotateMatrixByRotations(bitmap, rotations);
  const rotatedSockets = rotateSockedDataByTimes(sockets, rotations);

  rotations.forEach((angle) => {
    const rotatedMatrix = rotatedBitMaps.get(angle);
    const rotatedSocket = rotatedSockets.get(angle);
    results.push({
      name: `${type}_${angle}`,
      ...tileData,
      bitmap: rotatedMatrix,
      sockets: rotatedSocket
    });
  });

  return results;
}


/**
 * 
 * @param {TileData} tileData 
 */
const createColorData = (tileData) => {

  const bitmap = tileData.bitmap
  const palette = tileData.palette
  const colorData = []

  bitmap.forEach((row, i) => {
    colorData[i] = []
    row.forEach((column, j) => {
      const c = palette[column]
      colorData[i][j] = c
    })
  });

  tileData.colorData = colorData
}

const generatedTiles = flowers
  .filter(tile => tile.include)
  .map(applyRotations)
  .flat()

generatedTiles.forEach(createColorData)

console.log('Generated Tiles: ', generatedTiles)

const drawGrid = (canvasSize, cellSize) => {

  push()
  stroke('white')
  strokeWeight(1)

  for (let i = cellSize; i <= canvasSize - cellSize; i += cellSize) {
    line(i, 0, i, canvasSize)
    line(0, i, canvasSize, i)
  }
  pop()
}

const drawBorder = () => {

  stroke('red')
  strokeWeight(4)

  line(0, 0, CANVAS_SIZE, 0)
  line(0, 0, 0, CANVAS_SIZE)
  line(CANVAS_SIZE, 0, CANVAS_SIZE, CANVAS_SIZE)
  line(0, CANVAS_SIZE, CANVAS_SIZE, CANVAS_SIZE)

}


/**
 * Calcula la matriz promedio (RGB) a partir de un arreglo de matrices de colores.
 * @param {Array<Array<Array<{r: number, g: number, b: number}>>>} colorMatrices
 *        Un arreglo de matrices, donde cada matriz es de tamaño N x M y sus celdas
 *        contienen objetos {r, g, b}.
 * @returns {Array<Array<{r: number, g: number, b: number}>>}
 *        La matriz resultante, de tamaño N x M, con el promedio de los colores.
 */
function averageColorData(colorMatrices) {
  // Verificamos que existan matrices y que tengan al menos 1 elemento
  if (!colorMatrices || colorMatrices.length === 0) {
    throw new Error("El arreglo de matrices está vacío o es inválido.")
  }

  // Suponiendo que todas las matrices tienen las mismas dimensiones
  const numMatrices = colorMatrices.length
  const rows = colorMatrices[0].length          // N
  const cols = colorMatrices[0][0].length       // M

  // Inicializamos la matriz resultado
  const averagedMatrix = new Array(rows)

  for (let i = 0; i < rows; i++) {
    averagedMatrix[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      let sumR = 0
      let sumG = 0
      let sumB = 0

      // Sumamos todos los valores (r, g, b) de las matrices
      for (let k = 0; k < numMatrices; k++) {
        sumR += colorMatrices[k][i][j].r
        sumG += colorMatrices[k][i][j].g
        sumB += colorMatrices[k][i][j].b
      }

      // Calculamos el promedio para la celda [i, j]
      averagedMatrix[i][j] = {
        r: sumR / numMatrices,
        g: sumG / numMatrices,
        b: sumB / numMatrices
      }
    }
  }

  return averagedMatrix
}

const drawColorData = (col, row, cellSize, colorData) => {

  push()
  stroke('white')
  strokeWeight(0)

  const [x, y] = [col * cellSize, row * cellSize]
  const [rows, columns] = [colorData.length, colorData[0].length]

  const subpix = {
    h: cellSize / rows,
    w: cellSize / columns
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const c = colorData[i][j]
      fill(color(c.r, c.g, c.b))
      rect(x + j * subpix.w, y + i * subpix.h, subpix.w, subpix.h)
    }
  }

  pop()
}

/**
 * 
 * @param {Cell} cell 
 * @param {[Cell]} cells 
 * @returns 
 */
const lookNeighbors = (cell, cells) => {

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

/**
 * 
 * @param {Cell} cell 
 * @param {Map<string,Cell>} neighbors 
 */
const updateNeighborStates = (cell, neighbors) => {

  neighbors.forEach((neighbor, direction) => {

    const neighborState = neighbor.state

    let newNeighborState = neighborState.filter(tile => canConnect(cell.tile, tile, direction))

    if (newNeighborState.length === 0) {
      newNeighborState = [
        new Tile(generatedTiles[0])
      ]
    }

    neighbor.updateState(newNeighborState)

  })

}

/**
 * 
 * @param {Tile} pivotTile 
 * @param {Tile} objetiveTile 
 * @param {string} direction 
 */
const canConnect = (pivotTile, objetiveTile, direction) => {

  const pivotSockets = pivotTile.tileData.sockets
  const objetiveSockets = objetiveTile.tileData.sockets
  const pivotType = pivotTile.tileData.type
  const objetiveType = objetiveTile.tileData.type

  const connectionMapping = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }

  if (pivotType === objetiveType) 
    return pivotTile.tileData.selfConnected && (pivotSockets[direction] === objetiveSockets[connectionMapping[direction]])
  

  return pivotSockets[direction] === objetiveSockets[connectionMapping[direction]]
}


class Tile {

  /**
   * 
   * @param {TileData} tileData 
   */
  constructor(tileData) {

    this.tileData = tileData

  }

  display(col, row, cellSize) {
    drawColorData(col, row, cellSize, this.tileData.colorData)
  }
}




class Cell {
  /**
   * 
   * @param {number} col 
   * @param {number} row 
   * @param {number} size 
   * @param {[Tile]} state 
   */
  constructor(col, row, size, state) {
    this.col = col
    this.row = row
    this.size = size
    this.state = state
    this.tile = null
    this.collapsed = false
  }

  setTile(tile) {
    this.tile = tile
  }

  display(isSelected = false) {

    if (this.collapsed) {
      this.tile.display(this.col, this.row, this.size)
    }

    const colorDataMatrices = this.state.map((tile) => tile.tileData.colorData)
    if (colorDataMatrices.length > 1) {
      const averagedColorData = averageColorData(colorDataMatrices)
      drawColorData(this.col, this.row, this.size, averagedColorData)
    }
    else {
      drawColorData(this.col, this.row, this.size, colorDataMatrices[0])
    }

    if (isSelected) {
      push()
      stroke('red')
      strokeWeight(2)
      noFill()
      rect(this.col * this.size, this.row * this.size, this.size, this.size)
      pop()
    }

  }

  entropy() {
    return this.state.length
  }

  collapse() {
    const randomIndex = Math.floor(Math.random() * this.state.length)
    const collapsedTile = this.state[randomIndex]
    this.state = [collapsedTile]
    this.tile = collapsedTile
    this.collapsed = true
  }

  updateState(newState) {
    this.state = newState
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
const tiles = generatedTiles.map((tileData) => new Tile(tileData))


for (let i = 0; i < QUANTITY; i++) {
  for (let j = 0; j < QUANTITY; j++) {

    const cell = new Cell(i, j, CELL_SIZE, tiles)
    cells.push(cell)

  }
}


/**
 * Tries to select the cell with less entropy, if there are more than one with the same entropy lower entropy, select randomly between them.
 * @param {[Cell]} cells
 */
const selectCell = (cells) => {

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
    selectedCell = selectRandomCell(minEntropyCells)
  }
  else {
    selectedCell = minEntropyCells[0]
  }

  return selectedCell
}


/**
 * Select a cell randomly.
 * @param {[Cell]} cells
 */
const selectRandomCell = (cells) => {

  const randomIndex = Math.floor(Math.random() * cells.length)
  return cells[randomIndex]

}

function setup() {

  frameRate(FRAME_RATE)

  createCanvas(CANVAS_SIZE, CANVAS_SIZE)
  background(BACKGROUND_COLOR)
  drawGrid(CANVAS_SIZE, CELL_SIZE)
  drawBorder()

  cells.forEach(cell => cell.display())

}

let frames = 0
function draw() {

  if (frames >= FRAMES_LIMIT) {
    noLoop()
    return
  }

  const selectedCell = selectCell(cells)



  if (!selectedCell) {
    noLoop()
    return
  }

  selectedCell.collapse()

  const neighbors = lookNeighbors(selectedCell, cells)
  updateNeighborStates(selectedCell, neighbors)
  try {
    neighbors.values().forEach(neighbor => neighbor.display())
  }
  catch {
    console.log(neighbors)
  }
  selectedCell.display()

  /* let hoveredCell = isMouseHovering(cells)
  if (hoveredCell) {
    
    displayCellState(hoveredCell);
  } */

  // drawGrid(CANVAS_SIZE, CELL_SIZE)

  frames++

}

const isMouseHovering = (cells) => {
  let hoveredCell = null;
  for (let cell of cells) {
    if (cell.contains(mouseX, mouseY) && cell.state) {
      hoveredCell = cell;
      break;
    }
  }

  return hoveredCell
}

/**
 * 
 * @param {Cell} cell 
 */
function displayCellState(cell) {
  push()
  fill(0, 0, 0, 200);
  noStroke();
  rect(mouseX + 10, mouseY - 40, 150, 30, 5);
  fill(255);
  textSize(12);
  textAlign(LEFT, CENTER);

  const content = `Posible states ${cell.state.length}`
  text(content, mouseX + 15, mouseY - 25);
  pop();

}

function displayTileInfo(tile) {
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(mouseX + 10, mouseY - 40, 150, 30, 5);

  fill(255);
  textSize(12);
  textAlign(LEFT, CENTER);

  const content = `Base Name: ${tile.tileData.type} \nName: ${tile.tileData.name} `;
  text(content, mouseX + 15, mouseY - 25);
  pop();
}


window.setup = setup
window.draw = draw