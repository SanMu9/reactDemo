/**
 * @description 实体数据对象
 */

 

/**
 * @uName 用户名 唯一
 */
export interface USER {
    uName:string|null|undefined,
    token:string|null|undefined
}

export interface IStoreState {
    // todo:Todo[]
    user:USER,
    socket:SocketIOClient.Socket|null
}
