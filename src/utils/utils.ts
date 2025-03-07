import { TileDataSet, TileData, RGBcolor, SocketData } from "../types"
import {default as data} from '../assets/tileData.json';

export const loadTileDataset = (name?: string): TileDataSet => {
        return data as TileDataSet;
}

export const createColorData = (bitmap: number[][], palette: RGBcolor[]) => {
    
    const colorData = []

    bitmap.forEach((row, i) => {
        colorData[i] = []
        row.forEach((column, j) => {
            const c = palette[column]
            colorData[i][j] = c
        })
    });

    return colorData
}

export const averageColorData = (colorDataMatrices: RGBcolor[][][]) => {
    
    if (!colorDataMatrices || colorDataMatrices.length === 0) {
        throw new Error("El arreglo de matrices está vacío o es inválido.")
    }

    const numMatrices = colorDataMatrices.length
    const rows = colorDataMatrices[0].length
    const cols = colorDataMatrices[0][0].length

    const averagedMatrix = new Array(rows)

  for (let i = 0; i < rows; i++) {
    averagedMatrix[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      let sumR = 0
      let sumG = 0
      let sumB = 0

      // Sumamos todos los valores (r, g, b) de las matrices
      for (let k = 0; k < numMatrices; k++) {
        sumR += colorDataMatrices[k][i][j].r
        sumG += colorDataMatrices[k][i][j].g
        sumB += colorDataMatrices[k][i][j].b
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

export const fillColorData = (tileDataSet: TileDataSet) => {

    tileDataSet.tiles.forEach(tileData => {
        const bitmap = tileData.bitmap
        const palette = tileDataSet.palette
        tileData.colorData = createColorData(bitmap, palette)
    });
}

const flipMatrix = <T>(matrix: T[][]) : T[][] => {
    return matrix.slice().reverse();
}

const flipSocketData = (socketData: SocketData) => {
    const sockets = socketData.sockets
    return {
        selfConnected: socketData.selfConnected,
        sockets: {
            up: sockets.down,
            right: sockets.right,
            down: sockets.up,
            left: sockets.left
        }
    }

}

const flip = (tileData: TileData) => {
    
    const bitmap = flipMatrix(tileData.bitmap)
    const socketData = flipSocketData(tileData.socketData)
    const colorData = flipMatrix(tileData.colorData)
    
    return {
        ...tileData,
        type: `${tileData.type}_flipped`,
        bitmap: bitmap,
        socketData: socketData,
        colorData: colorData,
        name: `${tileData.type}_flipped`,
        flipInfo: {
            ...tileData.flipInfo,
            wasFlipped: !tileData.flipInfo.wasFlipped
        }
    } as TileData

}

const rotateSocketData = (socketData: SocketData) => {
    const sockets = socketData.sockets
    const rotated = {
        up: sockets.right,
        right: sockets.down,
        down: sockets.left,
        left: sockets.up
    }
    return {
        selfConnected: socketData.selfConnected,
        sockets: rotated
    }
}


const rotateMatrixClockWise = <T>(matrix: T[][]) : T[][] => {

    const n = matrix.length
    const rotated : T[][] = new Array(n).fill(0).map(() => new Array(n).fill(0))
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          rotated[j][n - 1 - i] = matrix[i][j];
        }
      }
    return rotated;

}

const applySocketDataRotations = (socketData: SocketData, rotations: number[]) => {
    
    const rotated = new Map<number, TileData['socketData']>()
    let current = socketData

    rotations.map(
        rotation => {
            current = rotateSocketData(current)
            rotated.set(rotation, current)
        }
    )

    return rotated
}

const applyMatrixRotations = <T>(matrix: T[][], rotations: number[]) : Map<number, T[][]> => {
    
    const matrices = new Map<number, T[][]>()
    let current = matrix
    
    rotations.map(
        rotation => {
            current = rotateMatrixClockWise(current)
            matrices.set(rotation, current)
        }
    )

    return matrices

}

const rotate = (tileData: TileData) => {

    const {rotationAngles} = tileData.rotationInfo

    const bitmapsMap = applyMatrixRotations(tileData.bitmap, rotationAngles)
    const colorDataMap = applyMatrixRotations(tileData.colorData, rotationAngles)
    const socketDataMap = applySocketDataRotations(tileData.socketData, rotationAngles)


    const rotationsResults = rotationAngles.map(
        rotation => {
            return {
                ...tileData,
                bitmap: bitmapsMap.get(rotation),
                colorData: colorDataMap.get(rotation),
                socketData: socketDataMap.get(rotation),
                name: `${tileData.type}_rotated_${rotation}`,
                rotationInfo: {
                    ...tileData.rotationInfo,
                    rotationApplied: rotation,
                    wasRotated: true
                }
            } as TileData
        }
    )

    return rotationsResults

}

export const applyTransformations = (tileData: TileData) => {
    
    const results = []

    const original : TileData = {
        ...tileData,
        name: `${tileData.type}_original`,
    }

    results.push(original)
    
    // Apply flips
    if (tileData.flipInfo.flip && !tileData.flipInfo.wasFlipped) {
        const flipped = flip(original)
        results.push(flipped)
    }
        
    // Apply rotations
    if (tileData.rotationInfo.rotationAngles.length > 0 && !tileData.rotationInfo.wasRotated) {
        results.push(
            ...results.flatMap(
                tileData => rotate(tileData)
            )
        )
    }
        

    return results
}

