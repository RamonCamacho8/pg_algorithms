export type RGBcolor = {
    r: number,
    g: number,
    b: number
}

export type SocketData = {
    selfConnected: boolean,
    sockets : {
        up: number,
        right: number,
        down: number,
        left: number
    }
}

export type TileData = {

    type: string,
    id: number,
    name?: string,
    bitmap : number[][],
    colorData?: RGBcolor[][],
    socketData: SocketData,
    flipInfo : {
        flip: boolean,
        wasFlipped: boolean,
    }
    rotationInfo : {
        rotationAngles: number[],
        rotationApplied?: number,
        wasRotated: boolean
    }
    include: boolean
}


export type TileDataSet = {
    
    tiledatasetname: string,
    palette: RGBcolor[],
    tiles: TileData[]

}