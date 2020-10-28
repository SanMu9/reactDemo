import React from 'react';

import './index.css';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import { USER,IStoreState } from '../../entity';

import {getGameInfo,chessMove} from './../../api/api';
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
    blockWidth:number,
    bIsNext:boolean,
    squares:any[10][9],
    sideWidth:number,
    sideHeight:number,
    selfSide:number,
    winner:string | null,
    player1:string,
    player2:string,

    gameId:string
}

interface rivalMoveParams {
    id:string,
    chessInitPos:number[],
    pos:number[]
}

class Game extends React.Component <{},IState> {

    private cWidth:number = document.documentElement.clientWidth;
    private cHeight:number = document.documentElement.clientHeight;
    private blockWidth:number = this.cWidth>this.cHeight?this.cHeight*0.8/11:this.cWidth*0.8/10;
    
    readonly state:IState= {
        winner:null,
        blockWidth:this.blockWidth,
        sideWidth:this.blockWidth*10,
        sideHeight:this.blockWidth*11,
        selfSide:1,
        player1:"",
        player2:"",
        gameId:"",
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

    public dragChessDom:HTMLElement = document.createElement("div");
    public dragChessInitialPos:number[] = [-1,-1];//拖拽棋子的初始位置
    public dropSquareDropEffect:string = "none"//拖放位置拖放状态（是否可移动none/move）
    public posChessCanDrop:string[] = []//拖拽的棋子可以放置的位置

    public dragChessCopy:HTMLElement|null = null;

  
    public componentWillMount() {
        let {socket,userName,token} = this.props as any;
        socket.emit("userAdd",{userName,token})
    }

    public componentDidMount(){
        window.addEventListener('resize',()=>this.resizeWindow());
        this.getGameDetail();
        const {socket} = this.props as any;
        let _this = this;        

        socket.on("rivalMove",(params:rivalMoveParams) => {
            _this.rivalMove(params.chessInitPos,params.pos,params.id);
        })

    }

    public componentWillUnmount() {
        window.removeEventListener('resize',()=>this.resizeWindow());
    }

    public render(){
        // const {cWidth,cHeight} = this.props as any;
        const blockWidth:number = this.state.blockWidth;
        const sideWidth:number = this.state.sideWidth;
        const sideHeight:number = this.state.sideHeight;
        const squares:[][] = multidimensionArrayDeepCopy(this.state.squares);
        const bIsNext:boolean = this.state.bIsNext;
        const winner:string|null = this.state.winner;
        const selfSide = this.state.selfSide;
        let text:string = bIsNext?"你的回合":"对方回合";

        if(winner){
            // text = "获胜方 "+winner;
        }

        return (
            <div id="game">
                <p>{text}</p>
                <Board 
                    selfSide={selfSide}
                    blockWidth={blockWidth}
                    sideWidth={sideWidth}
                    sideHeight={sideHeight}
                    bIsNext={bIsNext}
                    squares={squares}
                    chessManOnTouchStart={(pos:number[],event:React.TouchEvent) => this.chessManOnTouchStart(pos,event)}
                    squareOnTouchMove={(ev:React.TouchEvent)=>this.squareOnTouchMove(ev)}
                    chessOnTouchEnd={(ev:React.TouchEvent)=>this.chessOnTouchEnd(ev)}
                    squareOnDragEnter={(pos:number[],ev:React.DragEvent)=>this.squareOnDragEnter(pos,ev)}
                    squareOnDragOver={(ev:React.DragEvent)=>this.squareOnDragOver(ev)}
                    squareOnDrop={(pos:number[],ev:React.DragEvent)=>this.squareOnDrop(pos,ev)}
                    chessManOnDragStart={(pos:number[],ev:React.DragEvent) => this.chessManOnDragStart(pos,ev)}>
                </Board>

                <div className="result-wrap" style={{display:winner?'flex':'none'}}>
                    <span className={['result-txt',winner?'active':null].join(' ')}>{bIsNext?'败':'胜'}</span>
                </div>
            </div>
        )
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

    public getGameDetail(){
        var {gameId,userName,location}  = this.props as any;
        gameId = gameId?gameId:location.state.id;
        let _this = this;
        getGameInfo({gameId}).then(res => {
            if(res.data.code === 200){
                let gameInfo = res.data.data[0];
                // player1为黑子，player2为红子，黑子先行
                let bIsNext = userName === gameInfo.player_next?true:false;
                let selfSide = userName === gameInfo.player1?2:1;
                let squares= gameInfo.step?(JSON.parse(gameInfo.step)).data:multidimensionArrayDeepCopy(_this.state.squares)
                _this.setState({
                    bIsNext:bIsNext,
                    selfSide:selfSide,
                    gameId:gameId,
                    player2:gameInfo.player2,
                    player1:gameInfo.player1,
                    squares:squares
                })
             
            }

        })

    }

    // 棋子初始位置
    public chessManOnDragStart(pos:number[],ev:React.DragEvent):void{
        // const tar:HTMLElement = ev.target as HTMLElement;
        this.dragChessInitialPos = [pos[0],pos[1]];
        console.log(this.dragChessInitialPos)
        this.dragChessDom = ev.target as HTMLElement;
        ev.dataTransfer.effectAllowed = "move";
        this.posChessCanDrop = this.getPosChessCanDrop(this.dragChessInitialPos,this.state.squares[pos[0]][pos[1]]);
        console.log(this.posChessCanDrop)
    }

    public chessManOnTouchStart(pos:number[],ev:React.TouchEvent):void{
        this.dragChessInitialPos = [pos[0],pos[1]];
        let dragDom = ev.target as HTMLElement;
        if(!dragDom.draggable)return
        this.dragChessDom = dragDom;
        let clone = this.dragChessCopy =  dragDom.cloneNode(true) as HTMLElement;
        this.dragChessCopy.style.opacity = "0";
        this.dragChessCopy.style.position = "fixed";

        const board = document.getElementById("chinese-chess-board") as HTMLElement;
        board.appendChild(clone);

        this.posChessCanDrop = this.getPosChessCanDrop(this.dragChessInitialPos,this.state.squares[pos[0]][pos[1]]);
    }

    public squareOnDragOver = (ev:React.DragEvent) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = this.dropSquareDropEffect;
    }

    public squareOnDragEnter = (pos:number[],ev:React.DragEvent) => {
        ev.preventDefault();
        // let chessInitPos:number[] = [this.dragChessInitialPos[0],this.dragChessInitialPos[1]],
            // chessInfo:number = this.state.squares[chessInitPos[0]][chessInitPos[1]];
        
        this.dropSquareDropEffect = this.posChessCanDrop.indexOf(pos.join(""))>=0?"move":"none";
    }

    public squareOnTouchMove = (ev:React.TouchEvent) => {
        ev.preventDefault();
        let touch = ev.targetTouches[0];
        if(this.dragChessCopy){
            let x = touch.pageX,
                y = touch.pageY;
            this.dragChessDom.style.visibility = "hidden";
            this.dragChessCopy.style.transform = "translate(-50%,-50%)";
            this.dragChessCopy.style.opacity = "0.6";

            this.dragChessCopy.style.left = x+"px";
            this.dragChessCopy.style.top = y+"px";
        }
    }

    public squareOnDrop = (pos:number[],ev:React.DragEvent)=>{
        ev.preventDefault();
        // 该位置允许释放棋子
        if(this.dropSquareDropEffect ==="move"){
            // const tar:HTMLElement = ev.target as HTMLElement;
            const chessInitPos:number[] = this.dragChessInitialPos;
            const dragChess:HTMLElement= this.dragChessDom;
            // const parent:HTMLElement = dragChess.parentElement as HTMLElement;

            const squares:any[10][9] = multidimensionArrayDeepCopy(this.state.squares);
            const chessInfo:number = squares[chessInitPos[0]][chessInitPos[1]];
            squares[chessInitPos[0]][chessInitPos[1]] = 0;
            const tarPosChess:number = squares[pos[0]][pos[1]];
            const enemyBoss = this.state.selfSide===2?16:26;
            const winSide = this.state.selfSide===2?"黑方":"红方";
            squares[pos[0]][pos[1]] = chessInfo;

            const winner:string|null = tarPosChess===enemyBoss?winSide:null;

            const {userName} = this.props as any;
            let params = {
                chessInitPos,
                pos,
                id:dragChess.id,
                squares:JSON.stringify({data:squares}),
                gameId:this.state.gameId,
                player1:this.state.player1,
                player2:this.state.player2,
                userName:userName,
                winner:winner?userName:null
            };
            chessMove(params).then(res => {
                console.log(res)
            })
            // console.log(params)

            this.chessMoveAnimation(dragChess,chessInitPos,pos,()=>{
                // let bIsNext = this.state.bIsNext;
                // if(bIsNext){

                // }

                this.setState({
                    squares:squares,
                    bIsNext:!this.state.bIsNext,
                    winner:winner
                })

            })

        }

        this.dragChessInitialPos = [-1,-1];
        this.dropSquareDropEffect = "none";
        this.posChessCanDrop = [];
    }

    public chessOnTouchEnd = (ev:React.TouchEvent)=> {
        // ev.preventDefault()
        let ele = document.elementFromPoint(ev.changedTouches[0].pageX,ev.changedTouches[0].pageY),
            x = ele?(ele as any).dataset.col:null,
            y =  ele?(ele as any).dataset.line:null,
            idx = this.posChessCanDrop.indexOf(y+x),
            pos = [parseInt(y),parseInt(x)];
            
        console.log(idx)
        const board = document.getElementById("chinese-chess-board") as HTMLElement;
        if(this.dragChessCopy){
            board.removeChild(this.dragChessCopy)
            this.dragChessCopy = null;

            // this.dropSquareDropEffect = "none";
            this.posChessCanDrop = [];
        }
        if(idx<0){
            this.dragChessDom.style.visibility = "visible";
           
            return 
        };//判断是否可移动

        const chessInitPos:number[] = this.dragChessInitialPos;
        const dragChess:HTMLElement= this.dragChessDom;
        // const parent:HTMLElement = dragChess.parentElement as HTMLElement;

        const squares:any[10][9] = multidimensionArrayDeepCopy(this.state.squares);
        const chessInfo:number = squares[chessInitPos[0]][chessInitPos[1]];
        squares[chessInitPos[0]][chessInitPos[1]] = 0;
        const tarPosChess:number = squares[pos[0]][pos[1]];
        const enemyBoss = this.state.selfSide===2?16:26;
        const winSide = this.state.selfSide===2?"黑方":"红方";
        squares[pos[0]][pos[1]] = chessInfo;

        const winner:string|null = tarPosChess===enemyBoss?winSide:null;

        const {userName} = this.props as any;
        let params = {
            chessInitPos,
            pos,
            id:dragChess.id,
            squares:JSON.stringify({data:squares}),
            gameId:this.state.gameId,
            player1:this.state.player1,
            player2:this.state.player2,
            userName:userName,
            winner:winner?userName:null
        };
        chessMove(params).then(res => {
            console.log(res)
        })
        this.setState({
            squares:squares,
            bIsNext:!this.state.bIsNext,
            winner:winner
        })
        this.dragChessInitialPos = [-1,-1];

    }

    /**
     * @param chessInitPos 移动棋子的初始位置
     * @param pos 移动棋子的目标位置
     * @param id 移动棋子的id
     */
    public rivalMove =(chessInitPos:number[],pos:number[],id:string) => {
        const dragChess:HTMLElement|null= document.getElementById(id);
        const squares:any[10][9] = multidimensionArrayDeepCopy(this.state.squares);
        const chessInfo:number = squares[chessInitPos[0]][chessInitPos[1]];
        squares[chessInitPos[0]][chessInitPos[1]] = 0;
        const tarPosChess:number = squares[pos[0]][pos[1]];
        const selfBoss = this.state.selfSide===1?16:26;
        const enemySide = this.state.selfSide===1?"黑方":"红方";
        squares[pos[0]][pos[1]] = chessInfo;


        const winner:string|null = tarPosChess===selfBoss?enemySide:null;


        this.chessMoveAnimation(dragChess as HTMLElement,chessInitPos,pos,()=>{
            this.setState({
                squares:squares,
                bIsNext:true,
                winner:winner
            })
        })

    }

    public chessMoveAnimation = (chessDom:HTMLElement,beginPos:number[],endPos:number[],callback:Function) => {
        const blockWidth = this.state.blockWidth;
        const sideHeight = this.state.sideHeight;
        const sideWidth = this.state.sideWidth;
        const selfSide = this.state.selfSide;

        let clone: HTMLElement= chessDom.cloneNode(true) as HTMLElement;
        chessDom.style.visibility = "hidden";
        // clone.classList.add("onmove");
        clone.style.position = "absolute";
        /* 因各方位置都显示在棋盘下方 （默认黑上红下），黑色方和红色方根据css布局方式不同采用不同的位置策略*/
        if(selfSide===2){
            clone.style.left = sideWidth-blockWidth*(beginPos[1]+1)+"px";
            clone.style.top =sideHeight-blockWidth*(beginPos[0]+1)+"px";
        }else{
            clone.style.left = blockWidth*(beginPos[1]+1)+"px";
            clone.style.top = blockWidth*(beginPos[0]+1)+"px";
        }
      
        clone.style.transform = "translate(-50%,-50%)";
        clone.style.zIndex = "3"
        const board = document.getElementById("chinese-chess-board") as HTMLElement;
        board.appendChild(clone);

        setTimeout(()=>{
            clone.style.transition = "all 0.3s";
            clone.style.transform = "translate(-50%,-50%) scale(1.2)";

            setTimeout(()=>{
                clone.style.transition = "all 1s";

                if(selfSide===2){
                    clone.style.left = sideWidth-blockWidth*(endPos[1]+1)+"px";
                    clone.style.top =sideHeight-blockWidth*(endPos[0]+1)+"px";
                    
                }else{
                    clone.style.left = blockWidth*(endPos[1]+1)+"px";
                    clone.style.top = blockWidth*(endPos[0]+1)+"px";
                }

                
                // clone.style.left = sideWidth-blockWidth*(endPos[1]+1)+"px";
                // clone.style.top =sideHeight-blockWidth*(endPos[0]+1)+"px";

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
        const side = this.state.selfSide;
        return side === Math.floor(chessInfo/10);
    }

    public isEnemy = (chessInfo:number):boolean => {
        const side = this.state.selfSide;
        const chessType = Math.floor(chessInfo/10);
        return chessType!==0&&side!==chessType
    }

    public getPosChessCanDrop(bp:number[],chessType:number):string[]{
        // if(bp.join("")===ep.join("")){return []}
        const dragChessType:number = chessType%10;//棋子类型
        const dragChessSide:number = Math.floor(chessType/10);//棋子方,黑方:2 红方：1
      
        console.log(bp)

        const squares:[][] = this.state.squares;

        switch(dragChessType){
            //兵、卒
            case 0:
                return (()=>{
                    let md =  dragChessSide===1?-1:1,//移动方向，即红方line值只能减，黑方只能增
                        posAllowed:string[]= [],
                        line:number = bp[0],
                        col:number = bp[1],
                        arr:number[][]= [[bp[0],bp[1]-1],[bp[0],bp[1]+1],[bp[0]+md,bp[1]]];
                    // 未过河
                    if((md===-1&&line>4)||(md===1&&line<5)){
                        arr = [[line+md,col]]
                    }
                    arr.forEach((item)=>{
                        if(squares[item[0]]&&(squares[item[0]][item[1]]===0||squares[item[0]][item[1]])){
                            let chessOnRoute:number = squares[item[0]][item[1]];
                            if(!this.oneOfUs(chessOnRoute)){
                                posAllowed.push([item[0],item[1]].join(""))
                            }
                        }
                    })
                    return posAllowed
                })()
            // 炮
            case 1:
                return (()=>{
                    let posAllowed:string[]= [],
                        line:number = bp[0],
                        col:number = bp[1],
                        chessCountOnRoute:number = 0;
                    // 棋子右侧路线
                    for(let i=col+1;i<9;i++){
                        let chessOnRoute:number = squares[line][i];
                        // 目标处无棋子且路线上无棋子，或目标区域为敌方棋子且路线上有一个棋子，两种情况棋子可以移动
                        if((chessOnRoute===0&&chessCountOnRoute===0)){
                            posAllowed.push([line,i].join(""));
                            continue;
                        }
                        if(this.isEnemy(chessOnRoute)&&chessCountOnRoute===1){
                            console.log()
                            posAllowed.push([line,i].join(""));
                            break;
                        }
                        if(chessOnRoute!==0){
                            console.log(chessOnRoute)
                            chessCountOnRoute++;
                        }
                    }
                    chessCountOnRoute=0;
                    // 棋子左侧路线
                    for(let i=col-1;i>=0;i--){
                        let chessOnRoute:number = squares[line][i];
                        if(chessOnRoute===0&&chessCountOnRoute===0){
                            posAllowed.push([line,i].join(""));
                            continue;
                        }
                        if(this.isEnemy(chessOnRoute)&&chessCountOnRoute===1){
                            posAllowed.push([line,i].join(""));
                            break;
                        }
                        if(chessOnRoute!==0){
                            chessCountOnRoute++;
                        }
                    }
                    chessCountOnRoute=0;
                    // 棋子上方路线
                    for(let i=line-1;i>=0;i--){
                        let chessOnRoute:number = squares[i][col];
                        if(chessOnRoute===0&&chessCountOnRoute===0){
                            posAllowed.push([i,col].join(""));
                            continue;
                        }
                        if(this.isEnemy(chessOnRoute)&&chessCountOnRoute===1){
                            posAllowed.push([i,col].join(""));
                            break;
                        }
                        if(chessOnRoute!==0){
                            chessCountOnRoute++;
                        }
                    }
                    chessCountOnRoute=0;
                    // 棋子下方路线
                    for(let i=line+1;i<10;i++){
                        let chessOnRoute:number = squares[i][col];
                        if(chessOnRoute===0&&chessCountOnRoute===0){
                            posAllowed.push([i,col].join(""));
                            continue;
                        }
                        if(this.isEnemy(chessOnRoute)&&chessCountOnRoute===1){
                            posAllowed.push([i,col].join(""));
                            break;
                        }
                        if(chessOnRoute!==0){
                            chessCountOnRoute++;
                        }
                    }
                    chessCountOnRoute=0;
                    // console.log(posAllowed)
                    return posAllowed
                    // return false
                })()
            // 車
            case 2:
                return (()=>{
                    let posAllowed:string[] = [],
                        line:number = bp[0],
                        col:number = bp[1];
                    for(let i=col+1;i<9;i++){
                        let chessOnRoute:number = squares[line][i];
                        if(chessOnRoute===0){
                            posAllowed.push([line,i].join(""));
                            continue;
                        }else if(this.isEnemy(chessOnRoute)){
                            posAllowed.push([line,i].join(""));
                            break;
                        }else{
                            break;
                        }
                    }
                    for(let i=col-1;i>=0;i--){
                        let chessOnRoute:number = squares[line][i];
                        if(chessOnRoute===0){
                            posAllowed.push([line,i].join(""));
                            continue;
                        }else if(this.isEnemy(chessOnRoute)){
                            posAllowed.push([line,i].join(""));
                            break;
                        }else{
                            break;
                        }
                    }
                    for(let i=line+1;i<10;i++){
                        let chessOnRoute:number = squares[i][col];
                        if(chessOnRoute===0){
                            posAllowed.push([i,col].join(""));
                            continue;
                        }else if(this.isEnemy(chessOnRoute)){
                            posAllowed.push([i,col].join(""));
                            break;
                        }else{
                            break;
                        }
                    }
                    for(let i=line-1;i>=0;i--){
                        let chessOnRoute:number = squares[i][col];
                        if(chessOnRoute===0){
                            posAllowed.push([i,col].join(""));
                            continue;
                        }else if(this.isEnemy(chessOnRoute)){
                            posAllowed.push([i,col].join(""));
                            break;
                        }else{
                            break;
                        }
                    }
                    console.log(posAllowed)
                    return posAllowed
                })()
            // 馬
            case 3:
                return (()=>{
                    let posAllowed:string[] = [],
                        line:number = bp[0],
                        col:number = bp[1],
                        arr:number[][] = [[line,col-1],[line,col+1],[line-1,col],[line+1,col]],//棋子上下左右四个位置
                        tarPos:number[][] = [];//不存在憋马脚情况的日字位置
                        
                    arr.forEach((item)=>{
                        // 如果马四周不存在棋子，即不存在憋马脚的情况
                        if(squares[item[0]]&&squares[item[0]][item[1]]===0){
                            if(item[1]===col){
                                tarPos.push([line+(item[0]-line)*2,col-1]);
                                tarPos.push([line+(item[0]-line)*2,col+1]);
                            }else{
                                tarPos.push([line-1,col+(item[1]-col)*2]);
                                tarPos.push([line+1,col+(item[1]-col)*2]);
                            }
                        }
                    })
                    console.log(tarPos)
                    tarPos.forEach((item) => {
                        if(squares[item[0]]&&(squares[item[0]][item[1]]===0||squares[item[0]][item[1]])){
                            let chessOnRoute:number = squares[item[0]][item[1]];
                            if(!this.oneOfUs(chessOnRoute)){
                                posAllowed.push([item[0],item[1]].join(""))
                            }
                        }
                    })
                    
                    return posAllowed
                })()
            // 象
            case 4:
                return (()=>{
                    let posAllowed:string[] = [],
                        line:number = bp[0],
                        col:number = bp[1],
                        arr:string[]= ["02","20","24","06","28","42","46","92","96","70","74","78","52","58"],
                        tarPos:string[] = [[line-2,col+2].join(""),[line-2,col-2].join(""),[line+2,col+2].join(""),[line+2,col-2].join("")];
                    tarPos.forEach(item => {
                        let tarLine:number = parseInt(item[0]),
                            tarCol:number = parseInt(item[1]);
                        // 目标位置为象允许走的位置
                        if(arr.indexOf(item)>=0&&!this.oneOfUs(squares[tarLine][tarCol])){
                            if(squares[(tarLine+line)/2][(tarCol+col)/2]===0){
                                posAllowed.push(item) 
                            }
                        }
                    })
                    return posAllowed
                })()
            // 士
            case 5:
                return (() => {
                    let posAllowed:string[] = [],
                        line:number = bp[0],
                        col:number = bp[1],
                        arr:string[] = ["03","05","14","23","25","93","95","84","73","75"],
                        tarPos:string[] = [[line+1,col+1].join(""),[line+1,col-1].join(""),[line-1,col-1].join(""),[line-1,col+1].join("")];
                    tarPos.forEach(item=>{
                        let tarLine:number = parseInt(item[0]),
                            tarCol:number = parseInt(item[1]);
                        if(arr.indexOf(item)>=0&&!this.oneOfUs(squares[tarLine][tarCol])){
                            posAllowed.push(item)
                        }
                    })
                    return posAllowed;
                })()
            // 帥、将
            case 6:
                return (()=>{
                    let posAllowed:string[] = [],
                        line:number = bp[0],
                        col:number = bp[1],
                        arr:string[] = ["03","04","05","13","14","15","23","24","25","93","94","95","83","84","85","73","74","75"],
                        tarPos:string[] = [[line-1,col].join(""),[line+1,col].join(""),[line,col+1].join(""),[line,col-1].join("")];
                    tarPos.forEach(item=>{
                        let tarLine:number = parseInt(item[0]),
                            tarCol:number = parseInt(item[1]);
                        if(arr.indexOf(item)>=0&&!this.oneOfUs(squares[tarLine][tarCol])){
                            let md = dragChessSide===1?-1:1,
                                emenyBoss = dragChessSide===1?"26":"16",
                                allow:boolean = true;
                            for(let i=tarLine+md;i<10&&i>=0;i+=md){
                                let chessOnRoute:number = squares[i][tarCol];
                                console.log(chessOnRoute)
                                if(chessOnRoute!==0){
                                    allow = chessOnRoute.toString()===emenyBoss?false:true;
                                    break;
                                }
                            }
                            if(allow){
                                posAllowed.push(item)
                            }
                        }
                    })
                    return posAllowed;
                })()
            default:
                break;
        }

        return [];
    }
}

const mapStateToProps = (state: IStoreState) => {
    return {
        userName: state.user.uName,
        token: state.user.token,
        status:state.user.status,
        socket: state.socket,
        cWidth: state.page.cWidth,
        cHeight:state.page.cHeight,
        gameId:state.game.gameId
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => {

    return {

        resizePage:() => {
            dispatch({
                type:"SIZECHANGE"
            })
        }
        // setUserList:(data:USER[]) => {
        //     dispatch({
        //         type: "SETLIST",
        //         data: data
        //     })
        // }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Game);
