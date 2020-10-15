import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { lazy,Suspense } from 'react';

const ImagePiexls = lazy(() => import("./views/imagePixels"))

function App() {
  return (
    <Router>
      <Suspense fallback={""}>
        <Switch>
          <Route exact path="/" component={ImagePiexls}></Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
