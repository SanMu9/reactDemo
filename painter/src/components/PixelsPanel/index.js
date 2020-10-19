import React, { useState } from 'react'

import {useEffect} from 'react'
import {Slider,InputNumber,Col,Row} from 'antd'
import './index.css'

import Piexl from './Pixel'


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
const maxScaleVal = 2;


function PixelsPanel(props) {
    
    const {fileSelected} = props;

    const [scale,setScale] = useState(0.75);
    const [pixels,setPixels] = useState({data:[],width:1,height:1})
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

    const pixelDoms = pixels.data.map((item,index) => {
        let x = index%pixels.width+1,
            y = parseInt(index/pixels.width)+1;
        let props = {
            x,
            y,
            scale,
            bgColor:item
        };
        return  (
            <Piexl key={'x'+x+'y'+y} {...props}></Piexl>
        )
    })
    console.log(pixelDoms)
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

                
                let pixelsColors = [],
                    data = imageData.data,
                    len = data.length;
                    
                for(let i=0;i<len;i+=4){
                    pixelsColors.push('rgba('+data[i]+','+data[i+1]+','+data[i+2]+','+data[i+3]/255+')')
                }
                console.log(pixelsColors)

                setContainerSize({
                    width:img.width*scale>widthVisible?(img.width*scale + 400) +'px':'100%',
                    height:img.height*scale>heightVisible?(img.height + 400) + 'px':"100%"
                })
                setPixels({data:pixelsColors,width:imageData.width,height:imageData.height})

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
                        {pixelDoms}
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