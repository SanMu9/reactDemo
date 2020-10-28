import React, { useState } from 'react'

import {useEffect} from 'react'
import {Slider,InputNumber,Col,Row} from 'antd'
import './index.css'


function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL !== undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


const canvasRef = React.createRef();
const containerRef = React.createRef();
const boxVisbleRef = React.createRef();
const painterBoxRef = React.createRef();
const style = {
    container:{
        width:'100%',
        height:'100%',
        overflow:'hidden',
        position:'relative',
        boxSizing:"border-box",
        padding:"0 0 60px 0"
    }
};
const defaultScale = 16;
const scaleIdx = [0.1,0.25,0.5,0.75,1,2,4,8,16,32];
const maxScaleVal = scaleIdx.length-1;

const sliderMarks = {
    0:0.1,
    1:0.25,
    2:0.5,
    3:0.75,
    4:1,
    5:2,
    6:4,
    7:8,
    8:16,
    9:32
};
const imageScaleData = {};
var imageData = null;
var imageSelected = null;


function CanvasPanel(props) {
    
    const {fileSelected,removedId} = props;
    // var scale = defaultScale;
    const [scale,setScale] = useState(defaultScale);
    const [containerSize,setContainerSize] = useState({width:'100%',height:'100%'})
    // const [painterSize,setPainterSize] = useState({width:'1200px',height:'675px'});
 
    // const painterStyle = {
    //     // transform:'scale('+scale+')',
    //     display:fileSelected?"block":"none",
    //     // zoom:scale,
    //     // width:painterSize.width,
    //     // height:painterSize.height,
    // };
    const canvasStyle = {
        display:fileSelected?"block":"none",
    };
    const containerStyle = {
        width:containerSize.width,
        height:containerSize.height,
    }

    const sliderProps = {
        min:0,
        max:maxScaleVal,
        // max:maxScaleVal,
        // step:0.01,
        value:scaleIdx.indexOf(scale),
        marks:sliderMarks,
        tooltipVisible:false,
        // tooltipVisible:true,
        onChange:(val) => {
            setScale(scaleIdx[val])
        }
    }
    // const InputNumberProps = {
    //     min:0,
    //     // max:maxScaleVal,
    //     value:scale,
    //     style:{
    //         margin:'0 10px'
    //     },
    //     onChange:(val) =>{
    //         setScale(scaleIdx[val])
    //     }
    // }

    const setWrapSize = () => {
        if(imageData){
            drawImageToCanvas();
        }

        const painter = canvasRef.current;
        const visibleBox = boxVisbleRef.current;
        const widthVisible = visibleBox.offsetWidth;
        const heightVisible = visibleBox.offsetHeight;

        const painterW = painter.width;
        const painterH = painter.height;

        setContainerSize({
            width:painterW>=widthVisible?(painterW + 400) +'px':'100%',
            height:painterH>=heightVisible?(painterH + 400) +'px':'100%'
        })
    }

    const drawImageToCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = imageSelected.width*scale;
        canvas.height = imageSelected.height*scale;
        console.log(canvas.width)

        if(scale<=1){
            // ctx.putImageData(imageData,0,0,0,0,canvas.width,canvas.height)
            ctx.drawImage(imageSelected,0,0,imageSelected.width,imageSelected.height,0,0,canvas.width,canvas.height)
        }else{

            if(imageScaleData[fileSelected.uid][scale]){
                console.log("aaa")
                ctx.putImageData(imageScaleData[fileSelected.uid][scale],0,0,0,0,canvas.width,canvas.height);
                
                return;
            }
            const {data,width} = imageData;
            let len = data.length,
                count = 0;
            // let scaleData = ctx.createImageData(canvas.width,canvas.height),
            //     cWidth = canvas.width*4;
            // ctx.clearRect(0,0,canvas.width,canvas.height);
            for(let i = 0;i<=len-4;i+=4){
                // let x = count%width+1,
                //     y = parseInt(count/width)+1;
                
                // for(let c1=0;c1<scale;c1++){
                //     for(let c2=0;c2<scale;c2++){
                //         let idx = (y-1)*cWidth*scale+c1*cWidth+(x-1)*scale*4+c2*4;
                //         scaleData.data[idx] = data[i];
                //         scaleData.data[idx+1] = data[i+1];
                //         scaleData.data[idx+2] = data[i+2];
                //         scaleData.data[idx+3] = data[i+3];
                //     }
                // }
                
                
                let x = (count%width)*scale,
                    y = parseInt(count/width)*scale;
                ctx.fillStyle = 'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]/255+')';
                ctx.fillRect(x,y,scale,scale)
                count++;
            }
            // imageScaleData[fileSelected.uid][scale] = scaleData;

            // ctx.putImageData(scaleData,0,0,0,0,canvas.width,canvas.height);
            // setImageScaleData(scaleIdx.indexOf(scale)+1);
            
        }
    }

    const setImageScaleData = (idx = scaleIdx.indexOf(2)) => {
        const scaleValue = scaleIdx[idx];
        const dataset = imageScaleData[fileSelected.uid];
        console.log(scaleValue)
        if(scaleValue||dataset[scaleValue]){
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            setTimeout(()=>{
                let scaleData = ctx.createImageData(imageData.width*scaleValue,imageData.height*scaleValue),
                    cWidth = imageData.width*scaleValue*4;
        
                const {data,width} = imageData;
                let len = data.length,
                    count = 0;

                for(let i = 0;i<=len-4;i+=4){
                    let x = count%width+1,
                        y = parseInt(count/width)+1;
                    
                    for(let c1=0;c1<scaleValue;c1++){
                        for(let c2=0;c2<scaleValue;c2++){
                            let idx = (y-1)*cWidth*scaleValue+c1*cWidth+(x-1)*scaleValue*4+c2*4;
                            scaleData.data[idx] = data[i];
                            scaleData.data[idx+1] = data[i+1];
                            scaleData.data[idx+2] = data[i+2];
                            scaleData.data[idx+3] = data[i+3];
                        }
                    }
                    count++;
                }
                imageScaleData[fileSelected.uid][scaleValue] = scaleData;
                setImageScaleData(idx+1);
                // for()
            },1)
        }
        console.log(imageScaleData)
        return;
        
    }
  
    console.log("render")
    // const 
    

    useEffect(() => {
        console.log('fileSelected changed')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if(fileSelected){
            imageScaleData[fileSelected.uid] = {};
            let imageUrl = getObjectURL(fileSelected);
            let img = document.createElement('img');
            
            let cav = document.createElement('canvas');
            let ctx2 = cav.getContext('2d');

            img.src = imageUrl;
            img.onload = () =>{
                // canvas.width = img.width*scale;
                // canvas.height = img.height*scale;

                cav.width = img.width;
                cav.height = img.height;

                ctx2.drawImage(img,0,0);

                imageData = ctx2.getImageData(0,0,cav.width,cav.height);
                imageSelected = img;

                // setPainterSize({width:img.width*scale+'px',height:img.height*scale+'px'});
                // ctx.drawImage(img,0,0);

                const visibleBox = boxVisbleRef.current;
                const widthVisible = visibleBox.offsetWidth;
                const heightVisible = visibleBox.offsetHeight;

                setContainerSize({
                    width:img.width*scale>widthVisible?(img.width*scale + 400) +'px':'100%',
                    height:img.height*scale>heightVisible?(img.height*scale + 400) + 'px':"100%"
                })
                drawImageToCanvas();
                // setImageScaleData();

            }

        }

    },[fileSelected])

    useEffect(()=>{
        console.log('scale changed')
        setWrapSize()
    },[scale])


    useEffect(()=>{
        // 容器大小变化，设置滚动条位置
        console.log('containerSize changed')
        const container =containerRef.current;
        const visibleBox = boxVisbleRef.current;
        const widthVisible = visibleBox.offsetWidth;
        const heightVisible = visibleBox.offsetHeight;

        const {offsetWidth,offsetHeight} = container;
        if(offsetWidth>widthVisible){
            visibleBox.scrollLeft = offsetWidth/2-widthVisible/2;
        }
        if(offsetHeight>heightVisible){
            visibleBox.scrollTop = offsetHeight/2-heightVisible/2;
        }
    
    },[containerSize])

    useEffect(()=>{
        console.log("remove,id="+removedId)
        delete imageScaleData[removedId]
    },[removedId])


    return (
        <div style={style.container}>
            <div className="box-visible" ref={boxVisbleRef}>

                <div className="painter-container" ref={containerRef} style={containerStyle}>
                    {/* <div className="painter-box" ref={painterBoxRef} style={painterStyle}> */}
                        <canvas ref={canvasRef} style={canvasStyle}></canvas>
                    {/* </div> */}

                </div>
            </div>
            
            
            <div className="slider-box">
                <Row>
                    <Col span={20}>
                        <Slider {...sliderProps}></Slider>
                    </Col>
                    {/* <Col span={4}>
                        <InputNumber {...InputNumberProps}></InputNumber>
                    </Col> */}
                </Row>
            </div>
        </div>
    )
}

export default CanvasPanel