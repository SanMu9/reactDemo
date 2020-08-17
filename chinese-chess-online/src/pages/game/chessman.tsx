import React from 'react';
import './chessman.css';
// import { number } from 'prop-types';


const RED = {
    0:'兵',
    1:'炮',
    2:'車',
    3:'馬',
    4:'相',
    5:'士',
    6:'帥'
}
const BLACK = {
    0:'卒',
    1:'炮',
    2:'車',
    3:'馬',
    4:'象',
    5:'士',
    6:'将'
}

const CHESSMAN_TYPE:any = {
    1:RED,
    2:BLACK
}

const COLOR_INDEX:any = {
    1:"red",
    2:"#000"
}

interface IProps {
    blockWidth:number,
    info:number,
    bIsNext:boolean,
    chessManOnDragStart:Function,
    pos:number[],
    selfSide:number,
    chessManOnTouchStart:Function
}
// 每个棋子信息（info）由 棋子类型（CHESSMAN_TYPE） + 棋子名字代号（RED||BLACK）的数字组成
// 比如 22 代表 黑车
// info值为0代表该位置没有棋子
// pos表示当前行列位置
class ChessMan extends React.Component<IProps,{}>{

    public render() {
        const info = this.props.info;
        if(info === 0){
            return null
        }else{
            const blockWdth:number= this.props.blockWidth;
            const chessmanWidth:number = blockWdth*0.9;
            const infoStr:string = info.toString();
            const color:string = COLOR_INDEX[infoStr[0]];
            const name:string = CHESSMAN_TYPE[infoStr[0]][infoStr[1]];
            const bIsNext:boolean = this.props.bIsNext;
            // const draggable:boolean = (infoStr[0]==='2'&&bIsNext)||(infoStr[0]==='1'&&!bIsNext)?true:false;
            const draggable:boolean = bIsNext&&infoStr[0] === this.props.selfSide.toString()
            const pos:number[]=this.props.pos;
            const id:string =  "chessman-"+pos.join("");
            
            return (
                <div 
                    style={{width:chessmanWidth+'px',height:chessmanWidth+'px',fontSize:chessmanWidth*0.6+'px',color:color,border:chessmanWidth*0.1+'px solid #C4A175'}}
                    className={["chessman",draggable?"draggable":null].join(" ")}
                    id={id}
                    data-line={pos[0]}
                    data-col={pos[1]}
                    draggable={draggable}
                    onTouchStart={(ev:React.TouchEvent)=>this.props.chessManOnTouchStart(pos,ev)}
                    onDragStart={(ev:React.DragEvent)=>this.props.chessManOnDragStart(pos,ev)}>
                    {name}
                </div>
            )
        }
       
    }
}

export default ChessMan