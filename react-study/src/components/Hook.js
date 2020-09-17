import React from 'react'
import {useState,useEffect,useRef} from 'react'

const friendList = [
    {id:1,name:'wang'},
    {id:2,name:'kai'},
    {id:3,name:'sen'},
];
const onlineStatus = {
    1:1,
    2:0,
    3:0
}

function useFriendStatus(id){
    const [isOnline,setIsOnline] = useState(null);
    useEffect(() => {
        console.log(isOnline)
        setIsOnline(onlineStatus[id])
    },[id])

    return isOnline;
}



function About(){
    const [selectID,setSelectID] = useState(1);
    const isOnline = useFriendStatus(selectID);
    const styles = {
        status:{
            width:'10px',
            height:'10px',
            borderRadius:'50%',
            display:'inline-block',
            backgroundColor:isOnline?'green':'red'
        }
    }

    const [count,setCount] = useState(0);

    const countRef = useRef();
    useEffect(()=> {
        countRef.current = count;
    },[count])

    function handleAlertClick() {
        setTimeout(() => {
            alert('You clicked on:' + count +'\n' + 'newest Count is:' + countRef.current)
        },3000)
    }
    // useEffect(() => {
    //     const id = setInterval(() => {
    // //c 为最新count值
    //         setCount(c => c+1)
    //     },1000)
    //     return () => clearInterval(id);
    // },[])

    return (
        <div>
            <span>状态：</span>
            <span style={styles.status}></span>
            <br/>
            <select value={selectID} onChange={e => {setSelectID(e.target.value)}}>
                {friendList.map(item => {
                    return (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    )
                })}
            </select>
            <br/>
            <p>You Clicked {count} times</p>
            <button onClick={()=>setCount(count+1)}>Click Me</button>
            <button onClick={handleAlertClick}>
                Show alert
            </button>
            <br/>
            {/* <h1></h1> */}
        </div>
    )
}

export default About;
