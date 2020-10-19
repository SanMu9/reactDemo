
import React from 'react'

const Pixel = (props) => {
    const {x,y,scale,bgColor} = props;
    const style = {
        width:scale + 'px',
        height:scale + 'px',
        backgroundColor:bgColor
    }
    return (
        <div className='pixel-item' data-x={x} data-y={y} style={style}></div>
    )
}

export default Pixel;