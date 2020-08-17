import axios from 'axios'

export const getRoomsInfo = function (params) {
    return axios.get("/api/getRoomsInfo", { params })
}

export const registerName = function (params) {
    return axios.post("/api/registerName",params)
}

export const register = function (params) {
    return axios.post("/api/login/register",params)
}

export const login = function (params) {
    return axios.post("/api/login",params)
}

export const createRoomReq = function (params){
    return axios.post("/api/rooms/createRoom",params)
}

export const getOtherUserList = function (params){
    return axios.post("/api/getOtherUserList",params)
}

export const invite = function (params){
    return axios.post("/api/users/invite",params)
}

export const beginGame = function (params){
    return axios.post("/api/users/createGame",params)
}

export const getGameInfo = function(params){
    return axios.post("/api/users/getGameDetail",params)
}

/**
 * @description 棋子移动
 * @param {*} params 
 *  
 */
export const chessMove = function(params){
    return axios.post("/api/users/chessMove",params)
}