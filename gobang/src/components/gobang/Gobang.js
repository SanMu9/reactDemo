import React from "react";
import './Gobang.css';
function multidimensionArrayDeepCopy(obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = multidimensionArrayDeepCopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}

class Board extends React.Component{
    constructor(props){
        super(props);

        const cWidth = document.documentElement.clientWidth;
        const cHeight = document.documentElement.clientHeight;
        const sideLength = cWidth>cHeight?cHeight*0.8:cWidth*0.8;

        this.state = {
            sideLength:sideLength,
            blockWidth:sideLength/15,
            bIsNext:true,
            //白子 'w'  黑子 'b'
            squares:Array(15).fill(null).map((val,idx) => {
                return new Array(15).fill(null)
            }),
            renderCount:0
        };
        // this.initCanvas = this.initCanvas.bind(this)
    }

    initCanvas=()=>{
        let canvas = document.getElementById("goband-board-canvas"),
            ctx = canvas.getContext("2d"),
            sideLength = this.state.sideLength,
            blockWidth = this.state.blockWidth;
        
        canvas.width = sideLength;
        canvas.height = sideLength;
        canvas.style.outline = "3px solid #000";

        ctx.fillStyle = "rgba(221,186,132,0.8)"
        ctx.fillRect(0,0,sideLength,sideLength)

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;

        for(let i = 0;i<15;i++){
            ctx.beginPath();
            ctx.moveTo(blockWidth/2+blockWidth*i,blockWidth/2);
            ctx.lineTo(blockWidth/2+blockWidth*i,sideLength-blockWidth/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(blockWidth/2,blockWidth/2+blockWidth*i);
            ctx.lineTo(sideLength-blockWidth/2,blockWidth/2+blockWidth*i);
            ctx.stroke();
        }
        
        // ctx.strokeRect(0,0,sideLength-1,sideLength-1)
    }

    handleMouseOver(ev,lineIdx,colIdx){
        let square = this.state.squares[lineIdx][colIdx];
        if(square!=null){
            return
        }
        let bIsNext = this.state.bIsNext,
            tar = ev.currentTarget,
            piece = tar.firstElementChild,
            className = bIsNext?"black-piece-hover":"white-piece-hover";
        piece.classList.add(className);
        // tar.classList.remove

        // console.log(tar.firstElementChild)
    }
    handleMouseOut(ev,lineIdx,colIdx){
        let square = this.state.squares[lineIdx][colIdx];
        if(square!=null){
            return
        }
        let bIsNext = this.state.bIsNext,
            tar = ev.currentTarget,
            piece = tar.firstElementChild,
            className = bIsNext?"black-piece-hover":"white-piece-hover";
        piece.classList.remove(className);
    }
    handleClick(ev,lineIdx,colIdx){
        let square = this.state.squares[lineIdx][colIdx];
        if(square!=null){
            return
        }
        let bIsNext = this.state.bIsNext,
            renderCount = this.state.renderCount,
            squares = multidimensionArrayDeepCopy(this.state.squares),
            piece = ev.currentTarget.firstElementChild,
            val = bIsNext?"b":"w",
            className = bIsNext?"black-piece":"white-piece";
        squares[lineIdx][colIdx] = val;
        piece.classList.add(className);

        this.setState({
            squares:squares,
            bIsNext:!bIsNext,
            renderCount:renderCount+1
        })
        
    }

    // componentWillMount(){
    // }
    componentDidMount(){
        this.initCanvas();
    }
    shouldComponentUpdate(nextProps,nextState){
        console.log(nextState)
        if(this.state.renderCount === nextState.renderCount){
            return false
        }
        return true
    }

    // componentDidUpdate(){}

    render() {
   
        const squares = multidimensionArrayDeepCopy(this.state.squares);
        const domArray = squares.map((arr,lineIdx) => {
            let square = arr.map((val,colIdx) => {
                return (
                    <div key={colIdx} className="square" style={{flex:1,height:"100%"}} 
                        onMouseOver={(ev)=>this.handleMouseOver(ev,lineIdx,colIdx)}
                        onMouseOut={(ev) => this.handleMouseOut(ev,lineIdx,colIdx)}
                        onClick={(ev) => this.handleClick(ev,lineIdx,colIdx)}
                    >
                        <span className={["chess-piece",val==='w'?"white-piece":null,val==='b'?"black-piece":null,val===null?"no-piece":null].join(" ")}></span>
                    </div>
                )
            })
            return (
                <div className="square-row" key={lineIdx} style={{height:this.state.blockWidth,width:this.state.sideLength}}>
                    {square}
                </div>
            )
        })

        const tip = ""
      console.log("render")

        return (
            <div>
                <p className="info-tip">Next Player：{this.state.bIsNext?"黑棋":"白棋"}</p>
                <div className="board" style={{width:this.state.sideLength+"px",height:this.state.sideLength+"px"}}>
                    <canvas id="goband-board-canvas"></canvas>
                    <div style={{width:this.state.sideLength+"px",height:this.state.sideLength+"px",position:'absolute',top:0,left:0}}>
                        {domArray}
                    </div>
                </div>
            </div>
          
        )
    }
}

// class GoBang extends React.Component{
//     render() {
//         return (
//             <Board />
//         )
//     }
// }
function GoBang(){
    return (
        <Board></Board>
    )
}

export default GoBang;