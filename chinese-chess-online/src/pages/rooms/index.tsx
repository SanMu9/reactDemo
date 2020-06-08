import React from 'react';
// import io from 'socket.io-client';

import './index.css';
import {connect} from 'react-redux';
import {IStoreState} from './../../entity/index';

class Rooms extends React.Component {

    public socket:SocketIOClient.Socket|null = null;

    public render():JSX.Element {
        console.log(this.props)

        return (
            <div className="room">
                <header>
                    <span>大厅</span>
                </header>
                <main></main>
            </div>
        )
    }

    public componentDidMount() {
        const {socket} = this.props as any;
        console.log(socket)
        const {uName,token} = (this.props as any).user;
        console.log(uName,token)
        socket.emit("userAdd",{uName,token});


        // socket.on('message',(data:string)=>{
        //     console.log(data)
        // })
        // socket.open
        // this.ws = new WebSocket("ws://172.26.1.200:8088/");
        // var ws = this.ws;
        // ws.onopen = () => {
        //     console.log('websocket open');
        // }
    }

    public componentWillUnmount(){
        // (this.ws as WebSocket).close();
    }
}

const mapStateToProps = (state:IStoreState) => {
    console.log(state)
    return{
        user:state.user,
        socket:state.socket
    }
} 

export default connect(mapStateToProps)(Rooms)