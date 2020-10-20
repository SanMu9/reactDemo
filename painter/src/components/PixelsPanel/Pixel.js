
import React from 'react'

const Pixel = (props) => {
    const {x,y,bgColor} = props;
    const style = {
        width:'1px',
        height:'1px',
        backgroundColor:bgColor
    }
    return (
        <div className='pixel-item' data-x={x} data-y={y} style={style}></div>
    )
}

export default Pixel;