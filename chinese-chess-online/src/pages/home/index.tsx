import React from 'react';
import { connect } from 'react-redux'
import './index.css';
import { getRoomsInfo, registerName } from './../../api/api';

interface roomsInfo {
    roomId: number | null,
    player1: number | null,
    player2: number | null,
    roomName?: string | null,
    player1Name?: string | null,
    player2Name?: string | null
}

interface IState {
    rooms: roomsInfo[],
    cWidth: number,
    userName: string
}

// 注册所需数据
interface registerParams {
    userName: string
}

class Home extends React.Component {
    // static getDerivedStateFromProps({},{}){
    // }
    // private cWidth:number = document.documentElement.clientWidth;
    // private cHeight:number = document.documentElement.clientHeight;
    readonly state: IState = {
        rooms: [],
        cWidth: document.documentElement.clientWidth,
        userName: ""
    }

    private resizeWindow(): void {
        let cWidth: number = document.documentElement.clientWidth;
        this.setState({
            cWidth: cWidth
        });
        // this.cWidth = document.documentElement.clientWidth;
        // this.cHeight = document.documentElement.clientHeight;
        // this.blockWidth = this.cWidth>this.cHeight?this.cHeight*0.8/11:this.cWidth*0.8/10;
        // this.setState({
        //     blockWidth:this.blockWidth,
        //     sideWidth:this.blockWidth*10,
        //     sideHeight:this.blockWidth*11,
        // })
    }
    // public createRoom() {
    // }
    public registerName(name: string) {
        console.log(name)
        let params: registerParams = {
            userName: name
        },
        _this = this;
        registerName(params).then(res => {
            console.log(res)
            if (res.status === 200) {
                if (res.data.code === 200) {
                    // _this.context.userName = name;
                    _this.setState({
                        userName: name
                    })
                } else if (res.data.code === 201) {
                    alert("用户名已存在")
                }
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    public render() {
        // console.log(this.context.store)
        const userName: string = this.state.userName;
        if (userName === "" || userName === null || userName===undefined) {
            let name: string = "";
            return (
                <div className="home">
                    <div className="regist-box">
                        <p>输入昵称</p>
                        <input type="text" onChange={(ev: React.ChangeEvent) => name = (ev.target as HTMLInputElement).value} />
                        <button onClick={() => this.registerName(name)}>确认</button>
                    </div>
                </div>
            )
        }
        const rooms = this.state.rooms;
        const cWidth = this.state.cWidth;
        const btnStyle = {
            width: cWidth * 0.6 + "px",
            height: cWidth * 0.6 * 0.4 + "px",
            fontSize: cWidth * 0.6 * 0.4 * 0.4 + "px",
            margin: cWidth * 0.6 * 0.4 * 0.25 + "px " + "0",
            borderRadius: cWidth * 0.6 * 0.4 * 0.5 + "px"
        }
        return (
            <div className="home">
                <button className="big-btn" disabled={rooms.length === 0} style={btnStyle}>进入大厅</button>
                <button className="big-btn" style={btnStyle} >创建房间</button>
            </div>
        )
    }

    public componentDidMount() {
        console.log(this.props)
        window.addEventListener('resize', () => this.resizeWindow());
        getRoomsInfo().then((res: any) => {
            console.log(res)
        }).catch((err: any) => {
        })
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', () => this.resizeWindow());
    }
}
// App.contextTypes = {
//     store: React.PropTypes.object
// }
const mapStateToProps = (state:any)=> {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(Home);