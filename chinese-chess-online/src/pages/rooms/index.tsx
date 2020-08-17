import React from 'react';
// import io from 'socket.io-client';

import './index.css';
import { connect } from 'react-redux';
import { IStoreState, ROOMINFO } from './../../entity/index';
import { getRoomsInfo, createRoomReq} from './../../api/api';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

class Rooms extends React.Component {

    // public socket:SocketIOClient.Socket|null = null;


    public render(): JSX.Element {
        const { userName } = this.props as any;
        var main = null;
        main = this.initMainPage();

        return (
            <div className="room">
                <header>
                    <span>大厅</span>
                    <span className="setting">欢迎，{userName}</span>
                </header>
                {main}
            </div>
        )
    }

    public componentDidMount() {
        const { socket,resizePage } = this.props as any;
        const { userName, token } = (this.props as any);
        socket.emit("userAdd", { userName, token });

        // 进入大厅获取房间列表
        this.getRooms();

        window.addEventListener('resize', () => resizePage());

        socket.on('roomsRefresh',(data:any) => {
            alert(data)
            this.getRooms();
        })
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

    public componentWillUnmount() {
        // (this.ws as WebSocket).close();
    }

    public getRooms() {
        const { setRooms } = (this.props as any);

        getRoomsInfo().then((res: AxiosResponse) => {
            if (res.status === 200) {
                const data = res.data;
                setRooms(data)
            }
        }).catch((err) => {
        })
    }

    public joinGame(roomName:string|null) {

    }

    public initMainPage() {
        // 第一次调用没有获取最新数据，直接不进行渲染
        // 第一次调用后函数重写
        // componentDidMount 中获取最新数据后调用的即为重写后的方法
        this.initMainPage = () => {
            const {rooms,userName} = this.props as any;
            console.log(userName)
            var main = null,
                hasRoom = false;
            if(rooms.length){
                const roomsDom = rooms.map((room:ROOMINFO,index:number) => {
                    if(room.player_first === userName){
                        hasRoom = true;
                        return (
                            <div className="room-box" key={index} data-name={room.room_name}>
                                离开
                            </div>
                        )
                    }else{
                        return (
                            <div className="room-box" 
                                key={index} 
                                data-name={room.room_name}
                                onClick={() => this.joinGame(room.room_name)}>
                                加入
                            </div>
                        )
                    }
                    
                })
                const roomAddDom = ():null|JSX.Element => {
                    return (hasRoom?null:
                    <div className="add-box" onClick={() => this.createRoom()}>
                        <svg viewBox="0 0 1024 1024">
                            <path d="M980.700543 468.454893H557.401933V45.156283a43.350032 43.350032 0 0 0-86.700063 0v423.29861H47.396035a43.350032 43.350032 0 0 0 0 86.700064h423.305835v423.31306a43.350032 43.350032 0 0 0 86.700063 0v-423.31306h423.29861a43.350032 43.350032 0 0 0 0-86.700064z"></path>
                        </svg>
                    </div>)
                }
                main = (
                    <main>
                        {roomsDom}
                        {roomAddDom()}
                    </main>
                )
            }else{

                const cWidth = (this.props as any).cWidth;
                const btnStyle = {
                    width: cWidth * 0.6 + "px",
                    height: cWidth * 0.6 * 0.4 + "px",
                    fontSize: cWidth * 0.6 * 0.4 * 0.4 + "px",
                    margin: cWidth * 0.6 * 0.4 * 0.25 + "px " + "0",
                    borderRadius: cWidth * 0.6 * 0.4 * 0.5 + "px"
                }

                main = (
                    <main className="noroom">
                        暂无游戏房间,来创建一个吧。
                        <button className="big-btn" style={btnStyle} onClick={() => this.createRoom()}>创建房间</button>
                    </main>
                )
            }
            return main;
        }
        return <main></main>;
    }

    public createRoom() {
        const {userName,joinRoom} = this.props as any;

        createRoomReq({userName:userName}).then((res:AxiosResponse)=> {

            if(res.status === 200){
                let data = res.data;
                joinRoom();
                console.log(data)
            }

        }).catch(err => {

        })
    }


}

const mapStateToProps = (state: IStoreState) => {
    return {
        userName: state.user.uName,
        token: state.user.token,
        status:state.user.status,
        rooms: state.rooms,
        socket: state.socket,
        cWidth: state.page.cWidth
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setRooms: (data: ROOMINFO[]) => {
            dispatch({
                type: "SETROOMS",
                data: data
            })
        },
        resizePage:() => {
            dispatch({
                type:"SIZECHANGE"
            })
        },
        joinRoom:() => {
            dispatch(
                {
                    type:"USERSTATECHANGE",
                    data:{
                        status:2
                    }
                }
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)