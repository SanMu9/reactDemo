import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Rooms from './pages/rooms/index';
import Home from './pages/home/index';
import Login from './pages/login/login';

import { connect } from 'react-redux'
import './App.css';


class App extends React.Component {
    render() {
        const {count,onClick,onClick2} = this.props as any;
        console.log(this.props)
        return (
            // <div className="app">
            //     {count}
            //     <button onClick={onClick}>+</button>
            //     <button onClick={()=>onClick2(4)}>--</button>
            // </div>
            <div className="app">
                <Router>
                    <Route exact path="/" component={Home}></Route >
                    <Route path="/rooms" component={Rooms}></Route>
                    <Route path="/login" component={Login} uName="" token=""></Route>
                </Router>
            </div>
        
        )
    }


}
// App.contextTypes = {
//     store: React.PropTypes.object
// }

// const mapStateToProps = (state:any,ownProps:any)=> {
//     console.log(ownProps)
//     return {
//         count:state.test
//     }
// };
// const mapDispatchToProps = (dispatch:any) => {
//     return {
//         onClick:()=>{
//             dispatch({
//                 type:"COUNT"
//             })
//         },
//         onClick2:(count:number)=> {
//             dispatch({
//                 type:"REDUCE",
//                 count:count
//             })
//         }
//     }
// }
const mapStateToProps = (state:any,ownProps:any) => {
    return {
        token:state.token,
        uName:state.uName
    }
}
const mapDispatchToProps = (dispatch:any) => {
    return {
        getToken:()=>{
            dispatch(
                {type:"GETTOKEN"}
            )
        },
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);