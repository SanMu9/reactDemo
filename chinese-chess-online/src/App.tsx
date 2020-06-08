import React from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import Rooms from './pages/rooms/index';
// import Home from './pages/home/index';
// import Login from './pages/login/login';
import io from 'socket.io-client';

import { Dispatch } from 'redux';

import {IStoreState} from './entity/index'
import routerMap from './map/routerMap';

import { connect } from 'react-redux'
import './App.css';


class App extends React.Component {
    render() {
        const { token } = this.props as any;
        console.log(token)

        const routes = routerMap.map((item,index)=>{
            return (
                !item.auth?
                    <Route key={index} path={item.path} exact component={item.component}/>
                    :
                    (
                        token ?
                        <Route key={index} path={item.path} exact component={item.component}/>
                        :
                        <Route key={index} path={item.path} exact render={()=>(
                            <Redirect to="/login"/>
                        )} />
                    )
            )
        })
        return (
           
            <div className="app">
                <Router>
                    <Switch>
                        {routes}
                    </Switch>
                    {/* <Route  path="/rooms" render={(props)=>(<Rooms {...props}/>)}></Route> */}
                    {/* <Route exact path="/" component={Home}></Route >
                    <Route path="/rooms" component={Rooms}></Route>
                    <Route path="/login" component={Login}></Route> */}
                </Router>
            </div>

        )
    }
  
    componentDidMount(){
       
    }
    componentWillUnmount(){
        const {socket} = this.props as any;
        socket.close();
    }

}

const mapStateToProps = (state: IStoreState) => {
    return {
        token: state.user.token,
        uName: state.user.uName,
        socket:state.socket
    }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getToken: () => {
            dispatch(
                { type: "GETTOKEN" }
            )
        },
        // ioConnect:(io:SocketIOClient.Socket) => {
        //     dispatch(
        //         {type:"IOCONNECT",data:io}
        //     )
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);