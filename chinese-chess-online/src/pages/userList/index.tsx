import React from 'react';

import './index.css';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import { USER,IStoreState,GAMEINFO } from '../../entity';
import { getOtherUserList,invite,beginGame} from './../../api/api';


import Pop from "./../../components/pop/pop";

interface IState {
    popShow:Boolean,
    invitor:String,
    msg:String
}

class List extends React.Component {

    readonly state:IState = {
        popShow:false,
        invitor:"",
        msg:""
    }
    private userStatusMap = ["离线","在线","游戏中"]

    public render():JSX.Element {
        const {userList} = this.props as any;
        console.log(userList)
        const list = userList.map((user:USER,index:number) => {
            return (
            <div className="user-wrap" key={index}>
                <div className="name">
                    {user.uName}
                    <span className="status">{this.userStatusMap[user.status]}</span>
                </div>
                <div className="btn" onClick={()=>this.inviteUser(user.uName)}>
                    邀请
                </div>
            </div>)
        })

        const pop = this.state.popShow?(<Pop msg={this.state.msg}
                acceptFuc={()=>this.accept()}
                refuseFuc={()=>{}}></Pop>):null

        return (
            <div className="user-list-container">
                {list}
                {pop}
            </div>
        )
    }

    public getList() {
        const {userName,setUserList} = this.props as any;
        getOtherUserList({userName:userName}).then((res:AxiosResponse) => {
            console.log(res)
            if(res.status === 200){
                const data = res.data;
                const param:USER[] = data.map((item:any,index:number) => {
                    let user:USER = {
                        uName:item.name,
                        token:item.token,
                        status:item.status
                    }
                    return user;
                })
                setUserList(param)
            }
        })
    }

    public inviteUser(userName:string|null|undefined) {
        console.log(userName)
        let invitor = (this.props as any).userName
        invite({userName,invitor}).then(res => {
            console.log(res)
        }); 
    }
    public componentWillMount() {
        let {socket,userName,token} = this.props as any;
        console.log('userAdd:'+userName+'____'+'token:'+token)
        socket.emit("userAdd",{userName,token})
    }

    public invitePopShow(invitor:String) {

        this.setState({
            popShow:true,
            invitor:invitor,
            msg:invitor+"邀请你进行一场对局"
        })
    }

    public accept(){
        let {userName,setGame,history} = this.props as any;
        let invitor = this.state.invitor;
        beginGame({userName,invitor}).then(res=> {
            console.log(res)
            if(res.data.code == 200){
                let gameId = res.data.data;
                setGame({gameId:gameId,player1:invitor,player2:userName});
                history.push({pathname:"/game",state:{id:gameId}});

            }
        })
    }

    public refuse(){
        
    }

    public componentDidMount() {
        const {socket,setGame,history} = this.props as any;
        // console.log(this.props)
        // console.log()
        let _this = this;
        this.getList();
        socket.on('usersUpdate',()=>{
            console.log("SSSS")
            this.getList();
        })
        socket.on("invite",(invitor:string)=> {
            _this.invitePopShow(invitor)
        });
        socket.on("beginGame",(game:GAMEINFO)=> {
            setGame(game)
            history.push({pathname:"/game",state:{id:game.gameId}});
            // alert("开始游戏，gameID："+game.gameId)
        })

    }
}
const mapStateToProps = (state: IStoreState) => {
    return {
        userName: state.user.uName,
        token: state.user.token,
        status:state.user.status,
        socket: state.socket,
        cWidth: state.page.cWidth,
        userList:state.userList
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setUserList:(data:USER[]) => {
            dispatch({
                type: "SETLIST",
                data: data
            })
        },
        setGame:(data:GAMEINFO) => {
            dispatch({
                type:"SETGAME",
                data:data
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
