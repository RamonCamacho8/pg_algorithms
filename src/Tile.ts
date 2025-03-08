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

}