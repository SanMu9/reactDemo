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

    // public dragChessState = {
    // }
    public dragChessDom:HTMLElement = document.createElement("div");
    public dragChessInitialPos:number[] = [-1,-1];//拖拽棋子的初始位置
    public dropSquareDropEffect:string = "none"//拖放位置拖放状态（是否可移动none/move）
    public posChessCanDrop:string[] = []//拖拽的棋子可以放置的位置

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

    // 棋子初始位置
    public chessManOnDragStart(pos:number[],ev:React.DragEvent):void{
        // const tar:HTMLElement = ev.target as HTMLElement;
        this.dragChessInitialPos = [pos[0],pos[1]];
        this.dragChessDom = ev.target as HTMLElement;
        ev.dataTransfer.effectAllowed = "move";
        this.posChessCanDrop = this.getPosChessCanDrop(this.dragChessInitialPos,this.state.squares[pos[0]][pos[1]]);
    }

    public squareOnDragOver = (ev:React.DragEvent) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = this.dropSquareDropEffect;
    }

    public squareOnDragEnter = (pos:number[],ev:React.DragEvent) => {
        ev.preventDefault();
        let chessInitPos:number[] = [this.dragChessInitialPos[0],this.dragChessInitialPos[1]],
            chessInfo:number = this.state.squares[chessInitPos[0]][chessInitPos[1]];
        
        this.dropSquareDropEffect = this.posChessCanDrop.indexOf(pos.join(""))>=0?"move":"none";
    }

    public squareOnDrop = (pos:number[],ev:React.DragEvent)=>{
        ev.preventDefault();
        // 该位置允许释放棋子
        if(this.dropSquareDropEffect ==="move"){
            const tar:HTMLElement = ev.target as HTMLElement;
            const chessInitPos:number[] = this.dragChessInitialPos;
            const dragChess:HTMLElement= this.dragChessDom;
            const parent:HTMLElement = dragChess.parentElement as HTMLElement;

            const squares:any[10][9] = multidimensionArrayDeepCopy(this.state.squares);
            const chessInfo:number = squares[chessInitPos[0]][chessInitPos[1]];
            squares[chessInitPos[0]][chessInitPos[1]] = 0;
            squares[pos[0]][pos[1]] = chessInfo;

            this.chessMoveAnimation(dragChess,chessInitPos,pos,()=>{
                this.setState({
                    squares:squares,
                    bIsNext:!this.state.bIsNext
                })
            })

        }
     

        this.dragChessInitialPos = [-1,-1];
        this.dropSquareDropEffect = "none";
        this.posChessCanDrop = [];
    }

    public chessMoveAnimation = (chessDom:HTMLElement,beginPos:number[],endPos:number[],callback:Function) => {
        const blockWidth = this.state.blockWidth;
        let clone: HTMLElement= chessDom.cloneNode(true) as HTMLElement;
        chessDom.style.visibility = "hidden";
        // clone.classList.add("onmove");
        clone.style.position = "absolute";
        clone.style.left = blockWidth*(beginPos[1]+1)+"px";
        clone.style.top = blockWidth*(beginPos[0]+1)+"px";
        clone.style.transform = "translate(-50%,-50%)";
        clone.style.zIndex = "3"
        const board = document.getElementById("chinese-chess-board") as HTMLElement;
        board.appendChild(clone);

        setTimeout(()=>{
            clone.style.transition = "all 0.3s";
            clone.style.transform = "translate(-50%,-50%) scale(1.2)";

            setTimeout(()=>{
                clone.style.transition = "all 1s";

                clone.style.left = blockWidth*(endPos[1]+1)+"px";
                clone.style.top = blockWidth*(endPos[0]+1)+"px";

                setTimeout(()=>{
                    clone.style.transition = "all 0.3s";
                    clone.style.transform = "translate(-50%,-50%)";
                    setTimeout(()=>{
                        board.removeChild(clone);
                        callback();
                    },300)
                },1000)
            },300)
        },1)
        


       
        // (clone.parentElement as HTMLElement).removeChild(clone)
    }

    // 指定位置棋子是否为己方棋子，为敌方棋子或没有棋子返回false
    public oneOfUs = (chessInfo:number):boolean  => {
        const side = this.state.bIsNext?2:1;
        return side === Math.floor(chessInfo/10);
    }

    public isEnemy = (chessInfo:number):boolean => {
        const side = this.state.bIsNext?2:1;
        const chessType = Math.floor(chessInfo/10);
        return chessType!=0&&side!=chessType
    }

    public getPosChessCanDrop(bp:number[],chessType:number):string[]{
        // if(bp.join("")===ep.join("")){return []}
        const dragChessType:number = chessType%10;//棋子类型
        const dragChessSide:number = Math.floor(chessType/10);//棋子方,黑方:2 红方：1

        switch(dragChessType){
            //兵、卒
            case 0:
                return (()=>{
                    let md =  dragChessSide==1?-1:1,//移动方向，即红方line值只能减，黑方只能增
                        posAllowed = [[bp[0],bp[1]-1].join(""),[bp[0],bp[1]+1].join(""),[bp[0]+md,bp[1]].join("")];
                    return posAllowed
                })()
            // 炮
            case 1:
                return (()=>{
                    let posAllowed:string[]= [],
                        line:number = bp[0],
                        col:number = bp[1],
                        chessCountOnRoute:number = 0;
                    const squares:[][] = this.state.squares;
                    // 棋子右侧路线
                    for(let i=col+1;i<9;i++){
                        let chessOnRoute:number = squares[line][i];
                        console.log(chessOnRoute)
                        // 目标处无棋子且路线上无棋子，或目标区域为敌方棋子且路线上有一个棋子，两种情况棋子可以移动
                        if((chessOnRoute===0&&chessCountOnRoute===0)){
                            posAllowed.push([line,i].join(""));
                            continue;
                        }
                        if(this.isEnemy(chessOnRoute)&&chessCountOnRoute===1){
                            posAllowed.push([line,i].join(""));
                            break;
                        }
                        if(chessOnRoute!=0){
                            chessCountOnRoute++;
                        }
                    }
                    // 棋子左侧路线
                    // console.log(posAllowed)
                    return posAllowed
                    // return false
                })()
            default:
                break;
        }

        return [];
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
                    squareOnDragEnter={(pos:number[],ev:React.DragEvent)=>this.squareOnDragEnter(pos,ev)}
                    squareOnDragOver={(ev:React.DragEvent)=>this.squareOnDragOver(ev)}
                    squareOnDrop={(pos:number[],ev:React.DragEvent)=>this.squareOnDrop(pos,ev)}
                    chessManOnDragStart={(pos:number[],ev:React.DragEvent) => this.chessManOnDragStart(pos,ev)}>
                </Board>
            </div>
        )
    }
}

export default Game