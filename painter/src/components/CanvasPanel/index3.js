import React, { useState,useEffect} from 'react'

const style = {
    container:{
        width:'100%',
        height:'100%',
        overflow:'hidden',
        position:'relative',
        boxSizing:"border-box",
    }
};

function CanvasPanel(props) {
    const {fileSelected,removedId} = props;

    useEffect(()=>{

    },[fileSelected])

    return (
        <div style={style.container}>
            <div className="painter-container"></div>
        </div>
    )
}