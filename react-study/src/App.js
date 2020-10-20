import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

const Hook = lazy(() => import("./components/Hook"));
const Error = lazy(() => import("./components/Error"));
const Nav = lazy(()=>import("./components/Nav"))
const UseCallback = lazy(() => import("./components/UseCallback"));



function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Nav} />
          <Route path="/hook" component={Hook} />
          <Route path="/usecallback" component={UseCallback} />

        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
