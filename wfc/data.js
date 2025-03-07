/**
 * @typedef {Object} ColorSpecification
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * 
 */

/**
 * @typedef {Object} SocketData
 * @property {number} up
 * @property {number} down
 * @property {number} left
 * @property {number} right
 */

/**
 * @typedef {Object} TileData
 * @property {string} type
 * @property {string} name
 * @property {Array<Array<number>>} bitmap
 * @property {Array<ColorSpecification>} palette
 * @property {Array<number>} rotations
 * @property {SocketData} sockets
 * @property {boolean} selfConnected
 * @property {Array<Array<ColorSpecification>>} colorData
 * @property {boolean} include
 */

/**
 * @type {TileData[]}
 */
export const scifi_tiles = [
  {
    type: "blank",
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
    sockets : {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    },
    selfConnected: true,
    rotations: [],
    include: true,
  },
  {
    type: "line",
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
      up: 1,
      left: 0,
      right: 0,
      down: 1,
    },
    selfConnected: true,
    include: true,
  },
  {
    type: "elbow",
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
      up: 0,
      left: 0,
      right: 1, 
      down: 1,
    },
    selfConnected: true,
    include: true,
  },
  {
    type: "tee",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
    rotations: [90, 180, 270],
    sockets : {
      up: 0,
      left: 1,
      right: 1, 
      down: 1,
    },
    selfConnected: true,
    include: true,
  },
  {
    type: "parallel_diagonal",
    bitmap: [
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
    rotations: [90],
    sockets : {
      up: 1,
      left: 1,
      right: 1, 
      down: 1,
    },
    selfConnected: true,
    include: true,
  },
  {
    type: "cross",
    bitmap: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
    rotations: [0],
    sockets : {
      up: 1,
      left: 1,
      right: 1, 
      down: 1,
    },
    selfConnected: true,
    include: true,
  },
  {
    type: "pin",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    rotations: [90, 180, 270],
    sockets : {
      up: 0,
      left: 0,
      right: 0, 
      down: 1,
    },
    selfConnected: false,
    include: true,
  },
  {
    type: "parallel_lines",
    bitmap: [
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 2,
      down: 2,
      left: 0,
      right: 0,
    },
    selfConnected: true,
    rotations: [90],
    include: true,
  },
  {
    type: "parallel_cross",
    bitmap: [
      [0, 1, 2, 1, 0],
      [1, 1, 2, 1, 1],
      [2, 2, 2, 2, 2],
      [1, 1, 2, 1, 1],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 2,
      down: 2,
      left: 2,
      right: 2,
    },
    selfConnected: false,
    rotations: [0],
    include: true,
  },
  {
    type: "parallel_elbow",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 2, 2, 2],
      [0, 1, 2, 1, 1],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 0,
      down: 2,
      left: 0,
      right: 2,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
  {
    type: "cople",
    bitmap: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 1,
      down: 2,
      left: 0,
      right: 0,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
  {
    type: "elbow_cople_a",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 0,
      down: 2,
      left: 0,
      right: 1,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
  {
    type: "elbow_cople_b",
    bitmap: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 0,
      down: 2,
      left: 1,
      right: 0,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
  {
    type: "elbow_cople_c",
    bitmap: [
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 2,
      down: 0,
      left: 1,
      right: 0,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
  ,
  {
    type: "elbow_cople_d",
    bitmap: [
      [0, 1, 2, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    palette: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 2,
      down: 0,
      left: 0,
      right: 1,
    },
    selfConnected: false,
    rotations: [90, 180, 270],
    include: true,
  },
];


export const flowers = [
  {
    type: "sky",
    bitmap: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    palette: [
      { r: 130, g: 200, b: 229 },
    ],
    sockets : {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    },
    selfConnected: true,
    rotations: [],
    include: true,
  },
  {
    type: "flower",
    bitmap: [
      [0,1,0],
      [1,2,1],
      [0,1,0],
    ],
    palette: [
      { r: 130, g: 200, b: 229 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 0 },
    ],
    sockets : {
      up: 0,
      down: 1,
      left: 0,
      right: 0,
    },
    selfConnected: false,
    rotations: [],
    include: true,
  },
  {
    type: "trunk",
    bitmap: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    palette: [
      { r: 130, g: 200, b: 229 },
      { r: 0, g: 128, b: 0 },
    ],
    sockets : {
      up: 1,
      down: 1,
      left: 0,
      right: 0,
    },
    selfConnected: true,
    rotations: [],
    include: true,
  },
  {
    type: "leave",
    bitmap: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    palette: [
      { r: 130, g: 200, b: 229 },
      { r: 0, g: 128, b: 0 },
    ],
    sockets : {
      up: 1,
      down: 1,
      left: 0,
      right: 0,
    },
    selfConnected: true,
    flips: {
      horizontal: false,
      vertical: false,
    },
    rotations: [],
    include: false,
  }
]