// 绑定username 和 其socketID
const userIOMap = {};
// 保存用户状态
// 0-离线 1-在线 2-游戏中
const userStatus = {};

const roomsMap = {
}

const GameMap = {}
module.exports = {userIOMap,roomsMap,GameMap,userStatus};