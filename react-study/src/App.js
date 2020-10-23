import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

const Hook = lazy(() => import("./components/Hook"));
// const Error = lazy(() => import("./components/Error"));
const Nav = lazy(()=>import("./pages/nav/Nav"))
const UseCallback = lazy(() => import("./components/UseCallback"));



function App() {
  console.log('app')
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Switch只渲染出第一个与当前访问地址匹配的 <Route> 若没有匹配则渲染 <Redirect>*/}
        <Switch>
          <Route exact path="/" render={()=>(<Redirect to='/Nav'></Redirect>)}/>
          
           {/* 这里不能加exact，会导致子路由匹配不到 */}
          <Route path="/Nav" component={Nav} />
          
          <Route path="/hook" component={Hook} />
          <Route path="/usecallback" component={UseCallback} />
          
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
