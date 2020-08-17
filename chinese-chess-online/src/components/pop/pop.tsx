import React from 'react';
import './pop.css';

interface PopProps {
    msg:String,
    acceptFuc:Function,
    refuseFuc:Function
}

class Pop extends React.Component <PopProps,{}> {
    public render() {
        const {msg} = this.props
        return (
            <div className="pop-container">
                <div>
                    <p>{msg}</p>
                    <div className="btn-group">
                        <span onClick={()=>this.props.acceptFuc()}>接受</span>
                        <span onClick={()=>this.props.refuseFuc()}>拒绝</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pop