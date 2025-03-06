const BACKGROUND_COLOR = 'white'

const FRAME_RATE = 60
const FRAMES_LIMIT = 10000
const CELL_SIZE = 24
const QUANTITY = 30
const CANVAS_SIZE = QUANTITY * CELL_SIZE
const colorMap = [{ r: 0, g: 0, b: 0 }, { r: 0, g: 255, b: 255 }]

/**
 * @typedef {Object} SocketData
 * @property {boolean} verticalSelfConnect
 * @property {boolean} horizontalSelfConnect
 * @property {number[]} up
 * @property {number[]} down
 * @property {number[]} left
 * @property {number[]} right
 */

/**
 * @typedef {Object} TileData
 * @property {string} baseName
 * @property {string} name
 * @property {Array<Array<number>>} renderData
 * @property {Array<number>} rotations
 * @property {SocketData} socketData
 * @property {Array<Array<{r: number, g: number, b: number}>>} colorData
 * @property {boolean} include
 */
const baseTiles = [
  {
    baseName: 'empty',
    renderData: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    rotations: [],
    socketData: {
      up:     [0,3],
      down:   [0,3],
      left:   [0,3],
      right:  [0,3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true
    },
    include: true
  },
  {
    baseName: 'line',
    renderData: [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
    rotations: [90],
    socketData: {
      up: [1],
      down: [1],
      left: [3],
      right: [3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true
    },
    include: true
  },
  {
    baseName: 'elbow',
    renderData: [[0, 0, 0], [0, 1, 1], [0, 1, 0]],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [3],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true
    },
    include: true
  },
  {
    baseName: 'tee',
    renderData: [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true
    },
    include: true
  },
  {
    baseName: 'cross',
    renderData: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    rotations: [],
    socketData: {
      up: [1],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true
    },
    include: true
  },
  {
    baseName: 'Y',
    renderData: [[1, 0, 1], [1, 1, 1], [0, 1, 0]],
    rotations: [90, 180, 270],
    socketData: {
      up: [0,2],
      left: [3],
      right: [3],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: false
    },
    include: false
  },
  {

    baseName: 'X',
    renderData: [
    [1, 0, 1], 
    [0, 1, 0], 
    [1, 0, 1]],
    rotations: [],
    socketData: {
      up: [2],
      left: [2],
      right: [2],
      down: [2],
      verticalSelfConnect: false,
      horizontalSelfConnect: false
    },
    include: false
  },
  {
    baseName: 'square',
    renderData: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
    rotations: [],
    socketData: {
      up: [0],
      left: [0],
      right: [0],
      down: [1],
      verticalSelfConnect: false,
      horizontalSelfConnect: false
    },
    include: true
  }
  /*
  {
    baseName: 'end',
    renderData: [[0, 1, 0], [0, 1, 0], [0, 0, 0]],
    rotations: [90, 180, 270],
    include: false
  } */
]


const applyRotations = (tile) => {

  const results = [];
  const { baseName, renderData, rotations, socketData } = tile;

  // Agregamos la base sin rotación
  results.push({
    baseName: baseName,
    name: `${baseName}_0`,
    renderData: renderData,
    socketData: socketData
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

  // Función que rota la información de sockets según 90° en el sentido de las agujas del reloj.
  // Si se usan las propiedades "up", "right", "down" y "left", se mapean de la siguiente forma:
  // up -> right, right -> down, down -> left, left -> up.
  // Para la propiedad "horizontalSelfConnect" se rota en sentido de las agujas del reloj.
  // Para la propiedad "verticalSelfConnect" se rota en sentido de las agujas del reloj.
  function rotateSocketData(data, steps) {
    if (!data) return data;

    const mapping = {
      up: 'right',
      right: 'down',
      down: 'left',
      left: 'up'
    };

    let rotated = { ...data };
    for (let s = 0; s < steps; s++) {
      const temp = {};
      // Rotate directional properties
      for (const key in rotated) {
        if (['up', 'down', 'left', 'right'].includes(key)) {
          const newKey = mapping[key];
          temp[newKey] = rotated[key];
        }
      }
      // Swap self-connect properties since axes rotate
      temp.horizontalSelfConnect = rotated.verticalSelfConnect;
      temp.verticalSelfConnect = rotated.horizontalSelfConnect;
      rotated = temp;
    }
    return rotated;
  }

  // Para cada ángulo de rotación, aplicamos el número de rotaciones de 90° que corresponda
  rotations.forEach(angulo => {
    let pasos = angulo / 90;
    let matrizRotada = renderData;
    for (let i = 0; i < pasos; i++) {
      matrizRotada = rotar90(matrizRotada);
    }
    let rotatedSocketData = rotateSocketData(socketData, pasos);
    results.push({
      baseName: baseName,
      name: `${baseName}_${angulo}`,
      renderData: matrizRotada,
      socketData: rotatedSocketData
    });
  });

  return results;
}

const createColorData = (tileData) => {

  const renderData = tileData.renderData
  const colorData = []

  renderData.forEach((row, i) => {
    colorData[i] = []
    row.forEach((column, j) => {
      const c = colorMap[column]
      colorData[i][j] = c
    })
  });

  tileData.colorData = colorData
}

const generatedTiles = baseTiles
  .filter(tile => tile.include)
  .map(applyRotations)
  .flat()

generatedTiles.forEach(createColorData)
console.log(generatedTiles)

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

  const [x, y]=  [col * cellSize, row * cellSize]
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

    let newNeighborState = neighborState.filter(tile => canConnectBySocket(cell.tile, tile, direction))
    
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
 * @returns 
 */
const canConnectBySocket = (pivotTile, objetiveTile, direction) => {

  const pivotBaseName = pivotTile.tileData.baseName
  const pivotData = pivotTile.tileData.socketData
  
  const objetiveBaseName = objetiveTile.tileData.baseName
  const objetiveData = objetiveTile.tileData.socketData

  switch (direction) {
    case 'up':
      return canConnectUpBySocket(pivotData, objetiveData)
    case 'down':
      return canConnectDownBySocket(pivotData, objetiveData)
    case 'left':
      return canConnectLeftBySocket(pivotData, objetiveData)
    case 'right':
      return canConnectRightBySocket(pivotData, objetiveData)
    default:
      return false
  }
}


/**
 * 
 * @param {SocketData} pivotData 
 * @param {SocketData} objetiveData 
 * @returns 
 */
const canConnectUpBySocket = (pivotData, objetiveData) => {
  return pivotData.up.some(pivotSocket => objetiveData.down.includes(pivotSocket))
}

const canConnectDownBySocket = (pivotData, objetiveData) => {
  return pivotData.down.some(pivotSocket => objetiveData.up.includes(pivotSocket))
}

const canConnectLeftBySocket = (pivotData, objetiveData) => {
  return pivotData.left.some(pivotSocket => objetiveData.right.includes(pivotSocket))
}

const canConnectRightBySocket = (pivotData, objetiveData) => {
  return pivotData.right.some(pivotSocket => objetiveData.left.includes(pivotSocket))
}


const canConnect = (pivotTile, objetiveTile, direction) => {

  const pivotData = pivotTile.tileData.renderData
  const objetiveData = objetiveTile.tileData.renderData

  switch (direction) {
    case 'up':
      return canConnectUp(pivotData, objetiveData)
    case 'down':
      return canConnectDown(pivotData, objetiveData)
    case 'left':
      return canConnectLeft(pivotData, objetiveData)
    case 'right':
      return canConnectRight(pivotData, objetiveData)
    default:
      return false
  }
}

const canConnectUp = (pivotData, objetiveData) => {

  const pivotRow = pivotData[0]
  const objetiveRow = objetiveData[objetiveData.length - 1]

  for (let i = 0; i < pivotRow.length; i++) {
    if (pivotRow[i] !== objetiveRow[i]) {
      return false
    }
  }

  return true
}


const canConnectDown = (pivotData, objetiveData) => {
  
  const pivotRow = pivotData[pivotData.length - 1]
  const objetiveRow = objetiveData[0]

  for (let i = 0; i < pivotRow.length; i++) {
    if (pivotRow[i] !== objetiveRow[i]) {
      return false
    }
  }

  return true
}

const canConnectLeft = (pivotData, objetiveData) => {
  
  const pivotColumn = pivotData.map(row => row[0])
  const objetiveColumn = objetiveData.map(row => row[objetiveData.length - 1])

  for (let i = 0; i < pivotColumn.length; i++) {
    if (pivotColumn[i] !== objetiveColumn[i]) {
      return false
    }
  }

  return true
}

const canConnectRight = (pivotData, objetiveData) => {
  
  const pivotColumn = pivotData.map(row => row[pivotData.length - 1])
  const objetiveColumn = objetiveData.map(row => row[0])

  for (let i = 0; i < pivotColumn.length; i++) {
    if (pivotColumn[i] !== objetiveColumn[i]) {
      return false
    }
  }

  return true
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

    const cell = new Cell(col = i, row = j, size = CELL_SIZE, state = tiles)
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
  catch{
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

  const content = `Base Name: ${tile.tileData.baseName} \nName: ${tile.tileData.name} `;
  text(content, mouseX + 15, mouseY - 25);
  pop();
}
