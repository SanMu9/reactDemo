import React, { useState } from 'react'

import {useEffect} from 'react'
import {Slider,InputNumber,Col,Row} from 'antd'
import './index.css'


function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


const canvasRef = React.createRef();
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


function CanvasPanel(props) {
    

    const [scale,setScale] = useState(0.75);
    const [painterSize,setPainterSize] = useState({width:'1920px',height:'1080px'});
 
    const painterStyle = {
        transform:'scale('+scale+')',
        width:painterSize.width,
        height:painterSize.height,
    };
    const {fileSelected} = props;

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

    // const 
    

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        console.log("SSSS")
        if(fileSelected){
            let imageUrl = getObjectURL(fileSelected);
            let img = document.createElement('img');

            

            img.src = imageUrl;
            img.onload = () =>{
                canvas.width = img.width;
                canvas.height = img.height;
                setPainterSize({width:img.width+'px',height:img.height+'px'});
                ctx.drawImage(img,0,0)
            }

        }

    },[fileSelected])


    return (
        <div style={style.container}>
            <div className="painter-container">
                <div className="painter-box" style={painterStyle}>
                    <canvas ref={canvasRef}></canvas>
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

export default CanvasPanel