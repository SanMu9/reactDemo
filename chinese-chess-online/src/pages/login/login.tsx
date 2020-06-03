import React from 'react';
import {connect} from 'react-redux';
import {register} from './../../api/api';
import './login.css';
import {USER} from './../../entity/index';
import { Dispatch } from 'redux';


function registerSuccess(data:USER){
    return {
        type:"USERADD",
        data
    }
}

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        saveToken:(data:USER)=>{
            dispatch(registerSuccess(data))
        }
    }
}

class Login extends React.Component{

    static defaultProps = {

    }

    readonly state = {
        login:true,
        userName:"",
        pw:"",
        pw2:"",
        info:""
    }


    public render(){
        const {login,userName,pw,pw2,info} = this.state;
        return login?
            (
                <div className="login">
                    <div>
                        <label htmlFor="username">用户名：</label>
                        <input type="text" id="username" value={userName} onChange={(ev:React.ChangeEvent)=>this.changeValue(ev,"userName")}/>
                    </div>
                    <div>
                        <label htmlFor="password">密码：</label>
                        <input type="password" id="password" value={pw} onChange={(ev:React.ChangeEvent)=>this.changeValue(ev,"pw")}/>
                    </div>
                    <div>
                        <button onClick={() => this.toRegister()}>注册</button>
                        <button>确认</button>
                    </div>
                   
                </div>
            ):(
                <div className="login">
                    <div>
                        <label htmlFor="username">用户名：</label>
                        <input type="text" id="username" value={userName} onChange={(ev:React.ChangeEvent)=>this.changeValue(ev,"userName")}/>
                    </div>
                    <div>
                        <label htmlFor="password">密码：</label>
                        <input type="password" id="password" value={pw} onChange={(ev:React.ChangeEvent)=>this.changeValue(ev,"pw")}/>
                    </div>
                    <div>
                        <label htmlFor="password2">再次输入：</label>
                        <input type="password" id="password2" value={pw2} onChange={(ev:React.ChangeEvent)=>this.changeValue(ev,"pw2")}/>
                    </div>
                    <p>{info}</p>
                    <button onClick={() => this.sendRegisterInfo()}>确认</button>
                </div>
            )
    }

    public toRegister(){
        this.setState({
            login:false,
            userName:"",
            pw:"",
            pw2:""
        })
    }

    public changeValue(ev:React.ChangeEvent,key:string){
        let value = (ev.target as HTMLInputElement).value;
        this.setState({
            [key]:value
        })
    }


    public sendRegisterInfo(){
        const _this = this;
        const {userName,pw,pw2} = this.state;
        const {history} = this.props as any;
        const {saveToken} = this.props as any;
        console.log(saveToken);
        if(pw != pw2){
            this.setState({
                info:"两次密码不一致"
            })
            setTimeout(()=>{
                this.setState({
                    info:""
                })
            },2000)
        }else{
            register({userName:userName,pw:pw}).then((res)=>{
                if((res as any).status===200){
                    let result = res.data;
                    if(result.code===200){
                        localStorage.setItem("chineseCheseUName",userName);
                        localStorage.setItem("chineseCheseToken",result.token);
                        saveToken({uName:userName,token:result.token});
                        history.push("/")
                    }
                }
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}

// const mapStateToProps = (state:any) => {
//     return {
//         user:state.user
//     }
// }


export default connect(null,mapDispatchToProps)(Login)