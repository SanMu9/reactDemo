import React, { useState } from 'react'

import {useEffect} from 'react'
import {Slider,InputNumber,Col,Row} from 'antd'
import './index.css'

import Piexl from './Pixel'
import {PixelRow} from './Pixel'


// 此组件使用dom渲染图片，图片分辨率不能过高，否则会导致浏览器崩溃

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


// const canvasRef = React.createRef();
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
const maxScaleVal = 32;


function PixelsPanel(props) {
    
    const {fileSelected} = props;

    const [scale,setScale] = useState(0.75);
    const [pixels,setPixels] = useState([])
    const [containerSize,setContainerSize] = useState({width:'100%',height:'100%'})
    const [painterSize,setPainterSize] = useState({width:'1200px',height:'675px'});
 
    const painterStyle = {
        transform:'scale('+scale+')',
        display:fileSelected?"block":"none",
        // zoom:scale,
        width:painterSize.width,
        height:painterSize.height,
    };
    const containerStyle = {
        width:containerSize.width,
        height:containerSize.height,
    }

    const sliderProps = {
        min:0,
        max:maxScaleVal,
        step:0.01,
        value:scale,
        // tooltipVisible:true,
        onChange:(val) => {
            setScale(val)
        }
    }
    const InputNumberProps = {
        min:0,
        max:maxScaleVal,
        value:scale,
        style:{
            margin:'0 10px'
        },
        onChange:(val) =>{
            setScale(val)
        }
    }

    const setWrapSize = () => {
        const painter = painterBoxRef.current;
        const visibleBox = boxVisbleRef.current;
        const widthVisible = visibleBox.offsetWidth;
        const heightVisible = visibleBox.offsetHeight;

        const painterW = painter.offsetWidth*scale;
        const painterH = painter.offsetHeight*scale;

        setContainerSize({
            width:painterW>=widthVisible?(painterW + 400) +'px':'100%',
            height:painterH>=heightVisible?(painterH + 400) +'px':'100%'
        })
    }
  
    console.log('render')

    useEffect(() => {
        console.log('fileSelected changed')
        // const canvas = canvasRef.current;
        // const ctx = canvas.getContext("2d");
        if(fileSelected){
            let imageUrl = getObjectURL(fileSelected);
            let img = document.createElement('img');

            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext("2d");

            img.src = imageUrl;
            img.onload = () =>{
                canvas.width = img.width;
                canvas.height = img.height;
                setPainterSize({width:img.width+'px',height:img.height+'px'});
                ctx.drawImage(img,0,0);
                let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
                console.log(imageData)


                const visibleBox = boxVisbleRef.current;
                const widthVisible = visibleBox.offsetWidth;
                const heightVisible = visibleBox.offsetHeight;

                let count = 0,
                    data = imageData.data,
                    width = imageData.width,
                    height = imageData.height,
                    len = data.length;
                // console.log(width,imageData.height)

                let pixelDoms = new Array(height).fill(null);
                pixelDoms = pixelDoms.map(()=>{
                    return new Array(0)
                })

                    
                for(let i=0;i<=len-4;i+=4){
                    let x = count%width+1,
                        y = parseInt(count/width)+1,
                        key = 'x'+x+'y'+y,
                        props = {
                            x,
                            y,
                            bgColor:'rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]/255+')'
                        }

                    pixelDoms[y-1].push(
                        (
                            <Piexl key={key} {...props}></Piexl>
                        )
                    )
                    // pixelDoms[y-1][x-1] = (
                    //     <Piexl key={key} {...props}></Piexl>
                    // )
                    count++;

                }
                pixelDoms = pixelDoms.map((item,idx)=>{
                    return (
                        <PixelRow key={'row'+(idx+1)} pixels={item}>
                        </PixelRow>
                    )
                })
                console.log(pixelDoms)


                setContainerSize({
                    width:img.width*scale>widthVisible?(img.width*scale + 400) +'px':'100%',
                    height:img.height*scale>heightVisible?(img.height + 400) + 'px':"100%"
                })

                
                setPixels(pixelDoms)

            }

        }

    },[fileSelected])

    useEffect(()=>{
        console.log('scale changed')
        setWrapSize()
    },[scale])

    useEffect(()=>{
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


    return (
        <div style={style.container}>
            <div className="box-visible" ref={boxVisbleRef}>

                <div className="painter-container" ref={containerRef} style={containerStyle}>
                    <div className="painter-box" ref={painterBoxRef} style={painterStyle}>
                        {/* <canvas ref={canvasRef}></canvas> */}
                        {pixels}
                    </div>

                </div>
            </div>
            
            
            <div className="slider-box">
                <Row>
                    <Col span={20}>
                        <Slider {...sliderProps}></Slider>

                    </Col>
                    <Col span={4}>
                        <InputNumber {...InputNumberProps}></InputNumber>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default PixelsPanel