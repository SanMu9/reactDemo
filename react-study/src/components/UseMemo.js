import React,{useState,useMemo} from 'react';
import { useCallback } from 'react';
// 把“创建”函数和依赖项数组作为参数传入 useMemo，
// 它仅会在某个依赖项改变时才重新计算 memoized 值。
// 这种优化有助于避免在每次渲染时都进行高开销的计算。

// useMemo和useCallback接收的参数都是一样，
// 都是在其依赖项发生变化后才执行，都是返回缓存的值，
// 区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数。

// useCallback(fn, deps) 相当于 useMemo(() => fn, deps)

// 父组件传递一个函数给子组件的时候，
// 由于父组件的更新会导致该函数重新生成从而传递给子组件的函数引用发生了变化，
// 这就会导致子组件也会更新，而很多时候子组件的更新是没必要的，
// 所以我们可以通过useCallback来缓存该函数，然后传递给子组件。


function Example(){
    const [count,setCount] = useState(0);
    const [val,setValue] = useState("哈哈哈");

    const getNumNormal = ()=>{
        console.log('normal')
        // 返回值设为函数以便使用console 来看是否重新计算
        return ()=>count
    }
    const getNumUseMemo = useMemo(() => {
        console.log('useMemo')
        return ()=>count
    },[count])

    const getNumUseCallback = useCallback(()=>{
        console.log('useCallback')
        return ()=>count
    },[count])


    return (
        <div>
            {/* 当 count 值变化时，都重新计算 */}
            {/* 当 val 值变化时，只有getNumNormal重新计算*/}
            <h4>Count：{getNumNormal()()}</h4>
            <h4>Memo Count：{getNumUseMemo()}</h4>
            <Child getNum={getNumUseCallback}></Child>

            <div>
                <button onClick={()=>setCount(count+1)}>+1</button>
                <input type="text" value={val} onChange={event => setValue(event.target.value)}/>
            </div>
        </div>
    )
}

// const Child = React.memo(function({getNum}){
//     return <h4>useCallback count：{getNum()()}</h4>
// })
const Child = React.memo(({getNum})=>{
    return <h4>useCallback count：{getNum()()}</h4>
})
export default Example