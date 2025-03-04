const CANVAS_SIZE = 600;
const CELL_SIZE = 10;
const ROWS = CANVAS_SIZE / CELL_SIZE;
const COLUMNS = CANVAS_SIZE / CELL_SIZE;

const CELL_COLORS = ['green', 'red', 'blue', 'yellow']
const cells = new Map()
const UP = { row: -1, col: 0 }
const DOWN = { row: 1, col: 0 }
const LEFT = { row: 0, col: -1 }
const RIGHT = { row: 0, col: 1 }

const DIRS = {
  'up': UP,
  'down': DOWN,
  'left': LEFT,
  'right': RIGHT
}

/** 
 * It returns the id of the cell in the grid between 0 and ROWS * COLUMNS
 * 
 * @param {number} row
 * @param {number} col
 * 
 * @returns {number}
 */
const posToId = (row, col) => {

  if (row < 0 || row >= ROWS || col < 0 || col >= COLUMNS) {
    throw new Error('Invalid row or column')
  }

  return row * COLUMNS + col

}

/** 
 * It returns the row and column of the cell in the grid from its id
 * 
 * @param {number} id
 * 
 * @returns {object}
 */
const idToPos = (id) => {

  const row = Math.floor(id / COLUMNS)
  const col = id % COLUMNS

  return { row, col }

}



const getAvailableDirections = (cell) => {

  const pos = cell.getPosition()

  const up = { row: pos.row - 1, col: pos.col }
  const down = { row: pos.row + 1, col: pos.col }
  const left = { row: pos.row, col: pos.col - 1 }
  const right = { row: pos.row, col: pos.col + 1 }

  const directions = {
    up,
    down,
    left,
    right
  }

  const availableDirections = Object.keys(directions).filter(direction => {
    const { row, col } = directions[direction]

    if (row < 0 || row >= ROWS || col < 0 || col >= COLUMNS) {
      return false
    }
    
    if (cells.has(posToId(row, col))) {
      return false
    }

    return true
  })

  return availableDirections

}

/**
 * Takes a cell and returns a random direction which is and ID
 * @param {Cell} cell
 * @returns {number}
 */

const chooseNextCell = (cell) => {

  if (!cell) {
    return chooseRandomStartCell()
  }

  const pos = cell.getPosition()

  const directions = getAvailableDirections(cell)
  if (directions.length === 0) {
    return chooseRandomStartCell()
  }

  const direction = chooseDirection(directions, cell.getDirectionProbabilities())

  if (!direction) {
    return chooseRandomStartCell()
  }

  const nextPos = {
    row: pos.row + DIRS[direction].row,
    col: pos.col + DIRS[direction].col
  }

  const colorProbabilities = cell.getColorProbabilities()

  const color = chooseColor(colorProbabilities)
  
  return cell_factory(nextPos.row, nextPos.col, color)

}


const cell_factory = (r, c, color) => {
  
  if (color === 'green') {
    return new GreenCell(r, c)
  } else if (color === 'red') {
    return new RedCell(r, c)
  } else if (color === 'blue') {
    return new BlueCell(r, c)
  }
  else {
    return new YellowCell(r, c)
  }
}



const chooseRandomStartCell = () => {

  const color = 'green' /* Math.floor(Math.random() * CELL_COLORS.length) */

  let x = Math.floor(Math.random() * COLUMNS)
  let y = Math.floor(Math.random() * ROWS)

  if (cells.has(posToId(x, y))) {
    return chooseRandomStartCell()
  }

  if (color === 'green') 
    return new GreenCell(y, x)
  else
    return new Cell(y, x, CELL_COLORS[color])

}


const chooseDirection = (freeDirections, directionsProbabilities) => {

  const sum = freeDirections.reduce((acc, direction) => acc + directionsProbabilities[direction], 0)
  
  if (sum === 0) return null


  const newProportions = freeDirections.map(direction => directionsProbabilities[direction] / sum)
  const random = Math.random()
  let acc = 0
  let i = 0

  while (acc < random) {
    acc += newProportions[i]
    i++
  }

  const direction = freeDirections[i - 1]
  return direction

}

/**
 * 
 * @param {[string]} posibleColors 
 * 
 * @returns {
 *  string
 * }
 */
const chooseColor = (colorProbabilities) => {

  const sum = Object.keys(colorProbabilities).reduce((acc, color) => acc + colorProbabilities[color], 0)

  if (sum === 0) return 'green'

  const newProportions = Object.keys(colorProbabilities).map(color => colorProbabilities[color] / sum)
  const random = Math.random()
  let acc = 0
  let i = 0

  while (acc < random) {
    acc += newProportions[i]
    i++
  }

  return Object.keys(colorProbabilities)[i - 1]

}


class Cell {

  directionsProbabilities = {
    up: 20,
    down: 20,
    left: 20,
    right: 20
  }

  colorProbabilities = {
    green: 0,
    red: 0,
    blue: 0,
    yellow: 0
  }

  constructor(r, c, color) {

    this.row = r
    this.col = c
    this.color = color

  }

  draw() {
    fill(this.color)
    rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
  }

  getPosition() {
    return { row: this.row, col: this.col }
  }

  getId() {
    return posToId(this.row, this.col)
  }

  getDirectionProbabilities() {
    return this.directionsProbabilities
  }

  getColorProbabilities() {
    return this.colorProbabilities
  }

}

class GreenCell extends Cell {

  directionsProbabilities = {
    up: 0,
    down: 20,
    left: 20,
    right: 20
  }

  colorProbabilities = {
    green: 90,
    yellow: 10
  }

  

  constructor(r, c) {
    super(r, c, 'green')
  }

}


class RedCell extends Cell {
  
  directionsProbabilities = {
    up: 20,
    down: 20,
    left: 20,
    right: 20
  }

  colorProbabilities = {
    red: 10,
    blue: 10
  }

  constructor(r, c) {
    super(r, c, 'red')
  }

}

class BlueCell extends Cell {
  
  directionsProbabilities = {
    left: 20,
    right: 20
  }

  colorProbabilities = {
    blue: 10,
    red: 10
  }

  constructor(r, c) {
    super(r, c, 'blue')
  }

}

class YellowCell extends Cell {
  
  directionsProbabilities = {
    up: 20,
    down: 20,
    left: 20,
    right: 20
  }

  colorProbabilities = {
    green: 1,
    red: 20,
    blue: 20,
  }

  constructor(r, c) {
    super(r, c, 'yellow')
  }

}



function setup() {

  createCanvas(CANVAS_SIZE, CANVAS_SIZE);

  background('white');

  for (let i = 1; i < ROWS; i++) {
    const y = CELL_SIZE * i
    line(0, y, CANVAS_SIZE, y)
  }

  for (let i = 1; i < COLUMNS; i++) {
    const x = CELL_SIZE * i;
    line(x, 0, x, CANVAS_SIZE)
  }

}

let pivot_cell = null

function draw() {

  

  pivot_cell = chooseNextCell(pivot_cell)

  if (!pivot_cell) {
    pivot_cell = chooseRandomStartCell()
    
  }

  cells.set(pivot_cell.getId(), pivot_cell)
  pivot_cell.draw()


}
