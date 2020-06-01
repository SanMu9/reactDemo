import React from 'react';
import { connect } from 'react-redux'
import './App.css';


class App extends React.Component {
    render() {

        return (
            <div className="app"></div>
        )
    }
}
// App.contextTypes = {
//     store: React.PropTypes.object
// }
const mapStateToProps = (state:any)=> {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(App);