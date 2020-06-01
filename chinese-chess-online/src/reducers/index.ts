import { combineReducers } from 'redux';
import {USER} from './../entity/index';

const userDefaultState:USER= {
    uId:undefined,
    uName:undefined,
    pw:undefined
}

const userReducer = (state=userDefaultState,action = {type:'USERADD'}) => {
    const {type} = action;
    switch(type){
        case 'USERADD':
            return state;
        default:
            return state;
    }
}
const testReducer = (state=0,action={}) => {
    switch(action){
        
    }
    return state+1
}

const reducers = combineReducers({
    user:userReducer,
    test:testReducer
})

export default reducers