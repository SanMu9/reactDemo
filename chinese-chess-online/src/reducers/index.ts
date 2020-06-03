import { combineReducers } from 'redux';
import {USER} from './../entity/index';

const userDefaultState:USER= {
    uName:undefined,
    token:undefined
}

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
const testReducer = (state=0,action={type:"COUNT",count:0}) => {
    switch(action.type){
        case "COUNT":
            return state+1;
        case "REDUCE":
            return state-action.count;
        default:
            return state
    }
}

const reducers = combineReducers({
    user:userReducer,
    test:testReducer
})

export default reducers