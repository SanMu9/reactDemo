import React from 'react';
// import { useHistory } from "react-router-dom";
// const style = require('./Nav.css')
// console.log(style)
import styles from './Nav.module.css';

const Nav = () => {
    console.log(styles.main)
    return (
        <div className={styles.container}>
            <aside className={styles.side}>KKK</aside>
            <main className={[styles.main,'main-box'].join(' ')}></main>
        </div>
    )

}
export default Nav