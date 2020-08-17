/**
 * @description 实体数据对象
 */

 

/**
 * @uName 用户名 唯一
 * @token token
 * @status 用户状态 0-离线 1-普通在线 2-房间等待中 3-游戏中
 */
export interface USER {
    uName:string|null|undefined,
    token:string|null|undefined,
    status:number
}

/**
 * @description 游戏房间信息
 * @param player_first 玩家1的username
 * @param player_second 玩家2的username
 * @param room_name 房间名
 */
export interface ROOMINFO {
    player_first:string|null,
    player_second:string|null,
    room_name:string|null
}

/**
 * @description 页面信息（宽、高等信息）
 * 
 */
export interface PAGEINFO {
    cWidth:number,
    cHeight:number
}

export interface IStoreState {
    // todo:Todo[]
    user:USER,
    socket:SocketIOClient.Socket|null,
    rooms:ROOMINFO[],
    page:PAGEINFO,
    userList:USER[],
    game:GAMEINFO
}

export interface GAMEINFO {
    gameId:string|null,
    player1:string|null,
    player2:string|null
}

/**
 * @description action对象
 */


