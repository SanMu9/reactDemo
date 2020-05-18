import React from 'react';
import './chinesechess.css';
import Board from "./board";

function multidimensionArrayDeepCopy(obj:any):any{
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = multidimensionArrayDeepCopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}

interface IState {
    winner:string | null,
    sideWidth:number,
    sideHeight:number,
    blockWidth:number,
    bIsNext:boolean,
    squares:any[10][9]
    // sideLength:number,
    // blockWidth:number
}


class Game extends React.Component<{},IState> {
    // constructor(props:any){
    //     super(props);
        
    // }
    private cWidth:number = document.documentElement.clientWidth;
    private cHeight:number = document.documentElement.clientHeight;
    private blockWidth:number = this.cWidth>this.cHeight?this.cHeight*0.8/11:this.cWidth*0.8/10;

    readonly state:IState= {
        winner:null,
        blockWidth:this.blockWidth,
        sideWidth:this.blockWidth*10,
        sideHeight:this.blockWidth*11,
        bIsNext:true,
        squares: [
            [22,23,24,25,26,25,24,23,22],
            [0,0,0,0,0,0,0,0,0],
            [0,21,0,0,0,0,0,21,0],
            [20,0,20,0,20,0,20,0,20],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [10,0,10,0,10,0,10,0,10],
            [0,11,0,0,0,0,0,11,0],
            [0,0,0,0,0,0,0,0,0],
            [12,13,14,15,16,15,14,13,12],
        ]
    }

    private resizeWindow():void{
        this.cWidth = document.documentElement.clientWidth;
        this.cHeight = document.documentElement.clientHeight;
        this.blockWidth = this.cWidth>this.cHeight?this.cHeight*0.8/11:this.cWidth*0.8/10;
        this.setState({
            blockWidth:this.blockWidth,
            sideWidth:this.blockWidth*10,
            sideHeight:this.blockWidth*11,
        })
    }

    public componentDidMount(){
        window.addEventListener('resize',()=>this.resizeWindow());
    }

    public componentWillUnmount() {
        window.removeEventListener('resize',()=>this.resizeWindow());
    }

    public chessManOnDrag(ev:React.DragEvent) {
        console.log(this)
        console.log(ev.target)
    }

    public chessManMoveRule(beginPos:number[],endPos:number[]){

    }

    // public 


    public render() {
        const blockWidth:number = this.state.blockWidth;
        const sideWidth:number = this.state.sideWidth;
        const sideHeight:number = this.state.sideHeight;
        const squares:[][] = multidimensionArrayDeepCopy(this.state.squares);
        const bIsNext:boolean = this.state.bIsNext;

        console.log(this.state.blockWidth)
       
        return (
            <div id="game">
                <Board 
                    blockWidth={blockWidth}
                    sideWidth={sideWidth}
                    sideHeight={sideHeight}
                    bIsNext={bIsNext}
                    squares={squares}
                    chessManOnDrag={(ev:React.DragEvent)=>this.chessManOnDrag(ev)}>
                </Board>
            </div>
        )
    }
}

export default Game