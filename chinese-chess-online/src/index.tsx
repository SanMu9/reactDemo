import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index';

import App from './App';
import Rooms from './pages/rooms/index';
import Home from './pages/home/index';

const store = createStore(reducers);
console.log(store.getState())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App></App>
      {/* <Router>
        <Route exact path="/" component={App} />
        <Route path="/rooms" component={Rooms} />
      </Router> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
