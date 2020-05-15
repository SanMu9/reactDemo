import * as React from 'react'

interface IProps {
  color?: string,
  size?: string,
}
interface IState {
  count: number,
  name?:string,
  hobby?:string[]
}
class App extends React.Component<IProps, IState> {
  // readonly state = {count:0} as IState;//类型断言

  readonly state:IState = {count:0};


  public countAdd():void{
    console.log(this.state)
    this.setState({
      count:this.state.count+1
    })
  }

  public render () {
    return (
      <div>
        {this.state.count}
        <br/>
        {/* {this.state.name} */}
        <button style={{width:"120px",height:"45px"}} onClick={()=>this.countAdd()}>ADD</button>
      </div>
    )
  }
}

export default App
