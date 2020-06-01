import axios from 'axios'

export const getRoomsInfo = function (params) {
    return axios.get("/api/getRoomsInfo", { params })
}

export const registerName = function (params) {
    return axios.post("/api/registerName",params)
}
