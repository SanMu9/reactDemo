import axios from 'axios'

export const getRoomsInfo = function (params) {
    return axios.get("/api/getRoomsInfo", { params })
}
