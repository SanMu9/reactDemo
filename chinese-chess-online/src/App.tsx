import React from 'react';
import './App.css';
import { getRoomsInfo } from './api/api';

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
  userName:string
}

class App extends React.Component<{}, IState>{

  // static getDerivedStateFromProps({},{}){

  // }
  // private cWidth:number = document.documentElement.clientWidth;
  // private cHeight:number = document.documentElement.clientHeight;

  readonly state: IState = {
    rooms: [],
    cWidth: document.documentElement.clientWidth,
    userName:""
  }


  private resizeWindow(): void {
    let cWidth: number = document.documentElement.clientWidth;
    this.setState({
      cWidth: cWidth
    })
    // this.cWidth = document.documentElement.clientWidth;
    // this.cHeight = document.documentElement.clientHeight;
    // this.blockWidth = this.cWidth>this.cHeight?this.cHeight*0.8/11:this.cWidth*0.8/10;
    // this.setState({
    //     blockWidth:this.blockWidth,
    //     sideWidth:this.blockWidth*10,
    //     sideHeight:this.blockWidth*11,
    // })
  }

  public createRoom() {

  }

  // public componentWillMount(){

  // }

  public render() {

    const userName:string = this.state.userName;

    // if(userName === "" || userName === null){
    //   return (
    //     <div className="">

    //     </div>
    //   )
    // }

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
      <div className="app">
        <button className="" disabled={rooms.length === 0} style={btnStyle}>进入大厅</button>
        <button className="" style={btnStyle} >创建房间</button>
      </div>
    )

  }

  public componentDidMount() {
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


export default App;
