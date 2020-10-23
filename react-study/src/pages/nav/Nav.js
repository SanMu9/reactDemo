import React from 'react';
// import { useHistory } from "react-router-dom";
// const style = require('./Nav.css')
// console.log(style)
import styles from './Nav.module.css';
import {BrowserRouter as Router, Redirect,Route,Link,useHistory} from 'react-router-dom';

import ChildI from './ChildI'
import ChildII from './/ChildII'

const Nav = () => {
    console.log(styles.main)
    // const history = useHistory();
    // console.log(history)

    return (

        // 在使用React菜单组件，点击跳转不显示子路由，直接跳到空白页面
        // 在子路由的上一级路由里，不能使用exact
        // 会导致父级路由路径不匹配从而父子组件都显示不了

        // baseBane设置基准URL
        <Router basename="Nav">

            <div className={styles.container}>
                <aside className={styles.side}>
                    <Link to='/ChildI'>ChildI</Link>
                    <Link to='/ChildII'>ChildII</Link>

                    {/* <div data-route="ChildI" onClick={() => history.push('/Nav/ChildI')}>ChildI</div>
                    <div data-route="ChildII" onClick={() => history.push('/Nav/ChildII')}>ChildII</div> */}

                </aside>
                <main className={[styles.main,'main-box'].join(' ')}>
                        <Route exact path="/" render={()=> <Redirect  to='/ChildI'></Redirect>}></Route>
                        <Route path="/ChildI" component={ChildI}></Route>
                        <Route path="/ChildII" component={ChildII}></Route>
                    
                </main>
            </div>
        </Router>

    )

  

}
export default Nav