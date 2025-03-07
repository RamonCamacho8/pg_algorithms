/**
 * @typedef {Object} ColorSpecification
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * 
 */

/**
 * @typedef {Object} SocketData
 * @property {number[] | string[]} up
 * @property {number[] | string[]} down
 * @property {number[] | string[]} left
 * @property {number[] | string[]} right
 */

/**
 * @typedef {Object} TileData
 * @property {string} baseName
 * @property {string} name
 * @property {Array<Array<number>>} bitmap
 * @property {Array<ColorSpecification>} palette
 * @property {Array<number>} rotations
 * @property {SocketData} sockets
 * @property {Array<Array<ColorSpecification>>} colorData
 * @property {boolean} include
 * 
 * 
 */



/**
 * @type {TileData[]}
 */
export const five_by_five_Tiles = [
  {
    baseName: "empty",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
    ],
    rotations: [],
    include: false,
  },
  {
    baseName: "line",
    bitmap: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
    rotations: [90],
    sockets : {
      up: ['line'],
      left: ['empty', 'line'],
      right: ['empty', 'line'],
      down: ['line'],
    },
    include: true,
  },
  {
    baseName: "elbow",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
    rotations: [90, 180, 270],
    sockets : {
      up: ['empty'],
      left: ['empty'],
      right: ['elbow', 'line'],
      down: ['elbow', 'line'],
    },
    include: false,
  }
];