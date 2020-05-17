import React from 'react';
import './chinesechess.css';

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
        squares: Array(10).fill(null).map((val,idx) => {
            return new Array(9).fill(null)
        })
    }


    public render() {
        const blockWidth:number = this.state.blockWidth;
        const sideWidth:number = this.state.sideWidth;
        const sideHeight:number = this.state.sideHeight;
        const squares:[][] = multidimensionArrayDeepCopy(this.state.squares)

        

        console.log(this.state.squares)
       
        return (
            <div>
                <Board 
                    blockWidth={blockWidth}
                    sideWidth={sideWidth}
                    sideHeight={sideHeight}
                    squares={squares}>
                </Board>
            </div>
        )
    }
}

interface BoardProps {
    sideWidth:number,
    sideHeight:number,
    blockWidth:number,
    squares:[][]
}

class Board extends React.Component<BoardProps,{}>{

    private initCanvas = ():void => {
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
            ctx.font = "48px bold";
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

    public render() {
        const squares= this.props.squares;
        const blockWidth:number = this.props.blockWidth;
        const sideWidth:number = this.props.sideWidth;
        const sideHeight:number = this.props.sideHeight;
        const doms = squares.map((arr:[],lineIdx:number) => {
            let square = arr.map((val:any,colIdx:number) => {
                return (
                    <div key={colIdx} className="square" style={{flex:1,height:"100%"}}>

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
                    <canvas id="chinese-chess-board-canvas"></canvas>
                    <div>
                        {doms}
                    </div>
            </div>
        )
    }
}

export default Game