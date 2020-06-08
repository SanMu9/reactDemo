import { combineReducers } from 'redux';
import {USER,IStoreState} from './../entity/index';
import io from 'socket.io-client';


const userDefaultState:USER= {
    uName:localStorage.getItem('chineseChessUName'),
    token:localStorage.getItem('chineseChessToken')
}

const socketDefaultState:SocketIOClient.Socket|null = io('ws://172.26.1.200:8088/')

const userReducer = (state=userDefaultState,action = {type:'USERADD',data:userDefaultState}) => {
    const {type,data} = action;
    switch(type){
        case 'USERADD':
            return {
                uName:data.uName,
                token:data.token
            };
        case 'GETTOKEN':
            return state.token
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
    socket:socketReducer
})

export default reducers