const BACKGROUND_COLOR = 'white'

const CELL_SIZE = 18
const QUANTITY = 30
const CANVAS_SIZE = QUANTITY * CELL_SIZE


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

  constructor() {

    this.tileData = {

      render: [[0,1,0],[0,1,0],[1,1,1]]

    }
  }


  display(col, row, cellSize){
    
    const x0 = col * cellSize
    const y0 = row * cellSize
    stroke('blue')
    strokeWeight(0)
    fill('blue')

    const render = this.tileData.render
    const subcell_dim = {
      height: cellSize / render.length,
      width: cellSize / render[0].length
    }

    const colors = ['purple', 'black']


    render.forEach((row, i) => {

      row.forEach( (column, j) => {

        fill(colors[column])

        
      })

    });



    rect(x0, y0, cellSize, cellSize)

  }

}


class Cell {

  constructor(col, row, size) {
    this.col = col
    this.row = row
    this.size = size
    this.tile = null
  }

}


const tile = new Tile()


function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE)
  background(BACKGROUND_COLOR)
  drawGrid(CANVAS_SIZE, CELL_SIZE)
  drawBorder()
}

function draw() {

  if(frameCount % 60 !== 0) return

  tile.display(2, 2, CELL_SIZE)
  

}
