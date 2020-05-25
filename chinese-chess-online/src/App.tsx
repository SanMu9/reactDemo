import React from 'react';
import './App.css';
import axios from 'axios';

interface roomsInfo {
  roomId:number|null,
  player1:number|null,
  player2:number|null,
  roomName?:string|null,
  player1Name?:string|null,
  player2Name?:string|null
}

interface IState {
  rooms:roomsInfo[]
}

class App extends React.Component<{},IState>{

  // static getDerivedStateFromProps({},{}){
  
  // }

  readonly state:IState = {
    rooms:[],
  }

  // public componentWillMount(){
     
  // }

  public render() {
    return (
      <div></div>
    )
  }

  public componentDidMount() {
    axios.get("http://172.26.1.200:3001/getRoomsInfo").then(res=>{
      console.log(res)
    }).catch(err=>{

    })
  }
}


export default App;
