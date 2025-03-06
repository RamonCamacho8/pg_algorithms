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

export const baseTiles = [
  {
    baseName: "empty",
    renderData: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    rotations: [],
    socketData: {
      up: [0, 3],
      down: [0, 3],
      left: [0, 3],
      right: [0, 3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "line",
    renderData: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    rotations: [90],
    socketData: {
      up: [1],
      down: [1],
      left: [3],
      right: [3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "elbow",
    renderData: [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [3],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "tee",
    renderData: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "cross",
    renderData: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rotations: [],
    socketData: {
      up: [1],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "Y",
    renderData: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rotations: [90, 180, 270],
    socketData: {
      up: [0, 2],
      left: [3],
      right: [3],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: false,
    },
    include: false,
  },
  {
    baseName: "X",
    renderData: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    rotations: [],
    socketData: {
      up: [2],
      left: [2],
      right: [2],
      down: [2],
      verticalSelfConnect: false,
      horizontalSelfConnect: false,
    },
    include: false,
  },
  {
    baseName: "square",
    renderData: [
      [1, 1, 1],
      [1, 2, 1],
      [1, 1, 1],
    ],
    rotations: [],
    socketData: {
      up: [1],
      left: [0],
      right: [0],
      down: [1],
      verticalSelfConnect: false,
      horizontalSelfConnect: false,
    },
    include: true,
  },
];

export const five_by_five_Tiles = [
  {
    baseName: "empty",
    renderData: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    rotations: [],
    socketData: {
      up: [0, 3],
      down: [0, 3],
      left: [0, 3],
      right: [0, 3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "line",
    renderData: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    rotations: [90],
    socketData: {
      up: [1],
      down: [1],
      left: [3],
      right: [3],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "elbow",
    renderData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [3],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "tee",
    renderData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    rotations: [90, 180, 270],
    socketData: {
      up: [3],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "cross",
    renderData: [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    rotations: [],
    socketData: {
      up: [1],
      left: [1],
      right: [1],
      down: [1],
      verticalSelfConnect: true,
      horizontalSelfConnect: true,
    },
    include: true,
  },
  {
    baseName: "house",
    renderData: [
        [0, 0, 4, 0, 0],
        [0, 4, 4, 4, 0],
        [4, 4, 4, 4, 4],
        [0, 5, 5, 5, 0],
        [0, 5, 5, 5, 0],
    ],
    rotations: [],
    socketData: {
      up: [0],
      left: [0],
      right: [0],
      down: [1],
      verticalSelfConnect: false,
      horizontalSelfConnect: false,
    },
    include: true,
  }
];
