
import React from 'react'

const Pixel = (props) => {
    const {x,y,bgColor} = props;
    const style = {
        width:'1px',
        height:'1px',
        display:'block',
        backgroundColor:bgColor
    }
    return (
        <span className='pixel-item' data-x={x} data-y={y} style={style}></span>
    )
}

export const PixelRow = (props) => {
    const {pixels} = props;
    return (
        <div className="pixels-row">
            {pixels}
        </div>
    )
}

export default Pixel;