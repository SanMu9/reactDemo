import React from 'react';
import './board.css';
import ChessMan from './chessman';


interface BoardProps {
    sideWidth:number,
    sideHeight:number,
    blockWidth:number,
    squares:[][],
    bIsNext:boolean,
    chessManOnDrag:Function
}

const chessSet = [
    {}
]

class Board extends React.Component<BoardProps,{}>{

    private initCanvas = ():void => {
        console.log("init")
        let canvas = document.getElementById("chinese-chess-board-canvas") as HTMLCanvasElement,
            ctx = canvas.getContext("2d") as  CanvasRenderingContext2D,
            sideWidth:number = this.props.sideWidth,
            sideHeight:number = this.props.sideHeight,
            blockWidth:number = this.props.blockWidth;
        
        canvas.width = sideWidth;
        canvas.height = sideHeight;
        // canvas.style.outline = "3px solid #000";

        ctx.fillStyle = "rgba(221,186,132,0.8)";
        ctx.fillRect(0,0,sideWidth,sideHeight);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;

        let interval:number = blockWidth/20,
            width:number = blockWidth/5;
        function drawDecorate1(cx:number,cy:number){
            ctx.strokeStyle = "rgba(0,0,0,0.8)";

            ctx.beginPath();
            ctx.moveTo(cx-interval,cy-interval-width);
            ctx.lineTo(cx-interval,cy-interval);
            ctx.lineTo(cx-interval-width,cy-interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx+interval,cy-interval-width);
            ctx.lineTo(cx+interval,cy-interval);
            ctx.lineTo(cx+interval+width,cy-interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx+interval,cy+interval+width);
            ctx.lineTo(cx+interval,cy+interval);
            ctx.lineTo(cx+interval+width,cy+interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx-interval,cy+interval+width);
            ctx.lineTo(cx-interval,cy+interval);
            ctx.lineTo(cx-interval-width,cy+interval);
            ctx.stroke();
        }

        function drawDecorate2(){
            ctx.strokeStyle = "rgba(0,0,0,0.8)";
            ctx.beginPath();
            ctx.moveTo(blockWidth+interval,blockWidth*4-width-interval);
            ctx.lineTo(blockWidth+interval,blockWidth*4-interval);
            ctx.lineTo(blockWidth+interval+width,blockWidth*4-interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(blockWidth+interval,blockWidth*4+width+interval);
            ctx.lineTo(blockWidth+interval,blockWidth*4+interval);
            ctx.lineTo(blockWidth+interval+width,blockWidth*4+interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(blockWidth*9-interval,blockWidth*4+width+interval);
            ctx.lineTo(blockWidth*9-interval,blockWidth*4+interval);
            ctx.lineTo(blockWidth*9-interval-width,blockWidth*4+interval);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(blockWidth*9-interval,blockWidth*4-width-interval);
            ctx.lineTo(blockWidth*9-interval,blockWidth*4-interval);
            ctx.lineTo(blockWidth*9-interval-width,blockWidth*4-interval);
            ctx.stroke();
        }

        function drawHalfBoard(){
            for(let i=0;i<5;i++){
                ctx.beginPath();
                ctx.moveTo(blockWidth,blockWidth+blockWidth*i);
                ctx.lineTo(sideWidth-blockWidth,blockWidth+blockWidth*i);
                ctx.stroke();
            }
            for(let i=0;i<10;i++){
                ctx.beginPath();
                ctx.moveTo(blockWidth+blockWidth*i,blockWidth);
                ctx.lineTo(blockWidth+blockWidth*i,blockWidth*5);
                ctx.stroke();
            }
    
            ctx.beginPath();
            ctx.moveTo(blockWidth*4,blockWidth);
            ctx.lineTo(blockWidth*6,blockWidth*3);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(blockWidth*6,blockWidth);
            ctx.lineTo(blockWidth*4,blockWidth*3);
            ctx.stroke();

            let arr1 = [
                [blockWidth*2,blockWidth*3],
                [blockWidth*8,blockWidth*3],
                [blockWidth*3,blockWidth*4],
                [blockWidth*5,blockWidth*4],
                [blockWidth*7,blockWidth*4],
            ]
            for(let i=0;i<arr1.length;i++){
                drawDecorate1(arr1[i][0],arr1[i][1]);
            }
            drawDecorate2();

            ctx.beginPath();

        }

        function drawText(){
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // ctx.font = blockWidth*0.8+"px"+" kaiti";
            ctx.font = `${blockWidth*0.8}px kaiti`;
            ctx.fillText("楚  河",blockWidth*3,sideHeight/2);

          
            ctx.fillText("漢  界",blockWidth*7,sideHeight/2);
            
        }

        drawHalfBoard()
        drawText();
        
        ctx.translate(0,sideHeight);
        ctx.scale(1,-1);
        drawHalfBoard();

        // ctx.scale(1,-1);
        // ctx.translate(0,-sideHeight);
    }

    public componentDidMount(){
        this.initCanvas()
    }

    public componentDidUpdate(){
        this.initCanvas()
    }

    public render() {
        const squares:[][]= this.props.squares;
        const blockWidth:number = this.props.blockWidth;
        const bIsNext:boolean = this.props.bIsNext;
        console.log(squares)
        // const sideWidth:number = this.props.sideWidth;
        // const sideHeight:number = this.props.sideHeight;
        const doms:JSX.Element[] = squares.map((arr:[],lineIdx:number) => {
            let square = arr.map((val:[],colIdx:number) => {
                return (
                    <div key={colIdx} className="square" style={{flex:1,height:"100%"}}>
                        <ChessMan
                            chessManOnDrag={(ev:React.DragEvent)=>this.props.chessManOnDrag(ev)}
                            bIsNext={bIsNext} blockWidth={blockWidth} info={squares[lineIdx][colIdx]}>
                        </ChessMan>
                    </div>
                )
            })
            return (
                <div className="square-row" key={lineIdx} style={{height:blockWidth,width:blockWidth*9+"px",display:"flex"}}>
                    {square}
                </div>
            )
        })

        return (
            <div className="board" 
                style={{width:this.props.sideWidth+"px",height:this.props.sideHeight+"px"}}>
                    <canvas id="chinese-chess-board-canvas" style={{zIndex:0}}/>
                    <div style={{zIndex:1}}>
                        {doms}
                    </div>
            </div>
        )
    }
}

export default Board;