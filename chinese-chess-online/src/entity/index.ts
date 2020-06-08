/**
 * @description 实体数据对象
 */

 

/**
 * @uName 用户名 唯一
 * @token token
 */
export interface USER {
    uName:string|null|undefined,
    token:string|null|undefined
}

/**
 * @description 游戏房间信息
 * @param player1 玩家1的username
 * @param player2 玩家2的username
 * @param roomName 房间名
 */
export interface ROOMINFO {
    player1:string|null,
    player2:string|null,
    roomName:string|null
}

/**
 * @description 页面信息（宽、高等信息）
 * 
 */
export interface PAGEINFO {
    cWidth:number
}

export interface IStoreState {
    // todo:Todo[]
    user:USER,
    socket:SocketIOClient.Socket|null,
    rooms:ROOMINFO[],
    page:PAGEINFO
}


/**
 * @description action对象
 */


