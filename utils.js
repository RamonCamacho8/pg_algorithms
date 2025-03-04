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


  export { posToId, idToPos }