import React,{useState,useCallback} from 'react';

// import ReactDom from "react-dom";

function MeasureExample() {
    const [height,setHeight] = useState(0);

    const measuredRef = useCallback(node => {
        console.log(node)
        if(node !== null){
            setHeight(node.getBoundingClientRect().height);
        }
    },[]);

    console.log(measuredRef)

    return (
        <div>
            <h1 ref={measuredRef}>Hello,world</h1>
            <h2>The above header is {Math.round(height)}px tall</h2>
        </div>
    )
}

export default MeasureExample

// const rootElement = document.getElementById('root');
// ReactDom.render(<MeasureExample/>,rootElement);