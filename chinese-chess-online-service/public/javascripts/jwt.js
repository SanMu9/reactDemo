// 引入模块依赖
// const fs = require('fs');
// const path = require('path');
const jwt = require('jsonwebtoken');

// 
// const cert = "sanmu";
// 创建 token 类
// class Jwt {
//     constructor(data) {
//         this.data = data;
//         this._id = null; // 用户自定义 存放userid
//         this._date = null; // 过期时间
//         this._creatDate = null; // 创建时间
//     }
//     // 重新生成 token
//     refreshToken() {
//         let data = this.data;
//         let created = Math.floor(Date.now() / 1000);
//         let cert = 'sammu';
//         // let cert = fs.readFileSync(path.join(__dirname, './pem/private_key.pem'));//私钥 可以自己生成
//         let token = jwt.sign({
//             data,
//             exp: created + 60 * 60 * 24 * 7, // 过期时间 
//             iat: created, // 创建时间
//         }, cert);
//         return token;
//     }
//     //生成token
//     generateToken(data) {
//         if (data) {
//             this.data = data;
//         }
//         let data = this.data;
//         let created = Math.floor(Date.now() / 1000);
//         let cert = 'sammu';
//         // let cert = fs.readFileSync(path.join(__dirname, './pem/private_key.pem'));//私钥 可以自己生成
//         let token = jwt.sign({
//             data,
//             exp: created + 60 * 60 * 24 * 7, // 过期时间 
//             iat: created, // 创建时间
//         }, cert);
//         return token;
//     }

//     // 校验token
//     verifyToken(data) {
//         if (data) {
//             this.data = data;
//         }
//         let token = this.data;
//         let cert = 'sammu';
//         let res;
//         try {
//             let result = jwt.verify(token, cert) || {};
//             this._id = result.data;
//             this._date = result.exp;
//             this._creatDate = result.iat;
//             let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
//             if (current <= exp) {
//                 res = result.data || {};
//             }
//         } catch (e) {
//             res = 'err';
//         }
//         return res;
//     }
// }

const certKey = "sanmu";

const Jwt = {
    generateToken(data){
        let created = Math.floor(Date.now() / 1000);
        let token = jwt.sign({
            ...data,
            exp:created + 60 * 60 * 24 * 7,
            iat:created,
        },certKey);
        return token
    },
    verifyToken(token){
        let result = jwt.verify(token,certKey);
        return result;
    },
}

module.exports = Jwt;
