import React from 'react';
import { connect } from 'react-redux'
import './index.css';
import { getRoomsInfo, registerName } from './../../api/api';
import {IStoreState,ROOMINFO} from '../../entity/index';
import { Dispatch } from 'redux';
import {AxiosResponse} from 'axios';


class Home extends React.Component {
    // static getDerivedStateFromProps({},{}){
    // }
    
    public render() {
        const rooms:ROOMINFO[] = (this.props as any).rooms;
        const cWidth = (this.props as any).cWidth;
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
        const {resizePage,setRooms} = (this.props as any);
        window.addEventListener('resize', () => resizePage());

        getRoomsInfo().then((res:AxiosResponse) => {
            console.log(res)
            if(res.status === 200){
                const data = res.data;
                setRooms(data)
            }
        }).catch((err) => {
        })
    }

    public componentWillUnmount() {
        const {resizePage} = (this.props as any);
        window.removeEventListener('resize', () => resizePage());
    }

    public createRoom() {
        const {userName} = this.props as any;
        
        
    }
}
// App.contextTypes = {
//     store: React.PropTypes.object
// }
const mapStateToProps = (state:IStoreState)=> {
    return {
        userName: state.user.uName,
        cWidth:state.page.cWidth,
        rooms:state.rooms
    }
};

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        setRooms:(data:ROOMINFO[]) => {
            dispatch({
                type:"SETROOMS",
                data:data
            })
        },
        resizePage:() => {
            dispatch({
                type:"SIZECHANGE"
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);