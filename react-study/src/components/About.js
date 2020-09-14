import React from 'react'
import {useState,useEffect} from 'react'

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
    console.log(isOnline)
    useEffect(() => {
        setIsOnline(onlineStatus[id])
    },[id])

    return isOnline;
}



function About(){
    const [selectID,setSelectID] = useState(1);
    const isOnline = useFriendStatus(selectID);
    console.log("isOnline:"+isOnline)
    const styles = {
        status:{
            width:'10px',
            height:'10px',
            borderRadius:'50%',
            display:'inline-block',
            backgroundColor:isOnline?'green':'red'
        }
    }

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
        </div>
    )
}

export default About;
