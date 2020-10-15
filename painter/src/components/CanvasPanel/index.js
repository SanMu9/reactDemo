import React from 'react'

import {useEffect} from 'react'

function CanvasPanel(props) {
    const canvasRef = React.createRef();
 
    useEffect(() => {
        console.log(props)
        console.log(canvasRef)
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    })

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default CanvasPanel