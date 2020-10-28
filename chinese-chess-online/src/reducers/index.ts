import { combineReducers } from 'redux';
import {USER, ROOMINFO, PAGEINFO,GAMEINFO} from './../entity/index';
import io from 'socket.io-client';
import { act } from 'react-dom/test-utils';


const userDefaultState:USER= {
    uName:localStorage.getItem('chineseChessUName'),
    token:localStorage.getItem('chineseChessToken'),
    status:0
}
// console.log(window.location)
// let url = 'ws://'+window.location.host+'/ws';

// const socketDefaultState:SocketIOClient.Socket|null = io(url);
const socketDefaultState:SocketIOClient.Socket|null = io('ws://localhost:8088/')


const userReducer = (state=userDefaultState,action = {type:'USERADD',data:userDefaultState}) => {
    const {type,data} = action;
    switch(type){
        case 'USERADD':
            return {
                uName:data.uName,
                token:data.token,
                status:data.status
            };
        case 'USERSTATECHANGE':
            return {
                uName:state.uName,
                token:state.token,
                status:data.status
            };
        default:
            return state;
    }
}

const socketReducer = (state=socketDefaultState,action={type:'',data:null}) => {
    const {type,data} = action;
    switch(type){
        case 'IOCONNECT':
            return data;
        default:
            return state;
    }
}

const roomsDefaultState:ROOMINFO[] = []
const roomsReducer = (state=roomsDefaultState,action={type:'',data:roomsDefaultState})=>{
    const {type,data} = action;
    switch(type){
        case 'SETROOMS':
            return data;
        // case 'JOINROOM':
        //     return data;
        default:
            return state;
    }
}

const pageDefaultState:PAGEINFO = {cWidth:document.documentElement.clientWidth,cHeight:document.documentElement.clientHeight};
const pageReducer = (state=pageDefaultState,action={type:''}) => {
    const {type} = action;
    switch(type){
        case 'SIZECHANGE':
            return {cWidth:document.documentElement.clientWidth,cHeight:document.documentElement.clientHeight};
        default:
            return state
    }
}

const userListDefaultState:USER[] = [];
const userListReducer = (state=userListDefaultState,action={type:"",data:userListDefaultState})=>{
    const {type, data} = action;
    switch(type){
        case "SETLIST":
            return data;
        default:
            return state
    }
}

const gameDefaultState:GAMEINFO = {
    gameId:null,
    player1:null,
    player2:null
}
const gameReducer = (state=gameDefaultState,action = {type:"",data:gameDefaultState})=> {
    const {type, data} = action;
    switch(type){
        case "SETGAME":
            return data;
        default:
            return state
    }
}

// const testReducer = (state=0,action={type:"COUNT",count:0}) => {
//     switch(action.type){
//         case "COUNT":
//             return state+1;
//         case "REDUCE":
//             return state-action.count;
//         default:
//             return state
//     }
// }

const reducers = combineReducers({
    user:userReducer,
    socket:socketReducer,
    rooms:roomsReducer,
    page:pageReducer,
    userList:userListReducer,
    game:gameReducer
})

export default reducers