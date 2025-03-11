import { TileData } from "./types";
import P5 from 'p5';
import { drawColorData } from './utils/drawUtils';

export default class Tile {

    tileData: TileData;

    constructor(tileData: TileData) {
        this.tileData = tileData;    
    }

    display(col : number, row : number, size : number, p5 : P5) {
        drawColorData(this.tileData.colorData, col, row, size, p5)
    }

    static createTiles(tileData: TileData[]) {
        return tileData.map(tileData => new Tile(tileData))
    }

    static canConnect(tileA: Tile, tileB: Tile, direction : string) {

        const aSocketData = tileA.tileData.socketData
        const bSocketData = tileB.tileData.socketData

        const aType = tileA.tileData.type
        const bType = tileB.tileData.type

        const connectionMapping = {
            up: 'down',
            right: 'left',
            down: 'up',
            left: 'right'
        }

        if (aType === bType) {
            return (aSocketData.selfConnected && (aSocketData.sockets[direction] === bSocketData.sockets[connectionMapping[direction]]))
        }

        return aSocketData.sockets[direction] === bSocketData.sockets[connectionMapping[direction]]

    }

    static canConnectByBitmat(tileA: Tile, tileB: Tile, direction : string) {

        const connectionMapping = {
            up: 'down',
            right: 'left',
            down: 'up',
            left: 'right'
        }

        const aBitmap = tileA.tileData.bitmap
        const bBitmap = tileB.tileData.bitmap

        const aType = tileA.tileData.type
        const bType = tileB.tileData.type


        const getArray = (direction: string, bitmap : number[][]) : number[] => {
            switch (direction) {
                case 'up':
                    return bitmap[0]
                case 'right':
                    return bitmap.map(row => row[row.length - 1])
                case 'down':
                    return bitmap[bitmap.length - 1]
                case 'left':
                    return bitmap.map(row => row[0])
                default:
                    return []
            }
        }

        const aArray = getArray(direction, aBitmap)
        const bArray = getArray(connectionMapping[direction], bBitmap)

        const same = aArray.every((val, index) => val === bArray[index])

        if (aType === bType) {
            return (tileA.tileData.socketData.selfConnected && same)
        }

        return same


    }

}